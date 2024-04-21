import React from "react";
import { Typography, Space } from "antd";
import Colors from "../../resources/colors";
import Words from "../../resources/words";
import utils from "../../tools/utils";
import { getSorter } from "../../tools/form-manager";

const { Text } = Typography;

export const getStatusColor = (record) => {
  let color = Colors.grey[6];

  const { IsAccepted, ResponseMemberID } = record;

  if (ResponseMemberID > 0 && !IsAccepted) color = Colors.red[6];
  else if (ResponseMemberID > 0 && IsAccepted) color = Colors.green[6];

  return color;
};

export const getStatusTitle = (record) => {
  let title = Words.in_progress;

  const { IsAccepted, ResponseMemberID } = record;

  if (ResponseMemberID > 0 && !IsAccepted) title = Words.rejected;
  else if (ResponseMemberID > 0 && IsAccepted) title = Words.accepted;

  return title;
};

export function getSheets(records, title) {
  return [
    {
      title,
      data: records,
      columns: [
        { label: Words.id, value: "RequestID" },
        {
          label: Words.extra_work_command_source,
          value: (record) => `${record.CommandSourceTitle}`,
        },
        {
          label: Words.start_date,
          value: (record) => `${record.StartDate}`,
        },
        {
          label: Words.start_time,
          value: (record) => `${record.StartTime}`,
        },
        {
          label: Words.finish_date,
          value: (record) => `${record.FinishDate}`,
        },
        {
          label: Words.finish_time,
          value: (record) => `${record.FinishTime}`,
        },
        {
          label: Words.request_duration,
          value: (record) => `${utils.minToTime(record.DurationInMin)}`,
        },
        {
          label: Words.descriptions,
          value: "DetailsText",
        },
        {
          label: Words.reg_member,
          value: (record) => `${record.RegFirstName} ${record.RegLastName}`,
        },
        {
          label: Words.department,
          value: "DepartmentTitle",
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
          label: Words.official_expert,
          value: (record) =>
            `${record.ResponseFirstName} ${record.ResponseLastName}`,
        },
        {
          label: Words.official_response,
          value: "ResponseDetailsText",
        },
        {
          label: Words.status,
          value: (record) => getStatusTitle(record),
        },
        {
          label: Words.response_reg_date,
          value: (record) =>
            record.ResponseRegDate.length > 0
              ? utils.slashDate(record.ResponseRegDate)
              : "",
        },
        {
          label: Words.response_reg_time,
          value: (record) =>
            record.ResponseRegTime.length > 0
              ? utils.colonTime(record.ResponseRegTime)
              : "",
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
    dataIndex: "RequestID",
    sorter: getSorter("RequestID"),
    render: (RequestID) => <Text>{utils.farsiNum(`${RequestID}`)}</Text>,
  },
  {
    title: Words.extra_work_command_source,
    width: 150,
    align: "center",
    dataIndex: "CommandSourceTitle",
    sorter: getSorter("CommandSourceTitle"),
    render: (CommandSourceTitle) => (
      <Text style={{ color: Colors.blue[6] }}>{CommandSourceTitle}</Text>
    ),
  },
  {
    title: Words.start,
    width: 150,
    align: "center",
    sorter: getSorter("StartDate"),
    render: (record) => (
      <Space direction="vertical">
        <Text style={{ color: Colors.cyan[6] }}>
          {utils.farsiNum(
            `${utils.weekDayNameFromText(record.StartDate)} ${utils.slashDate(
              record.StartDate
            )}`
          )}
        </Text>
        <Text style={{ color: Colors.orange[6] }}>
          {utils.farsiNum(utils.colonTime(record.StartTime))}
        </Text>
      </Space>
    ),
  },
  {
    title: Words.finish,
    width: 150,
    align: "center",
    sorter: getSorter("FinishDate"),
    render: (record) => (
      <Space direction="vertical">
        <Text style={{ color: Colors.cyan[6] }}>
          {utils.farsiNum(
            `${utils.weekDayNameFromText(record.FinishDate)} ${utils.slashDate(
              record.FinishDate
            )}`
          )}
        </Text>
        <Text style={{ color: Colors.orange[6] }}>
          {utils.farsiNum(utils.colonTime(record.FinishTime))}
        </Text>
      </Space>
    ),
  },
  {
    title: Words.request_duration,
    width: 100,
    align: "center",
    render: (record) => (
      <Text style={{ color: Colors.magenta[6] }}>
        {utils.farsiNum(utils.minToTime(record.DurationInMin))}
      </Text>
    ),
  },
  {
    title: Words.registerar,
    width: 150,
    align: "center",
    render: (record) => (
      <Text style={{ color: Colors.blue[6] }}>
        {`${record.RegFirstName} ${record.RegLastName}`}
      </Text>
    ),
  },
  {
    title: Words.status,
    width: 100,
    align: "center",
    render: (record) => (
      <Text style={{ color: getStatusColor(record) }}>
        {getStatusTitle(record)}
      </Text>
    ),
  },
];

const items = {
  getStatusColor,
  getStatusTitle,
  getSheets,
  baseColumns,
};

export default items;
