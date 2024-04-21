import React from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "./../../../common/modal-window";
import Words from "../../../../resources/words";
import { validateForm, loadFieldsValue } from "../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "./../../../contexts/modal-context";
import DateItem from "./../../../form-controls/date-item";
import { handleError } from "./../../../../tools/form-manager";

const schema = {
  FromDate: Joi.string().required(),
  ToDate: Joi.string().required(),
};

const initRecord = {
  FromDate: "",
  ToDate: "",
};

const formRef = React.createRef();

const WorkShiftDeleteModal = ({ isOpen, selectedObject, onSave, onCancel }) => {
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
    record.FromDate = "";
    record.ToDate = "";

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(() => {
    resetContext();
    setRecord(initRecord);
    loadFieldsValue(formRef, initRecord);
  });

  const handleSubmit = async () => {
    setProgress(true);
    try {
      await onSave(record);
    } catch (ex) {
      handleError(ex);
    }
    setProgress(false);
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
      title={Words.delete_work_shifts}
      onCancel={onCancel}
      width={700}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[10, 5]} style={{ marginLeft: 1 }}>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.from_date}
              fieldName="FromDate"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.to_date}
              fieldName="ToDate"
              formConfig={formConfig}
              required
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default WorkShiftDeleteModal;
