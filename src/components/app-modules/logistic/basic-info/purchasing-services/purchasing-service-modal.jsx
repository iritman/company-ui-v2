import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Button } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../../common/modal-window";
import Words from "../../../../../resources/words";
import utils from "../../../../../tools/utils";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
  handleError,
} from "../../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "../../../../contexts/modal-context";
import InputItem from "../../../../form-controls/input-item";
import DropdownItem from "../../../../form-controls/dropdown-item";
import service from "../../../../../services/logistic/basic-info/purchasing-services-service";

const schema = {
  ServiceID: Joi.number().required(),
  ServiceGroupID: Joi.number().min(1).required(),
  MeasureUnitID: Joi.number().min(1).required(),
  Title: Joi.string().max(50).regex(utils.VALID_REGEX).label(Words.title),
};

const initRecord = {
  ServiceID: 0,
  ServiceGroupID: 0,
  MeasureUnitID: 0,
  Title: "",
};

const formRef = React.createRef();

const PurchasingServiceModal = ({ isOpen, selectedObject, onCancel, onOk }) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const resetContext = useResetContext();

  const [serviceGroups, setServiceGroups] = useState([]);
  const [measureUnits, setMeasureUnits] = useState([]);

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.ServiceGroupID = 0;
    record.MeasureUnitID = 0;
    record.Title = "";

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();
    setRecord(initRecord);
    initModal(formRef, selectedObject, setRecord);

    setProgress(true);
    try {
      const data = await service.getParams();

      const { ServiceGroups, MeasureUnits } = data;

      setServiceGroups(ServiceGroups);
      setMeasureUnits(MeasureUnits);
    } catch (err) {
      handleError(err);
    }
    setProgress(false);
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
  const is_disabled = validateForm({ record, schema }) && true;

  const getFooterButtons = () => {
    let buttons = [
      <Button key="clear-button" onClick={clearRecord}>
        {Words.clear}
      </Button>,
      <Button
        key="submit-button"
        type="primary"
        onClick={handleSubmit}
        loading={progress}
        disabled={is_disabled}
      >
        {Words.submit}
      </Button>,
    ];

    return buttons;
  };

  return (
    <ModalWindow
      isOpen={isOpen}
      isEdit={isEdit}
      disabled={is_disabled}
      footer={getFooterButtons()}
      onCancel={onCancel}
      width={750}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.service_group}
              dataSource={serviceGroups}
              keyColumn="ServiceGroupID"
              valueColumn="Title"
              formConfig={formConfig}
              required
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.measure_unit}
              dataSource={measureUnits}
              keyColumn="MeasureUnitID"
              valueColumn="Title"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24}>
            <InputItem
              title={Words.title}
              fieldName="Title"
              showCount
              maxLength={50}
              formConfig={formConfig}
              required
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default PurchasingServiceModal;
