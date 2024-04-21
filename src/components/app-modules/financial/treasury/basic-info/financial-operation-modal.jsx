import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Divider, Typography, Alert } from "antd";
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
import service from "../../../../../services/financial/treasury/basic-info/financial-operations-service";
import InputItem from "../../../../form-controls/input-item";
import DropdownItem from "../../../../form-controls/dropdown-item";
import SwitchItem from "../../../../form-controls/switch-item";
import {
  useModalContext,
  useResetContext,
} from "../../../../contexts/modal-context";
import RelatedTafsilTypesTree, {
  getTafsilTypeLevels,
} from "./related-tafsil-types-tree";

const { Text } = Typography;

const schema = {
  OperationID: Joi.number().required(),
  Title: Joi.string()
    .min(2)
    .max(50)
    .required()
    .label(Words.title)
    .regex(utils.VALID_REGEX),
  OperationTypeID: Joi.number()
    .min(1)
    .required()
    .label(Words.financial_operation_type),
  ItemTypeID: Joi.number().min(1).required().label(Words.item_type),
  MoeinID: Joi.number().min(1).required().label(Words.account_moein),
  PaperNatureID: Joi.number().label(Words.paper_nature),
  DurationTypeID: Joi.number().label(Words.duration_type),
  IsDefault: Joi.boolean(),
  IsActive: Joi.boolean(),
  TafsilTypeID4: Joi.number(),
  FixSide4: Joi.number(),
  TafsilTypeID5: Joi.number(),
  FixSide5: Joi.number(),
  TafsilTypeID6: Joi.number(),
  FixSide6: Joi.number(),
};

const initRecord = {
  OperationID: 0,
  Title: "",
  OperationTypeID: 0,
  ItemTypeID: 0,
  MoeinID: 0,
  PaperNatureID: 0,
  DurationTypeID: 0,
  IsDefault: false,
  IsActive: true,
  TafsilTypeID4: 0,
  FixSide4: 0,
  TafsilTypeID5: 0,
  FixSide5: 0,
  TafsilTypeID6: 0,
  FixSide6: 0,
};

const formRef = React.createRef();

