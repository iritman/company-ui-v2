import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, message } from "antd";
import Words from "../../../../../../resources/words";
import Colors from "../../../../../../resources/colors";
import utils from "../../../../../../tools/utils";
import service from "../../../../../../services/financial/treasury/collector-agent/transfer-to-collector-agents-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
  handleError,
} from "../../../../../../tools/form-manager";
import SimpleDataTable from "../../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../../common/simple-data-page-header";
import TransferToCollectorAgentModal from "./transfer-to-collector-agent-modal";
import SearchModal from "./transfer-to-collector-agents-search-modal";
import DetailsModal from "./transfer-to-collector-agent-details-modal";
import { usePageContext } from "../../../../../contexts/page-context";
import DetailsButton from "../../../../../common/details-button";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "TransferToCollectorAgents",
    data: records,
    columns: [
      { label: Words.id, value: "TransferID" },
      {
        label: Words.collector_agent,
        value: "AgentTitle",
      },
      {
        label: Words.transfer_to_collector_agent_date,
        value: (record) => utils.slashDate(record.TransferDate),
      },
      { label: Words.sub_no, value: (record) => utils.farsiNum(record.SubNo) },
      { label: Words.price, value: "Price" },
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
    dataIndex: "TransferID",
    sorter: getSorter("TransferID"),
    render: (TransferID) => <Text>{utils.farsiNum(`${TransferID}`)}</Text>,
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
    title: Words.transfer_to_collector_agent_date,
    width: 150,
    align: "center",
    dataIndex: "TransferDate",
    sorter: getSorter("TransferDate"),
    render: (TransferDate) => (
      <Text style={{ color: Colors.orange[6] }}>
        {utils.farsiNum(utils.slashDate(TransferDate))}
      </Text>
    ),
  },
  {
    title: Words.status,
    width: 150,
    align: "center",
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

const recordID = "TransferID";

const TransferToCollectorAgentsPage = ({ pageName }) => {
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

  const handleSaveCheque = async (cheque_item) => {
    //--- calculate new price

    let diff_price = 0;

    if (cheque_item.ItemID === 0) {
      diff_price = cheque_item.Amount;
    } else {
      diff_price =
        cheque_item.Amount -
        selectedObject.Cheques.find((c) => c.ChequeID === cheque_item.ChequeID)
          .Amount;
    }

    //---

    const saved_item = await service.saveItem(cheque_item);

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

    const transfer_index = records.findIndex(
      (transfer) => transfer.TransferID === cheque_item.TransferID
    );

    records[transfer_index] = rec;

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

      const transfer_index = records.findIndex(
        (t) => t.TransferID === rec.TransferID
      );

      records[transfer_index] = rec;

      setRecords([...records]);
    }
  };

  const handleApproveTransfer = async () => {
    setProgress(true);

    try {
      const data = await service.approve(selectedObject.TransferID);

      // Update selected object
      selectedObject.StatusID = 2; // Approve
      selectedObject.StatusTitle = Words.transfer_to_collector_agent_status_2;
      setSelectedObject({ ...selectedObject });

      // Update records
      const transfer_index = records.findIndex(
        (transfer) => transfer.TransferID === selectedObject.TransferID
      );
      records[transfer_index] = { ...selectedObject };
      setRecords([...records]);

      //---
      message.success(data.Message);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleRejectTransfer = async () => {
    setProgress(true);

    try {
      const data = await service.reject(selectedObject.TransferID);

      // Update selected object
      selectedObject.StatusID = 3; // Reject
      selectedObject.StatusTitle = Words.transfer_to_collector_agent_status_3;
      setSelectedObject({ ...selectedObject });

      // Update records
      const transfer_index = records.findIndex(
        (t) => t.TransferID === selectedObject.TransferID
      );
      records[transfer_index] = { ...selectedObject };
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
      const data = await service.undoApprove(selectedObject.TransferID);

      // Update selected object
      selectedObject.StatusID = 1; // In progress
      selectedObject.StatusTitle = Words.transfer_to_collector_agent_status_1;
      setSelectedObject({ ...selectedObject });

      // Update records
      const transfer_index = records.findIndex(
        (t) => t.TransferID === selectedObject.TransferID
      );
      records[transfer_index] = { ...selectedObject };
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
            title={Words.transfer_to_collector_agents}
            sheets={getSheets(records)}
            fileName="TransferToCollectorAgents"
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
        <TransferToCollectorAgentModal
          access={access}
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
          onSaveCheque={handleSaveCheque}
          onDeleteCheque={handleDeleteCheque}
          onReject={handleRejectTransfer}
          onApprove={handleApproveTransfer}
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

export default TransferToCollectorAgentsPage;
