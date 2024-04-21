import React from "react";
import { Button, Modal } from "antd";
import Words from "../../resources/words";
import VacationDetails from "./vacation-details";

const VacationDetailsModal = ({ vacation, isOpen, onOk }) => {
  return (
    <Modal
      open={isOpen}
      maskClosable={false}
      centered={true}
      title={Words.more_details}
      footer={[
        <Button key="close-button" type="primary" onClick={onOk}>
          {Words.close}
        </Button>,
      ]}
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
  );
};

export default VacationDetailsModal;
