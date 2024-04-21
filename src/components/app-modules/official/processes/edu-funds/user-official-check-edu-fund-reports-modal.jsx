import React, { useState } from "react";
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
  PlusOutlined as PlusIcon,
  CalendarOutlined as CalendarIcon,
  ClockCircleOutlined as ClockIcon,
} from "@ant-design/icons";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import MemberProfileImage from "../../../../common/member-profile-image";
import configInfo from "../../../../../config.json";
import NewReportModal from "./user-official-check-edu-fund-new-report-modal";

const { eduFundReportFilesUrl } = configInfo;
const { Text } = Typography;

const UserOfficialCheckEduFundReportsModal = ({
  eduFund,
  isOpen,
  onCancel,
  onRegReport,
  onDeleteReport,
}) => {
  const [showRegReportModal, setShowRegReportModal] = useState(false);

  const { Reports } = eduFund;

  return (
    <>
      <Modal
        open={isOpen}
        maskClosable={false}
        centered={true}
        title={Words.reports}
        footer={[
          <Button
            key="new-report-button"
            type="primary"
            icon={<PlusIcon />}
            onClick={() => setShowRegReportModal(true)}
          >
            {Words.new_report}
          </Button>,
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
              {Reports.length === 0 && (
                <Col xs={24}>
                  <Alert
                    type="warning"
                    showIcon
                    message={Words.messages.no_any_report}
                  />
                </Col>
              )}

              {Reports.length > 0 &&
                Reports.map((report) => (
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
                                  href={`${eduFundReportFilesUrl}/${file.FileName}`}
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
                      action={
                        <Popconfirm
                          title={Words.questions.sure_to_delete_report}
                          onConfirm={async () =>
                            await onDeleteReport({
                              ...report,
                              FundID: eduFund.FundID,
                            })
                          }
                          okText={Words.yes}
                          cancelText={Words.no}
                          icon={<QuestionIcon style={{ color: "red" }} />}
                        >
                          <Button size="small" icon={<DeleteIcon />} />
                        </Popconfirm>
                      }
                    />
                  </Col>
                ))}
            </Row>
          </article>
        </section>
      </Modal>

      {showRegReportModal && (
        <NewReportModal
          isOpen={showRegReportModal}
          onOk={onRegReport}
          onCancel={() => setShowRegReportModal(false)}
          eduFund={eduFund}
        />
      )}
    </>
  );
};

export default UserOfficialCheckEduFundReportsModal;
