import React from "react";
import {
  Button,
  Modal,
  Row,
  Col,
  Typography,
  Alert,
  Descriptions,
  Space,
} from "antd";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import MemberProfileImage from "../../../common/member-profile-image";

const { Text } = Typography;

const NoAlternativeEmployeeDetailsModal = ({
  selectedObject,
  isOpen,
  onOk,
}) => {
  const valueColor = Colors.blue[7];

  return (
    <Modal
      open={isOpen}
      maskClosable={false}
      centered={true}
      title={Words.more_details}
      footer={[
        <Button key="submit-button" type="primary" onClick={onOk}>
          {Words.confirm}
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
              <Alert
                message={
                  <Space>
                    <MemberProfileImage fileName={selectedObject.PicFileName} />
                    <Text>
                      {utils.farsiNum(
                        `#${selectedObject.MemberID} - ${selectedObject.FirstName} ${selectedObject.LastName}`
                      )}
                    </Text>
                  </Space>
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
                <Descriptions.Item label={Words.national_code}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${selectedObject.NationalCode}`)}
                  </Text>
                </Descriptions.Item>

                <Descriptions.Item label={Words.reg_member}>
                  <Text style={{ color: Colors.green[6] }}>
                    {utils.farsiNum(
                      `${selectedObject.RegFirstName} ${selectedObject.RegLastName} `
                    )}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.reg_date}>
                  <Text style={{ color: Colors.orange[7] }}>
                    {utils.farsiNum(
                      utils.slashDate(`${selectedObject.RegDate}`)
                    )}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.reg_time}>
                  <Text style={{ color: Colors.orange[7] }}>
                    {utils.farsiNum(
                      utils.colonTime(`${selectedObject.RegTime}`)
                    )}
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

export default NoAlternativeEmployeeDetailsModal;
