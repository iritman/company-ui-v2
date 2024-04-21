import React from "react";
import { Button, Modal, Row, Col, Typography, Descriptions, Alert } from "antd";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";

const { Text } = Typography;
const valueColor = Colors.blue[7];

const BankBranchDetailsModal = ({ selectedObject, isOpen, onOk }) => {
  const {
    BranchID,
    BankTitle,
    CityTitle,
    Title,
    BranchCode,
    SwiftCode,
    TelNo,
    Website,
    Address,
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
                  <Text style={{ fontSize: 14 }}>{utils.farsiNum(Title)}</Text>
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
                  <Text style={{ color: Colors.red[6] }}>
                    {utils.farsiNum(`${BranchID}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.bank}>
                  <Text style={{ color: Colors.cyan[6] }}>{BankTitle}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.city}>
                  <Text style={{ color: valueColor }}>{CityTitle}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.branch_code}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(BranchCode)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.swift_code}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(SwiftCode)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.tel_no}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(TelNo)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.website} span={2}>
                  <Text style={{ color: valueColor }}>{Website}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.address} span={2}>
                  <Text
                    style={{
                      color: Colors.purple[7],
                      whiteSpace: "pre-line",
                    }}
                  >
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

export default BankBranchDetailsModal;
