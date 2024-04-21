import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Button } from "antd";
import { InfoCircleOutlined as InfoIcon } from "@ant-design/icons";
import Words from "./../../../../../resources/words";
import Colors from "./../../../../../resources/colors";
import utils from "./../../../../../tools/utils";
import service from "./../../../../../services/financial/treasury/basic-info/person-company-bank-accounts-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../../tools/form-manager";
import SimpleDataTable from "../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../common/simple-data-page-header";
import PersonCompanyBankAccountModal from "./pc-bank-account-modal";
import DetailsModal from "./pc-bank-account-details-modal";
import SearchModal from "./pc-bank-accounts-serach-modal";
import { usePageContext } from "./../../../../contexts/page-context";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "PersonCompanyBankAccounts",
    data: records,
    columns: [
      { label: Words.id, value: "AccountID" },
      { label: Words.bank_branch, value: "BankBranchTitle" },
      { label: Words.branch_code, value: "BranchCode" },
      { label: Words.bank, value: "BankTitle" },
      { label: Words.city, value: "CityTitle" },
      { label: Words.doc_type, value: "TypeTitle" },
      { label: Words.account_no, value: "AccountNo" },
      { label: Words.sheba_no, value: "ShebaID" },
      {
        label: Words.pc_person,
        value: (record) => `${record.FirstName} ${record.LastName}`,
      },
      { label: Words.pc_company, value: "CompanyTitle" },
      {
        label: Words.in_black_list,
        value: (record) => (record.InBlackList ? Words.yes : Words.no),
      },
      { label: Words.descriptions, value: "DetailsText" },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 100,
    align: "center",
    dataIndex: "AccountID",
    sorter: getSorter("AccountID"),
    render: (AccountID) => <Text>{utils.farsiNum(`${AccountID}`)}</Text>,
  },
  {
    title: Words.pc_person_company,
    width: 200,
    align: "center",
    // dataIndex: "BankTitle",
    // sorter: getSorter("BankTitle"),
    render: (record) => (
      <Text style={{ color: Colors.cyan[6] }}>
        {record.MemberID > 0
          ? `${record.FirstName} ${record.LastName}`
          : record.CompanyTitle}
      </Text>
    ),
  },
  {
    title: Words.account_no,
    width: 120,
    align: "center",
    dataIndex: "AccountNo",
    sorter: getSorter("AccountNo"),
    render: (AccountNo) => (
      <Text style={{ color: Colors.blue[6] }}>{utils.farsiNum(AccountNo)}</Text>
    ),
  },
  {
    title: Words.bank,
    width: 150,
    align: "center",
    dataIndex: "BankTitle",
    sorter: getSorter("BankTitle"),
    render: (BankTitle) => (
      <Text style={{ color: Colors.orange[6] }}>
        {utils.farsiNum(BankTitle)}
      </Text>
    ),
  },
  {
    title: Words.city,
    width: 120,
    align: "center",
    dataIndex: "CityTitle",
    sorter: getSorter("CityTitle"),
    render: (CityTitle) => (
      <Text style={{ color: Colors.lime[7] }}>{utils.farsiNum(CityTitle)}</Text>
    ),
  },
];

const recordID = "AccountID";

const PersonCompanyBankAccountsPage = ({ pageName }) => {
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
    handleResetContext,
    handleAdvancedSearch,
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
    setFilter(null);
    setSearched(false);
  };

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.person_company_bank_accounts}
            sheets={getSheets(records)}
            fileName="PersonCompanyBankAccounts"
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
        <PersonCompanyBankAccountModal
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

export default PersonCompanyBankAccountsPage;
