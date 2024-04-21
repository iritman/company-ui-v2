import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, message } from "antd";
import Words from "../../../../resources/words";
import service from "../../../../services/official/timex/user-members-new-missions-check-manager-service";
import {
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import { usePageContext } from "../../../contexts/page-context";
import DetailsModal from "./user-members-mission-new-reports-details-modal";
import { handleError } from "./../../../../tools/form-manager";
import { getSheets, baseColumns } from "./../../../common/missions-page-items";
import DetailsButton from "./../../../common/details-button";

const handleCheckEditable = (row) => false;
const handleCheckDeletable = (row) => false;

const recordID = "MissionID";

const UserMembersMissionNewReportsPage = ({ pageName }) => {
  const {
    progress,
    setProgress,
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
  } = usePageContext();

  useMount(async () => {
    handleResetContext();

    await checkAccess(setAccess, pageName);

    //------

    setProgress(true);

    try {
      const data = await service.getNewReports();

      setRecords(data);
      setSearched(true);
    } catch (err) {
      handleError(err);
    }

    setProgress(false);
  });

  const { handleResetContext } = GetSimplaDataPageMethods({
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
        null,
        null,
        handleCheckEditable,
        handleCheckDeletable
      )
    : [];

  //------

  const handleSaveReport = async (report) => {
    const data = await service.saveReportResponse(report);

    const index = records.findIndex(
      (m) =>
        m.ReportInfo.findIndex((r) => r.ReportID === report.ReportID) !== -1
    );
    records[index] = data;

    setSelectedObject(data);

    message.success(Words.messages.your_response_submitted);
  };

  const handleDeleteReport = async (report) => {
    const data = await service.deleteReport(report.ReportID);

    const index = records.findIndex((m) => (m.MissionID = report.MissionID));
    records[index] = data;

    setSelectedObject(data);

    message.success(Words.messages.your_report_deleted);
  };

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.mission_new_reports}
            sheets={getSheets(records, "MembersMissionsWithNewReports")}
            fileName="MembersMissionsWithNewReports"
            onSearch={null}
            onClear={null}
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

      {showDetails && (
        <DetailsModal
          onOk={() => {
            setShowDetails(false);
            setSelectedObject(null);
          }}
          isOpen={showDetails}
          mission={selectedObject}
          onSaveReport={handleSaveReport}
          onDeleteReport={handleDeleteReport}
        />
      )}
    </>
  );
};

export default UserMembersMissionNewReportsPage;
