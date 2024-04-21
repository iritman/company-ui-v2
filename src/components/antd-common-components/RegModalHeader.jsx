import React from "react";
import { Space } from "antd";
import { PlusSquareOutlined as PlusBoxIcon } from "@ant-design/icons";
import Words from "../../resources/words";
import Colors from "../../resources/colors";

const RegModalHeader = () => (
  <Space>
    <PlusBoxIcon style={{ color: Colors.green[6] }} />
    {Words.newInfo}
  </Space>
);

export default RegModalHeader;
