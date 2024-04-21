import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Tabs, Checkbox } from "antd";
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
import service from "../../../../../../services/financial/treasury/receive/receive-receipts-service";
import InputItem from "../../../../../form-controls/input-item";
import DateItem from "../../../../../form-controls/date-item";
import DropdownItem from "../../../../../form-controls/dropdown-item";
import TextItem from "../../../../../form-controls/text-item";
import {
  useModalContext,
  useResetContext,
} from "../../../../../contexts/modal-context";
import ChequeModal from "./receive-receipt-cheque-modal";
import DemandModal from "./receive-receipt-demand-modal";
import CashModal from "./receive-receipt-cash-modal";
import PaymentNoticeModal from "./receive-receipt-payment-notice-modal";
import RefundFromOtherChequeModal from "./receive-receipt-refund-from-other-cheque-modal";
import RefundPayedChequeModal from "./receive-receipt-refund-payed-cheque-modal";
import RefundPayedDemandModal from "./receive-receipt-refund-payed-demand-modal";
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
} from "./receive-receipt-modal-code";
import Joi from "joi-browser";

const formRef = React.createRef();

const ReceiveReceiptModal = ({
  access,
  isOpen,
  selectedObject,
  onOk,
  onCancel,
  onSaveReceiveReceiptItem,
  onDeleteReceiveReceiptItem,
  onReject,
  onApprove,
  onUndoApprove,
  onSubmitVoucher,
}) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [receiveTypes, setReceiveTypes] = useState([]);
  const [deliveryMemberSearchProgress, setDeliveryMemberSearchProgress] =
    useState(false);
  const [deliveryMembers, setDeliveryMembers] = useState([]);
  const [cashBoxes, setCashBoxes] = useState([]);
  const [regards, setRegards] = useState([]);
  const [standardDetails, setStandardDetails] = useState([]);
  const [hasSaveApproveAccess, setHasSaveApproveAccess] = useState(false);
  const [hasRejectAccess, setHasRejectAccess] = useState(false);
  const [hasUndoApproveAccess, setHasUndoApproveAccess] = useState(false);
  const [hasSubmitVoucherAccess, setHasSubmitVoucherAccess] = useState(false);

  const [checkReceiveBase, setCheckReceiveBase] = useState(false);
  const [receiveRequests, setReceiveRequests] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [operations, setOperations] = useState([]);
  const [cashFlows, setCashFlows] = useState([]);
  const [banks, setBanks] = useState([]);
  const [companyBankAccounts, setCompanyBankAccounts] = useState([]);
  const [cities, setCities] = useState([]);

  const [
    selectedChequeForRefundFromOtherCheque,
    setSelectedChequeForRefundFromOtherCheque,
  ] = useState(null);
  const [
    selectedChequeForRefundPayedCheque,
    setSelectedChequeForRefundPayedCheque,
  ] = useState(null);
  const [
    selectedDemandForRefundPayedDemand,
    setSelectedDemandForRefundPayedDemand,
  ] = useState(null);

  const [selectedItem, setSelectedItem] = useState(null);
  const [showChequeModal, setShowChequeModal] = useState(false);
  const [showDemandModal, setShowDemandModal] = useState(false);
  const [showCashModal, setShowCashModal] = useState(false);
  const [showPaymentNoticeModal, setShowPaymentNoticeModal] = useState(false);
  const [showRefundFromOtherChequeModal, setShowRefundFromOtherChequeModal] =
    useState(false);
  const [showRefundPayedChequeModal, setShowRefundPayedChequeModal] =
    useState(false);
  const [showRefundPayedDemandModal, setShowRefundPayedDemandModal] =
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
    record.ReceiveTypeID = 0;
    record.RequestID = 0;
    record.DeliveryMemberID = 0;
    record.DeliveryMember = "";
    record.ReceiveDate = "";
    record.RegardID = 0;
    record.CashBoxID = 0;
    record.StandardDetailsID = 0;
    record.StatusID = 1;
    record.Cheques = [];
    record.Demands = [];
    record.Cashes = [];
    record.PaymentNotices = [];
    record.RefundFromOtherCheques = [];
    record.RefundPayedCheques = [];
    record.RefundPayedDemands = [];

    setRecord(record);
    setErrors({});
    setDeliveryMembers([]);
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
        ReceiveTypes,
        ReceiveRequests,
        CashBoxes,
        Regards,
        StandardDetails,
        HasSaveApproveAccess,
        HasRejectAccess,
        HasUndoApproveAccess,
        HasSubmitVoucherAccess,
      } = data;

      ReceiveRequests.forEach(
        (rq) =>
          (rq.Title = utils.farsiNum(
            `#${rq.RequestID} - ${
              rq.FrontSideAccountTitle
            } - ${utils.moneyNumber(rq.TotalPrice)} ${Words.ryal}`
          ))
      );

      setReceiveTypes(ReceiveTypes);
      setReceiveRequests(ReceiveRequests);
      setCashBoxes(CashBoxes);
      setRegards(Regards);
      setStandardDetails(StandardDetails);
      setHasSaveApproveAccess(HasSaveApproveAccess);
      setHasRejectAccess(HasRejectAccess);
      setHasUndoApproveAccess(HasUndoApproveAccess);
      setHasSubmitVoucherAccess(HasSubmitVoucherAccess);

      if (selectedObject && selectedObject.ChequeID) {
        const { DeliveryMemberID, FullName } = selectedObject;

        setDeliveryMembers([{ DeliveryMemberID, FullName }]);
      }

      if (selectedObject) {
        const {
          DeliveryMemberID,
          DeliveryMemberFirstName,
          DeliveryMemberLastName,
        } = selectedObject;

        setDeliveryMembers([
          {
            DeliveryMemberID,
            FullName: `${DeliveryMemberFirstName} ${DeliveryMemberLastName}`,
          },
        ]);
      }

      //------ load items params

      data = await service.getItemsParams();

      let {
        Currencies,
        Operations,
        CashFlows,
        Banks,
        CompanyBankAccounts,
        Cities,
      } = data;

      setCurrencies(Currencies);
      setOperations(Operations);
      setCashFlows(CashFlows);
      setBanks(Banks);
      setCompanyBankAccounts(CompanyBankAccounts);
      setCities(Cities);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  });

  const isEdit = selectedObject !== null;

  const handleSearchDeliveryMember = async (searchText) => {
    setDeliveryMemberSearchProgress(true);

    try {
      const data = await service.searchDeliveryMembers(searchText);

      setDeliveryMembers(data);
    } catch (ex) {
      handleError(ex);
    }

    setDeliveryMemberSearchProgress(false);
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
      cheque_to_save.ReceiveID = selectedObject.ReceiveID;

      const saved_cheque = await onSaveReceiveReceiptItem(
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

      const front_side_account = await service.searchFrontSideAccountByID(
        cheque_to_save.FrontSideAccountID
      );

      const {
        // FrontSideAccountTitle,
        TafsilCode,
        TafsilTypeID,
        TafsilTypeTitle,
        Title,
      } = front_side_account;

      cheque_to_save.FrontSideAccountTitle = Title;
      cheque_to_save.TafsilCode = TafsilCode;
      cheque_to_save.TafsilTypeID = TafsilTypeID;
      cheque_to_save.TafsilTypeTitle = TafsilTypeTitle;

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

      cheque_to_save.BankTitle = findTitle(
        banks,
        "BankID",
        "Title",
        cheque_to_save.BankID
      );

      cheque_to_save.CityTitle = findTitle(
        cities,
        "CityID",
        "Title",
        cheque_to_save.CityID
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
        await onDeleteReceiveReceiptItem(
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
      demand_to_save.ReceiveID = selectedObject.ReceiveID;

      const saved_demand = await onSaveReceiveReceiptItem(
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

      const front_side_account = await service.searchFrontSideAccountByID(
        demand_to_save.FrontSideAccountID
      );

      const {
        // FrontSideAccountTitle,
        TafsilCode,
        TafsilTypeID,
        TafsilTypeTitle,
        Title,
      } = front_side_account;

      demand_to_save.FrontSideAccountTitle = Title;
      demand_to_save.TafsilCode = TafsilCode;
      demand_to_save.TafsilTypeID = TafsilTypeID;
      demand_to_save.TafsilTypeTitle = TafsilTypeTitle;

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
        await onDeleteReceiveReceiptItem(
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
      cash_to_save.ReceiveID = selectedObject.ReceiveID;

      const saved_cash = await onSaveReceiveReceiptItem(
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

      const front_side_account = await service.searchFrontSideAccountByID(
        cash_to_save.FrontSideAccountID
      );

      const {
        // FrontSideAccountTitle,
        TafsilCode,
        TafsilTypeID,
        TafsilTypeTitle,
        Title,
      } = front_side_account;

      cash_to_save.FrontSideAccountTitle = Title;
      cash_to_save.TafsilCode = TafsilCode;
      cash_to_save.TafsilTypeID = TafsilTypeID;
      cash_to_save.TafsilTypeTitle = TafsilTypeTitle;

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
        await onDeleteReceiveReceiptItem(
          "cash",
          "CashID",
          cash_to_delete.CashID
        );

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

  const handleSavePaymentNotice = async (payment_notice_to_save) => {
    if (selectedObject !== null) {
      payment_notice_to_save.ReceiveID = selectedObject.ReceiveID;

      const saved_payment_notice = await onSaveReceiveReceiptItem(
        "payment-notice",
        "NoticeID",
        payment_notice_to_save
      );

      const index = record.PaymentNotices.findIndex(
        (item) => item.NoticeID === payment_notice_to_save.NoticeID
      );

      if (index === -1) {
        record.PaymentNotices = [
          ...record.PaymentNotices,
          saved_payment_notice,
        ];
      } else {
        record.PaymentNotices[index] = saved_payment_notice;
      }
    } else {
      //While adding items temporarily, we have no join operation in database
      //So, we need to select titles manually

      const front_side_account = await service.searchFrontSideAccountByID(
        payment_notice_to_save.FrontSideAccountID
      );

      const {
        // FrontSideAccountTitle,
        TafsilCode,
        TafsilTypeID,
        TafsilTypeTitle,
        Title,
      } = front_side_account;

      payment_notice_to_save.FrontSideAccountTitle = Title;
      payment_notice_to_save.TafsilCode = TafsilCode;
      payment_notice_to_save.TafsilTypeID = TafsilTypeID;
      payment_notice_to_save.TafsilTypeTitle = TafsilTypeTitle;

      const selected_account = companyBankAccounts.find(
        (a) =>
          a.CompanyBankAccountID === payment_notice_to_save.CompanyBankAccountID
      );

      const {
        AccountName,
        AccountNo,
        BranchID,
        BranhCode,
        BankBranchTitle,
        BankID,
        BankTitle,
      } = selected_account;

      payment_notice_to_save.AccountName = AccountName;
      payment_notice_to_save.AccountNo = AccountNo;
      payment_notice_to_save.BranchID = BranchID;
      payment_notice_to_save.BranhCode = BranhCode;
      payment_notice_to_save.BankBranchTitle = BankBranchTitle;
      payment_notice_to_save.BankID = BankID;
      payment_notice_to_save.BankTitle = BankTitle;

      payment_notice_to_save.OperationTitle = findTitle(
        operations,
        "OperationID",
        "Title",
        payment_notice_to_save.OperationID
      );

      payment_notice_to_save.PaperNatureTitle = findTitle(
        operations,
        "OperationID",
        "PaperNatureTitle",
        payment_notice_to_save.OperationID
      );

      payment_notice_to_save.DurationTypeTitle = findTitle(
        operations,
        "OperationID",
        "DurationTypeTitle",
        payment_notice_to_save.OperationID
      );

      payment_notice_to_save.CashFlowTitle = findTitle(
        cashFlows,
        "CashFlowID",
        "Title",
        payment_notice_to_save.CashFlowID
      );

      payment_notice_to_save.CurrencyTitle = findTitle(
        currencies,
        "CurrencyID",
        "Title",
        payment_notice_to_save.CurrencyID
      );

      payment_notice_to_save.StandardDetailsText = findTitle(
        standardDetails,
        "StandardDetailsID",
        "DetailsText",
        payment_notice_to_save.StandardDetailsID
      );

      //--- managing unique id (UID) for new items
      if (payment_notice_to_save.NoticeID === 0 && selectedItem === null) {
        payment_notice_to_save.UID = uuid();
        record.PaymentNotices = [
          ...record.PaymentNotices,
          payment_notice_to_save,
        ];
      } else if (
        payment_notice_to_save.NoticeID === 0 &&
        selectedItem !== null
      ) {
        const index = record.PaymentNotices.findIndex(
          (item) => item.UID === selectedItem.UID
        );
        record.PaymentNotices[index] = payment_notice_to_save;
      }
    }

    //------

    setRecord({ ...record });
    setSelectedItem(null);
  };

  const handleDeletePaymentNotice = async (payment_notice_to_delete) => {
    setProgress(true);

    try {
      if (payment_notice_to_delete.NoticeID > 0) {
        await onDeleteReceiveReceiptItem(
          "payment-notice",
          "NoticeID",
          payment_notice_to_delete.NoticeID
        );

        record.PaymentNotices = record.PaymentNotices.filter(
          (i) => i.NoticeID !== payment_notice_to_delete.NoticeID
        );
      } else {
        record.PaymentNotices = record.PaymentNotices.filter(
          (i) => i.UID !== payment_notice_to_delete.UID
        );
      }

      setRecord({ ...record });
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleClosePaymentNoticeModal = () => {
    setSelectedItem(null);
    setShowPaymentNoticeModal(false);
  };

  const handleEditPaymentNotice = (data) => {
    setSelectedItem(data);
    setShowPaymentNoticeModal(true);
  };

  //------

  const handleSelectChequeForRefundFromOtherCheque = (cheque) => {
    setSelectedChequeForRefundFromOtherCheque(cheque);
  };

  const handleSaveRefundFromOtherCheque = async (
    refund_from_other_cheque_to_save
  ) => {
    if (selectedObject !== null) {
      refund_from_other_cheque_to_save.ReceiveID = selectedObject.ReceiveID;

      const saved_refund_from_other_cheque = await onSaveReceiveReceiptItem(
        "refund-from-other-cheque",
        "RefundID",
        refund_from_other_cheque_to_save
      );

      const index = record.RefundFromOtherCheques.findIndex(
        (item) => item.RefundID === refund_from_other_cheque_to_save.RefundID
      );

      if (index === -1) {
        record.RefundFromOtherCheques = [
          ...record.RefundFromOtherCheques,
          saved_refund_from_other_cheque,
        ];
      } else {
        record.RefundFromOtherCheques[index] = saved_refund_from_other_cheque;
      }
    } else {
      const {
        FrontSideAccountTitle,
        ChequeNo,
        AccountNo,
        BankTitle,
        BranchName,
        DueDate,
        AgreedDate,
        CurrencyTitle,
        DurationTypeTitle,
        OperationTitle,
        CityTitle,
      } = selectedChequeForRefundFromOtherCheque;

      refund_from_other_cheque_to_save = {
        ...refund_from_other_cheque_to_save,
        FrontSideAccountTitle,
        ChequeNo,
        AccountNo,
        BankTitle,
        BranchName,
        DueDate,
        AgreedDate,
        CurrencyTitle,
        DurationTypeTitle,
        OperationTitle,
        CityTitle,
      };

      //While adding items temporarily, we have no join operation in database
      //So, we need to select titles manually

      refund_from_other_cheque_to_save.PaperNatureTitle = findTitle(
        operations,
        "OperationID",
        "PaperNatureTitle",
        refund_from_other_cheque_to_save.OperationID
      );

      refund_from_other_cheque_to_save.CashFlowTitle = findTitle(
        cashFlows,
        "CashFlowID",
        "Title",
        refund_from_other_cheque_to_save.CashFlowID
      );

      refund_from_other_cheque_to_save.StandardDetailsText = findTitle(
        standardDetails,
        "StandardDetailsID",
        "DetailsText",
        refund_from_other_cheque_to_save.StandardDetailsID
      );

      //--- managing unique id (UID) for new items
      if (
        refund_from_other_cheque_to_save.RefundID === 0 &&
        selectedItem === null
      ) {
        refund_from_other_cheque_to_save.UID = uuid();
        record.RefundFromOtherCheques = [
          ...record.RefundFromOtherCheques,
          refund_from_other_cheque_to_save,
        ];
      } else if (
        refund_from_other_cheque_to_save.RefundID === 0 &&
        selectedItem !== null
      ) {
        const index = record.RefundFromOtherCheques.findIndex(
          (item) => item.UID === selectedItem.UID
        );
        record.RefundFromOtherCheques[index] = refund_from_other_cheque_to_save;
      }
    }

    //------

    setRecord({ ...record });
    setSelectedItem(null);
  };

  const handleDeleteRefundFromOtherCheque = async (
    refund_from_other_cheque_to_delete
  ) => {
    setProgress(true);

    try {
      if (refund_from_other_cheque_to_delete.RefundID > 0) {
        await onDeleteReceiveReceiptItem(
          "refund-from-other-cheque",
          "RefundID",
          refund_from_other_cheque_to_delete.RefundID
        );

        record.RefundFromOtherCheques = record.RefundFromOtherCheques.filter(
          (i) => i.RefundID !== refund_from_other_cheque_to_delete.RefundID
        );
      } else {
        record.RefundFromOtherCheques = record.RefundFromOtherCheques.filter(
          (i) => i.UID !== refund_from_other_cheque_to_delete.UID
        );
      }

      setRecord({ ...record });
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleCloseRefundFromOtherChequeModal = () => {
    setSelectedItem(null);
    setShowRefundFromOtherChequeModal(false);
  };

  const handleEditRefundFromOtherCheque = (data) => {
    setSelectedItem(data);
    setShowRefundFromOtherChequeModal(true);
  };

  //------

  const handleSelectChequeForRefundPayedCheque = (cheque) => {
    setSelectedChequeForRefundPayedCheque(cheque);
  };

  const handleSaveRefundPayedCheque = async (refund_payed_cheque_to_save) => {
    if (selectedObject !== null) {
      refund_payed_cheque_to_save.ReceiveID = selectedObject.ReceiveID;

      const saved_refund_payed_cheque = await onSaveReceiveReceiptItem(
        "refund-payed-cheque",
        "RefundID",
        refund_payed_cheque_to_save
      );

      const index = record.RefundPayedCheques.findIndex(
        (item) => item.RefundID === refund_payed_cheque_to_save.RefundID
      );

      if (index === -1) {
        record.RefundPayedCheques = [
          ...record.RefundPayedCheques,
          saved_refund_payed_cheque,
        ];
      } else {
        record.RefundPayedCheques[index] = saved_refund_payed_cheque;
      }
    } else {
      const {
        FrontSideAccountTitle,
        ChequeNo,
        AccountNo,
        BankTitle,
        BranchName,
        DueDate,
        AgreedDate,
        CurrencyTitle,
        DurationTypeTitle,
        OperationTitle,
        CityTitle,
      } = selectedChequeForRefundPayedCheque;

      refund_payed_cheque_to_save = {
        ...refund_payed_cheque_to_save,
        FrontSideAccountTitle,
        ChequeNo,
        AccountNo,
        BankTitle,
        BranchName,
        DueDate,
        AgreedDate,
        CurrencyTitle,
        DurationTypeTitle,
        OperationTitle,
        CityTitle,
      };

      //While adding items temporarily, we have no join operation in database
      //So, we need to select titles manually

      refund_payed_cheque_to_save.PaperNatureTitle = findTitle(
        operations,
        "OperationID",
        "PaperNatureTitle",
        refund_payed_cheque_to_save.OperationID
      );

      refund_payed_cheque_to_save.CashFlowTitle = findTitle(
        cashFlows,
        "CashFlowID",
        "Title",
        refund_payed_cheque_to_save.CashFlowID
      );

      refund_payed_cheque_to_save.StandardDetailsText = findTitle(
        standardDetails,
        "StandardDetailsID",
        "DetailsText",
        refund_payed_cheque_to_save.StandardDetailsID
      );

      //--- managing unique id (UID) for new items
      if (refund_payed_cheque_to_save.RefundID === 0 && selectedItem === null) {
        refund_payed_cheque_to_save.UID = uuid();
        record.RefundPayedCheques = [
          ...record.RefundPayedCheques,
          refund_payed_cheque_to_save,
        ];
      } else if (
        refund_payed_cheque_to_save.RefundID === 0 &&
        selectedItem !== null
      ) {
        const index = record.RefundPayedCheques.findIndex(
          (item) => item.UID === selectedItem.UID
        );
        record.RefundPayedCheques[index] = refund_payed_cheque_to_save;
      }
    }

    //------

    setRecord({ ...record });
    setSelectedItem(null);
  };

  const handleDeleteRefundPayedCheque = async (
    refund_payed_cheque_to_delete
  ) => {
    setProgress(true);

    try {
      if (refund_payed_cheque_to_delete.RefundID > 0) {
        await onDeleteReceiveReceiptItem(
          "refund-payed-cheque",
          "RefundID",
          refund_payed_cheque_to_delete.RefundID
        );

        record.RefundPayedCheques = record.RefundPayedCheques.filter(
          (i) => i.RefundID !== refund_payed_cheque_to_delete.RefundID
        );
      } else {
        record.RefundPayedCheques = record.RefundPayedCheques.filter(
          (i) => i.UID !== refund_payed_cheque_to_delete.UID
        );
      }

      setRecord({ ...record });
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleCloseRefundPayedChequeModal = () => {
    setSelectedItem(null);
    setShowRefundPayedChequeModal(false);
  };

  const handleEditRefundPayedCheque = (data) => {
    setSelectedItem(data);
    setShowRefundPayedChequeModal(true);
  };

  //------

  const handleSelectDemandForRefundPayedDemand = (cheque) => {
    setSelectedDemandForRefundPayedDemand(cheque);
  };

  const handleSaveRefundPayedDemand = async (refund_payed_demand_to_save) => {
    if (selectedObject !== null) {
      refund_payed_demand_to_save.ReceiveID = selectedObject.ReceiveID;

      const saved_refund_payed_demand = await onSaveReceiveReceiptItem(
        "refund-payed-demand",
        "RefundID",
        refund_payed_demand_to_save
      );

      const index = record.RefundPayedDemands.findIndex(
        (item) => item.RefundID === refund_payed_demand_to_save.RefundID
      );

      if (index === -1) {
        record.RefundPayedDemands = [
          ...record.RefundPayedDemands,
          saved_refund_payed_demand,
        ];
      } else {
        record.RefundPayedDemands[index] = saved_refund_payed_demand;
      }
    } else {
      const {
        FrontSideAccountTitle,
        DemandNo,
        DueDate,
        CurrencyTitle,
        DurationTypeTitle,
        OperationTitle,
        CityTitle,
      } = selectedDemandForRefundPayedDemand;

      refund_payed_demand_to_save = {
        ...refund_payed_demand_to_save,
        FrontSideAccountTitle,
        DemandNo,
        DueDate,
        CurrencyTitle,
        DurationTypeTitle,
        OperationTitle,
        CityTitle,
      };

      //While adding items temporarily, we have no join operation in database
      //So, we need to select titles manually

      refund_payed_demand_to_save.PaperNatureTitle = findTitle(
        operations,
        "OperationID",
        "PaperNatureTitle",
        refund_payed_demand_to_save.OperationID
      );

      refund_payed_demand_to_save.CashFlowTitle = findTitle(
        cashFlows,
        "CashFlowID",
        "Title",
        refund_payed_demand_to_save.CashFlowID
      );

      refund_payed_demand_to_save.StandardDetailsText = findTitle(
        standardDetails,
        "StandardDetailsID",
        "DetailsText",
        refund_payed_demand_to_save.StandardDetailsID
      );

      //--- managing unique id (UID) for new items
      if (refund_payed_demand_to_save.RefundID === 0 && selectedItem === null) {
        refund_payed_demand_to_save.UID = uuid();
        record.RefundPayedDemands = [
          ...record.RefundPayedDemands,
          refund_payed_demand_to_save,
        ];
      } else if (
        refund_payed_demand_to_save.RefundID === 0 &&
        selectedItem !== null
      ) {
        const index = record.RefundPayedDemands.findIndex(
          (item) => item.UID === selectedItem.UID
        );
        record.RefundPayedDemands[index] = refund_payed_demand_to_save;
      }
    }

    //------

    setRecord({ ...record });
    setSelectedItem(null);
  };

  const handleDeleteRefundPayedDemand = async (
    refund_payed_demand_to_delete
  ) => {
    setProgress(true);

    try {
      if (refund_payed_demand_to_delete.RefundID > 0) {
        await onDeleteReceiveReceiptItem(
          "refund-payed-demand",
          "RefundID",
          refund_payed_demand_to_delete.RefundID
        );

        record.RefundPayedDemands = record.RefundPayedDemands.filter(
          (i) => i.RefundID !== refund_payed_demand_to_delete.RefundID
        );
      } else {
        record.RefundPayedDemands = record.RefundPayedDemands.filter(
          (i) => i.UID !== refund_payed_demand_to_delete.UID
        );
      }

      setRecord({ ...record });
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleCloseRefundPayedDemandModal = () => {
    setSelectedItem(null);
    setShowRefundPayedDemandModal(false);
  };

  const handleEditRefundPayedDemand = (data) => {
    setSelectedItem(data);
    setShowRefundPayedDemandModal(true);
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
        setShowPaymentNoticeModal(true);
        break;
      case "refund-from-other-cheques":
        setShowRefundFromOtherChequeModal(true);
        break;
      case "refund-payed-cheques":
        setShowRefundPayedChequeModal(true);
        break;
      case "refund-payed-demands":
        setShowRefundPayedDemandModal(true);
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
    onReject,
    onUndoApprove,
    onSubmitVoucher,
    onCancel,
    clearRecord,
    progress,
    hasSaveApproveAccess,
    hasRejectAccess,
    hasUndoApproveAccess,
    hasSubmitVoucherAccess,
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
    handleEditPaymentNotice,
    handleDeletePaymentNotice,
    handleEditRefundFromOtherCheque,
    handleDeleteRefundFromOtherCheque,
    handleEditRefundPayedCheque,
    handleDeleteRefundPayedCheque,
    handleEditRefundPayedDemand,
    handleDeleteRefundPayedDemand,
  };

  const handleReceiveBaseChange = (e) => {
    const { checked } = e.target;
    setCheckReceiveBase(checked);

    if (checked) {
      schema.RequestID = Joi.number().min(1).label(Words.receive_request);
    } else {
      schema.RequestID = Joi.number().label(Words.receive_request);
      const rec = { ...record };
      rec.RequestID = 0;
      setRecord(rec);
      loadFieldsValue(formRef, rec);
    }
  };

  const showNewButton = () => {
    let result = false;

    if (
      status_id === 1 &&
      (selectedTab === "payment-notices" || record.CashBoxID > 0)
    )
      result = true;

    return result;
  };

  const isCashBoxDdlDisabled = () => {
    let result = false;

    const {
      Cheques,
      Demands,
      Cashes,
      // PaymentNotices,
      RefundFromOtherCheques,
      RefundPayedCheques,
      RefundPayedDemands,
    } = record;

    if (
      Cheques?.length > 0 ||
      Demands?.length > 0 ||
      Cashes?.length > 0 ||
      RefundFromOtherCheques?.length > 0 ||
      RefundPayedCheques?.length > 0 ||
      RefundPayedDemands?.length > 0
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
                title={Words.receipt_receive_type}
                dataSource={receiveTypes}
                keyColumn="ReceiveTypeID"
                valueColumn="Title"
                formConfig={formConfig}
                required
              />
            </Col>
            <Col xs={24} md={12}>
              <Form.Item>
                <Checkbox
                  checked={checkReceiveBase}
                  onChange={handleReceiveBaseChange}
                >
                  {Words.select_receive_base}
                </Checkbox>
              </Form.Item>
            </Col>
            {checkReceiveBase && (
              <Col xs={24}>
                <DropdownItem
                  title={Words.receive_request}
                  dataSource={receiveRequests}
                  keyColumn="RequestID"
                  valueColumn="Title"
                  formConfig={formConfig}
                  required
                />
              </Col>
            )}
            <Col xs={24} md={12}>
              <DateItem
                horizontal
                required
                title={Words.receive_date}
                fieldName="ReceiveDate"
                formConfig={formConfig}
              />
            </Col>
            <Col xs={24} md={12}>
              <DropdownItem
                title={Words.delivery_member}
                dataSource={deliveryMembers}
                keyColumn="DeliveryMemberID"
                valueColumn="FullName"
                formConfig={formConfig}
                loading={deliveryMemberSearchProgress}
                onSearch={handleSearchDeliveryMember}
              />
            </Col>
            <Col xs={24} md={12}>
              <DropdownItem
                title={Words.regards}
                dataSource={regards}
                keyColumn="RegardID"
                valueColumn="Title"
                formConfig={formConfig}
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

      {showPaymentNoticeModal && (
        <PaymentNoticeModal
          isOpen={showPaymentNoticeModal}
          selectedObject={selectedItem}
          onOk={handleSavePaymentNotice}
          onCancel={handleClosePaymentNoticeModal}
        />
      )}

      {showRefundFromOtherChequeModal && (
        <RefundFromOtherChequeModal
          isOpen={showRefundFromOtherChequeModal}
          selectedObject={selectedItem}
          cashBoxID={record.CashBoxID}
          selectedCheques={record.RefundFromOtherCheques}
          onOk={handleSaveRefundFromOtherCheque}
          onCancel={handleCloseRefundFromOtherChequeModal}
          onSelectCheque={handleSelectChequeForRefundFromOtherCheque}
        />
      )}

      {showRefundPayedChequeModal && (
        <RefundPayedChequeModal
          isOpen={showRefundPayedChequeModal}
          selectedObject={selectedItem}
          cashBoxID={record.CashBoxID}
          selectedCheques={record.RefundPayedCheques}
          onOk={handleSaveRefundPayedCheque}
          onCancel={handleCloseRefundPayedChequeModal}
          onSelectCheque={handleSelectChequeForRefundPayedCheque}
        />
      )}

      {showRefundPayedDemandModal && (
        <RefundPayedDemandModal
          isOpen={showRefundPayedDemandModal}
          selectedObject={selectedItem}
          cashBoxID={record.CashBoxID}
          selectedDemands={record.RefundPayedDemands}
          onOk={handleSaveRefundPayedDemand}
          onCancel={handleCloseRefundPayedDemandModal}
          onSelectDemand={handleSelectDemandForRefundPayedDemand}
        />
      )}
    </>
  );
};

export default ReceiveReceiptModal;
