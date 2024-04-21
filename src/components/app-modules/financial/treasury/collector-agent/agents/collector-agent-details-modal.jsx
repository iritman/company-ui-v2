import React from "react";
import {
  Button,
  Modal,
  Row,
  Col,
  Typography,
  Descriptions,
  Alert,
  Space,
} from "antd";
import {
  AiFillLock as LockIcon,
  AiOutlineCheck as CheckIcon,
} from "react-icons/ai";
import Words from "../../../../../../resources/words";
import Colors from "../../../../../../resources/colors";
import utils from "../../../../../../tools/utils";

const { Text } = Typography;
const valueColor = Colors.blue[7];

const CollectorAgentDetailsModal = ({ selectedObject, isOpen, onOk }) => {
  const {
    CollectorAgentID,
    // TafsilAccountID,
    TafsilAccountTitle,
    TafsilCode,
    // TafsilTypeID,
    // TafsilTypeTitle,
    AllocatedCeiling,
    AppointmentDate,
    IsActive,
  } = selectedObject;

  return (
    <Modal
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
      <section>
        <article
          id="info-content"
          className="scrollbar-normal"
          style={{ maxHeight: "calc(100vh - 180px)" }}
        >
          <Row gutter={[10, 10]}>
            <Col xs={24}>
              <Alert
                message={
                  <Text style={{ fontSize: 14 }}>
                    {utils.farsiNum(
                      `#${CollectorAgentID} - ${TafsilAccountTitle}`
                    )}
                  </Text>
                }
                type="info"
              />
            </Col>
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
                <Descriptions.Item label={Words.tafsil_code}>
                  <Text style={{ color: Colors.cyan[6] }}>
                    {utils.farsiNum(TafsilCode)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.allocated_ceiling}>
                  <Text style={{ color: valueColor }}>
                    {`${utils.farsiNum(utils.moneyNumber(AllocatedCeiling))} ${
                      Words.ryal
                    }`}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.appointment_date}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(utils.slashDate(AppointmentDate))}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.status}>
                  <Space>
                    {IsActive ? (
                      <CheckIcon style={{ color: Colors.green[6] }} />
                    ) : (
                      <LockIcon style={{ color: Colors.red[6] }} />
                    )}

                    <Text style={{ color: valueColor }}>
                      {`${IsActive ? Words.active : Words.inactive} `}
                    </Text>
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </article>
      </section>
    </Modal>
  );
};

export default CollectorAgentDetailsModal;
