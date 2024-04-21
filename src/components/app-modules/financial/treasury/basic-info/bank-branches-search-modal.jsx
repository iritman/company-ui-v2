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
  handleError,
} from "../../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "../../../../contexts/modal-context";
import service from "../../../../../services/financial/treasury/basic-info/bank-branches-service";
import DropdownItem from "./../../../../form-controls/dropdown-item";
import InputItem from "../../../../form-controls/input-item";

const schema = {
  BankID: Joi.number(),
  CityID: Joi.number(),
  SearchText: Joi.string()
    .allow("")
    .max(50)
    .regex(utils.VALID_REGEX)
    .label(Words.search_text),
};

const initRecord = {
  BankID: 0,
  CityID: 0,
  SearchText: "",
};

const formRef = React.createRef();

const BankBranchesSearchModal = ({ isOpen, filter, onOk, onCancel }) => {
  const [banks, setBanks] = useState([]);
  const [cities, setCities] = useState([]);

  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.BankID = 0;
    record.CityID = 0;
    record.SearchText = "";

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();
    setRecord(initRecord);
    initModal(formRef, filter, setRecord);

    //------

    setProgress(true);

    try {
      const data = await service.getParams();

      const { Banks, Cities } = data;

      setBanks(Banks);
      setCities(Cities);
    } catch (err) {
      handleError(err);
    }

    setProgress(false);
  });

  return (
    <ModalWindow
      isOpen={isOpen}
      inProgress={progress}
      disabled={validateForm({ record, schema }) && true}
      searchModal
      onClear={clearRecord}
      onSubmit={async () => await onOk(record)}
      onCancel={onCancel}
      width={750}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[10, 5]} style={{ marginLeft: 1 }}>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.bank}
              dataSource={banks}
              keyColumn="BankID"
              valueColumn="Title"
              formConfig={formConfig}
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.city}
              dataSource={cities}
              keyColumn="CityID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24}>
            <InputItem
              title={Words.search_text}
              fieldName="SearchText"
              maxLength={50}
              formConfig={formConfig}
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default BankBranchesSearchModal;
