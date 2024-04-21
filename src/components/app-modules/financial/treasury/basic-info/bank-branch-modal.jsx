import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
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
import service from "../../../../../services/financial/treasury/basic-info/bank-branches-service";
import DropdownItem from "./../../../../form-controls/dropdown-item";
import InputItem from "../../../../form-controls/input-item";

const schema = {
  BranchID: Joi.number().required(),
  BankID: Joi.number().required(),
  CityID: Joi.number().required(),
  Title: Joi.string()
    .min(2)
    .max(50)
    .required()
    .regex(utils.VALID_REGEX)
    .label(Words.title),
  BranchCode: Joi.string()
    .min(2)
    .max(50)
    .required()
    .regex(utils.VALID_REGEX)
    .label(Words.branch_code),
  SwiftCode: Joi.string()
    .min(2)
    .max(50)
    .allow("")
    .regex(utils.VALID_REGEX)
    .label(Words.swift_code),
  TelNo: Joi.string()
    .min(2)
    .max(50)
    .allow("")
    .regex(utils.VALID_REGEX)
    .label(Words.tel_no),
  Address: Joi.string()
    .min(10)
    .max(512)
    .allow("")
    .regex(utils.VALID_REGEX)
    .label(Words.address),
  Website: Joi.string()
    .min(2)
    .max(150)
    .allow("")
    .regex(utils.VALID_REGEX)
    .label(Words.website),
};

const initRecord = {
  BranchID: 0,
  BankID: 0,
  CityID: 0,
  Title: "",
  BranchCode: "",
  SwiftCode: "",
  TelNo: "",
  Website: "",
  Address: "",
};

const formRef = React.createRef();

const BankBranchModal = ({ isOpen, selectedObject, onOk, onCancel }) => {
  const [banks, setBanks] = useState([]);
  const [cities, setCities] = useState([]);

  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const resetContext = useResetContext();

  const clearRecord = () => {
    record.BankID = 0;
    record.CityID = 0;
    record.Title = "";
    record.BranchCode = "";
    record.SwiftCode = "";
    record.TelNo = "";
    record.Website = "";
    record.Address = "";

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

      const { Banks, Cities } = data;

      setBanks(Banks);
      setCities(Cities);
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

  return (
    <ModalWindow
      isOpen={isOpen}
      isEdit={isEdit}
      inProgress={progress}
      disabled={validateForm({ record, schema }) && true}
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
              title={Words.city}
              dataSource={cities}
              keyColumn="CityID"
              valueColumn="Title"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.title}
              fieldName="Title"
              formConfig={formConfig}
              maxLength={50}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.branch_code}
              fieldName="BranchCode"
              formConfig={formConfig}
              maxLength={50}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.swift_code}
              fieldName="SwiftCode"
              formConfig={formConfig}
              maxLength={50}
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.tel_no}
              fieldName="TelNo"
              formConfig={formConfig}
              maxLength={50}
            />
          </Col>
          <Col xs={24}>
            <InputItem
              title={Words.website}
              fieldName="Website"
              formConfig={formConfig}
              maxLength={150}
            />
          </Col>
          <Col xs={24}>
            <InputItem
              horizontal
              title={Words.address}
              fieldName="Address"
              formConfig={formConfig}
              multiline
              rows={3}
              maxLength={150}
              showCount
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default BankBranchModal;
