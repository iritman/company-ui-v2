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

const MissionDetails = ({ mission, securityPersonView }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleStepChange = (current) => {
    setCurrentStep(current);
  };

  const valueColor = Colors.blue[7];

  const {
    // MissionID,
    // MemberID,
    FirstName,
    LastName,
    PicFileName,
    RegDate,
    RegTime,
    DetailsText,
    // MissionTypeID,
    MissionTypeTitle,
    TargetTitle,
    InProvince,
    Subject,
    NeedVehicle,
    NeedHoteling,
    FormatID,
    StartDate,
    FinishDate,
    StartTime,
    FinishTime,
    OfficialIsVehicleApproved,
    OfficialIsHotelingApproved,
    OfficialTransmissionDetailsText,
    // -----------------------
    // SwapMemberID,
    SwapMemberFirstName,
    SwapMemberLastName,
    // -----------------------
    VehicleInfo,
    // -----------------------
    // FinalStatusID,
    Actions,
  } = mission;

  const getRequirementsTitle = () => {
    let result = "-";

    if (NeedVehicle || NeedHoteling) {
      let requirements = [];

      if (NeedVehicle) requirements = [...requirements, Words.vehicle];
      if (NeedHoteling) requirements = [...requirements, Words.hoteling];

      result = requirements.join(" - ");
    }

    return result;
  };

  const officialChecked = () => Actions[2].MemberID > 0;

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
          <Descriptions.Item label={Words.swap_member}>
            <Text
              style={{ color: Colors.red[7] }}
            >{`${SwapMemberFirstName} ${SwapMemberLastName}`}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.mission_type}>
            <Text style={{ color: Colors.green[6] }}>{MissionTypeTitle}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.mission_subject} span={2}>
            <Text style={{ color: Colors.orange[6] }}>{Subject}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.mission_target}>
            <Text style={{ color: Colors.cyan[6] }}>{TargetTitle}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.mission_target_type}>
            <Text style={{ color: Colors.purple[6] }}>
              {InProvince ? Words.inside_province : Words.outside_province}
            </Text>
          </Descriptions.Item>

          <Descriptions.Item label={Words.requirements} span={2}>
            <Text style={{ color: Colors.grey[6] }}>
              {getRequirementsTitle()}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.vehicle}>
            {NeedVehicle && officialChecked() ? (
              <Text
                style={{
                  color: OfficialIsVehicleApproved
                    ? Colors.green[6]
                    : Colors.red[6],
                }}
              >
                {OfficialIsVehicleApproved
                  ? Words.accept_request
                  : Words.reject_request}
              </Text>
            ) : (
              <Text style={{ color: valueColor }}>{"-"}</Text>
            )}
          </Descriptions.Item>
          <Descriptions.Item label={Words.hoteling}>
            {NeedHoteling && officialChecked() ? (
              <Text
                style={{
                  color: OfficialIsHotelingApproved
                    ? Colors.green[6]
                    : Colors.red[6],
                }}
              >
                {OfficialIsHotelingApproved
                  ? Words.accept_request
                  : Words.reject_request}
              </Text>
            ) : (
              <Text style={{ color: valueColor }}>{"-"}</Text>
            )}
          </Descriptions.Item>

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

  if (!securityPersonView) {
    Actions?.forEach((action) => {
      steps?.push({
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
                      <CloseIcon
                        style={{ color: Colors.red[7], fontSize: 18 }}
                      />
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
                {action.StepID === 3 &&
                  OfficialTransmissionDetailsText?.length > 0 && (
                    <Descriptions.Item
                      label={Words.transmission_descriptions}
                      span={2}
                    >
                      <Text
                        style={{
                          color: Colors.purple[7],
                          whiteSpace: "pre-line",
                        }}
                      >
                        {utils.farsiNum(OfficialTransmissionDetailsText)}
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
  }

  const hasTransmissionResponse = () =>
    typeof VehicleInfo === "object" && VehicleInfo?.RegMemberID > 0;

  if (NeedVehicle && OfficialIsVehicleApproved) {
    steps = [
      ...steps,
      {
        stepID: 4,
        title: Words.transmission,
        status: hasTransmissionResponse() ? "finish" : "wait",
        content: (
          <>
            {!hasTransmissionResponse() ? (
              <Alert
                message={Words.messages.transmission_response_not_submitted}
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
                <Descriptions.Item label={Words.transfer_type} span={2}>
                  <Text style={{ color: Colors.cyan[6] }}>
                    {VehicleInfo.TransferTypeID === 1
                      ? utils.farsiNum(
                          `${VehicleInfo.VehicleTypeTitle} ${VehicleInfo.BrandTitle} ${VehicleInfo.ModelTitle} - ${VehicleInfo.Pelak}`
                        )
                      : VehicleInfo.TransferTypeTitle}
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
                      {utils.farsiNum(VehicleInfo.DetailsText)}
                    </Text>
                  </Descriptions.Item>
                )}

                <Descriptions.Item label={Words.transmission_manager}>
                  <Text style={{ color: valueColor }}>
                    {`${VehicleInfo.RegFirstName} ${VehicleInfo.RegLastName}`}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.reg_date_time}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(
                      `${utils.slashDate(
                        VehicleInfo.RegDate
                      )} - ${utils.colonTime(VehicleInfo.RegTime)}`
                    )}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            )}
          </>
        ),
      },
    ];
  }

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

export default MissionDetails;
