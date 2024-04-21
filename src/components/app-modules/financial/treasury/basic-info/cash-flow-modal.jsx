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
import service from "../../../../../services/financial/treasury/basic-info/cash-flows-service";
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
  CashFlowID: Joi.number().required(),
  MoeinID: Joi.number().min(1).required().label(Words.account_moein),
  Title: Joi.string()
    .min(2)
    .max(50)
    .required()
    .label(Words.title)
    .regex(utils.VALID_REGEX),
  ShowInReceiptOperation: Joi.boolean(),
  ShowInPaymentOperation: Joi.boolean(),
  ShowInFundSummaryOperation: Joi.boolean(),
  TafsilTypeID4: Joi.number(),
  FixSide4: Joi.number(),
  TafsilTypeID5: Joi.number(),
  FixSide5: Joi.number(),
  TafsilTypeID6: Joi.number(),
  FixSide6: Joi.number(),
};

const initRecord = {
  CashFlowID: 0,
  MoeinID: 0,
  Title: "",
  ShowInReceiptOperation: false,
  ShowInPaymentOperation: false,
  ShowInFundSummaryOperation: false,
  TafsilTypeID4: 0,
  FixSide4: 0,
  TafsilTypeID5: 0,
  FixSide5: 0,
  TafsilTypeID6: 0,
  FixSide6: 0,
};

const formRef = React.createRef();

const CashFlowModal = ({ isOpen, selectedObject, onOk, onCancel }) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [moeins, setMoeins] = useState([]);
  const [tafsilTypes, setTafsilTypes] = useState([]);
  const [cashFlowTafsilTypes, setCashFlowTafsilTypes] = useState([]);

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.MoeinID = 0;
    record.Title = "";
    record.ShowInReceiptOperation = false;
    record.ShowInPaymentOperation = false;
    record.ShowInFundSummaryOperation = false;
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

      let { Moeins, TafsilTypes, CashFlowTafsilTypes } = data;

      setMoeins(Moeins);
      setTafsilTypes(TafsilTypes);
      setCashFlowTafsilTypes(CashFlowTafsilTypes);
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

  const filtered_tafsil_types_level_4 = [...cashFlowTafsilTypes];
  const filtered_tafsil_types_level_5 = [...cashFlowTafsilTypes];
  const filtered_tafsil_types_level_6 = [...cashFlowTafsilTypes];

  filtered_tafsil_types_level_4.forEach((tt) => {
    tt.TafsilTypeID4 = tt.TypeID;
  });

  filtered_tafsil_types_level_5.forEach((tt) => {
    tt.TafsilTypeID5 = tt.TypeID;
  });

  filtered_tafsil_types_level_6.forEach((tt) => {
    tt.TafsilTypeID6 = tt.TypeID;
  });

  //------

  const fix_sides_4 = [];
  const fix_sides_5 = [];
  const fix_sides_6 = [];

  //------

  const levels = getTafsilTypeLevels(record.MoeinID, tafsilTypes);

  const getTafsilTypeDdlStatus = (levelID) =>
    levels.filter((level) => level.LevelID === levelID).length === 0;

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
      width={750}
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
              title={Words.account_moein}
              dataSource={moeins}
              keyColumn="MoeinID"
              valueColumn="Title"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={8}>
            <SwitchItem
              title={Words.show_in_receip_operation}
              fieldName="ShowInReceiptOperation"
              initialValue={false}
              checkedTitle={Words.yes}
              unCheckedTitle={Words.no}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={8}>
            <SwitchItem
              title={Words.show_in_payment_operation}
              fieldName="ShowInPaymentOperation"
              initialValue={false}
              checkedTitle={Words.yes}
              unCheckedTitle={Words.no}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={8}>
            <SwitchItem
              title={Words.show_in_fund_summary_operation}
              fieldName="ShowInFundSummaryOperation"
              initialValue={false}
              checkedTitle={Words.yes}
              unCheckedTitle={Words.no}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24}>
            <Divider orientation="right">
              <Text>{Words.tafsil_levels}</Text>
            </Divider>
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.tafsil_type_level_4}
              dataSource={filtered_tafsil_types_level_4}
              keyColumn="TafsilTypeID4"
              valueColumn="Title"
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
              valueColumn="Title"
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
              valueColumn="Title"
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
          </Col>
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

export default CashFlowModal;
