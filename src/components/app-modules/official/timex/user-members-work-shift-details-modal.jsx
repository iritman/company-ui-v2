import React from "react";
import { Row, Col, Modal, Typography, Button, Descriptions } from "antd";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";

const { Text } = Typography;
const valueColor = Colors.cyan[6];

const UserMembersWorkShiftDetailsModal = ({ isOpen, selectedObject, onOk }) => {
  const { workShift } = selectedObject;

  return (
    <Modal
      open={isOpen}
      maskClosable={false}
      centered={true}
      title={Words.work_shift}
      footer={[
        <Button key="submit-button" onClick={onOk}>
          {Words.close}
        </Button>,
      ]}
      onCancel={onOk}
      width={650}
    >
      <section>
        <article
          id="info-content"
          className="scrollbar-normal"
          style={{ maxHeight: "calc(100vh - 180px)" }}
        >
          <Row gutter={[10, 10]}>
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
                    {utils.farsiNum(`${utils.colonTime(workShift.StartTime)}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.finish_time}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${utils.colonTime(workShift.FinishTime)}`)}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </article>
      </section>
    </Modal>
  );
};

export default UserMembersWorkShiftDetailsModal;
