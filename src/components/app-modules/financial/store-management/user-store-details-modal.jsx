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
import {
  AiFillLock as LockIcon,
  AiOutlineCheck as CheckIcon,
} from "react-icons/ai";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";

const { Text } = Typography;

const UserStoreDetailsModal = ({ store, isOpen, onOk }) => {
  const valueColor = Colors.blue[7];

  const {
    StoreID,
    // StorageCenterID,
    StorageCenterTitle,
    Title,
    // ManagerMemberID,
    ManagerFirstName,
    ManagerLastName,
    // ManagerPicFileName,
    IsActive,
  } = store;

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
                message={utils.farsiNum(`${Title}`)}
                type="info"
                showIcon
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
                    {utils.farsiNum(StoreID)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.storage_center}>
                  <Text style={{ color: Colors.orange[6] }}>
                    {StorageCenterTitle}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.store_manager}>
                  <Text style={{ color: valueColor }}>
                    {`${ManagerFirstName} ${ManagerLastName}`}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.status}>
                  <Space>
                    {IsActive ? (
                      <CheckIcon style={{ color: Colors.green[6] }} />
                    ) : (
                      <LockIcon style={{ color: Colors.red[6] }} />
                    )}

                    <Text
                      style={{
                        color: IsActive ? Colors.green[7] : Colors.red[7],
                      }}
                    >
                      {`${IsActive ? Words.active : Words.inactive} `}
                    </Text>
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </article>
      </section>
    </Modal>
  );
};

export default UserStoreDetailsModal;
