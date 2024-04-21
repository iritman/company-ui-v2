import React from "react";
import { Button, Modal, Row, Col, Typography, Descriptions, Alert } from "antd";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";

const { Text } = Typography;

const TafsilAccountDetailsModal = ({ selectedObject, isOpen, onOk }) => {
  //   const valueColor = Colors.blue[7];

  const {
    TafsilAccountID,
    Title,
    TafsilCode,
    DetailsText,
    TafsilTypeTitle,
    // BaseTableItemID,
    BaseTableItemTitle,
    // CurrencyID,
    CurrencyTitle,
    IsActive,
    TafsilTypeBaseTableID,
    // TafsilTypeBaseTableTitle,
    // TafsilTypeID,
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
                      `#${TafsilAccountID} - ${
                        TafsilTypeBaseTableID > 0 ? BaseTableItemTitle : Title
                      }`
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
                <Descriptions.Item label={Words.tafsil_type}>
                  <Text style={{ color: Colors.cyan[6] }}>
                    {TafsilTypeTitle}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.tafsil_code}>
                  <Text style={{ color: Colors.red[7] }}>
                    {utils.farsiNum(`${TafsilCode}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.default_currency}>
                  <Text style={{ color: Colors.blue[6] }}>{CurrencyTitle}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.status} span={2}>
                  <Text
                    style={{
                      color: IsActive ? Colors.green[6] : Colors.red[6],
                    }}
                  >
                    {IsActive ? Words.active : Words.inactive}
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

export default TafsilAccountDetailsModal;
