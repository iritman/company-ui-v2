import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, message } from "antd";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import service from "../../../../../services/logistic/purchase/invoices-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
  handleError,
} from "../../../../../tools/form-manager";
import SimpleDataTable from "../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../common/simple-data-page-header";
import InvoiceModal from "./invoice-modal";
import SearchModal from "./invoices-search-modal";
import DetailsModal from "./invoice-details-modal";
import { usePageContext } from "../../../../contexts/page-context";
import DetailsButton from "../../../../common/details-button";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "Invoices",
    data: records,
    columns: [
      { label: Words.id, value: "InvoiceID" },
      { label: Words.invoice_no, value: "InvoiceNo" },
      { label: Words.supplier, value: "SupplierTitle" },
      { label: Words.transport_type, value: "TransportTypeTitle" },
      { label: Words.purchase_way, value: "PurchaseWayTitle" },
      {
        label: Words.invoice_date,
        value: (record) => utils.slashDate(record.InvoiceDate),
      },
      {
        label: Words.credit_date,
        value: (record) => utils.slashDate(record.CreditDate),
      },
      { label: Words.payment_type, value: "PaymentTypeTitle" },
      { label: Words.pre_payment_amount, value: "PrepaymentAmount" },
      { label: Words.standard_description, value: "DetailsText" },
      {
        label: Words.status,
        value: "StatusTitle",
      },
      { label: Words.reg_date, value: "RegDate" },
      { label: Words.reg_time, value: "RegTime" },
      {
        label: Words.reg_member,
        value: (record) => `${record.RegFirstName} ${record.RegLastName}`,
      },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 75,
    align: "center",
    dataIndex: "InvoiceID",
    sorter: getSorter("InvoiceID"),
    render: (InvoiceID) => <Text>{utils.farsiNum(`${InvoiceID}`)}</Text>,
  },
  {
    title: Words.invoice_date,
    width: 150,
    align: "center",
    dataIndex: "InvoiceDate",
    sorter: getSorter("InvoiceDate"),
    render: (InvoiceDate) => (
      <Text style={{ color: Colors.blue[6] }}>
        {utils.farsiNum(utils.slashDate(InvoiceDate))}
      </Text>
    ),
  },
  {
    title: Words.credit_date,
    width: 150,
    align: "center",
    dataIndex: "CreditDate",
    sorter: getSorter("CreditDate"),
    render: (CreditDate) => (
      <Text style={{ color: Colors.orange[6] }}>
        {utils.farsiNum(utils.slashDate(CreditDate))}
      </Text>
    ),
  },
  {
    title: Words.supplier,
    width: 150,
    align: "center",
    dataIndex: "SupplierTitle",
    sorter: getSorter("SupplierTitle"),
    render: (SupplierTitle) => (
      <Text style={{ color: Colors.purple[6] }}>{SupplierTitle}</Text>
    ),
  },
  {
    title: Words.payment_type,
    width: 150,
    align: "center",
    dataIndex: "PaymentTypeTitle",
    sorter: getSorter("PaymentTypeTitle"),
    render: (PaymentTypeTitle) => <Text>{PaymentTypeTitle}</Text>,
  },
  {
    title: Words.status,
    width: 150,
    align: "center",
    dataIndex: "StatusTitle",
    sorter: getSorter("StatusTitle"),
    render: (StatusTitle) => <Text>{StatusTitle}</Text>,
  },
];

const recordID = "InvoiceID";

const InvoicesPage = ({ pageName }) => {
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

  const handleSaveItem = async (request_item) => {
    const saved_item = await service.saveItem(request_item);

    const rec = { ...selectedObject };
    if (request_item.ItemID === 0) {
      rec.Items = [...rec.Items, saved_item];
    } else {
      const index = rec.Items.findIndex(
        (i) => i.ItemID === request_item.ItemID
      );

      rec.Items[index] = saved_item;
    }
    setSelectedObject(rec);

    //------

    const invoice_index = records.findIndex(
      (invoice) => invoice.InvoiceID === request_item.InvoiceID
    );

    records[invoice_index] = rec;

    //------

    setRecords([...records]);

    return saved_item;
  };

  const handleDeleteItem = async (item_id) => {
    await service.deleteItem(item_id);

    if (selectedObject) {
      const rec = { ...selectedObject };
      rec.Items = rec.Items.filter((i) => i.ItemID !== item_id);
      setSelectedObject(rec);

      //------

      const invoice_index = records.findIndex(
        (invoice) => invoice.InvoiceID === rec.InvoiceID
      );

      records[invoice_index] = rec;

      setRecords([...records]);
    }
  };

  const handleApprove = async () => {
    setProgress(true);

    try {
      const data = await service.approveInvoice(selectedObject.InvoiceID);

      // Update selected object
      selectedObject.StatusID = 2; // Approve
      selectedObject.StatusTitle = Words.invoice_status_2;

      selectedObject.Items.forEach((item) => {
        if (item.StatusID === 1) {
          item.StatusID = 2;
          item.StatusTitle = Words.invoice_status_2;
        }
      });

      setSelectedObject({ ...selectedObject });

      // Update records
      const request_index = records.findIndex(
        (r) => r.InvoiceID === selectedObject.InvoiceID
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

  const handleUndoApprove = async () => {
    setProgress(true);

    try {
      const data = await service.undoApproveInvoice(selectedObject.InvoiceID);

      // Update selected object
      selectedObject.StatusID = 1; // In progress
      selectedObject.StatusTitle = Words.invoice_status_1;
      setSelectedObject({ ...selectedObject });

      // Update records
      const request_index = records.findIndex(
        (r) => r.InvoiceID === selectedObject.InvoiceID
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

  const handleReject = async () => {
    setProgress(true);

    try {
      const data = await service.rejectInvoice(selectedObject.InvoiceID);

      // Update selected object
      selectedObject.StatusID = 3; // Reject
      selectedObject.StatusTitle = Words.invoice_status_3;
      setSelectedObject({ ...selectedObject });

      // Update records
      const request_index = records.findIndex(
        (r) => r.InvoiceID === selectedObject.InvoiceID
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
            title={Words.invoices}
            sheets={getSheets(records)}
            fileName="Invoices"
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
        <InvoiceModal
          access={access}
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
          onSaveInvoiceItem={handleSaveItem}
          onDeleteInvoiceItem={handleDeleteItem}
          onReject={handleReject}
          onApprove={handleApprove}
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
        />
      )}
    </>
  );
};

export default InvoicesPage;
