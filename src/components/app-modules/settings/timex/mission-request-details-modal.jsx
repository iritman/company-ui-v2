import React, { useState } from "react";
import { Button, Modal } from "antd";
import {
  SnippetsOutlined as ReportIcon,
  ContainerOutlined as NoteIcon,
} from "@ant-design/icons";
import Words from "../../../../resources/words";
import MissionDetails from "./../../../common/mission-details";
import NotesModal from "./mission-request-notes-modal";
import ReportsModal from "./mission-request-reports-modal";

const MissionDetailsModal = ({ mission, isOpen, onOk }) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);

  return (
    <>
      <Modal
        open={isOpen}
        maskClosable={false}
        centered={true}
        title={Words.more_details}
        footer={[
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
          <Button key="close-button" type="primary" onClick={onOk}>
            {Words.close}
          </Button>,
        ]}
        onCancel={onOk}
        width={750}
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

      {showNoteModal && (
        <NotesModal
          onCancel={() => setShowNoteModal(false)}
          isOpen={showNoteModal}
          mission={mission}
        />
      )}

      {showReportModal && (
        <ReportsModal
          onCancel={() => setShowReportModal(false)}
          isOpen={showReportModal}
          mission={mission}
        />
      )}
    </>
  );
};

export default MissionDetailsModal;
