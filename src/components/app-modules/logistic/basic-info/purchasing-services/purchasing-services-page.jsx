import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import Words from "../../../../../resources/words";
import utils from "../../../../../tools/utils";
import service from "../../../../../services/logistic/basic-info/purchasing-services-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../../tools/form-manager";
import SimpleDataTable from "../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../common/simple-data-page-header";
import { usePageContext } from "../../../../contexts/page-context";
import Colors from "../../../../../resources/colors";
import PurchasingServiceModal from "./purchasing-service-modal";
import DetailsModal from "./purchasing-service-details-modal";
import DetailsButton from "../../../../common/details-button";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "PurchasingServices",
    data: records,
    columns: [
      { label: Words.id, value: "ServiceID" },
      { label: Words.service_group, value: "ServiceGroupTitle" },
      { label: Words.measure_unit, value: "MeasureUnitTitle" },
      { label: Words.measure_type, value: "MeasureTypeTitle" },
      { label: Words.title, value: "Title" },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 100,
    align: "center",
    dataIndex: "ServiceID",
    sorter: getSorter("ServiceID"),
    render: (ServiceID) => <Text>{utils.farsiNum(`${ServiceID}`)}</Text>,
  },
  {
    title: Words.service_group,
    width: 150,
    align: "center",
    dataIndex: "ServiceGroupTitle",
    sorter: getSorter("ServiceGroupTitle"),
    render: (ServiceGroupTitle) => (
      <Text style={{ color: Colors.orange[6] }}>
        {utils.farsiNum(ServiceGroupTitle)}
      </Text>
    ),
  },
  {
    title: Words.title,
    width: 200,
    align: "center",
    dataIndex: "Title",
    sorter: getSorter("Title"),
    render: (Title) => (
      <Text style={{ color: Colors.blue[6] }}>{utils.farsiNum(Title)}</Text>
    ),
  },
  {
    title: Words.measure_unit,
    width: 200,
    align: "center",
    dataIndex: "MeasureUnitTitle",
    sorter: getSorter("MeasureUnitTitle"),
    render: (MeasureUnitTitle) => (
      <Text style={{ color: Colors.green[6] }}>
        {utils.farsiNum(MeasureUnitTitle)}
      </Text>
    ),
  },
  {
    title: Words.measure_type,
    width: 200,
    align: "center",
    dataIndex: "MeasureTypeTitle",
    sorter: getSorter("MeasureTypeTitle"),
    render: (MeasureTypeTitle) => (
      <Text style={{ color: Colors.cyan[6] }}>
        {utils.farsiNum(MeasureTypeTitle)}
      </Text>
    ),
  },
];

const recordID = "ServiceID";

const PurchasingServicesPage = ({ pageName }) => {
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

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.purchasing_services}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="PurchasingServices"
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
        <PurchasingServiceModal
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

export default PurchasingServicesPage;
