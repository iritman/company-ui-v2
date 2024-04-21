import React, { useState } from "react";
import { useMount } from "react-use";
import { Row, Col, Typography, Alert, Badge, Card, Space } from "antd";

import service from "./../../../../services/dashboard/user-dashboard-service";
import { handleError } from "./../../../../tools/form-manager";
import Words from "./../../../../resources/words";
import utils from "./../../../../tools/utils";
import LinkButton from "../../../common/link-button";
import ReloadButton from "../../../common/reload-button";
import Colors from "./../../../../resources/colors";

const { Text } = Typography;

const InfoAlert = ({ value, message, link }) => {
  return (
    <Alert
      showIcon
      message={<Text>{utils.farsiNum(message.replace("#", value))}</Text>}
      type="info"
      action={<LinkButton title={Words.view} link={link} />}
    />
  );
};

const UserTimexDashboard = () => {
  const [inProgress, setInProgress] = useState(false);
  const [statistics, setStatistics] = useState({
    NewVacationReplaceWorkRequests: 0,
    NewMissionReplaceWorkRequests: 0,
    NewVacationRequestsForManager: 0,
    NewMissionRequestsForManager: 0,
    NewMissionReportsForManager: 0,
    NewVacationRequestsForOfficial: 0,
    NewMissionRequestsForOfficial: 0,
    NewExtraWorkRequestsForOfficial: 0,
    IsSupervisor: false,
    IsManager: false,
    IsOfficialExpert: false,
  });

  // const initStatistics = () => {
  //   setStatistics({
  //     NewVacationReplaceWorkRequests: 0,
  //     NewMissionReplaceWorkRequests: 0,
  //     NewVacationRequestsForManager: 7,
  //     NewMissionRequestsForManager: 6,
  //     NewMissionReportsForManager: 5,
  //     NewVacationRequestsForOfficial: 1,
  //     NewMissionRequestsForOfficial: 2,
  //     NewExtraWorkRequestsForOfficial: 3,
  //     IsSupervisor: false,
  //     IsManager: true,
  //     IsOfficialExpert: true,
  //   });
  // };

  useMount(async () => {
    await loadStatistics();
  });

  const loadStatistics = async () => {
    setInProgress(true);

    try {
      const data = await service.getTimexStatistics();

      setStatistics(data);
      // initStatistics();
    } catch (ex) {
      handleError(ex);
    }

    setInProgress(false);
  };

  const {
    NewVacationReplaceWorkRequests,
    NewMissionReplaceWorkRequests,
    NewVacationRequestsForManager,
    NewMissionRequestsForManager,
    NewMissionReportsForManager,
    NewVacationRequestsForOfficial,
    NewMissionRequestsForOfficial,
    NewExtraWorkRequestsForOfficial,
    IsSupervisor,
    IsManager,
    IsOfficialExpert,
  } = statistics;

  const my_cartable_requests =
    NewVacationReplaceWorkRequests + NewMissionReplaceWorkRequests;

  const department_cartable_requests =
    NewVacationRequestsForManager +
    NewMissionRequestsForManager +
    NewMissionReportsForManager;

  const official_cartable_requests =
    NewVacationRequestsForOfficial +
    NewMissionRequestsForOfficial +
    NewExtraWorkRequestsForOfficial;

  const has_department_cartable = IsSupervisor || IsManager;

  const has_official_cartable = IsOfficialExpert;

  return (
    <Row gutter={[20, 16]}>
      <Col xs={24}>
        <Space>
          <Text
            style={{
              paddingBottom: 20,
              paddingRight: 5,
              fontSize: 18,
            }}
            strong
            type="success"
          >
            {Words.timex}
          </Text>

          <ReloadButton
            tooltip={Words.update}
            inProgress={inProgress}
            onClick={loadStatistics}
          />
        </Space>
      </Col>
      <Col xs={24}>
        <Badge.Ribbon
          text={
            my_cartable_requests > 0
              ? utils.farsiNum(`${my_cartable_requests} ${Words.new_request}`)
              : ""
          }
          color="pink"
        >
          <Card
            title={
              <Text style={{ color: Colors.red[6] }}>{Words.my_cartable}</Text>
            }
            size="small"
          >
            {my_cartable_requests > 0 ? (
              <Row gutter={[10, 5]}>
                {NewVacationReplaceWorkRequests > 0 && (
                  <Col xs={24}>
                    <InfoAlert
                      value={NewVacationReplaceWorkRequests}
                      message={
                        Words.messages.num_of_new_vacation_replace_work_requests
                      }
                      link="vacation-replace-work-requests"
                    />
                  </Col>
                )}

                {NewMissionReplaceWorkRequests > 0 && (
                  <Col xs={24}>
                    <InfoAlert
                      value={NewMissionReplaceWorkRequests}
                      message={
                        Words.messages.num_of_new_mission_replace_work_requests
                      }
                      link="mission-replace-work-requests"
                    />
                  </Col>
                )}
              </Row>
            ) : (
              <Alert
                showIcon
                type="warning"
                message={Words.messages.no_new_requests}
              />
            )}
          </Card>
        </Badge.Ribbon>
      </Col>
      {has_department_cartable && (
        <Col xs={24}>
          <Badge.Ribbon
            text={
              department_cartable_requests > 0
                ? utils.farsiNum(
                    `${department_cartable_requests} ${Words.new_request}`
                  )
                : ""
            }
            color="green"
          >
            <Card
              title={
                <Text style={{ color: Colors.red[6] }}>
                  {Words.department_cartable}
                </Text>
              }
              size="small"
            >
              {department_cartable_requests > 0 ? (
                <Row gutter={[10, 5]}>
                  {NewVacationRequestsForManager > 0 && (
                    <Col xs={24}>
                      <InfoAlert
                        value={NewVacationRequestsForManager}
                        message={Words.messages.num_of_new_vacation_requests}
                        link="members-new-vacations-check-manager"
                      />
                    </Col>
                  )}

                  {NewMissionRequestsForManager > 0 && (
                    <Col xs={24}>
                      <InfoAlert
                        value={NewMissionRequestsForManager}
                        message={Words.messages.num_of_new_mission_requests}
                        link="members-new-missions-check-manager"
                      />
                    </Col>
                  )}

                  {NewMissionReportsForManager > 0 && (
                    <Col xs={24}>
                      <InfoAlert
                        value={NewMissionReportsForManager}
                        message={Words.messages.num_of_new_mission_reports}
                        link="members-new-mission-reports"
                      />
                    </Col>
                  )}
                </Row>
              ) : (
                <Alert
                  showIcon
                  type="warning"
                  message={Words.messages.no_new_requests}
                />
              )}
            </Card>
          </Badge.Ribbon>
        </Col>
      )}
      {has_official_cartable && (
        <Col xs={24}>
          <Badge.Ribbon
            text={
              official_cartable_requests > 0
                ? utils.farsiNum(
                    `${official_cartable_requests} ${Words.new_request}`
                  )
                : ""
            }
            color="volcano"
          >
            <Card
              title={
                <Text style={{ color: Colors.red[6] }}>
                  {Words.official_cartable}
                </Text>
              }
              size="small"
            >
              {official_cartable_requests > 0 ? (
                <Row gutter={[10, 5]}>
                  {NewVacationRequestsForOfficial > 0 && (
                    <Col xs={24}>
                      <InfoAlert
                        value={NewVacationRequestsForOfficial}
                        message={Words.messages.num_of_new_vacation_requests}
                        link="members-new-vacations-check-official"
                      />
                    </Col>
                  )}

                  {NewMissionRequestsForOfficial > 0 && (
                    <Col xs={24}>
                      <InfoAlert
                        value={NewMissionRequestsForOfficial}
                        message={Words.messages.num_of_new_mission_requests}
                        link="members-new-missions-check-official"
                      />
                    </Col>
                  )}

                  {NewExtraWorkRequestsForOfficial > 0 && (
                    <Col xs={24}>
                      <InfoAlert
                        value={NewExtraWorkRequestsForOfficial}
                        message={Words.messages.num_of_new_extra_work_requests}
                        link="official-check-extra-work-requests"
                      />
                    </Col>
                  )}
                </Row>
              ) : (
                <Alert
                  showIcon
                  type="warning"
                  message={Words.messages.no_new_requests}
                />
              )}
            </Card>
          </Badge.Ribbon>
        </Col>
      )}
    </Row>
  );
};

export default UserTimexDashboard;
