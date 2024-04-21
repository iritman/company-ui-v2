import React from "react";
import { Button, Row, Col, Typography, Alert, Descriptions, Space } from "antd";
import {
  AiFillLock as LockIcon,
  AiOutlineCheck as CheckIcon,
} from "react-icons/ai";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import ModalWindow from "../../../../common/modal-window";

const { Text } = Typography;

const PurchasingAdminDetailsModal = ({ selectedObject, isOpen, onOk }) => {
  const valueColor = Colors.blue[7];

  const {
    AdminID,
    MemberID,
    FirstName,
    LastName,
    IsActive,
    DetailsText,
    // RegMemberID,
    RegFirstName,
    RegLastName,
    RegDate,
    RegTime,
  } = selectedObject;

  const getFooterButtons = () => {
    let buttons = [
      <Button key="close-button" onClick={onOk}>
        {Words.confirm}
      </Button>,
    ];

    return buttons;
  };

  return (
    <ModalWindow
      isOpen={isOpen}
      title={Words.more_details}
      footer={getFooterButtons()}
      onCancel={onOk}
      width={850}
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
                message={`${FirstName} ${LastName}`}
                type="info"
                showIcon
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
                <Descriptions.Item label={Words.id}>
                  <Text style={{ color: Colors.red[7] }}>
                    {utils.farsiNum(AdminID)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.member_id}>
                  <Text style={{ color: Colors.red[7] }}>
                    {utils.farsiNum(MemberID)}
                  </Text>
                </Descriptions.Item>
                {DetailsText.length > 0 && (
                  <Descriptions.Item label={Words.descriptions} span={2}>
                    <Text
                      style={{
                        color: Colors.purple[7],
                        whiteSpace: "pre-line",
                      }}
                    >
                      {utils.farsiNum(DetailsText)}
                    </Text>
                  </Descriptions.Item>
                )}
                <Descriptions.Item label={Words.status} span={2}>
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
                <Descriptions.Item label={Words.registerar}>
                  <Text style={{ color: Colors.red[7] }}>
                    {`${RegFirstName} ${RegLastName}`}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.reg_date_time}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(
                      `${utils.slashDate(RegDate)} - ${utils.colonTime(
                        RegTime
                      )}`
                    )}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </article>
      </section>
    </ModalWindow>
  );
};

export default PurchasingAdminDetailsModal;
