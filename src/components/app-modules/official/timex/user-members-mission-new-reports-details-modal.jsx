import React, { useState } from "react";
import { Button, Modal } from "antd";
import { SnippetsOutlined as ReportIcon } from "@ant-design/icons";
import Words from "../../../../resources/words";
import ReportModal from "./user-members-mission-new-reports-modal";
import MissionDetails from "./../../../common/mission-details";

const UserMembersMissionNewReportsDetailsModal = ({
  onSaveReport,
  onDeleteReport,
  mission,
  isOpen,
  onOk,
}) => {
  const [showModal, setShowModal] = useState(false);

  const getFooterButtons = () => {
    let footerButtons = [
      <Button
        key="submit-button"
        type="primary"
        icon={<ReportIcon />}
        danger
        onClick={() => setShowModal(true)}
      >
        {Words.mission_report}
      </Button>,
      <Button key="close-button" type="primary" onClick={onOk}>
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

      {showModal && (
        <ReportModal
          onOk={onSaveReport}
          onDelete={onDeleteReport}
          onCancel={() => setShowModal(false)}
          isOpen={showModal}
          mission={mission}
        />
      )}
    </>
  );
};

export default UserMembersMissionNewReportsDetailsModal;
