import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import Words from "../../../../resources/words";
import utils from "../../../../tools/utils";
import service from "../../../../services/settings/timex/department-extra-work-capacities-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import { usePageContext } from "../../../contexts/page-context";
import Colors from "../../../../resources/colors";
import DepartmentExtraWorkCapacityModal from "./department-extra-work-capacity-modal";
import DepartmentExtraWorkSearchModal from "./department-extra-work-capacity-search-modal";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "DepartmentExtraWorkCapaticies",
    data: records,
    columns: [
      { label: Words.id, value: "CapacityID" },
      { label: Words.title, value: "DepartmentTitle" },
      { label: Words.year, value: "Year" },
      {
        label: Words.capacity_in_hours,
        value: (record) => record.CapacityInHours,
      },
      {
        label: Words.used,
        value: (record) =>
          record.UsedCapacityInMin > 0
            ? utils.minToTime(record.UsedCapacityInMin)
            : "-",
      },
      {
        label: Words.remain,
        value: (record) =>
          record.RemainCapacityInMin !== 0
            ? `${record.UsedCapacityInMin < 0 ? "-" : ""}${utils.minToTime(
                record.UsedCapacityInMin
              )}`
            : "-",
      },
      {
        label: Words.reg_member,
        value: (record) => `${record.RegFirstName} ${record.RegLastName}`,
      },
      {
        label: Words.reg_date,
        value: (record) => `${utils.slashDate(record.RegDate)}`,
      },
      {
        label: Words.reg_time,
        value: (record) => `${utils.colonTime(record.RegTime)}`,
      },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 100,
    align: "center",
    dataIndex: "CapacityID",
    sorter: getSorter("CapacityID"),
    render: (CapacityID) => <Text>{utils.farsiNum(`${CapacityID}`)}</Text>,
  },
  {
    title: Words.year,
    width: 100,
    align: "center",
    dataIndex: "Year",
    sorter: getSorter("Year"),
    render: (Year) => (
      <Text style={{ color: Colors.red[7] }}>{utils.farsiNum(`${Year}`)}</Text>
    ),
  },
  {
    title: Words.department,
    width: 200,
    align: "center",
    dataIndex: "DepartmentTitle",
    sorter: getSorter("DepartmentTitle"),
    render: (DepartmentTitle) => (
      <Text style={{ color: Colors.cyan[6] }}>{DepartmentTitle}</Text>
    ),
  },
  {
    title: Words.capacity_in_hours,
    width: 100,
    align: "center",
    dataIndex: "CapacityInHours",
    sorter: getSorter("CapacityInHours"),
    render: (CapacityInHours) => (
      <Text style={{ color: Colors.blue[7] }}>
        {utils.farsiNum(`${CapacityInHours}`)}
      </Text>
    ),
  },
  {
    title: Words.used,
    width: 100,
    align: "center",
    dataIndex: "UsedCapacityInMin",
    sorter: getSorter("UsedCapacityInMin"),
    render: (UsedCapacityInMin) => (
      <Text style={{ color: Colors.red[6] }}>
        {UsedCapacityInMin > 0
          ? utils.farsiNum(utils.minToTime(`${UsedCapacityInMin}`))
          : "-"}
      </Text>
    ),
  },
  {
    title: Words.remain,
    width: 100,
    align: "center",
    dataIndex: "RemainCapacityInMin",
    sorter: getSorter("RemainCapacityInMin"),
    render: (RemainCapacityInMin) => (
      <Text
        style={{
          color: RemainCapacityInMin > 0 ? Colors.green[6] : Colors.red[7],
        }}
      >
        {RemainCapacityInMin !== 0
          ? `${utils.farsiNum(
              utils.minToTime(`${Math.abs(RemainCapacityInMin)}`)
            )}${RemainCapacityInMin < 0 ? "-" : ""}`
          : "-"}
      </Text>
    ),
  },
];

const recordID = "CapacityID";

const DepartmentExtraWorkCapacitiesPage = ({ pageName }) => {
  const {
    progress,
    searched,
    setSearched,
    searchText,
    setSearchText,
    records,
    setRecords,
    access,
    setAccess,
    selectedObject,
    showModal,
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
    handleAdvancedSearch,
  } = GetSimplaDataPageMethods({
    service,
    recordID,
  });

  const columns = access
    ? getColumns(baseColumns, null, access, handleEdit, handleDelete)
    : [];

  const handleClear = () => {
    setRecords([]);
    setFilter(null);
    setSearched(false);
  };

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.department_extra_work_capacities}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="DepartmentExtraWorkCapacities"
            onSearchTextChanged={(e) => setSearchText(e.target.value)}
            onSearch={() => setShowSearchModal(true)}
            onClear={handleClear}
            onGetAll={null}
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
        <DepartmentExtraWorkCapacityModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}

      {showSearchModal && (
        <DepartmentExtraWorkSearchModal
          onOk={handleAdvancedSearch}
          onCancel={() => setShowSearchModal(false)}
          isOpen={showSearchModal}
          filter={filter}
        />
      )}
    </>
  );
};

export default DepartmentExtraWorkCapacitiesPage;
