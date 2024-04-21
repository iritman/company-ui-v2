import { Menu } from "antd";
import { AiOutlineDashboard as DashboardIcon } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Colors from "../../resources/colors";

const ModuleMenu = ({
  type,
  typeTitle,
  modulePathName,
  lastPathKey,
  accessiblePages,
  iconSize,
  mapper,
}) => {
  const module_path_name = modulePathName;
  const isEndsWithModuleName = useLocation().pathname.endsWith(
    `/${module_path_name}`
  );
  const prePath = isEndsWithModuleName ? `${module_path_name}/` : "";

  const getMenuItems = () => {
    let items = [
      {
        label: <Link to={`/home/${type}`}>{typeTitle}</Link>,
        key: type,
        icon: (
          <DashboardIcon style={{ color: Colors.green[6] }} size={iconSize} />
        ),
      },
      {
        type: "divider",
      },
    ];

    accessiblePages.forEach(({ PageName, PageID, PageTitle }) => {
      items = [
        ...items,
        {
          label: (
            <Link to={`${prePath}${mapper(PageID).link}`}>{PageTitle}</Link>
          ),
          key: PageName.replace("user-", "")
            .replaceAll("-", "")
            .toLocaleLowerCase(),
          icon: mapper(PageID).icon,
        },
      ];
    });

    return items;
  };

  return (
    <Menu
      mode="inline"
      theme="light"
      selectedKeys={[lastPathKey]}
      items={getMenuItems()}
    />
  );
};

export default ModuleMenu;
