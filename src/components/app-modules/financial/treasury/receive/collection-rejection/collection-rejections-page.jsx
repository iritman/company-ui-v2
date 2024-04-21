import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, message } from "antd";
import Words from "../../../../../../resources/words";
import Colors from "../../../../../../resources/colors";
import utils from "../../../../../../tools/utils";
import service from "../../../../../../services/financial/treasury/receive/collection-rejections-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
  handleError,
} from "../../../../../../tools/form-manager";
import SimpleDataTable from "../../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../../common/simple-data-page-header";
import CollectionRejectionModal from "./collection-rejection-modal";
import SearchModal from "./collection-rejections-search-modal";
import DetailsModal from "./collection-rejection-details-modal";
import { usePageContext } from "../../../../../contexts/page-context";
import DetailsButton from "../../../../../common/details-button";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "CollectionRejections",
    data: records,
    columns: [
      { label: Words.id, value: "CollectionRejectionID" },
      {
        label: Words.bank_account,
        value: "Title",
      },
      { label: Words.account_no, value: "AccountNo" },
      { label: Words.bank, value: "BankTitle" },
      { label: Words.branch_code, value: "BranchCode" },
      { label: Words.city, value: "CityTitle" },
      { label: Words.currency, value: "CurrencyTitle" },
      {
        label: Words.item_type,
        value: (record) =>
          record.ItemType === 1 ? Words.cheque : Words.demand,
      },
      {
        label: Words.collection_rejection_date,
        value: (record) => utils.slashDate(record.CollectionRejectionDate),
      },
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
    dataIndex: "CollectionRejectionID",
    sorter: getSorter("CollectionRejectionID"),
    render: (CollectionRejectionID) => (
      <Text>{utils.farsiNum(`${CollectionRejectionID}`)}</Text>
    ),
  },
  {
    title: Words.bank_account,
    width: 200,
    align: "center",
    dataIndex: "AccountName",
    sorter: getSorter("AccountName"),
    render: (AccountName) => (
      <Text style={{ color: Colors.cyan[6] }}>{AccountName}</Text>
    ),
  },
  {
    title: Words.bank,
    width: 120,
    align: "center",
    dataIndex: "BankTitle",
    sorter: getSorter("BankTitle"),
    render: (BankTitle) => (
      <Text style={{ color: Colors.blue[6] }}>{BankTitle}</Text>
    ),
  },
  {
    title: Words.collection_rejection_date,
    width: 150,
    align: "center",
    dataIndex: "CollectionRejectionDate",
    sorter: getSorter("CollectionRejectionDate"),
    render: (CollectionRejectionDate) => (
      <Text style={{ color: Colors.orange[6] }}>
        {utils.farsiNum(utils.slashDate(CollectionRejectionDate))}
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

const recordID = "CollectionRejectionID";

const CollectionRejectionsPage = ({ pageName }) => {
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
      default:
        break;
    }

    return collection;
  };

  const handleSaveCollectionRejectionItem = async (
    item_type,
    key_field,
    collection_rejection_item
  ) => {
    //--- specify collection

    const collection = getCollection(item_type);

    //--- calculate new price

    let diff_price = 0;

    if (collection_rejection_item[key_field] === 0) {
      diff_price = collection_rejection_item.Amount;
    } else {
      diff_price =
        collection_rejection_item.Amount -
        selectedObject[collection].find(
          (c) => c[key_field] === collection_rejection_item[key_field]
        ).Amount;
    }

    //---

    const saved_item = await service.saveItem(
      item_type,
      collection_rejection_item
    );
    const rec = { ...selectedObject };
    // update price
    rec.Price += diff_price;
    //------

    if (collection_rejection_item[key_field] === 0)
      rec[collection] = [...rec[collection], saved_item];
    else {
      const index = rec[collection].findIndex(
        (i) => i[key_field] === collection_rejection_item[key_field]
      );

      rec[collection][index] = saved_item;
    }

    setSelectedObject(rec);

    //------

    const collection_rejection_index = records.findIndex(
      (collection_rejection) =>
        collection_rejection.CollectionRejectionID ===
        collection_rejection_item.CollectionRejectionID
    );

    records[collection_rejection_index] = rec;

    //------

    setRecords([...records]);

    return saved_item;
  };

  const handleDeleteCollectionRejectionItem = async (
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
      rec.Price -= rec[collection].find((i) => i[key_field] === item_id).Amount;

      rec[collection] = rec[collection].filter((i) => i[key_field] !== item_id);

      setSelectedObject(rec);

      //------

      const collection_rejection_index = records.findIndex(
        (collection_rejection) =>
          collection_rejection.CollectionRejectionID ===
          rec.CollectionRejectionID
      );

      records[collection_rejection_index] = rec;

      setRecords([...records]);
    }
  };

  const handleApproveCollectionRejection = async () => {
    setProgress(true);

    try {
      const data = await service.approve(selectedObject.CollectionRejectionID);

      // Update selected object
      selectedObject.StatusID = 2; // Approve
      selectedObject.StatusTitle = Words.collection_rejection_status_2;
      setSelectedObject({ ...selectedObject });

      // Update records
      const collection_rejection_index = records.findIndex(
        (cr) =>
          cr.CollectionRejectionID === selectedObject.CollectionRejectionID
      );
      records[collection_rejection_index] = { ...selectedObject };
      setRecords([...records]);

      //---
      message.success(data.Message);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleRejecetCollectionRejection = async () => {
    setProgress(true);

    try {
      const data = await service.reject(selectedObject.CollectionRejectionID);

      // Update selected object
      selectedObject.StatusID = 3; // Reject
      selectedObject.StatusTitle = Words.collection_rejection_status_3;
      setSelectedObject({ ...selectedObject });

      // Update records
      const collection_rejection_index = records.findIndex(
        (cr) =>
          cr.CollectionRejectionID === selectedObject.CollectionRejectionID
      );
      records[collection_rejection_index] = { ...selectedObject };
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
      const data = await service.undoApprove(
        selectedObject.CollectionRejectionID
      );

      // Update selected object
      selectedObject.StatusID = 1; // In progress
      selectedObject.StatusTitle = Words.collection_rejection_status_1;
      setSelectedObject({ ...selectedObject });

      // Update records
      const collection_rejection_index = records.findIndex(
        (cr) =>
          cr.CollectionRejectionID === selectedObject.CollectionRejectionID
      );
      records[collection_rejection_index] = { ...selectedObject };
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
      const data = await service.submitVoucher(
        selectedObject.CollectionRejectionID
      );

      const { VoucherID, Message } = data;

      // Update selected object
      selectedObject.SubmittedVoucherID = VoucherID;
      setSelectedObject({ ...selectedObject });

      // Update records
      const collection_rejection_index = records.findIndex(
        (cr) =>
          cr.CollectionRejectionID === selectedObject.CollectionRejectionID
      );
      records[collection_rejection_index] = { ...selectedObject };
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
      const data = await service.deleteVoucher(
        selectedObject.CollectionRejectionID
      );

      // Update selected object
      selectedObject.SubmittedVoucherID = 0;
      setSelectedObject({ ...selectedObject });

      // Update records
      const collection_rejection_index = records.findIndex(
        (cr) =>
          cr.CollectionRejectionID === selectedObject.CollectionRejectionID
      );
      records[collection_rejection_index] = { ...selectedObject };
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
            title={Words.collection_rejection}
            sheets={getSheets(records)}
            fileName="CollectionRejections"
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
        <CollectionRejectionModal
          access={access}
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
          onSaveCollectionRejectionItem={handleSaveCollectionRejectionItem}
          onDeleteCollectionRejectionItem={handleDeleteCollectionRejectionItem}
          onReject={handleRejecetCollectionRejection}
          onApprove={handleApproveCollectionRejection}
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

export default CollectionRejectionsPage;
