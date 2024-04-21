import React, { useState } from "react";
import { Button, Modal } from "antd";
import { MessageOutlined as MessageIcon } from "@ant-design/icons";
import Words from "../../../../../resources/words";
import ManagementTransferDetails from "./management-transfer-details";
import ResponseModal from "./user-store-management-transfer-reg-response-modal";

const UserStoreManagementTransferDetailsModal = ({
  transfer,
  isOpen,
  onOk,
  onResponse,
}) => {
  const [showResponseModal, setShowResponseModal] = useState(false);

  const getFooterButtons = () => {
    let buttons = [
      <Button key="close-button" onClick={onOk}>
        {Words.close}
      </Button>,
    ];

    if (transfer.Actions[0].MemberID === 0) {
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
        width={750}
      >
        <section>
          <article
            id="info-content"
            className="scrollbar-normal"
            style={{ maxHeight: "calc(100vh - 180px)" }}
          >
            <ManagementTransferDetails
              transfer={transfer}
              bannedSteps={[{ StepID: 3 }]}
            />
          </article>
        </section>
      </Modal>

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

export default UserStoreManagementTransferDetailsModal;
