import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, message } from "antd";
import {
  AiFillLock as LockIcon,
  AiOutlineCheck as CheckIcon,
} from "react-icons/ai";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import service from "../../../../services/financial/public-settings/cost-centers-service";
import tafsilAccountService from "../../../../services/financial/accounts/tafsil-accounts-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import DetailsModal from "./cost-center-details-modal";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import CostCenterModal from "./cost-center-modal";
import { usePageContext } from "../../../contexts/page-context";
import DetailsButton from "../../../common/details-button";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "CostCenters",
    data: records,
    columns: [
      { label: Words.id, value: "CostCenterID" },
      { label: Words.title, value: "Title" },
      { label: Words.cost_center_type, value: "CostCenterTypeTitle" },
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
    dataIndex: "CostCenterID",
    sorter: getSorter("CostCenterID"),
    render: (CostCenterID) => <Text>{utils.farsiNum(`${CostCenterID}`)}</Text>,
  },
  {
    title: Words.title,
    width: 200,
    align: "center",
    dataIndex: "Title",
    sorter: getSorter("Title"),
    render: (Title) => <Text style={{ color: Colors.blue[7] }}>{Title}</Text>,
  },
  {
    title: Words.cost_center_type,
    width: 150,
    align: "center",
    dataIndex: "CostCenterTypeTitle",
    sorter: getSorter("CostCenterTypeTitle"),
    render: (CostCenterTypeTitle) => (
      <Text style={{ color: Colors.orange[6] }}>{CostCenterTypeTitle}</Text>
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

const recordID = "CostCenterID";

const CostCentersPage = ({ pageName }) => {
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
      <DetailsButton
        record={record}
        setSelectedObject={setSelectedObject}
        setShowDetails={setShowDetails}
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

  const handleCreateTafsilAccount = async () => {
    if (selectedObject) {
      const data = await tafsilAccountService.createTafsilAccount(
        "CostCenters",
        "CostCenters",
        selectedObject.CostCenterID
      );

      const { TafsilInfo, Message } = data;

      message.success(Message);

      //------

      selectedObject.TafsilInfo = TafsilInfo;
      setSelectedObject({ ...selectedObject });

      const inx = records.findIndex(
        (r) => r.CostCenterID === selectedObject.CostCenterID
      );
      records[inx].TafsilInfo = TafsilInfo;
      setRecords([...records]);
    }
  };

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.cost_centers}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="CostCenters"
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
        <CostCenterModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
          onCreateTafsilAccount={handleCreateTafsilAccount}
        />
      )}

      {showDetails && (
        <DetailsModal
          isOpen={showDetails}
          selectedObject={selectedObject}
          onOk={() => {
            setShowDetails(false);
            setSelectedObject(null);
          }}
          onCreateTafsilAccount={handleCreateTafsilAccount}
        />
      )}
    </>
  );
};

export default CostCentersPage;
