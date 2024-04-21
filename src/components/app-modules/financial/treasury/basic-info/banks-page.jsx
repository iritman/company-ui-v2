import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, message } from "antd";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import service from "../../../../../services/financial/treasury/basic-info/banks-service";
import tafsilAccountService from "../../../../../services/financial/accounts/tafsil-accounts-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../../tools/form-manager";
import SimpleDataTable from "../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../common/simple-data-page-header";
import BankModal from "./bank-modal";
import DetailsModal from "./bank-details-modal";
import { usePageContext } from "../../../../contexts/page-context";
import DetailsButton from "../../../../common/details-button";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "Banks",
    data: records,
    columns: [
      { label: Words.id, value: "BankID" },
      { label: Words.title, value: "Title" },
      { label: Words.bank_type, value: "BankTypeTitle" },
      { label: Words.pr_tel_no, value: "PRTelNo" },
      { label: Words.website, value: "Website" },
      { label: Words.swift_code, value: "SwiftCode" },
      { label: Words.descriptions, value: "DetailsText" },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 75,
    align: "center",
    dataIndex: "BankID",
    sorter: getSorter("BankID"),
    render: (BankID) => <Text>{utils.farsiNum(`${BankID}`)}</Text>,
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
    title: Words.bank_type,
    width: 150,
    align: "center",
    dataIndex: "BankTypeTitle",
    sorter: getSorter("BankTypeTitle"),
    render: (BankTypeTitle) => (
      <Text style={{ color: Colors.blue[6] }}>{BankTypeTitle}</Text>
    ),
  },
];

const recordID = "BankID";

const BanksPage = ({ pageName }) => {
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
        "Banks",
        "Banks",
        selectedObject.BankID
      );

      const { TafsilInfo, Message } = data;

      message.success(Message);

      //------

      selectedObject.TafsilInfo = TafsilInfo;
      setSelectedObject({ ...selectedObject });

      const inx = records.findIndex((r) => r.BankID === selectedObject.BankID);
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
            title={Words.banks}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="Banks"
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
        <BankModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          onCreateTafsilAccount={handleCreateTafsilAccount}
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
          onCreateTafsilAccount={handleCreateTafsilAccount}
        />
      )}
    </>
  );
};

export default BanksPage;
