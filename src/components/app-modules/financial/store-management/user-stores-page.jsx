import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Button } from "antd";
import { InfoCircleOutlined as InfoIcon } from "@ant-design/icons";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import service from "../../../../services/financial/store-mgr/user-stores-service";
import {
  AiFillLock as LockIcon,
  AiOutlineCheck as CheckIcon,
} from "react-icons/ai";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import StoreDetailsModal from "./user-store-details-modal";
import StoreModal from "./user-store-modal";
import { usePageContext } from "../../../contexts/page-context";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "Stores",
    data: records,
    columns: [
      { label: Words.id, value: "StoreID" },
      { label: Words.storage_center, value: "StorageCenterTitle" },
      { label: Words.title, value: "Title" },
      {
        label: Words.store_manager,
        value: (record) =>
          `${record.ManagerFirstName} ${record.ManagerLastName}`,
      },
      { label: Words.tafsil_id, value: "TafsilID" },
      {
        label: Words.tafsil_title,
        value: "TafsilTitle",
      },
      {
        label: Words.tafsil_code,
        value: "TafsilCode",
      },
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
    dataIndex: "StoreID",
    sorter: getSorter("StoreID"),
    render: (StoreID) => <Text>{utils.farsiNum(`${StoreID}`)}</Text>,
  },
  {
    title: Words.title,
    width: 200,
    align: "right",
    dataIndex: "Title",
    sorter: getSorter("Title"),
    render: (Title) => <Text style={{ color: Colors.blue[7] }}>{Title}</Text>,
  },
  {
    title: Words.storage_center,
    width: 200,
    align: "center",
    dataIndex: "StorageCenterTitle",
    sorter: getSorter("StorageCenterTitle"),
    render: (StorageCenterTitle) => (
      <Text style={{ color: Colors.orange[7] }}>{StorageCenterTitle}</Text>
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

const recordID = "StoreID";

const UserStoresPage = ({ pageName }) => {
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
            title={Words.stores}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="Stores"
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
        <StoreModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}

      {showDetails && (
        <StoreDetailsModal
          onOk={() => {
            setShowDetails(false);
            setSelectedObject(null);
          }}
          isOpen={showDetails}
          store={selectedObject}
        />
      )}
    </>
  );
};

export default UserStoresPage;
