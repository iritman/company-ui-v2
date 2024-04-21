import React from "react";
import { Button, Modal, Row, Col, Typography, Alert } from "antd";
import { getSorter } from "../../../../tools/form-manager";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import DetailsTable from "../../../common/details-table";

const { Text } = Typography;

const getFeaturesColumns = () => {
  let columns = [
    {
      title: Words.id,
      width: 75,
      align: "center",
      dataIndex: "FeatureID",
      sorter: getSorter("FeatureID"),
      render: (FeatureID) => <Text>{utils.farsiNum(`${FeatureID}`)}</Text>,
    },
    {
      title: Words.title,
      width: 120,
      align: "center",
      dataIndex: "Title",
      sorter: getSorter("Title"),
      render: (Title) => (
        <Text
          style={{
            color: Colors.green[6],
          }}
        >
          {Title}
        </Text>
      ),
    },
    {
      title: Words.value_type,
      width: 100,
      align: "center",
      dataIndex: "ValueTypeTitle",
      sorter: getSorter("ValueTypeTitle"),
      render: (ValueTypeTitle) => (
        <Text
          style={{
            color: Colors.orange[6],
          }}
        >
          {ValueTypeTitle}
        </Text>
      ),
    },
  ];

  return columns;
};

const UserBachPatternDetailsModal = ({ pattern, isOpen, onOk }) => {
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
              <Alert
                message={utils.farsiNum(`${pattern.Title}`)}
                type="info"
                showIcon
              />
            </Col>

            {pattern.Features?.length > 0 && (
              <>
                <Col xs={24}>
                  <Text style={{ fontSize: 12 }}>{Words.features}</Text>
                </Col>
                <Col xs={24}>
                  <DetailsTable
                    records={pattern.Features}
                    columns={getFeaturesColumns()}
                  />
                </Col>
              </>
            )}

            {pattern.Features?.length === 0 && (
              <Col xs={24}>
                <Alert
                  type="error"
                  showIcon
                  message={
                    <Text style={{ fontSize: 12 }}>
                      {Words.messages.no_feature_selected}
                    </Text>
                  }
                />
              </Col>
            )}
          </Row>
        </article>
      </section>
    </Modal>
  );
};

export default UserBachPatternDetailsModal;
