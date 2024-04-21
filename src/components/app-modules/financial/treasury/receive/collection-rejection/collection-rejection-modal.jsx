import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Tabs } from "antd";
import ModalWindow from "../../../../../common/modal-window";
import Words from "../../../../../../resources/words";
import Colors from "../../../../../../resources/colors";
import utils from "../../../../../../tools/utils";
import {
  loadFieldsValue,
  initModal,
  saveModalChanges,
  handleError,
} from "../../../../../../tools/form-manager";
import service from "../../../../../../services/financial/treasury/receive/collection-rejections-service";
import {
  schema,
  initRecord,
  getNewButton,
  getFooterButtons,
  calculatePrice,
  getTabPanes,
  getDisableStatus,
} from "./collection-rejection-modal-code";
import DateItem from "../../../../../form-controls/date-item";
import DropdownItem from "../../../../../form-controls/dropdown-item";
import TextItem from "../../../../../form-controls/text-item";
import {
  useModalContext,
  useResetContext,
} from "../../../../../contexts/modal-context";
import ChequeModal from "./collection-rejection-cheque-modal";
import DemandModal from "./collection-rejection-demand-modal";
import { v4 as uuid } from "uuid";

const formRef = React.createRef();

const CollectionRejectionModal = ({
  access,
  isOpen,
  selectedObject,
  onOk,
  onCancel,
  onSaveCollectionRejectionItem,
  onDeleteCollectionRejectionItem,
  onReject,
  onApprove,
}) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [companyBankAccounts, setCompanyBankAccounts] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [itemTypes] = useState([
    { ItemType: 1, Title: Words.cheque },
    { ItemType: 2, Title: Words.demand },
  ]);
  const [standardDetails, setStandardDetails] = useState([]);
  const [itemStatuses, setItemStatuses] = useState([]);
  const [operations, setOperations] = useState([]);
  const [hasSaveApproveAccess, setHasSaveApproveAccess] = useState(false);
  const [hasRejectAccess, setHasRejectAccess] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [showChequeModal, setShowChequeModal] = useState(false);
  const [showDemandModal, setShowDemandModal] = useState(false);

  const [selectedTab, setSelectedTab] = useState("cheques");
  const [selectedCheque, setSelectedCheque] = useState(null);
  const [selectedDemand, setSelectedDemand] = useState(null);

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.CompanyBankAccountID = 0;
    record.CurrencyID = 0;
    record.ItemType = 0;
    record.CollectionRejectionDate = "";
    record.StandardDetailsID = 0;
    record.StatusID = 1;
    record.Cheques = [];
    record.Demands = [];

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();

    //------

    setProgress(true);

    try {
      //------ load receipt params

      let data = await service.getParams();

      let {
        CompanyBankAccounts,
        Currencies,
        StandardDetails,
        ItemStatuses,
        Operations,
        HasSaveApproveAccess,
        HasRejectAccess,
      } = data;

      setCompanyBankAccounts(CompanyBankAccounts);
      setCurrencies(Currencies);
      setStandardDetails(StandardDetails);
      setItemStatuses(ItemStatuses);
      setOperations(Operations);
      setHasSaveApproveAccess(HasSaveApproveAccess);
      setHasRejectAccess(HasRejectAccess);

      if (selectedObject !== null) {
        setSelectedTab(selectedObject.ItemType === 1 ? "cheques" : "demands");

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
    record.StatusID = 2;
    setRecord({ ...record });

    saveModalChanges(
      formConfig,
      selectedObject,
      setProgress,
      onOk,
      clearRecord
    );
  };

  //------

  const handleSelectCheque = (cheque) => {
    if (cheque.ChequeID > 0) setSelectedCheque(cheque);
    else setSelectedCheque(null);
  };

  //------

  const handleSaveCheque = async (cheque) => {
    if (selectedObject !== null) {
      cheque.CollectionRejectionID = selectedObject.CollectionRejectionID;

      const saved_cheque = await onSaveCollectionRejectionItem(
        "cheque",
        "ItemID",
        cheque
      );

      const index = record.Cheques.findIndex(
        (item) => item.ItemID === cheque.ItemID
      );

      if (index === -1) {
        record.Cheques = [...record.Cheques, saved_cheque];
      } else {
        record.Cheques[index] = saved_cheque;
      }
    } else {
      const cheque_to_save = { ...selectedCheque };

      //--- add needed fields (ItemID, StatusID, StatusTitle) to selected cheque

      cheque_to_save.ItemID = cheque.ItemID;
      cheque_to_save.StatusID = cheque.StatusID;
      cheque_to_save.StatusTitle = itemStatuses.find(
        (s) => s.StatusID === cheque.StatusID
      )?.Title;
      cheque_to_save.OperationID = cheque.OperationID;
      cheque_to_save.OperationTitle = operations.find(
        (o) => o.OperationID === cheque.OperationID
      )?.Title;

      //--- managing unique id (UID) for new items
      if (cheque_to_save.ItemID === 0 && selectedItem === null) {
        cheque_to_save.UID = uuid();
        record.Cheques = [...record.Cheques, cheque_to_save];
      } else if (cheque_to_save.ItemID === 0 && selectedItem !== null) {
        const index = record.Cheques.findIndex(
          (item) => item.UID === selectedItem.UID
        );
        record.Cheques[index] = cheque_to_save;
      }
    }

    //------

    setRecord({ ...record });
    setSelectedItem(null);
  };

  const handleDeleteCheque = async (cheque_to_delete) => {
    setProgress(true);

    try {
      if (cheque_to_delete.ItemID > 0) {
        await onDeleteCollectionRejectionItem(
          "cheque",
          "ItemID",
          cheque_to_delete.ItemID
        );

        record.Cheques = record.Cheques.filter(
          (i) => i.ItemID !== cheque_to_delete.ItemID
        );
      } else {
        record.Cheques = record.Cheques.filter(
          (i) => i.UID !== cheque_to_delete.UID
        );
      }

      setRecord({ ...record });
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleCloseChequeModal = () => {
    setSelectedItem(null);
    setShowChequeModal(false);
  };

  const handleEditCheque = (data) => {
    setSelectedItem(data);
    setShowChequeModal(true);
  };

  //------

  const handleSelectDemand = (demand) => {
    if (demand.DemandID > 0) setSelectedDemand(demand);
    else setSelectedDemand(null);
  };

  const handleSaveDemand = async (demand) => {
    if (selectedObject !== null) {
      demand.CollectionRejectionID = selectedObject.CollectionRejectionID;

      const saved_demand = await onSaveCollectionRejectionItem(
        "demand",
        "ItemID",
        demand
      );

      const index = record.Demands.findIndex(
        (item) => item.ItemID === demand.ItemID
      );

      if (index === -1) {
        record.Demands = [...record.Demands, saved_demand];
      } else {
        record.Demands[index] = saved_demand;
      }
    } else {
      const demand_to_save = { ...selectedDemand };

      //--- add needed fields (ItemID, StatusID, StatusTitle) to selected demand

      demand_to_save.ItemID = demand.ItemID;
      demand_to_save.StatusID = demand.StatusID;
      demand_to_save.StatusTitle = itemStatuses.find(
        (s) => s.StatusID === demand.StatusID
      )?.Title;

      demand_to_save.OperationID = demand.OperationID;
      demand_to_save.OperationTitle = operations.find(
        (o) => o.OperationID === demand.OperationID
      )?.Title;

      //--- managing unique id (UID) for new items
      if (demand_to_save.ItemID === 0 && selectedItem === null) {
        demand_to_save.UID = uuid();
        record.Demands = [...record.Demands, demand_to_save];
      } else if (demand_to_save.ItemID === 0 && selectedItem !== null) {
        const index = record.Demands.findIndex(
          (item) => item.UID === selectedItem.UID
        );
        record.Demands[index] = demand_to_save;
      }
    }

    //------

    setRecord({ ...record });
    setSelectedItem(null);
  };

  const handleDeleteDemand = async (demand_to_delete) => {
    setProgress(true);

    try {
      if (demand_to_delete.ItemID > 0) {
        await onDeleteCollectionRejectionItem(
          "demand",
          "ItemID",
          demand_to_delete.ItemID
        );

        record.Demands = record.Demands.filter(
          (i) => i.ItemID !== demand_to_delete.ItemID
        );
      } else {
        record.Demands = record.Demands.filter(
          (i) => i.UID !== demand_to_delete.UID
        );
      }

      setRecord({ ...record });
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleCloseDemandModal = () => {
    setSelectedItem(null);
    setShowDemandModal(false);
  };

  const handleEditDemand = (data) => {
    setSelectedItem(data);
    setShowDemandModal(true);
  };

  //------

  const handleShowNewModal = () => {
    switch (selectedTab) {
      case "cheques":
        setShowChequeModal(true);
        break;
      case "demands":
        setShowDemandModal(true);
        break;
      default:
        break;
    }
  };

  const handleClickNewButton = () => {
    setSelectedItem(null);
    handleShowNewModal();
  };

  const handleChangeItemType = (value) => {
    const rec = { ...record };
    rec.ItemType = value || 0;
    setRecord(rec);
    setSelectedTab(value === 1 ? "cheques" : "demands");
  };

  //------

  const status_id =
    selectedObject === null ? record.StatusID : selectedObject.StatusID;

  const price = calculatePrice(record);

  const footerConfig = {
    selectedObject,
    handleSubmit,
    handleSubmitAndApprove,
    onApprove,
    hasRejectAccess,
    onReject,
    onCancel,
    clearRecord,
    progress,
    hasSaveApproveAccess,
  };

  const tabPanesConfig = {
    record,
    price,
    access,
    status_id,
    handleEditCheque,
    handleDeleteCheque,
    handleEditDemand,
    handleDeleteDemand,
  };

  return (
    <>
      <ModalWindow
        isOpen={isOpen}
        isEdit={isEdit}
        inProgress={progress}
        disabled={getDisableStatus(record)}
        width={1050}
        footer={getFooterButtons(getDisableStatus(record), footerConfig)}
        onCancel={onCancel}
      >
        <Form ref={formRef} name="dataForm">
          <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
            <Col xs={24} md={12}>
              <DropdownItem
                title={Words.bank_account}
                dataSource={companyBankAccounts}
                keyColumn="CompanyBankAccountID"
                valueColumn="InfoTitle"
                formConfig={formConfig}
                required
                autoFocus
                disabled={
                  record?.Cheques?.length > 0 || record?.Demands?.length > 0
                }
              />
            </Col>
            <Col xs={24} md={12}>
              <DropdownItem
                title={Words.item_type}
                dataSource={itemTypes}
                keyColumn="ItemType"
                valueColumn="Title"
                formConfig={formConfig}
                required
                disabled={
                  record?.Cheques?.length > 0 || record?.Demands?.length > 0
                }
                onChange={handleChangeItemType}
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
              <DateItem
                horizontal
                required
                title={Words.collection_rejection_date}
                fieldName="CollectionRejectionDate"
                formConfig={formConfig}
              />
            </Col>
            <Col xs={24} md={12}>
              <DropdownItem
                title={Words.standard_description}
                dataSource={standardDetails}
                keyColumn="StandardDetailsID"
                valueColumn="DetailsText"
                formConfig={formConfig}
              />
            </Col>

            {price.Total > 0 && (
              <Col xs={24}>
                <TextItem
                  title={Words.price}
                  value={`${utils.farsiNum(utils.moneyNumber(price.Total))} ${
                    Words.ryal
                  }`}
                  valueColor={Colors.magenta[6]}
                />
              </Col>
            )}

            {record?.ItemType > 0 && record?.CompanyBankAccountID > 0 && (
              <>
                <Col xs={24}>
                  <Form.Item>
                    <Tabs
                      type="card"
                      defaultActiveKey="1"
                      onChange={(key) => setSelectedTab(key)}
                      items={getTabPanes(tabPanesConfig)}
                    />
                  </Form.Item>
                </Col>

                {status_id === 1 && (
                  <Col xs={24}>
                    <Form.Item>{getNewButton(handleClickNewButton)}</Form.Item>
                  </Col>
                )}
              </>
            )}
          </Row>
        </Form>
      </ModalWindow>

      {showChequeModal && (
        <ChequeModal
          isOpen={showChequeModal}
          selectedObject={selectedItem}
          currentCheques={record.Cheques}
          companyBankAccountID={record?.CompanyBankAccountID}
          itemStatuses={itemStatuses}
          onSelectCheque={handleSelectCheque}
          onOk={handleSaveCheque}
          onCancel={handleCloseChequeModal}
        />
      )}

      {showDemandModal && (
        <DemandModal
          isOpen={showDemandModal}
          selectedObject={selectedItem}
          currentDemands={record.Demands}
          companyBankAccountID={record?.CompanyBankAccountID}
          itemStatuses={itemStatuses}
          onSelectDemand={handleSelectDemand}
          onOk={handleSaveDemand}
          onCancel={handleCloseDemandModal}
        />
      )}
    </>
  );
};

export default CollectionRejectionModal;
