import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
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
import service from "../../../../../../services/financial/treasury/receive/receive-receipts-service";
import InputItem from "./../../../../../form-controls/input-item";
import NumericInputItem from "./../../../../../form-controls/numeric-input-item";
import DateItem from "./../../../../../form-controls/date-item";
import DropdownItem from "./../../../../../form-controls/dropdown-item";

const schema = {
  DemandID: Joi.number().required(),
  ReceiveID: Joi.number().required(),
  FrontSideAccountID: Joi.number()
    .min(1)
    .required()
    .label(Words.front_side_account),
  OperationID: Joi.number().min(1).required().label(Words.financial_operation),
  CashFlowID: Joi.number().min(1).required().label(Words.cash_flow),
  DemandNo: Joi.string().max(50).required().label(Words.demand_no),
  DemandSeries: Joi.string().max(50).allow("").label(Words.demand_series),
  CurrencyID: Joi.number().label(Words.currency),
  Amount: Joi.number().min(10).required().label(Words.price),
  DueDate: Joi.string().required().label(Words.due_date),
  StandardDetailsID: Joi.number(),
  DetailsText: Joi.string()
    .min(5)
    .max(250)
    .allow("")
    .regex(utils.VALID_REGEX)
    .label(Words.standard_description),
};

const initRecord = {
  DemandID: 0,
  ReceiveID: 0,
  FrontSideAccountID: 0,
  OperationID: 0,
  CashFlowID: 0,
  DemandNo: "",
  DemandSeries: "",
  CurrencyID: 0,
  Amount: 0,
  DueDate: "",
  StandardDetailsID: 0,
  DetailsText: "",
};

// const initRecord = {
//   DemandID: 0,
//   ReceiveID: 0,
//   FrontSideAccountID: 1,
//   OperationID: 1,
//   CashFlowID: 1,
//   DemandNo: "102030",
//   DemandSeries: "",
//   CurrencyID: 1,
//   Amount: 257500000,
//   DueDate: "14010916",
//   StandardDetailsID: 1,
//   DetailsText: ""
// };

const formRef = React.createRef();

const ReceiveReceiptDemandModal = ({
  isOpen,
  selectedObject,
  onOk,
  onCancel,
}) => {
  const [progress, setProgress] = useState(false);
  const [errors, setErrors] = useState({});
  const [record, setRecord] = useState({});

  const [frontSideAccountSearchProgress, setFrontSideAccountSearchProgress] =
    useState(false);
  const [frontSideAccounts, setFrontSideAccounts] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [standardDetails, setStandardDetails] = useState([]);
  const [operations, setOperations] = useState([]);
  const [cashFlows, setCashFlows] = useState([]);

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.FrontSideAccountID = 0;
    record.OperationID = 0;
    record.CashFlowID = 0;
    record.DemandNo = "";
    record.DemandSeries = "";
    record.CurrencyID = 0;
    record.Amount = 0;
    record.DueDate = "";
    record.StandardDetailsID = 0;
    record.DetailsText = "";

    setRecord(record);
    // setRecord(initRecord);
    setErrors({});
    loadFieldsValue(formRef, record);
    // loadFieldsValue(formRef, initRecord);
  };

  useMount(async () => {
    setProgress(true);

    try {
      const data = await service.getItemsParams();

      let { Currencies, Operations, CashFlows, StandardDetails } = data;

      setCurrencies(Currencies);
      setOperations(
        Operations.filter((o) => o.ItemTypeID === 2 && o.OperationTypeID === 1)
      );
      setCashFlows(CashFlows.filter((cf) => cf.ShowInReceiptOperation));
      setStandardDetails(StandardDetails);

      if (selectedObject !== null) {
        const front_side_account = await service.searchFrontSideAccountByID(
          selectedObject.FrontSideAccountID
        );

        const { FrontSideAccountID, Title } = front_side_account;

        setFrontSideAccounts([
          {
            FrontSideAccountID,
            Title,
          },
        ]);

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
      title={Words.reg_demand}
      width={1250}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24} md={12} lg={8}>
            <DropdownItem
              title={Words.front_side}
              dataSource={frontSideAccounts}
              keyColumn="FrontSideAccountID"
              valueColumn="Title"
              formConfig={formConfig}
              loading={frontSideAccountSearchProgress}
              onSearch={handleSearchFrontSideAccount}
              onChange={handleChangeFrontSideAccount}
              required
              autoFocus
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <DropdownItem
              title={Words.financial_operation}
              dataSource={operations}
              keyColumn="OperationID"
              valueColumn="Title"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <DropdownItem
              title={Words.cash_flow}
              dataSource={cashFlows}
              keyColumn="CashFlowID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <InputItem
              title={Words.demand_no}
              fieldName="DemandNo"
              maxLength={50}
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <InputItem
              title={Words.demand_series}
              fieldName="DemandSeries"
              maxLength={50}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <DropdownItem
              title={Words.currency}
              dataSource={currencies}
              keyColumn="CurrencyID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
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
          <Col xs={24} md={12} lg={8}>
            <DateItem
              horizontal
              required
              title={Words.due_date}
              fieldName="DueDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
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

export default ReceiveReceiptDemandModal;
