import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, message } from "antd";
import Words from "../../../../../../resources/words";
import Colors from "../../../../../../resources/colors";
import utils from "../../../../../../tools/utils";
import service from "../../../../../../services/financial/treasury/pay/payment-receipts-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
  handleError,
} from "../../../../../../tools/form-manager";
import SimpleDataTable from "../../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../../common/simple-data-page-header";
import PaymentReceiptModal from "./payment-receipt-modal";
import SearchModal from "./payment-receipts-search-modal";
import DetailsModal from "./payment-receipt-details-modal";
import { usePageContext } from "../../../../../contexts/page-context";
import DetailsButton from "../../../../../common/details-button";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "PaymentReceipts",
    data: records,
    columns: [
      { label: Words.id, value: "ReceiptID" },
      { label: Words.payment_base, value: "BaseTypeTitle" },
      { label: Words.base_doc_id, value: "BaseDocID" },
      {
        label: Words.receipt_date,
        value: (record) => utils.slashDate(record.PayDate),
      },
      { label: Words.pay_type, value: "PayTypeTitle" },
      { label: Words.regards, value: "RegardTitle" },
      { label: Words.cash_box, value: "CashBoxTitle" },
      { label: Words.sub_no, value: "SubNo" },
      { label: Words.price, value: "TotalPrice" },
      { label: Words.standard_descriptions, value: "StandardDetailsText" },
      { label: Words.standard_description, value: "DetailsText" },
      { label: Words.status, value: "StatusTitle" },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 75,
    align: "center",
    dataIndex: "ReceiptID",
    sorter: getSorter("ReceiptID"),
    render: (ReceiptID) => <Text>{utils.farsiNum(`${ReceiptID}`)}</Text>,
  },
  {
    title: Words.payment_date,
    width: 150,
    align: "center",
    dataIndex: "PayDate",
    sorter: getSorter("PayDate"),
    render: (PayDate) => (
      <Text style={{ color: Colors.blue[6] }}>
        {utils.farsiNum(utils.slashDate(PayDate))}
      </Text>
    ),
  },
  {
    title: Words.price,
    width: 150,
    align: "center",
    dataIndex: "Price",
    sorter: getSorter("Price"),
    render: (Price) => (
      <Text style={{ color: Colors.orange[6] }}>
        {utils.farsiNum(utils.moneyNumber(Price))}
      </Text>
    ),
  },
  {
    title: Words.status,
    width: 150,
    align: "center",
    // dataIndex: "StatusTitle",
    sorter: getSorter("StatusTitle"),
    render: (record) => (
      <Text
        style={{
          color:
            record.StatusID === 1
              ? Colors.grey[6]
              : record.StatusID === 2
              ? Colors.green[6]
              : Colors.red[6],
        }}
      >
        {record.StatusTitle}
      </Text>
    ),
  },
];

const recordID = "ReceiptID";

