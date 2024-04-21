import React from "react";
import {
  Row,
  Col,
  Tag,
  Button,
  Tabs,
  Alert,
  Typography,
  Space,
  Badge,
  Descriptions,
  Modal,
} from "antd";
import {
  PaperClipOutlined as AttachedFileIcon,
  CalendarOutlined as CalendarIcon,
  ClockCircleOutlined as ClockIcon,
  CheckCircleOutlined as DoneIcon,
  FieldTimeOutlined as InProgressIcon,
} from "@ant-design/icons";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import configInfo from "./../../../../config.json";
import MemberProfileImage from "./../../../common/member-profile-image";

const { taskFilesUrl, taskReportFilesUrl } = configInfo;
const { Text } = Typography;

const { TabPane } = Tabs;

const UserOthersTaskModal = ({ isOpen, selectedObject, onCancel }) => {
  const {
    TaskID,
    Title,
    DetailsText,
    RegFirstName,
    RegLastName,
    RegPicFileName,
    ReminderDate,
    ReminderTime,
    SeenDate,
    SeenTime,
    DoneDate,
    DoneTime,
    NewReportsCount,
    ReminderInfo,
    Supervisors,
    Reports,
    Tags,
    Files,
  } = selectedObject;

  //-----------------------------------------------------------

  const valueColor = Colors.blue[7];

  const getDelayText = (delayInfo) => {
    let result = "";

    const { Days, Hours, Minutes } = delayInfo;

    if (Days > 0)
      result = utils.farsiNum(`${Days} ${Words.day} ${Words.delay}`);
    else if (Hours > 0)
      result = utils.farsiNum(`${Hours} ${Words.hour} ${Words.delay}`);
    else if (Minutes > 0)
      result = utils.farsiNum(`${Minutes} ${Words.minute} ${Words.delay}`);

    return result;
  };

  return (
    <>
      <Modal
        open={isOpen}
        maskClosable={false}
        centered={true}
        title={Words.task}
        footer={[<Button onClick={onCancel}>{Words.close}</Button>]}
        onCancel={onCancel}
        width={850}
      >
        <section>
          <article
            id="info-content"
            className="scrollbar-normal"
            style={{ maxHeight: "calc(100vh - 180px)" }}
          >
            <Tabs
              defaultActiveKey="1"
              //   onChange={handleTabChange}
            >
              <TabPane tab={Words.task_details} key="task-info">
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
                      {utils.farsiNum(TaskID)}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label={Words.registerar}>
                    <Space>
                      <MemberProfileImage
                        fileName={RegPicFileName}
                        size="small"
                      />
                      <Text
                        style={{ color: valueColor }}
                      >{`${RegFirstName} ${RegLastName}`}</Text>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label={Words.title} span={2}>
                    <Text style={{ color: Colors.purple[6] }}>
                      {utils.farsiNum(Title)}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label={Words.descriptions} span={2}>
                    <Text
                      style={{
                        color: Colors.grey[7],
                        whiteSpace: "pre-line",
                      }}
                    >
                      {utils.farsiNum(DetailsText)}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label={Words.reminder_date_time}>
                    <Text style={{ color: Colors.green[6], fontSize: 13 }}>
                      {utils.farsiNum(
                        `${utils.dayNameFromText(
                          ReminderDate
                        )} - ${utils.colonTime(ReminderTime)}`
                      )}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label={Words.seen_in}>
                    <Text style={{ color: valueColor, fontSize: 13 }}>
                      {SeenDate.length > 0
                        ? utils.farsiNum(
                            `${utils.dayNameFromText(
                              SeenDate
                            )} - ${utils.colonTime(SeenTime)}`
                          )
                        : "-"}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label={Words.delay_status}>
                    <Text
                      style={{
                        color: ReminderInfo.HasDelay
                          ? Colors.red[6]
                          : valueColor,
                        fontSize: 13,
                      }}
                    >
                      {ReminderInfo.HasDelay
                        ? getDelayText(ReminderInfo)
                        : Words.without_delay}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label={Words.done_status}>
                    {DoneDate.length > 0 ? (
                      <Space>
                        <DoneIcon style={{ color: Colors.green[6] }} />
                        <Text style={{ color: valueColor, fontSize: 13 }}>
                          {utils.farsiNum(
                            `${utils.dayNameFromText(
                              DoneDate
                            )} - ${utils.colonTime(DoneTime)}`
                          )}
                        </Text>
                      </Space>
                    ) : (
                      <Space>
                        <InProgressIcon
                          style={{ color: Colors.orange[6], fontSize: 18 }}
                        />

                        <Text style={{ color: Colors.orange[6], fontSize: 13 }}>
                          {Words.in_done_progress}
                        </Text>
                      </Space>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label={Words.supervisors} span={2}>
                    {Supervisors.length === 0 ? (
                      <Text style={{ color: Colors.red[4] }}>{"-"}</Text>
                    ) : (
                      <Col xs={24}>
                        {Supervisors.map((supervisor) => (
                          <Tag
                            key={supervisor.MemberID}
                            color="magenta"
                            style={{ margin: 5 }}
                          >
                            {supervisor.FullName}
                          </Tag>
                        ))}
                      </Col>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label={Words.tags} span={2}>
                    {Tags.length === 0 ? (
                      <Text style={{ color: Colors.red[4] }}>{"-"}</Text>
                    ) : (
                      <Col xs={24}>
                        {Tags.map((tag) => (
                          <Tag
                            key={tag.TagID}
                            color={tag.Color}
                            style={{ margin: 5 }}
                          >
                            {tag.Title}
                          </Tag>
                        ))}
                      </Col>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label={Words.attached_files} span={2}>
                    {Files.length === 0 ? (
                      <Text style={{ color: Colors.red[4] }}>{"-"}</Text>
                    ) : (
                      <Col xs={24}>
                        {Files.map((f) => (
                          <a
                            key={f.FileID}
                            href={`${taskFilesUrl}/${f.FileName}`}
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
              </TabPane>
              {selectedObject && (
                <TabPane
                  tab={
                    <Space>
                      <Text>{`${Words.reports}${
                        Reports.length > 0
                          ? utils.farsiNum(` (${Reports.length})`)
                          : ""
                      }`}</Text>

                      {NewReportsCount > 0 && (
                        <Badge
                          style={{ backgroundColor: "#52c41a" }}
                          count={utils.farsiNum(NewReportsCount)}
                        />
                      )}
                    </Space>
                  }
                  key="task-reports"
                >
                  <Row gutter={[10, 5]}>
                    {Reports.length === 0 && (
                      <Col xs={24}>
                        <Alert
                          type="warning"
                          showIcon
                          message={Words.messages.no_any_report}
                        />
                      </Col>
                    )}

                    {/* {DoneDate.length === 0 && (
                        <Col xs={24}>
                          <Button
                            type="primary"
                            icon={<PlusIcon />}
                            onClick={() => setShowNewReportModal(true)}
                          >
                            {Words.new_report}
                          </Button>
                        </Col>
                      )} */}

                    {Reports.map((report) => (
                      <Col xs={24} key={report.ReportID}>
                        <Alert
                          type="success"
                          message={
                            <Row gutter={[10, 5]}>
                              <Col xs={24}>
                                <Space>
                                  <Tag color="blue">
                                    {utils.farsiNum(`#${report.ReportID}`)}
                                  </Tag>

                                  <MemberProfileImage
                                    fileName={report.PicFileName}
                                    size="small"
                                  />

                                  <Text
                                    style={{ fontSize: 12 }}
                                  >{`${report.FirstName} ${report.LastName}`}</Text>
                                </Space>
                              </Col>
                              <Col xs={24}>
                                <Text
                                  style={{
                                    color: Colors.purple[7],
                                    whiteSpace: "pre-line",
                                  }}
                                >
                                  {utils.farsiNum(report.DetailsText)}
                                </Text>
                              </Col>

                              {report.Files.length > 0 && (
                                <Col xs={24}>
                                  {report.Files.map((file) => (
                                    <a
                                      key={file.FileID}
                                      href={`${taskReportFilesUrl}/${file.FileName}`}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <Tag
                                        color="magenta"
                                        icon={<AttachedFileIcon />}
                                      >
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
                                      utils.colonTime(report.RegTime)
                                    )}
                                  </Text>

                                  <ClockIcon style={{ fontSize: 10 }} />

                                  <Text style={{ fontSize: 12 }}>
                                    {utils.farsiNum(
                                      utils.slashDate(report.RegDate)
                                    )}
                                  </Text>
                                </Space>
                              </Col>
                            </Row>
                          }
                        />
                      </Col>
                    ))}
                  </Row>
                </TabPane>
              )}
            </Tabs>
          </article>
        </section>
      </Modal>
    </>
  );
};

export default UserOthersTaskModal;
