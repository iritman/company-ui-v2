import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import Words from "../../../../../resources/words";
import utils from "../../../../../tools/utils";
import service from "../../../../../services/official/timex/reports/user-my-reports-service";
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
import SearchModal from "./user-report-my-in-out-cards-search-modal";
import Colors from "./../../../../../resources/colors";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "MyInOutCards",
    data: records,
    columns: [
      {
        label: Words.in_reg_time,
        value: (record) => utils.colonTime(record.In_RegTime),
      },
      {
        label: Words.out_reg_time,
        value: (record) => utils.colonTime(record.Out_RegTime),
      },
      {
        label: Words.duration,
        value: (record) => utils.minToTime(record.Duration),
      },
    ],
  },
];

const baseColumns = [
  {
    title: Words.in_reg_time,
    width: 100,
    align: "center",
    dataIndex: "In_RegTime",
    sorter: getSorter("In_RegTime"),
    render: (In_RegTime) => (
      <Text>{utils.farsiNum(utils.colonTime(In_RegTime))}</Text>
    ),
  },
  {
    title: Words.out_reg_time,
    width: 100,
    align: "center",
    dataIndex: "Out_RegTime",
    sorter: getSorter("Out_RegTime"),
    render: (Out_RegTime) => (
      <Text>{utils.farsiNum(utils.colonTime(Out_RegTime))}</Text>
    ),
  },
  {
    title: Words.duration,
    width: 100,
    align: "center",
    dataIndex: "Duration",
    sorter: getSorter("Duration"),
    render: (Duration) => (
      <Text style={{ color: Colors.green[6] }}>
        {utils.farsiNum(utils.minToTime(Duration))}
      </Text>
    ),
  },
];

const recordID = "";

const UserReportMyInOutCardsPage = ({ pageName }) => {
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
    showSearchModal,
    setShowSearchModal,
    filter,
    setFilter,
  } = usePageContext();

  useMount(async () => {
    handleResetContext();
    await checkAccess(setAccess, pageName);
  });

  const { handleResetContext } = GetSimplaDataPageMethods({
    service,
    recordID,
  });

  const columns = access
    ? getColumns(baseColumns, null, access, null, null, null, null)
    : [];

  const handleClear = () => {
    setRecords([]);
    setFilter(null);
    setSearched(false);
  };

  const handleSearch = async (filter) => {
    setFilter(filter);
    setShowSearchModal(false);

    setProgress(true);

    try {
      const data = await service.getMyInOutCards(filter);

      setRecords(data);
      setSearched(true);
    } catch (err) {
      handleError(err);
    }

    setProgress(false);
  };

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.report_my_in_out_cards}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="MyInOutCards"
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
        </Row>
      </Spin>

      {showSearchModal && (
        <SearchModal
          onOk={handleSearch}
          onCancel={() => setShowSearchModal(false)}
          isOpen={showSearchModal}
          filter={filter}
        />
      )}
    </>
  );
};

export default UserReportMyInOutCardsPage;
