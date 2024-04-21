import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import service from "../../../../services/financial/store-mgr/user-baches-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import BachModal from "./user-bach-modal";
import DetailsModal from "./user-bach-details-modal";
import SearchModal from "./user-baches-search-modal";
import { usePageContext } from "../../../contexts/page-context";
import DetailsButton from "./../../../common/details-button";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "Baches",
    data: records,
    columns: [
      { label: Words.bach, value: "BachID" },
      { label: Words.product, value: "Title" },
      { label: Words.product_code, value: "ProductCode" },
      {
        label: Words.reg_date,
        value: (record) => utils.slashDate(record.RegDate),
      },
      {
        label: Words.reg_time,
        value: (record) => utils.colonTime(record.RegTime),
      },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 75,
    align: "center",
    dataIndex: "BachID",
    sorter: getSorter("BachID"),
    render: (BachID) => <Text>{utils.farsiNum(`${BachID}`)}</Text>,
  },
  {
    title: Words.product,
    width: 200,
    align: "center",
    dataIndex: "Title",
    sorter: getSorter("Title"),
    render: (Title) => <Text style={{ color: Colors.blue[7] }}>{Title}</Text>,
  },
  {
    title: Words.product_code,
    width: 200,
    align: "center",
    dataIndex: "ProductCode",
    sorter: getSorter("ProductCode"),
    render: (ProductCode) => (
      <Text style={{ color: Colors.volcano[6] }}>{ProductCode}</Text>
    ),
  },
  {
    title: Words.reg_date,
    width: 100,
    align: "center",
    dataIndex: "RegDate",
    sorter: getSorter("RegDate"),
    render: (RegDate) => (
      <Text style={{ color: Colors.cyan[6] }}>
        {utils.farsiNum(utils.slashDate(RegDate))}
      </Text>
    ),
  },
  {
    title: Words.reg_time,
    width: 100,
    align: "center",
    dataIndex: "RegTime",
    sorter: getSorter("RegTime"),
    render: (RegTime) => (
      <Text style={{ color: Colors.purple[6] }}>
        {utils.farsiNum(utils.colonTime(RegTime))}
      </Text>
    ),
  },
];

const handleCheckEditable = (row) => true; //row.Editable;
const handleCheckDeletable = (row) => true; //row.Deletable;

const recordID = "BachID";

const UserBachesPage = ({ pageName }) => {
  const {
    progress,
    searched,
    setSearched,
    records,
    setRecords,
    access,
    setAccess,
    selectedObject,
    setSelectedObject,
    showModal,
    showDetails,
    setShowDetails,
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
    // handleGetAll,
    handleResetContext,
    handleAdvancedSearch,
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
        handleDelete,
        handleCheckEditable,
        handleCheckDeletable
      )
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
            title={Words.bach}
            sheets={getSheets(records)}
            fileName="Baches"
            onSearch={() => setShowSearchModal(true)}
            onClear={handleClear}
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
        <BachModal
          isOpen={showModal}
          selectedObject={selectedObject}
          onOk={handleSave}
          onCancel={handleCloseModal}
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

export default UserBachesPage;
