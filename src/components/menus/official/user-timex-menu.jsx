import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import {
  AiOutlineDashboard as DashboardIcon,
  AiFillIdcard as MembersRegedCardIcon,
  AiOutlineSchedule as WorkShiftIcon,
  AiOutlineUserSwitch as ReplaceWorkRequestIcon,
  AiOutlineIdcard as CardexIcon,
} from "react-icons/ai";
import {
  MdCardTravel as VacationIcon,
  MdOutlineWork as MissionIcon,
  MdSpeakerNotes as ReportIcon,
  MdSecurity as SecurityIcon,
  MdOutlineSwapCalls as AlternativeIcon,
} from "react-icons/md";
import {
  FaChartPie as WorkReportIcon,
  FaLandmark as OfficialIcon,
} from "react-icons/fa";
import { GiSwipeCard as RegedCardIcon } from "react-icons/gi";
import { BiAlarmAdd as ExtraWorkIcon } from "react-icons/bi";
import { CgArrowsExchange as ExchangeIcon } from "react-icons/cg";
import { FiUser as UserIcon, FiUsers as UsersIcon } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useMount } from "react-use";
import modulesService from "../../../services/app/modules-service";
import Colors from "../../../resources/colors";
import Words from "../../../resources/words";
import { useLocation } from "react-router-dom";
import TabTitle from "../../common/tab-title";

const { SubMenu } = Menu;

const iconSize = 20;

const mapper = (pageID) => {
  let link = "";
  let icon = null;

  switch (pageID) {
    case 39:
      link = "security-guard-reged-cards";
      icon = (
        <MembersRegedCardIcon
          style={{ color: Colors.red[6] }}
          size={iconSize}
        />
      );
      break;

    case 82:
      link = "approved-vacations";
      icon = (
        <VacationIcon style={{ color: Colors.geekblue[6] }} size={iconSize} />
      );
      break;

    case 83:
      link = "approved-missions";
      icon = (
        <MissionIcon style={{ color: Colors.geekblue[6] }} size={iconSize} />
      );
      break;

    case 71:
      link = "approved-extra-works";
      icon = (
        <ExtraWorkIcon style={{ color: Colors.purple[6] }} size={iconSize} />
      );
      break;

    case 40:
      link = "my-reged-cards";
      icon = (
        <RegedCardIcon style={{ color: Colors.green[6] }} size={iconSize} />
      );
      break;

    case 41:
      link = "my-work-shifts";
      icon = (
        <WorkShiftIcon style={{ color: Colors.blue[6] }} size={iconSize} />
      );
      break;

    case 42:
      link = "my-missions";
      icon = (
        <MissionIcon style={{ color: Colors.magenta[5] }} size={iconSize} />
      );
      break;

    case 43:
      link = "my-vacations";
      icon = (
        <VacationIcon style={{ color: Colors.geekblue[6] }} size={iconSize} />
      );
      break;

    case 44:
      link = "vacation-replace-work-requests";
      icon = (
        <ReplaceWorkRequestIcon
          style={{ color: Colors.orange[6] }}
          size={iconSize}
        />
      );
      break;

    case 59:
      link = "mission-replace-work-requests";
      icon = (
        <ReplaceWorkRequestIcon
          style={{ color: Colors.green[6] }}
          size={iconSize}
        />
      );
      break;

    case 45:
      link = "my-work-report";
      icon = (
        <WorkReportIcon style={{ color: Colors.purple[6] }} size={iconSize} />
      );
      break;

    case 170:
      link = "my-cards-report";
      icon = (
        <WorkReportIcon style={{ color: Colors.green[6] }} size={iconSize} />
      );
      break;

    //---------

    case 46:
      link = "members-reged-cards";
      icon = (
        <RegedCardIcon style={{ color: Colors.green[6] }} size={iconSize} />
      );
      break;

    case 47:
      link = "members-work-shifts";
      icon = (
        <WorkShiftIcon style={{ color: Colors.blue[6] }} size={iconSize} />
      );
      break;

    case 49:
      link = "members-vacations";
      icon = (
        <VacationIcon style={{ color: Colors.geekblue[6] }} size={iconSize} />
      );
      break;

    case 48:
      link = "members-missions";
      icon = (
        <MissionIcon style={{ color: Colors.magenta[6] }} size={iconSize} />
      );
      break;

    case 16:
      link = "members-new-vacations-check-manager";
      icon = (
        <VacationIcon style={{ color: Colors.orange[6] }} size={iconSize} />
      );
      break;

    case 21:
      link = "members-new-missions-check-manager";
      icon = (
        <MissionIcon style={{ color: Colors.purple[5] }} size={iconSize} />
      );
      break;

    case 52:
      link = "members-new-vacations-check-official";
      icon = <VacationIcon style={{ color: Colors.cyan[6] }} size={iconSize} />;
      break;

    case 53:
      link = "members-new-missions-check-official";
      icon = <MissionIcon style={{ color: Colors.red[3] }} size={iconSize} />;
      break;

    case 61:
      link = "members-new-mission-reports";
      icon = <ReportIcon style={{ color: Colors.red[4] }} size={iconSize} />;
      break;

    case 50:
      link = "members-work-report";
      icon = (
        <WorkReportIcon style={{ color: Colors.purple[6] }} size={iconSize} />
      );
      break;

    case 66:
      link = "members-extra-work-requests";
      icon = (
        <ExtraWorkIcon style={{ color: Colors.purple[6] }} size={iconSize} />
      );
      break;

    case 67:
      link = "official-check-extra-work-requests";
      icon = (
        <ExtraWorkIcon style={{ color: Colors.purple[6] }} size={iconSize} />
      );
      break;

    case 68:
      link = "official-check-reged-cards";
      icon = (
        <RegedCardIcon style={{ color: Colors.green[6] }} size={iconSize} />
      );
      break;

    case 69:
      link = "official-check-no-alternative-employees";
      icon = (
        <AlternativeIcon style={{ color: Colors.red[6] }} size={iconSize} />
      );
      break;

    case 64:
      link = "official-check-members-vacations";
      icon = (
        <VacationIcon style={{ color: Colors.geekblue[6] }} size={iconSize} />
      );
      break;

    case 65:
      link = "official-check-members-missions";
      icon = (
        <MissionIcon style={{ color: Colors.magenta[6] }} size={iconSize} />
      );
      break;

    case 85:
      link = "official-check-vacation-cardexes";
      icon = <CardexIcon style={{ color: Colors.blue[5] }} size={iconSize} />;
      break;

    //--- my reports

    case 86:
      link = "report-my-in-out-cards";
      icon = <ExchangeIcon style={{ color: Colors.blue[5] }} size={iconSize} />;
      break;

    default:
      break;
  }

  return { link, icon };
};

