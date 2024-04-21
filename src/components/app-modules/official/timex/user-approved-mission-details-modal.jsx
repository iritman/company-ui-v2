import React from "react";
import { Button } from "antd";
import Words from "../../../../resources/words";
import ModalWindow from "../../../common/modal-window";
import MissionDetails from "./../../../common/mission-details";

const UserApprovedMissionDetailsModal = ({ mission, isOpen, onOk }) => {
  const getFooterButtons = () => {
    let footerButtons = [
      <Button key="close-button" onClick={onOk}>
        {Words.close}
      </Button>,
    ];

    return footerButtons;
  };

  return (
    <ModalWindow
      open={isOpen}
      maskClosable={false}
      centered={true}
      title={Words.more_details}
      footer={getFooterButtons()}
      onCancel={onOk}
      width={750}
    >
      <MissionDetails mission={mission} securityPersonView={true} />
    </ModalWindow>
  );
};

export default UserApprovedMissionDetailsModal;
