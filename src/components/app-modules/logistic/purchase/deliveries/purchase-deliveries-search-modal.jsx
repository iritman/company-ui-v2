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
import service from "../../../../../services/logistic/purchase/deliveries-service";
import DropdownItem from "../../../../form-controls/dropdown-item";
import DateItem from "../../../../form-controls/date-item";
import NumericInputItem from "../../../../form-controls/numeric-input-item";

const schema = {
  DeliveryID: Joi.number().label(Words.id),
  TransfereeTypeID: Joi.number().label(Words.supplier),
  TransfereeTafsilAccountID: Joi.number().label(Words.base_type),
  DeliveryTafsilAccountID: Joi.number().label(Words.base_type),
  RegMemberID: Joi.number().label(Words.registerar),
  FromDate: Joi.string().allow(""),
  ToDate: Joi.string().allow(""),
  StatusID: Joi.number(),
};

const initRecord = {
  DeliveryID: 0,
  TransfereeTypeID: 0,
  TransfereeTafsilAccountID: 0,
  DeliveryTafsilAccountID: 0,
  RegMemberID: 0,
  FromDate: "",
  ToDate: "",
  StatusID: 0,
};

const formRef = React.createRef();

const PurchaseDeliveriesSearchModal = ({ isOpen, filter, onOk, onCancel }) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [transfereeTypes, setTransfereeTypes] = useState([]);
  const [transferees, setTransferees] = useState([]);
  const [transfereeProgress, setTransfereeProgress] = useState(false);
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [deliveryPersonProgress, setDeliveryPersonProgress] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [regMembers, setRegMembers] = useState(0);

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.DeliveryID = 0;
    record.TransfereeTypeID = 0;
    record.TransfereeTafsilAccountID = 0;
    record.DeliveryTafsilAccountID = 0;
    record.RegMemberID = 0;
    record.FromDate = "";
    record.ToDate = "";
    record.StatusID = 0;

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

      const { TransfereeTypes, Statuses, RegMembers } = data;

      setTransfereeTypes(TransfereeTypes);
      setStatuses(Statuses);
      setRegMembers(RegMembers);

      if (filter !== null) {
        const { TransfereeTafsilAccountID, DeliveryTafsilAccountID } = filter;

        if (TransfereeTafsilAccountID > 0) {
          const filtered_transferee = await service.searchTafsilAccount(
            "transferee",
            TransfereeTafsilAccountID
          );

          setTransferees([filtered_transferee]);
        }

        if (DeliveryTafsilAccountID > 0) {
          const filtered_delivery_person = await service.searchTafsilAccount(
            "delivery",
            DeliveryTafsilAccountID
          );

          setDeliveryPersons([filtered_delivery_person]);
        }
      }
    } catch (err) {
      handleError(err);
    }
    setProgress(false);
  });

  // ------

  const handleChangeTransferee = (value) => {
    const rec = { ...record };
    rec.TransfereeTafsilAccountID = value || 0;
    setRecord(rec);
  };

  const handleSearchTransferee = async (searchText) => {
    setTransfereeProgress(true);

    try {
      const data = await service.searchTransferees(searchText);

      setTransferees(data);
    } catch (ex) {
      handleError(ex);
    }

    setTransfereeProgress(false);
  };

  // ------

  const handleChangeDeliveryPerson = (value) => {
    const rec = { ...record };
    rec.DeliveryTafsilAccountID = value || 0;
    setRecord(rec);
  };

  const handleSearchDeliveryPerson = async (searchText) => {
    setDeliveryPersonProgress(true);

    try {
      const data = await service.searchDeliveryPersons(searchText);

      setDeliveryPersons(data);
    } catch (ex) {
      handleError(ex);
    }

    setDeliveryPersonProgress(false);
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
      width={1050}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[10, 5]} style={{ marginLeft: 1 }}>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              title={Words.id}
              fieldName="DeliveryID"
              min={0}
              max={9999999999}
              formConfig={formConfig}
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.delivery_person}
              dataSource={deliveryPersons}
              keyColumn="DeliveryTafsilAccountID"
              valueColumn="Title"
              formConfig={formConfig}
              loading={deliveryPersonProgress}
              onSearch={handleSearchDeliveryPerson}
              onChange={handleChangeDeliveryPerson}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.transferee_type}
              dataSource={transfereeTypes}
              keyColumn="TransfereeTypeID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.transferee}
              dataSource={transferees}
              keyColumn="TransfereeTafsilAccountID"
              valueColumn="Title"
              formConfig={formConfig}
              loading={transfereeProgress}
              onSearch={handleSearchTransferee}
              onChange={handleChangeTransferee}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.registerar}
              dataSource={regMembers}
              keyColumn="RegMemberID"
              valueColumn="FullName"
              formConfig={formConfig}
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

export default PurchaseDeliveriesSearchModal;
