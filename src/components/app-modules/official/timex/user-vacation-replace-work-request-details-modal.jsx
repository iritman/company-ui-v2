import React, { useState } from "react";
import { Button, Modal } from "antd";
import { PlusOutlined as PlusIcon } from "@ant-design/icons";
import Words from "../../../../resources/words";
import ResponseModal from "./user-vacation-replace-work-request-response-modal";
import VacationDetails from "../../../common/vacation-details";

const UserVacationReplaceWorkRequestDetailsModal = ({
  vacation,
  isOpen,
  onOk,
  onResponse,
}) => {
  const [showModal, setShowModal] = useState(false);

  const canResponse = () => {
    const { Actions } = vacation;

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
            <VacationDetails vacation={vacation} />
          </article>
        </section>
      </Modal>

      {showModal && (
        <ResponseModal
          onOk={onResponse}
          onCancel={() => setShowModal(false)}
          isOpen={showModal}
          vacation={vacation}
        />
      )}
    </>
  );
};

export default UserVacationReplaceWorkRequestDetailsModal;
