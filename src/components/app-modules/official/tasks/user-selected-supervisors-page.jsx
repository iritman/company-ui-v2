import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import Words from "../../../../resources/words";
import utils from "../../../../tools/utils";
import service from "../../../../services/official/tasks/selected-supervisors-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import SelectedSupervisorModal from "./user-selected-supervisor-modal";
import { usePageContext } from "../../../contexts/page-context";
import Colors from "./../../../../resources/colors";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "SelectedSupervisors",
    data: records,
    columns: [
      { label: Words.id, value: "SSID" },
      { label: Words.first_name, value: "FirstName" },
      { label: Words.last_name, value: "LastName" },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 100,
    align: "center",
    dataIndex: "SSID",
    sorter: getSorter("SSID"),
    render: (SSID) => <Text>{utils.farsiNum(`${SSID}`)}</Text>,
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
];

const recordID = "SSID";

const UserSelectedSupervisorsPage = ({ pageName }) => {
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
    handleDelete,
    handleSave,
    handleResetContext,
  } = GetSimplaDataPageMethods({
    service,
    recordID,
  });

  const columns = access
    ? getColumns(baseColumns, null, access, null, handleDelete)
    : [];

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.selected_supervisors}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="SelectedSupervisors"
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
        <SelectedSupervisorModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}
    </>
  );
};

export default UserSelectedSupervisorsPage;
