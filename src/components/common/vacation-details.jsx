import React, { useState } from "react";
import { Row, Col, Typography, Space, Alert, Steps, Descriptions } from "antd";
import {
  CloseCircleOutlined as CloseIcon,
  CheckCircleOutlined as CheckIcon,
} from "@ant-design/icons";
import Words from "../../resources/words";
import Colors from "../../resources/colors";
import utils from "../../tools/utils";
import MemberProfileImage from "./member-profile-image";

const { Text } = Typography;
const { Step } = Steps;

const VacationDetails = ({ vacation }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleStepChange = (current) => {
    setCurrentStep(current);
  };

  const valueColor = Colors.blue[7];

  const {
    // VacationID,
    // MemberID,
    FirstName,
    LastName,
    PicFileName,
    RegDate,
    RegTime,
    DetailsText,
    // VacationTypeID,
    VacationTypeTitle,
    FormatID,
    StartDate,
    FinishDate,
    StartTime,
    FinishTime,
    // -----------------------
    SwapMemberID,
    SwapMemberFirstName,
    SwapMemberLastName,
    // -----------------------
    // FinalStatusID,
    Actions,
  } = vacation;

  const steps = [
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
          <Descriptions.Item label={Words.from_date}>
            <Text style={{ color: valueColor }}>
              {`${utils.weekDayNameFromText(StartDate)} ${utils.farsiNum(
                utils.slashDate(StartDate)
              )}`}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.to_date}>
            <Text style={{ color: valueColor }}>
              {`${utils.weekDayNameFromText(FinishDate)} ${utils.farsiNum(
                utils.slashDate(FinishDate)
              )}`}
            </Text>
          </Descriptions.Item>
          {FormatID === 1 && (
            <>
              <Descriptions.Item label={Words.start_time}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(utils.colonTime(StartTime))}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.finish_time}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(utils.colonTime(FinishTime))}
                </Text>
              </Descriptions.Item>
            </>
          )}
          <Descriptions.Item label={Words.swap_member}>
            <Text style={{ color: Colors.red[7] }}>
              {SwapMemberID > 0
                ? `${SwapMemberFirstName} ${SwapMemberLastName}`
                : Words.no_alternative_employee}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.vacation_type}>
            <Text style={{ color: Colors.green[6] }}>{VacationTypeTitle}</Text>
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
              <MemberProfileImage fileName={PicFileName} />
              <Text>{`${FirstName} ${LastName}`}</Text>
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

export default VacationDetails;
