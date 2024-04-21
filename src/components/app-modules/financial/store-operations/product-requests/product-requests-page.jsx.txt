import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, message } from "antd";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import service from "../../../../../services/financial/store-operations/product-requests-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
  handleError,
} from "../../../../../tools/form-manager";
import SimpleDataTable from "../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../common/simple-data-page-header";
import ProductRequestModal from "./product-request-modal";
import SearchModal from "./product-requests-search-modal";
import DetailsModal from "./product-request-details-modal";
import { usePageContext } from "../../../../contexts/page-context";
import DetailsButton from "../../../../common/details-button";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "ProductRequests",
    data: records,
    columns: [
      { label: Words.id, value: "RequestID" },
      //   { label: Words.storage_center, value: "StorageCenterTitle" },
      { label: Words.front_side_account, value: "FrontSideAccountTitle" },
      {
        label: Words.request_member,
        value: (record) =>
          `${record.RequestMemberFirstName} ${record.RequestMemberLastName}`,
      },
      { label: Words.request_type, value: "RequestTypeTitle" },
      {
        label: Words.need_date,
        value: (record) => utils.slashDate(record.NeededDate),
      },
      {
        label: Words.request_date,
        value: (record) => utils.slashDate(record.PayDate),
      },
      { label: Words.standard_description, value: "DetailsText" },
      { label: Words.from_store, value: "FromStoreTitle" },
      { label: Words.to_store, value: "ToStoreTitle" },
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
    dataIndex: "RequestDate",
    sorter: getSorter("RequestDate"),
    render: (RequestDate) => (
      <Text style={{ color: Colors.blue[6] }}>
        {utils.farsiNum(utils.slashDate(RequestDate))}
      </Text>
    ),
  },
  {
    title: Words.need_date,
    width: 150,
    align: "center",
    dataIndex: "NeededDate",
    sorter: getSorter("NeededDate"),
    render: (NeededDate) => (
      <Text style={{ color: Colors.blue[6] }}>
        {utils.farsiNum(utils.slashDate(NeededDate))}
      </Text>
    ),
  },
  {
    title: Words.front_side_type,
    width: 150,
    align: "center",
    dataIndex: "FrontSideTypeTitle",
    sorter: getSorter("FrontSideTypeTitle"),
    render: (FrontSideTypeTitle) => <Text>{FrontSideTypeTitle}</Text>,
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
    title: Words.request_type,
    width: 150,
    align: "center",
    dataIndex: "RequestTypeTitle",
    sorter: getSorter("RequestTypeTitle"),
    render: (RequestTypeTitle) => <Text>{RequestTypeTitle}</Text>,
  },
  {
    title: Words.status,
    width: 150,
    align: "center",
    dataIndex: "StatusTitle",
    sorter: getSorter("StatusTitle"),
    render: (StatusTitle) => (
      <Text style={{ color: Colors.blue[6] }}>{StatusTitle}</Text>
    ),
  },
];

const recordID = "RequestID";

const ProductRequestsPage = ({ pageName }) => {
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

    const product_request_index = records.findIndex(
      (product_request) => product_request.RequestID === request_item.RequestID
    );

    records[product_request_index] = rec;

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

      const product_request_index = records.findIndex(
        (product_request) => product_request.RequestID === rec.RequestID
      );

      records[product_request_index] = rec;

      setRecords([...records]);
    }
  };

  const handleApprove = async () => {
    setProgress(true);

    try {
      const data = await service.approveProductRequest(
        selectedObject.RequestID
      );

      // Update selected object
      selectedObject.StatusID = 2; // Approve
      selectedObject.StatusTitle = Words.product_request_status_2;

      selectedObject.Items.forEach((item) => {
        if (item.StatusID === 1) {
          item.StatusID = 2;
          item.StatusTitle = Words.product_request_status_2;
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
      const data = await service.undoApproveProductRequest(
        selectedObject.RequestID
      );

      // Update selected object
      selectedObject.StatusID = 1; // In progress
      selectedObject.StatusTitle = Words.product_request_status_1;
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
      const data = await service.rejectProductRequest(selectedObject.RequestID);

      // Update selected object
      selectedObject.StatusID = 5; // Reject
      selectedObject.StatusTitle = Words.product_request_status_5;
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

  const handleRefreshStoreInventory = async () => {
    setProgress(true);

    try {
      const data = await service.getRequestItems(selectedObject.RequestID);

      // Update selected object
      selectedObject.Items = data;
      setSelectedObject({ ...selectedObject });

      // Update records
      const request_index = records.findIndex(
        (r) => r.RequestID === selectedObject.RequestID
      );
      records[request_index] = { ...selectedObject };
      setRecords([...records]);

      //---
      // message.success(data.Message);
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
            title={Words.product_requests}
            sheets={getSheets(records)}
            fileName="ProductRequests"
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
        <ProductRequestModal
          access={access}
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
          onSaveProductRequestItem={handleSaveItem}
          onDeleteProductRequestItem={handleDeleteItem}
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
          onRefreshStoreInventory={handleRefreshStoreInventory}
        />
      )}
    </>
  );
};

export default ProductRequestsPage;
