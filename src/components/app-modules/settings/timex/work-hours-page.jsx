import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import Words from "../../../../resources/words";
import utils from "../../../../tools/utils";
import service from "../../../../services/settings/timex/work-hours-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import WorkHourModal from "./work-hour-modal";
import { usePageContext } from "../../../contexts/page-context";
import Colors from "../../../../resources/colors";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "WorkHours",
    data: records,
    columns: [
      { label: Words.id, value: "HourID" },
      { label: Words.work_hour_code, value: "HourCode" },
      {
        label: Words.start_time,
        value: (record) => utils.farsiNum(utils.colonTime(record.StartTime)),
      },
      {
        label: Words.finish_time,
        value: (record) => utils.farsiNum(utils.colonTime(record.FinishTime)),
      },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 75,
    align: "center",
    dataIndex: "HourID",
    sorter: getSorter("HourID"),
    render: (HourID) => <Text>{utils.farsiNum(`${HourID}`)}</Text>,
  },
  {
    title: Words.work_hour_code,
    width: 150,
    align: "center",
    dataIndex: "HourCode",
    sorter: getSorter("HourCode"),
    render: (HourCode) => (
      <Text style={{ color: Colors.blue[7] }}>{HourCode}</Text>
    ),
  },
  {
    title: Words.start_time,
    width: 100,
    align: "center",
    dataIndex: "StartTime",
    sorter: getSorter("StartTime"),
    render: (StartTime) => (
      <Text style={{ color: Colors.green[7] }}>
        {utils.farsiNum(utils.colonTime(StartTime))}
      </Text>
    ),
  },
  {
    title: Words.finish_time,
    width: 100,
    align: "center",
    dataIndex: "FinishTime",
    sorter: getSorter("FinishTime"),
    render: (FinishTime) => (
      <Text style={{ color: Colors.green[7] }}>
        {utils.farsiNum(utils.colonTime(FinishTime))}
      </Text>
    ),
  },
];

const recordID = "HourID";

const WorkHoursPage = ({ pageName }) => {
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
            title={Words.work_hours}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="WorkHours"
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
        <WorkHourModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}
    </>
  );
};

export default WorkHoursPage;
