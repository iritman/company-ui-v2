import React from "react";
import { Typography, Space } from "antd";
import Colors from "../../resources/colors";
import Words from "../../resources/words";
import utils from "../../tools/utils";
import { getSorter } from "../../tools/form-manager";

const { Text } = Typography;

export function getMissionStatusColor(statusID) {
  let color = Colors.grey[6];

  switch (statusID) {
    case 2:
      color = Colors.green[6];
      break;
    case 3:
      color = Colors.red[6];
      break;
    default:
      color = Colors.grey[6];
      break;
  }

  return color;
}

export function getMissionStatusTitle(statusID) {
  let title = Words.in_progress;

  switch (statusID) {
    case 2:
      title = Words.accepted;
      break;
    case 3:
      title = Words.rejected;
      break;
    default:
      title = Words.in_progress;
      break;
  }

  return title;
}

export function getSheets(records, title) {
  return [
    {
      title,
      data: records,
      columns: [
        { label: Words.id, value: "MissionID" },
        {
          label: Words.full_name,
          value: (record) => `${record.FirstName} ${record.LastName}`,
        },
        {
          label: Words.mission_type,
          value: (record) => `${record.MissionTypeTitle}`,
        },
        {
          label: Words.mission_target,
          value: "TargetTitle",
        },
        {
          label: Words.mission_subject,
          value: "Subject",
        },
        {
          label: Words.need_vehicle,
          value: (record) => (record.NeedVehicle ? Words.yes : Words.no),
        },
        {
          label: Words.need_hoteling,
          value: (record) => (record.NeedHoteling ? Words.yes : Words.no),
        },
        {
          label: Words.reg_date,
          value: (record) => utils.slashDate(record.RegDate),
        },
        {
          label: Words.reg_time,
          value: (record) => utils.colonTime(record.RegTime),
        },
        {
          label: Words.from_date,
          value: (record) => utils.slashDate(record.StartDate),
        },
        {
          label: Words.from_time,
          value: (record) => utils.colonTime(record.StartTime),
        },
        {
          label: Words.to_date,
          value: (record) => utils.slashDate(record.FinishDate),
        },
        {
          label: Words.to_time,
          value: (record) => utils.colonTime(record.FinishTime),
        },
        {
          label: Words.work_time,
          value: (record) => utils.farsiNum(record.WorkTime),
        },
        {
          label: Words.descriptions,
          value: (record) => record.DetailsText,
        },
        {
          label: Words.status,
          value: (record) => getMissionStatusTitle(record.FinalStatusID),
        },
      ],
    },
  ];
}

export const baseColumns = [
  {
    title: Words.id,
    width: 75,
    align: "center",
    dataIndex: "MissionID",
    sorter: getSorter("MissionID"),
    render: (MissionID) => <Text>{utils.farsiNum(`${MissionID}`)}</Text>,
  },
  {
    title: Words.full_name,
    width: 175,
    align: "center",
    sorter: getSorter("LastName"),
    render: (record) => <Text>{`${record.FirstName} ${record.LastName}`}</Text>,
  },
  {
    title: Words.mission_type,
    width: 120,
    align: "center",
    dataIndex: "MissionTypeTitle",
    sorter: getSorter("MissionTypeTitle"),
    render: (MissionTypeTitle) => (
      <Text style={{ color: Colors.blue[6] }}>{MissionTypeTitle}</Text>
    ),
  },
  {
    title: Words.mission_target,
    width: 150,
    align: "center",
    dataIndex: "TargetTitle",
    sorter: getSorter("TargetTitle"),
    render: (TargetTitle) => (
      <Text style={{ color: Colors.orange[6] }}>{TargetTitle}</Text>
    ),
  },
  {
    title: Words.from,
    width: 150,
    align: "center",
    sorter: getSorter("StartDate"),
    render: (record) => (
      <>
        {record.StartTime?.length === 0 ? (
          <Text style={{ color: Colors.green[6] }}>
            {`${utils.weekDayNameFromText(record.StartDate)} - ${utils.farsiNum(
              utils.slashDate(record.StartDate)
            )}`}
          </Text>
        ) : (
          <Space direction="vertical">
            <Text style={{ color: Colors.green[6] }}>
              {`${utils.weekDayNameFromText(
                record.StartDate
              )} - ${utils.farsiNum(utils.slashDate(record.StartDate))}`}
            </Text>

            <Text style={{ color: Colors.magenta[6] }}>
              {`${utils.farsiNum(utils.colonTime(record.StartTime))}`}
            </Text>
          </Space>
        )}
      </>
    ),
  },
  {
    title: Words.to,
    width: 150,
    align: "center",
    sorter: getSorter("FinishDate"),
    render: (record) => (
      <>
        {record.FinishTime?.length === 0 ? (
          <Text style={{ color: Colors.green[6] }}>
            {`${utils.weekDayNameFromText(
              record.FinishDate
            )} - ${utils.farsiNum(utils.slashDate(record.FinishDate))}`}
          </Text>
        ) : (
          <Space direction="vertical">
            <Text style={{ color: Colors.green[6] }}>
              {`${utils.weekDayNameFromText(
                record.FinishDate
              )} - ${utils.farsiNum(utils.slashDate(record.FinishDate))}`}
            </Text>

            <Text style={{ color: Colors.magenta[6] }}>
              {`${utils.farsiNum(utils.colonTime(record.FinishTime))}`}
            </Text>
          </Space>
        )}
      </>
    ),
  },
  {
    title: Words.work_time,
    width: 150,
    align: "center",
    dataIndex: "WorkTime",
    sorter: getSorter("WorkTime"),
    render: (WorkTime) => (
      <Text style={{ color: Colors.orange[6] }}>
        {utils.farsiNum(WorkTime)}
      </Text>
    ),
  },
  {
    title: Words.status,
    width: 100,
    align: "center",
    dataIndex: "FinalStatusID",
    sorter: getSorter("FinalStatusID"),
    render: (FinalStatusID) => (
      <Text style={{ color: getMissionStatusColor(FinalStatusID) }}>
        {getMissionStatusTitle(FinalStatusID)}
      </Text>
    ),
  },
];

const items = {
  getMissionStatusColor,
  getMissionStatusTitle,
  getSheets,
  baseColumns,
};

export default items;
