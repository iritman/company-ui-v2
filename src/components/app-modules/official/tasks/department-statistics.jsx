import React from "react";
import { Col, Alert } from "antd";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import StatisticTile from "../../../common/statistic-tile";

const link_prefix = "/home/official/tasks";

const DepartmentStatistics = ({ statistics, inProgress }) => {
  const {
    TomorrowTasks,
    TodayTasks,
    DelayedTasks,
    DoneTasks,
    UnreadReports,
    RegedReports,
  } = statistics;

  const statisticTiles = [
    {
      title: Words.today_tasks,
      value: TodayTasks,
      color: Colors.green[6],
      link: "",
    },
    {
      title: Words.tomorrow_tasks,
      value: TomorrowTasks,
      color: Colors.purple[6],
      link: "",
    },
    {
      title: Words.delayed_tasks,
      value: DelayedTasks,
      color: Colors.red[6],
      link: "",
    },
    {
      title: Words.done_tasks,
      value: DoneTasks,
      color: Colors.blue[6],
      link: "",
    },
    {
      title: Words.new_reports,
      value: UnreadReports,
      color: Colors.red[6],
      link: "",
    },
    {
      title: Words.reged_reports,
      value: RegedReports,
      color: Colors.green[6],
      link: "",
    },
  ];

  return (
    <>
      <Col xs={24}>
        <Alert type="info" message={Words.department_tasks} />
      </Col>

      {statisticTiles.map((tile) => (
        <Col xs={12} md={8}>
          <StatisticTile
            linkPrefix={link_prefix}
            link={tile.link}
            inProgress={inProgress}
            title={tile.title}
            value={tile.value > 0 ? utils.farsiNum(tile.value) : "-"}
            color={tile.color}
          />
        </Col>
      ))}
    </>
  );
};

export default DepartmentStatistics;
