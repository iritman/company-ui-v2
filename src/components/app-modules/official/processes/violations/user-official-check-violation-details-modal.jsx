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
  Tag,
  Divider,
} from "antd";
import {
  SnippetsOutlined as ReportIcon,
  PaperClipOutlined as AttachedFileIcon,
  AuditOutlined as HokmIcon,
  SendOutlined as AnnounceIcon,
} from "@ant-design/icons";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import MemberProfileImage from "./../../../../common/member-profile-image";
import ResponseModal from "./user-official-check-reg-response-modal";
import ReportsModal from "./user-official-check-violation-reports-modal";
import RegAnnouncementModal from "./user-official-check-violation-reg-announcement-modal";
import AnnouncementModal from "./user-official-check-violation-announcement-modal";
import service from "../../../../../services/official/processes/user-official-check-violations-service";
import configInfo from "./../../../../../config.json";

const { violationFilesUrl, violationResponseFilesUrl } = configInfo;

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

const UserOfficialCheckViolationDetailsModal = ({
  violation,
  isOpen,
  onOk,
  onResponse,
  onRegReport,
  onDeleteReport,
  onRegAnnouncement,
  onDeleteAnnouncement,
}) => {
  const valueColor = Colors.blue[7];

  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showRegAnnouncementModal, setShowRegAnnouncementModal] =
    useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);

  const {
    ViolationID,
    ViolationFirstName,
    ViolationLastName,
    RegFirstName,
    RegLastName,
    RegPicFileName,
    DetailsText,
    FinalStatusID,
    RegDate,
    RegTime,
    Actions,
    Files,
    ResponseFiles,
    Reports,
    AnnounceInfo,
  } = violation;

  const handleSubmitResponse = async (response) => {
    const data = await service.saveData(response);

    await onResponse(data);
  };

  const getFooterButtons = () => {
    let buttons = [
      <Button key="close-button" onClick={onOk}>
        {Words.close}
      </Button>,
    ];

    // if in progress
    if (violation?.FinalStatusID === 1) {
      buttons = [
        <Button
          key="submit-button"
          type="primary"
          icon={<HokmIcon />}
          onClick={() => setShowResponseModal(true)}
        >
          {Words.submit_vote}
        </Button>,
        ...buttons,
      ];
    }

    buttons = [
      <Button
        key={
          AnnounceInfo ? "announcement-button" : "submit-announcement-button"
        }
        type="primary"
        icon={<AnnounceIcon />}
        onClick={() =>
          AnnounceInfo
            ? setShowAnnouncementModal(true)
            : setShowRegAnnouncementModal(true)
        }
      >
        {AnnounceInfo ? Words.announcement : Words.submit_announcement}
      </Button>,
      ...buttons,
    ];

    buttons = [
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
      ...buttons,
    ];

    return buttons;
  };

  return (
    <>
      <Modal
        open={isOpen}
        maskClosable={false}
        centered={true}
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
                <Alert
                  message={
                    <Space>
                      <MemberProfileImage
                        fileName={RegPicFileName}
                        size="small"
                      />

                      <Text
                        style={{ fontSize: 14 }}
                      >{`${RegFirstName} ${RegLastName}`}</Text>
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
                      {utils.farsiNum(`#${ViolationID}`)}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label={Words.status}>
                    <Text style={{ color: getFinalStatusColor(violation) }}>
                      {getFinalStatusTitle(violation)}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label={Words.violation_person}>
                    <Text
                      style={{ color: Colors.red[7] }}
                    >{`${ViolationFirstName} ${ViolationLastName}`}</Text>
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

                  {Files.length > 0 && (
                    <Descriptions.Item label={Words.attached_files} span={2}>
                      <Col xs={24}>
                        {Files.map((f) => (
                          <a
                            key={f.FileID}
                            href={`${violationFilesUrl}/${f.FileName}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Tag
                              color="cyan"
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
                          {Actions[0].DetailsText.length > 0 && (
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
                      {ResponseFiles.length > 0 && (
                        <Descriptions.Item
                          label={Words.attached_files}
                          span={2}
                        >
                          <Col xs={24}>
                            {ResponseFiles.map((f) => (
                              <a
                                key={f.FileID}
                                href={`${violationResponseFilesUrl}/${f.FileName}`}
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

      {showResponseModal && (
        <ResponseModal
          isOpen={showResponseModal}
          onOk={handleSubmitResponse}
          onCancel={() => setShowResponseModal(false)}
          violation={violation}
        />
      )}

      {showReportsModal && (
        <ReportsModal
          isOpen={showReportsModal}
          onRegReport={onRegReport}
          onDeleteReport={onDeleteReport}
          onCancel={() => setShowReportsModal(false)}
          violation={violation}
        />
      )}

      {showRegAnnouncementModal && (
        <RegAnnouncementModal
          isOpen={showRegAnnouncementModal}
          onOk={onRegAnnouncement}
          onCancel={() => setShowRegAnnouncementModal(false)}
          violation={violation}
        />
      )}

      {showAnnouncementModal && (
        <AnnouncementModal
          isOpen={showAnnouncementModal}
          onDelete={onDeleteAnnouncement}
          onCancel={() => setShowAnnouncementModal(false)}
          violation={violation}
        />
      )}
    </>
  );
};

export default UserOfficialCheckViolationDetailsModal;
