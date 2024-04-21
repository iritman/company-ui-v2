import React, { useState } from "react";
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
import DropdownItem from "../../../../form-controls/dropdown-item";
import SwitchItem from "../../../../form-controls/switch-item";

const schema = {
  PFID: Joi.number().required(),
  ProductID: Joi.number().required(),
  GroupFeatureID: Joi.number().min(1).required(),
  ValueItemID: Joi.number().min(1).required(),
  BoolValue: Joi.bool(),
  StringValue: Joi.string()
    .allow("")
    .max(250)
    .label(Words.value)
    .regex(utils.VALID_REGEX),
};

const initRecord = (productID) => {
  return {
    PFID: 0,
    ProductID: productID,
    GroupFeatureID: 0,
    ValueItemID: 0,
    BoolValue: false,
    StringValue: "",
  };
};

const formRef = React.createRef();

const UserProductFeatureModal = ({
  isOpen,
  product,
  selectedFeature,
  features,
  onOk,
  onCancel,
}) => {
  const [progress, setProgress] = useState(false);
  const [record, setRecord] = useState({});
  const [errors, setErrors] = useState({});

  const [featureTypeID, setFeatureTypeID] = useState(0);
  const [valueItems, setValueItems] = useState([]);

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.GroupFeatureID = 0;
    record.ValueItemID = 0;
    record.BoolValue = false;
    record.StringValue = "";

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  const setSchema = (feature_type_id) => {
    if (feature_type_id === 5) {
      schema.StringValue = Joi.string()
        .max(250)
        .required()
        .label(Words.value)
        .regex(utils.VALID_REGEX);

      schema.ValueItemID = Joi.number();
    } else if (feature_type_id === 6) {
      schema.StringValue = Joi.string()
        .allow("")
        .max(250)
        .label(Words.value)
        .regex(utils.VALID_REGEX);

      schema.ValueItemID = Joi.number();
    } else {
      schema.StringValue = Joi.string()
        .allow("")
        .max(250)
        .label(Words.value)
        .regex(utils.VALID_REGEX);

      schema.ValueItemID = Joi.number().min(1).required();
    }
  };

  useMount(async () => {
    setRecord(initRecord(product ? product.ProductID : 0));
    initModal(formRef, selectedFeature, setRecord);

    if (selectedFeature !== null) {
      if (selectedFeature.FeatureTypeID < 5) {
        let value_items = [];

        features
          .find((f) => f.GroupFeatureID === selectedFeature.GroupFeatureID)
          ?.Items.forEach((i) => {
            value_items = [...value_items, { ...i, ValueItemID: i.ItemID }];
          });

        setValueItems(value_items);
      }

      setFeatureTypeID(selectedFeature.FeatureTypeID);
      setSchema(selectedFeature.FeatureTypeID);
    }
  });

  const isEdit = selectedFeature !== null;

  const handleSubmit = async () => {
    await saveModalChanges(
      formConfig,
      selectedFeature,
      setProgress,
      onOk,
      clearRecord,
      false
    );

    onCancel();
  };

  const handleChangeFeature = (value) => {
    const selected_feature = features.find((f) => f.GroupFeatureID === value);

    const selected_FeatureTypeID = selected_feature?.FeatureTypeID;

    setFeatureTypeID(selected_FeatureTypeID);
    setSchema(selected_FeatureTypeID);

    const rec = { ...record };
    rec.GroupFeatureID = value || 0;
    rec.ValueItemID = 0;
    rec.BoolValue = false;
    rec.StringValue = "";
    setRecord(rec);
    loadFieldsValue(formRef, rec);

    //---

    if (selected_FeatureTypeID < 5) {
      let value_items = [];

      selected_feature.Items.forEach((i) => {
        value_items = [...value_items, { ...i, ValueItemID: i.ItemID }];
      });

      setValueItems(value_items);
    }
  };

  //------

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
      width={600}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24}>
            <DropdownItem
              title={Words.feature}
              dataSource={features}
              keyColumn="GroupFeatureID"
              valueColumn="Title"
              formConfig={formConfig}
              onChange={handleChangeFeature}
              required
              autoFocus
            />
          </Col>

          {featureTypeID < 5 && (
            <Col xs={24}>
              <DropdownItem
                title={Words.value}
                dataSource={valueItems}
                keyColumn="ValueItemID"
                valueColumn="ItemCode"
                formConfig={formConfig}
                required
              />
            </Col>
          )}

          {featureTypeID === 5 && (
            <Col xs={24}>
              <InputItem
                title={Words.value}
                fieldName="StringValue"
                maxLength={50}
                formConfig={formConfig}
                required
              />
            </Col>
          )}

          {featureTypeID === 6 && (
            <Col xs={24}>
              <SwitchItem
                title={Words.value}
                fieldName="BoolValue"
                initialValue={false}
                checkedTitle={Words.yes}
                unCheckedTitle={Words.no}
                formConfig={formConfig}
                required
              />
            </Col>
          )}
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default UserProductFeatureModal;
