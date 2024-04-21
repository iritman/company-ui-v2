import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Typography, Descriptions } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../../common/modal-window";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import service from "../../../../../services/logistic/purchase/purchase-orders-service";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
  handleError,
} from "../../../../../tools/form-manager";
import InputItem from "../../../../form-controls/input-item";
import TextItem from "../../../../form-controls/text-item";
import NumericInputItem from "../../../../form-controls/numeric-input-item";
import DropdownItem from "../../../../form-controls/dropdown-item";
import SwitchItem from "../../../../form-controls/switch-item";

const { Text } = Typography;
const valueColor = Colors.blue[7];

const PurchaseRequestItemDetails = ({ selectedItem }) => {
  if (!selectedItem) return <></>;

  const {
    // RefItemID,
    RequestID,
    NeededItemCode,
    NeededItemTitle,
    FrontSideAccountTitle,
    RequestCount,
    MeasureUnitTitle,
    AgentFirstName,
    AgentLastName,
    NeedDate,
    RequestDate,
    InquiryDeadline,
  } = selectedItem;

  return (
    <Descriptions
      bordered
      column={{
        //   md: 2, sm: 2,
        lg: 2,
        md: 2,
        xs: 1,
      }}
      size="middle"
    >
      {/* <Descriptions.Item label={Words.id}>
        <Text style={{ color: valueColor }}>
          {utils.farsiNum(`${RefItemID}`)}
        </Text>
      </Descriptions.Item> */}

      <Descriptions.Item label={Words.request_no}>
        <Text style={{ color: Colors.red[6] }}>
          {utils.farsiNum(RequestID)}
        </Text>
      </Descriptions.Item>

      <Descriptions.Item label={Words.item_code}>
        <Text style={{ color: valueColor }}>
          {utils.farsiNum(NeededItemCode)}
        </Text>
      </Descriptions.Item>
      <Descriptions.Item label={Words.item_title}>
        <Text style={{ color: valueColor }}>{NeededItemTitle}</Text>
      </Descriptions.Item>
      <Descriptions.Item label={Words.consumer}>
        <Text style={{ color: valueColor }}>
          {utils.farsiNum(FrontSideAccountTitle)}
        </Text>
      </Descriptions.Item>
      <Descriptions.Item label={Words.request_count}>
        <Text style={{ color: valueColor }}>
          {utils.farsiNum(RequestCount)}
        </Text>
      </Descriptions.Item>
      <Descriptions.Item label={Words.unit}>
        <Text style={{ color: valueColor }}>{MeasureUnitTitle}</Text>
      </Descriptions.Item>

      <Descriptions.Item label={Words.request_date}>
        <Text style={{ color: valueColor }}>
          {utils.farsiNum(utils.slashDate(RequestDate))}
        </Text>
      </Descriptions.Item>
      <Descriptions.Item label={Words.need_date}>
        <Text style={{ color: valueColor }}>
          {utils.farsiNum(utils.slashDate(NeedDate))}
        </Text>
      </Descriptions.Item>
      <Descriptions.Item label={Words.inquiry_deadline}>
        <Text style={{ color: valueColor }}>
          {InquiryDeadline.length > 0
            ? utils.farsiNum(utils.slashDate(InquiryDeadline))
            : "-"}
        </Text>
      </Descriptions.Item>
      <Descriptions.Item label={Words.purchasing_agent}>
        <Text style={{ color: valueColor }}>
          {`${AgentFirstName} ${AgentLastName}`}
        </Text>
      </Descriptions.Item>
    </Descriptions>
  );
};

const schema = {
  ItemID: Joi.number().required(),
  OrderID: Joi.number().required(),
  BaseTypeID: Joi.number().required(),
  RefItemID: Joi.number().required(),
  ItemCode: Joi.number().required(),
  RequestCount: Joi.number()
    .min(1)
    .max(999999)
    .positive()
    .precision(2)
    .label(Words.request_count),
  MeasureUnitID: Joi.number().min(1).required().label(Words.measure_unit),
  PurchaseAgentID: Joi.number().min(1).required().label(Words.purchasing_agent),
  Fee: Joi.number().min(1000).label(Words.fee),
  Returnable: Joi.boolean(),
  TolerancePercent: Joi.number().label(Words.tolerance_percent),
  DetailsText: Joi.string()
    .min(5)
    .max(250)
    .allow("")
    .regex(utils.VALID_REGEX)
    .label(Words.descriptions),
  StatusID: Joi.number().min(1).required(),
};

const initRecord = {
  ItemID: 0,
  OrderID: 0,
  BaseTypeID: 0,
  RefItemID: 0,
  ItemCode: 0,
  RequestCount: 0,
  MeasureUnitID: 0,
  PurchaseAgentID: 0,
  Fee: 0,
  Returnable: true,
  TolerancePercent: 0,
  DetailsText: "",
  StatusID: 1,
};

const formRef = React.createRef();

