import React, { useState } from "react";
import { Button, Modal } from "antd";
import {
  SnippetsOutlined as ReportIcon,
  ContainerOutlined as NoteIcon,
} from "@ant-design/icons";
import Words from "../../../../resources/words";
import ReportModal from "./user-my-missions-report-modal";
import NoteModal from "./user-my-missions-notes-modal";
import MissionDetails from "./../../../common/mission-details";

const UserMyMissionDetailsModal = ({
  onSaveSeenDateTime,
  onSaveReport,
  onDeleteReport,
  mission,
  isOpen,
  onOk,
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
      <Modal
        open={isOpen}
        maskClosable={false}
        centered={true}
        title={Words.more_details}
        footer={getFooterButtons()}
        onCancel={onOk}
        width={800}
      >
        <section>
          <article
            id="info-content"
            className="scrollbar-normal"
            style={{ maxHeight: "calc(100vh - 180px)" }}
          >
            <MissionDetails mission={mission} />
          </article>
        </section>
      </Modal>

      {showReportModal && (
        <ReportModal
          onOk={onSaveReport}
          onDelete={onDeleteReport}
          onCancel={() => setShowReportModal(false)}
          isOpen={showReportModal}
          mission={mission}
        />
      )}

      {showNoteModal && (
        <NoteModal
          onSeen={onSaveSeenDateTime}
          onCancel={() => setShowNoteModal(false)}
          isOpen={showNoteModal}
          mission={mission}
        />
      )}
    </>
  );
};

export default UserMyMissionDetailsModal;
