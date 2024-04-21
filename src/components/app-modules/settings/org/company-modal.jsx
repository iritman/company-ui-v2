import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Tabs, Button, Popconfirm } from "antd";
import { QuestionCircleOutlined as QuestionIcon } from "@ant-design/icons";
import Joi from "joi-browser";
import ModalWindow from "../../../common/modal-window";
import Words from "../../../../resources/words";
import utils from "../../../../tools/utils";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
  handleError,
} from "../../../../tools/form-manager";
import InputItem from "../../../form-controls/input-item";
import DropdownItem from "../../../form-controls/dropdown-item";
import companiesService from "../../../../services/settings/org/companies-service";
import {
  useModalContext,
  useResetContext,
} from "../../../contexts/modal-context";
import TafsilInfoViewer from "./../../../common/tafsil-info-viewer";
import tafsilAccountService from "../../../../services/financial/accounts/tafsil-accounts-service";

const schema = {
  CompanyID: Joi.number().required(),
  CityID: Joi.number().required().min(1),
  CompanyTitle: Joi.string()
    .min(2)
    .max(50)
    .required()
    .regex(utils.VALID_REGEX)
    .label(Words.title),
  OfficeTel: Joi.string()
    .max(50)
    .allow("")
    .regex(/^[0-9]+$/)
    .label(Words.office_tel),
  Fax: Joi.string()
    .max(50)
    .allow("")
    .regex(/^[0-9]+$/)
    .label(Words.fax),
  Address: Joi.string().min(25).max(200).required().label(Words.address),
  PostalCode: Joi.string()
    .max(10)
    .allow("")
    .regex(/^[0-9]+$/)
    .label(Words.postal_code),
  NationalID: Joi.string()
    .min(10)
    .max(50)
    .required()
    .regex(/^[0-9]+$/)
    .label(Words.national_id),
  FinancialCode: Joi.string()
    .min(10)
    .max(50)
    .allow("")
    // .required()
    .regex(/^[0-9]+$/)
    .label(Words.financial_code),
  RegNo: Joi.string()
    .min(2)
    .max(50)
    .allow("")
    // .required()
    .regex(/^[0-9]+$/)
    .label(Words.reg_no),
};

const initRecord = {
  CompanyID: 0,
  CompanyTitle: "",
  CityID: 0,
  OfficeTel: "",
  Fax: "",
  Address: "",
  PostalCode: "",
  NatioanlID: "",
  FinancialCode: "",
  RegNo: "",
};

const formRef = React.createRef();

const CompanyModal = ({
  isOpen,
  selectedObject,
  onOk,
  onCancel,
  onCreateTafsilAccount,
}) => {
  const [hasCreateTafsilAccountAccess, setHasCreateTafsilAccountAccess] =
    useState(false);

  const {
    progress,
    setProgress,
    record,
    setRecord,
    errors,
    setErrors,
    provinces,
    setProvinces,
    selectedProvinceID,
    setSelectedProvinceID,
    cities,
    setCities,
  } = useModalContext();

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.CompanyTitle = "";
    record.CityID = 0;
    record.OfficeTel = "";
    record.Fax = "";
    record.Address = "";
    record.PostalCode = "";
    record.NationalID = "";
    record.FinancialCode = "";
    record.RegNo = "";

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();
    setRecord(initRecord);
    initModal(formRef, selectedObject, setRecord);

    try {
      const data = await companiesService.getParams();

      setProvinces(data.Provinces);
      setCities(data.Cities);

      setSelectedProvinceID(
        selectedObject !== null ? selectedObject.ProvinceID : 0
      );

      //------

      const access_data = await tafsilAccountService.getTafsilAccountAccesses(
        "Projects"
      );

      const { HasCreateTafsilAccountAccess } = access_data;

      setHasCreateTafsilAccountAccess(HasCreateTafsilAccountAccess);
    } catch (ex) {
      handleError(ex);
    }
  });

  const handleSubmit = async () => {
    saveModalChanges(
      formConfig,
      selectedObject,
      setProgress,
      onOk,
      clearRecord
    );
  };

  const handleSelectProvince = (value) => {
    setSelectedProvinceID(value);
  };

  const getCities = () => {
    const selectedCities = cities.filter(
      (c) => c.ProvinceID === selectedProvinceID
    );
    return selectedCities;
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
          <Col xs={24}>
            <InputItem
              title={Words.title}
              fieldName="CompanyTitle"
              required
              autoFocus
              maxLength={50}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.national_id}
              fieldName="NationalID"
              maxLength={50}
              required
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.financial_code}
              fieldName="FinancialCode"
              maxLength={50}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.reg_no}
              fieldName="RegNo"
              maxLength={50}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.postal_code}
              fieldName="PostalCode"
              maxLength={10}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.province}
              dataSource={provinces}
              keyColumn="ProvinceID"
              valueColumn="ProvinceTitle"
              onChange={handleSelectProvince}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.city}
              dataSource={getCities()}
              keyColumn="CityID"
              valueColumn="CityTitle"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24}>
            <InputItem
              title={Words.address}
              fieldName="Address"
              maxLength={200}
              multiline
              showCount
              required
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.office_tel}
              fieldName="OfficeTel"
              maxLength={50}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.fax}
              fieldName="Fax"
              maxLength={50}
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

  //------

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

export default CompanyModal;
