import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import {
  AiFillLock as LockIcon,
  AiOutlineCheck as CheckIcon,
} from "react-icons/ai";
import Words from "../../../../resources/words";
import utils from "../../../../tools/utils";
import service from "../../../../services/official/tasks/top-supervisors-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import TopSupervisorModal from "./user-top-supervisor-modal";
import { usePageContext } from "../../../contexts/page-context";
import Colors from "./../../../../resources/colors";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "TopSupervisors",
    data: records,
    columns: [
      { label: Words.id, value: "TopSupervisorID" },
      { label: Words.first_name, value: "FirstName" },
      { label: Words.last_name, value: "LastName" },
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
    width: 100,
    align: "center",
    dataIndex: "TopSupervisorID",
    sorter: getSorter("TopSupervisorID"),
    render: (TopSupervisorID) => (
      <Text>{utils.farsiNum(`${TopSupervisorID}`)}</Text>
    ),
  },
  {
    title: Words.first_name,
    width: 150,
    align: "center",
    dataIndex: "FirstName",
    sorter: getSorter("FirstName"),
    render: (FirstName) => (
      <Text style={{ color: Colors.blue[6] }}>{FirstName}</Text>
    ),
  },
  {
    title: Words.last_name,
    width: 150,
    align: "center",
    dataIndex: "LastName",
    sorter: getSorter("LastName"),
    render: (LastName) => (
      <Text style={{ color: Colors.blue[6] }}>{LastName}</Text>
    ),
  },
  {
    title: Words.status,
    width: 75,
    align: "center",
    sorter: getSorter("IsActive"),
    render: (record) =>
      record.IsActive ? (
        <CheckIcon style={{ color: Colors.green[6] }} />
      ) : (
        <LockIcon style={{ color: Colors.red[6] }} />
      ),
  },
];

const recordID = "TopSupervisorID";

const UserTopSupervisorsPage = ({ pageName }) => {
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
    showModal,
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

  const columns = access
    ? getColumns(baseColumns, null, access, handleEdit, handleDelete)
    : [];

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.top_supervisors}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="TopSupervisors"
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
        <TopSupervisorModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}
    </>
  );
};

export default UserTopSupervisorsPage;
