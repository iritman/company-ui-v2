import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Radio } from "antd";
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
import service from "../../../../../services/financial/treasury/basic-info/person-company-bank-accounts-service";
import DropdownItem from "./../../../../form-controls/dropdown-item";
import InputItem from "../../../../form-controls/input-item";
import SwitchItem from "../../../../form-controls/switch-item";

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
  ShebaID: Joi.string()
    .min(2)
    .max(50)
    .allow("")
    .regex(utils.VALID_REGEX)
    .label(Words.sheba_no),
  TypeID: Joi.number().min(1).required().label(Words.account_type),
  MemberID: Joi.number().required().label(Words.pc_person),
  CompanyID: Joi.number().required().label(Words.pc_company),
  InBlackList: Joi.boolean().label(Words.in_black_list),
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
  ShebaID: "",
  TypeID: 0,
  MemberID: 0,
  CompanyID: 0,
  InBlackList: false,
  DetailsText: "",
};

const formRef = React.createRef();

const PersonCompanyBankAccountModal = ({
  isOpen,
  selectedObject,
  onOk,
  onCancel,
}) => {
  const [banks, setBanks] = useState([]);
  const [branches, setBranches] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [docTypes, setDocTypes] = useState([]);
  const [radioValue, setRadioValue] = useState("person");

  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const resetContext = useResetContext();

  const clearRecord = () => {
    record.BranchID = 0;
    record.BankID = 0;
    record.AccountNo = "";
    record.ShebaID = "";
    record.TypeID = 0;
    record.MemberID = 0;
    record.CompanyID = 0;
    record.InBlackList = false;
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

    setRecord(initRecord);
    loadFieldsValue(formRef, initRecord);
    initModal(formRef, selectedObject, setRecord);

    //------

    setProgress(true);

    try {
      const data = await service.getParams();

      const { Banks, Branches, Companies, Employees, DocTypes } = data;

      setBanks(Banks);
      setBranches(Branches);
      setCompanies(Companies);
      setEmployees(Employees);
      setDocTypes(DocTypes);

      if (selectedObject) {
        setRadioValue(selectedObject.MemberID > 0 ? "person" : "company");
      }
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

  const handleChangeRadio = (e) => {
    const newValue = e.target.value;

    record.MemberID = 0;
    record.CompanyID = 0;
    setRecord({ ...record });
    loadFieldsValue(formRef, record);

    setRadioValue(newValue);
  };

  const isEdit = selectedObject !== null;

  //------

  const filtered_branches = branches.filter((b) => b.BankID === record.BankID);

  return (
    <ModalWindow
      isOpen={isOpen}
      isEdit={isEdit}
      inProgress={progress}
      disabled={
        (record.MemberID === 0 && record.CompanyID === 0) ||
        (validateForm({ record, schema }) && true)
      }
      onClear={clearRecord}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      width={750}
    >
      <Form ref={formRef} name="dataForm">
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
              title={Words.account_no}
              fieldName="AccountNo"
              formConfig={formConfig}
              maxLength={50}
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
              title={Words.doc_type}
              dataSource={docTypes}
              keyColumn="TypeID"
              valueColumn="Title"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <SwitchItem
              title={Words.in_black_list}
              fieldName="InBlackList"
              initialValue={false}
              checkedTitle={Words.yes}
              unCheckedTitle={Words.no}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <Radio.Group onChange={handleChangeRadio} value={radioValue}>
              <Radio value="person">{Words.pc_person}</Radio>
              <Radio value="company">{Words.pc_company}</Radio>
            </Radio.Group>
          </Col>
          <Col xs={24} md={12}>
            {radioValue === "person" ? (
              <DropdownItem
                title={Words.pc_person}
                dataSource={employees}
                keyColumn="MemberID"
                valueColumn="FullName"
                formConfig={formConfig}
                required
              />
            ) : (
              <DropdownItem
                title={Words.pc_company}
                dataSource={companies}
                keyColumn="CompanyID"
                valueColumn="Title"
                formConfig={formConfig}
                required
              />
            )}
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
      </Form>
    </ModalWindow>
  );
};

export default PersonCompanyBankAccountModal;
