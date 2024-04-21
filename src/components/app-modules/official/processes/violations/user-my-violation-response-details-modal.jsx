import React from "react";
import { useMount } from "react-use";
import {
  Button,
  Modal,
  Row,
  Col,
  Typography,
  Descriptions,
  Tag,
  Divider,
} from "antd";
import { PaperClipOutlined as AttachedFileIcon } from "@ant-design/icons";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import configInfo from "./../../../../../config.json";

const { violationResponseFilesUrl } = configInfo;
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

const UserMyViolationResponseDetailsModal = ({
  violation,
  isOpen,
  onOk,
  onSeen,
}) => {
  const valueColor = Colors.blue[7];

  const {
    ViolationID,
    ViolationFirstName,
    ViolationLastName,
    // RegFirstName,
    // RegLastName,
    // RegPicFileName,
    // DetailsText,
    // FinalStatusID,
    // Files,
    RegDate,
    RegTime,
    Actions,
    ResponseFiles,
    // Reports,
    // AnnounceInfo,
  } = violation;

  useMount(async () => {
    if (!violation.SeenInfo) {
      await onSeen(violation.ViolationID);
    }
  });

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
      width={750}
    >
      <section>
        <article
          id="info-content"
          className="scrollbar-normal"
          style={{ maxHeight: "calc(100vh - 180px)" }}
        >
          <Row gutter={[10, 10]}>
            {/* <Col xs={24}>
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
              </Col> */}
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
                <Descriptions.Item label={Words.audience}>
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

                {/* {DetailsText.length > 0 && (
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
                  )} */}

                {/* {Files.length > 0 && (
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
                  )} */}
              </Descriptions>

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
                      <Descriptions.Item label={Words.descriptions} span={2}>
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
                  <Descriptions.Item label={Words.attached_files} span={2}>
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
            </Col>
          </Row>
        </article>
      </section>
    </Modal>
  );
};

export default UserMyViolationResponseDetailsModal;
