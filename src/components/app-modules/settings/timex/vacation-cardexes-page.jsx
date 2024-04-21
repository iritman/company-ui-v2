import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import Words from "../../../../resources/words";
import utils from "./../../../../tools/utils";
import service from "./../../../../services/settings/timex/vacation-cardexes-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import { usePageContext } from "./../../../contexts/page-context";
import Colors from "../../../../resources/colors";
import VacationCardexModal from "./vacation-cardex-modal";
import SearchModal from "./vacation-cardexes-search-modal";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "VacationCardexes",
    data: records,
    columns: [
      { label: Words.id, value: "CardexID" },
      { label: Words.member_id, value: "MemberID" },
      {
        label: Words.full_name,
        value: (record) => `${record.FirstName} ${record.LastName}`,
      },
      { label: Words.year, value: "CardexYear" },
      {
        label: Words.personal_vacation_capacity,
        value: (record) => utils.minToTime(record.CapacityInMin),
      },
      {
        label: Words.used_capacity,
        value: (record) => utils.minToTime(record.UsedVacationsInMin),
      },
      {
        label: Words.remain_capacity,
        value: (record) => utils.minToTime(record.RemainVacationInMin),
      },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 100,
    align: "center",
    dataIndex: "CardexID",
    sorter: getSorter("CardexID"),
    render: (CardexID) => <Text>{utils.farsiNum(`${CardexID}`)}</Text>,
  },
  {
    title: Words.full_name,
    width: 200,
    align: "center",
    sorter: getSorter("LastName"),
    render: (record) => (
      <Text
        style={{ color: Colors.blue[7] }}
      >{`${record.FirstName} ${record.LastName}`}</Text>
    ),
  },
  {
    title: Words.year,
    width: 100,
    align: "center",
    dataIndex: "CardexYear",
    sorter: getSorter("CardexYear"),
    render: (CardexYear) => (
      <Text style={{ color: Colors.red[7] }}>
        {utils.farsiNum(`${CardexYear}`)}
      </Text>
    ),
  },
  {
    title: Words.personal_vacation_capacity,
    width: 120,
    align: "center",
    dataIndex: "CapacityInMin",
    sorter: getSorter("CapacityInMin"),
    render: (CapacityInMin) => (
      <Text style={{ color: Colors.green[6] }}>
        {utils.farsiNum(`${utils.minToTime(CapacityInMin)}`)}
      </Text>
    ),
  },
  {
    title: Words.used_capacity,
    width: 120,
    align: "center",
    dataIndex: "UsedVacationsInMin",
    sorter: getSorter("UsedVacationsInMin"),
    render: (UsedVacationsInMin) => (
      <Text style={{ color: Colors.orange[7] }}>
        {utils.farsiNum(`${utils.minToTime(UsedVacationsInMin)}`)}
      </Text>
    ),
  },
  {
    title: Words.remain_capacity,
    width: 120,
    align: "center",
    dataIndex: "RemainVacationInMin",
    sorter: getSorter("RemainVacationInMin"),
    render: (RemainVacationInMin) => (
      <Text
        style={{
          color: RemainVacationInMin < 0 ? Colors.red[6] : Colors.purple[6],
        }}
      >
        {`${utils.farsiNum(
          `${utils.minToTime(Math.abs(RemainVacationInMin))}`
        )} ${RemainVacationInMin < 0 ? "-" : ""}`}
      </Text>
    ),
  },
];

const recordID = "CardexID";

const VacationCardexesPage = ({ pageName }) => {
  const {
    progress,
    searched,
    setSearched,
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
    handleAdvancedSearch,
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
            title={Words.vacation_cardexes}
            sheets={getSheets(records)}
            fileName="VacationCardexes"
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
        <VacationCardexModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}

      {showSearchModal && (
        <SearchModal
          onOk={handleAdvancedSearch}
          onCancel={() => setShowSearchModal(false)}
          isOpen={showSearchModal}
          filter={filter}
        />
      )}
    </>
  );
};

export default VacationCardexesPage;
