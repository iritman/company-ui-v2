import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import service from "../../../../services/financial/public-settings/currency-ratios-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import CurrencyRatioModal from "./currency-ratio-modal";
import { usePageContext } from "../../../contexts/page-context";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "CurrencyRatios",
    data: records,
    columns: [
      { label: Words.id, value: "RatioID" },
      { label: Words.from_currency, value: "FromCurrencyTitle" },
      { label: Words.to_currency, value: "ToCurrencyTitle" },
      {
        label: Words.ratio,
        value: "Ratio",
      },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 75,
    align: "center",
    dataIndex: "RatioID",
    sorter: getSorter("RatioID"),
    render: (RatioID) => <Text>{utils.farsiNum(`${RatioID}`)}</Text>,
  },
  {
    title: Words.from_currency,
    width: 100,
    align: "center",
    dataIndex: "FromCurrencyTitle",
    sorter: getSorter("FromCurrencyTitle"),
    render: (FromCurrencyTitle) => (
      <Text style={{ color: Colors.cyan[6] }}>{FromCurrencyTitle}</Text>
    ),
  },
  {
    title: Words.to_currency,
    width: 100,
    align: "center",
    dataIndex: "ToCurrencyTitle",
    sorter: getSorter("ToCurrencyTitle"),
    render: (ToCurrencyTitle) => (
      <Text style={{ color: Colors.orange[6] }}>{ToCurrencyTitle}</Text>
    ),
  },
  {
    title: Words.ratio,
    width: 100,
    align: "center",
    dataIndex: "Ratio",
    sorter: getSorter("Ratio"),
    render: (Ratio) => <Text style={{ color: Colors.blue[6] }}>{Ratio}</Text>,
  },
];

const recordID = "RatioID";

const CurrencyRatiosPage = ({ pageName }) => {
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
            title={Words.currency_ratios}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="CurrencyRatios"
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
        <CurrencyRatioModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}
    </>
  );
};

export default CurrencyRatiosPage;
