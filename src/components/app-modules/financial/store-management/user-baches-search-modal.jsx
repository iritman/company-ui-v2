import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../common/modal-window";
import Words from "../../../../resources/words";
import utils from "../../../../tools/utils";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  handleError,
} from "../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "../../../contexts/modal-context";
import service from "../../../../services/financial/store-mgr/user-baches-service";
import DateItem from "./../../../form-controls/date-item";
import InputItem from "./../../../form-controls/input-item";
import DropdownItem from "./../../../form-controls/dropdown-item";

const schema = {
  BachNo: Joi.string()
    .max(10)
    .allow("")
    .regex(/^[0-9]+$/)
    .label(Words.bach_no),
  ProductID: Joi.number(),
  RegMemberID: Joi.number(),
  StartDate: Joi.string().allow(""),
  FinishDate: Joi.string().allow(""),
};

const initRecord = {
  BachNo: "",
  ProductID: 0,
  RegMemberID: 0,
  StartDate: "",
  FinishDate: "",
};

const formRef = React.createRef();

const UserBachesSearchModal = ({ isOpen, filter, onOk, onCancel }) => {
  const [products, setProducts] = useState([]);
  const [employees, setEmployees] = useState([]);

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
    record.BachNo = "";
    record.ProductID = 0;
    record.RegMemberID = 0;
    record.StartDate = "";
    record.FinishDate = "";

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

      const { Products, Employees } = data;

      setProducts(Products);
      setEmployees(Employees);
    } catch (err) {
      handleError(err);
    }
    setProgress(false);
  });

  return (
    <ModalWindow
      isOpen={isOpen}
      inProgress={progress}
      disabled={
        !utils.hasSelectedFilter(record, initRecord) ||
        (validateForm({ record, schema }) && true)
      }
      searchModal
      onClear={clearRecord}
      onSubmit={async () => await onOk(record)}
      onCancel={onCancel}
      width={750}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[10, 5]} style={{ marginLeft: 1 }}>
          <Col xs={24}>
            <InputItem
              title={Words.bach_no}
              fieldName="BachNo"
              maxLength={10}
              formConfig={formConfig}
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.product}
              dataSource={products}
              keyColumn="ProductID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.reg_member}
              dataSource={employees}
              keyColumn="RegMemberID"
              valueColumn="FullName"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.start_date}
              fieldName="StartDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.finish_date}
              fieldName="FinishDate"
              formConfig={formConfig}
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default UserBachesSearchModal;
