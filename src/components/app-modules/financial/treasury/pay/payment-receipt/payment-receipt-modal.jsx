import React, { useState } from "react";
import { useMount } from "react-use";
import Joi from "joi-browser";
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
import service from "../../../../../../services/financial/treasury/pay/payment-receipts-service";
import InputItem from "../../../../../form-controls/input-item";
import NumericInputItem from "./../../../../../form-controls/numeric-input-item";
import DateItem from "../../../../../form-controls/date-item";
import DropdownItem from "../../../../../form-controls/dropdown-item";
import TextItem from "../../../../../form-controls/text-item";
import {
  useModalContext,
  useResetContext,
} from "../../../../../contexts/modal-context";
import ChequeModal from "./payment-receipt-cheque-modal";
import DemandModal from "./payment-receipt-demand-modal";
import CashModal from "./payment-receipt-cash-modal";
import WithdrawNoticeModal from "./payment-receipt-withdraw-notice-modal";
import TransferToOtherModal from "./payment-receipt-transfer-to-other-modal";
import RefundReceivedChequeModal from "./payment-receipt-refund-received-cheque-modal";
import RefundReceivedDemandModal from "./payment-receipt-refund-received-demand-modal";
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
} from "./payment-receipt-modal-code";

const formRef = React.createRef();

