import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Button, Space } from "antd";
import { InfoCircleOutlined as InfoIcon } from "@ant-design/icons";
import Words from "./../../../../../resources/words";
import Colors from "./../../../../../resources/colors";
import utils from "./../../../../../tools/utils";
import service from "./../../../../../services/financial/treasury/basic-info/financial-operations-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../../tools/form-manager";
import SimpleDataTable from "../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../common/simple-data-page-header";
import FinancialOperationModal from "./financial-operation-modal";
import DetailsModal from "./financial-operation-details-modal";
import { usePageContext } from "./../../../../contexts/page-context";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "FinancialOperations",
    data: records,
    columns: [
      { label: Words.id, value: "OperationID" },
      { label: Words.title, value: "Title" },
      { label: Words.moein_code, value: "MoeinCode" },
      { label: Words.account_moein, value: "MoeinTitle" },
      { label: Words.financial_operation_type, value: "OperationTypeTitle" },
      { label: Words.item_type, value: "ItemTypeTitle" },
      { label: Words.paper_nature, value: "PaperNatureTitle" },
      { label: Words.duration_type, value: "DurationTypeTitle" },
      {
        label: Words.is_default,
        value: (record) => (record.IsDefault ? Words.yes : Words.no),
      },
      {
        label: Words.status,
        value: (record) => (record.IsActive ? Words.active : Words.inactive),
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
    dataIndex: "OperationID",
    sorter: getSorter("OperationID"),
    render: (OperationID) => <Text>{utils.farsiNum(`${OperationID}`)}</Text>,
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
  {
    title: Words.financial_operation_type,
    width: 150,
    align: "center",
    dataIndex: "OperationTypeTitle",
    sorter: getSorter("OperationTypeTitle"),
    render: (OperationTypeTitle) => (
      <Text style={{ color: Colors.magenta[6] }}>{OperationTypeTitle}</Text>
    ),
  },
];

const recordID = "OperationID";

const FinancialOperationsPage = ({ pageName }) => {
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
            title={Words.financial_operations}
            sheets={getSheets(records)}
            fileName="FinancialOperations"
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
        <FinancialOperationModal
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

export default FinancialOperationsPage;
