import React from "react";
import { Avatar } from "antd";
import { UserOutlined as UserIcon } from "@ant-design/icons";
import configInfo from "./../../config.json";

const { fileBasicUrl } = configInfo;

const MemberProfileImage = ({ fileName, size, ...rest }) => {
  return (
    <>
      {fileName?.length > 0 ? (
        <Avatar
          size={size || 35}
          src={`${fileBasicUrl}/member-profiles/${fileName}`}
          icon={<UserIcon />}
          {...rest}
        />
      ) : (
        <Avatar size={size || 35} icon={<UserIcon />} {...rest} />
      )}
    </>
  );
};

export default MemberProfileImage;
