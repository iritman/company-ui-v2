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
import service from "../../../../../../services/financial/treasury/pay/payment-orders-service";
import DropdownItem from "../../../../../form-controls/dropdown-item";
import DateItem from "../../../../../form-controls/date-item";
import NumericInputItem from "../../../../../form-controls/numeric-input-item";

const schema = {
  OrderID: Joi.number().label(Words.id),
  FrontSideAccountID: Joi.number().label(Words.front_side),
  PayTypeID: Joi.number(),
  CashBoxID: Joi.number(),
  FromOrderDate: Joi.string().allow(""),
  ToOrderDate: Joi.string().allow(""),
  StatusID: Joi.number(),
};

const initRecord = {
  OrderID: 0,
  FrontSideAccountID: 0,
  PayTypeID: 0,
  CashBoxID: 0,
  FromOrderDate: "",
  ToOrderDate: "",
  StatusID: 0,
};

const formRef = React.createRef();

const PaymentOrdersSearchModal = ({ isOpen, filter, onOk, onCancel }) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [frontSideAccountSearchProgress, setFrontSideAccountSearchProgress] =
    useState(false);
  const [frontSideAccounts, setFrontSideAccounts] = useState([]);

  const [payTypes, setPayTypes] = useState([]);
  const [cashBoxes, setCashBoxes] = useState([]);
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
    record.OrderID = 0;
    record.FrontSideAccountID = 0;
    record.PayTypeID = 0;
    record.CashBoxID = 0;
    record.FromOrderDate = "";
    record.ToOrderDate = "";
    record.StatusID = 0;

    setRecord(record);
    setErrors({});
    setFrontSideAccounts([]);
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();

    setRecord(initRecord);
    initModal(formRef, filter, setRecord);

    setProgress(true);
    try {
      const data = await service.getParams();

      const { PayTypes, CashBoxes, Statuses } = data;

      setPayTypes(PayTypes);
      setCashBoxes(CashBoxes);
      setStatuses(Statuses);

      if (record.FrontSideAccountID > 0) {
        const selected_front_side_account =
          await service.searchFrontSideAccountByID(record.FrontSideAccountID);

        const { FrontSideAccountID, Title } = selected_front_side_account;
        setFrontSideAccounts([{ FrontSideAccountID, Title }]);
      }
    } catch (err) {
      handleError(err);
    }
    setProgress(false);
  });

  const handleChangeFrontSideAccount = (value) => {
    const rec = { ...record };
    rec.FrontSideAccountID = value || 0;
    setRecord(rec);
  };

  const handleSearchFrontSideAccount = async (searchText) => {
    setFrontSideAccountSearchProgress(true);

    try {
      const data = await service.searchFrontSideAccounts(searchText);

      setFrontSideAccounts(data);
    } catch (ex) {
      handleError(ex);
    }

    setFrontSideAccountSearchProgress(false);
  };

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
              title={Words.id}
              fieldName="OrderID"
              min={0}
              max={9999999999}
              formConfig={formConfig}
              autoFocus
            />
          </Col>
          <Col xs={24} md={16}>
            <DropdownItem
              title={Words.front_side}
              dataSource={frontSideAccounts}
              keyColumn="FrontSideAccountID"
              valueColumn="Title"
              formConfig={formConfig}
              loading={frontSideAccountSearchProgress}
              onSearch={handleSearchFrontSideAccount}
              onChange={handleChangeFrontSideAccount}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.pay_type}
              dataSource={payTypes}
              keyColumn="PayTypeID"
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
            <DateItem
              horizontal
              title={Words.from_order_date}
              fieldName="FromOrderDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.to_order_date}
              fieldName="ToOrderDate"
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

export default PaymentOrdersSearchModal;
