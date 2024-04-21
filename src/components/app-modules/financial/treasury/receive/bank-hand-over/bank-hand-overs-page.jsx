import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, message } from "antd";
import Words from "../../../../../../resources/words";
import Colors from "../../../../../../resources/colors";
import utils from "../../../../../../tools/utils";
import service from "../../../../../../services/financial/treasury/receive/bank-hand-overs-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
  handleError,
} from "../../../../../../tools/form-manager";
import SimpleDataTable from "../../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../../common/simple-data-page-header";
import BankHandOverModal from "./bank-hand-over-modal";
import SearchModal from "./bank-hand-overs-search-modal";
import DetailsModal from "./bank-hand-over-details-modal";
import { usePageContext } from "../../../../../contexts/page-context";
import DetailsButton from "../../../../../common/details-button";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "BankHandOvers",
    data: records,
    columns: [
      { label: Words.id, value: "HandOverID" },
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
        label: Words.hand_over_date,
        value: (record) => utils.slashDate(record.HandOverDate),
      },
      { label: Words.financial_operation, value: "OperationTitle" },
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
    dataIndex: "HandOverID",
    sorter: getSorter("HandOverID"),
    render: (HandOverID) => <Text>{utils.farsiNum(`${HandOverID}`)}</Text>,
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
    title: Words.hand_over_date,
    width: 150,
    align: "center",
    dataIndex: "HandOverDate",
    sorter: getSorter("HandOverDate"),
    render: (HandOverDate) => (
      <Text style={{ color: Colors.orange[6] }}>
        {utils.farsiNum(utils.slashDate(HandOverDate))}
      </Text>
    ),
  },
  {
    title: Words.financial_operation,
    width: 200,
    align: "center",
    dataIndex: "OperationTitle",
    sorter: getSorter("OperationTitle"),
    render: (OperationTitle) => (
      <Text style={{ color: Colors.cyan[6] }}>
        {utils.farsiNum(OperationTitle)}
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

const recordID = "HandOverID";

const BankHandOversPage = ({ pageName }) => {
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

  const handleSaveBankHandOverItem = async (
    item_type,
    key_field,
    hand_over_item
  ) => {
    //--- specify collection

    const collection = getCollection(item_type);

    //--- calculate new price

    let diff_price = 0;

    if (hand_over_item[key_field] === 0) {
      diff_price = hand_over_item.Amount;
    } else {
      diff_price =
        hand_over_item.Amount -
        selectedObject[collection].find(
          (c) => c[key_field] === hand_over_item[key_field]
        ).Amount;
    }

    //---

    const saved_item = await service.saveItem(item_type, hand_over_item);

    const rec = { ...selectedObject };
    // update price
    rec.Price += diff_price;

    //------

    if (hand_over_item[key_field] === 0)
      rec[collection] = [...rec[collection], saved_item];
    else {
      const index = rec[collection].findIndex(
        (i) => i[key_field] === hand_over_item[key_field]
      );

      rec[collection][index] = saved_item;
    }

    setSelectedObject(rec);

    //------

    const hand_over_index = records.findIndex(
      (hand_over) => hand_over.HandOverID === hand_over_item.HandOverID
    );

    records[hand_over_index] = rec;

    //------

    setRecords([...records]);

    return saved_item;
  };

  const handleDeleteBankHandOverItem = async (
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

      setSelectedObject(rec);

      //------

      const hand_over_index = records.findIndex(
        (hand_over) => hand_over.HandOverID === rec.HandOverID
      );

      records[hand_over_index] = rec;

      setRecords([...records]);
    }
  };

  const handleApproveBankHandOver = async () => {
    setProgress(true);

    try {
      const data = await service.approve(selectedObject.HandOverID);

      // Update selected object
      selectedObject.StatusID = 2; // Approve
      selectedObject.StatusTitle = Words.hand_over_status_2;
      setSelectedObject({ ...selectedObject });

      // Update records
      const hand_over_index = records.findIndex(
        (ho) => ho.HandOverID === selectedObject.HandOverID
      );
      records[hand_over_index] = { ...selectedObject };
      setRecords([...records]);

      //---
      message.success(data.Message);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleRejecetBankHandOver = async () => {
    setProgress(true);

    try {
      const data = await service.rejectHandOver(selectedObject.HandOverID);

      // Update selected object
      selectedObject.StatusID = 3; // Reject
      selectedObject.StatusTitle = Words.hand_over_status_3;
      setSelectedObject({ ...selectedObject });

      // Update records
      const hand_over_index = records.findIndex(
        (ho) => ho.HandOverID === selectedObject.HandOverID
      );
      records[hand_over_index] = { ...selectedObject };
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
      const data = await service.undoApprove(selectedObject.HandOverID);

      // Update selected object
      selectedObject.StatusID = 1; // In progress
      selectedObject.StatusTitle = Words.hand_over_status_1;
      setSelectedObject({ ...selectedObject });

      // Update records
      const hand_over_index = records.findIndex(
        (ho) => ho.HandOverID === selectedObject.HandOverID
      );
      records[hand_over_index] = { ...selectedObject };
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
      const data = await service.submitVoucher(selectedObject.HandOverID);

      const { VoucherID, Message } = data;

      // Update selected object
      selectedObject.SubmittedVoucherID = VoucherID;
      setSelectedObject({ ...selectedObject });

      // Update records
      const hand_over_index = records.findIndex(
        (ho) => ho.HandOverID === selectedObject.HandOverID
      );
      records[hand_over_index] = { ...selectedObject };
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
      const data = await service.deleteVoucher(selectedObject.HandOverID);

      // Update selected object
      selectedObject.SubmittedVoucherID = 0;
      setSelectedObject({ ...selectedObject });

      // Update records
      const hand_over_index = records.findIndex(
        (ho) => ho.HandOverID === selectedObject.HandOverID
      );
      records[hand_over_index] = { ...selectedObject };
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
            title={Words.bank_hand_overs}
            sheets={getSheets(records)}
            fileName="BankHandOvers"
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
        <BankHandOverModal
          access={access}
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
          onSaveBankHandOverItem={handleSaveBankHandOverItem}
          onDeleteBankHandOverItem={handleDeleteBankHandOverItem}
          onReject={handleRejecetBankHandOver}
          onApprove={handleApproveBankHandOver}
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

export default BankHandOversPage;
