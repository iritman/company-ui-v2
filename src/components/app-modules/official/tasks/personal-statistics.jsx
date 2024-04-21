import React from "react";
import { Col, Alert, Badge, Tooltip, Space, Typography } from "antd";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import StatisticTile from "../../../common/statistic-tile";
import MemberProfileImage from "../../../common/member-profile-image";

const { Text } = Typography;
const link_prefix = "/home/official/tasks";

const PersonalStatistics = ({ statistics, inProgress }) => {
  const {
    MyTomorrowTasks,
    MyTodayTasks,
    MyDelayedTasks,
    MyDoneTasks,
    MyUnreadReports,
    MyRegedReports,
    MyColleagues,
    //------
    MyUnderSupervisionTasks,
    MyFinishedSupervisionTasks,
    MyUnreadSupervisionReports,
    MyRegedSupervisionReports,
    //------
    EmployeesTomorrowTasks,
    EmployeesTodayTasks,
    EmployeesDelayedTasks,
    EmployeesDoneTasks,
    EmployeesUnreadReports,
    EmployeesRegedReports,
  } = statistics;

  return (
    <>
      <Col xs={24}>
        <Alert type="info" message={Words.my_tasks} />
      </Col>
      <Col xs={12} lg={4} md={8}>
        <StatisticTile
          linkPrefix={link_prefix}
          link="my-tasks"
          inProgress={inProgress}
          title={Words.today_tasks}
          value={MyTodayTasks > 0 ? utils.farsiNum(MyTodayTasks) : "-"}
          color={Colors.green[6]}
        />
      </Col>
      <Col xs={12} lg={4} md={8}>
        <StatisticTile
          linkPrefix={link_prefix}
          link="my-tasks"
          inProgress={inProgress}
          title={Words.tomorrow_tasks}
          value={MyTomorrowTasks > 0 ? utils.farsiNum(MyTomorrowTasks) : "-"}
          color={Colors.purple[6]}
        />
      </Col>
      <Col xs={12} lg={4} md={8}>
        <StatisticTile
          linkPrefix={link_prefix}
          link="my-tasks"
          inProgress={inProgress}
          title={Words.delayed_tasks}
          value={MyDelayedTasks > 0 ? utils.farsiNum(MyDelayedTasks) : "-"}
          color={Colors.red[6]}
        />
      </Col>
      <Col xs={12} lg={4} md={8}>
        <StatisticTile
          linkPrefix={link_prefix}
          link="my-done-tasks"
          inProgress={inProgress}
          title={Words.done_tasks}
          value={MyDoneTasks > 0 ? utils.farsiNum(MyDoneTasks) : "-"}
          color={Colors.blue[6]}
        />
      </Col>
      <Col xs={12} lg={4} md={8}>
        <StatisticTile
          linkPrefix={link_prefix}
          link="my-tasks"
          inProgress={inProgress}
          title={Words.new_reports}
          value={MyUnreadReports > 0 ? utils.farsiNum(MyUnreadReports) : "-"}
          color={Colors.red[5]}
        />
      </Col>
      <Col xs={12} lg={4} md={8}>
        <StatisticTile
          linkPrefix={link_prefix}
          link="my-tasks"
          inProgress={inProgress}
          title={Words.reged_reports}
          value={MyRegedReports > 0 ? utils.farsiNum(MyRegedReports) : "-"}
          color={Colors.green[5]}
        />
      </Col>
      <Col xs={24}>
        <Alert type="info" message={Words.following} />
      </Col>
      <Col xs={12} lg={4} md={8}>
        <StatisticTile
          linkPrefix={link_prefix}
          link="employees-tasks"
          inProgress={inProgress}
          title={Words.today_tasks}
          value={
            EmployeesTodayTasks > 0 ? utils.farsiNum(EmployeesTodayTasks) : "-"
          }
          color={Colors.green[6]}
        />
      </Col>
      <Col xs={12} lg={4} md={8}>
        <StatisticTile
          linkPrefix={link_prefix}
          link="employees-tasks"
          inProgress={inProgress}
          title={Words.tomorrow_tasks}
          value={
            EmployeesTomorrowTasks > 0
              ? utils.farsiNum(EmployeesTomorrowTasks)
              : "-"
          }
          color={Colors.purple[6]}
        />
      </Col>
      <Col xs={12} lg={4} md={8}>
        <StatisticTile
          linkPrefix={link_prefix}
          link="employees-tasks"
          inProgress={inProgress}
          title={Words.delayed_tasks}
          value={
            EmployeesDelayedTasks > 0
              ? utils.farsiNum(EmployeesDelayedTasks)
              : "-"
          }
          color={Colors.red[6]}
        />
      </Col>
      <Col xs={12} lg={4} md={8}>
        <StatisticTile
          linkPrefix={link_prefix}
          link="employees-tasks"
          inProgress={inProgress}
          title={Words.done_tasks}
          value={
            EmployeesDoneTasks > 0 ? utils.farsiNum(EmployeesDoneTasks) : "-"
          }
          color={Colors.blue[6]}
        />
      </Col>
      <Col xs={12} lg={4} md={8}>
        <StatisticTile
          linkPrefix={link_prefix}
          link="employees-tasks"
          inProgress={inProgress}
          title={Words.new_reports}
          value={
            EmployeesUnreadReports > 0
              ? utils.farsiNum(EmployeesUnreadReports)
              : "-"
          }
          color={Colors.red[5]}
        />
      </Col>
      <Col xs={12} lg={4} md={8}>
        <StatisticTile
          linkPrefix={link_prefix}
          link="employees-tasks"
          inProgress={inProgress}
          title={Words.reged_reports}
          value={
            EmployeesRegedReports > 0
              ? utils.farsiNum(EmployeesRegedReports)
              : "-"
          }
          color={Colors.green[5]}
        />
      </Col>
      <Col xs={24}>
        <Alert type="info" message={Words.colleagues} />
      </Col>
      {MyColleagues?.length > 0 && (
        <Col xs={24}>
          {MyColleagues.map((colleague) => (
            <React.Fragment key={colleague.MemberID}>
              {colleague.CollaborationCount > 0 ? (
                <Space style={{ margin: 10 }}>
                  <Tooltip
                    title={
                      <Text style={{ color: Colors.white, fontSize: 12 }}>
                        {`${colleague.FirstName} ${colleague.LastName}`}
                      </Text>
                    }
                  >
                    <Badge
                      count={utils.farsiNum(`${colleague.CollaborationCount}`)}
                    >
                      <MemberProfileImage fileName={colleague.PicFileName} />
                    </Badge>
                  </Tooltip>
                </Space>
              ) : (
                <Tooltip
                  title={
                    <Text style={{ color: Colors.white, fontSize: 12 }}>
                      {`${colleague.FirstName} ${colleague.LastName}`}
                    </Text>
                  }
                >
                  <MemberProfileImage fileName={colleague.PicFileName} />
                </Tooltip>
              )}
            </React.Fragment>
          ))}
        </Col>
      )}
      <Col xs={24}>
        <Alert type="info" message={Words.task_supervisions} />
      </Col>
      <Col xs={12} lg={6}>
        <StatisticTile
          linkPrefix={link_prefix}
          link="task-supervisions"
          inProgress={inProgress}
          title={Words.under_supervision_tasks}
          value={
            MyUnderSupervisionTasks > 0
              ? utils.farsiNum(MyUnderSupervisionTasks)
              : "-"
          }
          color={Colors.green[6]}
        />
      </Col>
      <Col xs={12} lg={6}>
        <StatisticTile
          linkPrefix={link_prefix}
          link="task-supervisions"
          inProgress={inProgress}
          title={Words.finished_supervision_tasks}
          value={
            MyFinishedSupervisionTasks > 0
              ? utils.farsiNum(MyFinishedSupervisionTasks)
              : "-"
          }
          color={Colors.purple[4]}
        />
      </Col>
      <Col xs={12} lg={6}>
        <StatisticTile
          linkPrefix={link_prefix}
          link="task-supervisions"
          inProgress={inProgress}
          title={Words.new_reports}
          value={
            MyUnreadSupervisionReports > 0
              ? utils.farsiNum(MyUnreadSupervisionReports)
              : "-"
          }
          color={Colors.red[5]}
        />
      </Col>
      <Col xs={12} lg={6}>
        <StatisticTile
          linkPrefix={link_prefix}
          link="employees-tasks"
          inProgress={inProgress}
          title={Words.reged_reports}
          value={
            MyRegedSupervisionReports > 0
              ? utils.farsiNum(MyRegedSupervisionReports)
              : "-"
          }
          color={Colors.green[5]}
        />
      </Col>
    </>
  );
};

export default PersonalStatistics;