const tabs = [
  {
    name: "my-cartable",
    title: (
      <TabTitle
        title={Words.my_cartable}
        color={Colors.orange[6]}
        icon={UserIcon}
      />
    ),
    pages: [
      { pageName: "user-MyRegedCards" },
      { pageName: "user-MyWorkShifts" },
      { pageName: "user-MyMissions" },
      { pageName: "user-MyVacations" },
      { pageName: "user-VacationReplaceWorkRequests" },
      { pageName: "user-MissionReplaceWorkRequests" },
      { pageName: "user-MyWorkReport" },
      { pageName: "user-MyCardsReport" },
    ],
  },
  {
    name: "security-cartable",
    title: (
      <TabTitle
        title={Words.security_cartable}
        color={Colors.red[6]}
        icon={SecurityIcon}
      />
    ),
    pages: [
      { pageName: "user-SecurityGuardRegedCards" },
      { pageName: "user-ApprovedVacations" },
      { pageName: "user-ApprovedMissions" },
      { pageName: "user-ApprovedExtraWorks" },
    ],
  },
  {
    name: "department-cartable",
    title: (
      <TabTitle
        title={Words.department_cartable}
        color={Colors.blue[6]}
        icon={UsersIcon}
      />
    ),
    pages: [
      { pageName: "user-MembersRegedCards" },
      { pageName: "user-MembersWorkShifts" },
      { pageName: "user-MembersMissions" },
      { pageName: "user-MembersNewMissionsCheckManager" },
      { pageName: "user-MembersVacations" },
      { pageName: "user-MembersNewVacationsCheckManager" },
      { pageName: "user-MembersNewMissionReports" },
      { pageName: "user-MembersWorkReport" },
      { pageName: "user-MembersExtraWorkRequests" },
    ],
  },
  {
    name: "official-cartable",
    title: (
      <TabTitle
        title={Words.official_cartable}
        color={Colors.cyan[6]}
        icon={OfficialIcon}
      />
    ),
    pages: [
      { pageName: "user-OfficialCheckExtraWorkRequests" },
      { pageName: "user-OfficialCheckRegedCards" },
      { pageName: "user-OfficialCheckNoAlternativeEmployees" },
      { pageName: "user-MembersNewMissionsCheckOfficial" },
      { pageName: "user-MembersNewVacationsCheckOfficial" },
      { pageName: "user-OfficialCheckMembersVacations" },
      { pageName: "user-OfficialCheckVacationCardexes" },
      { pageName: "user-OfficialCheckMembersMissions" },
    ],
  },
  {
    name: "my-reports-cartable",
    title: (
      <TabTitle
        title={Words.my_reports_cartable}
        color={Colors.orange[6]}
        icon={WorkReportIcon}
      />
    ),
    pages: [
      { pageName: "user-ReportMyInOutCards" },
      // { pageName: "user-OfficialCheckRegedCards33" },
    ],
  },
  {
    name: "employees-reports-cartable",
    title: (
      <TabTitle
        title={Words.employees_reports_cartable}
        color={Colors.purple[6]}
        icon={WorkReportIcon}
      />
    ),
    pages: [
      // { pageName: "user-OfficialCheckExtraWorkRequests11" },
      // { pageName: "user-OfficialCheckRegedCards22" },
    ],
  },
];

