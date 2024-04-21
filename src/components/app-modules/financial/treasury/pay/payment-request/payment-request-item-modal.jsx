import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../../../common/modal-window";
import Words from "../../../../../../resources/words";
import utils from "../../../../../../tools/utils";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
  handleError,
} from "../../../../../../tools/form-manager";
import service from "../../../../../../services/financial/treasury/pay/payment-requests-service";
import InputItem from "./../../../../../form-controls/input-item";
import NumericInputItem from "./../../../../../form-controls/numeric-input-item";
import DateItem from "./../../../../../form-controls/date-item";
import DropdownItem from "./../../../../../form-controls/dropdown-item";

const schema = {
  ItemID: Joi.number().required(),
  RequestID: Joi.number().required(),
  ItemTypeID: Joi.number().min(1).required().label(Words.item_type),
  Price: Joi.number().min(10).required().label(Words.price),
  PaymentDate: Joi.string(),
  DueDate: Joi.string(),
  StandardDetailsID: Joi.number(),
  DetailsText: Joi.string()
    .min(5)
    .max(250)
    .allow("")
    .regex(utils.VALID_REGEX)
    .label(Words.descriptions),
};

const initRecord = {
  ItemID: 0,
  RequestID: 0,
  ItemTypeID: 0,
  Price: 0,
  PaymentDate: "",
  DueDate: "",
  StandardDetailsID: 0,
  DetailsText: "",
};

const formRef = React.createRef();

const PaymentRequestItemModal = ({
  isOpen,
  selectedObject,
  onOk,
  onCancel,
}) => {
  const [progress, setProgress] = useState(false);
  const [errors, setErrors] = useState({});
  const [record, setRecord] = useState({});

  const [itemTypes, setItemTypes] = useState([]);
  const [standardDetails, setStandardDetails] = useState([]);

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.ItemTypeID = 0;
    record.Price = 0;
    record.PaymentDate = "";
    record.DueDate = "";
    record.StandardDetailsID = 0;
    record.DetailsText = "";

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    setRecord(initRecord);
    loadFieldsValue(formRef, initRecord);
    initModal(formRef, selectedObject, setRecord);

    //------

    setProgress(true);

    try {
      const data = await service.getParams();

      let { ItemTypes, StandardDetails } = data;

      setItemTypes(ItemTypes);
      setStandardDetails(StandardDetails);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  });

  const isEdit = selectedObject !== null;

  const handleSubmit = async () => {
    await saveModalChanges(
      formConfig,
      selectedObject,
      setProgress,
      onOk,
      clearRecord,
      false // showMessage
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
            <DropdownItem
              title={Words.item_type}
              dataSource={itemTypes}
              keyColumn="ItemTypeID"
              valueColumn="Title"
              formConfig={formConfig}
              required
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              title={Words.price}
              fieldName="Price"
              min={10}
              max={9999999999}
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              required
              title={Words.payment_date}
              fieldName="PaymentDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              required
              title={Words.due_date}
              fieldName="DueDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24}>
            <DropdownItem
              title={Words.standard_details_text}
              dataSource={standardDetails}
              keyColumn="StandardDetailsID"
              valueColumn="StandardDetailsText"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24}>
            <InputItem
              title={Words.standard_description}
              fieldName="DetailsText"
              multiline
              rows={7}
              showCount
              maxLength={250}
              formConfig={formConfig}
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default PaymentRequestItemModal;
