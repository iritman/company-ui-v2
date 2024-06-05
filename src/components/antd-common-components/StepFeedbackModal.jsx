import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Button, Space, Popconfirm, Col } from "antd";
import AntdModal from "../antd-form-components/AntdModal";
import { AntdControl, ControlType } from "../antd-form-components/AntdControl";
import Words from "../../resources/words";
import { handleError } from "../antd-general-components/FormManager";
import { QuestionCircleOutlined as QuestionIcon } from "@ant-design/icons";

const StepFeedbackModal = ({ open, modalType, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const form_data = Form.useWatch([], form) || {};

  const [progress, setProgress] = useState(false);

  // ----------

  useMount(() => {
    form.setFieldsValue({ DetailsText: "" });
  });

  const handleSubmit = async () => {
    setProgress(true);

    try {
      await onSubmit({ IsPassed: modalType === "approve", ...form_data });
    } catch (err) {
      handleError(err);
    }

    setProgress(false);
  };

  const getFooterButtons = () => {
    let result = (
      <Space>
        {modalType === "approve" ? (
          <Button type="primary" onClick={handleSubmit}>
            {Words.accept_request_with_note}
          </Button>
        ) : (
          modalType === "reject" && (
            <Popconfirm
              title={Words.questions.sure_to_cancel_request}
              onConfirm={handleSubmit}
              okText={Words.yes}
              cancelText={Words.no}
              icon={<QuestionIcon style={{ color: "red" }} />}
            >
              <Button
                type="primary"
                danger
                disabled={form_data.DetailsText?.length < 3}
              >
                {Words.reject_request}
              </Button>
            </Popconfirm>
          )
        )}

        <Button onClick={onCancel}>{Words.close}</Button>
      </Space>
    );

    return result;
  };

  // ----------

  return (
    <AntdModal
      open={open}
      title={Words.operation}
      progress={progress}
      width={600}
      footer={getFooterButtons()}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    >
      <AntdControl control={ControlType.Form} form={form}>
        <Col xs={24}>
          <AntdControl
            control={ControlType.TextArea}
            fieldName="DetailsText"
            title={Words.descriptions}
            rules={[{ required: modalType === "reject" }]}
            showCount
            maxLength={512}
          />
        </Col>
      </AntdControl>
    </AntdModal>
  );
};

export default StepFeedbackModal;
