import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Typography, Descriptions } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../../common/modal-window";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import service from "../../../../../services/logistic/purchase/deliveries-service";
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

const { Text } = Typography;
const valueColor = Colors.blue[7];

const OrderItemDetails = ({ selectedItem }) => {
  if (!selectedItem) return <></>;

  const { OrderID, OrderDate } = selectedItem;

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
      <Descriptions.Item label={Words.order_no}>
        <Text style={{ color: Colors.red[6] }}>{utils.farsiNum(OrderID)}</Text>
      </Descriptions.Item>
      <Descriptions.Item label={Words.purchase_order_date}>
        <Text style={{ color: valueColor }}>
          {OrderDate.length > 0
            ? utils.farsiNum(utils.slashDate(OrderDate))
            : "-"}
        </Text>
      </Descriptions.Item>
    </Descriptions>
  );
};

const schema = {
  ItemID: Joi.number().required(),
  DeliveryID: Joi.number().required(),
  BaseTypeID: Joi.number().required(),
  FrontSideAccountID: Joi.number().required(),
  OrderItemID: Joi.number().required(),
  ItemCode: Joi.number().required(),
  ItemCount: Joi.number()
    .min(0.01)
    .max(999999)
    .positive()
    .precision(2)
    .label(Words.item_count),
  MeasureUnitID: Joi.number().min(1).required().label(Words.measure_unit),
  PurchaseAgentID: Joi.number().min(1).required().label(Words.purchasing_agent),
  AcceptableDecreaseAmount: Joi.number()
    .min(0)
    .max(999999)
    .precision(2)
    .label(Words.acceptable_decrease_amount),
  ExtraAmount: Joi.number()
    .min(0)
    .max(999999)
    .precision(2)
    .label(Words.extra_amount),
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
  DeliveryID: 0,
  BaseTypeID: 1,
  FrontSideAccountID: 0,
  OrderItemID: 0,
  ItemCode: 0,
  ItemCount: 0,
  AcceptableDecreaseAmount: 0,
  ExtraAmount: 0,
  MeasureUnitID: 0,
  PurchaseAgentID: 0,
  DetailsText: "",
  StatusID: 1,
};

const formRef = React.createRef();

