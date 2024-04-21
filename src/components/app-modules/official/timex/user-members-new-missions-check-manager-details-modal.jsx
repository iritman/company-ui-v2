import React, { useState } from "react";
import { useMount } from "react-use";
import { Button, Modal } from "antd";
import { PlusOutlined as PlusIcon } from "@ant-design/icons";
import Words from "../../../../resources/words";
import service from "./../../../../services/official/timex/user-members-new-missions-check-manager-service";
import ResponseModal from "./user-members-new-missions-check-manager-response-modal";
import MissionDetails from "./../../../common/mission-details";

const UserMembersNewMissionsCheckManagerDetailsModal = ({
  mission,
  isOpen,
  onOk,
  onResponse,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [role, setRole] = useState({
    IsDepartmentManager: false,
    IsDepartmentSupervisor: false,
  });

  useMount(async () => {
    try {
      const data = await service.getRole();

      setRole(data);
    } catch {
      //---
    }
  });

  const { Actions } = mission;

  const canResponse = () => {
    let result = false;

    if (role.IsDepartmentManager) {
      const managerAction = Actions.filter((action) => action.StepID === 2)[0];

      if (managerAction.MemberID === 0) result = true;
    }

    return result;
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

export default UserMembersNewMissionsCheckManagerDetailsModal;
