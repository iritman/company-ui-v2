import React from "react";
import { Button, Modal, Row, Col, Typography, Alert, Descriptions } from "antd";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";

const { Text } = Typography;

const UserStorageCenterDetailsModal = ({ storageCenter, isOpen, onOk }) => {
  const valueColor = Colors.blue[7];

  const { CenterID, Title, CityTitle, Tel, PostalCode, Address } =
    storageCenter;

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
              <Alert message={utils.farsiNum(Title)} type="info" showIcon />
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
                  <Text style={{ color: Colors.red[6] }}>
                    {utils.farsiNum(CenterID)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.city}>
                  <Text style={{ color: Colors.cyan[6] }}>{CityTitle}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.tel_no}>
                  <Text style={{ color: Colors.purple[6] }}>
                    {utils.farsiNum(Tel)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.postal_code}>
                  <Text style={{ color: Colors.magenta[6] }}>
                    {utils.farsiNum(PostalCode)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.address} span={2}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(Address)}
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

export default UserStorageCenterDetailsModal;