const PaymentReceiptsPage = ({ pageName }) => {
  const {
    progress,
    setProgress,
    searched,
    setSearched,
    records,
    setRecords,
    access,
    setAccess,
    selectedObject,
    setSelectedObject,
    showModal,
    showDetails,
    setShowDetails,
    showSearchModal,
    setShowSearchModal,
    filter,
    setFilter,
  } = usePageContext();

  useMount(async () => {
    handleResetContext();
    await checkAccess(setAccess, pageName);
  });

  const {
    handleCloseModal,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSave,
    handleResetContext,
  } = GetSimplaDataPageMethods({
    service,
    recordID,
  });

  const handleSearch = async (filter) => {
    setFilter(filter);
    setShowSearchModal(false);

    setProgress(true);

    try {
      const data = await service.searchData(filter);

      setRecords(data);
      setSearched(true);
    } catch (err) {
      handleError(err);
    }

    setProgress(false);
  };

  const getOperationalButtons = (record) => {
    return (
      <DetailsButton
        record={record}
        setSelectedObject={setSelectedObject}
        setShowDetails={setShowDetails}
      />
    );
  };

  const columns = access
    ? getColumns(
        baseColumns,
        getOperationalButtons,
        access,
        handleEdit,
        handleDelete,
        (row) => row.StatusID === 1, // can edit func
        (row) => row.StatusID === 1 // can delete func
      )
    : [];

  const handleClear = () => {
    setRecords([]);
    setFilter(null);
    setSearched(false);
  };

  const getCollection = (itemType) => {
    let collection = "";

    switch (itemType) {
      case "cheque":
        collection = "Cheques";
        break;
      case "demand":
        collection = "Demands";
        break;
      case "cash":
        collection = "Cashes";
        break;
      case "withdraw-notice":
        collection = "WithdrawNotices";
        break;
      case "transfer-to-other":
        collection = "TransferToOthers";
        break;
      case "refund-received-cheque":
        collection = "RefundReceivedCheques";
        break;
      case "refund-received-demand":
        collection = "RefundReceivedDemands";
        break;
      default:
        break;
    }

    return collection;
  };

  const handleSavePaymentReceiptItem = async (
    item_type,
    key_field,
    payment_item
  ) => {
    //--- specify collection
    const collection = getCollection(item_type);

    //--- calculate new price

    let diff_price = 0;

    if (payment_item[key_field] === 0) {
      diff_price = payment_item.Amount;
    } else {
      diff_price =
        payment_item.Amount -
        selectedObject[collection].find(
          (c) => c[key_field] === payment_item[key_field]
        ).Amount;
    }

    //---

    const saved_pay_item = await service.saveItem(item_type, payment_item);

    const rec = { ...selectedObject };
    // update price
    rec.Price += diff_price;

    //------

    if (payment_item[key_field] === 0)
      rec[collection] = [...rec[collection], saved_pay_item];
    else {
      const index = rec[collection].findIndex(
        (i) => i[key_field] === payment_item[key_field]
      );

      rec[collection][index] = saved_pay_item;
    }

    setSelectedObject(rec);

    //------

    const receipt_index = records.findIndex(
      (pay) => pay.ReceiptID === payment_item.ReceiptID
    );

    records[receipt_index] = rec;

    //------

    setRecords([...records]);

    return saved_pay_item;
  };

  const handleDeletePaymentReceiptItem = async (
    item_type,
    key_field,
    item_id
  ) => {
    //--- specify collection

    const collection = getCollection(item_type);

    //------

    await service.deleteItem(item_type, item_id);

    if (selectedObject) {
      const rec = { ...selectedObject };
      rec.Price -= rec[collection].find((c) => c[key_field] === item_id).Amount;

      rec[collection] = rec[collection].filter((i) => i[key_field] !== item_id);
      // switch (item_type) {
      //   case "cheque": {
      //     break;
      //   }
      //   default:
      //     break;
      // }

      setSelectedObject(rec);

      //------

      const receipt_index = records.findIndex(
        (receive_receipt) => receive_receipt.ReceiptID === rec.ReceiptID
      );

      records[receipt_index] = rec;

      setRecords([...records]);
    }
  };

  const handleApprovePaymentReceipt = async () => {
    setProgress(true);

    try {
      const data = await service.approveOrder(selectedObject.ReceiptID);

      // Update selected object
      selectedObject.StatusID = 2; // Approve
      selectedObject.StatusTitle = Words.receive_receipt_status_2;
      setSelectedObject({ ...selectedObject });

      // Update records
      const receipt_index = records.findIndex(
        (r) => r.OrderID === selectedObject.OrderID
      );
      records[receipt_index] = { ...selectedObject };
      setRecords([...records]);

      //---
      message.success(data.Message);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleRejectPaymentReceipt = async () => {
    setProgress(true);

    try {
      const data = await service.rejectOrder(selectedObject.OrderID);

      // Update selected object
      selectedObject.StatusID = 3; // Reject
      selectedObject.StatusTitle = Words.receive_receipt_status_3;
      setSelectedObject({ ...selectedObject });

      // Update records
      const receipt_index = records.findIndex(
        (r) => r.OrderID === selectedObject.OrderID
      );
      records[receipt_index] = { ...selectedObject };
      setRecords([...records]);

      //---
      message.success(data.Message);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.payment_receipt}
            sheets={getSheets(records)}
            fileName="PaymentReceipts"
            onSearch={() => setShowSearchModal(true)}
            onClear={handleClear}
            onAdd={access?.CanAdd && handleAdd}
          />

          <Col xs={24}>
            {searched && (
              <SimpleDataTable records={records} columns={columns} />
            )}
          </Col>
        </Row>
      </Spin>

      {showSearchModal && (
        <SearchModal
          onOk={handleSearch}
          onCancel={() => setShowSearchModal(false)}
          isOpen={showSearchModal}
          filter={filter}
        />
      )}

      {showModal && (
        <PaymentReceiptModal
          access={access}
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
          onSavePaymentReceiptItem={handleSavePaymentReceiptItem}
          onDeletePaymentReceiptItem={handleDeletePaymentReceiptItem}
          onReject={handleRejectPaymentReceipt}
          onApprove={handleApprovePaymentReceipt}
        />
      )}

      {showDetails && (
        <DetailsModal
          isOpen={showDetails}
          selectedObject={selectedObject}
          onOk={() => {
            setShowDetails(false);
            setSelectedObject(null);
          }}
        />
      )}
    </>
  );
};

export default PaymentReceiptsPage;
