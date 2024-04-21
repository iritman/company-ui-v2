import React, { useState } from "react";
// import Joi from "joi-browser";
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
import service from "../../../../../services/logistic/purchase/deliveries-service";
import InputItem from "../../../../form-controls/input-item";
import DropdownItem from "../../../../form-controls/dropdown-item";
import DateItem from "../../../../form-controls/date-item";
import TextItem from "../../../../form-controls/text-item";
import {
  useModalContext,
  useResetContext,
} from "../../../../contexts/modal-context";
import DetailsTable from "../../../../common/details-table";
import DeliveryItemModal from "./purchase-delivery-item-modal";
import {
  schema,
  initRecord,
  getDeliveryItemColumns,
  getNewButton,
  getFooterButtons,
} from "./purchase-delivery-modal-code";

const { Text } = Typography;

const formRef = React.createRef();

const PurchaseDeliveryModal = ({
  access,
  isOpen,
  selectedObject,
  onOk,
  onCancel,
  onSaveDeliveryItem,
  onDeleteDeliveryItem,
  onReject,
  onApprove,
}) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [hasSaveApproveAccess, setHasSaveApproveAccess] = useState(false);
  const [hasRejectAccess, setHasRejectAccess] = useState(false);

  const [transfereeTypes, setTransfereeTypes] = useState([]);
  const [transferees, setTransferees] = useState([]);
  const [transfereeProgress, setTransfereeProgress] = useState(false);
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [deliveryPersonProgress, setDeliveryPersonProgress] = useState(false);

  const [baseTypes, setBaseTypes] = useState([]);
  const [frontSideAccounts, setFrontSideAccounts] = useState([]);
  const [products, setProducts] = useState([]);
  const [measureUnits, setMeasureUnits] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [agents, setAgents] = useState([]);
  const [orderItem, setOrderItem] = useState(null);

  /*
  const [baseItems, setBaseItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [itemBaseTypes, setItemBaseTypes] = useState([]);
  const [purchaseRequestItem, setPurchaseRequestItem] = useState(null);
*/
  const [selectedDeliveryItem, setSelectedDeliveryItem] = useState(null);
  const [showDeliveryItemModal, setShowDeliveryItemModal] = useState(false);

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.DeliveryDate = "";
    record.TransfereeTypeID = 0;
    record.TransfereeTafsilAccountID = 0;
    record.DeliveryTafsilAccountID = 0;
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
        TransfereeTypes,
        // ItemBaseTypes,
        HasSaveApproveAccess,
        HasRejectAccess,
        CurrentDate,
      } = data;

      setTransfereeTypes(TransfereeTypes);
      //   setItemBaseTypes(ItemBaseTypes);
      setHasSaveApproveAccess(HasSaveApproveAccess);
      setHasRejectAccess(HasRejectAccess);

      //------

      if (!selectedObject) {
        const rec = { ...initRecord };
        rec.DeliveryDate = `${CurrentDate}`;

        setRecord({ ...rec });
        loadFieldsValue(formRef, { ...rec });
      } else {
        const { DeliveryTafsilAccountID, TransfereeTafsilAccountID } =
          selectedObject;

        const delivery_person = await service.searchDeliveryPersonByID(
          DeliveryTafsilAccountID
        );

        setDeliveryPersons([delivery_person]);

        //---

        const transferee = await service.searchTransfereeByID(
          TransfereeTafsilAccountID
        );

        setTransferees([transferee]);

        //---

        // if (BaseTypeID === 2) {
        //   const reged_invoice = await service.getRegedInvoiceByID(BaseID);

        //   setBaseItems([reged_invoice]);
        // }

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
      BaseTypes,
      FrontSideAccounts,
      Products,
      MeasureUnits,
      Agents,
      Statuses,
      OrderItem,
    } = params;

    setBaseTypes(BaseTypes);
    setFrontSideAccounts(FrontSideAccounts);
    setProducts(Products);
    setMeasureUnits(MeasureUnits);
    setAgents(Agents);
    setStatuses(Statuses);
    setOrderItem(OrderItem);
  };

  const handleSaveDeliveryItem = async (delivery_item) => {
    if (selectedObject !== null) {
      delivery_item.DeliveryID = selectedObject.DeliveryID;

      const saved_delivery_item = await onSaveDeliveryItem(delivery_item);

      const index = record.Items.findIndex(
        (item) => item.ItemID === delivery_item.ItemID
      );

      if (index === -1) {
        record.Items = [...record.Items, saved_delivery_item];
      } else {
        record.Items[index] = saved_delivery_item;
      }
    } else {
      //While adding items temporarily, we have no jpin operation in database
      //So, we need to select titles manually

      if (orderItem) {
        const {
          ItemCode,
          NeededItemTitle,
          MeasureUnitTitle,
          AgentFirstName,
          AgentLastName,
        } = orderItem;

        delivery_item = {
          ...delivery_item,
          ItemCode,
          NeededItemTitle,
          MeasureUnitTitle,
          AgentFirstName,
          AgentLastName,
        };
      } else {
        delivery_item.NeededItemTitle =
          products?.find((r) => r.ItemCode === delivery_item.ItemCode)?.Title ||
          "";

        delivery_item.MeasureUnitTitle =
          measureUnits.find(
            (r) => r.MeasureUnitID === delivery_item.MeasureUnitID
          )?.Title || "";

        const selected_agent = agents?.find(
          (a) => a.PurchaseAgentID === delivery_item.PurchaseAgentID
        );
        if (selected_agent) {
          const { FirstName, LastName } = selected_agent;
          delivery_item.AgentFirstName = FirstName;
          delivery_item.AgentLastName = LastName;
        }
      }

      delivery_item.BaseTypeTitle =
        baseTypes.find((r) => r.BaseTypeID === delivery_item.BaseTypeID)
          ?.Title || "";

      delivery_item.FrontSideAccountTitle =
        frontSideAccounts.find(
          (r) => r.FrontSideAccountID === delivery_item.FrontSideAccountID
        )?.Title || "";

      delivery_item.StatusTitle =
        statuses.find((r) => r.StatusID === delivery_item.StatusID)?.Title ||
        "";

      //--- managing unique id (UID) for new items
      if (delivery_item.ItemID === 0 && selectedDeliveryItem === null) {
        delivery_item.UID = uuid();
        record.Items = [...record.Items, delivery_item];
      } else if (delivery_item.ItemID === 0 && selectedDeliveryItem !== null) {
        const index = record.Items.findIndex(
          (item) => item.UID === selectedDeliveryItem.UID
        );
        record.Items[index] = delivery_item;
      }
    }

    //------

    setRecord({ ...record });
    setSelectedDeliveryItem(null);
  };

  const handleDeleteDeliveryItem = async (item) => {
    setProgress(true);

    try {
      if (item.ItemID > 0) {
        await onDeleteDeliveryItem(item.ItemID);

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

  const handleCloseDeliveryItemModal = () => {
    setSelectedDeliveryItem(null);
    setShowDeliveryItemModal(false);
  };

  const handleEditDeliveryItem = (data) => {
    setSelectedDeliveryItem(data);
    setShowDeliveryItemModal(true);
  };

  const handleNewItemClick = () => {
    setSelectedDeliveryItem(null);
    setShowDeliveryItemModal(true);
  };

  //------

  //   const handleChangeBaseType = (value) => {
  //     const rec = { ...record };
  //     rec.BaseTypeID = value || 0;

  //     if (value > 1) {
  //       schema.BaseID = Joi.number().required().min(1).label(Words.base_id);
  //       schema.SupplierID = Joi.number().required().min(1).label(Words.supplier);
  //     } else {
  //       schema.BaseID = Joi.number().required().label(Words.base_id);
  //       schema.SupplierID = Joi.number().required().label(Words.supplier);

  //       rec.BaseID = 0;
  //       setBaseItems([]);
  //     }

  //     setRecord(rec);
  //     loadFieldsValue(formRef, rec);
  //   };

  //   const handleChangeSupplier = async (value) => {
  //     const rec = { ...record };
  //     rec.SupplierID = value || 0;

  //     if (value > 0) {
  //       const data = await service.getRegedInvoices(value);

  //       setBaseItems(data);
  //     } else {
  //       setBaseItems([]);
  //     }

  //     setRecord(rec);
  //   };

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

  //   const { BaseTypeID, BaseID, SupplierID } = record;
  //   const base_config = {
  //     BaseTypeID,
  //     BaseID,
  //     SupplierID,
  //   };

  //------

  // ------

  //------

  const handleChangeTransferee = (value) => {
    const rec = { ...record };
    rec.TransfereeTafsilAccountID = value || 0;

    setRecord(rec);
  };

  const handleSearchTransferee = async (searchText) => {
    setTransfereeProgress(true);

    try {
      const data = await service.searchTransferees(searchText);

      const transferee_type_tafsil_type =
        transfereeTypes.find(
          (t) => t.TransfereeTypeID === record.TransfereeTypeID
        )?.TafsilTypeID || 0;

      setTransferees(
        data.filter((tt) => tt.TafsilTypeID === transferee_type_tafsil_type)
      );
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

  //------

  const handleChangeTransfereeType = (value) => {
    const rec = { ...record };
    rec.TransfereeTypeID = value || 0;
    rec.TransfereeTafsilAccountID = 0;

    setTransferees([]);
    setRecord(rec);
    loadFieldsValue(formRef, rec);
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
      >
        <Form ref={formRef} name="dataForm">
          <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
            {selectedObject && (
              <Col xs={24}>
                <TextItem
                  title={Words.id}
                  value={
                    selectedObject
                      ? utils.farsiNum(selectedObject.DeliveryID)
                      : "-"
                  }
                  valueColor={Colors.magenta[6]}
                />
              </Col>
            )}
            <Col xs={24} md={12}>
              <DateItem
                horizontal
                title={Words.purchase_delivery_date}
                fieldName="DeliveryDate"
                formConfig={formConfig}
                required
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
                onChange={handleChangeTransfereeType}
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
            <Col xs={24}>
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
                          columns={getDeliveryItemColumns(
                            access,
                            status_id,
                            handleEditDeliveryItem,
                            handleDeleteDeliveryItem
                          )}
                          emptyDataMessage={Words.no_purchase_delivery_item}
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

      {showDeliveryItemModal && (
        <DeliveryItemModal
          isOpen={showDeliveryItemModal}
          selectedObject={selectedDeliveryItem}
          selectedItems={record?.Items}
          setParams={handleGetItemParams}
          //   baseConfig={base_config}
          onOk={handleSaveDeliveryItem}
          onCancel={handleCloseDeliveryItemModal}
        />
      )}
    </>
  );
};

export default PurchaseDeliveryModal;
