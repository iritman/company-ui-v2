import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Button, message } from "antd";
import { InfoCircleOutlined as InfoIcon } from "@ant-design/icons";
import Words from "./../../../../../resources/words";
import Colors from "./../../../../../resources/colors";
import utils from "./../../../../../tools/utils";
import service from "./../../../../../services/financial/treasury/basic-info/company-bank-accounts-service";
import tafsilAccountService from "./../../../../../services/financial/accounts/tafsil-accounts-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../../tools/form-manager";
import SimpleDataTable from "../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../common/simple-data-page-header";
import CompanyBankAccountModal from "./company-bank-account-modal";
import DetailsModal from "./company-bank-account-details-modal";
import { usePageContext } from "./../../../../contexts/page-context";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "CompanyBankAccounts",
    data: records,
    columns: [
      { label: Words.id, value: "AccountID" },
      { label: Words.bank_branch, value: "BankBranchTitle" },
      { label: Words.branch_code, value: "BranchCode" },
      { label: Words.bank, value: "BankTitle" },
      { label: Words.city, value: "CityTitle" },
      { label: Words.account_no, value: "AccountNo" },
      {
        label: Words.credit,
        value: "Credit",
      },
      {
        label: Words.currency_type,
        value: "CurrencyTitle",
      },
      { label: Words.sheba_no, value: "ShebaID" },
      {
        label: Words.bank_account_type,
        value: "BankAccountTypeTitle",
      },
      { label: Words.tafsil_account, value: "TafsilAccountTitle" },
      { label: Words.tafsil_type, value: "TafsilTypeTitle" },
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

const CompanyBankAccountsPage = ({ pageName }) => {
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

  const handleCreateTafsilAccount = async () => {
    if (selectedObject) {
      const data = await tafsilAccountService.createTafsilAccount(
        "CompanyBankAccounts",
        "CompanyBankAccounts",
        selectedObject.AccountID
      );

      const { TafsilInfo, Message } = data;

      message.success(Message);

      //------

      selectedObject.TafsilInfo = TafsilInfo;
      setSelectedObject({ ...selectedObject });

      const inx = records.findIndex(
        (r) => r.AccountID === selectedObject.AccountID
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
            title={Words.company_bank_accounts}
            sheets={getSheets(records)}
            fileName="CompanyBankAccounts"
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
        <CompanyBankAccountModal
          isOpen={showModal}
          selectedObject={selectedObject}
          onOk={handleSave}
          onCancel={handleCloseModal}
          onCreateTafsilAccount={handleCreateTafsilAccount}
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
          onCreateTafsilAccount={handleCreateTafsilAccount}
        />
      )}
    </>
  );
};

export default CompanyBankAccountsPage;
