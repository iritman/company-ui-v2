import React, { useState } from "react";
import {
  Button,
  Modal,
  Row,
  Col,
  Typography,
  Alert,
  Descriptions,
  Space,
  Divider,
  Tag,
} from "antd";
import {
  SnippetsOutlined as ReportIcon,
  PaperClipOutlined as AttachedFileIcon,
} from "@ant-design/icons";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import MemberProfileImage from "./../../../../common/member-profile-image";
import configInfo from "./../../../../../config.json";
import ReportsModal from "./user-dismissal-reports-modal";

const { dismissalResponseFilesUrl } = configInfo;

const { Text } = Typography;

const getFinalStatusColor = (record) => {
  let color = Colors.grey[6];

  const { FinalStatusID } = record;

  if (FinalStatusID > 1) {
    color = FinalStatusID === 2 ? Colors.green[6] : Colors.red[6];
  }

  return color;
};

const getFinalStatusTitle = (record) => {
  let title = Words.in_progress;

  const { FinalStatusID } = record;

  if (FinalStatusID > 1) {
    title = FinalStatusID === 2 ? Words.accepted : Words.rejected;
  }

  return title;
};

const UserDismissalDetailsModal = ({ dismissal, isOpen, onOk }) => {
  const valueColor = Colors.blue[7];

  const [showReportsModal, setShowReportsModal] = useState(false);

  const {
    DismissalID,
    DismissalFirstName,
    DismissalLastName,
    DismissalPicFileName,
    RegFirstName,
    RegLastName,
    DetailsText,
    FinalStatusID,
    RegDate,
    RegTime,
    Files,
    Actions,
    Reports,
  } = dismissal;

  return (
    <>
      <Modal
        open={isOpen}
        maskClosable={false}
        centered={true}
        title={Words.more_details}
        footer={[
          <Button
            key="reports-button"
            type="primary"
            danger
            onClick={() => setShowReportsModal(true)}
            icon={<ReportIcon />}
          >
            {`${Words.reports}${
              Reports.length > 0 ? utils.farsiNum(` (${Reports.length})`) : ""
            }`}
          </Button>,
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
                    <Space>
                      <MemberProfileImage
                        fileName={DismissalPicFileName}
                        size="small"
                      />

                      <Text
                        style={{ fontSize: 14 }}
                      >{`${DismissalFirstName} ${DismissalLastName}`}</Text>
                    </Space>
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
                      {utils.farsiNum(`#${DismissalID}`)}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label={Words.status}>
                    <Text style={{ color: getFinalStatusColor(dismissal) }}>
                      {getFinalStatusTitle(dismissal)}
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
                  <Descriptions.Item label={Words.reg_member}>
                    <Text style={{ color: valueColor }}>
                      {`${RegFirstName} ${RegLastName}`}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label={Words.reg_date_time}>
                    <Text style={{ color: valueColor }}>
                      {utils.farsiNum(
                        `${utils.slashDate(RegDate)} - ${utils.colonTime(
                          RegTime
                        )}`
                      )}
                    </Text>
                  </Descriptions.Item>
                </Descriptions>
                {FinalStatusID > 1 && (
                  <>
                    <Divider orientation="right" plain>
                      {Words.official_response}
                    </Divider>
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
                      {Actions.length > 0 && (
                        <>
                          {DetailsText.length > 0 && (
                            <Descriptions.Item
                              label={Words.descriptions}
                              span={2}
                            >
                              <Text
                                style={{
                                  color: Colors.purple[7],
                                  whiteSpace: "pre-line",
                                }}
                              >
                                {utils.farsiNum(Actions[0].DetailsText)}
                              </Text>
                            </Descriptions.Item>
                          )}
                          <Descriptions.Item label={Words.reg_member}>
                            <Text style={{ color: Colors.magenta[6] }}>
                              {`${Actions[0].FirstName} ${Actions[0].LastName}`}
                            </Text>
                          </Descriptions.Item>
                          <Descriptions.Item label={Words.reg_date_time}>
                            <Text style={{ color: Colors.magenta[6] }}>
                              {utils.farsiNum(
                                `${utils.slashDate(
                                  Actions[0].ActionDate
                                )} - ${utils.colonTime(Actions[0].ActionTime)}`
                              )}
                            </Text>
                          </Descriptions.Item>
                        </>
                      )}
                      {Files.length > 0 && (
                        <Descriptions.Item
                          label={Words.attached_files}
                          span={2}
                        >
                          <Col xs={24}>
                            {Files.map((f) => (
                              <a
                                key={f.FileID}
                                href={`${dismissalResponseFilesUrl}/${f.FileName}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Tag
                                  color="pink"
                                  icon={<AttachedFileIcon />}
                                  style={{ margin: 5 }}
                                >
                                  {Words.attached_file}
                                </Tag>
                              </a>
                            ))}
                          </Col>
                        </Descriptions.Item>
                      )}
                    </Descriptions>
                  </>
                )}
              </Col>
            </Row>
          </article>
        </section>
      </Modal>

      {showReportsModal && (
        <ReportsModal
          isOpen={showReportsModal}
          onCancel={() => setShowReportsModal(false)}
          dismissal={dismissal}
        />
      )}
    </>
  );
};

export default UserDismissalDetailsModal;
