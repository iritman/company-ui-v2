import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Button, Space } from "antd";
import { InfoCircleOutlined as InfoIcon } from "@ant-design/icons";
import Words from "./../../../../../resources/words";
import Colors from "./../../../../../resources/colors";
import utils from "./../../../../../tools/utils";
import service from "./../../../../../services/financial/treasury/basic-info/cheque-books-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../../tools/form-manager";
import SimpleDataTable from "../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../common/simple-data-page-header";
import ChequeBookModal from "./cheque-book-modal";
import DetailsModal from "./cheque-book-details-modal";
import { usePageContext } from "./../../../../contexts/page-context";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "ChequeBooks",
    data: records,
    columns: [
      { label: Words.id, value: "ChequeBookID" },
      { label: Words.bank_account, value: "AccountNo" },
      { label: Words.bank, value: "BankTitle" },
      { label: Words.bank_branch, value: "BankBranchTitle" },
      { label: Words.branch_code, value: "BranchCode" },
      { label: Words.cheque_book_series, value: "Series" },
      { label: Words.total_pages, value: "TotalPages" },
      { label: Words.start_serial_no, value: "StartSerialNo" },
      {
        label: Words.issue_date,
        value: (record) => utils.slashDate(record.IssueDate),
      },
      { label: Words.cash_box, value: "CashBoxTitle" },
      {
        label: Words.IsSayad,
        value: (record) => (record.IsSayad ? Words.yes : Words.no),
      },
      { label: Words.remained_pages, value: "RemainedPages" },
      { label: Words.first_usable_serial_no, value: "FirstUsableSerialNo" },
      { label: Words.used_cheques, value: (record) => record.Cheques.length },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 100,
    align: "center",
    dataIndex: "ChequeBookID",
    sorter: getSorter("ChequeBookID"),
    render: (ChequeBookID) => <Text>{utils.farsiNum(`${ChequeBookID}`)}</Text>,
  },
  {
    title: Words.bank_account,
    width: 200,
    align: "center",
    dataIndex: "AccountNo",
    sorter: getSorter("AccountNo"),
    render: (AccountNo) => (
      <Text style={{ color: Colors.blue[6] }}>{utils.farsiNum(AccountNo)}</Text>
    ),
  },
  {
    title: Words.bank_branch,
    width: 200,
    align: "center",
    // dataIndex: "BankTitle",
    sorter: getSorter("BankTitle"),
    render: (record) => (
      <Space direction="vertical">
        <Text style={{ color: Colors.cyan[6] }}>{record.BankTitle}</Text>
        <Text style={{ color: Colors.grey[6] }}>
          {utils.farsiNum(`${record.BankBranchTitle} (${record.BranchCode})`)}
        </Text>
      </Space>
    ),
  },
  {
    title: Words.issue_date,
    width: 120,
    align: "center",
    dataIndex: "IssueDate",
    sorter: getSorter("IssueDate"),
    render: (IssueDate) => (
      <Text style={{ color: Colors.magenta[6] }}>
        {utils.farsiNum(utils.slashDate(IssueDate))}
      </Text>
    ),
  },
];

const recordID = "ChequeBookID";

const ChequeBooksPage = ({ pageName }) => {
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
    setSearchText,
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
    handleResetContext,
    handleSearch,
    handleGetAll,
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
            title={Words.cheque_books}
            sheets={getSheets(records)}
            fileName="ChequeBooks"
            onSearchTextChanged={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            onClear={handleClear}
            onAdd={access?.CanAdd && handleAdd}
            onGetAll={handleGetAll}
          />

          <Col xs={24}>
            {searched && (
              <SimpleDataTable records={records} columns={columns} />
            )}
          </Col>
        </Row>
      </Spin>

      {showModal && (
        <ChequeBookModal
          isOpen={showModal}
          selectedObject={selectedObject}
          onOk={handleSave}
          onCancel={handleCloseModal}
        />
      )}

      {showDetails && (
        <DetailsModal
          isOpen={showDetails}
          selectedObject={selectedObject}
          showContacts={true}
          onOk={() => {
            setShowDetails(false);
            setSelectedObject(null);
          }}
        />
      )}
    </>
  );
};

export default ChequeBooksPage;
