import { Menu } from "antd";
import { AiOutlineDashboard as DashboardIcon } from "react-icons/ai";
import { Link } from "react-router-dom";
import Colors from "../../resources/colors";
import Words from "./../../resources/words";

const CategoryMenu = ({ type, accessibleModules, iconSize, mapper }) => {
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
            <Link to={`${type}/${mapper(ModuleID).link}`}>{ModuleTitle}</Link>
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

export default CategoryMenu;