const UserTimexMenu = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);
  const [lastPathKey, setLastPathKey] = useState("");
  const [openKeys, setOpenKeys] = React.useState([]);

  const currentLocation = useLocation();

  useMount(async () => {
    const timex_module_id = 6;
    const accessiblePages = await modulesService.accessiblePages(
      timex_module_id
    );

    setAccessiblePages(accessiblePages);
  });

  useEffect(() => {
    const pathKeys = currentLocation.pathname.split("/");
    const _lastPathKey = pathKeys[pathKeys.length - 1]
      .replace("user-", "")
      .replaceAll("-", "")
      .toLocaleLowerCase();

    setLastPathKey(_lastPathKey);

    const parentTab = getParentTab(_lastPathKey);
    if (parentTab !== null) setOpenKeys([parentTab.name]);
  }, [currentLocation.pathname]);

  const getParentTab = (pageName) => {
    let tab = null;

    tab = tabs.find(
      (t) =>
        t.pages.filter(
          (p) =>
            p.pageName
              .replace("user-", "")
              .replaceAll("-", "")
              .toLocaleLowerCase() === pageName
        ).length > 0
    );

    tab = tab || null;

    return tab;
  };

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);

    let rootSubmenuKeys = [];
    tabs.forEach((t) => (rootSubmenuKeys = [...rootSubmenuKeys, t.name]));

    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const getSubMenus = () => {
    const timex_module_path_name = "timex";
    const isEndsWithModuleName = currentLocation.pathname.endsWith(
      `/${timex_module_path_name}`
    );
    const prePath = isEndsWithModuleName ? `${timex_module_path_name}/` : "";

    //---

    let subMenus = [];

    tabs.forEach((tab) => {
      if (
        accessiblePages.filter((p) =>
          tab.pages.filter((tp) => tp.pageName === p.PageName)
        ).length > 0
      ) {
        subMenus = [
          ...subMenus,
          <SubMenu key={tab.name} title={tab.title}>
            {accessiblePages
              .filter(
                (ap) =>
                  tab.pages.filter((tp) => tp.pageName === ap.PageName)
                    .length === 1
              )
              .map((page) => (
                <Menu.Item
                  key={page.PageName.replace("user-", "")
                    .replaceAll("-", "")
                    .toLocaleLowerCase()}
                  icon={mapper(page.PageID).icon}
                >
                  <Link to={`${prePath}${mapper(page.PageID).link}`}>
                    {page.PageTitle}
                  </Link>
                </Menu.Item>
              ))}
          </SubMenu>,
        ];
      }
    });

    return subMenus;
  };

  return (
    <Menu
      mode="inline"
      theme="light"
      openKeys={openKeys}
      selectedKeys={[lastPathKey]}
      onOpenChange={onOpenChange}
    >
      <Menu.Item
        key="settings"
        icon={
          <DashboardIcon style={{ color: Colors.green[6] }} size={iconSize} />
        }
      >
        <Link to={`/home/official`}>{Words.official}</Link>
      </Menu.Item>
      <Menu.Divider />

      {getSubMenus()}
    </Menu>
  );
};

export default UserTimexMenu;
