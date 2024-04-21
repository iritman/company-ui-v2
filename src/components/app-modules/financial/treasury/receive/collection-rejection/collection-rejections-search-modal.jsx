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
import service from "../../../../../../services/financial/treasury/receive/collection-rejections-service";
import DropdownItem from "../../../../../form-controls/dropdown-item";
import DateItem from "../../../../../form-controls/date-item";
import NumericInputItem from "../../../../../form-controls/numeric-input-item";

const schema = {
  CollectionRejectionID: Joi.number().label(Words.id),
  CompanyBankAccountID: Joi.number(),
  ItemType: Joi.number(),
  FromCollectionRejectionDate: Joi.string().allow(""),
  ToCollectionRejectionDate: Joi.string().allow(""),
  RegMemberID: Joi.number(),
  StatusID: Joi.number(),
};

const initRecord = {
  CollectionRejectionID: 0,
  CompanyBankAccountID: 0,
  ItemType: 0,
  FromCollectionRejectionDate: "",
  ToCollectionRejectionDate: "",
  RegMemberID: 0,
  StatusID: 0,
};

const formRef = React.createRef();

const CollectionRejectionsSearchModal = ({
  isOpen,
  filter,
  onOk,
  onCancel,
}) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [companyBankAccounts, setCompanyBankAccounts] = useState([]);
  const [itemTypes] = useState([
    { ItemType: 1, Title: Words.cheque },
    { ItemType: 2, Title: Words.demand },
  ]);
  const [employees, setEmployees] = useState([]);
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
    record.CollectionRejectionID = 0;
    record.CompanyBankAccountID = 0;
    record.ItemType = 0;
    record.FromCollectionRejectionDate = "";
    record.ToCollectionRejectionDate = "";
    record.OperationID = 0;
    record.RegMemberID = 0;
    record.StatusID = 0;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();

    setRecord(initRecord);
    initModal(formRef, filter, setRecord);

    setProgress(true);
    try {
      const data = await service.getParams();

      const { CompanyBankAccounts, Employees, Statuses } = data;

      setCompanyBankAccounts(CompanyBankAccounts);
      setEmployees(Employees);
      setStatuses(Statuses);
    } catch (err) {
      handleError(err);
    }
    setProgress(false);
  });

  // ------

  return (
    <ModalWindow
      isOpen={isOpen}
      inProgress={progress}
      disabled={validateForm({ record, schema }) && true}
      searchModal
      onClear={clearRecord}
      onSubmit={() => onOk(record)}
      onCancel={onCancel}
      width={900}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[10, 5]} style={{ marginLeft: 1 }}>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              title={Words.id}
              fieldName="CollectionRejectionID"
              min={0}
              max={9999999999}
              formConfig={formConfig}
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.bank_account}
              dataSource={companyBankAccounts}
              keyColumn="CompanyBankAccountID"
              valueColumn="InfoTitle"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.item_type}
              dataSource={itemTypes}
              keyColumn="ItemType"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.reg_member}
              dataSource={employees}
              keyColumn="RegMemberID"
              valueColumn="FullName"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.from_date}
              fieldName="FromCollectionRejectionDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.to_date}
              fieldName="ToCollectionRejectionDate"
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
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default CollectionRejectionsSearchModal;
