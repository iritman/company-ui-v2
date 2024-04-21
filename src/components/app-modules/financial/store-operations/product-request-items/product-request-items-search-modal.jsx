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
import service from "../../../../../services/financial/store-operations/product-request-items-service";
import DropdownItem from "../../../../form-controls/dropdown-item";
import DateItem from "../../../../form-controls/date-item";
import NumericInputItem from "../../../../form-controls/numeric-input-item";

const schema = {
  RequestID: Joi.number().label(Words.id),
  RequestTypeID: Joi.number(),
  MemberID: Joi.number(),
  FrontSideTypeID: Joi.number(),
  FrontSideAccountID: Joi.number(),
  RequestFromDate: Joi.string().allow(""),
  RequestToDate: Joi.string().allow(""),
  NeededFromDate: Joi.string().allow(""),
  NeededToDate: Joi.string().allow(""),
  //   StorageCenterID: Joi.number(),
  FromStoreID: Joi.number(),
  ToStoreID: Joi.number(),
  StatusID: Joi.number(),
  ProductID: Joi.number(),
};

const initRecord = {
  RequestID: 0,
  RequestTypeID: 0,
  MemberID: 0,
  FrontSideTypeID: 0,
  FrontSideAccountID: 0,
  RequestFromDate: "",
  RequestToDate: "",
  NeededFromDate: "",
  NeededToDate: "",
  //   StorageCenterID: 0,
  FromStoreID: 0,
  ToStoreID: 0,
  StatusID: 0,
  ProductID: 0,
};

const formRef = React.createRef();

const ProductRequestItemsSearchModal = ({ isOpen, filter, onOk, onCancel }) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [frontSideAccountSearchProgress, setFrontSideAccountSearchProgress] =
    useState(false);
  const [frontSideAccounts, setFrontSideAccounts] = useState([]);
  const [memberSearchProgress, setMemberSearchProgress] = useState(false);
  const [members, setMembers] = useState([]);

  //   const [storageCenters, setStorageCenters] = useState([]);
  const [fromStores, setFromStores] = useState([]);
  const [toStores, setToStores] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [frontSideTypes, setFrontSideTypes] = useState([]);
  const [productRequestTypes, setProductRequestTypes] = useState([]);
  const [products, setProducts] = useState([]);

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
    // record.StorageCenterID = 0;
    record.FromStoreID = 0;
    record.ToStoreID = 0;
    record.StatusID = 0;
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

      const {
        Statuses,
        Stores,
        /* StorageCenters */
        FrontSideTypes,
        ProductRequestTypes,
        Products,
      } = data;

      //   setStorageCenters(StorageCenters);
      const fromStores = [...Stores];
      const toStores = [...Stores];

      fromStores.forEach((store) => (store.FromStoreID = store.StoreID));
      toStores.forEach((store) => (store.ToStoreID = store.StoreID));

      setFromStores(fromStores);
      setToStores(toStores);
      setStatuses(Statuses);
      setFrontSideTypes(FrontSideTypes);
      setProductRequestTypes(ProductRequestTypes);
      setProducts(Products);

      //------

      //   if (filter) {
      //     if (filter.MemberID > 0) {
      //       const request_member = await service.searchMemberByID(
      //         filter.MemberID
      //       );

      //       setMembers(request_member);
      //     }

      //     if (filter.FrontSideAccountID > 0) {
      //       const front_side_account = await service.searchFrontSideAccountByID(
      //         filter.FrontSideAccountID
      //       );

      //       setFrontSideAccounts(front_side_account);
      //     }
      //   }
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

  const handleSearchFrontSideAccount = async (searchText) => {
    let data = [];

    setFrontSideAccountSearchProgress(true);

    try {
      data = await service.searchTafsilAccounts(searchText);

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
              title={Words.request_id}
              fieldName="RequestID"
              min={0}
              max={9999999999}
              formConfig={formConfig}
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.request_type}
              dataSource={productRequestTypes}
              keyColumn="RequestTypeID"
              valueColumn="Title"
              formConfig={formConfig}
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
            <DropdownItem
              title={Words.front_side_type}
              dataSource={frontSideTypes}
              keyColumn="FrontSideTypeID"
              valueColumn="Title"
              formConfig={formConfig}
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
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.product}
              dataSource={products}
              keyColumn="ProductID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.request_from_date}
              fieldName="RequestFromDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.request_to_date}
              fieldName="RequestToDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.needed_from_date}
              fieldName="NeededFromDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.needed_to_date}
              fieldName="NeededToDate"
              formConfig={formConfig}
            />
          </Col>
          {/* <Col xs={24} md={12}>
            <DropdownItem
              title={Words.storage_center}
              dataSource={storageCenters}
              keyColumn="CenterID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col> */}
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.from_store}
              dataSource={fromStores}
              keyColumn="FromStoreID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.to_store}
              dataSource={toStores}
              keyColumn="ToStoreID"
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
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default ProductRequestItemsSearchModal;
