import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../../common/modal-window";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
} from "../../../../../tools/form-manager";
import DropdownItem from "../../../../form-controls/dropdown-item";
import SwitchItem from "../../../../form-controls/switch-item";
import TextItem from "./../../../../form-controls/text-item";

const schema = {
  PMID: Joi.number().required(),
  ProductID: Joi.number().required(),
  MeasureUnitID: Joi.number().min(1).required(),
  IsDefault: Joi.boolean(),
};

const initRecord = (productID) => {
  return {
    PMID: 0,
    ProductID: productID,
    MeasureUnitID: 0,
    IsDefault: false,
  };
};

const formRef = React.createRef();

const UserProductMeasureUnitModal = ({
  isOpen,
  product,
  selectedMeasureUnit,
  currentMeasureUnits,
  measureUnits,
  onOk,
  onCancel,
}) => {
  const [progress, setProgress] = useState(false);
  const [record, setRecord] = useState({});
  const [errors, setErrors] = useState({});

  const formConfig = {
    schema,
    record,
    selectedMeasureUnit,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.MeasureUnitID = 0;
    record.IsDefault = false;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    setRecord(initRecord(product ? product.ProductID : 0));

    initModal(formRef, selectedMeasureUnit, setRecord);
  });

  const isEdit = selectedMeasureUnit !== null;

  const handleSubmit = async () => {
    await saveModalChanges(
      formConfig,
      selectedMeasureUnit,
      setProgress,
      onOk,
      clearRecord,
      false
    );

    onCancel();
  };

  //-----------------

  return (
    <ModalWindow
      isOpen={isOpen}
      isEdit={isEdit}
      title={Words.measure_unit}
      inProgress={progress}
      disabled={
        (selectedMeasureUnit !== null && currentMeasureUnits.length === 1) ||
        (validateForm({ record, schema }) && true)
      }
      onClear={clearRecord}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      width={600}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          {selectedMeasureUnit === null && (
            <Col xs={24}>
              <DropdownItem
                title={Words.measure_unit}
                dataSource={measureUnits}
                keyColumn="MeasureUnitID"
                valueColumn="Title"
                formConfig={formConfig}
                required
                autoFocus
              />
            </Col>
          )}

          {selectedMeasureUnit !== null && (
            <>
              <Col xs={24}>
                <TextItem
                  title={Words.measure_unit}
                  value={`${selectedMeasureUnit.MeasureUnitTitle}`}
                  valueColor={Colors.magenta[6]}
                />
              </Col>
              <Col xs={24}>
                <TextItem
                  title={Words.measure_type}
                  value={`${selectedMeasureUnit.MeasureTypeTitle}`}
                  valueColor={Colors.orange[6]}
                />
              </Col>
              {currentMeasureUnits.length === 1 && (
                <Col xs={24}>
                  <TextItem
                    title={Words.default_measure_unit}
                    value={`${
                      selectedMeasureUnit.IsDefault ? Words.yes : Words.no
                    }`}
                    valueColor={
                      selectedMeasureUnit.IsDefault
                        ? Colors.green[6]
                        : Colors.red[6]
                    }
                  />
                </Col>
              )}
            </>
          )}

          {(selectedMeasureUnit === null || currentMeasureUnits.length > 1) && (
            <Col xs={24}>
              <SwitchItem
                title={Words.default_measure_unit}
                fieldName="IsDefault"
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

export default UserProductMeasureUnitModal;
