import React from "react";
import {
  Button,
  Modal,
  Row,
  Col,
  Typography,
  Alert,
  Space,
  Tag,
  Popconfirm,
} from "antd";
import {
  QuestionCircleOutlined as QuestionIcon,
  DeleteOutlined as DeleteIcon,
  PaperClipOutlined as AttachedFileIcon,
  CalendarOutlined as CalendarIcon,
  ClockCircleOutlined as ClockIcon,
  EyeInvisibleOutlined as InvisibleIcon,
  CheckOutlined as CheckIcon,
  CloseOutlined as CrossIcon,
} from "@ant-design/icons";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import MemberProfileImage from "../../../../common/member-profile-image";
import configInfo from "../../../../../config.json";

const { violationAnnounceFilesUrl } = configInfo;
const { Text } = Typography;

const UserOfficialCheckViolationAnnouncementModal = ({
  violation,
  isOpen,
  onCancel,
  onDelete,
}) => {
  const { AnnounceInfo } = violation;

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
            {!AnnounceInfo ? (
              <Col xs={24}>
                <Alert
                  type="warning"
                  showIcon
                  message={Words.messages.no_any_announcement}
                />
              </Col>
            ) : (
              <Col xs={24}>
                <Alert
                  type="success"
                  message={
                    <Row gutter={[10, 5]}>
                      <Col xs={24}>
                        <Space>
                          <Tag color="blue">
                            {utils.farsiNum(`#${AnnounceInfo.AnnounceID}`)}
                          </Tag>

                          <MemberProfileImage
                            fileName={AnnounceInfo.PicFileName}
                            size="small"
                          />

                          <Text
                            style={{ fontSize: 12 }}
                          >{`${AnnounceInfo.FirstName} ${AnnounceInfo.LastName}`}</Text>
                        </Space>
                      </Col>
                      <Col xs={24}>
                        <Text
                          style={{
                            color: Colors.purple[7],
                            whiteSpace: "pre-line",
                          }}
                        >
                          {utils.farsiNum(AnnounceInfo.DetailsText)}
                        </Text>
                      </Col>

                      {AnnounceInfo.Files.length > 0 && (
                        <Col xs={24}>
                          {AnnounceInfo.Files.map((file) => (
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
                            {utils.farsiNum(
                              utils.colonTime(AnnounceInfo.RegTime)
                            )}
                          </Text>

                          <ClockIcon style={{ fontSize: 10 }} />

                          <Text style={{ fontSize: 12 }}>
                            {utils.farsiNum(
                              utils.slashDate(AnnounceInfo.RegDate)
                            )}
                          </Text>
                        </Space>
                      </Col>
                      <Col xs={24}>
                        <Space>
                          {AnnounceInfo.ShowSenderName ? (
                            <CheckIcon
                              style={{ fontSize: 12, color: Colors.green[6] }}
                            />
                          ) : (
                            <CrossIcon
                              style={{ fontSize: 12, color: Colors.red[6] }}
                            />
                          )}

                          <Text style={{ fontSize: 12 }}>
                            {AnnounceInfo.ShowSenderName
                              ? Words.show_violer_name
                              : Words.show_violer_name}
                          </Text>
                        </Space>
                      </Col>
                      <Col xs={24}>
                        <Space>
                          {AnnounceInfo.ShowSenderRequestDetails ? (
                            <CheckIcon
                              style={{ fontSize: 12, color: Colors.green[6] }}
                            />
                          ) : (
                            <CrossIcon
                              style={{ fontSize: 12, color: Colors.red[6] }}
                            />
                          )}

                          <Text style={{ fontSize: 12 }}>
                            {AnnounceInfo.ShowSenderRequestDetails
                              ? Words.show_violer_request_details
                              : Words.show_violer_request_details}
                          </Text>
                        </Space>
                      </Col>
                      <Col xs={24}>
                        {AnnounceInfo.SeenDate.length === 0 ? (
                          <Space>
                            <InvisibleIcon style={{ fontSize: 12 }} />
                            <Text style={{ fontSize: 12 }}>{Words.unseen}</Text>
                          </Space>
                        ) : (
                          <Space>
                            <Text style={{ fontSize: 12 }}>
                              {Words.seen_in}
                            </Text>

                            <CalendarIcon style={{ fontSize: 10 }} />

                            <Text style={{ fontSize: 12 }}>
                              {utils.farsiNum(
                                utils.colonTime(AnnounceInfo.SeenTime)
                              )}
                            </Text>

                            <ClockIcon style={{ fontSize: 10 }} />

                            <Text style={{ fontSize: 12 }}>
                              {utils.farsiNum(
                                utils.slashDate(AnnounceInfo.SeenDate)
                              )}
                            </Text>
                          </Space>
                        )}
                      </Col>
                    </Row>
                  }
                  action={
                    AnnounceInfo.SeenDate.length === 0 && (
                      <Popconfirm
                        title={Words.questions.sure_to_delete_announcement}
                        onConfirm={async () =>
                          await onDelete({
                            ...AnnounceInfo,
                            ViolationID: violation.ViolationID,
                          })
                        }
                        okText={Words.yes}
                        cancelText={Words.no}
                        icon={<QuestionIcon style={{ color: "red" }} />}
                      >
                        <Button size="small" icon={<DeleteIcon />} />
                      </Popconfirm>
                    )
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

export default UserOfficialCheckViolationAnnouncementModal;
