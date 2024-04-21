import React from "react";
import { Space, Typography } from "antd";
import Colors from "../../resources/colors";
import utils from "../../tools/utils";

const { Text } = Typography;

const ValueLabel = ({ title, value }) => {
  return (
    <Space>
      <Text style={{ color: Colors.blue[7] }}>{`${title}:`}</Text>
      <Text>{utils.farsiNum(value)}</Text>
    </Space>
  );
};

export default ValueLabel;
