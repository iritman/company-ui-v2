import React from "react";
import { Space } from "antd";
import { EditOutlined as EditIcon } from "@ant-design/icons";
import Words from "../../resources/words";
import Colors from "../../resources/colors";

const EditModalHeader = () => (
  <Space>
    <EditIcon style={{ color: Colors.green[6] }} />
    {Words.editInfo}
  </Space>
);

export default EditModalHeader;
