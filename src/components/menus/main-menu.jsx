import React, { useState } from "react";
import { Menu } from "antd";
import { AiOutlineDatabase as OfficialIcon } from "react-icons/ai";
import { FiSettings as SettingsIcon } from "react-icons/fi";
import { RiMoneyPoundCircleLine as FinancialIcon } from "react-icons/ri";
import { SiHiveBlockchain as LogisticIcon } from "react-icons/si";
import { Link } from "react-router-dom";
import { useMount } from "react-use";
import modulesService from "../../services/app/modules-service";
import Colors from "../../resources/colors";

const mapper = (categoryID) => {
  let link = "";
  let icon = null;

  switch (categoryID) {
    case 1:
      link = "settings";
      icon = <SettingsIcon style={{ color: Colors.grey[6] }} size={20} />;
      break;

    case 2:
      link = "official";
      icon = <OfficialIcon style={{ color: Colors.green[6] }} size={20} />;
      break;

    case 3:
      link = "financial";
      icon = <FinancialIcon style={{ color: Colors.red[5] }} size={20} />;
      break;

    case 4:
      link = "logistic";
      icon = <LogisticIcon style={{ color: Colors.cyan[5] }} size={20} />;
      break;

    default:
      break;
  }

  return { link, icon };
};

const MainMenu = () => {
  const [accessibleModuleCategories, setAccessibleModuleCategories] = useState(
    []
  );

  useMount(async () => {
    const accessibleModuleCategories =
      await modulesService.accessibleModuleCategories();

    setAccessibleModuleCategories(accessibleModuleCategories);
  });

  const getMenuItems = () => {
    let items = [];

    accessibleModuleCategories.forEach(({ CategoryID, CategoryTitle }) => {
      items = [
        ...items,
        {
          label: (
            <Link to={`home/${mapper(CategoryID).link}`}>{CategoryTitle}</Link>
          ),
          key: CategoryID,
          icon: mapper(CategoryID).icon,
        },
      ];
    });

    return items;
  };

  return <Menu mode="inline" theme="light" items={getMenuItems()} />;
};

export default MainMenu;
