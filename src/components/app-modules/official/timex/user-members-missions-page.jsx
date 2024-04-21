import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, message } from "antd";
import Words from "../../../../resources/words";
import service from "../../../../services/official/timex/user-members-missions-service";
import {
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import { usePageContext } from "../../../contexts/page-context";
import SearchModal from "./user-members-missions-search-modal";
import DetailsModal from "./user-members-missions-details-modal";
import { getSheets, baseColumns } from "../../../common/missions-page-items";
import DetailsButton from "../../../common/details-button";
import WorkTimeStatistics from "../../../common/work-time-statistics";

const handleCheckEditable = (row) => false;
const handleCheckDeletable = (row) => false;

const recordID = "MissionID";

const UserMembersMissionsPage = ({ pageName }) => {
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
  });

  const { handleResetContext, handleAdvancedSearch } = GetSimplaDataPageMethods(
    {
      service,
      recordID,
    }
  );

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

  const handleClear = () => {
    setRecords([]);
    setFilter(null);
    setSearched(false);
  };

  //------

  const handleSaveNote = async (note) => {
    const data = await service.saveNote(note);

    const index = records.findIndex(
      (m) => m.Notes.findIndex((r) => r.NoteID === note.NoteID) !== -1
    );
    records[index] = data;

    setSelectedObject(data);

    message.success(Words.messages.your_note_submitted);
  };

  const handleDeleteNote = async (note) => {
    const data = await service.deleteNote(note.NoteID);

    const index = records.findIndex((m) => (m.MissionID = note.MissionID));
    records[index] = data;

    setSelectedObject(data);

    message.success(Words.messages.note_deleted);
  };

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.members_missions}
            sheets={getSheets(records, "MembersMissions")}
            fileName="MembersMissions"
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

      {showDetails && (
        <DetailsModal
          onOk={() => {
            setShowDetails(false);
            setSelectedObject(null);
          }}
          isOpen={showDetails}
          mission={selectedObject}
          onSaveNote={handleSaveNote}
          onDeleteNote={handleDeleteNote}
        />
      )}
    </>
  );
};

export default UserMembersMissionsPage;
