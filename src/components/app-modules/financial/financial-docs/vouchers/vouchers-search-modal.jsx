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
  handleError,
} from "../../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "../../../../contexts/modal-context";
import service from "../../../../../services/financial/financial-docs/vouchers-service";
import DropdownItem from "../../../../form-controls/dropdown-item";
import DateItem from "../../../../form-controls/date-item";
import InputItem from "../../../../form-controls/input-item";
import NumericInputItem from "../../../../form-controls/numeric-input-item";

const schema = {
  VoucherID: Joi.number().label(Words.voucher_id),
  VoucherNo: Joi.number().label(Words.voucher_no),
  SubNo: Joi.number().label(Words.sub_no),
  DocTypeID: Joi.number().label(Words.doc_type),
  FromVoucherDate: Joi.string().allow(""),
  ToVoucherDate: Joi.string().allow(""),
  FromRegDate: Joi.string().allow(""),
  ToRegDate: Joi.string().allow(""),
  StatusID: Joi.number(),
  RegMemberID: Joi.number(),
  FromAmount: Joi.number(),
  ToAmount: Joi.number(),
  SearchText: Joi.string()
    .min(2)
    .max(50)
    .allow("")
    .label(Words.search_text)
    .regex(utils.VALID_REGEX),
};

const initRecord = {
  VoucherID: 0,
  VoucherNo: 0,
  SubNo: 0,
  DocTypeID: 0,
  FromVoucherDate: "",
  ToVoucherDate: "",
  FromRegDate: "",
  ToRegDate: "",
  StatusID: 0,
  RegMemberID: 0,
  FromAmount: 0,
  ToAmount: 0,
  SearchText: "",
};

const formRef = React.createRef();

const VouchersSearchModal = ({ isOpen, filter, onOk, onCancel }) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [docTypes, setDocTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [employees, setEmployees] = useState([]);

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.VoucherID = 0;
    record.VoucherNo = 0;
    record.SubNo = 0;
    record.DocTypeID = 0;
    record.FromVoucherDate = "";
    record.ToVoucherDate = "";
    record.FromRegDate = "";
    record.ToRegDate = "";
    record.StatusID = 0;
    record.RegMemberID = 0;
    record.FromAmount = 0;
    record.ToAmount = 0;
    record.SearchText = "";

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();

    setRecord(initRecord);
    initModal(formRef, filter, setRecord);

    setProgress(true);
    try {
      const data = await service.getParams();

      const { DocTypes, Statuses, Employees } = data;

      setDocTypes(DocTypes);
      setStatuses(Statuses);
      setEmployees(Employees);
    } catch (err) {
      handleError(err);
    }
    setProgress(false);
  });

  // ------

  return (
    <ModalWindow
      isOpen={isOpen}
      inProgress={progress}
      disabled={validateForm({ record, schema }) && true}
      searchModal
      onClear={clearRecord}
      onSubmit={() => onOk(record)}
      onCancel={onCancel}
      width={950}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[10, 5]} style={{ marginLeft: 1 }}>
          <Col xs={24} md={8}>
            <NumericInputItem
              horizontal
              title={Words.voucher_id}
              fieldName="VoucherID"
              min={0}
              max={999999}
              formConfig={formConfig}
              autoFocus
            />
          </Col>
          <Col xs={24} md={8}>
            <NumericInputItem
              horizontal
              title={Words.voucher_no}
              fieldName="VoucherNo"
              min={0}
              max={999999}
              formConfig={formConfig}
              autoFocus
            />
          </Col>
          <Col xs={24} md={8}>
            <NumericInputItem
              horizontal
              title={Words.sub_no}
              fieldName="SubNo"
              min={0}
              max={999999}
              formConfig={formConfig}
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.doc_type}
              dataSource={docTypes}
              keyColumn="DocTypeID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.status}
              dataSource={statuses}
              keyColumn="StatusID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.from_voucher_date}
              fieldName="FromVoucherDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.to_voucher_date}
              fieldName="ToVoucherDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.from_reg_date}
              fieldName="FromRegDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.to_reg_date}
              fieldName="ToRegDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              title={Words.from_amount}
              fieldName="FromAmount"
              min={0}
              max={999999999999}
              formConfig={formConfig}
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              title={Words.to_amount}
              fieldName="ToAmount"
              min={0}
              max={999999999999}
              formConfig={formConfig}
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.registerar}
              dataSource={employees}
              keyColumn="RegMemberID"
              valueColumn="FullName"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.search_text}
              fieldName="SearchText"
              maxLength={50}
              formConfig={formConfig}
              autoFocus
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default VouchersSearchModal;
