import React from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Alert, Typography } from "antd";
import Joi from "joi-browser";
import ModalWindow from "./../../../common/modal-window";
import Words from "../../../../resources/words";
import {
  validateForm,
  loadFieldsValue,
  //   initModal,
  // saveModalChanges,
} from "../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "./../../../contexts/modal-context";
import DateItem from "./../../../form-controls/date-item";
import SwitchItem from "./../../../form-controls/switch-item";
import { handleError } from "./../../../../tools/form-manager";

const { Text } = Typography;

const schema = {
  FromDate: Joi.string().required(),
  ToDate: Joi.string().required(),
  MaxDate: Joi.string().allow("").required(),
  SkipJomeDays: Joi.boolean(),
  SkipHolidays: Joi.boolean(),
};

const initRecord = {
  FromDate: "",
  ToDate: "",
  MaxDate: "",
  SkipJomeDays: false,
  SkipHolidays: false,
};

const formRef = React.createRef();

const WorkShiftRepeatModal = ({ isOpen, selectedObject, onSave, onCancel }) => {
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
    record.MaxDate = "";
    record.SkipJomeDays = false;
    record.SkipHolidays = false;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(() => {
    resetContext();
    setRecord(initRecord);
    // initModal(formRef, selectedObject, setRecord);
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
    // saveModalChanges(
    //   formConfig,
    //   selectedObject,
    //   setProgress,
    //   onSave,
    //   clearRecord
    // );
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
      title={Words.repeat_work_shifts}
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
          <Col xs={12} md={12}>
            <SwitchItem
              title={Words.skip_jome_days}
              fieldName="SkipJomeDays"
              initialValue={false}
              checkedTitle={Words.active}
              unCheckedTitle={Words.inactive}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={12} md={12}>
            <SwitchItem
              title={Words.skip_holidays}
              fieldName="SkipHolidays"
              initialValue={false}
              checkedTitle={Words.active}
              unCheckedTitle={Words.inactive}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24}>
            <Form.Item>
              <Alert
                showIcon
                type="warning"
                message={
                  <Text style={{ fontSize: 13 }}>
                    {Words.messages.repeat_work_shifts_message}
                  </Text>
                }
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.repeat_work_shifts_to_date}
              fieldName="MaxDate"
              formConfig={formConfig}
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default WorkShiftRepeatModal;
