import React, { useState } from "react";
import { useMount } from "react-use";
import {
  Row,
  Col,
  Modal,
  Typography,
  Button,
  Alert,
  Descriptions,
  Popconfirm,
  Space,
  Select,
  Spin,
} from "antd";
import { QuestionCircleOutlined as QuestionIcon } from "@ant-design/icons";
import { useModalContext } from "../../../contexts/modal-context";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import { handleError } from "./../../../../tools/form-manager";

const { Text } = Typography;
const { Option } = Select;
const valueColor = Colors.cyan[6];

const WorkShiftModal = ({
  isOpen,
  selectedObject,
  access,
  workHours,
  onOk,
  onSave,
  onDelete,
}) => {
  const { progress, setProgress } = useModalContext();

  const [selectedHourID, setSelectedHourID] = useState(0);

  useMount(() => {
    setProgress(false);
  });

  const { workShift } = selectedObject;

  const getFooterButtons = () => {
    let buttons = [
      <Button key="submit-button" onClick={onOk}>
        {Words.close}
      </Button>,
    ];

    if (workShift) {
      if (access.CanDelete)
        buttons = [
          <Popconfirm
            title={Words.questions.sure_to_delete_work_shift}
            onConfirm={handleDeleteWorkShift}
            okText={Words.yes}
            cancelText={Words.no}
            icon={<QuestionIcon style={{ color: "red" }} />}
            key="delete-button"
          >
            <Button type="primary" danger>
              {Words.delete}
            </Button>
          </Popconfirm>,
          ...buttons,
        ];

      //   if (access.CanEdit)
      //     buttons = [
      //       <Button key="edit-button" type="primary" onClick={onOk}>
      //         {Words.edit}
      //       </Button>,
      //       ...buttons,
      //     ];
    }

    return buttons;
  };

  const handleWorkHourChange = (value) => {
    setSelectedHourID(value);
  };

  const handleSaveWorkShift = async () => {
    setProgress(true);
    try {
      await onSave(selectedHourID);
    } catch (ex) {
      handleError(ex);
    }
    setProgress(false);
  };

  const handleDeleteWorkShift = async () => {
    setProgress(true);
    try {
      await onDelete();
    } catch (ex) {
      handleError(ex);
    }
    setProgress(false);
  };

  return (
    <Modal
      open={isOpen}
      maskClosable={false}
      centered={true}
      title={Words.work_shift}
      footer={getFooterButtons()}
      onCancel={onOk}
      width={650}
    >
      <section>
        <article
          id="info-content"
          className="scrollbar-normal"
          style={{ maxHeight: "calc(100vh - 180px)" }}
        >
          <Spin spinning={progress}>
            <Row gutter={[10, 10]}>
              {!workShift && (
                <>
                  <Col xs={24}>
                    <Alert
                      message={Words.messages.no_work_shift_defined}
                      type="warning"
                      showIcon
                    />
                  </Col>
                  <Col xs={24}>
                    <Space>
                      <Select
                        allowClear
                        showSearch
                        style={{ width: "100%" }}
                        placeholder={Words.work_hours}
                        optionFilterProp="children"
                        onChange={(selectedValue) =>
                          handleWorkHourChange(selectedValue)
                        }
                        filterOption={(input, option) =>
                          option?.children
                            ?.toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        <Option key={`hour_id_0`} value={0}>
                          {Words.select_please}
                        </Option>
                        {workHours.map((whour) => (
                          <Option
                            key={`hour_id_${whour.HourID}`}
                            value={whour.HourID}
                          >
                            {whour.Title}
                          </Option>
                        ))}
                      </Select>
                      <Button
                        disabled={selectedHourID === 0}
                        type="primary"
                        onClick={handleSaveWorkShift}
                      >
                        {Words.submit}
                      </Button>
                    </Space>
                  </Col>
                </>
              )}

              {workShift && (
                <Col xs={24}>
                  <Descriptions
                    bordered
                    column={{
                      //   md: 2, sm: 2,
                      lg: 2,
                      md: 2,
                      xs: 1,
                    }}
                    size="middle"
                  >
                    <Descriptions.Item label={Words.work_hour_code}>
                      <Text style={{ color: valueColor }}>
                        {workShift.HourCode}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label={Words.shift_date}>
                      <Text style={{ color: valueColor }}>
                        {utils.farsiNum(utils.slashDate(workShift.ShiftDate))}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label={Words.start_time}>
                      <Text style={{ color: valueColor }}>
                        {utils.farsiNum(
                          `${utils.colonTime(workShift.StartTime)}`
                        )}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label={Words.finish_time}>
                      <Text style={{ color: valueColor }}>
                        {utils.farsiNum(
                          `${utils.colonTime(workShift.FinishTime)}`
                        )}
                      </Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              )}
            </Row>
          </Spin>
        </article>
      </section>
    </Modal>
  );
};

export default WorkShiftModal;
