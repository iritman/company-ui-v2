import React, { useState } from "react";
import {
  Row,
  Col,
  Typography,
  Space,
  Alert,
  Steps,
  Descriptions,
  Tag,
} from "antd";
import {
  CloseCircleOutlined as CloseIcon,
  CheckCircleOutlined as CheckIcon,
  PaperClipOutlined as AttachedFileIcon,
} from "@ant-design/icons";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import configInfo from "../../../../../config.json";
import MemberProfileImage from "./../../../../common/member-profile-image";

const { checkoutFilesUrl, checkoutActionFilesUrl } = configInfo;
const { Text } = Typography;
const { Step } = Steps;

const CheckoutDetails = ({ checkout }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleStepChange = (current) => {
    setCurrentStep(current);
  };

  const valueColor = Colors.blue[7];

  const {
    // CheckoutID,
    // RegMemberID,
    RegFirstName,
    RegLastName,
    // RegPicFileName,
    // CheckoutMemberID,
    CheckoutFirstName,
    CheckoutLastName,
    CheckoutPicFileName,
    RegDate,
    RegTime,
    DetailsText,
    Files,
    FinalStatusID,
    Actions,
  } = checkout;

  const getFinalStatusColor = () => {
    let color = Colors.grey[6];

    if (FinalStatusID > 1) {
      color = FinalStatusID === 2 ? Colors.green[6] : Colors.red[6];
    }

    return color;
  };

  const getFinalStatusTitle = () => {
    let title = Words.in_progress;

    if (FinalStatusID > 1) {
      title = FinalStatusID === 2 ? Words.accepted : Words.rejected;
    }

    return title;
  };

  let steps = [
    {
      stepID: 0,
      title: Words.request_info,
      status: "finish",
      content: (
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
          <Descriptions.Item label={Words.status}>
            <Text style={{ color: getFinalStatusColor() }}>
              {getFinalStatusTitle()}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.reg_member}>
            <Text
              style={{ color: valueColor }}
            >{`${RegFirstName} ${RegLastName}`}</Text>
          </Descriptions.Item>

          <Descriptions.Item label={Words.reg_date}>
            <Text style={{ color: valueColor }}>
              {utils.farsiNum(
                `${utils.weekDayNameFromText(RegDate)} ${utils.slashDate(
                  RegDate
                )}`
              )}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.reg_time}>
            <Text style={{ color: valueColor }}>
              {utils.farsiNum(`${utils.colonTime(RegTime)}`)}
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
                    href={`${checkoutFilesUrl}/${f.FileName}`}
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
      ),
    },
  ];

  Actions.forEach((action) => {
    steps.push({
      stepID: action.StepID,
      title: action.SysRoleTitle,
      status: action.MemberID > 0 ? "finish" : "wait",
      content: (
        <>
          {action.MemberID === 0 ? (
            <Alert
              message={
                <Text>
                  {Words.messages.no_response_submitted.replace(
                    "#",
                    action.SysRoleTitle
                  )}
                </Text>
              }
              type="warning"
              showIcon
            />
          ) : (
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
              <Descriptions.Item
                label={`${Words.response} ${action.SysRoleTitle}`}
              >
                <Space>
                  {action.IsAccepted ? (
                    <CheckIcon
                      style={{ color: Colors.green[7], fontSize: 18 }}
                    />
                  ) : (
                    <CloseIcon style={{ color: Colors.red[7], fontSize: 18 }} />
                  )}
                  <Text
                    style={{
                      color: action.IsAccepted
                        ? Colors.green[6]
                        : Colors.red[6],
                    }}
                  >
                    {action.IsAccepted ? Words.accepted : Words.rejected}
                  </Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label={Words.reg_member}>
                <Text
                  style={{
                    color: Colors.orange[7],
                  }}
                >
                  {`${action.FirstName} ${action.LastName}`}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.reg_date}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(
                    `${utils.weekDayNameFromText(
                      action.ActionDate
                    )} ${utils.slashDate(action.ActionDate)}`
                  )}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.reg_time}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(`${utils.colonTime(action.ActionTime)}`)}
                </Text>
              </Descriptions.Item>

              {action.DetailsText.length > 0 && (
                <Descriptions.Item label={Words.descriptions} span={2}>
                  <Text
                    style={{
                      color: Colors.purple[7],
                      whiteSpace: "pre-line",
                    }}
                  >
                    {utils.farsiNum(action.DetailsText)}
                  </Text>
                </Descriptions.Item>
              )}

              {action.Files.length > 0 && (
                <Descriptions.Item label={Words.attached_files} span={2}>
                  <Col xs={24}>
                    {action.Files.map((f) => (
                      <a
                        key={f.FileID}
                        href={`${checkoutActionFilesUrl}/${f.FileName}`}
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
          )}
        </>
      ),
    });
  });

  return (
    <Row gutter={[10, 10]}>
      <Col xs={24}>
        <Alert
          message={
            <Space>
              <MemberProfileImage fileName={CheckoutPicFileName} />
              <Text>{`${CheckoutFirstName} ${CheckoutLastName}`}</Text>
            </Space>
          }
          type="info"
        />
      </Col>
      <Col xs={24}>
        <Steps current={currentStep} onChange={handleStepChange}>
          {steps.map((item) => (
            <Step
              key={item.title}
              title={
                <Text
                  style={{
                    fontSize: 13,
                    color:
                      item.stepID === currentStep
                        ? Colors.orange[6]
                        : Colors.grey[8],
                  }}
                >
                  {item.title}
                </Text>
              }
              status={item.status}
            />
          ))}
        </Steps>
      </Col>
      <Col xs={24}>{steps[currentStep].content}</Col>
    </Row>
  );
};

export default CheckoutDetails;
