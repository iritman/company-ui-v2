import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Divider, Typography, Space } from "antd";
import Joi from "joi-browser";
import ModalWindow from "./../../../common/modal-window";
import Words from "../../../../resources/words";
import Colors from "./../../../../resources/colors";
import utils from "./../../../../tools/utils";
import service from "../../../../services/financial/store-mgr/user-baches-service";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
} from "../../../../tools/form-manager";
import DropdownItem from "./../../../form-controls/dropdown-item";
import FeaturesForm from "./user-bach-features-form";
import { handleError } from "./../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "./../../../contexts/modal-context";

const { Text } = Typography;

const schema = {
  BachID: Joi.number().required(),
  ProductID: Joi.number().min(1).required().label(Words.product),
  ValueList: Joi.array(),
};

const initRecord = {
  BachID: 0,
  ProductID: 0,
  ValueList: [],
};

const formRef = React.createRef();

const UserBachModal = ({ isOpen, selectedObject, onOk, onCancel }) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [products, setProducts] = useState([]);
  const [features, setFeatures] = useState([]);
  const [featureValues, setFeatureValues] = useState([]);

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.ProductID = 0;
    record.ValueList = [];
    setFeatures([]);

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  const convertType = (value, valueTypeID) => {
    let result = value;

    switch (valueTypeID) {
      case 1:
        result = parseInt(value);
        break;
      case 2:
        result = parseFloat(value);
        break;
      case 3:
        result = value;
        break;
      case 4:
        result = value === "true";
        break;
      case 5:
        result = value;
        break;
      case 6:
        result = value;
        break;
      default:
        result = value;
        break;
    }

    return result;
  };

  const loadFeatureAndValues = () => {
    if (selectedObject) {
      let selected_features = [];

      selectedObject.ValueList.forEach((f) => {
        selected_features = [
          ...selected_features,
          {
            FeatureID: f.FeatureID,
            Title: f.Title,
            ValueTypeID: f.ValueTypeID,
            ValueTypeTitle: f.ValueTypeTitle,
          },
        ];
      });

      setFeatures(selected_features);

      //------

      let selected_values = [];

      selectedObject.ValueList.forEach((f) => {
        selected_values = [
          ...selected_values,
          {
            FeatureID: f.FeatureID,
            FeatureValue: f.FeatureValue,
            ValueTypeID: f.ValueTypeID,
          },
        ];
      });

      setFeatureValues(selected_values);
    }
  };

  useMount(async () => {
    resetContext();
    setRecord(initRecord);

    selectedObject?.ValueList.forEach((v) => {
      v.FeatureValue = convertType(v.FeatureValue, v.ValueTypeID);
    });

    initModal(formRef, selectedObject, setRecord);

    setProgress(true);
    try {
      const data = await service.getParams();

      const { Products } = data;

      setProducts(Products);
    } catch (ex) {
      handleError(ex);
    }
    setProgress(false);

    loadFeatureAndValues();
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

  const getFeatureDefaultValue = (valueTypeID) => {
    let value = null;

    switch (valueTypeID) {
      case 1:
        value = 0;
        break;
      case 2:
        value = 0;
        break;
      case 3:
        value = "";
        break;
      case 4:
        value = false;
        break;
      case 5:
        value = "";
        break;
      case 6:
        value = "";
        break;
      default:
        value = "";
        break;
    }

    return value;
  };

  const handleUpdateFeatureValues = (features) => {
    let fv = [];

    features.forEach((feature) => {
      fv = [
        ...fv,
        {
          FeatureID: feature.FeatureID,
          ValueTypeID: feature.ValueTypeID,
          FeatureValue: getFeatureDefaultValue(feature.ValueTypeID),
        },
      ];
    });

    return fv;
  };

  const handleChangeProduct = async (value) => {
    if (value > 0) {
      setProgress(true);
      try {
        const rec = { ...record };
        rec.ProductID = value || 0;

        const data = await service.getProductFeatures(value);

        setFeatures(data);

        const valueList = handleUpdateFeatureValues(data);
        rec.ValueList = valueList;

        setFeatureValues(valueList);
        setRecord(rec);
      } catch (ex) {
        handleError(ex);
      }

      setProgress(false);
    } else {
      clearRecord();
    }
  };

  const handleChangeFeatureValue = (feature_values) => {
    setFeatureValues(featureValues);

    const rec = { ...record };
    rec.ValueList.forEach((record_feature_value) => {
      record_feature_value.FeatureValue = feature_values.find(
        (fv) => fv.FeatureID === record_feature_value.FeatureID
      ).FeatureValue;
    });
    setRecord(rec);
  };

  return (
    <ModalWindow
      isOpen={isOpen}
      isEdit={isEdit}
      title={Words.bach_info}
      inProgress={progress}
      disabled={validateForm({ record, schema }) && true}
      onClear={clearRecord}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      width={650}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 10]} style={{ marginLeft: 1 }}>
          {selectedObject === null && (
            <Col xs={24}>
              <DropdownItem
                title={Words.product}
                dataSource={products}
                keyColumn="ProductID"
                valueColumn="Title"
                formConfig={formConfig}
                required
                onChange={handleChangeProduct}
              />
            </Col>
          )}

          {selectedObject && (
            <>
              <Col xs={24}>
                <Space>
                  <Text>{`${Words.bach_no}:`}</Text>
                  <Text style={{ color: Colors.red[6] }}>
                    {utils.farsiNum(`${selectedObject.BachID}`)}
                  </Text>
                </Space>
              </Col>

              <Col xs={24}>
                <Space>
                  <Text>{`${Words.product}:`}</Text>
                  <Text
                    style={{ color: Colors.green[6] }}
                  >{`${selectedObject.ProductCode} - ${selectedObject.Title}`}</Text>
                </Space>
              </Col>
              <Col xs={24}>
                <Space>
                  <Text>{`${Words.registerar}:`}</Text>
                  <Text
                    style={{ color: Colors.geekblue[6] }}
                  >{`${selectedObject.RegFirstName} ${selectedObject.RegLastName}`}</Text>
                </Space>
              </Col>
              <Col xs={24}>
                <Space>
                  <Text>{`${Words.reg_date_time}:`}</Text>
                  <Text style={{ color: Colors.geekblue[6] }}>
                    {utils.farsiNum(
                      `${utils.slashDate(
                        selectedObject.RegDate
                      )} - ${utils.colonTime(selectedObject.RegTime)}`
                    )}
                  </Text>
                </Space>
              </Col>
            </>
          )}

          {features.length > 0 && (
            <>
              <Col xs={24}>
                <Divider orientation="right" plain>
                  <Text>{Words.features}</Text>
                </Divider>
              </Col>
              <FeaturesForm
                features={features}
                featureValues={featureValues}
                onChangeFeatureValue={handleChangeFeatureValue}
              />
            </>
          )}
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default UserBachModal;
