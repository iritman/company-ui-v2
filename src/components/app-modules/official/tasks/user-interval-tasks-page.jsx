import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import Words from "../../../../resources/words";
import utils from "../../../../tools/utils";
import service from "../../../../services/official/tasks/interval-tasks-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import IntervalTaskModal from "./user-interval-task-modal";
import { usePageContext } from "../../../contexts/page-context";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "IntervalTasks",
    data: records,
    columns: [
      { label: Words.id, value: "IntervalID" },
      { label: Words.title, value: "Title" },
      { label: Words.descriptions, value: "DetailsText" },
      {
        label: Words.response_member,
        value: (record) =>
          `${record.ResponseFirstName} ${record.ResponseLastName}`,
      },
      { label: Words.interval_type, value: "IntervalTypeTitle" },
      {
        label: Words.start_date,
        value: (record) => utils.slashDate(record.StartDate),
      },
      {
        label: Words.start_time,
        value: (record) => utils.colonTime(record.StartTime),
      },
      {
        label: Words.finish_date,
        value: (record) => utils.slashDate(record.FinishDate),
      },
      {
        label: Words.finish_time,
        value: (record) => utils.colonTime(record.FinishTime),
      },
      {
        label: Words.reg_date,
        value: (record) => utils.slashDate(record.RegDate),
      },
      {
        label: Words.reg_time,
        value: (record) => utils.colonTime(record.RegTime),
      },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 100,
    align: "center",
    dataIndex: "IntervalID",
    sorter: getSorter("IntervalID"),
    render: (IntervalID) => <Text>{utils.farsiNum(`${IntervalID}`)}</Text>,
  },
  {
    title: Words.title,
    width: 200,
    align: "center",
    dataIndex: "Title",
    sorter: getSorter("Title"),
    render: (Title) => <Text>{utils.farsiNum(Title)}</Text>,
  },
  {
    title: Words.interval_type,
    width: 120,
    align: "center",
    dataIndex: "IntervalTypeTitle",
    sorter: getSorter("IntervalTypeTitle"),
    render: (IntervalTypeTitle) => <Text>{IntervalTypeTitle}</Text>,
  },
];

const recordID = "IntervalID";

const UserIntervalTasksPage = ({ pageName }) => {
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
            title={Words.interval_tasks}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="IntervalTasks"
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
        <IntervalTaskModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}
    </>
  );
};

export default UserIntervalTasksPage;
