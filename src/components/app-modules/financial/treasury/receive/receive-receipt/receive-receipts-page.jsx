import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, message } from "antd";
import Words from "../../../../../../resources/words";
import Colors from "../../../../../../resources/colors";
import utils from "../../../../../../tools/utils";
import service from "../../../../../../services/financial/treasury/receive/receive-receipts-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
  handleError,
} from "../../../../../../tools/form-manager";
import SimpleDataTable from "../../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../../common/simple-data-page-header";
import ReceiveReceiptModal from "./receive-receipt-modal";
import SearchModal from "./receive-receipts-search-modal";
import DetailsModal from "./receive-receipt-details-modal";
import { usePageContext } from "../../../../../contexts/page-context";
import DetailsButton from "../../../../../common/details-button";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "ReceiveReceipts",
    data: records,
    columns: [
      { label: Words.id, value: "ReceiveID" },
      { label: Words.receipt_receive_type, value: "ReceiveTypeTitle" },
      {
        label: Words.delivery_member,
        value: (record) =>
          record.DeliveryMemberID > 0
            ? `${record.DeliveryMemberFirstName} ${record.DeliveryMemberLastName}`
            : record.DeliveryMember,
      },
      {
        label: Words.receive_date,
        value: (record) =>
          record.ReceiveDate.length > 0
            ? utils.slashDate(record.ReceiveDate)
            : "",
      },
      { label: Words.regards, value: "RegardTitle" },
      { label: Words.cash_box, value: "CashBoxTitle" },
      { label: Words.standard_description, value: "DetailsText" },
      {
        label: Words.reg_date,
        value: (record) => utils.slashDate(record.RegDate),
      },
      {
        label: Words.reg_time,
        value: (record) => utils.colonTime(record.RegTime),
      },
      {
        label: Words.registerar,
        value: (record) =>
          `${record.RegMemberFirstName} ${record.RegMemberLastName}`,
      },
      { label: Words.status, value: "StatusTitle" },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 75,
    align: "center",
    dataIndex: "ReceiveID",
    sorter: getSorter("ReceiveID"),
    render: (ReceiveID) => <Text>{utils.farsiNum(`${ReceiveID}`)}</Text>,
  },
  {
    title: Words.receipt_receive_type,
    width: 200,
    align: "center",
    dataIndex: "ReceiveTypeTitle",
    sorter: getSorter("ReceiveTypeTitle"),
    render: (ReceiveTypeTitle) => (
      <Text style={{ color: Colors.cyan[6] }}>{ReceiveTypeTitle}</Text>
    ),
  },
  {
    title: Words.receive_date,
    width: 150,
    align: "center",
    dataIndex: "ReceiveDate",
    sorter: getSorter("ReceiveDate"),
    render: (ReceiveDate) => (
      <Text style={{ color: Colors.orange[6] }}>
        {utils.farsiNum(utils.slashDate(ReceiveDate))}
      </Text>
    ),
  },
  {
    title: Words.cash_box,
    width: 200,
    align: "center",
    dataIndex: "CashBoxTitle",
    sorter: getSorter("CashBoxTitle"),
    render: (CashBoxTitle) => (
      <Text style={{ color: Colors.cyan[6] }}>
        {utils.farsiNum(CashBoxTitle)}
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
      <Text style={{ color: Colors.purple[6] }}>
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

const recordID = "ReceiveID";

const ReceiveReceiptsPage = ({ pageName }) => {
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
      case "payment-notice":
        collection = "PaymentNotices";
        break;
      case "refund-from-other-cheque":
        collection = "RefundFromOtherCheques";
        break;
      case "refund-payed-cheque":
        collection = "RefundPayedCheques";
        break;
      case "refund-payed-demand":
        collection = "RefundPayedDemands";
        break;
      default:
        break;
    }

    return collection;
  };

  const handleSaveReceiveReceiptItem = async (
    item_type,
    key_field,
    receive_item
  ) => {
    //--- specify collection

    const collection = getCollection(item_type);

    //--- calculate new price

    let diff_price = 0;

    if (receive_item[key_field] === 0) {
      diff_price = receive_item.Amount;
    } else {
      diff_price =
        receive_item.Amount -
        selectedObject[collection].find(
          (c) => c[key_field] === receive_item[key_field]
        ).Amount;
    }

    //---

    const saved_receipt_item = await service.saveItem(item_type, receive_item);

    const rec = { ...selectedObject };
    // update price
    rec.Price += diff_price;

    //------

    if (receive_item[key_field] === 0)
      rec[collection] = [...rec[collection], saved_receipt_item];
    else {
      const index = rec[collection].findIndex(
        (i) => i[key_field] === receive_item[key_field]
      );

      rec[collection][index] = saved_receipt_item;
    }

    setSelectedObject(rec);

    //------

    const receipt_index = records.findIndex(
      (receipt) => receipt.ReceiveID === receive_item.ReceiveID
    );

    records[receipt_index] = rec;

    //------

    setRecords([...records]);

    return saved_receipt_item;
  };

  const handleDeleteReceiveReceiptItem = async (
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

      const receive_receipt_index = records.findIndex(
        (receive_receipt) => receive_receipt.ReceiveID === rec.ReceiveID
      );

      records[receive_receipt_index] = rec;

      setRecords([...records]);
    }
  };

  const handleApproveReceiveReceipt = async () => {
    setProgress(true);

    try {
      const data = await service.approveReceiveReceipt(
        selectedObject.ReceiveID
      );

      // Update selected object
      selectedObject.StatusID = 2; // Approve
      selectedObject.StatusTitle = Words.receive_receipt_status_2;
      setSelectedObject({ ...selectedObject });

      // Update records
      const receipt_index = records.findIndex(
        (r) => r.ReceiveID === selectedObject.ReceiveID
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

  const handleRejecetReceiveReceipt = async () => {
    setProgress(true);

    try {
      const data = await service.rejectReceiveReceipt(selectedObject.ReceiveID);

      // Update selected object
      selectedObject.StatusID = 3; // Reject
      selectedObject.StatusTitle = Words.receive_receipt_status_3;
      setSelectedObject({ ...selectedObject });

      // Update records
      const receipt_index = records.findIndex(
        (r) => r.ReceiveID === selectedObject.ReceiveID
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

  const handleUndoApprove = async () => {
    setProgress(true);

    try {
      const data = await service.undoApprove(selectedObject.ReceiveID);

      // Update selected object
      selectedObject.StatusID = 1; // In progress
      selectedObject.StatusTitle = Words.receive_receipt_status_1;
      setSelectedObject({ ...selectedObject });

      // Update records
      const receipt_index = records.findIndex(
        (r) => r.ReceiveID === selectedObject.ReceiveID
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

  const handleSubmitVoucher = async () => {
    setProgress(true);

    try {
      const data = await service.submitVoucher(selectedObject.ReceiveID);

      const { VoucherID, Message } = data;

      // Update selected object
      selectedObject.SubmittedVoucherID = VoucherID;
      setSelectedObject({ ...selectedObject });

      // Update records
      const receipt_index = records.findIndex(
        (r) => r.ReceiveID === selectedObject.ReceiveID
      );
      records[receipt_index] = { ...selectedObject };
      setRecords([...records]);

      //---
      message.success(Message);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleDeleteVoucher = async () => {
    setProgress(true);

    try {
      const data = await service.deleteVoucher(selectedObject.ReceiveID);

      // Update selected object
      selectedObject.SubmittedVoucherID = 0;
      setSelectedObject({ ...selectedObject });

      // Update records
      const receipt_index = records.findIndex(
        (r) => r.ReceiveID === selectedObject.ReceiveID
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
            title={Words.receive_receipts}
            sheets={getSheets(records)}
            fileName="ReceiveReceipts"
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
        <ReceiveReceiptModal
          access={access}
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
          onSaveReceiveReceiptItem={handleSaveReceiveReceiptItem}
          onDeleteReceiveReceiptItem={handleDeleteReceiveReceiptItem}
          onReject={handleRejecetReceiveReceipt}
          onApprove={handleApproveReceiveReceipt}
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
          onUndoApprove={handleUndoApprove}
          onSubmitVoucher={handleSubmitVoucher}
          onDeleteVoucher={handleDeleteVoucher}
        />
      )}
    </>
  );
};

export default ReceiveReceiptsPage;
