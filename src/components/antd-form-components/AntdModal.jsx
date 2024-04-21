import React from "react";
import { Button, Modal, Spin } from "antd";
import Words from "../../resources/words";
import SearchModalHeader from "../antd-common-components/SearchModalHeader";
import EditModalHeader from "../antd-common-components/EditModalHeader";
import RegModalHeader from "../antd-common-components/RegModalHeader";

const ModalTitle = ({ searchModal, editMode }) => {
  let title = <></>;

  if (searchModal) title = <SearchModalHeader />;
  else title = editMode ? <EditModalHeader /> : <RegModalHeader />;

  return title;
};

const AntdModal = (props) => {
  const {
    open,
    title,
    initialValues,
    progress,
    disabled,
    footer,
    buttons,
    confirm,
    searchModal,
    editMode,
    onSubmit,
    onCancel,
    onClear,
    ...rest
  } = props;

  return (
    <Modal
      open={open}
      title={
        title || <ModalTitle searchModal={searchModal} editMode={editMode} />
      }
      progress={progress}
      // okText="ثبت"
      // cancelText="انصراف"
      //   okButtonProps={{
      //     autoFocus: true,
      //   }}
      destroyOnClose
      centered={true}
      footer={
        footer || [
          buttons || <React.Fragment key="empty" />,
          <Button key="clear-button" onClick={onClear}>
            {Words.clear}
          </Button>,
          confirm || (
            <Button
              key="submit-button"
              type="primary"
              onClick={onSubmit}
              loading={progress}
              disabled={disabled}
            >
              {searchModal ? Words.search : Words.submit}
            </Button>
          ),
        ]
      }
      onCancel={onCancel}
      {...rest}
    >
      <section>
        <article
          id="modal-content"
          className="scrollbar-normal"
          style={{ maxHeight: "calc(100vh - 180px)" }}
        >
          <Spin spinning={progress}>{props.children}</Spin>
        </article>
      </section>
    </Modal>
  );
};

export default AntdModal;