const PaymentReceiptModal = ({
  access,
  isOpen,
  selectedObject,
  onOk,
  onCancel,
  onSavePaymentReceiptItem,
  onDeletePaymentReceiptItem,
  onReject,
  onApprove,
}) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [, setOrders] = useState([]);
  // const [orders, setOrders] = useState([]);

  const [baseTypes, setBaseTypes] = useState([]);
  const [payTypes, setPayTypes] = useState([]);
  const [regards, setRegards] = useState([]);
  const [durations, setDurations] = useState([]);
  const [natures, setNatures] = useState([]);
  const [cashBoxes, setCashBoxes] = useState([]);
  const [standardDetails, setStandardDetails] = useState([]);

  const [hasSaveApproveAccess, setHasSaveApproveAccess] = useState(false);
  const [hasRejectAccess, setHasRejectAccess] = useState(false);

  const [currencies, setCurrencies] = useState([]);
  const [operations, setOperations] = useState([]);
  const [cashFlows, setCashFlows] = useState([]);

  const [
    selectedChequeForTransferToOther,
    setSelectedChequeForTransferToOther,
  ] = useState(null);
  const [
    selectedChequeForRefundReceivedCheque,
    setSelectedChequeForRefundReceivedCheque,
  ] = useState(null);
  const [
    selectedDemandForRefundReceivedDemand,
    setSelectedDemandForRefundReceivedDemand,
  ] = useState(null);

  const [selectedItem, setSelectedItem] = useState(null);
  const [showChequeModal, setShowChequeModal] = useState(false);
  const [showDemandModal, setShowDemandModal] = useState(false);
  const [showCashModal, setShowCashModal] = useState(false);
  const [showWithdrawNoticeModal, setShowWithdrawNoticeModal] = useState(false);
  const [showTransferToOtherModal, setShowTransferToOtherModal] =
    useState(false);
  const [showRefundReceivedChequeModal, setShowRefundReceivedChequeModal] =
    useState(false);
  const [showRefundReceivedDemandModal, setShowRefundReceivedDemandModal] =
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
    record.BaseTypeID = 1;
    record.BaseDocID = 0;
    record.PayTypeID = 0;
    record.PayDate = "";
    record.RegardID = 0;
    record.CashBoxID = 0;
    record.SubNo = "";
    record.StandardDetailsID = 0;
    record.DetailsText = "";
    record.StatusID = 1;
    record.Cheques = [];
    record.Demands = [];
    record.Cashes = [];
    record.WithdrawNotices = [];
    record.TransferToOthers = [];
    record.RefundReceivedCheques = [];
    record.RefundReceivedDemands = [];

    setRecord(record);
    setErrors({});
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

      let {
        BaseTypes,
        PayTypes,
        Regards,
        Durations,
        Natures,
        CashBoxes,
        HasSaveApproveAccess,
        HasRejectAccess,
      } = data;

      setBaseTypes(BaseTypes);
      setPayTypes(PayTypes);
      setRegards(Regards);
      setDurations(Durations);
      setNatures(Natures);
      setCashBoxes(CashBoxes);
      setHasSaveApproveAccess(HasSaveApproveAccess);
      setHasRejectAccess(HasRejectAccess);

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

  const handleSearchPaymentOrders = async () => {
    setProgress(true);

    try {
      // let data =
      await service.searchOrders();
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleChangePaymentBase = async (value) => {
    const rec = { ...record };
    rec.BaseTypeID = value;
    setRecord(rec);
    loadFieldsValue(formRef, rec);

    if (value === 2) {
      schema.BaseDocID = Joi.number().min(1).label(Words.payment_base);
      await handleSearchPaymentOrders();
    } else {
      schema.BaseDocID = Joi.number().label(Words.payment_base);
      setOrders([]);
    }
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
      cheque_to_save.ReceiptID = selectedObject.ReceiptID;

      const saved_cheque = await onSavePaymentReceiptItem(
        "cheque",
        "ItemID",
        cheque_to_save
      );

      const index = record.Cheques.findIndex(
        (item) => item.ItemID === cheque_to_save.ItemID
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
        natures,
        "PaperNatureID",
        "Title",
        cheque_to_save.PaperNatureID
      );

      cheque_to_save.DurationTypeTitle = findTitle(
        durations,
        "DurationID",
        "Title",
        cheque_to_save.DurationID
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
        await onDeletePaymentReceiptItem(
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

  const handleSaveDemand = async (demand_to_save) => {
    if (selectedObject !== null) {
      demand_to_save.ReceiptID = selectedObject.ReceiptID;

      const saved_demand = await onSavePaymentReceiptItem(
        "demand",
        "ItemID",
        demand_to_save
      );

      const index = record.Demands.findIndex(
        (item) => item.ItemID === demand_to_save.ItemID
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
        await onDeletePaymentReceiptItem(
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

  const handleSaveCash = async (cash_to_save) => {
    if (selectedObject !== null) {
      cash_to_save.ReceiptID = selectedObject.ReceiptID;

      const saved_cash = await onSavePaymentReceiptItem(
        "cash",
        "ItemID",
        cash_to_save
      );

      const index = record.Cashes.findIndex(
        (item) => item.ItemID === cash_to_save.ItemID
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
      if (cash_to_save.ItemID === 0 && selectedItem === null) {
        cash_to_save.UID = uuid();
        record.Cashes = [...record.Cashes, cash_to_save];
      } else if (cash_to_save.ItemID === 0 && selectedItem !== null) {
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
      if (cash_to_delete.ItemID > 0) {
        await onDeletePaymentReceiptItem(
          "cash",
          "ItemID",
          cash_to_delete.ItemID
        );

        record.Cashes = record.Cashes.filter(
          (i) => i.ItemID !== cash_to_delete.ItemID
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

  const handleSaveWithdrawNotice = async (withdraw_notice_to_save) => {
    if (selectedObject !== null) {
      withdraw_notice_to_save.ReceiptID = selectedObject.ReceiptID;

      const saved_withdraw_notice = await onSavePaymentReceiptItem(
        "withdraw-notice",
        "ItemID",
        withdraw_notice_to_save
      );

      const index = record.WithdrawNotices.findIndex(
        (item) => item.ItemID === withdraw_notice_to_save.ItemID
      );

      if (index === -1) {
        record.WithdrawNotices = [
          ...record.WithdrawNotices,
          saved_withdraw_notice,
        ];
      } else {
        record.WithdrawNotices[index] = saved_withdraw_notice;
      }
    } else {
      //While adding items temporarily, we have no join operation in database
      //So, we need to select titles manually

      withdraw_notice_to_save.OperationTitle = findTitle(
        operations,
        "OperationID",
        "Title",
        withdraw_notice_to_save.OperationID
      );

      withdraw_notice_to_save.PaperNatureTitle = findTitle(
        operations,
        "OperationID",
        "PaperNatureTitle",
        withdraw_notice_to_save.OperationID
      );

      withdraw_notice_to_save.DurationTypeTitle = findTitle(
        operations,
        "OperationID",
        "DurationTypeTitle",
        withdraw_notice_to_save.OperationID
      );

      withdraw_notice_to_save.CashFlowTitle = findTitle(
        cashFlows,
        "CashFlowID",
        "Title",
        withdraw_notice_to_save.CashFlowID
      );

      withdraw_notice_to_save.CurrencyTitle = findTitle(
        currencies,
        "CurrencyID",
        "Title",
        withdraw_notice_to_save.CurrencyID
      );

      withdraw_notice_to_save.StandardDetailsText = findTitle(
        standardDetails,
        "StandardDetailsID",
        "DetailsText",
        withdraw_notice_to_save.StandardDetailsID
      );

      //--- managing unique id (UID) for new items
      if (withdraw_notice_to_save.ItemID === 0 && selectedItem === null) {
        withdraw_notice_to_save.UID = uuid();
        record.WithdrawNotices = [
          ...record.WithdrawNotices,
          withdraw_notice_to_save,
        ];
      } else if (
        withdraw_notice_to_save.ItemID === 0 &&
        selectedItem !== null
      ) {
        const index = record.WithdrawNotices.findIndex(
          (item) => item.UID === selectedItem.UID
        );
        record.WithdrawNotices[index] = withdraw_notice_to_save;
      }
    }

    //------

    setRecord({ ...record });
    setSelectedItem(null);
  };

  const handleDeleteWithdrawNotice = async (withdraw_notice_to_delete) => {
    setProgress(true);

    try {
      if (withdraw_notice_to_delete.ItemID > 0) {
        await onDeletePaymentReceiptItem(
          "withdraw-notice",
          "ItemID",
          withdraw_notice_to_delete.ItemID
        );

        record.WithdrawNotices = record.WithdrawNotices.filter(
          (i) => i.ItemID !== withdraw_notice_to_delete.ItemID
        );
      } else {
        record.WithdrawNotices = record.WithdrawNotices.filter(
          (i) => i.UID !== withdraw_notice_to_delete.UID
        );
      }

      setRecord({ ...record });
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleCloseWithdrawNoticeModal = () => {
    setSelectedItem(null);
    setShowWithdrawNoticeModal(false);
  };

  const handleEditWithdrawNotice = (data) => {
    setSelectedItem(data);
    setShowWithdrawNoticeModal(true);
  };

  //------

  const handleSelectChequeForTransferToOther = (cheque) => {
    setSelectedChequeForTransferToOther(cheque);
  };

  const handleSaveTransferToOther = async (transfer_to_other_to_save) => {
    if (selectedObject !== null) {
      transfer_to_other_to_save.ReceiptID = selectedObject.ReceiptID;

      const saved_transfer_to_other = await onSavePaymentReceiptItem(
        "transfer-to-other",
        "ItemID",
        transfer_to_other_to_save
      );

      const index = record.TransferToOthers.findIndex(
        (item) => item.ItemID === transfer_to_other_to_save.ItemID
      );

      if (index === -1) {
        record.TransferToOthers = [
          ...record.TransferToOthers,
          saved_transfer_to_other,
        ];
      } else {
        record.TransferToOthers[index] = saved_transfer_to_other;
      }
    } else {
      const {
        FrontSideAccountTitle,
        Amount,
        ChequeNo,
        AccountNo,
        BankTitle,
        BranchName,
        DueDate,
        AgreedDate,
        DurationTypeTitle,
        CurrencyTitle,
        TafsilCode,
        TafsilTypeTitle,
        CityTitle,
      } = selectedChequeForTransferToOther;

      transfer_to_other_to_save = {
        ...transfer_to_other_to_save,
        FrontSideAccountTitle,
        Amount,
        ChequeNo,
        AccountNo,
        BankTitle,
        BranchName,
        DueDate,
        AgreedDate,
        DurationTypeTitle,
        CurrencyTitle,
        TafsilCode,
        TafsilTypeTitle,
        CityTitle,
      };
      //While adding items temporarily, we have no join operation in database
      //So, we need to select titles manually

      transfer_to_other_to_save.CashFlowTitle = findTitle(
        cashFlows,
        "CashFlowID",
        "Title",
        transfer_to_other_to_save.CashFlowID
      );

      transfer_to_other_to_save.StandardDetailsText = findTitle(
        standardDetails,
        "StandardDetailsID",
        "DetailsText",
        transfer_to_other_to_save.StandardDetailsID
      );

      //--- managing unique id (UID) for new items
      if (transfer_to_other_to_save.ItemID === 0 && selectedItem === null) {
        transfer_to_other_to_save.UID = uuid();
        record.TransferToOthers = [
          ...record.TransferToOthers,
          transfer_to_other_to_save,
        ];
      } else if (
        transfer_to_other_to_save.ItemID === 0 &&
        selectedItem !== null
      ) {
        const index = record.TransferToOthers.findIndex(
          (item) => item.UID === selectedItem.UID
        );
        record.TransferToOthers[index] = transfer_to_other_to_save;
      }
    }

    //------

    setRecord({ ...record });
    setSelectedItem(null);
    setSelectedChequeForTransferToOther(null);
  };

  const handleDeleteTransferToOther = async (transfer_to_other_to_delete) => {
    setProgress(true);

    try {
      if (transfer_to_other_to_delete.ItemID > 0) {
        await onDeletePaymentReceiptItem(
          "transfer-to-other",
          "ItemID",
          transfer_to_other_to_delete.ItemID
        );

        record.TransferToOthers = record.TransferToOthers.filter(
          (i) => i.ItemID !== transfer_to_other_to_delete.ItemID
        );
      } else {
        record.TransferToOthers = record.TransferToOthers.filter(
          (i) => i.UID !== transfer_to_other_to_delete.UID
        );
      }

      setRecord({ ...record });
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleCloseTransferToOtherModal = () => {
    setSelectedItem(null);
    setShowTransferToOtherModal(false);
  };

  const handleEditTransferToOther = (data) => {
    setSelectedItem(data);
    setShowTransferToOtherModal(true);
  };

  //------

  const handleSelectChequeForRefundReceivedCheque = (cheque) => {
    setSelectedChequeForRefundReceivedCheque(cheque);
  };

  const handleSaveRefundReceivedCheque = async (
    refund_received_cheque_to_save
  ) => {
    if (selectedObject !== null) {
      refund_received_cheque_to_save.ReceiptID = selectedObject.ReceiptID;

      const saved_transfer_to_other = await onSavePaymentReceiptItem(
        "refund-received-cheque",
        "ItemID",
        refund_received_cheque_to_save
      );

      const index = record.RefundReceivedCheques.findIndex(
        (item) => item.ItemID === refund_received_cheque_to_save.ItemID
      );

      if (index === -1) {
        record.RefundReceivedCheques = [
          ...record.RefundReceivedCheques,
          saved_transfer_to_other,
        ];
      } else {
        record.RefundReceivedCheques[index] = saved_transfer_to_other;
      }
    } else {
      const {
        FrontSideAccountTitle,
        Amount,
        ChequeNo,
        AccountNo,
        BankTitle,
        BranchName,
        DueDate,
        AgreedDate,
        DurationTypeTitle,
        CurrencyTitle,
        TafsilCode,
        TafsilTypeTitle,
        CityTitle,
      } = selectedChequeForRefundReceivedCheque;

      refund_received_cheque_to_save = {
        ...refund_received_cheque_to_save,
        FrontSideAccountTitle,
        Amount,
        ChequeNo,
        AccountNo,
        BankTitle,
        BranchName,
        DueDate,
        AgreedDate,
        DurationTypeTitle,
        CurrencyTitle,
        TafsilCode,
        TafsilTypeTitle,
        CityTitle,
      };
      //While adding items temporarily, we have no join operation in database
      //So, we need to select titles manually

      refund_received_cheque_to_save.CashFlowTitle = findTitle(
        cashFlows,
        "CashFlowID",
        "Title",
        refund_received_cheque_to_save.CashFlowID
      );

      refund_received_cheque_to_save.StandardDetailsText = findTitle(
        standardDetails,
        "StandardDetailsID",
        "DetailsText",
        refund_received_cheque_to_save.StandardDetailsID
      );

      //--- managing unique id (UID) for new items
      if (
        refund_received_cheque_to_save.ItemID === 0 &&
        selectedItem === null
      ) {
        refund_received_cheque_to_save.UID = uuid();
        record.RefundReceivedCheques = [
          ...record.RefundReceivedCheques,
          refund_received_cheque_to_save,
        ];
      } else if (
        refund_received_cheque_to_save.ItemID === 0 &&
        selectedItem !== null
      ) {
        const index = record.RefundReceivedCheques.findIndex(
          (item) => item.UID === selectedItem.UID
        );
        record.RefundReceivedCheques[index] = refund_received_cheque_to_save;
      }
    }

    //------

    setRecord({ ...record });
    setSelectedItem(null);
    setSelectedChequeForRefundReceivedCheque(null);
  };

  const handleDeleteRefundReceivedCheque = async (
    refund_received_cheque_to_delete
  ) => {
    setProgress(true);

    try {
      if (refund_received_cheque_to_delete.ItemID > 0) {
        await onDeletePaymentReceiptItem(
          "refund-received-cheque",
          "ItemID",
          refund_received_cheque_to_delete.ItemID
        );

        record.RefundReceivedCheques = record.RefundReceivedCheques.filter(
          (i) => i.ItemID !== refund_received_cheque_to_delete.ItemID
        );
      } else {
        record.RefundReceivedCheques = record.RefundReceivedCheques.filter(
          (i) => i.UID !== refund_received_cheque_to_delete.UID
        );
      }

      setRecord({ ...record });
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleCloseRefundReceivedChequeModal = () => {
    setSelectedItem(null);
    setShowRefundReceivedChequeModal(false);
  };

  const handleEditRefundReceivedCheque = (data) => {
    setSelectedItem(data);
    setShowRefundReceivedChequeModal(true);
  };

  //------

  const handleSelectDemandForRefundReceivedDemand = (cheque) => {
    setSelectedDemandForRefundReceivedDemand(cheque);
  };

  const handleSaveRefundReceivedDemand = async (
    refund_received_demand_to_save
  ) => {
    if (selectedObject !== null) {
      refund_received_demand_to_save.ReceiptID = selectedObject.ReceiptID;

      const saved_transfer_to_other = await onSavePaymentReceiptItem(
        "refund-received-demand",
        "ItemID",
        refund_received_demand_to_save
      );

      const index = record.RefundReceivedDemands.findIndex(
        (item) => item.ItemID === refund_received_demand_to_save.ItemID
      );

      if (index === -1) {
        record.RefundReceivedDemands = [
          ...record.RefundReceivedDemands,
          saved_transfer_to_other,
        ];
      } else {
        record.RefundReceivedDemands[index] = saved_transfer_to_other;
      }
    } else {
      const {
        FrontSideAccountTitle,
        Amount,
        DemandNo,
        DueDate,
        DurationTypeTitle,
        CurrencyTitle,
        TafsilCode,
        TafsilTypeTitle,
        CityTitle,
      } = selectedDemandForRefundReceivedDemand;

      refund_received_demand_to_save = {
        ...refund_received_demand_to_save,
        FrontSideAccountTitle,
        Amount,
        DemandNo,
        DueDate,
        DurationTypeTitle,
        CurrencyTitle,
        TafsilCode,
        TafsilTypeTitle,
        CityTitle,
      };
      //While adding items temporarily, we have no join operation in database
      //So, we need to select titles manually

      refund_received_demand_to_save.CashFlowTitle = findTitle(
        cashFlows,
        "CashFlowID",
        "Title",
        refund_received_demand_to_save.CashFlowID
      );

      refund_received_demand_to_save.StandardDetailsText = findTitle(
        standardDetails,
        "StandardDetailsID",
        "DetailsText",
        refund_received_demand_to_save.StandardDetailsID
      );

      //--- managing unique id (UID) for new items
      if (
        refund_received_demand_to_save.ItemID === 0 &&
        selectedItem === null
      ) {
        refund_received_demand_to_save.UID = uuid();
        record.RefundReceivedDemands = [
          ...record.RefundReceivedDemands,
          refund_received_demand_to_save,
        ];
      } else if (
        refund_received_demand_to_save.ItemID === 0 &&
        selectedItem !== null
      ) {
        const index = record.RefundReceivedDemands.findIndex(
          (item) => item.UID === selectedItem.UID
        );
        record.RefundReceivedDemands[index] = refund_received_demand_to_save;
      }
    }

    //------

    setRecord({ ...record });
    setSelectedItem(null);
    setSelectedDemandForRefundReceivedDemand(null);
  };

  const handleDeleteRefundReceivedDemand = async (
    refund_received_demand_to_delete
  ) => {
    setProgress(true);

    try {
      if (refund_received_demand_to_delete.ItemID > 0) {
        await onDeletePaymentReceiptItem(
          "refund-received-demand",
          "ItemID",
          refund_received_demand_to_delete.ItemID
        );

        record.RefundReceivedDemands = record.RefundReceivedDemands.filter(
          (i) => i.ItemID !== refund_received_demand_to_delete.ItemID
        );
      } else {
        record.RefundReceivedDemands = record.RefundReceivedDemands.filter(
          (i) => i.UID !== refund_received_demand_to_delete.UID
        );
      }

      setRecord({ ...record });
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleCloseRefundReceivedDemandModal = () => {
    setSelectedItem(null);
    setShowRefundReceivedDemandModal(false);
  };

  const handleEditRefundReceivedDemand = (data) => {
    setSelectedItem(data);
    setShowRefundReceivedDemandModal(true);
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
      case "withdraw-notices":
        setShowWithdrawNoticeModal(true);
        break;
      case "transfer-to-others":
        setShowTransferToOtherModal(true);
        break;
      case "refund-received-cheques":
        setShowRefundReceivedChequeModal(true);
        break;
      case "refund-received-demands":
        setShowRefundReceivedDemandModal(true);
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
    handleEditWithdrawNotice,
    handleDeleteWithdrawNotice,
    handleEditTransferToOther,
    handleDeleteTransferToOther,
    handleEditRefundReceivedCheque,
    handleDeleteRefundReceivedCheque,
    handleEditRefundReceivedDemand,
    handleDeleteRefundReceivedDemand,
  };

  const isEdit = selectedObject !== null;

  const showNewButton = () => {
    let result = false;

    if (
      status_id === 1 &&
      (selectedTab === "cheques" ||
        selectedTab === "withdraw-notices" ||
        record.CashBoxID > 0)
    )
      result = true;

    return result;
  };

  const isCashBoxDdlDisabled = () => {
    let result = false;

    const {
      // Cheques,
      Demands,
      Cashes,
      // WithdrawNotices,
      TransferToOthers,
      RefundReceivedCheques,
      RefundReceivedDemands,
    } = record;

    if (
      Demands?.length > 0 ||
      Cashes?.length > 0 ||
      TransferToOthers?.length > 0 ||
      RefundReceivedCheques?.length > 0 ||
      RefundReceivedDemands?.length > 0
    )
      result = true;

    return result;
  };

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
                title={Words.payment_base}
                dataSource={baseTypes}
                keyColumn="BaseTypeID"
                valueColumn="Title"
                formConfig={formConfig}
                required
                onChange={handleChangePaymentBase}
              />
            </Col>
            <Col xs={24} md={12}></Col>
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
              <DateItem
                horizontal
                required
                title={Words.payment_date}
                fieldName="PayDate"
                formConfig={formConfig}
              />
            </Col>
            <Col xs={24} md={12}>
              <DropdownItem
                title={Words.regards}
                dataSource={regards}
                keyColumn="RegardID"
                valueColumn="Title"
                formConfig={formConfig}
                disabled={record.Cashes?.length > 0}
              />
            </Col>
            <Col xs={24} md={12}>
              <DropdownItem
                title={Words.cash_box}
                dataSource={cashBoxes}
                keyColumn="CashBoxID"
                valueColumn="Title"
                formConfig={formConfig}
                disabled={isCashBoxDdlDisabled()}
              />
            </Col>
            <Col xs={24} md={12}>
              <NumericInputItem
                horizontal
                title={Words.sub_no}
                fieldName="SubNo"
                min={0}
                max={999999999}
                formConfig={formConfig}
                autoFocus
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

            {showNewButton() && (
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

      {showWithdrawNoticeModal && (
        <WithdrawNoticeModal
          isOpen={showWithdrawNoticeModal}
          selectedObject={selectedItem}
          onOk={handleSaveWithdrawNotice}
          onCancel={handleCloseWithdrawNoticeModal}
        />
      )}

      {showTransferToOtherModal && (
        <TransferToOtherModal
          isOpen={showTransferToOtherModal}
          selectedObject={selectedItem}
          cashBoxID={record.CashBoxID}
          selectedCheques={record.TransferToOthers}
          onOk={handleSaveTransferToOther}
          onCancel={handleCloseTransferToOtherModal}
          onSelectCheque={handleSelectChequeForTransferToOther}
        />
      )}

      {showRefundReceivedChequeModal && (
        <RefundReceivedChequeModal
          isOpen={showRefundReceivedChequeModal}
          selectedObject={selectedItem}
          cashBoxID={record.CashBoxID}
          selectedCheques={record.RefundReceivedCheques}
          onOk={handleSaveRefundReceivedCheque}
          onCancel={handleCloseRefundReceivedChequeModal}
          onSelectCheque={handleSelectChequeForRefundReceivedCheque}
        />
      )}

      {showRefundReceivedDemandModal && (
        <RefundReceivedDemandModal
          isOpen={showRefundReceivedDemandModal}
          selectedObject={selectedItem}
          cashBoxID={record.CashBoxID}
          selectedDemands={record.RefundReceivedDemands}
          onOk={handleSaveRefundReceivedDemand}
          onCancel={handleCloseRefundReceivedDemandModal}
          onSelectDemand={handleSelectDemandForRefundReceivedDemand}
        />
      )}
    </>
  );
};

export default PaymentReceiptModal;
