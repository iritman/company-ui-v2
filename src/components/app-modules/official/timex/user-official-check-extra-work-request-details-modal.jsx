import React from "react";
import { Button } from "antd";
import Words from "../../../../resources/words";
import ModalWindow from "../../../common/modal-window";
import ExtraWorkRequestDetails from "./extra-work-request-details";

const UserOfficialCheckExtraWorkRequestDetailsModal = ({
  extraWorkRequest,
  isOpen,
  onOk,
}) => {
  return (
    <>
      <ModalWindow
        open={isOpen}
        maskClosable={false}
        centered={true}
        title={Words.more_details}
        footer={[
          <Button key="close-button" onClick={onOk}>
            {Words.close}
          </Button>,
        ]}
        onCancel={onOk}
        width={750}
      >
        <ExtraWorkRequestDetails extraWorkRequest={extraWorkRequest} />
      </ModalWindow>
    </>
  );
};

export default UserOfficialCheckExtraWorkRequestDetailsModal;
