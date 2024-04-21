import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Button, Space } from "antd";
import { InfoCircleOutlined as InfoIcon } from "@ant-design/icons";
import Words from "./../../../../../resources/words";
import Colors from "./../../../../../resources/colors";
import utils from "./../../../../../tools/utils";
import service from "./../../../../../services/financial/treasury/basic-info/cash-flows-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../../tools/form-manager";
import SimpleDataTable from "../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../common/simple-data-page-header";
import CashFlowModal from "./cash-flow-modal";
import DetailsModal from "./cash-flow-details-modal";
import { usePageContext } from "./../../../../contexts/page-context";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "CashFlows",
    data: records,
    columns: [
      { label: Words.id, value: "CashFlowID" },
      { label: Words.title, value: "Title" },
      { label: Words.moein_code, value: "MoeinCode" },
      { label: Words.account_moein, value: "MoeinTitle" },
      {
        label: Words.show_in_receip_operation,
        value: (record) =>
          record.ShowInReceiptOperation ? Words.yes : Words.no,
      },
      {
        label: Words.show_in_payment_operation,
        value: (record) =>
          record.ShowInPaymentOperation ? Words.yes : Words.no,
      },
      {
        label: Words.show_in_fund_summary_operation,
        value: (record) =>
          record.ShowInFundSummaryOperation ? Words.yes : Words.no,
      },
      { label: Words.tafsil_type_level_4, value: "TafsilTypeTitle4" },
      { label: Words.fix_side_4, value: "FixSide4" },
      { label: Words.tafsil_type_level_5, value: "TafsilTypeTitle5" },
      { label: Words.fix_side_5, value: "FixSide5" },
      { label: Words.tafsil_type_level_6, value: "TafsilTypeTitle6" },
      { label: Words.fix_side_6, value: "FixSide6" },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 100,
    align: "center",
    dataIndex: "CashFlowID",
    sorter: getSorter("CashFlowID"),
    render: (CashFlowID) => <Text>{utils.farsiNum(`${CashFlowID}`)}</Text>,
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
    title: Words.account_moein,
    width: 200,
    align: "center",
    // dataIndex: "BankTitle",
    sorter: getSorter("MoeinCode"),
    render: (record) => (
      <Space direction="vertical">
        <Text style={{ color: Colors.cyan[6] }}>{record.MoeinTitle}</Text>

        <Text style={{ color: Colors.volcano[6] }}>
          {utils.farsiNum(record.MoeinCode)}
        </Text>
      </Space>
    ),
  },
];

const recordID = "CashFlowID";

const CashFlowsPage = ({ pageName }) => {
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
            title={Words.cash_flows}
            sheets={getSheets(records)}
            fileName="CashFlows"
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
        <CashFlowModal
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

export default CashFlowsPage;
