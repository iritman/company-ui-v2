import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, message } from "antd";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import service from "../../../../../services/logistic/purchase/purchase-orders-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
  handleError,
} from "../../../../../tools/form-manager";
import SimpleDataTable from "../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../common/simple-data-page-header";
import OrderModal from "./purchase-order-modal";
import SearchModal from "./purchase-orders-search-modal";
import DetailsModal from "./purchase-order-details-modal";
import { usePageContext } from "../../../../contexts/page-context";
import DetailsButton from "../../../../common/details-button";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "PurchaseOrders",
    data: records,
    columns: [
      { label: Words.id, value: "OrderID" },
      {
        label: Words.purchase_order_date,
        value: (record) => utils.slashDate(record.OrderDate),
      },
      { label: Words.base_type, value: "BaseTypeTitle" },
      { label: Words.base_id, value: "BaseID" },
      { label: Words.supplier, value: "SupplierTitle" },
      { label: Words.price, value: "Price" },
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
    dataIndex: "OrderID",
    sorter: getSorter("OrderID"),
    render: (OrderID) => <Text>{utils.farsiNum(`${OrderID}`)}</Text>,
  },
  {
    title: Words.purchase_order_date,
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
    title: Words.base_type,
    width: 150,
    align: "center",
    dataIndex: "BaseTypeTitle",
    sorter: getSorter("BaseTypeTitle"),
    render: (BaseTypeTitle) => (
      <Text style={{ color: Colors.orange[6] }}>{BaseTypeTitle}</Text>
    ),
  },
  {
    title: Words.base_id,
    width: 150,
    align: "center",
    dataIndex: "BaseID",
    sorter: getSorter("BaseID"),
    render: (BaseID) => (
      <Text style={{ color: Colors.red[6] }}>{utils.farsiNum(BaseID)}</Text>
    ),
  },
  {
    title: Words.supplier,
    width: 200,
    align: "center",
    dataIndex: "SupplierTitle",
    sorter: getSorter("SupplierTitle"),
    render: (SupplierTitle) => (
      <Text style={{ color: Colors.volcano[6] }}>{SupplierTitle}</Text>
    ),
  },
  {
    title: Words.price,
    width: 150,
    align: "center",
    dataIndex: "Price",
    sorter: getSorter("Price"),
    render: (Price) => (
      <Text style={{ color: Colors.green[6] }}>
        {utils.farsiNum(utils.moneyNumber(Price))}
      </Text>
    ),
  },
  {
    title: Words.registerar,
    width: 150,
    align: "center",
    sorter: getSorter("RegLastName"),
    render: (record) => (
      <Text>{`${record.RegFirstName} ${record.RegLastName}`}</Text>
    ),
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

const recordID = "OrderID";

const PurchaseOrdersPage = ({ pageName }) => {
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

  const handleSaveItem = async (order_item) => {
    const saved_item = await service.saveItem(order_item);

    const rec = { ...selectedObject };
    if (order_item.ItemID === 0) {
      rec.Items = [...rec.Items, saved_item];
    } else {
      const index = rec.Items.findIndex((i) => i.ItemID === order_item.ItemID);

      rec.Items[index] = saved_item;
    }
    setSelectedObject(rec);

    //------

    const order_index = records.findIndex(
      (r) => r.OrderID === order_item.OrderID
    );

    records[order_index] = rec;

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

      const order_index = records.findIndex((r) => r.OrderID === rec.OrderID);

      records[order_index] = rec;

      setRecords([...records]);
    }
  };

  const handleApprove = async () => {
    setProgress(true);

    try {
      const data = await service.approveOrder(selectedObject.OrderID);

      // Update selected object
      selectedObject.StatusID = 2; // Approve
      selectedObject.StatusTitle = Words.purchase_order_status_2;

      selectedObject.Items.forEach((item) => {
        if (item.StatusID === 1) {
          item.StatusID = 2;
          item.StatusTitle = Words.purchase_order_status_2;
        }
      });

      setSelectedObject({ ...selectedObject });

      // Update records
      const order_index = records.findIndex(
        (r) => r.OrderID === selectedObject.OrderID
      );
      records[order_index] = { ...selectedObject };
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
      const data = await service.undoApproveOrder(selectedObject.OrderID);

      // Update selected object
      selectedObject.StatusID = 1; // In progress
      selectedObject.StatusTitle = Words.purchase_order_status_1;
      setSelectedObject({ ...selectedObject });

      // Update records
      const order_index = records.findIndex(
        (r) => r.OrderID === selectedObject.OrderID
      );
      records[order_index] = { ...selectedObject };
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
      const data = await service.rejectOrder(selectedObject.OrderID);

      // Update selected object
      selectedObject.StatusID = 3; // Reject
      selectedObject.StatusTitle = Words.purchase_order_status_3;
      setSelectedObject({ ...selectedObject });

      // Update records
      const order_index = records.findIndex(
        (r) => r.OrderID === selectedObject.OrderID
      );
      records[order_index] = { ...selectedObject };
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
            title={Words.purchase_orders}
            sheets={getSheets(records)}
            fileName="PurchaseOrders"
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
        <OrderModal
          access={access}
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
          onSaveOrderItem={handleSaveItem}
          onDeleteOrderItem={handleDeleteItem}
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

export default PurchaseOrdersPage;
