import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, message } from "antd";
import Words from "../../../../../../resources/words";
import Colors from "../../../../../../resources/colors";
import utils from "../../../../../../tools/utils";
import service from "../../../../../../services/financial/treasury/pay/payment-orders-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
  handleError,
} from "../../../../../../tools/form-manager";
import SimpleDataTable from "../../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../../common/simple-data-page-header";
import PaymentOrderModal from "./payment-order-modal";
import SearchModal from "./payment-orders-search-modal";
import DetailsModal from "./payment-order-details-modal";
import { usePageContext } from "../../../../../contexts/page-context";
import DetailsButton from "../../../../../common/details-button";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "PaymentOrders",
    data: records,
    columns: [
      { label: Words.id, value: "OrderID" },
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
    dataIndex: "OrderID",
    sorter: getSorter("OrderID"),
    render: (OrderID) => <Text>{utils.farsiNum(`${OrderID}`)}</Text>,
  },
  {
    title: Words.front_side,
    width: 250,
    align: "center",
    dataIndex: "FrontSideAccountTitle",
    sorter: getSorter("FrontSideAccountTitle"),
    render: (FrontSideAccountTitle) => (
      <Text style={{ color: Colors.green[6] }}>
        {utils.farsiNum(FrontSideAccountTitle)}
      </Text>
    ),
  },
  {
    title: Words.pay_type,
    width: 200,
    align: "center",
    dataIndex: "PayTypeTitle",
    sorter: getSorter("PayTypeTitle"),
    render: (PayTypeTitle) => (
      <Text style={{ color: Colors.orange[6] }}>{PayTypeTitle}</Text>
    ),
  },
  {
    title: Words.payment_order_date,
    width: 150,
    align: "center",
    dataIndex: "OrderDate",
    sorter: getSorter("OrderDate"),
    render: (OrderDate) => (
      <Text style={{ color: Colors.blue[6] }}>
        {utils.farsiNum(utils.slashDate(OrderDate))}
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
      <Text style={{ color: Colors.red[6] }}>
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

const recordID = "OrderID";

const PaymentOrdersPage = ({ pageName }) => {
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
      case "receive-notice":
        collection = "ReceiveNotices";
        break;
      case "pay-to-other":
        collection = "PayToOthers";
        break;
      case "return-payable-cheque":
        collection = "ReturnPayableCheques";
        break;
      case "return-payable-demand":
        collection = "ReturnPayableDemands";
        break;
      default:
        break;
    }

    return collection;
  };

  const handleSavePaymentOrderItem = async (
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

    const pay_index = records.findIndex(
      (pay) => pay.OrderID === payment_item.OrderID
    );

    records[pay_index] = rec;

    //------

    setRecords([...records]);

    return saved_pay_item;
  };

  const handleDeletePaymentOrderItem = async (
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
        (receive_receipt) => receive_receipt.OrderID === rec.OrderID
      );

      records[receive_receipt_index] = rec;

      setRecords([...records]);
    }
  };

  const handleApprovePaymentOrder = async () => {
    setProgress(true);

    try {
      const data = await service.approveOrder(selectedObject.OrderID);

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

  const handleRejectPaymentOrder = async () => {
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
            title={Words.payment_orders}
            sheets={getSheets(records)}
            fileName="PaymentOrders"
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
        <PaymentOrderModal
          access={access}
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
          onSavePaymentOrderItem={handleSavePaymentOrderItem}
          onDeletePaymentOrderItem={handleDeletePaymentOrderItem}
          onReject={handleRejectPaymentOrder}
          onApprove={handleApprovePaymentOrder}
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

export default PaymentOrdersPage;
