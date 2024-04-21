import React from "react";
import { Typography } from "antd";
import utils from "../../tools/utils";

const { Text } = Typography;

export const LabelType = {
  date: "date",
  time: "time",
};

export const Label = (props) => {
  const { farsi, color, type, styles, ...rest } = props;

  const text_color = {};
  if (color) text_color.color = color;

  let content = props.children;

  if (type) {
    switch (type) {
      case LabelType.date:
        content = utils.slashDate(content);
        break;
      case LabelType.time:
        content = utils.colonTime(content);
        break;
      default:
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
