import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Button } from "antd";
import { InfoCircleOutlined as InfoIcon } from "@ant-design/icons";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import { farsiNum, textSeparator } from "../../../../tools/utils";
import service from "../../../../services/settings/org/bank-accounts-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import BankAccountModal from "./bank-account-modal";
import DetailsModal from "./bank-account-details-modal";
import SearchModal from "./bank-accounts-search-modal";
import MemberProfileImage from "../../../common/member-profile-image";
import { usePageContext } from "../../../contexts/page-context";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "BankAccounts",
    data: records,
    columns: [
      { label: Words.id, value: "AccountID" },
      { label: Words.member_id, value: "MemberID" },
      { label: Words.first_name, value: "FirstName" },
      { label: Words.last_name, value: "LastName" },
      { label: Words.bank, value: "BankTitle" },
      { label: Words.account_no, value: "AccountNo" },
      {
        label: Words.card_no,
        value: (record) =>
          record.CardNo.length > 0 ? textSeparator(record.CardNo, 4, "-") : "",
      },
      {
        label: Words.sheba_no,
        value: (record) =>
          record.ShebaNo.length > 0
            ? `IR-${textSeparator(record.ShebaNo, 4, "-")}`
            : "",
      },
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
    render: (AccountID) => <Text>{farsiNum(`${AccountID}`)}</Text>,
  },
  {
    title: "",
    width: 75,
    align: "center",
    dataIndex: "PicFileName",
    render: (PicFileName) => <MemberProfileImage fileName={PicFileName} />,
  },
  {
    title: Words.full_name,
    width: 200,
    align: "center",
    sorter: getSorter("LastName"),
    render: (record) => (
      <Text
        style={{ color: Colors.blue[6] }}
      >{`${record.FirstName} ${record.LastName}`}</Text>
    ),
  },
  {
    title: Words.bank,
    width: 100,
    align: "center",
    dataIndex: "BankTitle",
    sorter: getSorter("BankTitle"),
    render: (BankTitle) => (
      <Text style={{ color: Colors.green[6] }}>{BankTitle}</Text>
    ),
  },
  {
    title: Words.account_no,
    width: 150,
    align: "center",
    dataIndex: "AccountNo",
    sorter: getSorter("AccountNo"),
    render: (AccountNo) => (
      <Text style={{ color: Colors.orange[6] }}>{AccountNo}</Text>
    ),
  },
];

const recordID = "AccountID";

const BankAccounts = ({ pageName }) => {
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
    handleAdvancedSearch,
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
            title={Words.bank_accounts}
            sheets={getSheets(records)}
            fileName="BankAccounts"
            onSearch={() => setShowSearchModal(true)}
            onClear={handleClear}
            onGetAll={null}
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
        <BankAccountModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
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
          onOk={() => {
            setShowDetails(false);
            setSelectedObject(null);
          }}
          isOpen={showDetails}
          bankAccount={selectedObject}
        />
      )}
    </>
  );
};

export default BankAccounts;
