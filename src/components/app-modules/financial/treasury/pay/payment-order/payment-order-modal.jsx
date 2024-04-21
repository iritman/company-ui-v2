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
import service from "../../../../../../services/financial/treasury/pay/payment-orders-service";
import InputItem from "../../../../../form-controls/input-item";
import DateItem from "../../../../../form-controls/date-item";
import DropdownItem from "../../../../../form-controls/dropdown-item";
import TextItem from "../../../../../form-controls/text-item";
import {
  useModalContext,
  useResetContext,
} from "../../../../../contexts/modal-context";
import ChequeModal from "./payment-order-cheque-modal";
import DemandModal from "./payment-order-demand-modal";
import CashModal from "./payment-order-cash-modal";
import ReceiveNoticeModal from "./payment-order-receive-notice-modal";
import PayToOtherModal from "./payment-order-pay-to-other-modal";
import { v4 as uuid } from "uuid";
import {
  schema,
  initRecord,
  getTabPanes,
  getNewButton,
  getFooterButtons,
  getDisableStatus,
  calculatePrice,
  findTitle,
} from "./payment-order-modal-code";

const formRef = React.createRef();

const PaymentOrderModal = ({
  access,
  isOpen,
  selectedObject,
  onOk,
  onCancel,
  onSavePaymentOrderItem,
  onDeletePaymentOrderItem,
  onReject,
  onApprove,
}) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [frontSideAccountSearchProgress, setFrontSideAccountSearchProgress] =
    useState(false);
  const [frontSideAccounts, setFrontSideAccounts] = useState([]);
  const [payTypes, setPayTypes] = useState([]);
  const [cashBoxes, setCashBoxes] = useState([]);
  const [standardDetails, setStandardDetails] = useState([]);
  const [hasSaveApproveAccess, setHasSaveApproveAccess] = useState(false);
  const [hasRejectAccess, setHasRejectAccess] = useState(false);

  const [currencies, setCurrencies] = useState([]);
  const [operations, setOperations] = useState([]);
  const [cashFlows, setCashFlows] = useState([]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [showChequeModal, setShowChequeModal] = useState(false);
  const [showDemandModal, setShowDemandModal] = useState(false);
  const [showCashModal, setShowCashModal] = useState(false);
  const [showReceiveNoticeModal, setShowReceiveNoticeModal] = useState(false);
  const [showPayToOtherModal, setShowPayToOtherModal] = useState(false);
  const [showReturnGetableChequeModal, setShowReturnGetableChequeModal] =
    useState(false);
  const [showReturnGetableDemandModal, setShowReturnGetableDemandModal] =
    useState(false);

  const [selectedTab, setSelectedTab] = useState("cheques");

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.FrontSideAccountID = 0;
    record.PayTypeID = 0;
    record.CashBoxID = 0;
    record.OrderDate = "";
    record.StandardDetailsID = 0;
    record.StatusID = 1;
    record.Cheques = [];
    record.Demands = [];
    record.Cashes = [];
    record.ReceiveNotices = [];
    record.PayToOthers = [];
    record.ReturnGetableCheques = [];
    record.ReturnGetableDemands = [];

    setRecord(record);
    setErrors({});
    setFrontSideAccounts([]);
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();
    setRecord({ ...initRecord });
    loadFieldsValue(formRef, { ...initRecord });
    initModal(formRef, selectedObject, setRecord);

    //------

    setProgress(true);

    try {
      //------ load receipt params

      let data = await service.getParams();

      let { PayTypes, CashBoxes, HasSaveApproveAccess, HasRejectAccess } = data;

      setPayTypes(PayTypes);
      setCashBoxes(CashBoxes);
      setHasSaveApproveAccess(HasSaveApproveAccess);
      setHasRejectAccess(HasRejectAccess);

      if (selectedObject) {
        const selected_front_side_account =
          await service.searchFrontSideAccountByID(
            selectedObject.FrontSideAccountID
          );

        const { FrontSideAccountID, Title } = selected_front_side_account;

        setFrontSideAccounts([{ FrontSideAccountID, Title }]);
      }

      //------ load items params

      data = await service.getItemsParams();

      let { Currencies, Operations, CashFlows, StandardDetails } = data;

      setCurrencies(Currencies);
      setOperations(Operations);
      setCashFlows(CashFlows);
      setStandardDetails(StandardDetails);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  });

  const handleChangeFrontSideAccount = (value) => {
    const rec = { ...record };
    rec.FrontSideAccountID = value || 0;
    setRecord(rec);
  };

  const handleSearchFrontSideAccount = async (searchText) => {
    setFrontSideAccountSearchProgress(true);

    try {
      const data = await service.searchFrontSideAccounts(searchText);

      setFrontSideAccounts(data);
    } catch (ex) {
      handleError(ex);
    }

    setFrontSideAccountSearchProgress(false);
  };

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

  const handleSaveCheque = async (cheque_to_save) => {
    if (selectedObject !== null) {
      cheque_to_save.OrderID = selectedObject.OrderID;

      const saved_cheque = await onSavePaymentOrderItem(
        "cheque",
        "ChequeID",
        cheque_to_save
      );

      const index = record.Cheques.findIndex(
        (item) => item.ChequeID === cheque_to_save.ChequeID
      );

      if (index === -1) {
        record.Cheques = [...record.Cheques, saved_cheque];
      } else {
        record.Cheques[index] = saved_cheque;
      }
    } else {
      //While adding items temporarily, we have no join operation in database
      //So, we need to select titles manually

      cheque_to_save.OperationTitle = findTitle(
        operations,
        "OperationID",
        "Title",
        cheque_to_save.OperationID
      );

      cheque_to_save.PaperNatureTitle = findTitle(
        operations,
        "OperationID",
        "PaperNatureTitle",
        cheque_to_save.OperationID
      );

      cheque_to_save.DurationTypeTitle = findTitle(
        operations,
        "OperationID",
        "DurationTypeTitle",
        cheque_to_save.OperationID
      );

      cheque_to_save.CashFlowTitle = findTitle(
        cashFlows,
        "CashFlowID",
        "Title",
        cheque_to_save.CashFlowID
      );

      cheque_to_save.CurrencyTitle = findTitle(
        currencies,
        "CurrencyID",
        "Title",
        cheque_to_save.CurrencyID
      );

      cheque_to_save.StandardDetailsText = findTitle(
        standardDetails,
        "StandardDetailsID",
        "DetailsText",
        cheque_to_save.StandardDetailsID
      );

      //--- managing unique id (UID) for new items
      if (cheque_to_save.ChequeID === 0 && selectedItem === null) {
        cheque_to_save.UID = uuid();
        record.Cheques = [...record.Cheques, cheque_to_save];
      } else if (cheque_to_save.ChequeID === 0 && selectedItem !== null) {
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
      if (cheque_to_delete.ChequeID > 0) {
        await onDeletePaymentOrderItem(
          "cheque",
          "ChequeID",
          cheque_to_delete.ChequeID
        );

        record.Cheques = record.Cheques.filter(
          (i) => i.ChequeID !== cheque_to_delete.ChequeID
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

  const handleSaveDemand = async (demand_to_save) => {
    if (selectedObject !== null) {
      demand_to_save.OrderID = selectedObject.OrderID;

      const saved_demand = await onSavePaymentOrderItem(
        "demand",
        "DemandID",
        demand_to_save
      );

      const index = record.Demands.findIndex(
        (item) => item.DemandID === demand_to_save.DemandID
      );

      if (index === -1) {
        record.Demands = [...record.Demands, saved_demand];
      } else {
        record.Demands[index] = saved_demand;
      }
    } else {
      //While adding items temporarily, we have no join operation in database
      //So, we need to select titles manually

      demand_to_save.OperationTitle = findTitle(
        operations,
        "OperationID",
        "Title",
        demand_to_save.OperationID
      );

      demand_to_save.PaperNatureTitle = findTitle(
        operations,
        "OperationID",
        "PaperNatureTitle",
        demand_to_save.OperationID
      );

      demand_to_save.DurationTypeTitle = findTitle(
        operations,
        "OperationID",
        "DurationTypeTitle",
        demand_to_save.OperationID
      );

      demand_to_save.CashFlowTitle = findTitle(
        cashFlows,
        "CashFlowID",
        "Title",
        demand_to_save.CashFlowID
      );

      demand_to_save.CurrencyTitle = findTitle(
        currencies,
        "CurrencyID",
        "Title",
        demand_to_save.CurrencyID
      );

      demand_to_save.StandardDetailsText = findTitle(
        standardDetails,
        "StandardDetailsID",
        "DetailsText",
        demand_to_save.StandardDetailsID
      );

      //--- managing unique id (UID) for new items
      if (demand_to_save.DemandID === 0 && selectedItem === null) {
        demand_to_save.UID = uuid();
        record.Demands = [...record.Demands, demand_to_save];
      } else if (demand_to_save.DemandID === 0 && selectedItem !== null) {
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
      if (demand_to_delete.DemandID > 0) {
        await onDeletePaymentOrderItem(
          "demand",
          "DemandID",
          demand_to_delete.DemandID
        );

        record.Demands = record.Demands.filter(
          (i) => i.DemandID !== demand_to_delete.DemandID
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

  const handleSaveCash = async (cash_to_save) => {
    if (selectedObject !== null) {
      cash_to_save.OrderID = selectedObject.OrderID;

      const saved_cash = await onSavePaymentOrderItem(
        "cash",
        "CashID",
        cash_to_save
      );

      const index = record.Cashes.findIndex(
        (item) => item.CashID === cash_to_save.CashID
      );

      if (index === -1) {
        record.Cashes = [...record.Cashes, saved_cash];
      } else {
        record.Cashes[index] = saved_cash;
      }
    } else {
      //While adding items temporarily, we have no join operation in database
      //So, we need to select titles manually

      cash_to_save.OperationTitle = findTitle(
        operations,
        "OperationID",
        "Title",
        cash_to_save.OperationID
      );

      cash_to_save.PaperNatureTitle = findTitle(
        operations,
        "OperationID",
        "PaperNatureTitle",
        cash_to_save.OperationID
      );

      cash_to_save.DurationTypeTitle = findTitle(
        operations,
        "OperationID",
        "DurationTypeTitle",
        cash_to_save.OperationID
      );

      cash_to_save.CashFlowTitle = findTitle(
        cashFlows,
        "CashFlowID",
        "Title",
        cash_to_save.CashFlowID
      );

      cash_to_save.CurrencyTitle = findTitle(
        currencies,
        "CurrencyID",
        "Title",
        cash_to_save.CurrencyID
      );

      cash_to_save.StandardDetailsText = findTitle(
        standardDetails,
        "StandardDetailsID",
        "DetailsText",
        cash_to_save.StandardDetailsID
      );

      //--- managing unique id (UID) for new items
      if (cash_to_save.CashID === 0 && selectedItem === null) {
        cash_to_save.UID = uuid();
        record.Cashes = [...record.Cashes, cash_to_save];
      } else if (cash_to_save.CashID === 0 && selectedItem !== null) {
        const index = record.Cashes.findIndex(
          (item) => item.UID === selectedItem.UID
        );
        record.Cashes[index] = cash_to_save;
      }
    }

    //------

    setRecord({ ...record });
    setSelectedItem(null);
  };

  const handleDeleteCash = async (cash_to_delete) => {
    setProgress(true);

    try {
      if (cash_to_delete.CashID > 0) {
        await onDeletePaymentOrderItem("cash", "CashID", cash_to_delete.CashID);

        record.Cashes = record.Cashes.filter(
          (i) => i.CashID !== cash_to_delete.CashID
        );
      } else {
        record.Cashes = record.Cashes.filter(
          (i) => i.UID !== cash_to_delete.UID
        );
      }

      setRecord({ ...record });
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleCloseCashModal = () => {
    setSelectedItem(null);
    setShowCashModal(false);
  };

  const handleEditCash = (data) => {
    setSelectedItem(data);
    setShowCashModal(true);
  };

  //------

  const handleSaveReceiveNotice = async (receive_notice_to_save) => {
    if (selectedObject !== null) {
      receive_notice_to_save.OrderID = selectedObject.OrderID;

      const saved_receive_notice = await onSavePaymentOrderItem(
        "receive-notice",
        "NoticeID",
        receive_notice_to_save
      );

      const index = record.ReceiveNotices.findIndex(
        (item) => item.NoticeID === receive_notice_to_save.NoticeID
      );

      if (index === -1) {
        record.ReceiveNotices = [
          ...record.ReceiveNotices,
          saved_receive_notice,
        ];
      } else {
        record.ReceiveNotices[index] = saved_receive_notice;
      }
    } else {
      //While adding items temporarily, we have no join operation in database
      //So, we need to select titles manually

      receive_notice_to_save.OperationTitle = findTitle(
        operations,
        "OperationID",
        "Title",
        receive_notice_to_save.OperationID
      );

      receive_notice_to_save.PaperNatureTitle = findTitle(
        operations,
        "OperationID",
        "PaperNatureTitle",
        receive_notice_to_save.OperationID
      );

      receive_notice_to_save.DurationTypeTitle = findTitle(
        operations,
        "OperationID",
        "DurationTypeTitle",
        receive_notice_to_save.OperationID
      );

      receive_notice_to_save.CashFlowTitle = findTitle(
        cashFlows,
        "CashFlowID",
        "Title",
        receive_notice_to_save.CashFlowID
      );

      receive_notice_to_save.CurrencyTitle = findTitle(
        currencies,
        "CurrencyID",
        "Title",
        receive_notice_to_save.CurrencyID
      );

      receive_notice_to_save.StandardDetailsText = findTitle(
        standardDetails,
        "StandardDetailsID",
        "DetailsText",
        receive_notice_to_save.StandardDetailsID
      );

      //--- managing unique id (UID) for new items
      if (receive_notice_to_save.NoticeID === 0 && selectedItem === null) {
        receive_notice_to_save.UID = uuid();
        record.ReceiveNotices = [
          ...record.ReceiveNotices,
          receive_notice_to_save,
        ];
      } else if (
        receive_notice_to_save.NoticeID === 0 &&
        selectedItem !== null
      ) {
        const index = record.ReceiveNotices.findIndex(
          (item) => item.UID === selectedItem.UID
        );
        record.ReceiveNotices[index] = receive_notice_to_save;
      }
    }

    //------

    setRecord({ ...record });
    setSelectedItem(null);
  };

  const handleDeleteReceiveNotice = async (receive_notice_to_delete) => {
    setProgress(true);

    try {
      if (receive_notice_to_delete.NoticeID > 0) {
        await onDeletePaymentOrderItem(
          "payment-notice",
          "NoticeID",
          receive_notice_to_delete.NoticeID
        );

        record.ReceiveNotices = record.ReceiveNotices.filter(
          (i) => i.NoticeID !== receive_notice_to_delete.NoticeID
        );
      } else {
        record.ReceiveNotices = record.ReceiveNotices.filter(
          (i) => i.UID !== receive_notice_to_delete.UID
        );
      }

      setRecord({ ...record });
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleCloseReceiveNoticeModal = () => {
    setSelectedItem(null);
    setShowReceiveNoticeModal(false);
  };

  const handleEditReceiveNotice = (data) => {
    setSelectedItem(data);
    setShowReceiveNoticeModal(true);
  };

  //------

  const handleSavePayToOther = async (pay_to_other_to_save) => {
    if (selectedObject !== null) {
      pay_to_other_to_save.OrderID = selectedObject.OrderID;

      const saved_receive_notice = await onSavePaymentOrderItem(
        "pay-to-other",
        "PayID",
        pay_to_other_to_save
      );

      const index = record.PayToOthers.findIndex(
        (item) => item.PayID === pay_to_other_to_save.PayID
      );

      if (index === -1) {
        record.PayToOthers = [...record.PayToOthers, saved_receive_notice];
      } else {
        record.PayToOthers[index] = saved_receive_notice;
      }
    } else {
      //While adding items temporarily, we have no join operation in database
      //So, we need to select titles manually

      pay_to_other_to_save.OperationTitle = findTitle(
        operations,
        "OperationID",
        "Title",
        pay_to_other_to_save.OperationID
      );

      pay_to_other_to_save.PaperNatureTitle = findTitle(
        operations,
        "OperationID",
        "PaperNatureTitle",
        pay_to_other_to_save.OperationID
      );

      pay_to_other_to_save.DurationTypeTitle = findTitle(
        operations,
        "OperationID",
        "DurationTypeTitle",
        pay_to_other_to_save.OperationID
      );

      pay_to_other_to_save.CashFlowTitle = findTitle(
        cashFlows,
        "CashFlowID",
        "Title",
        pay_to_other_to_save.CashFlowID
      );

      pay_to_other_to_save.CurrencyTitle = findTitle(
        currencies,
        "CurrencyID",
        "Title",
        pay_to_other_to_save.CurrencyID
      );

      pay_to_other_to_save.StandardDetailsText = findTitle(
        standardDetails,
        "StandardDetailsID",
        "DetailsText",
        pay_to_other_to_save.StandardDetailsID
      );

      //--- managing unique id (UID) for new items
      if (pay_to_other_to_save.PayID === 0 && selectedItem === null) {
        pay_to_other_to_save.UID = uuid();
        record.PayToOthers = [...record.PayToOthers, pay_to_other_to_save];
      } else if (pay_to_other_to_save.PayID === 0 && selectedItem !== null) {
        const index = record.PayToOthers.findIndex(
          (item) => item.UID === selectedItem.UID
        );
        record.PayToOthers[index] = pay_to_other_to_save;
      }
    }

    //------

    setRecord({ ...record });
    setSelectedItem(null);
  };

  const handleDeletePayToOther = async (pay_to_other_to_delete) => {
    setProgress(true);

    try {
      if (pay_to_other_to_delete.PayID > 0) {
        await onDeletePaymentOrderItem(
          "pay-to-other",
          "PayID",
          pay_to_other_to_delete.PayID
        );

        record.PayToOthers = record.PayToOthers.filter(
          (i) => i.PayID !== pay_to_other_to_delete.PayID
        );
      } else {
        record.PayToOthers = record.PayToOthers.filter(
          (i) => i.UID !== pay_to_other_to_delete.UID
        );
      }

      setRecord({ ...record });
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleClosePayToOtherModal = () => {
    setSelectedItem(null);
    setShowPayToOtherModal(false);
  };

  const handleEditPayToOther = (data) => {
    setSelectedItem(data);
    setShowPayToOtherModal(true);
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
      case "cashes":
        setShowCashModal(true);
        break;
      case "payment-notices":
        setShowReceiveNoticeModal(true);
        break;
      case "pay-to-others":
        setShowPayToOtherModal(true);
        break;
      case "return-payable-cheques":
        setShowReturnGetableChequeModal(true);
        break;
      case "return-payable-demands":
        setShowReturnGetableDemandModal(true);
        break;
      default:
        break;
    }
  };

  const handleClickNewButton = () => {
    setSelectedItem(null);
    handleShowNewModal();
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
    cash_box_id: record.CashBoxID,
    handleEditCheque,
    handleDeleteCheque,
    handleEditDemand,
    handleDeleteDemand,
    handleEditCash,
    handleDeleteCash,
    handleEditReceiveNotice,
    handleDeleteReceiveNotice,
    handleEditPayToOther,
    handleDeletePayToOther,
  };

  const isEdit = selectedObject !== null;

  //------

  return (
    <>
      <ModalWindow
        isOpen={isOpen}
        isEdit={isEdit}
        inProgress={progress}
        disabled={getDisableStatus()}
        width={1050}
        footer={getFooterButtons(getDisableStatus(record), footerConfig)}
        onCancel={onCancel}
      >
        <Form ref={formRef} name="dataForm">
          <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
            <Col xs={24} md={12}>
              <DropdownItem
                title={Words.front_side}
                dataSource={frontSideAccounts}
                keyColumn="FrontSideAccountID"
                valueColumn="Title"
                formConfig={formConfig}
                loading={frontSideAccountSearchProgress}
                onSearch={handleSearchFrontSideAccount}
                onChange={handleChangeFrontSideAccount}
              />
            </Col>
            <Col xs={24} md={12}>
              <DropdownItem
                title={Words.pay_type}
                dataSource={payTypes}
                keyColumn="PayTypeID"
                valueColumn="Title"
                formConfig={formConfig}
                required
              />
            </Col>
            <Col xs={24} md={12}>
              <DropdownItem
                title={Words.cash_box}
                dataSource={cashBoxes}
                keyColumn="CashBoxID"
                valueColumn="Title"
                formConfig={formConfig}
                disabled={record.Cashes?.length > 0}
              />
            </Col>
            <Col xs={24} md={12}>
              <DateItem
                horizontal
                required
                title={Words.payment_order_date}
                fieldName="OrderDate"
                formConfig={formConfig}
              />
            </Col>
            <Col xs={24}>
              <DropdownItem
                title={Words.standard_details_text}
                dataSource={standardDetails}
                keyColumn="StandardDetailsID"
                valueColumn="DetailsText"
                formConfig={formConfig}
              />
            </Col>
            <Col xs={24}>
              <InputItem
                title={Words.standard_description}
                fieldName="DetailsText"
                multiline
                rows={2}
                showCount
                maxLength={250}
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

            {/* ToDo: Implement base_doc_id field based on the selected base type */}

            <Col xs={24}>
              <Form.Item>
                <Tabs
                  type="card"
                  defaultActiveKey="1"
                  onChange={(key) => setSelectedTab(key)}
                  items={getTabPanes(tabPanesConfig, selectedTab)}
                />
              </Form.Item>
            </Col>

            {status_id === 1 &&
              (selectedTab !== "cashes" ||
                (selectedTab === "cashes" && record.CashBoxID > 0)) && (
                <Col xs={24}>
                  <Form.Item>{getNewButton(handleClickNewButton)}</Form.Item>
                </Col>
              )}
          </Row>
        </Form>
      </ModalWindow>

      {showChequeModal && (
        <ChequeModal
          isOpen={showChequeModal}
          selectedObject={selectedItem}
          onOk={handleSaveCheque}
          onCancel={handleCloseChequeModal}
        />
      )}

      {showDemandModal && (
        <DemandModal
          isOpen={showDemandModal}
          selectedObject={selectedItem}
          onOk={handleSaveDemand}
          onCancel={handleCloseDemandModal}
        />
      )}

      {showCashModal && (
        <CashModal
          isOpen={showCashModal}
          selectedObject={selectedItem}
          onOk={handleSaveCash}
          onCancel={handleCloseCashModal}
        />
      )}

      {showReceiveNoticeModal && (
        <ReceiveNoticeModal
          isOpen={showReceiveNoticeModal}
          selectedObject={selectedItem}
          onOk={handleSaveReceiveNotice}
          onCancel={handleCloseReceiveNoticeModal}
        />
      )}

      {showPayToOtherModal && (
        <PayToOtherModal
          isOpen={showPayToOtherModal}
          selectedObject={selectedItem}
          onOk={handleSavePayToOther}
          onCancel={handleClosePayToOtherModal}
        />
      )}
      {showReturnGetableChequeModal && <></>}
      {showReturnGetableDemandModal && <></>}
    </>
  );
};

export default PaymentOrderModal;
