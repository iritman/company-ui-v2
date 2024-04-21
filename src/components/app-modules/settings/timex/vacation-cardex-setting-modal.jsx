import React from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Typography } from "antd";
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
import utils from "./../../../../tools/utils";
import {
  useModalContext,
  useResetContext,
} from "./../../../contexts/modal-context";

const { Text } = Typography;

const schema = {
  SettingID: Joi.number().required(),
  CardexYear: Joi.number().min(1400).required().label(Words.year),
  TotalValidPersonalVacationInMin: Joi.number()
    .min(1)
    .max(144000)
    .required()
    .label(Words.total_valid_personal_vacation),
};

const initRecord = {
  SettingID: 0,
  CardexYear: parseInt(utils.currentPersianDateWithoutSlash().substring(0, 4)),
  TotalValidPersonalVacationInMin: 0,
};

const formRef = React.createRef();

const VacationCardexSettingModal = ({
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
    record.CardexYear = parseInt(
      utils.currentPersianDateWithoutSlash().substring(0, 4)
    );
    record.TotalValidPersonalVacationInMin = 0;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(() => {
    resetContext();
    setRecord(initRecord);
    loadFieldsValue(formRef, initRecord);
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
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24}>
            <NumericInputItem
              horizontal
              required
              title={Words.year}
              fieldName="CardexYear"
              min={1400}
              max={1499}
              formConfig={formConfig}
            />
          </Col>

          <Col xs={20}>
            <NumericInputItem
              horizontal
              required
              title={Words.total_valid_personal_vacation_in_min}
              fieldName="TotalValidPersonalVacationInMin"
              min={1}
              max={144000}
              formConfig={formConfig}
            />
          </Col>
          {record.TotalValidPersonalVacationInMin > 0 && (
            <Col xs={4}>
              <Form.Item>
                <Text>
                  {utils.farsiNum(
                    utils.minToTime(record.TotalValidPersonalVacationInMin)
                  )}
                </Text>
              </Form.Item>
            </Col>
          )}
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default VacationCardexSettingModal;
