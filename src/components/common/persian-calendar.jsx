import React from "react";
import { Row, Col, Alert, Typography, Tag } from "antd";
import utils from "./../../tools/utils";
import Colors from "./../../resources/colors";

const { Text } = Typography;

const box_size = 30;
const day_name_font_size = 13;
const day_no_font_size = 14;
const default_selected_day_color = "#87d068";

const weekDays = [
  { dayID: 1, title: "ش" },
  { dayID: 2, title: "ی" },
  { dayID: 3, title: "د" },
  { dayID: 4, title: "س" },
  { dayID: 5, title: "چ" },
  { dayID: 6, title: "پ" },
  { dayID: 7, title: "ج" },
];

const dayBoxStyle = {
  width: box_size,
  height: box_size,
  display: "flex",
  direction: "row",
  justifyContent: "center",
  alignItems: "center",
};

const getDayID = (day) => {
  const firstChar = utils.weekDayNameFromDay(day)[0];
  return weekDays.find((d) => d.title === firstChar).dayID;
};

const getDays = (year, month) => {
  let days = [];

  const firstDay = { year, month, day: 1 };

  days = [...days, { dayID: getDayID(firstDay), date: firstDay }];

  let next_day = utils.nextDay(firstDay);

  while (next_day.month === month) {
    days = [
      ...days,
      { dayID: getDayID(next_day), date: { year, month, day: next_day.day } },
    ];

    next_day = utils.nextDay(next_day);
  }

  return days;
};

const FirstEmptyDates = ({ days }) => {
  let result = (
    <>
      <Col xs={2} />
    </>
  );

  const first_empty_dates = days[0].dayID - 1;

  let day_boxes = [];

  if (first_empty_dates > 0) {
    for (let i = 1; i <= first_empty_dates; i++) {
      day_boxes = [
        ...day_boxes,
        <Tag
          style={dayBoxStyle}
          // color="purple"
        ></Tag>,
      ];
    }

    result = (
      <>
        <Col xs={2} />
        {day_boxes.map((b, index) => (
          <Col xs={3} key={index}>
            {b}
          </Col>
        ))}
      </>
    );
  }

  return result;
};

const isHoliday = (date, holidays, field) => {
  const date_text = utils.dateToText(date);

  return holidays.filter((d) => d[field] === date_text).length > 0;
};

const isSelectedDay = (date, selectedDays, field) => {
  const date_text = utils.dateToText(date);

  return selectedDays.filter((sd) => sd[field] === date_text).length > 0;
};

const PersianCalendar = ({
  year,
  month,
  makeHolidaysRed,
  holidays,
  holidayField,
  selectedDays,
  selectedDaysColor,
  selectedDayField,
  onClick,
}) => {
  const days = getDays(year, month);

  return (
    <Row gutter={[5, 5]}>
      <Col xs={24}>
        <Alert type="info" message={<Text>{utils.monthName(month)}</Text>} />
      </Col>
      <Col xs={24} />
      <Col xs={2} />
      {weekDays.map((day) => (
        <Col xs={3} key={day.dayID}>
          <Tag style={{ ...dayBoxStyle, cursor: "pointer" }} color="purple">
            <Text style={{ fontSize: day_name_font_size }}>{day.title}</Text>
          </Tag>
        </Col>
      ))}
      <Col xs={1} />

      <Col xs={24} />
      <FirstEmptyDates days={days} />

      {days.map((d) => (
        <React.Fragment key={utils.dateToText(d.date)}>
          {d.dayID === 1 && d.date.day > 1 && <Col xs={2} />}
          <Col xs={3}>
            <Tag
              style={{ ...dayBoxStyle, cursor: "pointer" }}
              color={
                isSelectedDay(d.date, selectedDays, selectedDayField)
                  ? selectedDaysColor || default_selected_day_color
                  : "default"
              }
              onClick={() => onClick(d.date)}
            >
              <Text
                style={
                  makeHolidaysRed && isHoliday(d.date, holidays, holidayField)
                    ? { fontSize: day_no_font_size, color: Colors.red[6] }
                    : { fontSize: day_no_font_size }
                }
              >
                {utils.farsiNum(d.date.day)}
              </Text>
            </Tag>
          </Col>
          {d.dayID === 7 && <Col xs={1} />}
        </React.Fragment>
      ))}
    </Row>
  );
};

export default PersianCalendar;
