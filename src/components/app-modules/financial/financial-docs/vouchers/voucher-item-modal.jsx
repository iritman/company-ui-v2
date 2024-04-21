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
  handleError,
} from "../../../../../tools/form-manager";
import InputItem from "../../../../form-controls/input-item";
import NumericInputItem from "../../../../form-controls/numeric-input-item";
import DateItem from "../../../../form-controls/date-item";
import DropdownItem from "../../../../form-controls/dropdown-item";

const schema = {
  ItemID: Joi.number().required().label(Words.id),
  VoucherID: Joi.number().required().label(Words.voucher_id),
  MoeinID: Joi.number().min(1).required().label(Words.account_moein),
  TafsilAccountID_Level4: Joi.number().required().label(Words.level_4),
  TafsilAccountID_Level5: Joi.number().required().label(Words.level_5),
  TafsilAccountID_Level6: Joi.number().required().label(Words.level_6),
  BedehkarAmount: Joi.number().label(Words.bedehkar),
  BestankarAmount: Joi.number().label(Words.bestankar),
  FollowCode: Joi.string().allow("").label(Words.follow_code),
  FollowDate: Joi.string().allow("").label(Words.follow_date),
  StandardDetailsID: Joi.number().label(Words.standard_description),
  DetailsText: Joi.string()
    .min(5)
    .max(250)
    .allow("")
    .regex(utils.VALID_REGEX)
    .label(Words.standard_description),
};

const initRecord = {
  ItemID: 0,
  VoucherID: 0,
  MoeinID: 0,
  TafsilAccountID_Level4: 0,
  TafsilAccountID_Level5: 0,
  TafsilAccountID_Level6: 0,
  BedehkarAmount: 0,
  BestankarAmount: 0,
  FollowCode: "",
  FollowDate: "",
  StandardDetailsID: 0,
  DetailsText: "",
};

const formRef = React.createRef();

