import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "antd";
import { AiOutlineHome as HomeIcon } from "react-icons/ai";
import { CgProfile as ProfileIcon } from "react-icons/cg";
import { RiLockPasswordLine as PasswordIcon } from "react-icons/ri";
import Colors from "../../../resources/colors";
import Words from "../../../resources/words";

const iconSize = 20;

const UserAccountMenu = () => {
  const [lastPathKey, setLastPathKey] = useState("");

  const currentLocation = useLocation();

  useEffect(() => {
    const pathKeys = currentLocation.pathname.split("/");
    const _lastPathKey = pathKeys[pathKeys.length - 1]
      .replaceAll("-", "")
      .toLocaleLowerCase();
    setLastPathKey(_lastPathKey);
  }, [currentLocation.pathname]);

  const menu_items = [
    {
      label: <Link to={`/home`}>{Words.main_page}</Link>,
      key: "home",
      icon: <HomeIcon style={{ color: Colors.green[6] }} size={iconSize} />,
    },
    {
      type: "divider",
    },
    {
      label: <Link to={`/home/account/profile`}>{Words.profile}</Link>,
      key: "profile",
      icon: <ProfileIcon style={{ color: Colors.blue[6] }} size={iconSize} />,
    },
    {
      label: (
        <Link to={`/home/account/change-password`}>
          {Words.change_password}
        </Link>
      ),
      key: "changepassword",
      icon: <PasswordIcon style={{ color: Colors.red[6] }} size={iconSize} />,
    },
  ];

  return (
    <Menu
      mode="inline"
      theme="light"
      selectedKeys={[lastPathKey]}
      items={menu_items}
    />
  );
};

export default UserAccountMenu;
