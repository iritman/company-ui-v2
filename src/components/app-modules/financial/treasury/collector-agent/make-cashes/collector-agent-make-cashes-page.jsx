import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, message } from "antd";
import Words from "../../../../../../resources/words";
import Colors from "../../../../../../resources/colors";
import utils from "../../../../../../tools/utils";
import service from "../../../../../../services/financial/treasury/collector-agent/collector-agent-make-cashes-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
  handleError,
} from "../../../../../../tools/form-manager";
import SimpleDataTable from "../../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../../common/simple-data-page-header";
import CollectorAgentMakeCashModal from "./collector-agent-make-cash-modal";
import SearchModal from "./collector-agent-make-cashes-search-modal";
import DetailsModal from "./collector-agent-make-cash-details-modal";
import { usePageContext } from "../../../../../contexts/page-context";
import DetailsButton from "../../../../../common/details-button";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "CollectorAgentMakeCashes",
    data: records,
    columns: [
      { label: Words.id, value: "OperationID" },
      {
        label: Words.collector_agent,
        value: "AgentTitle",
      },
      {
        label: Words.date,
        value: (record) => utils.slashDate(record.OperationDate),
      },
      { label: Words.sub_no, value: (record) => utils.farsiNum(record.SubNo) },
      { label: Words.price, value: "Price" },
      { label: Words.receive_receipt_id, value: "ReceiveID" },
      { label: Words.receive_receipt_status, value: "ReceiveStatusTitle" },
      { label: Words.standard_descriptions, value: "StandardDetailsText" },
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
    dataIndex: "OperationID",
    sorter: getSorter("OperationID"),
    render: (OperationID) => <Text>{utils.farsiNum(`${OperationID}`)}</Text>,
  },

  {
    title: Words.collector_agent,
    width: 200,
    align: "center",
    dataIndex: "AgentTitle",
    sorter: getSorter("AgentTitle"),
    render: (AgentTitle) => (
      <Text style={{ color: Colors.blue[6] }}>
        {utils.farsiNum(AgentTitle)}
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
    title: Words.date,
    width: 150,
    align: "center",
    dataIndex: "OperationDate",
    sorter: getSorter("OperationDate"),
    render: (OperationDate) => (
      <Text style={{ color: Colors.orange[6] }}>
        {utils.farsiNum(utils.slashDate(OperationDate))}
      </Text>
    ),
  },
  {
    title: Words.receive_receipt_status,
    width: 150,
    align: "center",
    sorter: getSorter("ReceiveStatusTitle"),
    render: (record) => (
      <Text
        style={{
          color:
            record.ReceiveStatusID <= 1
              ? Colors.grey[6]
              : record.StatusID === 2
              ? Colors.green[6]
              : Colors.red[6],
        }}
      >
        {record.ReceiveStatusID > 0
          ? record.ReceiveStatusTitle
          : Words.not_issued}
      </Text>
    ),
  },
];

const recordID = "OperationID";

