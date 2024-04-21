import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../../common/modal-window";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
  handleError,
} from "../../../../../tools/form-manager";
import service from "../../../../../services/logistic/purchase/purchase-requests-service";
import InputItem from "../../../../form-controls/input-item";
import NumericInputItem from "../../../../form-controls/numeric-input-item";
import DateItem from "../../../../form-controls/date-item";
import DropdownItem from "../../../../form-controls/dropdown-item";
import MultiSelectItem from "../../../../form-controls/multi-select-item";
import TextItem from "../../../../form-controls/text-item";

const schema = {
  ItemID: Joi.number().required(),
  RequestID: Joi.number().required(),
  BaseTypeID: Joi.number().min(1).required().label(Words.base_type),
  BaseID: Joi.number().required().label(Words.base),
  NeededItemID: Joi.number().min(1).required().label(Words.product),
  NeededItemMeasureUnitID: Joi.number()
    .min(1)
    .required()
    .label(Words.measure_unit),
  RequestCount: Joi.number()
    .min(0)
    .max(999999)
    .positive()
    .precision(2)
    .label(Words.request_count),
  NeedDate: Joi.string(),
  PurchaseTypeID: Joi.number() /*.min(1)*/
    .required()
    .label(Words.purchase_type),
  InquiryDeadline: Joi.string().allow(""),
  PurchaseAgentID: Joi.number().required().label(Words.purchasing_agent),
  DetailsText: Joi.string()
    .min(5)
    .max(250)
    .allow("")
    .regex(utils.VALID_REGEX)
    .label(Words.descriptions),
  StatusID: Joi.number().min(1),
  Suppliers: Joi.array(),
  SuppliersIDs: Joi.array(),
};

const initRecord = {
  ItemID: 0,
  RequestID: 0,
  BaseTypeID: 1,
  BaseID: 0,
  NeededItemID: 0,
  NeededItemMeasureUnitID: 0,
  RequestCount: 0,
  NeedDate: "",
  PurchaseTypeID: 0,
  InquiryDeadline: "",
  PurchaseAgentID: 0,
  DetailsText: "",
  StatusID: 1,
  Suppliers: [],
  SuppliersIDs: [],
};

const formRef = React.createRef();

