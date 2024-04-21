import React from "react";
import { Typography } from "antd";
import Colors from "../../resources/colors";
import Words from "../../resources/words";
import utils from "../../tools/utils";
import { getSorter } from "../../tools/form-manager";

const { Text } = Typography;

export function getVacationStatusColor(statusID) {
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

export function getVacationStatusTitle(statusID) {
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
        { label: Words.id, value: "VacationID" },
        {
          label: Words.full_name,
          value: (record) => `${record.FirstName} ${record.LastName}`,
        },
        {
          label: Words.vacation_type,
          value: (record) => `${record.VacationTypeTitle}`,
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
          label: Words.descriptions,
          value: (record) => record.DetailsText,
        },
        {
          label: Words.duration,
          value: (record) => utils.farsiNum(record.Duration),
        },
        {
          label: Words.status,
          value: (record) => getVacationStatusTitle(record.FinalStatusID),
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
    dataIndex: "VacationID",
    sorter: getSorter("VacationID"),
    render: (VacationID) => <Text>{utils.farsiNum(`${VacationID}`)}</Text>,
  },
  {
    title: Words.full_name,
    width: 175,
    align: "center",
    sorter: getSorter("LastName"),
    render: (record) => <Text>{`${record.FirstName} ${record.LastName}`}</Text>,
  },
  {
    title: Words.vacation_type,
    width: 120,
    align: "center",
    dataIndex: "VacationTypeTitle",
    sorter: getSorter("VacationTypeTitle"),
    render: (VacationTypeTitle) => (
      <Text style={{ color: Colors.blue[6] }}>{VacationTypeTitle}</Text>
    ),
  },
  {
    title: Words.from_date,
    width: 120,
    align: "center",
    dataIndex: "StartDate",
    sorter: getSorter("StartDate"),
    render: (StartDate) => (
      <Text style={{ color: Colors.green[6] }}>
        {`${utils.weekDayNameFromText(StartDate)} - ${utils.farsiNum(
          utils.slashDate(StartDate)
        )}`}
      </Text>
    ),
  },
  {
    title: Words.from_time,
    width: 100,
    align: "center",
    dataIndex: "StartTime",
    sorter: getSorter("StartTime"),
    render: (StartTime) => (
      <>
        {StartTime?.length > 0 && (
          <Text style={{ color: Colors.magenta[6] }}>
            {`${utils.farsiNum(utils.colonTime(StartTime))}`}
          </Text>
        )}
      </>
    ),
  },
  {
    title: Words.to_date,
    width: 120,
    align: "center",
    dataIndex: "FinishDate",
    sorter: getSorter("FinishDate"),
    render: (FinishDate) => (
      <Text style={{ color: Colors.green[6] }}>
        {`${utils.weekDayNameFromText(FinishDate)} - ${utils.farsiNum(
          utils.slashDate(FinishDate)
        )}`}
      </Text>
    ),
  },
  {
    title: Words.to_time,
    width: 100,
    align: "center",
    dataIndex: "FinishTime",
    sorter: getSorter("FinishTime"),
    render: (FinishTime) => (
      <>
        {FinishTime?.length > 0 && (
          <Text style={{ color: Colors.magenta[6] }}>
            {`${utils.farsiNum(utils.colonTime(FinishTime))}`}
          </Text>
        )}
      </>
    ),
  },
  {
    title: Words.duration,
    width: 150,
    align: "center",
    dataIndex: "Duration",
    sorter: getSorter("Duration"),
    render: (Duration) => (
      <Text style={{ color: Colors.orange[6] }}>
        {utils.farsiNum(Duration)}
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
      <Text style={{ color: getVacationStatusColor(FinalStatusID) }}>
        {getVacationStatusTitle(FinalStatusID)}
      </Text>
    ),
  },
];

const items = {
  getVacationStatusColor,
  getVacationStatusTitle,
  getSheets,
  baseColumns,
};

export default items;
