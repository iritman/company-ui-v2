import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Tabs } from "antd";
import Joi from "joi-browser";
import ModalWindow from "./../../../../common/modal-window";
import Words from "../../../../../resources/words";
import utils from "../../../../../tools/utils";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
  handleError,
} from "../../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "./../../../../contexts/modal-context";
import service from "../../../../../services/financial/treasury/fund/funds-service";
import DropdownItem from "./../../../../form-controls/dropdown-item";
// import InputItem from "../../../../form-controls/input-item";
import NumericInputItem from "../../../../form-controls/numeric-input-item";
import SwitchItem from "./../../../../form-controls/switch-item";
import DateItem from "./../../../../form-controls/date-item";
import TafsilInfoViewer from "../../../../common/tafsil-info-viewer";

const schema = {
  FundID: Joi.number().required(),
  // Title: Joi.string()
  //   .min(2)
  //   .max(50)
  //   .required()
  //   .regex(utils.VALID_REGEX)
  //   .label(Words.title),
  FunderMemberID: Joi.number().min(1).required().label(Words.funder_member),
  EstablishDate: Joi.string().allow("").label(Words.establish_date),
  CurrencyID: Joi.number().min(1).required().label(Words.currency),
  InitialInventory: Joi.number().required().label(Words.initial_inventory),
  MaxInventory: Joi.number().required().label(Words.max_inventory),
  StandardDetailsID: Joi.number().required().label(Words.standard_description),
  IsActive: Joi.boolean(),
};

const initRecord = {
  FundID: 0,
  // Title: "",
  FunderMemberID: 0,
  EstablishDate: "",
  CurrencyID: 0,
  InitialInventory: 0,
  MaxInventory: 0,
  StandardDetailsID: 0,
  IsActive: true,
};

const formRef = React.createRef();

const FundModal = ({ isOpen, selectedObject, onOk, onCancel }) => {
  const [employees, setEmployees] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [standardDetails, setStandardDetails] = useState([]);

  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const resetContext = useResetContext();

  const clearRecord = () => {
    // record.Title = "";
    record.FunderMemberID = 0;
    record.EstablishDate = "";
    record.CurrencyID = 0;
    record.InitialInventory = 0;
    record.MaxInventory = 0;
    record.StandardDetailsID = 0;
    record.IsActive = true;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  useMount(async () => {
    resetContext();

    //------

    setProgress(true);

    try {
      const data = await service.getParams();

      const { Employees, Currencies, StandardDetails } = data;

      setEmployees(Employees);
      setCurrencies(Currencies);
      setStandardDetails(StandardDetails);

      if (selectedObject) {
        initModal(formRef, selectedObject, setRecord);
      } else {
        utils.setDefaultCurrency(
          setRecord,
          initRecord,
          loadFieldsValue,
          formRef,
          Currencies
        );
      }
    } catch (err) {
      handleError(err);
    }

    setProgress(false);
  });

  const handleSubmit = async () => {
    await saveModalChanges(
      formConfig,
      selectedObject,
      setProgress,
      onOk,
      clearRecord
    );
  };

  const isEdit = selectedObject !== null;

  //------

  let items = [
    {
      label: Words.info,
      key: "info",
      children: (
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          {/* <Col xs={24} md={12}>
            <InputItem
              title={Words.title}
              fieldName="Title"
              formConfig={formConfig}
              maxLength={50}
              required
              autoFocus
            />
          </Col> */}
          <Col xs={24}>
            <DropdownItem
              title={Words.funder_member}
              dataSource={employees}
              keyColumn="FunderMemberID"
              valueColumn="FullName"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              // required
              title={Words.establish_date}
              fieldName="EstablishDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.currency}
              dataSource={currencies}
              keyColumn="CurrencyID"
              valueColumn="Title"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              title={Words.initial_inventory}
              fieldName="InitialInventory"
              min={0}
              max={999999999999}
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              title={Words.max_inventory}
              fieldName="MaxInventory"
              min={0}
              max={999999999999}
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24}>
            <DropdownItem
              title={Words.standard_description}
              dataSource={standardDetails}
              keyColumn="StandardDetailsID"
              valueColumn="DetailsText"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <SwitchItem
              title={Words.status}
              fieldName="IsActive"
              initialValue={true}
              checkedTitle={Words.active}
              unCheckedTitle={Words.inactive}
              formConfig={formConfig}
            />
          </Col>
        </Row>
      ),
    },
  ];

  if (selectedObject !== null) {
    const { TafsilInfo } = selectedObject;

    items = [
      ...items,
      {
        label: Words.tafsil_account,
        key: "tafsil-account",
        children: <TafsilInfoViewer tafsilInfo={TafsilInfo} />,
      },
    ];
  }

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
        <Tabs defaultActiveKey="1" type="card" items={items} />
      </Form>
    </ModalWindow>
  );
};

export default FundModal;
