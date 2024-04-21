import React from "react";
import { useMount } from "react-use";
import { Button, Modal, Row, Col, Typography, Alert, Space, Tag } from "antd";
import {
  PaperClipOutlined as AttachedFileIcon,
  CalendarOutlined as CalendarIcon,
  ClockCircleOutlined as ClockIcon,
} from "@ant-design/icons";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import MemberProfileImage from "../../../../common/member-profile-image";
import configInfo from "../../../../../config.json";

const { violationAnnounceFilesUrl, violationFilesUrl } = configInfo;
const { Text } = Typography;

const UserViolationAnnouncementDetailsModal = ({
  announce,
  isOpen,
  onCancel,
  onSeen,
}) => {
  useMount(async () => {
    if (announce.SeenDate.length === 0) await onSeen();
  });

  return (
    <Modal
      open={isOpen}
      maskClosable={false}
      centered={true}
      title={Words.announcement}
      footer={[
        <Button key="close-button" onClick={onCancel}>
          {Words.close}
        </Button>,
      ]}
      onCancel={onCancel}
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
                type="success"
                message={
                  <Row gutter={[10, 5]}>
                    <Col xs={24}>
                      <Space>
                        <Tag color="blue">
                          {utils.farsiNum(`#${announce.AnnounceID}`)}
                        </Tag>

                        <MemberProfileImage
                          fileName={announce.RegPicFileName}
                          size="small"
                        />

                        <Text
                          style={{ fontSize: 12 }}
                        >{`${announce.RegFirstName} ${announce.RegLastName}`}</Text>
                      </Space>
                    </Col>
                    <Col xs={24}>
                      <Text
                        style={{
                          color: Colors.purple[7],
                          whiteSpace: "pre-line",
                        }}
                      >
                        {utils.farsiNum(announce.DetailsText)}
                      </Text>
                    </Col>

                    {announce.Files.length > 0 && (
                      <Col xs={24}>
                        {announce.Files.map((file) => (
                          <a
                            key={file.FileID}
                            href={`${violationAnnounceFilesUrl}/${file.FileName}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Tag color="magenta" icon={<AttachedFileIcon />}>
                              {Words.attached_file}
                            </Tag>
                          </a>
                        ))}
                      </Col>
                    )}

                    <Col xs={24}>
                      <div
                        style={{
                          width: "100%",
                          height: "1px",
                          borderBottom: "1px dashed grey",
                          marginTop: 5,
                          marginBottom: 5,
                        }}
                      />

                      <Space>
                        <CalendarIcon style={{ fontSize: 10 }} />

                        <Text style={{ fontSize: 12 }}>
                          {utils.farsiNum(utils.colonTime(announce.RegTime))}
                        </Text>

                        <ClockIcon style={{ fontSize: 10 }} />

                        <Text style={{ fontSize: 12 }}>
                          {utils.farsiNum(utils.slashDate(announce.RegDate))}
                        </Text>
                      </Space>
                    </Col>

                    <Col xs={24}>
                      <div
                        style={{
                          width: "100%",
                          height: "1px",
                          borderBottom: "1px dashed grey",
                          marginTop: 5,
                          marginBottom: 5,
                        }}
                      />

                      <Space>
                        <Text style={{ fontSize: 12 }}>
                          {`${Words.complainant}: ${
                            announce.SenderName.length > 0
                              ? announce.SenderName
                              : Words.private
                          }`}
                        </Text>
                      </Space>
                    </Col>

                    {announce.SenderRequestDetails.length > 0 && (
                      <Col xs={24}>
                        <Text
                          style={{
                            color: Colors.purple[7],
                            whiteSpace: "pre-line",
                            fontSize: 12,
                          }}
                        >
                          {utils.farsiNum(announce.SenderRequestDetails)}
                        </Text>
                      </Col>
                    )}

                    {announce.SenderRequestFiles.length > 0 && (
                      <Col xs={24}>
                        {announce.SenderRequestFiles.map((file) => (
                          <a
                            key={file.FileID}
                            href={`${violationFilesUrl}/${file.FileName}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Tag color="orange" icon={<AttachedFileIcon />}>
                              {Words.attached_file}
                            </Tag>
                          </a>
                        ))}
                      </Col>
                    )}

                    {announce.SeenDate.length > 0 && (
                      <Col xs={24}>
                        <div
                          style={{
                            width: "100%",
                            height: "1px",
                            borderBottom: "1px dashed grey",
                            marginTop: 5,
                            marginBottom: 5,
                          }}
                        />

                        <Space>
                          <Text style={{ fontSize: 12 }}>{Words.seen_in}</Text>

                          <CalendarIcon style={{ fontSize: 10 }} />

                          <Text style={{ fontSize: 12 }}>
                            {utils.farsiNum(utils.colonTime(announce.SeenTime))}
                          </Text>

                          <ClockIcon style={{ fontSize: 10 }} />

                          <Text style={{ fontSize: 12 }}>
                            {utils.farsiNum(utils.slashDate(announce.SeenDate))}
                          </Text>
                        </Space>
                      </Col>
                    )}
                  </Row>
                }
              />
            </Col>
          </Row>
        </article>
      </section>
    </Modal>
  );
};

export default UserViolationAnnouncementDetailsModal;
