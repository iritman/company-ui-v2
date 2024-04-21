import React from "react";
import { Button, Modal, Row, Col, Typography, Descriptions, Alert } from "antd";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import DetailsTable from "../../../common/details-table";
import { getItemColumns } from "./user-group-feature-item-columns-code";

const { Text } = Typography;

const UserGroupFeatureDetailsModal = ({ selectedObject, isOpen, onOk }) => {
  const valueColor = Colors.blue[7];

  const {
    GroupFeatureID,
    Title,
    FeatureTypeID,
    FeatureTypeTitle,
    IsActive,
    Items,
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
      width={800}
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
                    {utils.farsiNum(`#${GroupFeatureID} - ${Title}`)}
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
                <Descriptions.Item label={Words.type}>
                  <Text style={{ color: valueColor }}>{FeatureTypeTitle}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.status}>
                  <Text
                    style={{
                      color: IsActive ? Colors.green[6] : Colors.red[6],
                    }}
                  >
                    {IsActive ? Words.active : Words.inactive}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </Col>
            {FeatureTypeID < 5 && (
              <Col xs={24}>
                <DetailsTable
                  records={Items}
                  columns={getItemColumns(FeatureTypeID)}
                  emptyDataMessage={Words.no_feature_item_value}
                />
              </Col>
            )}
          </Row>
        </article>
      </section>
    </Modal>
  );
};

export default UserGroupFeatureDetailsModal;