const FinancialOperationModal = ({
  isOpen,
  selectedObject,
  onOk,
  onCancel,
}) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [moeins, setMoeins] = useState([]);
  const [tafsilTypes, setTafsilTypes] = useState([]);
  const [operationTypes, setOperationTypes] = useState([]);
  const [operationTafsilTypes, setOperationTafsilTypes] = useState([]);
  const [operationItemTypes, setOperationItemTypes] = useState([]);
  const [paperNatures, setPaperNatures] = useState([]);
  const [durationTypes, setDurationTypes] = useState([]);

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
    record.OperationTypeID = 0;
    record.ItemTypeID = 0;
    record.MoeinID = 0;
    record.PaperNatureID = 0;
    record.DurationTypeID = 0;
    record.IsDefault = false;
    record.IsActive = true;
    record.TafsilTypeID4 = 0;
    record.FixSide4 = 0;
    record.TafsilTypeID5 = 0;
    record.FixSide5 = 0;
    record.TafsilTypeID6 = 0;
    record.FixSide6 = 0;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();
    setRecord(initRecord);
    loadFieldsValue(formRef, initRecord);
    initModal(formRef, selectedObject, setRecord);

    //------

    setProgress(true);

    try {
      const data = await service.getParams();

      let {
        Moeins,
        TafsilTypes,
        OperationTypes,
        OperationTafsilTypes,
        OperationItemTypes,
        PaperNatures,
        DurationTypes,
      } = data;

      setMoeins(Moeins);
      setTafsilTypes(TafsilTypes);
      setOperationTypes(OperationTypes);
      setOperationTafsilTypes(OperationTafsilTypes);
      setOperationItemTypes(OperationItemTypes);
      setPaperNatures(PaperNatures);
      setDurationTypes(DurationTypes);
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

  //------

  const operation_tafsil_types = operationTafsilTypes.filter(
    (tt) => tt.OperationTypeID === record.OperationTypeID
  );
  const filtered_tafsil_types_level_4 = [...operation_tafsil_types];
  const filtered_tafsil_types_level_5 = [...operation_tafsil_types];
  const filtered_tafsil_types_level_6 = [...operation_tafsil_types];

  filtered_tafsil_types_level_4.forEach((tt) => {
    tt.TafsilTypeID4 = tt.TafsilTypeID;
  });

  filtered_tafsil_types_level_5.forEach((tt) => {
    tt.TafsilTypeID5 = tt.TafsilTypeID;
  });

  filtered_tafsil_types_level_6.forEach((tt) => {
    tt.TafsilTypeID6 = tt.TafsilTypeID;
  });

  //------

  // const fix_sides_4 = [];
  // const fix_sides_5 = [];
  // const fix_sides_6 = [];

  //------

  const levels = getTafsilTypeLevels(record.MoeinID, tafsilTypes);

  // const getTafsilTypeDdlStatus = (levelID) =>
  //   levels.filter((level) => level.LevelID === levelID).length === 0;

  const getOperationItemTypes = () => {
    return operationItemTypes.filter(
      (i) => i.OperationTypeID === record.OperationTypeID
    );
  };

  //------

  return (
    <ModalWindow
      isOpen={isOpen}
      isEdit={isEdit}
      inProgress={progress}
      disabled={validateForm({ record, schema }) && true}
      onClear={clearRecord}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      width={800}
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
              title={Words.financial_operation_type}
              dataSource={operationTypes}
              keyColumn="OperationTypeID"
              valueColumn="Title"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.account_moein}
              dataSource={moeins}
              keyColumn="MoeinID"
              valueColumn="Title"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.item_type}
              dataSource={getOperationItemTypes()}
              keyColumn="ItemTypeID"
              valueColumn="ItemTypeTitle"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.paper_nature}
              dataSource={paperNatures}
              keyColumn="PaperNatureID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.duration_type}
              dataSource={durationTypes}
              keyColumn="DurationTypeID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={8}>
            <SwitchItem
              title={Words.is_default}
              fieldName="IsDefault"
              initialValue={false}
              checkedTitle={Words.yes}
              unCheckedTitle={Words.no}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={8}>
            <SwitchItem
              title={Words.status}
              fieldName="IsActive"
              initialValue={true}
              checkedTitle={Words.active}
              unCheckedTitle={Words.inactive}
              formConfig={formConfig}
            />
          </Col>
          {/* <Col xs={24}>
            <Divider orientation="right">
              <Text>{Words.tafsil_levels}</Text>
            </Divider>
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.tafsil_type_level_4}
              dataSource={filtered_tafsil_types_level_4}
              keyColumn="TafsilTypeID4"
              valueColumn="TafsilTypeTitle"
              formConfig={formConfig}
              disabled={getTafsilTypeDdlStatus(4)}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.fix_side_4}
              dataSource={fix_sides_4}
              keyColumn="FixSide4"
              valueColumn="Title"
              formConfig={formConfig}
              disabled={fix_sides_4.length === 0}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.tafsil_type_level_5}
              dataSource={filtered_tafsil_types_level_5}
              keyColumn="TafsilTypeID5"
              valueColumn="TafsilTypeTitle"
              formConfig={formConfig}
              disabled={getTafsilTypeDdlStatus(5)}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.fix_side_5}
              dataSource={fix_sides_5}
              keyColumn="FixSide5"
              valueColumn="Title"
              formConfig={formConfig}
              disabled={fix_sides_5.length === 0}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.tafsil_type_level_6}
              dataSource={filtered_tafsil_types_level_6}
              keyColumn="TafsilTypeID6"
              valueColumn="TafsilTypeTitle"
              formConfig={formConfig}
              disabled={getTafsilTypeDdlStatus(6)}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.fix_side_6}
              dataSource={fix_sides_6}
              keyColumn="FixSide6"
              valueColumn="Title"
              formConfig={formConfig}
              disabled={fix_sides_6.length === 0}
            />
          </Col> */}
          {record.MoeinID > 0 && (
            <>
              <Col xs={24}>
                <Divider orientation="right">
                  <Text>{Words.related_tafsil_levels}</Text>
                </Divider>
              </Col>
              {levels.length > 0 ? (
                <Col xs={24}>
                  <RelatedTafsilTypesTree
                    moeinID={record.MoeinID}
                    tafsilTypes={tafsilTypes}
                  />
                </Col>
              ) : (
                <Col xs={24}>
                  <Alert
                    type="warning"
                    message={<Text>{Words.empty_data}</Text>}
                  />
                </Col>
              )}
            </>
          )}
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default FinancialOperationModal;
