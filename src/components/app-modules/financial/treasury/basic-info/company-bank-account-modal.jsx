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
import service from "../../../../../services/financial/treasury/basic-info/company-bank-accounts-service";
import tafsilAccountService from "../../../../../services/financial/accounts/tafsil-accounts-service";
import DropdownItem from "./../../../../form-controls/dropdown-item";
import InputItem from "../../../../form-controls/input-item";
import NumericInputItem from "../../../../form-controls/numeric-input-item";
import TafsilInfoViewer from "../../../../common/tafsil-info-viewer";

const schema = {
  AccountID: Joi.number().required(),
  BankID: Joi.number().required(),
  BranchID: Joi.number().required(),
  AccountNo: Joi.string()
    .min(2)
    .max(50)
    .required()
    .regex(utils.VALID_REGEX)
    .label(Words.account_no),
  AccountName: Joi.string()
    .allow("")
    .max(50)
    .regex(utils.VALID_REGEX)
    .label(Words.account_name),
  Credit: Joi.number().label(Words.credit),
  CurrencyID: Joi.number().min(1).required().label(Words.currency_type),
  ShebaID: Joi.string()
    .min(2)
    .max(50)
    .allow("")
    .regex(utils.VALID_REGEX)
    .label(Words.sheba_no),
  BankAccountTypeID: Joi.number()
    .min(1)
    .required()
    .label(Words.bank_account_type),
  DetailsText: Joi.string()
    .min(10)
    .max(512)
    .allow("")
    .regex(utils.VALID_REGEX)
    .label(Words.descriptions),
};

const initRecord = {
  AccountID: 0,
  BankID: 0,
  BranchID: 0,
  AccountNo: "",
  AccountName: "",
  Credit: 0,
  CurrencyID: 0,
  ShebaID: "",
  BankAccountTypeID: 0,
  DetailsText: "",
};

const formRef = React.createRef();

const CompanyBankAccountModal = ({
  isOpen,
  selectedObject,
  onOk,
  onCancel,
  onCreateTafsilAccount,
}) => {
  const [banks, setBanks] = useState([]);
  const [branches, setBranches] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [bankAccountTypes, setBankAccountTypes] = useState([]);
  const [hasCreateTafsilAccountAccess, setHasCreateTafsilAccountAccess] =
    useState(false);

  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const resetContext = useResetContext();

  const clearRecord = () => {
    record.BranchID = 0;
    record.BankID = 0;
    record.AccountNo = "";
    record.AccountName = "";
    record.Credit = 0;
    record.CurrencyID = 0;
    record.ShebaID = "";
    record.BankAccountTypeID = 0;
    record.DetailsText = "";

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

    //------

    setProgress(true);

    try {
      const data = await service.getParams();

      const { Banks, Branches, Currencies, BankAccountTypes } = data;

      setBanks(Banks);
      setBranches(Branches);
      setCurrencies(Currencies);
      setBankAccountTypes(BankAccountTypes);

      if (selectedObject) {
        initModal(formRef, selectedObject, setRecord);
      } else {
        utils.setDefaultCurrency(
          setRecord,
          initRecord,
          loadFieldsValue,
          formRef,
          Currencies
        );
      }

      //------

      const access_data = await tafsilAccountService.getTafsilAccountAccesses(
        "Vehicles"
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

  const filtered_branches = branches.filter((b) => b.BankID === record.BankID);

  let items = [
    {
      label: Words.info,
      key: "info",
      children: (
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.bank}
              dataSource={banks}
              keyColumn="BankID"
              valueColumn="Title"
              formConfig={formConfig}
              required
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.bank_branch}
              dataSource={filtered_branches}
              keyColumn="BranchID"
              valueColumn="Title"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.account_name}
              fieldName="AccountName"
              formConfig={formConfig}
              maxLength={50}
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.account_no}
              fieldName="AccountNo"
              formConfig={formConfig}
              maxLength={50}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              title={Words.credit}
              fieldName="Credit"
              min={0}
              max={999999999999}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.currency_type}
              dataSource={currencies}
              keyColumn="CurrencyID"
              valueColumn="Title"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.sheba_no}
              fieldName="ShebaID"
              formConfig={formConfig}
              maxLength={50}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.bank_account_type}
              dataSource={bankAccountTypes}
              keyColumn="BankAccountTypeID"
              valueColumn="Title"
              formConfig={formConfig}
              required
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

  const is_disabled =
    (record.MemberID === 0 && record.CompanyID === 0) ||
    (validateForm({ record, schema }) && true);

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

export default CompanyBankAccountModal;
