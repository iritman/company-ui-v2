import React, { useState } from "react";
import { Button, Modal } from "antd";
import { MessageOutlined as MessageIcon } from "@ant-design/icons";
import Words from "../../../../../resources/words";
import PersonalTransferDetails from "./personal-transfer-details";
import ResponseModal from "./user-department-personal-transfer-reg-response-modal";

const UserDepartmentPersonalTransferDetailsModal = ({
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

    if (
      (transfer.IsSupervisor && transfer.Actions[0].MemberID === 0) ||
      (transfer.IsManager && transfer.Actions[1].MemberID === 0)
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
        width={850}
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

export default UserDepartmentPersonalTransferDetailsModal;
