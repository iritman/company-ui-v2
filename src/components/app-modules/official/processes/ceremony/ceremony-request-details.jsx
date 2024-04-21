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
// import MemberProfileImage from "./../../../../common/member-profile-image";

const {
  //   ceremonyRequestFilesUrl,
  ceremonyRequestActionFilesUrl,
} = configInfo;

const { Text } = Typography;
const { Step } = Steps;

const CeremonyOption = ({ title, selected }) => {
  return (
    <div style={{ margin: 5 }}>
      <Space>
        {selected ? (
          <CheckIcon style={{ color: Colors.green[6] }} />
        ) : (
          <CloseIcon style={{ color: Colors.red[6] }} />
        )}
        <Text>{title}</Text>
      </Space>
    </div>
  );
};

const CeremonyRequestDetails = ({ request, bannedSteps }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleStepChange = (current) => {
    setCurrentStep(current);
  };

  const valueColor = Colors.blue[7];

  const {
    RequestID,
    Title,
    ClientCounts,
    Clients,
    StartDate,
    FinishDate,
    EstimatedEntryTime,
    NeedFruit,
    NeedSweet,
    NeedBreakfast,
    NeedLunch,
    NeedDinner,
    NeedHoteling,
    NeedVehicle,
    NeededFacilities,
    // OfficialClientTypeID,
    ClientTypeTitle,
    ClientTypeDetailsText,
    Dishes,
    Foods,
    // OfficialSelectedSessionLocationID,
    LocationTitle,
    OfficialIsVehicleApproved,
    OfficialVehicleDetailsText,
    OfficialIsHotelingApproved,
    OfficialHotelingDetailsText,
    DetailsText,
    FinalStatusID,
    // RegMemberID,
    RegFirstName,
    RegLastName,
    RegDate,
    RegTime,
    Actions,
  } = request;

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

  const getCeremonyOptions = () => {
    return (
      <>
        <CeremonyOption title={Words.fruit} selected={NeedFruit} />
        <CeremonyOption title={Words.sweet} selected={NeedSweet} />
        <CeremonyOption title={Words.breakfast} selected={NeedBreakfast} />
        <CeremonyOption title={Words.lunch} selected={NeedLunch} />
        <CeremonyOption title={Words.dinner} selected={NeedDinner} />
      </>
    );
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
          <Descriptions.Item label={Words.client_counts}>
            <Text style={{ color: Colors.red[3] }}>
              {utils.farsiNum(`${ClientCounts} ${Words.person}`)}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.clients}>
            <Text style={{ color: Colors.magenta[4] }}>{Clients}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.start_date}>
            <Text style={{ color: valueColor }}>
              {utils.farsiNum(
                `${utils.colonTime(EstimatedEntryTime)} - ${utils.slashDate(
                  StartDate
                )}`
              )}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.finish_date}>
            <Text style={{ color: valueColor }}>
              {utils.farsiNum(utils.slashDate(`${FinishDate}`))}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.ceremony_options}>
            <Text style={{ color: valueColor }}>{getCeremonyOptions()}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.needed_facilities}>
            <Text
              style={{
                color: Colors.cyan[6],
                whiteSpace: "pre-line",
              }}
            >
              {utils.farsiNum(NeededFacilities)}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.need_vehicle}>
            <Text style={{ color: valueColor }}>
              {NeedVehicle ? Words.yes : "-"}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.need_hoteling}>
            <Text style={{ color: valueColor }}>
              {NeedHoteling ? Words.yes : "-"}
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

          {/* {Files.length > 0 && (
            <Descriptions.Item label={Words.attached_files} span={2}>
              <Col xs={24}>
                {Files.map((f) => (
                  <a
                    key={f.FileID}
                    href={`${managementTransferFilesUrl}/${f.FileName}`}
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
      ),
    },
  ];

  (bannedSteps
    ? Actions.filter(
        (action) =>
          bannedSteps.findIndex((s) => s.StepID === action.StepID) === -1
      )
    : Actions
  ).forEach((action) => {
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

              {action.StepID === 1 && (
                <>
                  <Descriptions.Item label={Words.client_type}>
                    <Text style={{ color: Colors.magenta[4] }}>
                      {ClientTypeTitle}
                    </Text>
                  </Descriptions.Item>

                  <Descriptions.Item label={Words.session_location}>
                    <Text style={{ color: Colors.cyan[6] }}>
                      {LocationTitle}
                    </Text>
                  </Descriptions.Item>

                  <Descriptions.Item
                    label={Words.client_type_details_text}
                    span={2}
                  >
                    <Text
                      style={{
                        color: Colors.purple[7],
                        whiteSpace: "pre-line",
                      }}
                    >
                      {utils.farsiNum(ClientTypeDetailsText)}
                    </Text>
                  </Descriptions.Item>

                  <Descriptions.Item label={Words.foods}>
                    <Text
                      style={{
                        color: Colors.purple[7],
                        whiteSpace: "pre-line",
                      }}
                    >
                      {utils.farsiNum(Foods)}
                    </Text>
                  </Descriptions.Item>

                  <Descriptions.Item label={Words.dishes}>
                    <Text
                      style={{
                        color: Colors.purple[7],
                        whiteSpace: "pre-line",
                      }}
                    >
                      {utils.farsiNum(Dishes)}
                    </Text>
                  </Descriptions.Item>

                  {NeedVehicle && (
                    <Descriptions.Item
                      label={Words.questions.vehicle_request_approved}
                      span={2}
                    >
                      <Text
                        style={{
                          color: OfficialIsVehicleApproved
                            ? Colors.green[7]
                            : Colors.red[7],
                        }}
                      >
                        {OfficialIsVehicleApproved ? Words.yes : Words.no}
                      </Text>
                    </Descriptions.Item>
                  )}

                  {OfficialVehicleDetailsText.length > 0 && (
                    <Descriptions.Item
                      label={Words.transfer_description}
                      span={2}
                    >
                      <Text
                        style={{
                          color: Colors.purple[7],
                          whiteSpace: "pre-line",
                        }}
                      >
                        {utils.farsiNum(OfficialVehicleDetailsText)}
                      </Text>
                    </Descriptions.Item>
                  )}

                  {NeedHoteling && (
                    <Descriptions.Item
                      label={Words.questions.hoteling_request_approved}
                      span={2}
                    >
                      <Text
                        style={{
                          color: OfficialIsHotelingApproved
                            ? Colors.green[7]
                            : Colors.red[7],
                        }}
                      >
                        {OfficialIsHotelingApproved ? Words.yes : Words.no}
                      </Text>
                    </Descriptions.Item>
                  )}

                  {OfficialHotelingDetailsText.length > 0 && (
                    <Descriptions.Item
                      label={Words.hoteling_description}
                      span={2}
                    >
                      <Text
                        style={{
                          color: Colors.purple[7],
                          whiteSpace: "pre-line",
                        }}
                      >
                        {utils.farsiNum(OfficialHotelingDetailsText)}
                      </Text>
                    </Descriptions.Item>
                  )}
                </>
              )}

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
                        href={`${ceremonyRequestActionFilesUrl}/${f.FileName}`}
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
              <Text>{utils.farsiNum(`#${RequestID} - ${Title}`)}</Text>
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

export default CeremonyRequestDetails;
