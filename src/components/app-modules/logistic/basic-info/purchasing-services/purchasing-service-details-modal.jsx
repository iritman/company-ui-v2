import React from "react";
import { Button, Row, Col, Typography, Alert, Descriptions } from "antd";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import ModalWindow from "../../../../common/modal-window";

const { Text } = Typography;

const PurchasingServiceDetailsModal = ({ selectedObject, isOpen, onOk }) => {
  const valueColor = Colors.blue[7];

  const {
    ServiceID,
    ServiceGroupTitle,
    Title,
    MeasureUnitTitle,
    MeasureTypeTitle,
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
                  <Text style={{ color: Colors.red[7] }}>
                    {utils.farsiNum(ServiceID)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.service_group}>
                  <Text style={{ color: Colors.green[6] }}>
                    {utils.farsiNum(ServiceGroupTitle)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.measure_unit}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(MeasureUnitTitle)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.measure_type}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(MeasureTypeTitle)}
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

export default PurchasingServiceDetailsModal;
