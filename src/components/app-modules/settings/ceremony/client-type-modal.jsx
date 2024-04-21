import React from "react";
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
import {
  useModalContext,
  useResetContext,
} from "./../../../contexts/modal-context";

const schema = {
  ClientTypeID: Joi.number().required(),
  ClientTypeTitle: Joi.string()
    .min(2)
    .max(50)
    .required()
    .label(Words.title)
    .regex(utils.VALID_REGEX),
  Dishes: Joi.string()
    .min(5)
    .max(512)
    .required()
    .regex(utils.VALID_REGEX)
    .label(Words.dishes),
  Foods: Joi.string()
    .min(5)
    .max(512)
    .required()
    .regex(utils.VALID_REGEX)
    .label(Words.foods),
  DetailsText: Joi.string()
    .min(5)
    .max(512)
    .required()
    .regex(utils.VALID_REGEX)
    .label(Words.descriptions),
};

const initRecord = {
  ClientTypeID: 0,
  ClientTypeTitle: "",
  Dishes: "",
  Foods: "",
  DetailsText: "",
};

const formRef = React.createRef();

const ClientTypeModal = ({ isOpen, selectedObject, onOk, onCancel }) => {
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
    record.ClientTypeTitle = "";
    record.Dishes = "";
    record.Foods = "";
    record.DetailsText = "";

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(() => {
    resetContext();
    setRecord(initRecord);
    initModal(formRef, selectedObject, setRecord);
  });

  const handleSubmit = async () => {
    saveModalChanges(
      formConfig,
      selectedObject,
      setProgress,
      onOk,
      clearRecord
    );
  };

  const isEdit = selectedObject !== null;

  return (
    <ModalWindow
      isOpen={isOpen}
      isEdit={isEdit}
      inProgress={progress}
      disabled={validateForm({ record, schema }) && true}
      onClear={clearRecord}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      width={850}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24}>
            <InputItem
              title={Words.title}
              fieldName="ClientTypeTitle"
              required
              autoFocus
              maxLength={50}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24}>
            <InputItem
              title={Words.dishes}
              fieldName="Dishes"
              multiline
              rows={7}
              showCount
              maxLength={512}
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24}>
            <InputItem
              title={Words.foods}
              fieldName="Foods"
              multiline
              rows={7}
              showCount
              maxLength={512}
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24}>
            <InputItem
              title={Words.descriptions}
              fieldName="DetailsText"
              multiline
              rows={7}
              showCount
              maxLength={512}
              formConfig={formConfig}
              required
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default ClientTypeModal;