const CollectorAgentMakeCashesPage = ({ pageName }) => {
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
        (row) => row.ReceiveStatusID <= 1, // can edit func
        (row) => row.ReceiveStatusID <= 1 // can delete func
      )
    : [];

  const handleClear = () => {
    setRecords([]);
    setFilter(null);
    setSearched(false);
  };

  const handleSaveCheque = async (cheque_item) => {
    //--- calculate new price

    let diff_price = 0;

    if (cheque_item.ItemID === 0) {
      diff_price = cheque_item.Amount;
    } else {
      const prior_cheque_amount = cheque_item.PriorCheque?.Amount;

      diff_price = cheque_item.Amount - prior_cheque_amount;
    }

    //---

    const { ItemID, OperationID, ChequeID } = cheque_item;
    const saved_item = await service.saveItem({
      ItemID,
      OperationID,
      ChequeID,
    });

    const rec = { ...selectedObject };
    // update price
    rec.Price += diff_price;

    //------

    if (cheque_item.ItemID === 0) rec.Cheques = [...rec.Cheques, saved_item];
    else {
      const index = rec.Cheques.findIndex(
        (i) => i.ChequeID === cheque_item.ChequeID
      );

      rec.Cheques[index] = saved_item;
    }

    setSelectedObject(rec);

    //------

    const operation_index = records.findIndex(
      (op) => op.OperationID === cheque_item.OperationID
    );

    records[operation_index] = rec;

    //------

    setRecords([...records]);

    return saved_item;
  };

  const handleDeleteCheque = async (item_id) => {
    await service.deleteItem(item_id);

    if (selectedObject) {
      const rec = { ...selectedObject };
      rec.Price -= rec.Cheques.find((c) => c.ItemID === item_id).Amount;

      rec.Cheques = rec.Cheques.filter((i) => i.ItemID !== item_id);

      setSelectedObject(rec);

      //------

      const operation_index = records.findIndex(
        (op) => op.OperationID === rec.OperationID
      );

      records[operation_index] = rec;

      setRecords([...records]);
    }
  };

  const handleSubmitReceiveReceipt = async () => {
    setProgress(true);

    try {
      const data = await service.submitReceiveReceipt(
        selectedObject.OperationID
      );

      const { ReceiveID, Message } = data;

      // Update selected object
      selectedObject.ReceiveID = ReceiveID;
      selectedObject.ReceiveStatusID = 1;
      selectedObject.ReceiveStatusTitle = Words.receive_receipt_status_1;
      setSelectedObject({ ...selectedObject });

      // Update records
      const operation_index = records.findIndex(
        (op) => op.OperationID === selectedObject.OperationID
      );
      records[operation_index] = { ...selectedObject };
      setRecords([...records]);

      //---
      message.success(Message);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  /*

  const handleApprove = async () => {
    setProgress(true);

    try {
      const data = await service.approve(selectedObject.OperationID);

      // Update selected object
      selectedObject.StatusID = 2; // Approve
      selectedObject.StatusTitle = Words.transfer_to_collector_agent_status_2;
      setSelectedObject({ ...selectedObject });

      // Update records
      const operation_index = records.findIndex(
        (op) => op.OperationID === selectedObject.OperationID
      );
      records[operation_index] = { ...selectedObject };
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
      const data = await service.reject(selectedObject.OperationID);

      // Update selected object
      selectedObject.StatusID = 3; // Reject
      selectedObject.StatusTitle = Words.transfer_to_collector_agent_status_3;
      setSelectedObject({ ...selectedObject });

      // Update records
      const operation_index = records.findIndex(
        (op) => op.OperationID === selectedObject.OperationID
      );
      records[operation_index] = { ...selectedObject };
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
      const data = await service.undoApprove(selectedObject.OperationID);

      // Update selected object
      selectedObject.StatusID = 1; // In progress
      selectedObject.StatusTitle = Words.transfer_to_collector_agent_status_1;
      setSelectedObject({ ...selectedObject });

      // Update records
      const operation_index = records.findIndex(
        (op) => op.OperationID === selectedObject.OperationID
      );
      records[operation_index] = { ...selectedObject };
      setRecords([...records]);

      //---
      message.success(data.Message);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

   */

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.collector_agent_make_cashes}
            sheets={getSheets(records)}
            fileName="CollectorAgentMakeCashes"
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
        <CollectorAgentMakeCashModal
          access={access}
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
          onSaveCheque={handleSaveCheque}
          onDeleteCheque={handleDeleteCheque}
          onSubmitReceiveReceipt={handleSubmitReceiveReceipt}
          //   onReject={handleReject}
          //   onApprove={handleApprove}
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
          //   onUndoApprove={handleUndoApprove}
          onSubmitReceiveReceipt={handleSubmitReceiveReceipt}
        />
      )}
    </>
  );
};

export default CollectorAgentMakeCashesPage;
