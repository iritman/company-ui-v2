import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import service from "../../../../../services/official/processes/user-edu-funds-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../../tools/form-manager";
import SimpleDataTable from "../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../common/simple-data-page-header";
import { usePageContext } from "../../../../contexts/page-context";
import EduFundModal from "./user-edu-fund-modal";
import SearchModal from "./user-edu-funds-search-modal";
import DetailsModal from "./user-edu-fund-details-modal";
import DetailsButton from "../../../../common/details-button";
import utils from "../../../../../tools/utils";

const { Text } = Typography;

const getFinalStatusColor = (record) => {
  let color = Colors.grey[6];

  const { FinalStatusID } = record;

  if (FinalStatusID > 1) {
    color = FinalStatusID === 2 ? Colors.green[6] : Colors.red[6];
  }

  return color;
};

const getFinalStatusTitle = (record) => {
  let title = Words.in_progress;

  const { FinalStatusID } = record;

  if (FinalStatusID > 1) {
    title = FinalStatusID === 2 ? Words.accepted : Words.rejected;
  }

  return title;
};

const getSheets = (records) => [
  {
    title: "EduFunds",
    data: records,
    columns: [
      { label: Words.id, value: "FundID" },
      {
        label: Words.edu_level,
        value: "EduLevelTitle",
      },
      { label: Words.status, value: (record) => getFinalStatusTitle(record) },
      {
        label: Words.reg_date,
        value: (record) => utils.slashDate(record.RegDate),
      },
      {
        label: Words.reg_time,
        value: (record) => utils.colonTime(record.RegTime),
      },
      { label: Words.descriptions, value: "DetailsText" },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 75,
    align: "center",
    dataIndex: "FundID",
    sorter: getSorter("FundID"),
    render: (FundID) => <Text>{utils.farsiNum(`${FundID}`)}</Text>,
  },
  {
    title: Words.edu_level,
    width: 200,
    align: "center",
    dataIndex: "EduLevelTitle",
    sorter: getSorter("EduLevelTitle"),
    render: (EduLevelTitle) => (
      <Text style={{ color: Colors.blue[7] }}>{EduLevelTitle}</Text>
    ),
  },
  {
    title: Words.status,
    width: 100,
    align: "center",
    render: (record) => (
      <Text style={{ color: getFinalStatusColor(record) }}>
        {getFinalStatusTitle(record)}
      </Text>
    ),
  },
];

const handleCheckEditable = (row) => row.Editable;
const handleCheckDeletable = (row) => row.Deletable;

const recordID = "FundID";

const UseEduFundsPage = ({ pageName }) => {
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
    showDetails,
    setShowDetails,
    showModal,
    showSearchModal,
    setShowSearchModal,
    filter,
    setFilter,
  } = usePageContext();

  useMount(async () => {
    handleResetContext();
    await checkAccess(setAccess, pageName);

    const inprogress_edu_funds_filter = {
      EduLevelID: 0,
      FinalStatusID: 1,
      FromDate: "",
      ToDate: "",
    };

    await handleAdvancedSearch(inprogress_edu_funds_filter);
  });

  const {
    handleCloseModal,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSave,
    handleResetContext,
    handleAdvancedSearch,
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
        handleDelete,
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
            title={Words.edu_fund}
            sheets={getSheets(records)}
            fileName="EduFunds"
            onSearch={() => setShowSearchModal(true)}
            onClear={handleClear}
            onGetAll={null}
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
        <EduFundModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}

      {showSearchModal && (
        <SearchModal
          onOk={handleAdvancedSearch}
          onCancel={() => setShowSearchModal(false)}
          isOpen={showSearchModal}
          filter={filter}
        />
      )}

      {showDetails && (
        <DetailsModal
          onOk={() => {
            setShowDetails(false);
            setSelectedObject(null);
          }}
          isOpen={showDetails}
          eduFund={selectedObject}
        />
      )}
    </>
  );
};

export default UseEduFundsPage;
