import React, { useState } from "react";
import { Button, Modal } from "antd";
import {
  //   SnippetsOutlined as ReportIcon,
  MessageOutlined as MessageIcon,
} from "@ant-design/icons";
import Words from "../../../../../resources/words";
// import utils from "../../../../../tools/utils";
import PersonalTransferDetails from "./personal-transfer-details";
// import ReportsModal from "./user-personal-transfer-reports-modal";
import ResponseModal from "./user-personal-transfer-reg-response-modal";

const UserPersonalTransferDetailsModal = ({
  transfer,
  isOpen,
  onOk,
  onResponse,
}) => {
  const [showResponseModal, setShowResponseModal] = useState(false);

  const { Actions } = transfer;

  const getFooterButtons = () => {
    let buttons = [
      <Button key="close-button" onClick={onOk}>
        {Words.close}
      </Button>,
    ];

    if (Actions[3].MemberID > 0 && Actions[4].MemberID === 0) {
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

      {/* {showReportsModal && (
        <ReportsModal
          isOpen={showReportsModal}
          onRegReport={onRegReport}
          onDeleteReport={onDeleteReport}
          onCancel={() => setShowReportsModal(false)}
          transfer={transfer}
        />
      )} */}

      {showResponseModal && (
        <ResponseModal
          isOpen={showResponseModal}
          transfer={transfer}
          onOk={onResponse}
          onCancel={() => setShowResponseModal(false)}
        />
      )}
    </>
  );
};

export default UserPersonalTransferDetailsModal;
