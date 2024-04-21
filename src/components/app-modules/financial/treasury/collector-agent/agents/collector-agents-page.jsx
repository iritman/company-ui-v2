import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import Words from "../../../../../../resources/words";
import Colors from "../../../../../../resources/colors";
import utils from "../../../../../../tools/utils";
import service from "../../../../../../services/financial/treasury/collector-agent/collector-agents-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../../../tools/form-manager";
import SimpleDataTable from "../../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../../common/simple-data-page-header";
import CollectorAgentModal from "./collector-agent-modal";
import DetailsModal from "./collector-agent-details-modal";
import { usePageContext } from "../../../../../contexts/page-context";
import DetailsButton from "../../../../../common/details-button";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "CollectorAgents",
    data: records,
    columns: [
      { label: Words.id, value: "CollectorAgentID" },
      { label: Words.tafsil_account, value: "TafsilAccountID" },
      { label: Words.tafsil_title, value: "TafsilAccountTitle" },
      { label: Words.tafsil_code, value: "TafsilCode" },
      { label: Words.tafsil_type, value: "TafsilTypeTitle" },
      { label: Words.allocated_ceiling, value: "AllocatedCeiling" },
      {
        label: Words.appointment_date,
        value: (record) => utils.slashDate(record.AppointmentDate),
      },
      {
        label: Words.status,
        value: (record) => (record.IsActive ? Words.active : Words.inactive),
      },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 75,
    align: "center",
    dataIndex: "CollectorAgentID",
    sorter: getSorter("CollectorAgentID"),
    render: (CollectorAgentID) => (
      <Text>{utils.farsiNum(`${CollectorAgentID}`)}</Text>
    ),
  },
  {
    title: Words.title,
    width: 200,
    align: "center",
    dataIndex: "TafsilAccountTitle",
    sorter: getSorter("TafsilAccountTitle"),
    render: (TafsilAccountTitle) => (
      <Text style={{ color: Colors.cyan[6] }}>
        {utils.farsiNum(TafsilAccountTitle)}
      </Text>
    ),
  },
  {
    title: Words.tafsil_code,
    width: 150,
    align: "center",
    dataIndex: "TafsilCode",
    sorter: getSorter("TafsilCode"),
    render: (TafsilCode) => (
      <Text style={{ color: Colors.blue[6] }}>
        {utils.farsiNum(TafsilCode)}
      </Text>
    ),
  },
  {
    title: Words.appointment_date,
    width: 150,
    align: "center",
    dataIndex: "AppointmentDate",
    sorter: getSorter("AppointmentDate"),
    render: (AppointmentDate) => (
      <Text style={{ color: Colors.orange[6] }}>
        {utils.farsiNum(utils.slashDate(AppointmentDate))}
      </Text>
    ),
  },
  {
    title: Words.allocated_ceiling,
    width: 150,
    align: "center",
    dataIndex: "AllocatedCeiling",
    sorter: getSorter("AllocatedCeiling"),
    render: (AllocatedCeiling) => (
      <Text style={{ color: Colors.purple[6] }}>
        {`${utils.farsiNum(utils.moneyNumber(AllocatedCeiling))} ${Words.ryal}`}
      </Text>
    ),
  },
];

const recordID = "CollectorAgentID";

const CollectorAgentsPage = ({ pageName }) => {
  const {
    progress,
    searched,
    searchText,
    setSearchText,
    records,
    setRecords,
    access,
    setAccess,
    selectedObject,
    setSelectedObject,
    showModal,
    showDetails,
    setShowDetails,
  } = usePageContext();

  useMount(async () => {
    handleResetContext();
    await checkAccess(setAccess, pageName);
  });

  const {
    handleCloseModal,
    handleGetAll,
    handleSearch,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSave,
    handleResetContext,
  } = GetSimplaDataPageMethods({
    service,
    recordID,
  });

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
        handleDelete
      )
    : [];

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.collector_agents}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="CollectorAgents"
            onSearchTextChanged={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            onClear={() => setRecords([])}
            onGetAll={handleGetAll}
            onAdd={access?.CanAdd && handleAdd}
          />

          <Col xs={24}>
            {searched && (
              <SimpleDataTable records={records} columns={columns} />
            )}
          </Col>
        </Row>
      </Spin>

      {showModal && (
        <CollectorAgentModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
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

export default CollectorAgentsPage;
