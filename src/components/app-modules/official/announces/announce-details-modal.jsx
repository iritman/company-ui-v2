import React from "react";
import { useMount } from "react-use";
import {
  Button,
  Modal,
  Row,
  Col,
  Typography,
  Alert,
  Descriptions,
  Tag,
  Tabs,
} from "antd";
import { PaperClipOutlined as AttachedFileIcon } from "@ant-design/icons";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import configInfo from "./../../../../config.json";
import DetailsTable from "./../../../common/details-table";
import { getSorter } from "../../../../tools/form-manager";

const { announceFilesUrl } = configInfo;
const { Text } = Typography;

const getContactsColumns = () => {
  let columns = [
    {
      title: Words.full_name,
      width: 200,
      align: "center",
      //   dataIndex: "Title",
      sorter: getSorter("LastName"),
      render: (record) => (
        <Text
          style={{ color: Colors.cyan[6] }}
        >{`${record.FirstName} ${record.LastName}`}</Text>
      ),
    },
    {
      title: Words.seen_date,
      width: 100,
      align: "center",
      dataIndex: "SeenDate",
      sorter: getSorter("SeenDate"),
      render: (SeenDate) => (
        <Text style={{ color: Colors.orange[6] }}>
          {SeenDate.length > 0 ? utils.farsiNum(utils.slashDate(SeenDate)) : ""}
        </Text>
      ),
    },
    {
      title: Words.seen_time,
      width: 100,
      align: "center",
      dataIndex: "SeenTime",
      sorter: getSorter("SeenTime"),
      render: (SeenTime) => (
        <Text style={{ color: Colors.purple[6] }}>
          {SeenTime.length > 0 ? utils.farsiNum(utils.colonTime(SeenTime)) : ""}
        </Text>
      ),
    },
  ];

  return columns;
};

const AnnounceDetailsModal = ({
  selectedObject,
  isOpen,
  showContacts,
  onOk,
  onSeen,
}) => {
  const valueColor = Colors.blue[7];

  const { Contacts } = selectedObject;

  const total = Contacts?.length;
  const seen = Contacts?.filter(
    (contact) => contact.SeenDate.length > 0
  ).length;
  const unseen = Contacts?.filter(
    (contact) => contact.SeenDate.length === 0
  ).length;

  const getAnnounceInfo = () => {
    return (
      <Row gutter={[10, 10]}>
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
            {selectedObject.DetailsText.length > 0 && (
              <Descriptions.Item label={Words.descriptions} span={2}>
                <Text
                  style={{
                    color: Colors.purple[7],
                    whiteSpace: "pre-line",
                  }}
                >
                  {utils.farsiNum(selectedObject.DetailsText)}
                </Text>
              </Descriptions.Item>
            )}
            <Descriptions.Item label={Words.reg_member}>
              <Text style={{ color: valueColor }}>
                {`${selectedObject.RegFirstName} ${selectedObject.RegLastName}`}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label={Words.reg_date_time}>
              <Text style={{ color: valueColor }}>
                {utils.farsiNum(
                  `${utils.slashDate(
                    selectedObject.RegDate
                  )} - ${utils.colonTime(selectedObject.RegTime)}`
                )}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label={Words.attached_files} span={2}>
              {selectedObject.Files.length === 0 ? (
                <Text style={{ color: Colors.red[4] }}>{"-"}</Text>
              ) : (
                <Col xs={24}>
                  {selectedObject.Files.map((f) => (
                    <a
                      key={f.FileID}
                      href={`${announceFilesUrl}/${f.FileName}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Tag color="#f50" icon={<AttachedFileIcon />}>
                        {Words.attached_file}
                      </Tag>
                    </a>
                  ))}
                </Col>
              )}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    );
  };

  useMount(async () => {
    if (onSeen) {
      await onSeen(selectedObject.AnnounceID);
    }
  });

  return (
    <Modal
      open={isOpen}
      maskClosable={false}
      centered={true}
      title={Words.more_details}
      footer={[
        <Button key="submit-button" onClick={onOk}>
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
                message={utils.farsiNum(
                  `#${selectedObject.AnnounceID} - ${selectedObject.Title}`
                )}
                type="info"
                showIcon
              />
            </Col>
            <Col xs={24}>
              {showContacts ? (
                <Tabs defaultActiveKey="1" type="card">
                  <Tabs.TabPane tab={Words.info} key="1">
                    {getAnnounceInfo()}
                  </Tabs.TabPane>
                  <Tabs.TabPane tab={Words.contacts} key="2">
                    <Row gutter={[5, 10]}>
                      <Col sm={8}>
                        <Text style={{ color: Colors.purple[6] }}>
                          {utils.farsiNum(`${Words.total_contacts}: ${total}`)}
                        </Text>
                      </Col>
                      <Col sm={8}>
                        <Text style={{ color: Colors.green[6] }}>
                          {utils.farsiNum(`${Words.seen}: ${seen}`)}
                        </Text>
                      </Col>
                      <Col sm={8}>
                        <Text style={{ color: Colors.red[6] }}>
                          {utils.farsiNum(`${Words.unseen}: ${unseen}`)}
                        </Text>
                      </Col>
                      <Col xs={24}>
                        <DetailsTable
                          records={selectedObject.Contacts}
                          columns={getContactsColumns()}
                        />
                      </Col>
                    </Row>
                  </Tabs.TabPane>
                </Tabs>
              ) : (
                <>{getAnnounceInfo()}</>
              )}
            </Col>
          </Row>
        </article>
      </section>
    </Modal>
  );
};

export default AnnounceDetailsModal;
