import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../../../common/modal-window";
import Words from "../../../../../../resources/words";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  handleError,
} from "../../../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "../../../../../contexts/modal-context";
import service from "../../../../../../services/financial/treasury/pay/payment-receipts-service";
import DropdownItem from "../../../../../form-controls/dropdown-item";
import DateItem from "../../../../../form-controls/date-item";
import NumericInputItem from "../../../../../form-controls/numeric-input-item";

const schema = {
  ReceiptID: Joi.number().label(Words.id),
  PayTypeID: Joi.number(),
  CashBoxID: Joi.number(),
  SubNo: Joi.number().allow("").label(Words.sub_no),
  FromPayDate: Joi.string().allow(""),
  ToPayDate: Joi.string().allow(""),
  RegardID: Joi.number(),
  StatusID: Joi.number(),
};

const initRecord = {
  ReceiptID: 0,
  PayTypeID: 0,
  CashBoxID: 0,
  SubNo: "",
  FromPayDate: "",
  ToPayDate: "",
  RegardID: 0,
  StatusID: 0,
};

const formRef = React.createRef();

const PaymentReceiptsSearchModal = ({ isOpen, filter, onOk, onCancel }) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [payTypes, setPayTypes] = useState([]);
  const [cashBoxes, setCashBoxes] = useState([]);
  const [regards, setRegards] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.ReceiptID = 0;
    record.PayTypeID = 0;
    record.RegardID = 0;
    record.CashBoxID = 0;
    record.SubNo = "";
    record.FromPayDate = "";
    record.ToPayDate = "";
    record.StatusID = 0;

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

      const { CashBoxes, Regards, PayTypes, Statuses } = data;

      setCashBoxes(CashBoxes);
      setRegards(Regards);
      setPayTypes(PayTypes);
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
              fieldName="ReceiptID"
              min={0}
              max={9999999999}
              formConfig={formConfig}
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.pay_type}
              dataSource={payTypes}
              keyColumn="PaytypeID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.cash_box}
              dataSource={cashBoxes}
              keyColumn="CashBoxID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
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
            <DateItem
              horizontal
              title={Words.from_receipt_date}
              fieldName="FromPayDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.to_receipt_date}
              fieldName="ToPayDate"
              formConfig={formConfig}
            />
          </Col>

          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.regards}
              dataSource={regards}
              keyColumn="RegardID"
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
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default PaymentReceiptsSearchModal;
