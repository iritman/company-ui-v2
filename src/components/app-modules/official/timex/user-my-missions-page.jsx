import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, message } from "antd";
import Words from "../../../../resources/words";
import service from "../../../../services/official/timex/user-my-missions-service";
import {
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import { usePageContext } from "../../../contexts/page-context";
import MissionModal from "./user-my-mission-modal";
import SearchModal from "./user-my-mission-search-modal";
import DetailsModal from "./user-my-mission-details-modal";
import { getSheets, baseColumns } from "../../../common/missions-page-items";
import DetailsButton from "../../../common/details-button";
import WorkTimeStatistics from "../../../common/work-time-statistics";

const handleCheckEditable = (row) => row.Editable;
const handleCheckDeletable = (row) => row.Deletable;

const recordID = "MissionID";

const UserMyMissionsPage = ({ pageName }) => {
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
      <>
        {record.RegTypeID !== 1 && (
          <DetailsButton
            record={record}
            setSelectedObject={setSelectedObject}
            setShowDetails={setShowDetails}
          />
        )}
      </>
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

  const handleSaveReport = async (report) => {
    const data = await service.saveReport(report);

    const index = records.findIndex((m) => (m.MissionID = report.MissionID));
    records[index] = data;

    setSelectedObject(data);

    message.success(Words.messages.your_report_submitted);
  };

  const handleDeleteReport = async (report) => {
    const data = await service.deleteReport(report.ReportID);

    const index = records.findIndex((m) => (m.MissionID = report.MissionID));
    records[index] = data;

    setSelectedObject(data);

    message.success(Words.messages.your_report_deleted);
  };

  const handleSaveSeenDateTime = async (note) => {
    const data = await service.saveNoteSeenDateTime(note);

    const index = records.findIndex((m) => (m.MissionID = note.MissionID));
    records[index] = data;

    setSelectedObject(data);
  };

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.my_missions}
            sheets={getSheets(records, "MyMissions")}
            fileName="MyMissions"
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
          <WorkTimeStatistics type="mission" data={records} />
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

      {showModal && (
        <MissionModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}

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
          onSaveSeenDateTime={handleSaveSeenDateTime}
        />
      )}
    </>
  );
};

export default UserMyMissionsPage;
