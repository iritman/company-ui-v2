import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, message } from "antd";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import service from "../../../../../services/logistic/purchase/inquiry-requests-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
  handleError,
} from "../../../../../tools/form-manager";
import SimpleDataTable from "../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../common/simple-data-page-header";
import InquiryRequestModal from "./inquiry-request-modal";
import SearchModal from "./inquiry-requests-search-modal";
import DetailsModal from "./inquiry-request-details-modal";
import { usePageContext } from "../../../../contexts/page-context";
import DetailsButton from "../../../../common/details-button";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "InquiryRequests",
    data: records,
    columns: [
      { label: Words.id, value: "RequestID" },
      // { label: Words.request_type, value: "RequestTypeTitle" },
      {
        label: Words.inquiry_deadline,
        value: (record) => utils.slashDate(record.InquiryDeadline),
      },
      {
        label: Words.request_date,
        value: (record) => utils.slashDate(record.InquiryDate),
      },
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
    dataIndex: "RequestID",
    sorter: getSorter("RequestID"),
    render: (RequestID) => <Text>{utils.farsiNum(`${RequestID}`)}</Text>,
  },
  {
    title: Words.request_date,
    width: 150,
    align: "center",
    dataIndex: "InquiryDate",
    sorter: getSorter("InquiryDate"),
    render: (InquiryDate) => (
      <Text style={{ color: Colors.blue[6] }}>
        {utils.farsiNum(utils.slashDate(InquiryDate))}
      </Text>
    ),
  },
  // {
  //   title: Words.request_type,
  //   width: 150,
  //   align: "center",
  //   dataIndex: "RequestTypeTitle",
  //   sorter: getSorter("RequestTypeTitle"),
  //   render: (RequestTypeTitle) => <Text>{RequestTypeTitle}</Text>,
  // },
  {
    title: Words.inquiry_final_deadline,
    width: 150,
    align: "center",
    dataIndex: "InquiryDeadline",
    sorter: getSorter("InquiryDeadline"),
    render: (InquiryDeadline) => (
      <Text style={{ color: Colors.orange[6] }}>
        {utils.farsiNum(utils.slashDate(InquiryDeadline))}
      </Text>
    ),
  },
  {
    title: Words.status,
    width: 150,
    align: "center",
    dataIndex: "StatusTitle",
    sorter: getSorter("StatusTitle"),
    render: (StatusTitle) => (
      <Text style={{ color: Colors.blue[7] }}>{StatusTitle}</Text>
    ),
  },
  {
    title: Words.reg_member,
    width: 150,
    align: "center",
    // dataIndex: "StatusTitle",
    sorter: getSorter("RegFirstName"),
    render: (record) => (
      <Text
        style={{ color: Colors.grey[6] }}
      >{`${record.RegFirstName} ${record.RegLastName}`}</Text>
    ),
  },
];

const recordID = "RequestID";

const InquiryRequestsPage = ({ pageName }) => {
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
    const data = await service.saveItem(request_item);

    const { SavedItem, NewSuppliers } = data;

    const rec = { ...selectedObject };
    if (request_item.ItemID === 0) {
      rec.Items = [...rec.Items, SavedItem];
    } else {
      const index = rec.Items.findIndex(
        (i) => i.ItemID === request_item.ItemID
      );

      rec.Items[index] = SavedItem;
    }
    rec.Suppliers = [...rec.Suppliers, ...NewSuppliers];
    setSelectedObject(rec);

    //------

    const inquiry_request_index = records.findIndex(
      (inquiry_request) => inquiry_request.RequestID === request_item.RequestID
    );

    records[inquiry_request_index] = rec;

    //------

    setRecords([...records]);

    return data;
  };

  const handleDeleteItem = async (item_id) => {
    await service.deleteItem(item_id);

    if (selectedObject) {
      const rec = { ...selectedObject };
      rec.Items = rec.Items.filter((i) => i.ItemID !== item_id);
      setSelectedObject(rec);

      //------

      const inquiry_request_index = records.findIndex(
        (inquiry_request) => inquiry_request.RequestID === rec.RequestID
      );

      records[inquiry_request_index] = rec;

      setRecords([...records]);
    }
  };

  const handleApprove = async () => {
    setProgress(true);

    try {
      const data = await service.approveInquiryRequest(
        selectedObject.RequestID
      );

      // Update selected object
      selectedObject.StatusID = 2; // Approve
      selectedObject.StatusTitle = Words.inquiry_request_status_2;

      selectedObject.Items.forEach((item) => {
        if (item.StatusID === 1) {
          item.StatusID = 2;
          item.StatusTitle = Words.inquiry_request_status_2;
        }
      });

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

  const handleUndoApprove = async () => {
    setProgress(true);

    try {
      const data = await service.undoApproveInquiryRequest(
        selectedObject.RequestID
      );

      // Update selected object
      selectedObject.StatusID = 1; // In progress
      selectedObject.StatusTitle = Words.inquiry_request_status_1;
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

  const handleReject = async () => {
    setProgress(true);

    try {
      const data = await service.rejectInquiryRequest(selectedObject.RequestID);

      // Update selected object
      selectedObject.StatusID = 3; // Reject
      selectedObject.StatusTitle = Words.inquiry_request_status_3;
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

  const handleSaveSupplier = async (request_supplier) => {
    const saved_supplier = await service.saveSupplier(request_supplier);

    const rec = { ...selectedObject };
    if (request_supplier.RowID === 0) {
      rec.Suppliers = [...rec.Suppliers, saved_supplier];
    } else {
      const index = rec.Suppliers.findIndex(
        (i) => i.RowID === request_supplier.RowID
      );

      rec.Suppliers[index] = saved_supplier;
    }
    setSelectedObject(rec);

    //------

    const inquiry_request_index = records.findIndex(
      (inquiry_request) =>
        inquiry_request.RequestID === request_supplier.RequestID
    );

    records[inquiry_request_index] = rec;

    //------

    setRecords([...records]);

    return saved_supplier;
  };

  const handleDeleteSupplier = async (supplier_row_id) => {
    await service.deleteSupplier(supplier_row_id);

    if (selectedObject) {
      const rec = { ...selectedObject };
      rec.Suppliers = rec.Suppliers.filter(
        (sp) => sp.RowID !== supplier_row_id
      );
      setSelectedObject(rec);

      //------

      const inquiry_request_index = records.findIndex(
        (inquiry_request) => inquiry_request.RequestID === rec.RequestID
      );

      records[inquiry_request_index] = rec;

      setRecords([...records]);
    }
  };

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.inquiry_requests}
            sheets={getSheets(records)}
            fileName="InquiryRequests"
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
        <InquiryRequestModal
          access={access}
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
          onSaveInquiryItem={handleSaveItem}
          onDeleteInquiryItem={handleDeleteItem}
          onSaveInquirySupplier={handleSaveSupplier}
          onDeleteInquirySupplier={handleDeleteSupplier}
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

export default InquiryRequestsPage;
