import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Button } from "antd";
import { InfoCircleOutlined as InfoIcon } from "@ant-design/icons";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "./../../../../tools/utils";
import service from "./../../../../services/settings/timex/no-alternative-employees-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import MemberProfileImage from "../../../common/member-profile-image";
import { usePageContext } from "./../../../contexts/page-context";
import NoAlternativeEmployeeModal from "./no-alternative-employee-modal";
import DetailsModal from "./no-alternative-employee-details-modal";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "NoAlternativeEmployees",
    data: records,
    columns: [
      { label: Words.id, value: "AlternativeID" },
      { label: Words.member_id, value: "MemberID" },
      { label: Words.first_name, value: "FirstName" },
      { label: Words.last_name, value: "LastName" },
      { label: Words.national_code, value: "NationalCode" },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 100,
    align: "center",
    dataIndex: "AlternativeID",
    sorter: getSorter("AlternativeID"),
    render: (AlternativeID) => (
      <Text>{utils.farsiNum(`${AlternativeID}`)}</Text>
    ),
  },
  {
    title: "",
    width: 75,
    align: "center",
    dataIndex: "PicFileName",
    render: (PicFileName) => <MemberProfileImage fileName={PicFileName} />,
  },
  {
    title: Words.full_name,
    width: 200,
    align: "center",
    sorter: getSorter("LastName"),
    render: (record) => (
      <Text
        style={{ color: Colors.blue[6] }}
      >{`${record.FirstName} ${record.LastName}`}</Text>
    ),
  },
];

const recordID = "AlternativeID";

const NoAlternativeEmployeesPage = ({ pageName }) => {
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
    // handleEdit,
    handleDelete,
    handleSave,
    handleResetContext,
  } = GetSimplaDataPageMethods({
    service,
    recordID,
  });

  const getOperationalButtons = (record) => {
    return (
      <Button
        type="link"
        icon={<InfoIcon style={{ color: Colors.green[6] }} />}
        onClick={() => {
          setSelectedObject(record);
          setShowDetails(true);
        }}
      />
    );
  };

  const columns = access
    ? getColumns(
        baseColumns,
        getOperationalButtons,
        access,
        // handleEdit,
        null,
        handleDelete
      )
    : [];

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.no_alternative_employees}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="NoAlternativeEmployees"
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
        <NoAlternativeEmployeeModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}

      {showDetails && (
        <DetailsModal
          onOk={() => {
            setShowDetails(false);
            setSelectedObject(null);
          }}
          isOpen={showDetails}
          selectedObject={selectedObject}
        />
      )}
    </>
  );
};

export default NoAlternativeEmployeesPage;
