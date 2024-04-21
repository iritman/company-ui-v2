import React from "react";
import {
  Button,
  Row,
  Col,
  Typography,
  Alert,
  Descriptions,
  Divider,
  Tag,
} from "antd";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import ModalWindow from "../../../common/modal-window";

const { Text } = Typography;

const getRequestStatusColor = (record) => {
  let color = Colors.grey[6];

  const { IsAccepted, ResponseMemberID } = record;

  if (ResponseMemberID > 0 && !IsAccepted) color = Colors.red[6];
  else if (ResponseMemberID > 0 && IsAccepted) color = Colors.green[6];

  return color;
};

const getRequestStatusTitle = (record) => {
  let title = Words.in_progress;

  const { IsAccepted, ResponseMemberID } = record;

  if (ResponseMemberID > 0 && !IsAccepted) title = Words.rejected;
  else if (ResponseMemberID > 0 && IsAccepted) title = Words.accepted;

  return title;
};

const UserMembersExtraWorkRequestDetailsModal = ({
  extraWorkRequest,
  isOpen,
  onOk,
}) => {
  const valueColor = Colors.blue[7];

  const {
    RequestID,
    // SourceID,
    CommandSourceTitle,
    DetailsText,
    Employees,
    // RegMemberID,
    RegFirstName,
    RegLastName,
    // RegMemberDepartmentID,
    DepartmentTitle,
    StartDate,
    StartTime,
    FinishDate,
    FinishTime,
    DurationInMin,
    RegDate,
    RegTime,
    ResponseMemberID,
    ResponseFirstName,
    ResponseLastName,
    ResponseDetailsText,
    // IsAccepted,
    ResponseRegDate,
    ResponseRegTime,
  } = extraWorkRequest;

  return (
    <>
      <ModalWindow
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
        <Row gutter={[10, 10]}>
          <Col xs={24}>
            <Alert
              message={utils.farsiNum(
                `#${RequestID} - ${Words.request_duration}: ${utils.minToTime(
                  DurationInMin
                )}`
              )}
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
              <Descriptions.Item label={Words.start_date}>
                <Text style={{ color: valueColor }}>
                  {`${utils.weekDayNameFromText(StartDate)} ${utils.farsiNum(
                    utils.slashDate(StartDate)
                  )}`}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.start_time}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(utils.colonTime(StartTime))}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.finish_date}>
                <Text style={{ color: valueColor }}>
                  {`${utils.weekDayNameFromText(FinishDate)} ${utils.farsiNum(
                    utils.slashDate(FinishDate)
                  )}`}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.finish_time}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(utils.colonTime(FinishTime))}
                </Text>
              </Descriptions.Item>

              <Descriptions.Item label={Words.extra_work_command_source}>
                <Text
                  style={{ color: Colors.green[7] }}
                >{`${CommandSourceTitle}`}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.department}>
                <Text
                  style={{ color: Colors.purple[6] }}
                >{`${DepartmentTitle}`}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.reg_member}>
                <Text
                  style={{ color: Colors.red[7] }}
                >{`${RegFirstName} ${RegLastName}`}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.reg_date_time}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(
                    `${utils.colonTime(RegTime)} - ${utils.weekDayNameFromText(
                      RegDate
                    )} ${utils.slashDate(RegDate)}`
                  )}
                </Text>
              </Descriptions.Item>

              {Employees.length > 0 && (
                <Descriptions.Item label={Words.employees} span={2}>
                  {Employees.map((emp) => (
                    <Tag color="magenta">{`${emp.FirstName} ${emp.LastName}`}</Tag>
                  ))}
                </Descriptions.Item>
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
            </Descriptions>
          </Col>
          <Col xs={24}>
            <Divider orientation="right" plain>
              <Text style={{ fontSize: 12 }}>{Words.official_response}</Text>
            </Divider>
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
              <Descriptions.Item label={Words.status}>
                <Text
                  style={{ color: getRequestStatusColor(extraWorkRequest) }}
                >
                  {getRequestStatusTitle(extraWorkRequest)}
                </Text>
              </Descriptions.Item>

              <Descriptions.Item label={Words.official_expert}>
                <Text
                  style={{ color: Colors.red[7] }}
                >{`${ResponseFirstName} ${ResponseLastName}`}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.reg_date}>
                <Text style={{ color: valueColor }}>
                  {ResponseMemberID > 0
                    ? utils.farsiNum(
                        `${utils.weekDayNameFromText(
                          ResponseRegDate
                        )} ${utils.slashDate(ResponseRegDate)}`
                      )
                    : "-"}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.reg_time}>
                <Text style={{ color: valueColor }}>
                  {ResponseMemberID > 0
                    ? utils.farsiNum(`${utils.colonTime(ResponseRegTime)}`)
                    : "-"}
                </Text>
              </Descriptions.Item>

              {ResponseDetailsText.length > 0 && (
                <Descriptions.Item label={Words.descriptions} span={2}>
                  <Text
                    style={{
                      color: Colors.purple[7],
                      whiteSpace: "pre-line",
                    }}
                  >
                    {utils.farsiNum(ResponseDetailsText)}
                  </Text>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Col>
        </Row>
      </ModalWindow>
    </>
  );
};

export default UserMembersExtraWorkRequestDetailsModal;