const VoucherItemModal = ({
  isOpen,
  selectedObject,
  moeins,
  standardDetails,
  onOk,
  onCancel,
}) => {
  const [progress, setProgress] = useState(false);
  const [errors, setErrors] = useState({});
  const [record, setRecord] = useState({});

  const [tafsilAccountsLevel4, setTafsilAccountsLevel4] = useState(false);
  const [tafsilAccountsLevel5, setTafsilAccountsLevel5] = useState(false);
  const [tafsilAccountsLevel6, setTafsilAccountsLevel6] = useState(false);

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.MoeinID = 0;
    record.TafsilAccountID_Level4 = 0;
    record.TafsilAccountID_Level5 = 0;
    record.TafsilAccountID_Level6 = 0;
    record.BedehkarAmount = 0;
    record.BestankarAmount = 0;
    record.FollowCode = "";
    record.FollowDate = "";
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
      if (selectedObject) {
        const selected_moein = moeins.find(
          (m) => m.MoeinID === selectedObject.MoeinID
        );
        const {
          TafsilAccounts_Level4,
          TafsilAccounts_Level5,
          TafsilAccounts_Level6,
        } = selected_moein;

        configTafsilLevels(
          TafsilAccounts_Level4,
          TafsilAccounts_Level5,
          TafsilAccounts_Level6
        );
      }
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

  const configTafsilLevels = (level4, level5, level6) => {
    level4.forEach((a) => (a.TafsilAccountID_Level4 = a.TafsilAccountID));
    level5.forEach((a) => (a.TafsilAccountID_Level5 = a.TafsilAccountID));
    level6.forEach((a) => (a.TafsilAccountID_Level6 = a.TafsilAccountID));

    setTafsilAccountsLevel4([...level4]);
    setTafsilAccountsLevel5([...level5]);
    setTafsilAccountsLevel6([...level6]);
  };

  const handleChangeMoein = (value) => {
    const {
      TafsilAccounts_Level4,
      TafsilAccounts_Level5,
      TafsilAccounts_Level6,
    } = moeins.find((m) => m.MoeinID === value);

    configTafsilLevels(
      TafsilAccounts_Level4,
      TafsilAccounts_Level5,
      TafsilAccounts_Level6
    );

    //------ Update schema

    if (TafsilAccounts_Level4.length > 0)
      schema.TafsilAccountID_Level4 = Joi.number()
        .min(1)
        .required()
        .label(Words.level_4);
    else
      schema.TafsilAccountID_Level4 = Joi.number()
        .required()
        .label(Words.level_4);

    //......

    if (TafsilAccounts_Level5.length > 0)
      schema.TafsilAccountID_Level5 = Joi.number()
        .min(1)
        .required()
        .label(Words.level_5);
    else
      schema.TafsilAccountID_Level5 = Joi.number()
        .required()
        .label(Words.level_5);

    //......

    if (TafsilAccounts_Level6.length > 0)
      schema.TafsilAccountID_Level6 = Joi.number()
        .min(1)
        .required()
        .label(Words.level_6);
    else
      schema.TafsilAccountID_Level6 = Joi.number()
        .required()
        .label(Words.level_6);

    //......

    const rec = { ...record };
    rec.MoeinID = value;
    rec.TafsilAccountID_Level4 = 0;
    rec.TafsilAccountID_Level5 = 0;
    rec.TafsilAccountID_Level6 = 0;
    setRecord(rec);
    loadFieldsValue(formRef, rec);
  };

  //------
  const filterd_moeins = moeins?.filter(
    (m) => m.TafsilAccounts_Level4.length > 0
  );

  return (
    <ModalWindow
      isOpen={isOpen}
      isEdit={isEdit}
      inProgress={progress}
      disabled={
        record.BedehkarAmount + record.BestankarAmount === 0 ||
        (record.BedehkarAmount > 0 && record.BestankarAmount > 0) ||
        (validateForm({ record: record, schema }) && true)
      }
      onClear={clearRecord}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      title={Words.reg_cheque}
      width={1250}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24} md={6}>
            <DropdownItem
              title={Words.account_moein}
              dataSource={filterd_moeins}
              keyColumn="MoeinID"
              valueColumn="MoeinTitle"
              formConfig={formConfig}
              onChange={handleChangeMoein}
              required
            />
          </Col>
          <Col xs={24} md={6}>
            <DropdownItem
              title={Words.level_4}
              dataSource={tafsilAccountsLevel4}
              keyColumn="TafsilAccountID_Level4"
              valueColumn="Title"
              formConfig={formConfig}
              disabled={tafsilAccountsLevel4?.length === 0}
              required={tafsilAccountsLevel4?.length > 0}
            />
          </Col>
          <Col xs={24} md={6}>
            <DropdownItem
              title={Words.level_5}
              dataSource={tafsilAccountsLevel5}
              keyColumn="TafsilAccountID_Level5"
              valueColumn="Title"
              formConfig={formConfig}
              disabled={tafsilAccountsLevel5?.length === 0}
              required={tafsilAccountsLevel5?.length > 0}
            />
          </Col>
          <Col xs={24} md={6}>
            <DropdownItem
              title={Words.level_6}
              dataSource={tafsilAccountsLevel6}
              keyColumn="TafsilAccountID_Level6"
              valueColumn="Title"
              formConfig={formConfig}
              disabled={tafsilAccountsLevel6?.length === 0}
              required={tafsilAccountsLevel6?.length > 0}
            />
          </Col>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              title={Words.bedehkar}
              fieldName="BedehkarAmount"
              min={0}
              max={9999999999}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              title={Words.bestankar}
              fieldName="BestankarAmount"
              min={0}
              max={9999999999}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              horizontal
              title={Words.follow_code}
              fieldName="FollowCode"
              maxLength={20}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.follow_date}
              fieldName="FollowDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24}>
            <DropdownItem
              title={Words.standard_details_text}
              dataSource={standardDetails}
              keyColumn="StandardDetailsID"
              valueColumn="DetailsText"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24}>
            <InputItem
              title={Words.standard_description}
              fieldName="DetailsText"
              multiline
              rows={2}
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

export default VoucherItemModal;
