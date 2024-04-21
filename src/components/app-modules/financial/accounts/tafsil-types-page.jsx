import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import service from "../../../../services/financial/accounts/tafsil-types-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import TafsilTypeModal from "./tafsil-type-modal";
import DetailsModal from "./tafsil-type-details-modal";
import { usePageContext } from "../../../contexts/page-context";
import DetailsButton from "../../../common/details-button";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "TafsilTypes",
    data: records,
    columns: [
      { label: Words.id, value: "TafsilTypeID" },
      { label: Words.title, value: "Title" },
      { label: Words.parent_tafsil_type, value: "ParentTitle" },
      { label: Words.base_module, value: "BaseTableTitle" },
      { label: Words.start_code, value: "StartCode" },
      { label: Words.descriptions, value: "DetailsText" },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 75,
    align: "center",
    dataIndex: "TafsilTypeID",
    sorter: getSorter("TafsilTypeID"),
    render: (TafsilTypeID) => <Text>{utils.farsiNum(`${TafsilTypeID}`)}</Text>,
  },
  {
    title: Words.title,
    width: 200,
    align: "center",
    dataIndex: "Title",
    sorter: getSorter("Title"),
    render: (Title) => <Text style={{ color: Colors.cyan[6] }}>{Title}</Text>,
  },
  {
    title: Words.parent_tafsil_type,
    width: 150,
    align: "center",
    dataIndex: "ParentTitle",
    sorter: getSorter("ParentTitle"),
    render: (ParentTitle) => (
      <Text style={{ color: Colors.orange[6] }}>{ParentTitle}</Text>
    ),
  },
  {
    title: Words.base_module,
    width: 150,
    align: "center",
    dataIndex: "BaseTableTitle",
    sorter: getSorter("BaseTableTitle"),
    render: (BaseTableTitle) => (
      <Text style={{ color: Colors.blue[6] }}>{BaseTableTitle}</Text>
    ),
  },
];

const recordID = "TafsilTypeID";

const TafsilTypesPage = ({ pageName }) => {
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
            title={Words.tafsil_types}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="TafsilTypes"
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
        <TafsilTypeModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
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
        />
      )}
    </>
  );
};

export default TafsilTypesPage;
