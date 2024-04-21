import React from "react";
import { Button, Modal, Row, Col, Typography, Descriptions, Alert } from "antd";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";

const { Text } = Typography;

const TafsilTypeDetailsModal = ({ selectedObject, isOpen, onOk }) => {
  const valueColor = Colors.blue[7];

  const {
    TafsilTypeID,
    Title,
    ParentTitle,
    BaseTableTitle,
    StartCode,
    CodeLength,
    DetailsText,
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
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${TafsilTypeID}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.parent_tafsil_type}>
                  <Text style={{ color: Colors.green[6] }}>{ParentTitle}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.start_code}>
                  <Text style={{ color: Colors.red[7] }}>
                    {utils.farsiNum(`${StartCode}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.code_length}>
                  <Text style={{ color: Colors.red[7] }}>
                    {utils.farsiNum(`${CodeLength}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.base_module} span={2}>
                  <Text style={{ color: Colors.blue[6] }}>
                    {BaseTableTitle}
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

export default TafsilTypeDetailsModal;
