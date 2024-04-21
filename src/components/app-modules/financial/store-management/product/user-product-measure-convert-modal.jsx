import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../../common/modal-window";
import Words from "../../../../../resources/words";
// import utils from "../../../../tools/utils";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
} from "../../../../../tools/form-manager";
// import InputItem from "./../../../form-controls/input-item";
import NumericInputItem from "../../../../form-controls/numeric-input-item";
import DropdownItem from "../../../../form-controls/dropdown-item";
// import SwitchItem from "./../../../form-controls/switch-item";

const schema = {
  ConvertID: Joi.number().required(),
  ProductID: Joi.number().required(),
  FromUnitID: Joi.number().min(1).required(),
  ToUnitID: Joi.number().min(1).required(),
  Rate: Joi.number()
    .min(0)
    .max(999999)
    .positive()
    .allow(0)
    .precision(4)
    .label(Words.rate),
  TolerancePercent: Joi.number().required().label(Words.tolerance),
};

const initRecord = (productID) => {
  return {
    ConvertID: 0,
    ProductID: productID,
    FromUnitID: 0,
    ToUnitID: 0,
    Rate: 0,
    TolerancePercent: 0,
  };
};

const formRef = React.createRef();

const UserProductMeasureUnitModal = ({
  isOpen,
  product,
  selectedMeasureConvert,
  measureUnits,
  onOk,
  onCancel,
}) => {
  const [progress, setProgress] = useState(false);
  const [record, setRecord] = useState({});
  const [errors, setErrors] = useState({});

  const [fromMeasureUnits, setFromMeasureUnits] = useState([]);
  const [toMeasureUnits, setToMeasureUnits] = useState([]);

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.FromUnitID = 0;
    record.ToUnitID = 0;
    record.Rate = 0;
    record.TolerancePercent = 0;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    setRecord(initRecord(product ? product.ProductID : 0));

    //------

    const from_measure_units = [...measureUnits];
    from_measure_units.forEach((mu) => {
      mu.FromUnitID = mu.MeasureUnitID;
    });
    setFromMeasureUnits(from_measure_units);

    const to_measure_units = [...measureUnits];
    to_measure_units.forEach((mu) => {
      mu.ToUnitID = mu.MeasureUnitID;
    });
    setToMeasureUnits(to_measure_units);

    //------

    initModal(formRef, selectedMeasureConvert, setRecord);
  });

  const isEdit = selectedMeasureConvert !== null;

  const handleSubmit = async () => {
    await saveModalChanges(
      formConfig,
      selectedMeasureConvert,
      setProgress,
      onOk,
      clearRecord,
      false
    );

    onCancel();
  };

  //------

  const filtered_from_measure_units = fromMeasureUnits.filter(
    (fu) => fu.MeasureUnitID !== record.ToUnitID
  );
  const filtered_to_measure_units = toMeasureUnits.filter(
    (tu) => tu.MeasureUnitID !== record.FromUnitID
  );

  return (
    <ModalWindow
      isOpen={isOpen}
      isEdit={isEdit}
      title={Words.product_feature}
      inProgress={progress}
      disabled={validateForm({ record, schema }) && true}
      onClear={clearRecord}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      width={700}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.from_measure_unit}
              dataSource={filtered_from_measure_units}
              keyColumn="FromUnitID"
              valueColumn="Title"
              formConfig={formConfig}
              required
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.to_measure_unit}
              dataSource={filtered_to_measure_units}
              keyColumn="ToUnitID"
              valueColumn="Title"
              formConfig={formConfig}
              required
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              title={Words.rate}
              fieldName="Rate"
              min={0}
              max={999999}
              precision={4}
              maxLength={7}
              step="0.0001"
              stringMode
              decimalText
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              title={Words.tolerance}
              fieldName="TolerancePercent"
              min={0}
              max={100}
              formConfig={formConfig}
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default UserProductMeasureUnitModal;
