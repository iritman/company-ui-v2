import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Button, message } from "antd";
import { InfoCircleOutlined as InfoIcon } from "@ant-design/icons";
import Words from "./../../../../../resources/words";
import Colors from "./../../../../../resources/colors";
import utils from "./../../../../../tools/utils";
import service from "./../../../../../services/financial/treasury/basic-info/cash-boxes-service";
import tafsilAccountService from "./../../../../../services/financial/accounts/tafsil-accounts-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../../tools/form-manager";
import SimpleDataTable from "../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../common/simple-data-page-header";
import CashBoxModal from "./cash-box-modal";
import DetailsModal from "./cash-box-details-modal";
import { usePageContext } from "./../../../../contexts/page-context";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "CashBoxes",
    data: records,
    columns: [
      { label: Words.id, value: "CashBoxID" },
      { label: Words.title, value: "Title" },
      { label: Words.location, value: "Location" },
      {
        label: Words.cashier,
        value: (record) =>
          `${record.CashierFirstName} ${record.CashierLastName}`,
      },
      { label: Words.descriptions, value: "DetailsText" },
      {
        label: Words.status,
        value: (record) => (record.IsActive ? Words.active : Words.inactive),
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
    dataIndex: "CashBoxID",
    sorter: getSorter("CashBoxID"),
    render: (CashBoxID) => <Text>{utils.farsiNum(`${CashBoxID}`)}</Text>,
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
    title: Words.cashier,
    width: 200,
    align: "center",
    // dataIndex: "BankTitle",
    sorter: getSorter("CashierLastName"),
    render: (record) => (
      <Text style={{ color: Colors.cyan[6] }}>
        {`${record.CashierFirstName} ${record.CashierLastName}`}
      </Text>
    ),
  },
];

const recordID = "CashBoxID";

const CashBoxesPage = ({ pageName }) => {
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
        "CashBoxes",
        "CashBoxes",
        selectedObject.CashBoxID
      );

      const { TafsilInfo, Message } = data;

      message.success(Message);

      //------

      selectedObject.TafsilInfo = TafsilInfo;
      setSelectedObject({ ...selectedObject });

      const inx = records.findIndex(
        (r) => r.CashBoxID === selectedObject.CashBoxID
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
            title={Words.cash_boxes}
            sheets={getSheets(records)}
            fileName="CashBoxes"
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
        <CashBoxModal
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

export default CashBoxesPage;