const PurchaseDeliveryItemModal = ({
  isOpen,
  selectedObject,
  selectedItems,
  setParams,
  onOk,
  onCancel,
}) => {
  const [progress, setProgress] = useState(false);
  const [errors, setErrors] = useState({});
  const [record, setRecord] = useState({});

  const [agents, setAgents] = useState([]);
  const [baseTypes, setBaseTypes] = useState([]);

  const [items, setItems] = useState([]);
  const [measureUnits, setMeasureUnits] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [frontSideSearchProgress, setFrontSideSearchProgress] = useState(false);
  const [frontSideAccounts, setFrontSideAccounts] = useState([]);
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
    record.BaseTypeID = 1;
    record.OrderItemID = 0;
    record.ItemCode = 0;
    record.ItemCount = 0;
    record.AcceptableDecreaseAmount = 0;
    record.ExtraAmount = 0;
    record.MeasureUnitID = 0;
    record.PurchaseAgentID = 0;
    record.DetailsText = "";
    record.StatusID = 1;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    setRecord(initRecord);

    setProgress(true);

    try {
      const params = await service.getItemParams();

      const { Agents, BaseTypes, Statuses } = params;

      setAgents(Agents);
      setBaseTypes(BaseTypes);
      setStatuses(Statuses);

      setParams({
        BaseTypes,
        FrontSideAccounts: [],
        Products: [],
        MeasureUnits: [],
        Agents,
        Statuses,
      });

      //------

      if (!selectedObject) {
        const rec = { ...initRecord };

        setRecord({ ...rec });
        loadFieldsValue(formRef, { ...rec });
      } else {
        const { FrontSideAccountID, BaseTypeID, OrderItemID, ItemCode } =
          selectedObject;

        //------

        const front_side_account =
          await service.searchDeliveryFrontSideAccountByID(FrontSideAccountID);

        setFrontSideAccounts([front_side_account]);

        //------

        switch (BaseTypeID) {
          case 1: {
            // no base
            const selected_product = await service.searchDeliveryProductByID(
              ItemCode
            );

            setProducts([selected_product]);
            setMeasureUnits(selected_product.MeasureUnits);

            setParams({
              BaseTypes,
              FrontSideAccounts: [front_side_account],
              Products: [selected_product],
              MeasureUnits: selected_product.MeasureUnits,
              Agents,
              Statuses,
              OrderItem: null,
            });

            break;
          }

          case 2: {
            // order item
            const selected_order_item = await service.getRegedOrderItemByID(
              OrderItemID
            );

            setParams({
              BaseTypes,
              FrontSideAccounts: [front_side_account],
              Products: [],
              MeasureUnits: [],
              Agents,
              Statuses,
              OrderItem: selected_order_item,
            });

            setItems([selected_order_item]);

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
      selected_item = items.find((i) => i.OrderItemID === item_id);

      if (!selected_item) selected_item = null;
    }

    return selected_item;
  };

  const handleChangeItem = (value) => {
    const rec = { ...record };
    rec.OrderItemID = value;

    if (value === 0) {
      rec.ItemCode = 0;
      rec.ItemCount = 0;
      rec.MeasureUnitID = 0;
      rec.PurchaseAgentID = 0;
    } else {
      const selected_item = getSelectedItem(value);

      setParams({
        BaseTypes: baseTypes,
        FrontSideAccounts: frontSideAccounts,
        Products: products,
        MeasureUnits: measureUnits,
        Agents: agents,
        Statuses: statuses,
        OrderItem: selected_item,
      });

      rec.ItemCount = selected_item?.RequestCount;
      rec.ItemCode = selected_item.ItemCode;
      rec.MeasureUnitID = selected_item.MeasureUnitID;
      rec.PurchaseAgentID = selected_item.PurchaseAgentID;
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

      rec.FrontSideAccountID = 0;
      rec.OrderItemID = 0;
      rec.ItemCode = 0;
      rec.AcceptableDecreaseAmount = 0;
      rec.ExtraAmount = 0;
      rec.MeasureUnitID = 0;
      rec.PurchaseAgentID = 0;
    } else {
      // load order items
      try {
        const data = await service.getRegedRegedOrderItems();
        setItems(
          data.filter(
            (i) =>
              !selectedItems.find(
                (si) => si.BaseTypeID === 2 && si.OrderItemID === i.OrderItemID
              )
          )
        );
      } catch (ex) {
        handleError(ex);
      }
    }

    setProducts([]);
    setRecord(rec);
    loadFieldsValue(formRef, rec);
  };

  //------

  const handleChangeFrontSideAccount = (value) => {
    const rec = { ...record };
    rec.FrontSideAccountID = value || 0;

    rec.OrderItemID = 0;
    rec.ItemCode = 0;
    rec.ItemCount = 0;
    rec.AcceptableDecreaseAmount = 0;
    rec.ExtraAmount = 0;
    rec.MeasureUnitID = 0;
    rec.PurchaseAgentID = 0;

    setProducts([]);
    setRecord(rec);
    loadFieldsValue(formRef, rec);
  };

  const handleSearchFrontSideAccount = async (searchText) => {
    setFrontSideSearchProgress(true);

    try {
      const data = await service.searchDeliveryFrontSideAccounts(searchText);

      setFrontSideAccounts(data);

      setParams({
        BaseTypes: baseTypes,
        FrontSideAccounts: data,
        Products: products,
        MeasureUnits: measureUnits,
        Agents: agents,
        Statuses: statuses,
      });
    } catch (ex) {
      handleError(ex);
    }

    setFrontSideSearchProgress(false);
  };

  //------

  const handleChangeProduct = (value) => {
    const rec = { ...record };
    rec.ItemCode = value || 0;

    rec.ItemCount = 0;
    rec.AcceptableDecreaseAmount = 0;
    rec.ExtraAmount = 0;
    rec.MeasureUnitID = 0;
    rec.PurchaseAgentID = 0;

    if (value > 0) {
      const selected_product = products.find((p) => p.ItemCode === value);

      const selected_measure_units = selected_product?.MeasureUnits || [];

      setMeasureUnits(selected_measure_units);

      setParams({
        BaseTypes: baseTypes,
        FrontSideAccounts: frontSideAccounts,
        Products: products,
        MeasureUnits: selected_measure_units,
        Agents: agents,
        Statuses: statuses,
      });
    } else setMeasureUnits([]);

    setRecord(rec);
    loadFieldsValue(formRef, rec);
  };

  const handleSearchProduct = async (searchText) => {
    setProductSearchProgress(true);

    try {
      const data = await service.searchDeliveryProducts(searchText);

      setProducts(data);

      setParams({
        BaseTypes: baseTypes,
        FrontSideAccounts: frontSideAccounts,
        Products: data,
        MeasureUnits: measureUnits,
        Agents: agents,
        Statuses: statuses,
      });
    } catch (ex) {
      handleError(ex);
    }

    setProductSearchProgress(false);
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
              valueColumn={"Title"}
              formConfig={formConfig}
              onChange={handleChangeBaseType}
              autoFocus
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.front_side}
              dataSource={frontSideAccounts}
              keyColumn="FrontSideAccountID"
              valueColumn="Title"
              formConfig={formConfig}
              loading={frontSideSearchProgress}
              onSearch={handleSearchFrontSideAccount}
              onChange={handleChangeFrontSideAccount}
              disabled={record.BaseTypeID === 0}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.base_id}
              dataSource={items}
              keyColumn="OrderItemID"
              valueColumn={"InfoTitle"}
              formConfig={formConfig}
              onChange={handleChangeItem}
              disabled={record.BaseTypeID < 2}
            />
          </Col>
          <Col xs={24} md={12}>
            {record.BaseTypeID === 1 ? (
              <DropdownItem
                title={Words.item_title}
                dataSource={products}
                keyColumn="ItemCode"
                valueColumn="TitleInfo"
                formConfig={formConfig}
                loading={productSearchProgress}
                onSearch={handleSearchProduct}
                onChange={handleChangeProduct}
                disabled={record.FrontSideAccountID === 0}
                required
              />
            ) : (
              <TextItem
                title={Words.item_title}
                value={utils.farsiNum(
                  getSelectedItem(record.OrderItemID)?.NeededItemTitle || "-"
                )}
                valueColor={Colors.magenta[6]}
              />
            )}
          </Col>
          <Col xs={12}>
            <NumericInputItem
              horizontal
              title={Words.item_count}
              fieldName="ItemCount"
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
          <Col xs={12}>
            {record.BaseTypeID === 1 ? (
              <DropdownItem
                title={Words.unit}
                dataSource={measureUnits}
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
                  getSelectedItem(record.OrderItemID)?.MeasureUnitTitle || "-"
                }
                valueColor={Colors.magenta[6]}
              />
            )}
          </Col>
          {record?.OrderItemID > 0 && (
            <Col xs={24}>
              <Form.Item>
                <OrderItemDetails
                  selectedItem={getSelectedItem(record.OrderItemID)}
                />
              </Form.Item>
            </Col>
          )}
          <Col xs={12}>
            <NumericInputItem
              horizontal
              title={Words.acceptable_decrease_amount}
              fieldName="AcceptableDecreaseAmount"
              min={0}
              max={999999}
              precision={2}
              maxLength={7}
              step="0.01"
              stringMode
              decimalText
              formConfig={formConfig}
            />
          </Col>
          <Col xs={12}>
            <NumericInputItem
              horizontal
              title={Words.extra_amount}
              fieldName="ExtraAmount"
              min={0}
              max={999999}
              precision={2}
              maxLength={7}
              step="0.01"
              stringMode
              decimalText
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
                value={Words.purchase_delivery_status_1}
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

export default PurchaseDeliveryItemModal;
