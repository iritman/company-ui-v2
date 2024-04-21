import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import Words from "../../../../resources/words";
import utils from "../../../../tools/utils";
import service from "../../../../services/settings/timex/vacation-cardex-settings-service";
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
import VacationCardexSettingModal from "./vacation-cardex-setting-modal";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "VacationCardexSettings",
    data: records,
    columns: [
      { label: Words.id, value: "SettingID" },
      { label: Words.year, value: "CardexYear" },
      {
        label: Words.total_valid_personal_vacation,
        value: (record) =>
          utils.minToTime(record.TotalValidPersonalVacationInMin),
      },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 100,
    align: "center",
    dataIndex: "SettingID",
    sorter: getSorter("SettingID"),
    render: (SettingID) => <Text>{utils.farsiNum(`${SettingID}`)}</Text>,
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
    title: Words.total_valid_personal_vacation,
    width: 100,
    align: "center",
    dataIndex: "TotalValidPersonalVacationInMin",
    sorter: getSorter("TotalValidPersonalVacationInMin"),
    render: (TotalValidPersonalVacationInMin) => (
      <Text style={{ color: Colors.blue[7] }}>
        {utils.farsiNum(utils.minToTime(`${TotalValidPersonalVacationInMin}`))}
      </Text>
    ),
  },
];

const recordID = "SettingID";

const DepartmentExtraWorkCapacitiesPage = ({ pageName }) => {
  const {
    progress,
    searched,
    setSearched,
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
    handleGetAll,
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

  const columns = access
    ? getColumns(baseColumns, null, access, handleEdit, handleDelete)
    : [];

  const handleClear = () => {
    setRecords([]);
    setSearched(false);
  };

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.vacation_cardex_settings}
            sheets={getSheets(records)}
            fileName="VacationCardexSettings"
            onSearchTextChanged={(e) => setSearchText(e.target.value)}
            onSearch={null}
            onClear={handleClear}
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
        <VacationCardexSettingModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}
    </>
  );
};

export default DepartmentExtraWorkCapacitiesPage;
