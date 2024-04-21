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
} from "../../../../tools/form-manager";
import NumericInputItem from "./../../../form-controls/numeric-input-item";
import SwitchItem from "./../../../form-controls/switch-item";
import DateItem from "./../../../form-controls/date-item";

const schema = {
  FinancialYearID: Joi.number().required(),
  LedgerID: Joi.number().required(),
  YearNo: Joi.number()
    .min(1400)
    .max(1499)
    .required()
    .label(Words.financial_year),
  StartDate: Joi.string(),
  FinishDate: Joi.string(),
  IsActive: Joi.boolean(),
};

const initRecord = {
  FinancialYearID: 0,
  LedgerID: 0,
  YearNo: 0,
  StartDate: "",
  FinishDate: "",
  IsActive: true,
};

const formRef = React.createRef();

const LedgerFinancialYearModal = ({
  isOpen,
  selectedObject,
  onOk,
  onCancel,
}) => {
  const [progress, setProgress] = useState(false);
  const [errors, setErrors] = useState({});
  const [record, setRecord] = useState({});

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.YearNo = 0;
    record.StartDate = "";
    record.FinishDate = "";
    record.IsActive = true;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    setRecord(initRecord);
    loadFieldsValue(formRef, initRecord);
    initModal(formRef, selectedObject, setRecord);
  });

  const isEdit = selectedObject !== null;

  const handleSubmit = async () => {
    await saveModalChanges(
      formConfig,
      selectedObject,
      setProgress,
      onOk,
      clearRecord
    );

    onCancel();
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
      width={750}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              required
              autoFocus
              title={Words.financial_year}
              fieldName="YearNo"
              min={1400}
              max={1499}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <SwitchItem
              title={Words.status}
              fieldName="IsActive"
              initialValue={true}
              checkedTitle={Words.active}
              unCheckedTitle={Words.inactive}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              required
              title={Words.start_date}
              fieldName="StartDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              required
              title={Words.finish_date}
              fieldName="FinishDate"
              formConfig={formConfig}
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default LedgerFinancialYearModal;
