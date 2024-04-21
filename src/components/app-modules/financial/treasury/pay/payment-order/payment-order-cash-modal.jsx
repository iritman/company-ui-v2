import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Checkbox } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../../../common/modal-window";
import Words from "../../../../../../resources/words";
import utils from "../../../../../../tools/utils";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
  handleError,
} from "../../../../../../tools/form-manager";
import service from "../../../../../../services/financial/treasury/pay/payment-orders-service";
import InputItem from "../../../../../form-controls/input-item";
import NumericInputItem from "../../../../../form-controls/numeric-input-item";
import DropdownItem from "../../../../../form-controls/dropdown-item";

const schema = {
  CashID: Joi.number().required(),
  OrderID: Joi.number().required(),
  RequestID: Joi.number().required(),
  CurrencyID: Joi.number().label(Words.currency),
  OperationID: Joi.number().min(1).required().label(Words.financial_operation),
  CashFlowID: Joi.number().min(1).required().label(Words.cash_flow),
  Amount: Joi.number().min(10).required().label(Words.price),
  StandardDetailsID: Joi.number(),
  DetailsText: Joi.string()
    .min(5)
    .max(250)
    .allow("")
    .regex(utils.VALID_REGEX)
    .label(Words.standard_description),
};

const initRecord = {
  CashID: 0,
  OrderID: 0,
  RequestID: 0,
  CurrencyID: 0,
  OperationID: 0,
  CashFlowID: 0,
  Amount: 0,
  StandardDetailsID: 0,
  DetailsText: "",
};

const formRef = React.createRef();

const PaymentOrderCashModal = ({ isOpen, selectedObject, onOk, onCancel }) => {
  const [progress, setProgress] = useState(false);
  const [errors, setErrors] = useState({});
  const [record, setRecord] = useState({});

  const [checkPaymentBase, setCheckPaymentBase] = useState(false);
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [operations, setOperations] = useState([]);
  const [cashFlows, setCashFlows] = useState([]);
  const [standardDetails, setStandardDetails] = useState([]);

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.OrderID = 0;
    record.RequestID = 0;
    record.CurrencyID = 0;
    record.OperationID = 0;
    record.CashFlowID = 0;
    record.Amount = 0;
    record.StandardDetailsID = 0;
    record.DetailsText = "";

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    setProgress(true);

    try {
      const data = await service.getItemsParams();

      let {
        Currencies,
        Operations,
        CashFlows,
        StandardDetails,
        PaymentRequests,
      } = data;

      setCurrencies(Currencies);
      setOperations(
        Operations.filter((o) => o.ItemTypeID === 3 && o.OperationTypeID === 2)
      );
      setCashFlows(CashFlows.filter((cf) => cf.ShowInReceiptOperation));
      setStandardDetails(StandardDetails);

      PaymentRequests.forEach(
        (rq) =>
          (rq.Title = utils.farsiNum(
            `#${rq.RequestID} - ${
              rq.FrontSideAccountTitle
            } - ${utils.moneyNumber(rq.TotalPrice)} ${Words.ryal}`
          ))
      );
      setPaymentRequests(PaymentRequests);

      if (selectedObject) {
        if (selectedObject.RequestID > 0) {
          const selected_payment_request =
            await service.searchPaymentRequestByID(selectedObject.RequestID);

          if (selected_payment_request) {
            if (
              !paymentRequests.find(
                (rq) => rq.RequestID === selected_payment_request.RequestID
              )
            ) {
              const { RequestID, FrontSideAccountTitle, TotalPrice } =
                selected_payment_request;

              setPaymentRequests([
                ...paymentRequests,
                {
                  RequestID,
                  Title: utils.farsiNum(
                    `#${RequestID} - ${FrontSideAccountTitle} - ${utils.moneyNumber(
                      TotalPrice
                    )} ${Words.ryal}`
                  ),
                },
              ]);
            }

            setCheckPaymentBase(true);
          }
        }

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
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  });

  const isEdit = selectedObject !== null;

  const handleSubmit = async () => {
    await saveModalChanges(
      formConfig,
      selectedObject,
      setProgress,
      onOk,
      clearRecord,
      false // showMessage
    );

    onCancel();
  };

  const handlePaymentBaseChange = (e) => {
    const { checked } = e.target;
    setCheckPaymentBase(checked);

    if (checked) {
      schema.RequestID = Joi.number().min(1).label(Words.payment_request);
    } else {
      schema.RequestID = Joi.number().label(Words.payment_request);
      const rec = { ...record };
      rec.RequestID = 0;
      setRecord(rec);
      loadFieldsValue(formRef, rec);
    }
  };

  //------

  return (
    <ModalWindow
      isOpen={isOpen}
      isEdit={isEdit}
      inProgress={progress}
      disabled={validateForm({ record: record, schema }) && true}
      onClear={clearRecord}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      title={Words.reg_cash}
      width={1250}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24} md={checkPaymentBase ? 8 : 24}>
            <Form.Item>
              <Checkbox
                checked={checkPaymentBase}
                onChange={handlePaymentBaseChange}
              >
                {Words.select_receive_base}
              </Checkbox>
            </Form.Item>
          </Col>
          {checkPaymentBase && (
            <Col xs={24} md={16}>
              <DropdownItem
                title={Words.payment_request}
                dataSource={paymentRequests}
                keyColumn="RequestID"
                valueColumn="Title"
                formConfig={formConfig}
                required
              />
            </Col>
          )}
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.financial_operation}
              dataSource={operations}
              keyColumn="OperationID"
              valueColumn="Title"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.cash_flow}
              dataSource={cashFlows}
              keyColumn="CashFlowID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.currency}
              dataSource={currencies}
              keyColumn="CurrencyID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              title={Words.price}
              fieldName="Amount"
              min={10}
              max={9999999999}
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24}>
            <DropdownItem
              title={Words.standard_details_text}
              dataSource={standardDetails}
              keyColumn="StandardDetailsID"
              valueColumn="DetailsText"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24}>
            <InputItem
              title={Words.standard_description}
              fieldName="DetailsText"
              multiline
              rows={2}
              showCount
              maxLength={250}
              formConfig={formConfig}
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default PaymentOrderCashModal;
