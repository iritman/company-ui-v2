import React from "react";
import { Typography } from "antd";
import utils from "../../tools/utils";

const { Text } = Typography;

export const LabelType = {
  date: "date",
  time: "time",
  date_time: "date_time",
  descriptions: "descriptions",
};

export const Label = (props) => {
  let { farsi, color, type, styles, ...rest } = props;

  const text_color = {};
  if (color) text_color.color = color;

  let content = props.children || "";

  if (type) {
    switch (type) {
      case LabelType.date:
        content = utils.slashDate(content);
        break;
      case LabelType.time:
        content = utils.colonTime(content);
        break;
      case LabelType.date_time:
        const { date, time } = rest;
        content = `${utils.slashDate(date)} - ${utils.colonTime(time)}`;
        break;
      case LabelType.descriptions:
        styles = { ...styles, whiteSpace: "pre-line" };
        break;
      default:
        content = "";
        break;
    }
  }

  if (farsi && farsi !== false) content = utils.farsiNum(content);

  return (
    <Text style={{ ...text_color, ...styles }} {...rest}>
      {content}
    </Text>
  );
};

export const getItem = (title, color, content, props = {}) => {
  const { span } = props;

  const item = {
    label: title,
    children: (
      <Label farsi color={color} {...props}>
        {content}
      </Label>
    ),
  };

  if (span) item.span = span;

  return item;
};

export const getDescriptionsItem = (title, color, content, span = 3) => {
  return {
    label: title,
    span,
    children: (
      <>
        {content.length > 0 && (
          <Label farsi color={color} type={LabelType.descriptions}>
            {content}
          </Label>
        )}
      </>
    ),
  };
};
