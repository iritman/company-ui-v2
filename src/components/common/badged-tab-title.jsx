import React from "react";
import { Badge, Typography } from "antd";
import Colors from "../../resources/colors";

const { Text } = Typography;

const BadgedTabTitle = ({ selectedTab, selectionTitle, title, items }) => {
  return (
    <Badge dot={items?.length > 0}>
      <Text
        style={selectedTab === selectionTitle ? { color: Colors.blue[6] } : {}}
      >
        {title}
      </Text>
    </Badge>
  );
};

export default BadgedTabTitle;
