import React, { useState } from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
// import { InfoCircleOutlined as InfoIcon } from "@ant-design/icons";
import Words from "../../../../../resources/words";
import utils from "./../../../../../tools/utils";
import service from "./../../../../../services/official/timex/reports/user-my-cards-report-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
  handleError,
} from "../../../../../tools/form-manager";
import SimpleDataTable from "../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../common/simple-data-page-header";
import { usePageContext } from "./../../../../contexts/page-context";
import Colors from "../../../../../resources/colors";
import SearchModal from "./user-my-cards-report-search-modal";
import ValueLabel from "./../../../../common/value-label";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "MyCardsReport",
    data: records,
    columns: [
      { label: Words.id, value: "RowID" },
      { label: Words.reg_id, value: "PrevRegID" },
      {
        label: Words.reg_date,
        value: (record) => utils.slashDate(record.PrevRegDate),
      },
      {
        label: Words.reg_time,
        value: (record) => utils.colonTime(record.PrevRegTime),
      },
      {
        label: Words.card_type,
        value: (record) => (record.PrevCardType ? Words.in : Words.out),
      },
      { label: Words.reg_id, value: "RegID" },
      {
        label: Words.reg_date,
        value: (record) => utils.slashDate(record.RegDate),
      },
      {
        label: Words.reg_time,
        value: (record) => utils.colonTime(record.RegTime),
      },
      {
        label: Words.card_type,
        value: (record) => (record.CardType ? Words.in : Words.out),
      },
      {
        label: Words.work_time,
        value: (record) => utils.farsiNum(record.WorkTime),
      },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 75,
    align: "center",
    dataIndex: "RowID",
    sorter: getSorter("RowID"),
    render: (RowID) => <Text>{utils.farsiNum(`${RowID}`)}</Text>,
  },
  {
    title: Words.reg_id,
    width: 100,
    align: "center",
    dataIndex: "PrevRegID",
    sorter: getSorter("PrevRegID"),
    render: (PrevRegID) => (
      <Text style={{ color: Colors.blue[6] }}>
        {utils.farsiNum(`${PrevRegID}`)}
      </Text>
    ),
  },
  {
    title: Words.reg_date,
    width: 100,
    align: "center",
    dataIndex: "PrevRegDate",
    sorter: getSorter("PrevRegDate"),
    render: (PrevRegDate) => (
      <Text style={{ color: Colors.magenta[6] }}>
        {utils.farsiNum(utils.slashDate(PrevRegDate))}
      </Text>
    ),
  },
  {
    title: Words.reg_time,
    width: 100,
    align: "center",
    dataIndex: "PrevRegTime",
    sorter: getSorter("PrevRegTime"),
    render: (PrevRegTime) => (
      <Text style={{ color: Colors.green[6] }}>
        {utils.farsiNum(utils.colonTime(PrevRegTime))}
      </Text>
    ),
  },
  {
    title: Words.card_type,
    width: 100,
    align: "center",
    // dataIndex: "RegTypeTitle",
    // sorter: getSorter("RegTypeTitle"),
    render: (record) => (
      <Text style={{ color: Colors.purple[6] }}>
        {record.PrevCardType ? Words.in : Words.out}
      </Text>
    ),
  },

  {
    title: Words.reg_id,
    width: 100,
    align: "center",
    dataIndex: "RegID",
    sorter: getSorter("RegID"),
    render: (RegID) => (
      <Text style={{ color: Colors.blue[6] }}>
        {utils.farsiNum(`${RegID}`)}
      </Text>
    ),
  },
  {
    title: Words.reg_date,
    width: 100,
    align: "center",
    dataIndex: "RegDate",
    sorter: getSorter("RegDate"),
    render: (RegDate) => (
      <Text style={{ color: Colors.magenta[6] }}>
        {utils.farsiNum(utils.slashDate(RegDate))}
      </Text>
    ),
  },
  {
    title: Words.reg_time,
    width: 100,
    align: "center",
    dataIndex: "RegTime",
    sorter: getSorter("RegTime"),
    render: (RegTime) => (
      <Text style={{ color: Colors.green[6] }}>
        {utils.farsiNum(utils.colonTime(RegTime))}
      </Text>
    ),
  },
  {
    title: Words.card_type,
    width: 100,
    align: "center",
    // dataIndex: "RegTypeTitle",
    // sorter: getSorter("RegTypeTitle"),
    render: (record) => (
      <Text style={{ color: Colors.purple[6] }}>
        {record.CardType ? Words.in : Words.out}
      </Text>
    ),
  },
  {
    title: Words.work_time,
    width: 100,
    align: "center",
    dataIndex: "WorkTime",
    sorter: getSorter("WorkTime"),
    render: (WorkTime) => (
      <Text style={{ color: Colors.orange[6] }}>
        {utils.farsiNum(WorkTime)}
      </Text>
    ),
  },
];

const handleCheckEditable = (row) => false;
const handleCheckDeletable = (row) => false;

const recordID = "RowID";

const UserMyCardsReportPage = ({ pageName }) => {
  const {
    progress,
    setProgress,
    searched,
    setSearched,
    searchText,
    setSearchText,
    records,
    setRecords,
    access,
    setAccess,
    // setSelectedObject,
    // setShowDetails,
    showSearchModal,
    setShowSearchModal,
    filter,
    setFilter,
  } = usePageContext();

  const [summary, setSummary] = useState(null);

  useMount(async () => {
    handleResetContext();
    await checkAccess(setAccess, pageName);
  });

  const {
    // handleCloseModal,
    // handleAdd,
    // handleEdit,
    // handleDelete,
    // handleSave,
    handleResetContext,
    // handleAdvancedSearch,
  } = GetSimplaDataPageMethods({
    service,
    recordID,
  });

  const handleAdvancedSearch = async (filter) => {
    setFilter(filter);
    setShowSearchModal(false);

    setProgress(true);

    try {
      const data = await service.searchData(filter);

      const { Report, Summary } = data;

      setRecords(Report);
      setSummary(Summary);
      setSearched(true);
    } catch (err) {
      handleError(err);
    }

    setProgress(false);
  };

  const columns = access
    ? getColumns(
        baseColumns,
        null,
        access,
        null, //handleEdit,
        null, //handleDelete,
        handleCheckEditable,
        handleCheckDeletable
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
            title={Words.my_cards_report}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="MyCardsReport"
            onSearchTextChanged={(e) => setSearchText(e.target.value)}
            onSearch={() => setShowSearchModal(true)}
            onClear={handleClear}
            onGetAll={null}
            onAdd={null}
          />

          <Col xs={24}>
            {searched && (
              <SimpleDataTable records={records} columns={columns} />
            )}
          </Col>
          {records.length > 0 && (
            <>
              <Col xs={24}>
                <ValueLabel
                  title={Words.total_work_time}
                  value={utils.farsiNum(summary?.TotalWorkTime)}
                />
              </Col>
            </>
          )}
        </Row>
      </Spin>

      {showSearchModal && (
        <SearchModal
          onOk={handleAdvancedSearch}
          onCancel={() => setShowSearchModal(false)}
          isOpen={showSearchModal}
          filter={filter}
        />
      )}
    </>
  );
};

export default UserMyCardsReportPage;
