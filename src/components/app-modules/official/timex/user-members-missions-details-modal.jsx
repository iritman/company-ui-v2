import React, { useState } from "react";
import { Button } from "antd";
import {
  SnippetsOutlined as ReportIcon,
  ContainerOutlined as NoteIcon,
} from "@ant-design/icons";
import Words from "../../../../resources/words";
import ReportModal from "./user-members-missions-report-modal";
import NoteModal from "./user-members-missions-notes-modal";
import ModalWindow from "../../../common/modal-window";
import MissionDetails from "./../../../common/mission-details";

const UserMembersMissionsDetailsModal = ({
  mission,
  isOpen,
  onOk,
  onSaveNote,
  onDeleteNote,
}) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);

  const getFooterButtons = () => {
    let footerButtons = [
      <Button
        key="note-button"
        type="primary"
        icon={<NoteIcon />}
        onClick={() => setShowNoteModal(true)}
      >
        {Words.notes}
      </Button>,
      <Button
        key="report-button"
        type="primary"
        icon={<ReportIcon />}
        danger
        onClick={() => setShowReportModal(true)}
      >
        {Words.mission_report}
      </Button>,
      <Button key="close-button" onClick={onOk}>
        {Words.close}
      </Button>,
    ];

    return footerButtons;
  };

  return (
    <>
      <ModalWindow
        open={isOpen}
        maskClosable={false}
        centered={true}
        title={Words.more_details}
        footer={getFooterButtons()}
        onCancel={onOk}
        width={750}
      >
        <MissionDetails mission={mission} />
      </ModalWindow>

      {showNoteModal && (
        <NoteModal
          onCancel={() => setShowNoteModal(false)}
          isOpen={showNoteModal}
          mission={mission}
          onSaveNote={onSaveNote}
          onDeleteNote={onDeleteNote}
        />
      )}

      {showReportModal && (
        <ReportModal
          onCancel={() => setShowReportModal(false)}
          isOpen={showReportModal}
          mission={mission}
        />
      )}
    </>
  );
};

export default UserMembersMissionsDetailsModal;
