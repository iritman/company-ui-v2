import React from "react";
import { useMount } from "react-use";
import { Button, Modal } from "antd";
import Words from "../../../../../resources/words";
import ManagementTransferDetails from "./management-transfer-details";

const UserDepartmentManagementTransferDetailsModal = ({
  transfer,
  isOpen,
  onOk,
  onSeen,
}) => {
  useMount(async () => {
    if (!transfer.IsSeen) {
      try {
        await onSeen();
      } catch (err) {
        //  handleError(err);
      }
    }
  });

  const getFooterButtons = () => {
    let buttons = [
      <Button key="close-button" onClick={onOk}>
        {Words.close}
      </Button>,
    ];

    return buttons;
  };

  return (
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
          <ManagementTransferDetails transfer={transfer} />
        </article>
      </section>
    </Modal>
  );
};

export default UserDepartmentManagementTransferDetailsModal;
