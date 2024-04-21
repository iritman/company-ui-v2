import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import service from "../../../../services/financial/ledger/ledgers-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import LedgerModal from "./ledger-modal";
import DetailsModal from "./ledger-details-modal";
import { usePageContext } from "../../../contexts/page-context";
import DetailsButton from "../../../common/details-button";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "Ledgers",
    data: records,
    columns: [
      { label: Words.id, value: "LedgerID" },
      { label: Words.title, value: "Title" },
      { label: Words.base_module, value: "BaseTableTitle" },
      { label: Words.descriptions, value: "DetailsText" },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 75,
    align: "center",
    dataIndex: "LedgerID",
    sorter: getSorter("LedgerID"),
    render: (LedgerID) => <Text>{utils.farsiNum(`${LedgerID}`)}</Text>,
  },
  {
    title: Words.title,
    width: 200,
    align: "center",
    dataIndex: "Title",
    sorter: getSorter("Title"),
    render: (Title) => <Text style={{ color: Colors.cyan[6] }}>{Title}</Text>,
  },
];

const recordID = "LedgerID";

const LedgersPage = ({ pageName }) => {
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

  const handleSaveFinancialYear = async (financial_year) => {
    const saved_financial_year = await service.saveFinancialYear(
      financial_year
    );

    const rec = { ...selectedObject };
    if (financial_year.FinancialYearID === 0)
      rec.FinancialYears = [...rec.FinancialYears, saved_financial_year];
    else {
      const index = rec.FinancialYears.findIndex(
        (y) => y.FinancialYearID === financial_year.FinancialYearID
      );
      rec.FinancialYears[index] = saved_financial_year;
    }
    setSelectedObject(rec);

    //------

    const ledger_index = records.findIndex(
      (ledger) => ledger.LedgerID === financial_year.LedgerID
    );

    if (financial_year.FinancialYearID === 0) {
      records[ledger_index].FinancialYears = [
        ...records[ledger_index].FinancialYears,
        saved_financial_year,
      ];
    } else {
      const year_index = records[ledger_index].FinancialYears.findIndex(
        (y) => y.FinancialYearID === financial_year.FinancialYearID
      );
      records[ledger_index].FinancialYears[year_index] = saved_financial_year;
    }

    setRecords([...records]);

    //------

    return saved_financial_year;
  };

  const handleDeleteFinancialYear = async (financial_year_id) => {
    await service.deleteFinancialYear(financial_year_id);

    if (selectedObject) {
      const rec = { ...selectedObject };
      rec.FinancialYears = rec.FinancialYears.filter(
        (y) => y.FinancialYearID !== financial_year_id
      );
      setSelectedObject(rec);

      //------

      const ledger_index = records.findIndex(
        (ledger) => ledger.LedgerID === rec.LedgerID
      );

      records[ledger_index].FinancialYears = records[
        ledger_index
      ].FinancialYears.filter((y) => y.FinancialYearID !== financial_year_id);

      setRecords([...records]);
    }
  };

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.ledgers}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="Ledgers"
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
        <LedgerModal
          access={access}
          isOpen={showModal}
          selectedObject={selectedObject}
          onOk={handleSave}
          onCancel={handleCloseModal}
          onSaveFinancialYear={handleSaveFinancialYear}
          onDeleteFinancialYear={handleDeleteFinancialYear}
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
        />
      )}
    </>
  );
};

export default LedgersPage;
