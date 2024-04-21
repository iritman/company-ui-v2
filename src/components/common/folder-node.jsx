import React from "react";
import { Space, Typography } from "antd";
import { AiFillFolder as SmallFolderIcon } from "react-icons/ai";

const { Text } = Typography;

const FolderNode = ({ title, color }) => {
  return (
    <Space>
      <SmallFolderIcon style={{ color }} />
      <Text>{title}</Text>
    </Space>
  );
};

export default FolderNode;
