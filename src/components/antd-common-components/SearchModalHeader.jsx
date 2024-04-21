import React from "react";
import { Space } from "antd";
import { SearchOutlined as SearchIcon } from "@ant-design/icons";
import Words from "../../resources/words";
import Colors from "../../resources/colors";

const SearchModalHeader = () => (
  <Space>
    <SearchIcon style={{ color: Colors.blue[6] }} />
    {Words.search}
  </Space>
);

export default SearchModalHeader;
