import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../../../common/modal-window";
import Words from "../../../../../../resources/words";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  handleError,
} from "../../../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "../../../../../contexts/modal-context";
import service from "../../../../../../services/financial/treasury/receive/receive-requests-service";
import DropdownItem from "../../../../../form-controls/dropdown-item";
import DateItem from "../../../../../form-controls/date-item";
import NumericInputItem from "../../../../../form-controls/numeric-input-item";

const schema = {
  RequestID: Joi.number().label(Words.id),
  FrontSideAccountID: Joi.number(),
  CurrencyID: Joi.number(),
  FromReceiveDate: Joi.string().allow(""),
  ToReceiveDate: Joi.string().allow(""),
  BaseTypeID: Joi.number(),
  BaseDocID: Joi.number(),
  FromSettlementDate: Joi.string().allow(""),
  ToSettlementDate: Joi.string().allow(""),
  StatusID: Joi.number(),
};

const initRecord = {
  RequestID: 0,
  FrontSideAccountID: 0,
  CurrencyID: 0,
  FromReceiveDate: "",
  ToReceiveDate: "",
  BaseTypeID: 0,
  BaseDocID: 0,
  FromSettlementDate: "",
  ToSettlementDate: "",
  StatusID: 0,
};

const formRef = React.createRef();

const ReceiveRequestsSearchModal = ({
  isOpen,
  filter,
  searchedFrontSideAccount,
  onOk,
  onCancel,
  onFrontSideAccountChange,
}) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [frontSideAccountSearchProgress, setFrontSideAccountSearchProgress] =
    useState(false);
  const [frontSideAccounts, setFrontSideAccounts] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [baseTypes, setBaseTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.RequestID = 0;
    record.FrontSideAccountID = 0;
    record.CurrencyID = 0;
    record.FromReceiveDate = "";
    record.ToReceiveDate = "";
    record.BaseTypeID = 0;
    record.BaseDocID = 0;
    record.FromSettlementDate = "";
    record.ToSettlementDate = "";
    record.StatusID = 0;

    setRecord(record);
    setErrors({});
    setFrontSideAccounts([]);
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();

    setRecord(initRecord);
    initModal(formRef, filter, setRecord);

    setProgress(true);
    try {
      const data = await service.getParams();

      const { Currencies, BaseTypes, Statuses } = data;

      setCurrencies(Currencies);
      setBaseTypes(BaseTypes);
      setStatuses(Statuses);

      if (filter?.FrontSideAccountID > 0) {
        setFrontSideAccounts([searchedFrontSideAccount]);
      }
    } catch (err) {
      handleError(err);
    }
    setProgress(false);
  });

  const handleChangeFrontSideAccount = (value) => {
    const rec = { ...record };
    rec.FrontSideAccountID = value || 0;
    setRecord(rec);

    const frontSideAccount =
      value > 0
        ? frontSideAccounts.find((a) => a.FrontSideAccountID === value)
        : null;

    onFrontSideAccountChange(frontSideAccount);
  };

  const handleSearchFrontSideAccount = async (searchText) => {
    setFrontSideAccountSearchProgress(true);

    try {
      const data = await service.searchFrontSideAccounts(searchText);

      setFrontSideAccounts(data);
    } catch (ex) {
      handleError(ex);
    }

    setFrontSideAccountSearchProgress(false);
  };

  return (
    <ModalWindow
      isOpen={isOpen}
      inProgress={progress}
      disabled={validateForm({ record, schema }) && true}
      searchModal
      onClear={clearRecord}
      onSubmit={() => onOk(record)}
      onCancel={onCancel}
      width={850}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[10, 5]} style={{ marginLeft: 1 }}>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              title={Words.id}
              fieldName="RequestID"
              min={0}
              max={9999999999}
              formConfig={formConfig}
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.front_side_account}
              dataSource={frontSideAccounts}
              keyColumn="FrontSideAccountID"
              valueColumn="Title"
              formConfig={formConfig}
              loading={frontSideAccountSearchProgress}
              onSearch={handleSearchFrontSideAccount}
              onChange={handleChangeFrontSideAccount}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.currency}
              dataSource={currencies}
              keyColumn="CurrencyID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.status}
              dataSource={statuses}
              keyColumn="StatusID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.receive_base}
              dataSource={baseTypes}
              keyColumn="BaseTypeID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              title={Words.base_doc_id}
              fieldName="BaseDocID"
              min={0}
              max={9999999999}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.from_receive_date}
              fieldName="FromReceiveDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.to_receive_date}
              fieldName="ToReceiveDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.from_settlement_date}
              fieldName="FromSettlementDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.to_settlement_date}
              fieldName="ToSettlementDate"
              formConfig={formConfig}
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default ReceiveRequestsSearchModal;
