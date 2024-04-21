import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "./../../../common/modal-window";
import Words from "../../../../resources/words";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
  handleError,
} from "../../../../tools/form-manager";
import service from "../../../../services/financial/public-settings/currency-ratios-service";
import NumericInputItem from "./../../../form-controls/numeric-input-item";
import DropdownItem from "./../../../form-controls/dropdown-item";
import {
  useModalContext,
  useResetContext,
} from "./../../../contexts/modal-context";

const schema = {
  RatioID: Joi.number().required(),
  FromCurrencyID: Joi.number().min(1).required(),
  ToCurrencyID: Joi.number().min(1).required(),
  Ratio: Joi.number()
    .min(0)
    .max(1000)
    .positive()
    .allow(0)
    .precision(10)
    .label(Words.ratio),
};

const initRecord = {
  RatioID: 0,
  FromCurrencyID: 0,
  ToCurrencyID: 0,
  Ratio: "",
};

const formRef = React.createRef();

const CurrencyRatioModal = ({ isOpen, selectedObject, onOk, onCancel }) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [fromCurrencies, setFromCurrencies] = useState([]);
  const [toCurrencies, setToCurrencies] = useState([]);

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.FromCurrencyID = 0;
    record.ToCurrencyID = 0;
    record.Ratio = 0;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();
    setRecord(initRecord);
    initModal(formRef, selectedObject, setRecord);

    //------

    setProgress(true);

    try {
      const data = await service.getParams();

      const { Currencies } = data;

      const from_currencies = [...Currencies];
      from_currencies.forEach((currency) => {
        currency.FromCurrencyID = currency.CurrencyID;
      });

      const to_currencies = [...Currencies];
      to_currencies.forEach((currency) => {
        currency.ToCurrencyID = currency.CurrencyID;
      });

      setFromCurrencies(from_currencies);
      setToCurrencies(to_currencies);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  });

  const isEdit = selectedObject !== null;

  const handleSubmit = async () => {
    saveModalChanges(
      formConfig,
      selectedObject,
      setProgress,
      onOk,
      clearRecord
    );
  };

  return (
    <ModalWindow
      isOpen={isOpen}
      isEdit={isEdit}
      inProgress={progress}
      disabled={validateForm({ record, schema }) && true}
      onClear={clearRecord}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      width={650}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24}>
            <DropdownItem
              title={Words.from_currency}
              dataSource={fromCurrencies}
              keyColumn="FromCurrencyID"
              valueColumn="Title"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24}>
            <DropdownItem
              title={Words.to_currency}
              dataSource={toCurrencies}
              keyColumn="ToCurrencyID"
              valueColumn="Title"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24}>
            <NumericInputItem
              horizontal
              title={Words.ratio}
              fieldName="Ratio"
              min={0}
              max={1000}
              precision={10}
              maxLength={15}
              step="0.0000000001"
              stringMode
              decimalText
              formConfig={formConfig}
              required
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default CurrencyRatioModal;
