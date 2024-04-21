import React, { useState } from "react";
import { Button, Modal } from "antd";
import {
  SnippetsOutlined as ReportIcon,
  MessageOutlined as MessageIcon,
} from "@ant-design/icons";
import Words from "../../../../../resources/words";
import utils from "../../../../../tools/utils";
import ReportsModal from "./user-official-check-checkout-reports-modal";
import CheckoutDetails from "./checkout-details";
import ResponseModal from "./user-official-check-checkout-reg-response-modal";

const UserOfficialCheckCheckoutDetailsModal = ({
  checkout,
  isOpen,
  onOk,
  onRegReport,
  onDeleteReport,
  onResponse,
}) => {
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);

  const { Actions, Reports } = checkout;

  const getFooterButtons = () => {
    let buttons = [
      <Button key="close-button" onClick={onOk}>
        {Words.close}
      </Button>,
    ];

    if (
      Actions[1].MemberID > 0 &&
      Actions[2].MemberID > 0 &&
      Actions[3].MemberID === 0
    ) {
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
        width={750}
      >
        <section>
          <article
            id="info-content"
            className="scrollbar-normal"
            style={{ maxHeight: "calc(100vh - 180px)" }}
          >
            <CheckoutDetails checkout={checkout} />
          </article>
        </section>
      </Modal>

      {showReportsModal && (
        <ReportsModal
          isOpen={showReportsModal}
          onRegReport={onRegReport}
          onDeleteReport={onDeleteReport}
          onCancel={() => setShowReportsModal(false)}
          checkout={checkout}
        />
      )}

      {showResponseModal && (
        <ResponseModal
          isOpen={showResponseModal}
          onOk={onResponse}
          onCancel={() => setShowResponseModal(false)}
          checkout={checkout}
        />
      )}
    </>
  );
};

export default UserOfficialCheckCheckoutDetailsModal;
