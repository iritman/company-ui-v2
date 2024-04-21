import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, message } from "antd";
import Words from "../../../../../../resources/words";
import Colors from "../../../../../../resources/colors";
import utils from "../../../../../../tools/utils";
import service from "../../../../../../services/financial/treasury/pay/payment-requests-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
  handleError,
} from "../../../../../../tools/form-manager";
import SimpleDataTable from "../../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../../common/simple-data-page-header";
import PaymentRequestModal from "./payment-request-modal";
import SearchModal from "./payment-requests-search-modal";
import DetailsModal from "./payment-request-details-modal";
import { usePageContext } from "../../../../../contexts/page-context";
import DetailsButton from "../../../../../common/details-button";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "PaymentRequests",
    data: records,
    columns: [
      { label: Words.id, value: "RequestID" },
      { label: Words.front_side_account_id, value: "FrontSideAccountID" },
      { label: Words.account_no, value: "AccountNo" },
      { label: Words.first_name, value: "FirstName" },
      { label: Words.last_name, value: "LastName" },
      { label: Words.company, value: "CompanyTitle" },
      { label: Words.currency, value: "CurrencyTitle" },
      { label: Words.pay_type, value: "PayTypeTitle" },
      {
        label: Words.request_date,
        value: (record) => utils.slashDate(record.PayDate),
      },
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
    dataIndex: "RequestID",
    sorter: getSorter("RequestID"),
    render: (RequestID) => <Text>{utils.farsiNum(`${RequestID}`)}</Text>,
  },
  {
    title: Words.front_side,
    width: 200,
    align: "center",
    dataIndex: "FrontSideAccountTitle",
    sorter: getSorter("FrontSideAccountTitle"),
    render: (FrontSideAccountTitle) => (
      <Text style={{ color: Colors.cyan[6] }}>
        {utils.farsiNum(FrontSideAccountTitle)}
      </Text>
    ),
  },
  {
    title: Words.request_date,
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
    dataIndex: "TotalPrice",
    sorter: getSorter("TotalPrice"),
    render: (TotalPrice) => (
      <Text style={{ color: Colors.orange[6] }}>
        {utils.farsiNum(utils.moneyNumber(TotalPrice))}
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

const recordID = "RequestID";

const PaymentRequestsPage = ({ pageName }) => {
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

  //------

  const handleSavePaymentRequestItem = async (request_item) => {
    const saved_payment_request_item = await service.saveItem(request_item);

    const rec = { ...selectedObject };
    if (request_item.ItemID === 0) {
      rec.Items = [...rec.Items, saved_payment_request_item];
      rec.TotalPrice += request_item.Price;
    } else {
      const index = rec.Items.findIndex(
        (i) => i.ItemID === request_item.ItemID
      );
      rec.TotalPrice -= rec.Items[index].Price - request_item.Price;
      rec.Items[index] = saved_payment_request_item;
    }
    setSelectedObject(rec);

    //------

    const payment_request_index = records.findIndex(
      (payment_request) => payment_request.RequestID === request_item.RequestID
    );

    records[payment_request_index] = rec;

    //------

    setRecords([...records]);

    return saved_payment_request_item;
  };

  const handleDeletePaymentRequestItem = async (item_id) => {
    await service.deleteItem(item_id);

    if (selectedObject) {
      const rec = { ...selectedObject };
      rec.TotalPrice -= rec.Items.find((i) => i.ItemID === item_id).Price;
      rec.Items = rec.Items.filter((i) => i.ItemID !== item_id);
      setSelectedObject(rec);

      //------

      const payment_request_index = records.findIndex(
        (payment_request) => payment_request.RequestID === rec.RequestID
      );

      records[payment_request_index] = rec;

      setRecords([...records]);
    }
  };

  const handleApprovePaymentRequest = async () => {
    setProgress(true);

    try {
      const data = await service.approvePaymentRequest(
        selectedObject.RequestID
      );

      // Update selected object
      selectedObject.StatusID = 2; // Approve
      selectedObject.StatusTitle = Words.payment_request_status_2;
      setSelectedObject({ ...selectedObject });

      // Update records
      const request_index = records.findIndex(
        (r) => r.RequestID === selectedObject.RequestID
      );
      records[request_index] = { ...selectedObject };
      setRecords([...records]);

      //---
      message.success(data.Message);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleRejecetPaymentRequest = async () => {
    setProgress(true);

    try {
      const data = await service.rejectPaymentRequest(selectedObject.RequestID);

      // Update selected object
      selectedObject.StatusID = 3; // Reject
      selectedObject.StatusTitle = Words.payment_request_status_3;
      setSelectedObject({ ...selectedObject });

      // Update records
      const request_index = records.findIndex(
        (r) => r.RequestID === selectedObject.RequestID
      );
      records[request_index] = { ...selectedObject };
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
            title={Words.payment_requests}
            sheets={getSheets(records)}
            fileName="PaymentRequests"
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
        <PaymentRequestModal
          access={access}
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
          onSavePaymentRequestItem={handleSavePaymentRequestItem}
          onDeletePaymentRequestItem={handleDeletePaymentRequestItem}
          onReject={handleRejecetPaymentRequest}
          onApprove={handleApprovePaymentRequest}
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

export default PaymentRequestsPage;
