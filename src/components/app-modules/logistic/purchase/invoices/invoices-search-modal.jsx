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
import service from "../../../../../services/logistic/purchase/invoices-service";
import DropdownItem from "../../../../form-controls/dropdown-item";
import DateItem from "../../../../form-controls/date-item";
import NumericInputItem from "../../../../form-controls/numeric-input-item";

const schema = {
  InvoiceID: Joi.number().label(Words.id),
  SupplierID: Joi.number().label(Words.supplier),
  TransportTypeID: Joi.number().label(Words.transport_type),
  PurchaseWayID: Joi.number().label(Words.purchase_way),
  PaymentTypeID: Joi.number().label(Words.payment_type),
  FromDate: Joi.string().allow(""),
  ToDate: Joi.string().allow(""),
  StatusID: Joi.number(),
};

const initRecord = {
  InvoiceID: 0,
  SupplierID: 0,
  TransportTypeID: 0,
  PurchaseWayID: 0,
  PaymentTypeID: 0,
  FromDate: "",
  ToDate: "",
  StatusID: 0,
};

const formRef = React.createRef();

const InvoicesSearchModal = ({ isOpen, filter, onOk, onCancel }) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [statuses, setStatuses] = useState([]);
  const [suppliers, setSuppliers] = useState(0);
  const [transportTypes, setTransportTypes] = useState(0);
  const [purchaseWays, setPurchaseWays] = useState(0);
  const [paymentTypes, setPaymentTypes] = useState(0);

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.InvoiceID = 0;
    record.SupplierID = 0;
    record.TransportTypeID = 0;
    record.PurchaseWayID = 0;
    record.PaymentTypeID = 0;
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

      const {
        Suppliers,
        TransportTypes,
        PurchaseWays,
        PaymentTypes,
        Statuses,
      } = data;

      setSuppliers(Suppliers);
      setTransportTypes(TransportTypes);
      setPurchaseWays(PurchaseWays);
      setPaymentTypes(PaymentTypes);
      setStatuses(Statuses);
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
              fieldName="InvoiceID"
              min={0}
              max={9999999999}
              formConfig={formConfig}
              autoFocus
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
              title={Words.transport_type}
              dataSource={transportTypes}
              keyColumn="TransportTypeID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.purchase_way}
              dataSource={purchaseWays}
              keyColumn="PurchaseWayID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.payment_type}
              dataSource={paymentTypes}
              keyColumn="PaymentTypeID"
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
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default InvoicesSearchModal;
