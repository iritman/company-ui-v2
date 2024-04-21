import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Button } from "antd";
import Words from "../../../../resources/words";
import utils from "./../../../../tools/utils";
import service from "./../../../../services/settings/ceremony/client-types-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import ClientTypeModal from "./client-type-modal";
import ClientTypeDetailsModal from "./client-type-details-modal";
import { usePageContext } from "./../../../contexts/page-context";
import Colors from "../../../../resources/colors";
import { InfoCircleOutlined as InfoIcon } from "@ant-design/icons";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "ClientTypes",
    data: records,
    columns: [
      { label: Words.id, value: "ClientTypeID" },
      { label: Words.title, value: "ClientTypeTitle" },
      { label: Words.dishes, value: "Dishes" },
      { label: Words.foods, value: "Foods" },
      { label: Words.descriptions, value: "DetailsText" },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 100,
    align: "center",
    dataIndex: "ClientTypeID",
    sorter: getSorter("ClientTypeID"),
    render: (ClientTypeID) => <Text>{utils.farsiNum(`${ClientTypeID}`)}</Text>,
  },
  {
    title: Words.title,
    width: 200,
    align: "center",
    dataIndex: "ClientTypeTitle",
    sorter: getSorter("ClientTypeTitle"),
    render: (ClientTypeTitle) => (
      <Text style={{ color: Colors.blue[7] }}>
        {utils.farsiNum(ClientTypeTitle)}
      </Text>
    ),
  },
];

const recordID = "ClientTypeID";

const ClientTypesPage = ({ pageName }) => {
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
    handleEdit,
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
        handleEdit,
        handleDelete
      )
    : [];

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.client_types}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="ClientTypes"
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
        <ClientTypeModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}

      {showDetails && (
        <ClientTypeDetailsModal
          onOk={() => {
            setShowDetails(false);
            setSelectedObject(null);
          }}
          isOpen={showDetails}
          clientType={selectedObject}
        />
      )}
    </>
  );
};

export default ClientTypesPage;
