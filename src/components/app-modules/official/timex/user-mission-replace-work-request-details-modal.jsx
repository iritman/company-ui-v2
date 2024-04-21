import React, { useState } from "react";
import { Button, Modal } from "antd";
import { PlusOutlined as PlusIcon } from "@ant-design/icons";
import Words from "../../../../resources/words";
import ResponseModal from "./user-mission-replace-work-request-response-modal";
import MissionDetails from "../../../common/mission-details";

const UserMissionReplaceWorkRequestDetailsModal = ({
  mission,
  isOpen,
  onOk,
  onResponse,
}) => {
  const [showModal, setShowModal] = useState(false);

  const canResponse = () => {
    const { Actions } = mission;

    const swapMemberAction = Actions.filter((action) => action.StepID === 1)[0];

    return swapMemberAction.MemberID === 0;
  };

  const getFooterButtons = () => {
    let footerButtons = [
      <Button key="close-button" type="primary" onClick={onOk}>
        {Words.close}
      </Button>,
    ];

    if (canResponse()) {
      footerButtons = [
        <Button
          key="submit-button"
          type="primary"
          icon={<PlusIcon />}
          danger
          onClick={() => setShowModal(true)}
        >
          {Words.submit_response}
        </Button>,
        ...footerButtons,
      ];
    }

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
        <ResponseModal
          onOk={onResponse}
          onCancel={() => setShowModal(false)}
          isOpen={showModal}
          mission={mission}
        />
      )}
    </>
  );
};

export default UserMissionReplaceWorkRequestDetailsModal;
