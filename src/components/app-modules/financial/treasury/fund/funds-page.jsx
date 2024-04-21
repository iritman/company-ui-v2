import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Button } from "antd";
import { InfoCircleOutlined as InfoIcon } from "@ant-design/icons";
import Words from "./../../../../../resources/words";
import Colors from "./../../../../../resources/colors";
import utils from "./../../../../../tools/utils";
import service from "./../../../../../services/financial/treasury/fund/funds-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../../tools/form-manager";
import SimpleDataTable from "../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../common/simple-data-page-header";
import FundModal from "./fund-modal";
import DetailsModal from "./fund-details-modal";
import { usePageContext } from "./../../../../contexts/page-context";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "Funds",
    data: records,
    columns: [
      { label: Words.id, value: "FundID" },
      // { label: Words.title, value: "Title" },
      {
        label: Words.funder_member,
        value: (record) => `${record.FunderFirstName} ${record.FunderLastName}`,
      },
      {
        label: Words.establish_date,
        value: (record) => utils.slashDate(record.EstablishDate),
      },
      { label: Words.currency, value: "CurrencyTitle" },
      { label: Words.initial_inventory, value: "InitialInventory" },
      { label: Words.max_inventory, value: "MaxInventory" },
      { label: Words.descriptions, value: "DetailsText" },
      { label: Words.tafsil_account, value: "TafsilAccountTitle" },
      { label: Words.tafsil_type, value: "TafsilTypeTitle" },
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
    width: 100,
    align: "center",
    dataIndex: "FundID",
    sorter: getSorter("FundID"),
    render: (FundID) => <Text>{utils.farsiNum(`${FundID}`)}</Text>,
  },
  // {
  //   title: Words.title,
  //   width: 200,
  //   align: "center",
  //   dataIndex: "Title",
  //   sorter: getSorter("Title"),
  //   render: (Title) => (
  //     <Text style={{ color: Colors.blue[6] }}>{utils.farsiNum(Title)}</Text>
  //   ),
  // },
  {
    title: Words.funder_member,
    width: 200,
    align: "center",
    // dataIndex: "BankTitle",
    sorter: getSorter("FunderLastName"),
    render: (record) => (
      <Text style={{ color: Colors.cyan[6] }}>
        {`${record.FunderFirstName} ${record.FunderLastName}`}
      </Text>
    ),
  },
];

const recordID = "FundID";

const FundsPage = ({ pageName }) => {
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
            title={Words.funds}
            sheets={getSheets(records)}
            fileName="Funds"
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
        <FundModal
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

export default FundsPage;
