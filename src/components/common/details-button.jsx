import React from "react";
import { Button } from "antd";
import { InfoCircleOutlined as InfoIcon } from "@ant-design/icons";
import Colors from "../../resources/colors";

const DetailsButton = ({ record, setSelectedObject, setShowDetails }) => {
  return (
    <Button
      type="link"
      icon={<InfoIcon style={{ color: Colors.green[6] }} />}
      onClick={() => {
        setSelectedObject(record);
        setShowDetails(true);
      }}
    />
  );
};

export default DetailsButton;
