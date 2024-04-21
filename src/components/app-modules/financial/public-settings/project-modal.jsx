import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Tabs, Button, Popconfirm } from "antd";
import { QuestionCircleOutlined as QuestionIcon } from "@ant-design/icons";
import Joi from "joi-browser";
import ModalWindow from "./../../../common/modal-window";
import Words from "../../../../resources/words";
import utils from "../../../../tools/utils";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
  handleError,
} from "../../../../tools/form-manager";
import InputItem from "./../../../form-controls/input-item";
import SwitchItem from "./../../../form-controls/switch-item";
import {
  useModalContext,
  useResetContext,
} from "./../../../contexts/modal-context";
import TafsilInfoViewer from "../../../common/tafsil-info-viewer";
import tafsilAccountService from "../../../../services/financial/accounts/tafsil-accounts-service";

const schema = {
  ProjectID: Joi.number().required(),
  Title: Joi.string()
    .min(2)
    .max(50)
    .required()
    .label(Words.title)
    .regex(utils.VALID_REGEX),
  IsActive: Joi.boolean(),
};

const initRecord = {
  ProjectID: 0,
  Title: "",
  IsActive: true,
};

const formRef = React.createRef();

const ProjectModal = ({
  isOpen,
  selectedObject,
  onOk,
  onCancel,
  onCreateTafsilAccount,
}) => {
  const [hasCreateTafsilAccountAccess, setHasCreateTafsilAccountAccess] =
    useState(false);

  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.Title = "";
    record.IsActive = true;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();
    setRecord(initRecord);
    initModal(formRef, selectedObject, setRecord);

    //------

    setProgress(true);
    try {
      const access_data = await tafsilAccountService.getTafsilAccountAccesses(
        "Projects"
      );

      const { HasCreateTafsilAccountAccess } = access_data;

      setHasCreateTafsilAccountAccess(HasCreateTafsilAccountAccess);
    } catch (ex) {
      handleError(ex);
    }
    setProgress(false);
  });

  const isEdit = selectedObject !== null;

  const handleCreateTafsilAccount = async () => {
    if (selectedObject.TafsilInfo.length === 0) {
      setProgress(true);

      try {
        await onCreateTafsilAccount();
      } catch (ex) {
        handleError(ex);
      }

      setProgress(false);
    }
  };

  const handleSubmit = async () => {
    saveModalChanges(
      formConfig,
      selectedObject,
      setProgress,
      onOk,
      clearRecord
    );
  };

  //------

  let items = [
    {
      label: Words.info,
      key: "info",
      children: (
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24}>
            <InputItem
              title={Words.title}
              fieldName="Title"
              required
              autoFocus
              maxLength={50}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24}>
            <SwitchItem
              title={Words.status}
              fieldName="IsActive"
              initialValue={true}
              checkedTitle={Words.active}
              unCheckedTitle={Words.inactive}
              formConfig={formConfig}
            />
          </Col>
        </Row>
      ),
    },
  ];

  if (selectedObject !== null) {
    const { TafsilInfo } = selectedObject;

    items = [
      ...items,
      {
        label: Words.tafsil_account,
        key: "tafsil-account",
        children: <TafsilInfoViewer tafsilInfo={TafsilInfo} />,
      },
    ];
  }

  const is_disabled = validateForm({ record, schema }) && true;

  const getFooterButtons = () => {
    let buttons = [
      <Button key="clear-button" onClick={clearRecord}>
        {Words.clear}
      </Button>,
      <Button
        key="submit-button"
        type="primary"
        onClick={handleSubmit}
        loading={progress}
        disabled={is_disabled}
      >
        {Words.submit}
      </Button>,
    ];

    if (
      selectedObject &&
      hasCreateTafsilAccountAccess &&
      selectedObject.TafsilInfo.length === 0
    ) {
      buttons = [
        <Popconfirm
          title={Words.questions.sure_to_create_tafsil_account}
          onConfirm={handleCreateTafsilAccount}
          okText={Words.yes}
          cancelText={Words.no}
          icon={<QuestionIcon style={{ color: "red" }} />}
          disabled={is_disabled}
        >
          <Button key="submit-button" type="primary" loading={progress}>
            {Words.create_tafsil_account}
          </Button>
        </Popconfirm>,
        ...buttons,
      ];
    }
    return buttons;
  };

  return (
    <ModalWindow
      isOpen={isOpen}
      isEdit={isEdit}
      disabled={is_disabled}
      footer={getFooterButtons()}
      onCancel={onCancel}
      width={650}
    >
      <Form ref={formRef} name="dataForm">
        <Tabs defaultActiveKey="1" type="card" items={items} />
      </Form>
    </ModalWindow>
  );
};

export default ProjectModal;
