import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Tabs } from "antd";
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
import service from "../../../../../services/logistic/purchase/inquiry-requests-service";
import InputItem from "../../../../form-controls/input-item";
import DateItem from "../../../../form-controls/date-item";
import TextItem from "../../../../form-controls/text-item";
import {
  useModalContext,
  useResetContext,
} from "../../../../contexts/modal-context";
import DetailsTable from "../../../../common/details-table";
import InquiryItemModal from "./inquiry-request-item-modal";
import InquirySupplierModal from "./inquiry-request-supplier-modal";
import {
  schema,
  initRecord,
  getInquiryItemColumns,
  getInquirySupplierColumns,
  getNewButton,
  getFooterButtons,
} from "./inquiry-request-modal-code";

const formRef = React.createRef();

const InquiryRequestModal = ({
  access,
  isOpen,
  selectedObject,
  title,
  onOk,
  onCancel,
  onSaveInquiryItem,
  onDeleteInquiryItem,
  onSaveInquirySupplier,
  onDeleteInquirySupplier,
  onReject,
  onApprove,
}) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [hasSaveApproveAccess, setHasSaveApproveAccess] = useState(false);
  const [hasRejectAccess, setHasRejectAccess] = useState(false);

  const [agents, setAgents] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [purchaseItem, setPurchaseItem] = useState(null);

  const [selectedInquiryItem, setSelectedInquiryItem] = useState(null);
  const [showInquiryItemModal, setShowInquiryItemModal] = useState(false);

  const [selectedInquirySupplier, setSelectedInquirySupplier] = useState(null);
  const [showInquirySupplierModal, setShowInquirySupplierModal] =
    useState(false);
  const [addedSupplier, setAddedSupplier] = useState(null);

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.InquiryDeadline = "";
    record.InquiryDate = "";
    record.DetailsText = "";
    record.StatusID = 1;
    record.Items = [];
    record.Suppliers = [];

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

      let { HasSaveApproveAccess, HasRejectAccess, CurrentDate } = data;

      setHasSaveApproveAccess(HasSaveApproveAccess);
      setHasRejectAccess(HasRejectAccess);

      //------

      if (!selectedObject) {
        const rec = { ...initRecord };
        rec.InquiryDate = `${CurrentDate}`;

        setRecord({ ...rec });
        loadFieldsValue(formRef, { ...rec });
      } else {
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
        item.StatusTitle = Words.inquiry_request_status_2;
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
    const { PurchaseItem, Agents, Statuses } = params;

    setPurchaseItem(PurchaseItem);
    setAgents(Agents);
    setStatuses(Statuses);
  };

  const handleSaveInquiryItem = async (inquiry_item) => {
    if (selectedObject !== null && selectedObject.RequestID > 0) {
      inquiry_item.RequestID = selectedObject.RequestID;

      const data = await onSaveInquiryItem(inquiry_item);

      const { SavedItem, NewSuppliers } = data;

      const saved_inquiry_request_item = SavedItem;

      const index = record.Items.findIndex(
        (item) => item.ItemID === inquiry_item.ItemID
      );

      if (index === -1) {
        record.Items = [...record.Items, saved_inquiry_request_item];
      } else {
        record.Items[index] = saved_inquiry_request_item;
      }

      record.Suppliers = [...record.Suppliers, ...NewSuppliers];
    } else {
      //While adding items temporarily, we have no jpin operation in database
      //So, we need to select titles manually

      if (purchaseItem) {
        const {
          NeededItemCode,
          NeededItemTitle,
          MeasureUnitTitle,
          FrontSideAccountTitle,
          NeedDate,
          RequestDate,
          InquiryDeadline,
          // AgentFirstName,
          // AgentLastName,
          // StatusTitle,
          Suppliers,
        } = purchaseItem;

        inquiry_item = {
          ...inquiry_item,
          NeededItemCode,
          NeededItemTitle,
          MeasureUnitTitle,
          FrontSideAccountTitle,
          NeedDate,
          RequestDate,
          InquiryDeadline,
          // AgentFirstName,
          // AgentLastName,
          // StatusTitle,
        };

        // add selected purchase item's suppliers to the inquiry request's suppliers
        // which not added before

        const new_suppliers = Suppliers.filter(
          (sp) =>
            !record.Suppliers.find((sup) => sup.SupplierID === sp.SupplierID)
        );

        new_suppliers.forEach((sp) => {
          sp.SupplierTitle = sp.Title;
          delete sp.Title;
          delete sp.RowID;
        });

        record.Suppliers = [...record.Suppliers, ...new_suppliers];
      }

      const agent = agents?.find(
        (ag) => ag.PurchaseAgentID === inquiry_item.PurchaseAgentID
      );

      inquiry_item.AgentFirstName = agent ? agent.FirstName : "";
      inquiry_item.AgentLastName = agent ? agent.LastName : "";

      inquiry_item.StatusTitle = statuses?.find(
        (sts) => sts.StatusID === inquiry_item.StatusID
      )?.Title;

      //--- managing unique id (UID) for new items
      if (inquiry_item.ItemID === 0 && selectedInquiryItem === null) {
        inquiry_item.UID = uuid();
        record.Items = [...record.Items, inquiry_item];
      } else if (inquiry_item.ItemID === 0 && selectedInquiryItem !== null) {
        const index = record.Items.findIndex(
          (item) => item.UID === selectedInquiryItem.UID
        );
        record.Items[index] = inquiry_item;
      }
    }

    //------

    setRecord({ ...record });
    setSelectedInquiryItem(null);
  };

  const handleDeleteInquiryItem = async (item) => {
    setProgress(true);

    try {
      if (item.ItemID > 0) {
        await onDeleteInquiryItem(item.ItemID);

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

  const handleCloseInquiryItemModal = () => {
    setSelectedInquiryItem(null);
    setShowInquiryItemModal(false);
  };

  const handleEditInquiryItem = (data) => {
    setSelectedInquiryItem(data);
    setShowInquiryItemModal(true);
  };

  const handleNewItemClick = () => {
    setSelectedInquiryItem(null);
    setShowInquiryItemModal(true);
  };

  //------

  const handleAddedSupplier = (supplier) => {
    setAddedSupplier(supplier);
  };

  const handleSaveInquirySupplier = async (inquiry_supplier) => {
    if (selectedObject !== null && selectedObject.RequestID > 0) {
      inquiry_supplier.RequestID = selectedObject.RequestID;

      const saved_inquiry_request_supplier = await onSaveInquirySupplier(
        inquiry_supplier
      );

      const index = record.Suppliers.findIndex(
        (sp) => sp.SupplierID === inquiry_supplier.SupplierID
      );

      if (index === -1) {
        record.Suppliers = [
          ...record.Suppliers,
          saved_inquiry_request_supplier,
        ];
      } else {
        record.Suppliers[index] = saved_inquiry_request_supplier;
      }
    } else {
      //While adding items temporarily, we have no jpin operation in database
      //So, we need to select titles manually

      const { SupplierTitle, ActivityTypeTitle } = addedSupplier;

      inquiry_supplier = {
        ...inquiry_supplier,
        SupplierTitle,
        ActivityTypeTitle,
      };

      //--- managing unique id (UID) for new items
      if (inquiry_supplier.RowID === 0) {
        inquiry_supplier.UID = uuid();
        record.Suppliers = [...record.Suppliers, inquiry_supplier];
      }
    }

    //------

    setRecord({ ...record });
    setAddedSupplier(null);
  };

  const handleDeleteInquirySupplier = async (supplier) => {
    setProgress(true);

    try {
      if (supplier.RowID > 0) {
        await onDeleteInquirySupplier(supplier.RowID);

        record.Suppliers = record.Suppliers.filter(
          (i) => i.RowID !== supplier.RowID
        );
      } else {
        record.Suppliers = record.Suppliers.filter(
          (i) => i.UID !== supplier.UID
        );
      }

      setRecord({ ...record });
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleCloseInquirySupplierModal = () => {
    setSelectedInquirySupplier(null);
    setShowInquirySupplierModal(false);
  };

  const handleNewSupplierClick = () => {
    setSelectedInquirySupplier(null);
    setShowInquirySupplierModal(true);
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

  const items = [
    {
      label: Words.inquiry_items,
      key: "items-tab",
      children: (
        <>
          {record.Items && (
            <>
              <Col xs={24}>
                <Form.Item>
                  <Row gutter={[0, 15]}>
                    <Col xs={24}>
                      <DetailsTable
                        records={record.Items}
                        columns={getInquiryItemColumns(
                          access,
                          status_id,
                          handleEditInquiryItem,
                          handleDeleteInquiryItem
                        )}
                        emptyDataMessage={Words.no_inquiry_item}
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
        </>
      ),
    },
    {
      label: Words.suppliers,
      key: "suppliers-tab",
      children: (
        <>
          {record.Suppliers && (
            <>
              <Col xs={24}>
                <Form.Item>
                  <Row gutter={[0, 15]}>
                    <Col xs={24}>
                      <DetailsTable
                        records={record.Suppliers}
                        columns={getInquirySupplierColumns(
                          access,
                          status_id,
                          handleDeleteInquirySupplier
                        )}
                        emptyDataMessage={Words.no_supplier}
                      />
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
            </>
          )}

          {status_id === 1 && (
            <Col xs={24}>
              <Form.Item>
                {getNewButton(false, handleNewSupplierClick)}
              </Form.Item>
            </Col>
          )}
        </>
      ),
    },
  ];

  // ------

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
                      ? utils.farsiNum(selectedObject.RequestID)
                      : "-"
                  }
                  valueColor={Colors.magenta[6]}
                />
              </Col>
            )}
            <Col xs={24} md={12}>
              <DateItem
                horizontal
                required
                title={Words.inquiry_final_deadline}
                fieldName="InquiryDeadline"
                formConfig={formConfig}
              />
            </Col>
            <Col xs={24} md={12}>
              <DateItem
                horizontal
                required
                title={Words.inquiry_date}
                fieldName="InquiryDate"
                formConfig={formConfig}
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

            <Col xs={24}>
              <Form.Item>
                <Tabs defaultActiveKey="1" type="card" items={items} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </ModalWindow>

      {showInquiryItemModal && (
        <InquiryItemModal
          isOpen={showInquiryItemModal}
          selectedObject={selectedInquiryItem}
          selectedItems={record?.Items}
          setParams={handleGetItemParams}
          onOk={handleSaveInquiryItem}
          onCancel={handleCloseInquiryItemModal}
        />
      )}

      {showInquirySupplierModal && (
        <InquirySupplierModal
          isOpen={showInquirySupplierModal}
          selectedObject={selectedInquirySupplier}
          selectedSuppliers={record?.Suppliers}
          onAddSupplier={handleAddedSupplier}
          onOk={handleSaveInquirySupplier}
          onCancel={handleCloseInquirySupplierModal}
        />
      )}
    </>
  );
};

export default InquiryRequestModal;
