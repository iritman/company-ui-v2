import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "./../../../common/modal-window";
import Words from "../../../../resources/words";
import utils from "../../../../tools/utils";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
} from "../../../../tools/form-manager";
import InputItem from "./../../../form-controls/input-item";
import NumericInputItem from "./../../../form-controls/numeric-input-item";
import DateItem from "./../../../form-controls/date-item";

const schema = {
  ItemID: Joi.number().required(),
  GroupFeatureID: Joi.number().required(),
  ItemCode: Joi.string()
    .min(1)
    .max(50)
    .required()
    .label(Words.code)
    .regex(utils.VALID_REGEX),
  TextValue: Joi.string()
    .max(50)
    // .required()
    .label(Words.value)
    .regex(utils.VALID_REGEX),
  IntValue: Joi.number()
    .min(0)
    .max(999999)
    //   .required()
    .label(Words.value),
  DecimalValue: Joi.number()
    .min(0)
    .max(999999)
    .positive()
    .allow(0)
    .precision(6)
    // .required()
    .label(Words.value),
  DateValue: Joi.string()
    .max(8)
    // .required()
    .label(Words.value)
    .regex(utils.VALID_REGEX),
};

const initRecord = {
  ItemID: 0,
  GroupFeatureID: 0,
  ItemCode: "",
  TextValue: "",
  IntValue: 0,
  DecimalValue: 0,
  DateValue: "",
};

const formRef = React.createRef();

const UserGroupFeatureItemModal = ({
  isOpen,
  selectedObject,
  featureTypeID,
  onOk,
  onCancel,
}) => {
  const [progress, setProgress] = useState(false);
  const [record, setRecord] = useState({});
  const [errors, setErrors] = useState({});

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.ItemCode = "";
    record.TextValue = "";
    record.IntValue = 0;
    record.DecimalValue = 0;
    record.DateValue = "";

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    setRecord(initRecord);
    loadFieldsValue(formRef, initRecord);
    initModal(formRef, selectedObject, setRecord);

    switch (featureTypeID) {
      case 1:
        schema.TextValue = schema.TextValue.required();
        schema.DateValue = schema.DateValue.allow("");
        break;
      case 2:
        schema.TextValue = schema.TextValue.allow("");
        schema.DateValue = schema.DateValue.allow("");
        schema.IntValue = schema.IntValue.required();
        break;
      case 3:
        schema.TextValue = schema.TextValue.allow("");
        schema.DateValue = schema.DateValue.allow("");
        schema.DecimalValue = schema.DecimalValue.required();
        break;
      case 4:
        schema.TextValue = schema.TextValue.allow("");
        schema.DateValue = schema.DateValue.required();
        break;
      default:
        break;
    }
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

  const getItemValueControl = () => {
    let result = <></>;

    switch (featureTypeID) {
      case 1: {
        result = (
          <InputItem
            title={Words.value}
            fieldName="TextValue"
            required
            maxLength={50}
            formConfig={formConfig}
          />
        );
        break;
      }
      case 2: {
        result = (
          <NumericInputItem
            title={Words.value}
            fieldName="IntValue"
            horizontal
            required
            min={0}
            max={999999}
            formConfig={formConfig}
          />
        );
        break;
      }
      case 3: {
        result = (
          <NumericInputItem
            title={Words.value}
            fieldName="DecimalValue"
            min={0}
            max={999999}
            precision={6}
            maxLength={13}
            step="0.000001"
            stringMode
            decimalText
            formConfig={formConfig}
            horizontal
            required
          />
        );
        break;
      }
      case 4: {
        result = (
          <DateItem
            horizontal
            required
            title={Words.value}
            fieldName="DateValue"
            formConfig={formConfig}
          />
        );
        break;
      }
      default: {
        result = <></>;
        break;
      }
    }

    return result;
  };

  //------

  return (
    <ModalWindow
      isOpen={isOpen}
      isEdit={isEdit}
      inProgress={progress}
      disabled={validateForm({ record, schema }) && true}
      onClear={clearRecord}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      width={550}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24}>
            <InputItem
              title={Words.code}
              fieldName="ItemCode"
              maxLength={50}
              formConfig={formConfig}
              required
              autoFocus
            />
          </Col>
          <Col xs={24}>{getItemValueControl()}</Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default UserGroupFeatureItemModal;
