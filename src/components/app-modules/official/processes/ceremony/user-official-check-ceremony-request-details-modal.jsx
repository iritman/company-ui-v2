import React, { useState } from "react";
import { Button, Modal } from "antd";
import {
  SnippetsOutlined as ReportIcon,
  MessageOutlined as MessageIcon,
} from "@ant-design/icons";
import Words from "../../../../../resources/words";
import utils from "../../../../../tools/utils";
import CeremonyRequestDetails from "./ceremony-request-details";
import ResponseModal from "./user-official-check-ceremony-request-reg-response-modal";
import ReportsModal from "./user-official-check-ceremony-request-reports-modal";

const UserOfficialCheckCeremonyRequestDetailsModal = ({
  request,
  isOpen,
  onOk,
  onRegReport,
  onDeleteReport,
  onResponse,
}) => {
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);

  const { Reports, Actions } = request;

  const getFooterButtons = () => {
    let buttons = [
      <Button key="close-button" onClick={onOk}>
        {Words.close}
      </Button>,
    ];

    if (Actions[0].MemberID === 0) {
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
        width={900}
      >
        <section>
          <article
            id="info-content"
            className="scrollbar-normal"
            style={{ maxHeight: "calc(100vh - 180px)" }}
          >
            <CeremonyRequestDetails request={request} />
          </article>
        </section>
      </Modal>

      {showResponseModal && (
        <ResponseModal
          isOpen={showResponseModal}
          onOk={onResponse}
          onCancel={() => setShowResponseModal(false)}
          request={request}
        />
      )}

      {showReportsModal && (
        <ReportsModal
          isOpen={showReportsModal}
          onRegReport={onRegReport}
          onDeleteReport={onDeleteReport}
          onCancel={() => setShowReportsModal(false)}
          request={request}
        />
      )}
    </>
  );
};

export default UserOfficialCheckCeremonyRequestDetailsModal;
