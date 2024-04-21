import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../../common/modal-window";
import Words from "../../../../../resources/words";
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
import service from "../../../../../services/logistic/purchase/purchase-orders-service";
import DropdownItem from "../../../../form-controls/dropdown-item";
import DateItem from "../../../../form-controls/date-item";
import NumericInputItem from "../../../../form-controls/numeric-input-item";

const schema = {
  OrderID: Joi.number().label(Words.id),
  SupplierID: Joi.number().label(Words.supplier),
  BaseTypeID: Joi.number().label(Words.base_type),
  RegMemberID: Joi.number().label(Words.registerar),
  FromDate: Joi.string().allow(""),
  ToDate: Joi.string().allow(""),
  StatusID: Joi.number(),
};

const initRecord = {
  OrderID: 0,
  SupplierID: 0,
  BaseTypeID: 0,
  RegMemberID: 0,
  FromDate: "",
  ToDate: "",
  StatusID: 0,
};

const formRef = React.createRef();

const PurchaseOrdersSearchModal = ({ isOpen, filter, onOk, onCancel }) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [suppliers, setSuppliers] = useState([]);
  const [baseTypes, setBaseTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [regMembers, setRegMembers] = useState(0);

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.OrderID = 0;
    record.SupplierID = 0;
    record.BaseTypeID = 0;
    record.RegMemberID = 0;
    record.FromDate = "";
    record.ToDate = "";
    record.StatusID = 0;

    setErrors({});
    setRecord(record);
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();

    setRecord(initRecord);
    initModal(formRef, filter, setRecord);

    setProgress(true);
    try {
      const data = await service.getSearchParams();

      const { Suppliers, BaseTypes, Statuses, RegMembers } = data;

      setSuppliers(Suppliers);
      setBaseTypes(BaseTypes);
      setStatuses(Statuses);
      setRegMembers(RegMembers);
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
      width={850}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[10, 5]} style={{ marginLeft: 1 }}>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              title={Words.id}
              fieldName="OrderID"
              min={0}
              max={9999999999}
              formConfig={formConfig}
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.base_type}
              dataSource={baseTypes}
              keyColumn="BaseTypeID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.supplier}
              dataSource={suppliers}
              keyColumn="SupplierID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.registerar}
              dataSource={regMembers}
              keyColumn="RegMemberID"
              valueColumn="FullName"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.from_date}
              fieldName="FromDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.to_date}
              fieldName="ToDate"
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
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default PurchaseOrdersSearchModal;
