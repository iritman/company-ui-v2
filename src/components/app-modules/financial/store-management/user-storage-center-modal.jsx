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
import DropdownItem from "./../../../form-controls/dropdown-item";
import { handleError } from "./../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "./../../../contexts/modal-context";
import service from "../../../../services/financial/store-mgr/user-storage-centers-service";

const schema = {
  CenterID: Joi.number().required(),
  Title: Joi.string()
    .min(2)
    .max(50)
    .required()
    .label(Words.title)
    .regex(utils.VALID_REGEX),
  CityID: Joi.number(),
  Tel: Joi.string()
    .min(2)
    .max(50)
    .required()
    .regex(utils.VALID_REGEX)
    .label(Words.tel_no),
  PostalCode: Joi.string()
    .min(2)
    .max(50)
    .required()
    .regex(utils.VALID_REGEX)
    .label(Words.postal_code),
  Address: Joi.string()
    .min(10)
    .max(250)
    .allow("")
    .regex(utils.VALID_REGEX)
    .label(Words.address),
};

const initRecord = {
  CenterID: 0,
  Title: "",
  CityID: 0,
  Tel: "",
  PostalCode: "",
  Address: "",
};

const formRef = React.createRef();

const UserStorageCenterModal = ({ isOpen, selectedObject, onOk, onCancel }) => {
  const {
    progress,
    setProgress,
    record,
    setRecord,
    cities,
    setCities,
    errors,
    setErrors,
  } = useModalContext();

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.Title = "";
    record.CityID = 0;
    record.Tel = "";
    record.PostalCode = "";
    record.Address = "";

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

      const { Cities } = data;

      setCities(Cities);
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
      width={850}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.title}
              fieldName="Title"
              required
              autoFocus
              maxLength={50}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.city}
              dataSource={cities}
              keyColumn="CityID"
              valueColumn="Title"
              formConfig={formConfig}
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.tel_no}
              fieldName="Tel"
              formConfig={formConfig}
              maxLength={50}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.postal_code}
              fieldName="PostalCode"
              formConfig={formConfig}
              maxLength={50}
              required
            />
          </Col>
          <Col xs={24}>
            <InputItem
              horizontal
              title={Words.address}
              fieldName="Address"
              formConfig={formConfig}
              multiline
              rows={3}
              maxLength={250}
              showCount
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default UserStorageCenterModal;
