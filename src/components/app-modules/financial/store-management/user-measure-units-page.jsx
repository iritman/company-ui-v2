import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import {
  AiFillLock as LockIcon,
  AiOutlineCheck as CheckIcon,
} from "react-icons/ai";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import service from "../../../../services/financial/store-mgr/user-measure-units-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import MeasureUnitModal from "./user-measure-unit-modal";
import { usePageContext } from "../../../contexts/page-context";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "MeasureUnits",
    data: records,
    columns: [
      { label: Words.id, value: "MeasureUnitID" },
      { label: Words.measure_type, value: "MeasureTypeTitle" },
      { label: Words.title, value: "Title" },
      { label: Words.value_type, value: "ValueTypeTitle" },
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
    dataIndex: "MeasureUnitID",
    sorter: getSorter("MeasureUnitID"),
    render: (MeasureUnitID) => (
      <Text>{utils.farsiNum(`${MeasureUnitID}`)}</Text>
    ),
  },
  {
    title: Words.title,
    width: 150,
    align: "center",
    dataIndex: "Title",
    sorter: getSorter("Title"),
    render: (Title) => <Text style={{ color: Colors.blue[7] }}>{Title}</Text>,
  },
  {
    title: Words.measure_type,
    width: 150,
    align: "center",
    dataIndex: "MeasureTypeTitle",
    sorter: getSorter("MeasureTypeTitle"),
    render: (MeasureTypeTitle) => (
      <Text style={{ color: Colors.orange[7] }}>{MeasureTypeTitle}</Text>
    ),
  },
  {
    title: Words.value_type,
    width: 150,
    align: "center",
    dataIndex: "ValueTypeTitle",
    sorter: getSorter("ValueTypeTitle"),
    render: (ValueTypeTitle) => (
      <Text style={{ color: Colors.green[6] }}>{ValueTypeTitle}</Text>
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

const recordID = "MeasureUnitID";

const UserMeasureUnitsPage = ({ pageName }) => {
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
            title={Words.measure_units}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="MeasureUnits"
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
        <MeasureUnitModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}
    </>
  );
};

export default UserMeasureUnitsPage;
