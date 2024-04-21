import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, message } from "antd";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import service from "../../../../../services/logistic/purchase/deliveries-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
  handleError,
} from "../../../../../tools/form-manager";
import SimpleDataTable from "../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../common/simple-data-page-header";
import DeliveryModal from "./purchase-delivery-modal";
import SearchModal from "./purchase-deliveries-search-modal";
import DetailsModal from "./purchase-delivery-details-modal";
import { usePageContext } from "../../../../contexts/page-context";
import DetailsButton from "../../../../common/details-button";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "PurchaseDeliveries",
    data: records,
    columns: [
      { label: Words.id, value: "DeliveryID" },
      {
        label: Words.purchase_delivery_date,
        value: (record) => utils.slashDate(record.DeliveryDate),
      },
      { label: Words.transferee_type, value: "TransfereeTypeTitle" },
      { label: Words.transferee, value: "TransfereeTafsilAccountTitle" },
      { label: Words.delivery_person, value: "DeliveryTafsilAccountTitle" },
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
    dataIndex: "DeliveryID",
    sorter: getSorter("DeliveryID"),
    render: (DeliveryID) => <Text>{utils.farsiNum(`${DeliveryID}`)}</Text>,
  },
  {
    title: Words.purchase_delivery_date,
    width: 150,
    align: "center",
    dataIndex: "DeliveryDate",
    sorter: getSorter("DeliveryDate"),
    render: (DeliveryDate) => (
      <Text style={{ color: Colors.blue[6] }}>
        {utils.farsiNum(utils.slashDate(DeliveryDate))}
      </Text>
    ),
  },
  {
    title: Words.transferee_type,
    width: 150,
    align: "center",
    dataIndex: "TransfereeTypeTitle",
    sorter: getSorter("TransfereeTypeTitle"),
    render: (TransfereeTypeTitle) => (
      <Text style={{ color: Colors.green[6] }}>{TransfereeTypeTitle}</Text>
    ),
  },
  {
    title: Words.transferee,
    width: 200,
    align: "center",
    dataIndex: "TransfereeTafsilAccountTitle",
    sorter: getSorter("TransfereeTafsilAccountTitle"),
    render: (TransfereeTafsilAccountTitle) => (
      <Text style={{ color: Colors.red[6] }}>
        {utils.farsiNum(TransfereeTafsilAccountTitle)}
      </Text>
    ),
  },
  {
    title: Words.delivery_person,
    width: 200,
    align: "center",
    dataIndex: "DeliveryTafsilAccountTitle",
    sorter: getSorter("DeliveryTafsilAccountTitle"),
    render: (DeliveryTafsilAccountTitle) => (
      <Text style={{ color: Colors.purple[5] }}>
        {DeliveryTafsilAccountTitle}
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
    render: (StatusTitle) => (
      <Text style={{ color: Colors.geekblue[5] }}>{StatusTitle}</Text>
    ),
  },
];

const recordID = "DeliveryID";

const PurchaseDeliveriesPage = ({ pageName }) => {
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

  const handleSaveItem = async (delivery_item) => {
    const saved_item = await service.saveItem(delivery_item);

    const rec = { ...selectedObject };
    if (delivery_item.ItemID === 0) {
      rec.Items = [...rec.Items, saved_item];
    } else {
      const index = rec.Items.findIndex(
        (i) => i.ItemID === delivery_item.ItemID
      );

      rec.Items[index] = saved_item;
    }
    setSelectedObject(rec);

    //------

    const delivery_index = records.findIndex(
      (r) => r.DeliveryID === delivery_item.DeliveryID
    );

    records[delivery_index] = rec;

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

      const delivery_index = records.findIndex(
        (r) => r.DeliveryID === rec.DeliveryID
      );

      records[delivery_index] = rec;

      setRecords([...records]);
    }
  };

  const handleApprove = async () => {
    setProgress(true);

    try {
      const data = await service.approveDelivery(selectedObject.DeliveryID);

      // Update selected object
      selectedObject.StatusID = 2; // Approve
      selectedObject.StatusTitle = Words.purchase_delivery_status_2;

      selectedObject.Items.forEach((item) => {
        if (item.StatusID === 1) {
          item.StatusID = 2;
          item.StatusTitle = Words.purchase_delivery_status_2;
        }
      });

      setSelectedObject({ ...selectedObject });

      // Update records
      const delivery_index = records.findIndex(
        (r) => r.DeliveryID === selectedObject.DeliveryID
      );
      records[delivery_index] = { ...selectedObject };
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
      const data = await service.undoApproveDelivery(selectedObject.DeliveryID);

      // Update selected object
      selectedObject.StatusID = 1; // In progress
      selectedObject.StatusTitle = Words.purchase_delivery_status_1;
      setSelectedObject({ ...selectedObject });

      // Update records
      const delivery_index = records.findIndex(
        (r) => r.DeliveryID === selectedObject.DeliveryID
      );
      records[delivery_index] = { ...selectedObject };
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
      const data = await service.rejectDelivery(selectedObject.DeliveryID);

      // Update selected object
      selectedObject.StatusID = 3; // Reject
      selectedObject.StatusTitle = Words.purchase_delivery_status_3;
      setSelectedObject({ ...selectedObject });

      // Update records
      const delivery_index = records.findIndex(
        (r) => r.DeliveryID === selectedObject.DeliveryID
      );
      records[delivery_index] = { ...selectedObject };
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
            title={Words.purchase_deliveries}
            sheets={getSheets(records)}
            fileName="PurchaseDeliveries"
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
        <DeliveryModal
          access={access}
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
          onSaveDeliveryItem={handleSaveItem}
          onDeleteDeliveryItem={handleDeleteItem}
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

export default PurchaseDeliveriesPage;
