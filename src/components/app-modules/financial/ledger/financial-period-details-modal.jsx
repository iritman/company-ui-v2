import React from "react";
import { Button, Modal, Row, Col, Typography, Descriptions, Alert } from "antd";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";

const { Text } = Typography;

const FinancialPeriodDetailsModal = ({ selectedObject, isOpen, onOk }) => {
  const valueColor = Colors.blue[7];

  const { FinancialPeriodID, Title, DetailsText } = selectedObject;

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
                <Descriptions.Item label={Words.id} span={2}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${FinancialPeriodID}`)}
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
              </Descriptions>
            </Col>
          </Row>
        </article>
      </section>
    </Modal>
  );
};

export default FinancialPeriodDetailsModal;
