import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import service from "../../../../services/financial/accounts/tafsil-accounts-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import TafsilAccountModal from "./tafsil-account-modal";
import DetailsModal from "./tafsil-account-details-modal";
import { usePageContext } from "../../../contexts/page-context";
import DetailsButton from "../../../common/details-button";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "TafsilAccounts",
    data: records,
    columns: [
      { label: Words.id, value: "TafsilAccountID" },
      { label: Words.tafsil_type, value: "TafsilTypeTitle" },
      { label: Words.base_module, value: "TafsilTypeBaseTableTitle" },
      { label: Words.base_module_item_id, value: "BaseTableItemID" },
      { label: Words.base_module_item_title, value: "BaseTableItemTitle" },
      { label: Words.title, value: "Title" },
      { label: Words.default_currency, value: "CurrencyTitle" },
      { label: Words.descriptions, value: "DetailsText" },
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
    dataIndex: "TafsilAccountID",
    sorter: getSorter("TafsilAccountID"),
    render: (TafsilAccountID) => (
      <Text>{utils.farsiNum(`${TafsilAccountID}`)}</Text>
    ),
  },
  {
    title: Words.tafsil_type,
    width: 150,
    align: "center",
    dataIndex: "TafsilTypeTitle",
    sorter: getSorter("TafsilTypeTitle"),
    render: (TafsilTypeTitle) => (
      <Text style={{ color: Colors.blue[6] }}>{TafsilTypeTitle}</Text>
    ),
  },
  {
    title: Words.title,
    width: 200,
    align: "center",
    // dataIndex: "Title",
    // sorter: getSorter("Title"),
    render: (record) => (
      <Text style={{ color: Colors.cyan[6] }}>
        {utils.farsiNum(
          record.BaseTableItemID === 0
            ? record.Title
            : record.BaseTableItemTitle
        )}
      </Text>
    ),
  },
  {
    title: Words.tafsil_code,
    width: 150,
    align: "center",
    dataIndex: "TafsilCode",
    sorter: getSorter("TafsilCode"),
    render: (TafsilCode) => (
      <Text style={{ color: Colors.orange[6] }}>
        {utils.farsiNum(TafsilCode)}
      </Text>
    ),
  },
];

const recordID = "TafsilAccountID";

const TafsilAccountsPage = ({ pageName }) => {
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
            title={Words.tafsil_accounts}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="TafsilAccounts"
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
        <TafsilAccountModal
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

export default TafsilAccountsPage;
