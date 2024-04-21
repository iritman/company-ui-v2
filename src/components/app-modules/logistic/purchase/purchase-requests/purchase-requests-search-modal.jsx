import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../../common/modal-window";
import Words from "../../../../../resources/words";
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
import service from "../../../../../services/logistic/purchase/purchase-requests-service";
import DropdownItem from "../../../../form-controls/dropdown-item";
import DateItem from "../../../../form-controls/date-item";
import NumericInputItem from "../../../../form-controls/numeric-input-item";

const schema = {
  RequestID: Joi.number().label(Words.id),
  FromDate: Joi.string().allow(""),
  ToDate: Joi.string().allow(""),
  StatusID: Joi.number(),
  StorageCenterID: Joi.number(),
  MemberID: Joi.number(),
  FrontSideTypeID: Joi.number(),
  FrontSideAccountID: Joi.number(),
  RequestTypeID: Joi.number(),
};

const initRecord = {
  RequestID: 0,
  FromDate: "",
  ToDate: "",
  StatusID: 0,
  StorageCenterID: 0,
  MemberID: 0,
  FrontSideTypeID: 0,
  FrontSideAccountID: 0,
  RequestTypeID: 0,
};

const formRef = React.createRef();

const PurchaseRequestsSearchModal = ({ isOpen, filter, onOk, onCancel }) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [frontSideAccountSearchProgress, setFrontSideAccountSearchProgress] =
    useState(false);
  const [frontSideAccounts, setFrontSideAccounts] = useState([]);
  const [memberSearchProgress, setMemberSearchProgress] = useState(false);
  const [members, setMembers] = useState([]);

  const [statuses, setStatuses] = useState([]);
  const [storageCenters, setStorageCenters] = useState([]);
  const [frontSideTypes, setFrontSideTypes] = useState([]);
  const [purchaseRequestTypes, setPurchaseRequestTypes] = useState([]);

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
    record.FromDate = "";
    record.ToDate = "";
    record.StatusID = 0;
    record.StorageCenterID = 0;
    record.MemberID = 0;
    record.FrontSideTypeID = 0;
    record.FrontSideAccountID = 0;
    record.RequestTypeID = 0;

    setMembers([]);
    setFrontSideAccounts([]);

    setErrors({});
    setRecord(record);
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();

    setRecord(initRecord);
    initModal(formRef, filter, setRecord);

    setProgress(true);
    try {
      const data = await service.getSearchParams();

      const { Statuses, StorageCenters, FrontSideTypes, PurchaseRequestTypes } =
        data;

      setStatuses(Statuses);
      setStorageCenters(StorageCenters);
      setFrontSideTypes(FrontSideTypes);
      setPurchaseRequestTypes(PurchaseRequestTypes);

      //------

      if (filter) {
        if (filter.MemberID > 0) {
          const request_member = await service.searchMemberByID(
            filter.MemberID
          );

          setMembers(request_member);
        }

        if (filter.FrontSideAccountID > 0) {
          const front_side_account = await service.searchFrontSideAccountByID(
            filter.FrontSideAccountID
          );

          setFrontSideAccounts(front_side_account);
        }
      }
    } catch (err) {
      handleError(err);
    }
    setProgress(false);
  });

  const handleChangeMember = (value) => {
    const rec = { ...record };
    rec.MemberID = value || 0;
    setRecord(rec);
  };

  const handleSearchMember = async (searchText) => {
    setMemberSearchProgress(true);

    try {
      const data = await service.searchMembers(searchText);

      setMembers(data);
    } catch (ex) {
      handleError(ex);
    }

    setMemberSearchProgress(false);
  };

  const handleChangeFrontSideType = async (value) => {
    const rec = { ...record };
    rec.FrontSideTypeID = value || 0;
    rec.FrontSideAccountID = 0;

    setRecord(rec);

    if (value === 0) {
      setFrontSideAccounts([]);
    } else {
      const data = await handleSearchFrontSideAccount(value);
      setFrontSideAccounts(data);
    }
    loadFieldsValue(formRef, rec);
  };

  const handleSearchFrontSideAccount = async (typeID) => {
    let data = [];

    setFrontSideAccountSearchProgress(true);

    try {
      data = await service.searchFrontSideAccounts(typeID);

      setFrontSideAccounts(data);
    } catch (ex) {
      handleError(ex);
    }

    setFrontSideAccountSearchProgress(false);

    return data;
  };

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
              title={Words.storage_center}
              dataSource={storageCenters}
              keyColumn="CenterID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.request_type}
              dataSource={purchaseRequestTypes}
              keyColumn="RequestTypeID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.front_side_type}
              dataSource={frontSideTypes}
              keyColumn="FrontSideTypeID"
              valueColumn="Title"
              formConfig={formConfig}
              onChange={handleChangeFrontSideType}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.front_side_account}
              dataSource={frontSideAccounts}
              keyColumn="FrontSideAccountID"
              valueColumn="FrontSideAccountTitle"
              formConfig={formConfig}
              loading={frontSideAccountSearchProgress}
              onSearch={handleSearchFrontSideAccount}
              disabled={record.FrontSideTypeID === 0}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.request_member}
              dataSource={members}
              keyColumn="MemberID"
              valueColumn="FullName"
              formConfig={formConfig}
              loading={memberSearchProgress}
              onSearch={handleSearchMember}
              onChange={handleChangeMember}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.from_date}
              fieldName="FromDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.to_date}
              fieldName="ToDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24}>
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

export default PurchaseRequestsSearchModal;
