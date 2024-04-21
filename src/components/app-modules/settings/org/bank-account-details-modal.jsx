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
import { textSeparator, farsiNum } from "../../../../tools/utils";
import MemberProfileImage from "../../../common/member-profile-image";

const { Text } = Typography;

const BankAccountDetailsModal = ({ bankAccount, isOpen, onOk }) => {
  const valueColor = Colors.blue[7];

  const {
    AccountID,
    FirstName,
    LastName,
    PicFileName,
    BankTitle,
    AccountNo,
    CardNo,
    ShebaNo,
  } = bankAccount;

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
                    <MemberProfileImage fileName={PicFileName} size="small" />
                    <Text
                      style={{ fontSize: 14, color: Colors.red[7] }}
                    >{`${FirstName} ${LastName}`}</Text>
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
                <Descriptions.Item label={Words.id}>
                  <Text style={{ color: valueColor }}>
                    {farsiNum(`${AccountID}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.bank}>
                  <Text style={{ color: Colors.green[6] }}>{BankTitle}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.account_no}>
                  <Text style={{ color: valueColor }}>{AccountNo}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.card_no}>
                  <Text style={{ color: valueColor }}>
                    {CardNo.length > 0 ? textSeparator(CardNo, 4, "-") : "-"}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.sheba_no} span={2}>
                  <Text style={{ color: valueColor }}>
                    {ShebaNo.length > 0
                      ? `IR-${textSeparator(ShebaNo, 4, "-")}`
                      : "-"}
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

export default BankAccountDetailsModal;
