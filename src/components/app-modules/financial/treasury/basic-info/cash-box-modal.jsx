import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Tabs, Button, Popconfirm } from "antd";
import { QuestionCircleOutlined as QuestionIcon } from "@ant-design/icons";
import Joi from "joi-browser";
import ModalWindow from "./../../../../common/modal-window";
import Words from "../../../../../resources/words";
import utils from "../../../../../tools/utils";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
  handleError,
} from "../../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "./../../../../contexts/modal-context";
import service from "../../../../../services/financial/treasury/basic-info/cash-boxes-service";
import tafsilAccountService from "../../../../../services/financial/accounts/tafsil-accounts-service";
import DropdownItem from "./../../../../form-controls/dropdown-item";
import InputItem from "../../../../form-controls/input-item";
import SwitchItem from "./../../../../form-controls/switch-item";
import TafsilInfoViewer from "./../../../../common/tafsil-info-viewer";

const schema = {
  CashBoxID: Joi.number().required(),
  Title: Joi.string()
    .min(2)
    .max(50)
    .required()
    .regex(utils.VALID_REGEX)
    .label(Words.title),
  Location: Joi.string()
    .min(2)
    .max(50)
    .allow("")
    .regex(utils.VALID_REGEX)
    .label(Words.location),
  CashierMemberID: Joi.number().min(1).required().label(Words.cashier),
  DetailsText: Joi.string()
    .min(10)
    .max(512)
    .allow("")
    .regex(utils.VALID_REGEX)
    .label(Words.descriptions),
  IsActive: Joi.boolean(),
};

const initRecord = {
  CashBoxID: 0,
  Title: "",
  Location: "",
  CashierMemberID: 0,
  DetailsText: "",
  IsActive: true,
};

const formRef = React.createRef();

const CashBoxModal = ({
  isOpen,
  selectedObject,
  onOk,
  onCancel,
  onCreateTafsilAccount,
}) => {
  const [employees, setEmployees] = useState([]);
  const [hasCreateTafsilAccountAccess, setHasCreateTafsilAccountAccess] =
    useState(false);

  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const resetContext = useResetContext();

  const clearRecord = () => {
    record.Title = "";
    record.Location = "";
    record.CashierMemberID = 0;
    record.DetailsText = "";
    record.IsActive = true;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  useMount(async () => {
    resetContext();

    setRecord(initRecord);
    loadFieldsValue(formRef, initRecord);
    initModal(formRef, selectedObject, setRecord);

    //------

    setProgress(true);

    try {
      const data = await service.getParams();

      const { Employees } = data;

      setEmployees(Employees);

      //------

      const access_data = await tafsilAccountService.getTafsilAccountAccesses(
        "CashBoxes"
      );

      const { HasCreateTafsilAccountAccess } = access_data;

      setHasCreateTafsilAccountAccess(HasCreateTafsilAccountAccess);
    } catch (err) {
      handleError(err);
    }

    setProgress(false);
  });

  const handleSubmit = async () => {
    await saveModalChanges(
      formConfig,
      selectedObject,
      setProgress,
      onOk,
      clearRecord
    );
  };

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

  //------

  let items = [
    {
      label: Words.info,
      key: "info",
      children: (
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.title}
              fieldName="Title"
              formConfig={formConfig}
              maxLength={50}
              required
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.location}
              fieldName="Location"
              formConfig={formConfig}
              maxLength={50}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.cashier}
              dataSource={employees}
              keyColumn="CashierMemberID"
              valueColumn="FullName"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <SwitchItem
              title={Words.status}
              fieldName="IsActive"
              initialValue={true}
              checkedTitle={Words.active}
              unCheckedTitle={Words.inactive}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24}>
            <InputItem
              horizontal
              title={Words.descriptions}
              fieldName="DetailsText"
              formConfig={formConfig}
              multiline
              rows={3}
              maxLength={512}
              showCount
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
      width={750}
    >
      <Form ref={formRef} name="dataForm">
        <Tabs defaultActiveKey="1" type="card" items={items} />
      </Form>
    </ModalWindow>
  );
};

export default CashBoxModal;