const PurchaseRequestItemModal = ({
  isOpen,
  selectedObject,
  selectedItems,
  onOk,
  onCancel,
  setParams,
}) => {
  const [progress, setProgress] = useState(false);
  const [errors, setErrors] = useState({});
  const [record, setRecord] = useState({});

  const [items, setItems] = useState([]);
  const [baseTypes, setBaseTypes] = useState([]);
  const [choices, setChoices] = useState([]);
  const [purchaseTypes, setPurchaseTypes] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [currentDate, setCurrentDate] = useState("");

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.BaseTypeID = 1;
    record.BaseID = 0;
    record.NeededItemID = 0;
    record.NeededItemMeasureUnitID = 0;
    record.RequestCount = 0;
    record.NeedDate = currentDate;
    record.PurchaseTypeID = 0;
    record.InquiryDeadline = "";
    record.PurchaseAgentID = 0;
    record.DetailsText = "";
    record.StatusID = 1;
    record.Suppliers = [];
    record.SuppliersIDs = [];

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    setProgress(true);

    try {
      const params = await service.getItemParams();

      let {
        BaseTypes,
        Choices,
        PurchaseTypes,
        Suppliers,
        Agents,
        Statuses,
        CurrentDate,
      } = params;

      setParams({
        BaseTypes,
        Choices,
        PurchaseTypes,
        Suppliers,
        Agents,
        Statuses,
        CurrentDate,
      });

      setBaseTypes(BaseTypes);
      setChoices(Choices);
      setPurchaseTypes(PurchaseTypes);
      setSuppliers(Suppliers);
      setAgents(Agents);
      setStatuses(Statuses);
      setCurrentDate(CurrentDate);

      //------

      if (!selectedObject) {
        const rec = { ...initRecord };
        rec.NeedDate = `${CurrentDate}`;

        setRecord({ ...rec });
        loadFieldsValue(formRef, { ...rec });
      } else {
        const { BaseTypeID } = selectedObject;

        switch (BaseTypeID) {
          // no base
          case 1: {
            break;
          }

          // product request from store inventory
          case 2: {
            const selected_product_request_item =
              await service.getRegedProductRequestItemByID(
                selectedObject.BaseID
              );

            setItems([selected_product_request_item]);

            break;
          }

          default: {
            break;
          }
        }

        initModal(formRef, selectedObject, setRecord);
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

  const handleChangeBaseType = async (value) => {
    const rec = { ...record };
    rec.BaseTypeID = value || 0;

    if (value > 1) {
      schema.BaseID = Joi.number().min(1).required().label(Words.base);

      // load purchase request items
      try {
        const data = await service.getRegedProductRequestItems();

        setItems(data);
      } catch (ex) {
        handleError(ex);
      }
    } else {
      schema.BaseID = Joi.number().required().label(Words.base);

      setItems([]);

      rec.BaseID = 0;
      rec.NeededItemTypeID = 0;
      rec.NeededItemID = 0;
      rec.NeededItemMeasureUnitID = 0;
      rec.RequestCount = 0;
      rec.NeedDate = "";
      rec.PurchaseTypeID = 0;
      rec.InquiryDeadline = "";
      rec.PurchaseAgentID = 0;
      rec.Suppliers = [];
      rec.SupplierIDs = [];
      rec.DetailsText = "";
    }

    // setBases([]);

    setRecord(rec);
    loadFieldsValue(formRef, rec);
  };

  const handleChangeProduct = (value) => {
    const rec = { ...record };
    rec.NeededItemID = value || 0;

    const measure_units = choices?.find(
      (choice) => choice.NeededItemID === value
    )?.MeasureUnits;

    const default_measure_unit = measure_units?.find((mu) => mu.IsDefault);

    rec.NeededItemMeasureUnitID = default_measure_unit
      ? default_measure_unit.NeededItemMeasureUnitID
      : 0;

    setRecord(rec);
    loadFieldsValue(formRef, rec);
  };

  const getMeasureUnits = () => {
    return choices?.find(
      (choice) => choice.NeededItemID === record.NeededItemID
    )?.MeasureUnits;
  };

  const getSelectedItem = (item_id) => {
    let selected_item = null;

    if (item_id > 0) {
      selected_item = items.find((i) => i.BaseID === item_id);

      if (!selected_item) selected_item = null;
    }

    return selected_item;
  };

  const handleChangeItem = (value) => {
    const rec = { ...record };
    rec.BaseID = value;

    if (value === 0) {
      rec.NeededItemID = 0;
      rec.NeededItemCode = "";
      rec.NeededItemMeasureUnitID = 0;
      rec.RequestCount = 0;
    } else {
      const selected_item = getSelectedItem(value);

      rec.NeededItemID = selected_item?.NeededItemID;
      rec.NeededItemCode = selected_item?.NeededItemCode;
      rec.NeededItemMeasureUnitID = selected_item?.NeededItemMeasureUnitID;
      rec.RequestCount = selected_item?.RequestCount;
    }

    setRecord(rec);
    loadFieldsValue(formRef, rec);
  };

  //------

  return (
    <ModalWindow
      isOpen={isOpen}
      isEdit={isEdit}
      inProgress={progress}
      disabled={validateForm({ record: record, schema }) && true}
      onClear={clearRecord}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      width={950}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.base_type}
              dataSource={baseTypes}
              keyColumn="BaseTypeID"
              valueColumn="Title"
              formConfig={formConfig}
              required
              autoFocus
              onChange={handleChangeBaseType}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.base_id}
              dataSource={items}
              keyColumn="BaseID"
              valueColumn={"InfoTitle"}
              formConfig={formConfig}
              disabled={record.BaseTypeID < 2 || selectedObject}
              required={record.BaseTypeID > 1}
              onChange={handleChangeItem}
            />
          </Col>
          <Col xs={24} md={12}>
            {selectedObject === null && record.BaseTypeID < 2 ? (
              <DropdownItem
                title={Words.product}
                dataSource={choices}
                keyColumn="NeededItemID"
                valueColumn="Title"
                formConfig={formConfig}
                onChange={handleChangeProduct}
                required
              />
            ) : (
              <TextItem
                title={Words.item_title}
                value={utils.farsiNum(
                  getSelectedItem(record.BaseID)?.NeededItemTitle || "-"
                )}
                valueColor={Colors.magenta[6]}
              />
            )}
          </Col>
          <Col xs={24} md={12}>
            {selectedObject === null && record.BaseTypeID < 2 ? (
              <DropdownItem
                title={Words.measure_unit}
                dataSource={getMeasureUnits()}
                keyColumn="NeededItemMeasureUnitID"
                valueColumn="MeasureUnitTitle"
                formConfig={formConfig}
                required
              />
            ) : (
              <TextItem
                title={Words.measure_unit}
                value={utils.farsiNum(
                  getSelectedItem(record.BaseID)?.NeededItemMeasureUnitTitle ||
                    "-"
                )}
                valueColor={Colors.magenta[6]}
              />
            )}
          </Col>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              title={Words.request_count}
              fieldName="RequestCount"
              min={0}
              max={999999}
              precision={2}
              maxLength={7}
              step="0.01"
              stringMode
              decimalText
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.need_date}
              fieldName="NeedDate"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.purchase_type}
              dataSource={purchaseTypes}
              keyColumn="PurchaseTypeID"
              valueColumn="Title"
              formConfig={formConfig}
              // required
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.inquiry_final_deadline}
              fieldName="InquiryDeadline"
              formConfig={formConfig}
              required={record.PurchaseTypeID === 2}
              // 2: Purchase Type: With Cost Inquiry
            />
          </Col>
          <Col xs={24}>
            <MultiSelectItem
              title={Words.suppliers}
              dataSource={suppliers}
              keyColumn="SupplierID"
              valueColumn="Title"
              fieldName="Suppliers"
              fieldIDs="SuppliersIDs"
              formConfig={formConfig}
              setIDsAutomatically
              // required
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.purchasing_agent}
              dataSource={agents}
              keyColumn="PurchaseAgentID"
              valueColumn="FullName"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            {selectedObject && selectedObject.ItemID > 0 ? (
              <DropdownItem
                title={Words.status}
                dataSource={statuses}
                keyColumn="StatusID"
                valueColumn="Title"
                formConfig={formConfig}
              />
            ) : (
              <TextItem
                title={Words.status}
                value={Words.purchase_request_status_1}
                valueColor={Colors.magenta[6]}
              />
            )}
          </Col>
          <Col xs={24}>
            <InputItem
              title={Words.standard_description}
              fieldName="DetailsText"
              multiline
              rows={4}
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

export default PurchaseRequestItemModal;
