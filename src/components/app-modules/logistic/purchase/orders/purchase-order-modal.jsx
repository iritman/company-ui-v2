import React, { useState } from "react";
import Joi from "joi-browser";
import { useMount } from "react-use";
import { Form, Row, Col, Divider, Typography } from "antd";
import ModalWindow from "../../../../common/modal-window";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import { v4 as uuid } from "uuid";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
  handleError,
} from "../../../../../tools/form-manager";
import service from "../../../../../services/logistic/purchase/purchase-orders-service";
import InputItem from "../../../../form-controls/input-item";
import DropdownItem from "../../../../form-controls/dropdown-item";
import DateItem from "../../../../form-controls/date-item";
import TextItem from "../../../../form-controls/text-item";
import {
  useModalContext,
  useResetContext,
} from "../../../../contexts/modal-context";
import DetailsTable from "../../../../common/details-table";
import OrderItemModal from "./purchase-order-item-modal";
import {
  schema,
  initRecord,
  getOrderItemColumns,
  getNewButton,
  getFooterButtons,
} from "./purchase-order-modal-code";

const { Text } = Typography;

const formRef = React.createRef();

const PurchaseOrderModal = ({
  access,
  isOpen,
  selectedObject,
  title,
  onOk,
  onCancel,
  onSaveOrderItem,
  onDeleteOrderItem,
  onReject,
  onApprove,
}) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [hasSaveApproveAccess, setHasSaveApproveAccess] = useState(false);
  const [hasRejectAccess, setHasRejectAccess] = useState(false);

  const [baseTypes, setBaseTypes] = useState([]);
  const [baseItems, setBaseItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [measureUnits, setMeasureUnits] = useState([]);
  const [products, setProducts] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [itemBaseTypes, setItemBaseTypes] = useState([]);
  const [purchaseRequestItem, setPurchaseRequestItem] = useState(null);

  const [selectedOrderItem, setSelectedOrderItem] = useState(null);
  const [showOrderItemModal, setShowOrderItemModal] = useState(false);

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.OrderDate = "";
    record.BaseTypeID = 1;
    record.BaseID = 0;
    record.SupplierID = 0;
    record.DetailsText = "";
    record.StatusID = 1;
    record.Items = [];

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();

    //------

    setProgress(true);

    try {
      const data = await service.getParams();

      let {
        BaseTypes,
        Suppliers,
        HasSaveApproveAccess,
        HasRejectAccess,
        CurrentDate,
      } = data;

      setBaseTypes(BaseTypes);
      setSuppliers(Suppliers);
      setHasSaveApproveAccess(HasSaveApproveAccess);
      setHasRejectAccess(HasRejectAccess);

      //------

      if (!selectedObject) {
        const rec = { ...initRecord };
        rec.OrderDate = `${CurrentDate}`;

        setRecord({ ...rec });
        loadFieldsValue(formRef, { ...rec });
      } else {
        const { BaseTypeID, BaseID } = selectedObject;

        if (BaseTypeID === 2) {
          const reged_invoice = await service.getRegedInvoiceByID(BaseID);

          setBaseItems([reged_invoice]);
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
    saveModalChanges(
      formConfig,
      selectedObject,
      setProgress,
      onOk,
      clearRecord
    );
  };

  const handleSubmitAndApprove = async () => {
    const rec = { ...record };
    rec.Items.forEach((item) => {
      if (item.StatusID === 1) {
        item.StatusID = 2;
        item.StatusTitle = Words.purchase_order_status_2;
      }
    });
    rec.StatusID = 2;
    setRecord(rec);

    const updated_config = { ...formConfig };
    updated_config.record = rec;

    saveModalChanges(
      updated_config,
      selectedObject,
      setProgress,
      onOk,
      clearRecord
    );
  };

  //------

  const handleGetItemParams = (params) => {
    const {
      PurchaseRequestItem,
      Agents,
      Statuses,
      ItemBaseTypes,
      MeasureUnits,
      Products,
    } = params;

    setAgents(Agents);
    setPurchaseRequestItem(PurchaseRequestItem);
    setStatuses(Statuses);
    setItemBaseTypes(ItemBaseTypes);
    setMeasureUnits(MeasureUnits);
    setProducts(Products);
  };

  const handleSaveOrderItem = async (order_item) => {
    if (selectedObject !== null && selectedObject.OrderID > 0) {
      order_item.OrderID = selectedObject.OrderID;

      const saved_order_item = await onSaveOrderItem(order_item);

      const index = record.Items.findIndex(
        (item) => item.ItemID === order_item.ItemID
      );

      if (index === -1) {
        record.Items = [...record.Items, saved_order_item];
      } else {
        record.Items[index] = saved_order_item;
      }
    } else {
      //While adding items temporarily, we have no jpin operation in database
      //So, we need to select titles manually

      if (purchaseRequestItem) {
        const {
          NeededItemCode,
          NeededItemTitle,
          MeasureUnitTitle,
          FrontSideAccountTitle,
          NeedDate,
          RequestDate,
          InquiryDeadline,
          AgentFirstName,
          AgentLastName,
          // StatusTitle,
        } = purchaseRequestItem;

        order_item = {
          ...order_item,
          NeededItemCode,
          NeededItemTitle,
          MeasureUnitTitle,
          FrontSideAccountTitle,
          NeedDate,
          RequestDate,
          InquiryDeadline,
          AgentFirstName,
          AgentLastName,
          // StatusTitle,
        };
      } else {
        const selected_agent = agents?.find(
          (a) => a.PurchaseAgentID === order_item.PurchaseAgentID
        );

        if (selected_agent) {
          const { FirstName, LastName } = selected_agent;

          order_item.AgentFirstName = FirstName;
          order_item.AgentLastName = LastName;
        }

        //---

        const selected_mesure_unit = measureUnits?.find(
          (mu) => mu.MeasureUnitID === order_item.MeasureUnitID
        );

        order_item.MeasureUnitTitle = selected_mesure_unit.Title;

        //---

        order_item.NeededItemTitle = products?.find(
          (p) => p.ProductID === order_item.NeededItemCode
        )?.Title;
      }

      order_item.StatusTitle = statuses?.find(
        (sts) => sts.StatusID === order_item.StatusID
      )?.Title;

      order_item.BaseTypeTitle = itemBaseTypes?.find(
        (bt) => bt.BaseTypeID === order_item.BaseTypeID
      )?.Title;

      //--- managing unique id (UID) for new items
      if (order_item.ItemID === 0 && selectedOrderItem === null) {
        order_item.UID = uuid();
        record.Items = [...record.Items, order_item];
      } else if (order_item.ItemID === 0 && selectedOrderItem !== null) {
        const index = record.Items.findIndex(
          (item) => item.UID === selectedOrderItem.UID
        );
        record.Items[index] = order_item;
      }
    }

    //------

    setRecord({ ...record });
    setSelectedOrderItem(null);
  };

  const handleDeleteOrderItem = async (item) => {
    setProgress(true);

    try {
      if (item.ItemID > 0) {
        await onDeleteOrderItem(item.ItemID);

        record.Items = record.Items.filter((i) => i.ItemID !== item.ItemID);
      } else {
        record.Items = record.Items.filter((i) => i.UID !== item.UID);
      }

      setRecord({ ...record });
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleCloseOrderItemModal = () => {
    setSelectedOrderItem(null);
    setShowOrderItemModal(false);
  };

  const handleEditOrderItem = (data) => {
    setSelectedOrderItem(data);
    setShowOrderItemModal(true);
  };

  const handleNewItemClick = () => {
    setSelectedOrderItem(null);
    setShowOrderItemModal(true);
  };

  //------

  const handleChangeBaseType = (value) => {
    const rec = { ...record };
    rec.BaseTypeID = value || 0;

    if (value > 1) {
      schema.BaseID = Joi.number().required().min(1).label(Words.base_id);
      schema.SupplierID = Joi.number().required().min(1).label(Words.supplier);
    } else {
      schema.BaseID = Joi.number().required().label(Words.base_id);
      schema.SupplierID = Joi.number().required().label(Words.supplier);

      rec.BaseID = 0;
      setBaseItems([]);
    }

    setRecord(rec);
    loadFieldsValue(formRef, rec);
  };

  const handleChangeSupplier = async (value) => {
    const rec = { ...record };
    rec.SupplierID = value || 0;

    if (value > 0) {
      const data = await service.getRegedInvoices(value);

      setBaseItems(data);
    } else {
      setBaseItems([]);
    }

    setRecord(rec);
  };

  //------

  const is_disable =
    record?.Items?.length === 0 || (validateForm({ record, schema }) && true);

  const status_id =
    selectedObject === null ? record.StatusID : selectedObject.StatusID;

  const footer_config = {
    is_disable,
    progress,
    hasSaveApproveAccess,
    selectedObject,
    handleSubmit,
    handleSubmitAndApprove,
    hasRejectAccess,
    clearRecord,
    onApprove,
    onReject,
    onCancel,
  };

  const { BaseTypeID, BaseID, SupplierID } = record;
  const base_config = {
    BaseTypeID,
    BaseID,
    SupplierID,
  };

  //------

  return (
    <>
      <ModalWindow
        isOpen={isOpen}
        isEdit={isEdit}
        inProgress={progress}
        disabled={is_disable}
        width={1250}
        footer={getFooterButtons(footer_config)}
        onCancel={onCancel}
        title={title}
      >
        <Form ref={formRef} name="dataForm">
          <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
            {selectedObject && (
              <Col xs={24}>
                <TextItem
                  title={Words.id}
                  value={
                    selectedObject
                      ? utils.farsiNum(selectedObject.OrderID)
                      : "-"
                  }
                  valueColor={Colors.magenta[6]}
                />
              </Col>
            )}
            <Col xs={24} md={12} lg={8}>
              <DateItem
                horizontal
                title={Words.purchase_order_date}
                fieldName="OrderDate"
                formConfig={formConfig}
                required
              />
            </Col>
            <Col xs={24} md={12} lg={8}>
              <DropdownItem
                title={Words.base_type}
                dataSource={baseTypes}
                keyColumn="BaseTypeID"
                valueColumn="Title"
                formConfig={formConfig}
                required
                disabled={record?.Items?.length > 0}
                onChange={handleChangeBaseType}
              />
            </Col>
            <Col xs={24} md={12} lg={8}>
              <DropdownItem
                title={Words.base_id}
                dataSource={baseItems}
                keyColumn="BaseID"
                valueColumn="InfoTitle"
                formConfig={formConfig}
                required={record.BaseTypeID > 1}
                disabled={
                  record.BaseTypeID <= 1 ||
                  record.SupplierID === 0 ||
                  record?.Items?.length > 0
                }
              />
            </Col>
            <Col xs={24} md={12}>
              <DropdownItem
                title={Words.supplier}
                dataSource={suppliers}
                keyColumn="SupplierID"
                valueColumn="Title"
                formConfig={formConfig}
                required={record.BaseTypeID > 1}
                disabled={record?.Items?.length > 0}
                onChange={handleChangeSupplier}
              />
            </Col>
            <Col xs={24} md={12}>
              <InputItem
                title={Words.descriptions}
                fieldName="DetailsText"
                multiline
                rows={2}
                showCount
                maxLength={512}
                formConfig={formConfig}
              />
            </Col>

            {/* ToDo: Implement base_doc_id field based on the selected base type */}
            <Col xs={24}>
              <Divider orientation="right">
                <Text style={{ fontSize: 14, color: Colors.green[6] }}>
                  {Words.purchase_order_items}
                </Text>
              </Divider>
            </Col>

            {record.Items && (
              <>
                <Col xs={24}>
                  <Form.Item>
                    <Row gutter={[0, 15]}>
                      <Col xs={24}>
                        <DetailsTable
                          records={record.Items}
                          columns={getOrderItemColumns(
                            access,
                            status_id,
                            handleEditOrderItem,
                            handleDeleteOrderItem
                          )}
                          emptyDataMessage={Words.no_purchase_order_item}
                        />
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
              </>
            )}

            {status_id === 1 && (
              <Col xs={24}>
                <Form.Item>{getNewButton(false, handleNewItemClick)}</Form.Item>
              </Col>
            )}
          </Row>
        </Form>
      </ModalWindow>

      {showOrderItemModal && (
        <OrderItemModal
          isOpen={showOrderItemModal}
          selectedObject={selectedOrderItem}
          selectedItems={record?.Items}
          setParams={handleGetItemParams}
          baseConfig={base_config}
          onOk={handleSaveOrderItem}
          onCancel={handleCloseOrderItemModal}
        />
      )}
    </>
  );
};

export default PurchaseOrderModal;
