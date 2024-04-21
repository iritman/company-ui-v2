import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import Words from "../../../../resources/words";
import utils from "./../../../../tools/utils";
import service from "./../../../../services/settings/timex/extra-work-command-sources-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import ExtraWorkCommandSourceModal from "./extra-work-command-source-modal";
import { usePageContext } from "./../../../contexts/page-context";
import Colors from "../../../../resources/colors";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "ExtraWorkCommandSources",
    data: records,
    columns: [
      { label: Words.id, value: "SourceID" },
      { label: Words.title, value: "Title" },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 100,
    align: "center",
    dataIndex: "SourceID",
    sorter: getSorter("SourceID"),
    render: (SourceID) => <Text>{utils.farsiNum(`${SourceID}`)}</Text>,
  },
  {
    title: Words.title,
    width: 200,
    align: "center",
    dataIndex: "Title",
    sorter: getSorter("Title"),
    render: (Title) => (
      <Text style={{ color: Colors.blue[7] }}>{utils.farsiNum(Title)}</Text>
    ),
  },
];

const recordID = "SourceID";

const ExtraWorkCommandSourcesPage = ({ pageName }) => {
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
            title={Words.extra_work_command_sources}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="ExtraWorkCommandSources"
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
        <ExtraWorkCommandSourceModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}
    </>
  );
};

export default ExtraWorkCommandSourcesPage;
