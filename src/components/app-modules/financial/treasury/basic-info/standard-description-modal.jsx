import React from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../../common/modal-window";
import Words from "../../../../../resources/words";
import utils from "../../../../../tools/utils";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
} from "../../../../../tools/form-manager";
import InputItem from "../../../../form-controls/input-item";
import {
  useModalContext,
  useResetContext,
} from "../../../../contexts/modal-context";

const schema = {
  StandardDetailsID: Joi.number().required(),
  DetailsText: Joi.string()
    .min(5)
    .max(150)
    .regex(utils.VALID_REGEX)
    .label(Words.standard_description),
};

const initRecord = {
  StandardDetailsID: 0,
  DetailsText: "",
};

const formRef = React.createRef();

const StandardDescriptionModal = ({
  isOpen,
  selectedObject,
  onOk,
  onCancel,
}) => {
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
    record.DetailsText = "";

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();
    setRecord(initRecord);
    loadFieldsValue(formRef, initRecord);
    initModal(formRef, selectedObject, setRecord);
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
      width={750}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24}>
            <InputItem
              title={Words.descriptions}
              fieldName="DetailsText"
              //   multiline
              //   rows={7}
              //   showCount
              maxLength={150}
              formConfig={formConfig}
              required
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default StandardDescriptionModal;
