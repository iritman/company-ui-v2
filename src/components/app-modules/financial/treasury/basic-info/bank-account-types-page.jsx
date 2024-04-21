import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import { CheckOutlined as CheckIcon } from "@ant-design/icons";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import service from "../../../../../services/financial/treasury/basic-info/bank-account-types-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../../tools/form-manager";
import SimpleDataTable from "../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../common/simple-data-page-header";
import BankAccountTypeModal from "./bank-account-type-modal";
import { usePageContext } from "../../../../contexts/page-context";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "BankAccountTypes",
    data: records,
    columns: [
      { label: Words.id, value: "BankAccountTypeID" },
      { label: Words.title, value: "Title" },
      {
        label: Words.with_cheque,
        value: (record) => (record.WithCheque ? Words.yes : Words.no),
      },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 75,
    align: "center",
    dataIndex: "BankAccountTypeID",
    sorter: getSorter("BankAccountTypeID"),
    render: (BankAccountTypeID) => (
      <Text>{utils.farsiNum(`${BankAccountTypeID}`)}</Text>
    ),
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
    title: Words.with_cheque,
    width: 200,
    align: "center",
    dataIndex: "WithCheque",
    sorter: getSorter("WithCheque"),
    render: (WithCheque) => (
      <>
        {WithCheque ? <CheckIcon style={{ color: Colors.green[6] }} /> : <></>}
      </>
    ),
  },
];

const recordID = "BankAccountTypeID";

const BankAccountTypesPage = ({ pageName }) => {
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
            title={Words.bank_account_types}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="BankAccountTypes"
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
        <BankAccountTypeModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}
    </>
  );
};

export default BankAccountTypesPage;