const PurchaseOrderItemModal = ({
  isOpen,
  selectedObject,
  // selectedItems,
  setParams,
  baseConfig,
  onOk,
  onCancel,
}) => {
  const [progress, setProgress] = useState(false);
  const [errors, setErrors] = useState({});
  const [record, setRecord] = useState({});

  const [items, setItems] = useState([]);
  const [agents, setAgents] = useState([]);
  const [baseTypes, setBaseTypes] = useState([]);
  const [measureUnits, setMeasureUnits] = useState([]);
  const [productMeasureUnits, setProductMeasureUnits] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [productSearchProgress, setProductSearchProgress] = useState(false);
  const [products, setProducts] = useState([]);

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.BaseTypeID = 0;
    record.RefItemID = 0;
    record.ItemCode = 0;
    record.RequestCount = 0;
    record.MeasureUnitID = 0;
    record.PurchaseAgentID = 0;
    record.Fee = 0;
    record.Returnable = true;
    record.TolerancePercent = 0;
    record.DetailsText = "";
    record.StatusID = 1;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    setRecord(initRecord);
    console.log("so", selectedObject);
    setProgress(true);

    try {
      const { BaseTypeID, BaseID } = baseConfig;

      const params = await service.getItemParams();

      const { Agents, BaseTypes, MeasureUnits, Statuses } = params;

      setAgents(Agents);
      // if (BaseTypeID === 1) {
      //   setBaseTypes(BaseTypes.filter((bt) => bt.BaseTypeID < 3));
      // } else {
      setBaseTypes(BaseTypes.filter((bt) => bt.BaseTypeID === 3));
      // }
      setMeasureUnits(MeasureUnits);
      setStatuses(Statuses);

      setParams({
        Agents,
        Statuses,
        ItemBaseTypes: BaseTypes,
        PurchaseRequestItem: null,
        MeasureUnits,
        Products: [],
      });

      //------

      if (!selectedObject) {
        const rec = { ...initRecord };

        if (BaseTypeID === 2) {
          // 2: Pishfactor
          rec.BaseTypeID = 3; // command items

          const commanded_invoice_items = await service.getRegedCommandItems(
            BaseID
          );

          setItems(commanded_invoice_items);
        } else {
          rec.BaseTypeID = 1;
        }

        setRecord({ ...rec });
        loadFieldsValue(formRef, { ...rec });
      } else {
        const { BaseTypeID, RefItemID } = selectedObject;

        switch (BaseTypeID) {
          case 1: {
            // no base
            const selected_product = await service.getProductByID(
              selectedObject.ItemCode
            );

            setProducts([selected_product]);
            setProductMeasureUnits(
              MeasureUnits.filter((mu) =>
                selected_product.MeasureUnits.find(
                  (m_u) => mu.MeasureUnitID === m_u.MeasureUnitID
                )
              )
            );

            setParams({
              Agents,
              Statuses,
              ItemBaseTypes: BaseTypes,
              PurchaseRequestItem: null,
              MeasureUnits,
              Products: [selected_product],
            });

            break;
          }

          case 2: {
            // purchase request item
            const selected_purchase_request_item =
              await service.getRegedPurchaseRequestItemByID(
                selectedObject.RefItemID
              );

            setItems([selected_purchase_request_item]);

            break;
          }

          case 3: {
            // Invoice item
            const commanded_invoice_item =
              await service.getRegedCommandItemByID(RefItemID);

            setItems([commanded_invoice_item]);

            break;
          }

          default:
            break;
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

  const getSelectedItem = (item_id) => {
    let selected_item = null;

    if (item_id > 0) {
      selected_item = items.find((i) => i.RefItemID === item_id);

      if (!selected_item) selected_item = null;
    }

    return selected_item;
  };

  const handleChangeItem = (value) => {
    const rec = { ...record };
    rec.RefItemID = value;

    if (value === 0) {
      rec.ItemCode = 0;
      rec.RequestCount = 0;
      rec.MeasureUnitID = 0;
      rec.PurchaseAgentID = 0;
    } else {
      const selected_item = getSelectedItem(value);

      setParams({
        Agents: agents,
        Statuses: statuses,
        ItemBaseTypes: baseTypes,
        PurchaseRequestItem: selected_item,
      });

      rec.RequestCount = selected_item?.RequestCount;
      rec.ItemCode = selected_item.NeededItemCode;
      rec.MeasureUnitID = selected_item.NeededItemMeasureUnitID;

      //---
      if (
        agents?.find(
          (ag) => ag.PurchaseAgentID === selected_item.PurchaseAgentID
        )
      )
        rec.PurchaseAgentID = selected_item.PurchaseAgentID;

      //---
      if (
        measureUnits?.find(
          (mu) => mu.MeasureUnitID === selected_item.MeasureUnitID
        )
      )
        rec.MeasureUnitID = selected_item.NeededItemMeasureUnitID;
    }

    setRecord(rec);
    loadFieldsValue(formRef, rec);
  };

  //------

  const handleChangeBaseType = async (value) => {
    const rec = { ...record };
    rec.BaseTypeID = value || 0;

    if (value < 2) {
      setItems([]);

      rec.RefItemID = 0;
      rec.ItemCode = 0;
      rec.RequestCount = 0;
      rec.MeasureUnitID = 0;
      rec.PurchaseAgentID = 0;
      rec.Fee = 0;
      rec.Returnable = true;
      rec.TolerancePercent = 0;
      rec.DetailsText = "";
    } else {
      // load purchase request items
      try {
        const data = await service.getRegedPurchaseRequestItems();

        setItems(data);
      } catch (ex) {
        handleError(ex);
      }
    }

    setRecord(rec);
    loadFieldsValue(formRef, rec);
  };

  const handleSearchProduct = async (title) => {
    let data = [];

    setProductSearchProgress(true);

    try {
      data = await service.searchProducts(title);

      setProducts(data);
    } catch (ex) {
      handleError(ex);
    }

    setProductSearchProgress(false);

    return data;
  };

  const handleChangeProduct = (value) => {
    const rec = { ...record };
    rec.ItemCode = value | 0;

    if (value > 0) {
      const selected_product = products.find((p) => p.ItemCode === value);

      if (selected_product) {
        const { MeasureUnits } = selected_product;

        if (MeasureUnits.length > 0) {
          let default_measure_unit = MeasureUnits.find((mu) => mu.IsDefault);
          if (!default_measure_unit) default_measure_unit = MeasureUnits[0];

          rec.MeasureUnitID = default_measure_unit.MeasureUnitID || 0;

          setProductMeasureUnits(
            measureUnits.filter((mu) =>
              MeasureUnits.find((m_u) => mu.MeasureUnitID === m_u.MeasureUnitID)
            )
          );
        } else {
          setProductMeasureUnits([]);
          rec.MeasureUnitID = 0;
        }
      } else {
        rec.MeasureUnitID = 0;
      }
    } else {
      rec.MeasureUnitID = 0;
    }

    setRecord(rec);
    loadFieldsValue(formRef, rec);
  };

  //------
  console.log(record);
  console.log(validateForm({ record: record, schema }));
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
              valueColumn={"Title"}
              formConfig={formConfig}
              disabled={baseConfig.BaseTypeID === 2}
              autoFocus
              onChange={handleChangeBaseType}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.base_id}
              dataSource={items}
              keyColumn="RefItemID"
              valueColumn={"InfoTitle"}
              formConfig={formConfig}
              onChange={handleChangeItem}
              disabled={record.BaseTypeID < 2 || selectedObject}
            />
          </Col>
          <Col xs={24} md={12}>
            {baseConfig.BaseTypeID !== 2 && record.BaseTypeID < 2 ? (
              <DropdownItem
                title={Words.item_title}
                dataSource={products}
                keyColumn="ItemCode"
                valueColumn={"InfoTitle"}
                formConfig={formConfig}
                loading={productSearchProgress}
                onSearch={handleSearchProduct}
                onChange={handleChangeProduct}
              />
            ) : (
              <TextItem
                title={Words.item_title}
                value={utils.farsiNum(
                  getSelectedItem(record.RefItemID)?.NeededItemTitle || "-"
                )}
                valueColor={Colors.magenta[6]}
              />
            )}
          </Col>
          <Col xs={12} md={6}>
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
          <Col xs={12} md={6}>
            {record.BaseTypeID < 2 ? (
              <DropdownItem
                title={Words.unit}
                dataSource={productMeasureUnits}
                keyColumn="MeasureUnitID"
                valueColumn={"Title"}
                formConfig={formConfig}
                required
                disabled={record.ItemCode === 0}
              />
            ) : (
              <TextItem
                title={Words.unit}
                value={
                  getSelectedItem(record.RefItemID)?.MeasureUnitTitle || "-"
                }
                valueColor={Colors.magenta[6]}
              />
            )}
          </Col>
          {record?.RefItemID > 0 && (
            <Col xs={24}>
              <Form.Item>
                <PurchaseRequestItemDetails
                  selectedItem={getSelectedItem(record.RefItemID)}
                />
              </Form.Item>
            </Col>
          )}
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              title={Words.fee}
              fieldName="Fee"
              min={0}
              max={9999999999}
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <TextItem
              title={Words.price}
              value={utils.farsiNum(
                utils.moneyNumber(record.Fee * record.RequestCount)
              )}
              valueColor={Colors.magenta[6]}
            />
          </Col>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              title={Words.tolerance}
              fieldName="TolerancePercent"
              min={0}
              max={100}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.purchasing_agent}
              dataSource={agents}
              keyColumn="PurchaseAgentID"
              valueColumn={"FullName"}
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <SwitchItem
              title={Words.returnable}
              fieldName="Returnable"
              initialValue={true}
              checkedTitle={Words.yes}
              unCheckedTitle={Words.no}
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
                value={Words.invoice_status_1}
                valueColor={Colors.magenta[6]}
              />
            )}
          </Col>
          <Col xs={24}>
            <InputItem
              title={Words.standard_description}
              fieldName="DetailsText"
              multiline
              rows={3}
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

export default PurchaseOrderItemModal;
