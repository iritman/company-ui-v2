import React, { useState } from "react";
import { Button, Modal } from "antd";
import {
  SnippetsOutlined as ReportIcon,
  MessageOutlined as MessageIcon,
} from "@ant-design/icons";
import Words from "../../../../../resources/words";
import utils from "../../../../../tools/utils";
import PersonalTransferDetails from "./personal-transfer-details";
import ResponseModal from "./user-official-check-personal-transfer-reg-response-modal";
import ReportsModal from "./user-official-check-personal-transfer-reports-modal";

const UserOfficialCheckPersonalTransferDetailsModal = ({
  transfer,
  isOpen,
  onOk,
  onRegReport,
  onDeleteReport,
  onResponse,
}) => {
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);

  const { Actions, Reports } = transfer;

  const getFooterButtons = () => {
    let buttons = [
      <Button key="close-button" onClick={onOk}>
        {Words.close}
      </Button>,
    ];

    if (Actions[2].MemberID === 0 || Actions[5].MemberID === 0) {
      buttons = [
        <Button
          key="response-button"
          type="primary"
          onClick={() => setShowResponseModal(true)}
          icon={<MessageIcon />}
        >
          {`${Words.submit_response}`}
        </Button>,
        ...buttons,
      ];
    }

    buttons = [
      <Button
        key="reports-button"
        type="primary"
        danger
        onClick={() => setShowReportsModal(true)}
        icon={<ReportIcon />}
      >
        {`${Words.reports}${
          Reports.length > 0 ? utils.farsiNum(` (${Reports.length})`) : ""
        }`}
      </Button>,
      ...buttons,
    ];

    return buttons;
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
        width={950}
      >
        <section>
          <article
            id="info-content"
            className="scrollbar-normal"
            style={{ maxHeight: "calc(100vh - 180px)" }}
          >
            <PersonalTransferDetails transfer={transfer} />
          </article>
        </section>
      </Modal>

      {showReportsModal && (
        <ReportsModal
          isOpen={showReportsModal}
          onRegReport={onRegReport}
          onDeleteReport={onDeleteReport}
          onCancel={() => setShowReportsModal(false)}
          transfer={transfer}
        />
      )}

      {showResponseModal && (
        <ResponseModal
          isOpen={showResponseModal}
          onOk={onResponse}
          onCancel={() => setShowResponseModal(false)}
          transfer={transfer}
        />
      )}
    </>
  );
};

export default UserOfficialCheckPersonalTransferDetailsModal;
