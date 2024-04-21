import React from "react";
import { Col } from "antd";
import ValueLabel from "./value-label";
import utils from "../../tools/utils";
import Words from "../../resources/words";

const WorkTimeStatistics = ({ type, data }) => {
  return (
    <>
      {data.length > 0 && (
        <>
          <Col xs={24}>
            <ValueLabel
              title={
                type === "mission"
                  ? Words.work_time_daily
                  : Words.vacation_daily
              }
              value={`${utils.getWorkTimeInfo(data).days} ${Words.day}`}
            />
          </Col>
          <Col xs={24}>
            <ValueLabel
              title={
                type === "mission"
                  ? Words.work_time_timely
                  : Words.vacation_timely
              }
              value={utils.minToTime(utils.getWorkTimeInfo(data).remain_mins)}
            />
          </Col>
          <Col xs={24}>
            <ValueLabel
              title={
                type === "mission"
                  ? Words.work_time_total
                  : Words.vacation_total
              }
              value={utils.workTimeToText(utils.getWorkTimeInfo(data))}
            />
          </Col>
        </>
      )}
    </>
  );
};

export default WorkTimeStatistics;
