import React from "react";
import { Button, Tooltip, Spin } from "antd";
import {
  ReloadOutlined as ReloadIcon,
  LoadingOutlined as LoadingIcon,
} from "@ant-design/icons";

const antIcon = <LoadingIcon style={{ fontSize: 24 }} spin />;

const ReloadButton = ({ tooltip, inProgress, onClick }) => {
  return (
    <>
      {inProgress ? (
        <Spin indicator={antIcon} />
      ) : (
        <Tooltip title={tooltip}>
          <Button size="small" icon={<ReloadIcon />} onClick={onClick} />
        </Tooltip>
      )}
    </>
  );
};

export default ReloadButton;
