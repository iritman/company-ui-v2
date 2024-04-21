import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, message } from "antd";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import service from "../../../../../services/official/processes/user-official-check-violations-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../../tools/form-manager";
import SimpleDataTable from "../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../common/simple-data-page-header";
import { usePageContext } from "../../../../contexts/page-context";
import SearchModal from "./user-official-check-violations-search-modal";
import DetailsModal from "./user-official-check-violation-details-modal";
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
    title: "Violations",
    data: records,
    columns: [
      { label: Words.id, value: "ViolationID" },
      {
        label: Words.violation_person,
        value: (record) =>
          `${record.ViolationFirstName} ${record.ViolationLastName}`,
      },
      { label: Words.status, value: (record) => getFinalStatusTitle(record) },
      {
        label: Words.reg_member,
        value: (record) => `${record.RegFirstName} ${record.RegLastName}`,
      },
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
    dataIndex: "ViolationID",
    sorter: getSorter("ViolationID"),
    render: (ViolationID) => <Text>{utils.farsiNum(`${ViolationID}`)}</Text>,
  },
  {
    title: Words.reg_member,
    width: 200,
    align: "center",
    sorter: getSorter("RegLastName"),
    render: (record) => (
      <Text
        style={{ color: Colors.cyan[6] }}
      >{`${record.RegFirstName} ${record.RegLastName}`}</Text>
    ),
  },
  {
    title: Words.violation_person,
    width: 200,
    align: "center",
    sorter: getSorter("ViolationLastName"),
    render: (record) => (
      <Text
        style={{ color: Colors.red[6] }}
      >{`${record.ViolationFirstName} ${record.ViolationLastName}`}</Text>
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

const handleCheckEditable = (row) => false;
const handleCheckDeletable = (row) => false;

const recordID = "ViolationID";

const UserOfficialCheckViolationsPage = ({ pageName }) => {
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
    showSearchModal,
    setShowSearchModal,
    filter,
    setFilter,
  } = usePageContext();

  useMount(async () => {
    handleResetContext();
    await checkAccess(setAccess, pageName);

    const inprogress_violations_filter = {
      RegMemberID: 0,
      ViolationMemberID: 0,
      FinalStatusID: 1,
      FromDate: "",
      ToDate: "",
    };

    await handleAdvancedSearch(inprogress_violations_filter);
  });

  const { handleEdit, handleDelete, handleResetContext, handleAdvancedSearch } =
    GetSimplaDataPageMethods({
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

  const handleSubmitResponse = (response) => {
    const index = records.findIndex(
      (r) => r.ViolationID === response.ViolationID
    );
    records[index] = response;
    setRecords([...records]);
    setSelectedObject(response);
  };

  const handleRegReport = async (report) => {
    const newReport = await service.saveReport(report);

    const index = records.findIndex(
      (r) => r.ViolationID === report.ViolationID
    );

    records[index].Reports = [...records[index].Reports, newReport];
    records[index].Reports.sort((a, b) => (a.ReportID > b.ReportID ? -1 : 1));

    setRecords([...records]);
    setSelectedObject(records[index]);
  };

  const handleDeleteReport = async (report) => {
    const data = await service.deleteReport(report.ReportID);

    const index = records.findIndex(
      (r) => r.ViolationID === report.ViolationID
    );

    records[index].Reports = records[index].Reports.filter(
      (r) => r.ReportID !== report.ReportID
    );
    records[index].Reports.sort((a, b) => (a.ReportID > b.ReportID ? -1 : 1));

    setRecords([...records]);
    setSelectedObject(records[index]);

    message.success(data.Message);
  };

  const handleRegAnnouncement = async (announce) => {
    const newAnnounce = await service.saveAnnounce(announce);

    const index = records.findIndex(
      (r) => r.ViolationID === announce.ViolationID
    );

    records[index].AnnounceInfo = newAnnounce;

    setRecords([...records]);
    setSelectedObject(records[index]);
  };

  const handleDeleteAnnouncement = async (announce) => {
    const data = await service.deleteAnnounce(announce.AnnounceID);

    const index = records.findIndex(
      (r) => r.ViolationID === announce.ViolationID
    );

    records[index].AnnounceInfo = null;

    setRecords([...records]);
    setSelectedObject(records[index]);

    message.success(data.Message);
  };

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.violations_official}
            sheets={getSheets(records)}
            fileName="Violations"
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
          onRegReport={handleRegReport}
          onDeleteReport={handleDeleteReport}
          onRegAnnouncement={handleRegAnnouncement}
          onDeleteAnnouncement={handleDeleteAnnouncement}
          onResponse={handleSubmitResponse}
          isOpen={showDetails}
          violation={selectedObject}
        />
      )}
    </>
  );
};

export default UserOfficialCheckViolationsPage;
