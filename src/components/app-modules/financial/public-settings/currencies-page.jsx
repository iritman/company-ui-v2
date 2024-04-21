import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import {
  AiFillLock as LockIcon,
  AiOutlineCheck as CheckIcon,
} from "react-icons/ai";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import service from "../../../../services/financial/public-settings/currencies-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  updateSavedRecords,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import CurrencyModal from "./currency-modal";
import { usePageContext } from "../../../contexts/page-context";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "Currencies",
    data: records,
    columns: [
      { label: Words.id, value: "CurrencyID" },
      { label: Words.title, value: "Title" },
      {
        label: Words.status,
        value: (record) => (record.IsActive ? Words.active : Words.inactive),
      },
      {
        label: Words.is_default,
        value: (record) => (record.IsDefault ? Words.yes : Words.no),
      },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 75,
    align: "center",
    dataIndex: "CurrencyID",
    sorter: getSorter("CurrencyID"),
    render: (CurrencyID) => <Text>{utils.farsiNum(`${CurrencyID}`)}</Text>,
  },
  {
    title: Words.title,
    width: 200,
    align: "center",
    dataIndex: "Title",
    sorter: getSorter("Title"),
    render: (Title) => <Text style={{ color: Colors.blue[7] }}>{Title}</Text>,
  },
  {
    title: Words.status,
    width: 75,
    align: "center",
    sorter: getSorter("IsActive"),
    render: (record) =>
      record.IsActive ? (
        <CheckIcon style={{ color: Colors.green[6] }} />
      ) : (
        <LockIcon style={{ color: Colors.red[6] }} />
      ),
  },
  {
    title: Words.is_default,
    width: 75,
    align: "center",
    sorter: getSorter("IsDefault"),
    render: (record) =>
      record.IsDefault ? (
        <CheckIcon style={{ color: Colors.green[6] }} />
      ) : (
        <></>
      ),
  },
];

const recordID = "CurrencyID";

const CurrenciesPage = ({ pageName }) => {
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
    // handleSave,
    handleResetContext,
  } = GetSimplaDataPageMethods({
    service,
    recordID,
  });

  const columns = access
    ? getColumns(baseColumns, null, access, handleEdit, handleDelete)
    : [];

  const handleSaveCurrency = async (row) => {
    const currencies = [...records];
    if (row.CurrencyID === 0 && row.IsDefault) {
      currencies.forEach((currency) => (currency.IsDefault = false));
    } else if (row.CurrencyID > 0 && row.IsDefault) {
      currencies.forEach((currency) => {
        if (currency.CurrencyID !== row.CurrencyID) {
          currency.IsDefault = false;
        }
      });
    }

    //--- save row

    const savedRow = await service.saveData(row);

    const updatedRecords = updateSavedRecords(
      row,
      recordID,
      currencies,
      savedRow
    );

    if (selectedObject !== null) {
      setSelectedObject({ ...savedRow });
    }

    setRecords([]);
    setRecords(updatedRecords);
  };

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.currencies}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="Currencies"
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
        <CurrencyModal
          onOk={handleSaveCurrency}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}
    </>
  );
};

export default CurrenciesPage;
