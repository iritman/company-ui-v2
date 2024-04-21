import React, { useState } from "react";
import { Menu } from "antd";
import {
  AiOutlineDashboard as DashboardIcon,
  AiOutlineFieldTime as TimexSettingsIcon,
  AiFillBank as OrgIcon,
  AiFillCar as CarIcon,
} from "react-icons/ai";
import { GoGear as BasicSettingsIcon } from "react-icons/go";
import {
  SiKeycdn as KeyIcon,
  SiGotomeeting as CeremonyIcon,
} from "react-icons/si";
import { Link } from "react-router-dom";
import { useMount } from "react-use";
import modulesService from "../../../services/app/modules-service";
import Colors from "../../../resources/colors";
import Words from "../../../resources/words";

const iconSize = 20;

const mapper = (moduleID) => {
  let link = "";
  let icon = null;

  switch (moduleID) {
    case 1:
      link = "accesses";
      icon = <KeyIcon style={{ color: Colors.red[6] }} size={iconSize} />;
      break;

    case 2:
      link = "basic-info";
      icon = (
        <BasicSettingsIcon style={{ color: Colors.blue[6] }} size={iconSize} />
      );
      break;

    case 3:
      link = "org";
      icon = <OrgIcon style={{ color: Colors.green[6] }} size={iconSize} />;
      break;

    case 4:
      link = "timex";
      icon = (
        <TimexSettingsIcon
          style={{ color: Colors.orange[6] }}
          size={iconSize}
        />
      );
      break;

    case 7:
      link = "transmission";
      icon = <CarIcon style={{ color: Colors.cyan[6] }} size={iconSize} />;
      break;

    case 11:
      link = "ceremony";
      icon = (
        <CeremonyIcon style={{ color: Colors.magenta[4] }} size={iconSize} />
      );
      break;

    default:
      break;
  }

  return { link, icon };
};

const SettingsMenu = () => {
  const [accessibleModules, setAccessibleModules] = useState([]);

  useMount(async () => {
    const settings_category_id = 1;
    const accessibleModules = await modulesService.accessibleModules(
      settings_category_id
    );

    setAccessibleModules(accessibleModules);
  });

  const getMenuItems = () => {
    let items = [
      {
        label: <Link to={`/home`}>{Words.dashboard}</Link>,
        key: "home",
        icon: (
          <DashboardIcon style={{ color: Colors.green[6] }} size={iconSize} />
        ),
      },
      {
        type: "divider",
      },
    ];

    accessibleModules.forEach(({ ModuleID, ModuleTitle }) => {
      items = [
        ...items,
        {
          label: (
            <Link to={`settings/${mapper(ModuleID).link}`}>{ModuleTitle}</Link>
          ),
          key: ModuleID,
          icon: mapper(ModuleID).icon,
        },
      ];
    });

    return items;
  };

  return <Menu mode="inline" theme="light" items={getMenuItems()} />;
};

export default SettingsMenu;
