import React, { useState, useEffect } from "react";
import { useMount } from "react-use";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import modulesService from "../../../services/app/modules-service";
import Colors from "../../../resources/colors";
import Words from "../../../resources/words";
import TabTitle from "../../common/tab-title";
import {
  AiOutlineDashboard as DashboardIcon,
  AiOutlineSetting as SettingIcon,
  AiOutlineSchedule as WorkHourIcon,
  AiOutlineFieldTime as WorkTimeIcon,
  AiFillIdcard as MembersRegedCardIcon,
  AiFillMacCommand as CommandIcon,
  AiOutlineIdcard as CardexIcon,
} from "react-icons/ai";
import {
  GiGuards as SecurityGuardIcon,
  GiSwipeCard as CardIcon,
} from "react-icons/gi";
import {
  MdFreeCancellation as HolidayIcon,
  MdCategory as CategoryIcon,
  MdSecurity as SecurityIcon,
  MdCalculate as CalculateIcon,
  MdCardTravel as VacationIcon,
  MdOutlineWork as MissionIcon,
  MdOutlineShareLocation as TargetIcon,
  MdOutlineSwapCalls as AlternativeIcon,
} from "react-icons/md";
import {
  FaUsersCog as UsersIcon,
  FaChartPie as ChartIcon,
  FaBusinessTime as CapacityIcon,
} from "react-icons/fa";
import {
  BiGitPullRequest as RequestIcon,
  BiGroup as GroupShiftIcon,
  BiCalendar as WorkShiftIcon,
} from "react-icons/bi";

const iconSize = 20;

const mapper = (pageID) => {
  let link = "";
  let icon = null;

  switch (pageID) {
    //--- Security Tab
    case 12:
      link = "security-guards";
      icon = (
        <SecurityGuardIcon style={{ color: Colors.green[6] }} size={iconSize} />
      );
      break;

    case 51:
      link = "security-guard-reged-cards";
      icon = (
        <MembersRegedCardIcon
          style={{ color: Colors.red[6] }}
          size={iconSize}
        />
      );
      break;

    //--- Indexes Tab
    case 13:
      link = "holidays";
      icon = (
        <HolidayIcon style={{ color: Colors.orange[6] }} size={iconSize} />
      );
      break;

    case 62:
      link = "department-extra-work-capacities";
      icon = (
        <CapacityIcon style={{ color: Colors.orange[6] }} size={iconSize} />
      );
      break;

    case 63:
      link = "extra-work-command-sources";
      icon = (
        <CommandIcon style={{ color: Colors.orange[6] }} size={iconSize} />
      );
      break;

    case 70:
      link = "no-alternative-employees";
      icon = (
        <AlternativeIcon style={{ color: Colors.orange[6] }} size={iconSize} />
      );
      break;

    //--- Vacations Tab
    case 15:
      link = "vacation-types";
      icon = <CategoryIcon style={{ color: Colors.blue[6] }} size={iconSize} />;
      break;

    case 17:
      link = "vacation-requests";
      icon = <RequestIcon style={{ color: Colors.blue[6] }} size={iconSize} />;
      break;

    case 84:
      link = "vacation-cardexes";
      icon = <CardexIcon style={{ color: Colors.blue[6] }} size={iconSize} />;
      break;

    case 14:
      link = "vacation-cardex-settings";
      icon = <SettingIcon style={{ color: Colors.blue[6] }} size={iconSize} />;
      break;

    //--- Missions Tab
    case 20:
      link = "mission-types";
      icon = (
        <CategoryIcon style={{ color: Colors.volcano[6] }} size={iconSize} />
      );
      break;

    case 54:
      link = "mission-targets";
      icon = (
        <TargetIcon style={{ color: Colors.volcano[6] }} size={iconSize} />
      );
      break;

    case 22:
      link = "mission-requests";
      icon = (
        <RequestIcon style={{ color: Colors.volcano[6] }} size={iconSize} />
      );
      break;

    //--- WorkTime Info Tab
    case 23:
      link = "official-experts";
      icon = <UsersIcon style={{ color: Colors.magenta[6] }} size={iconSize} />;
      break;

    case 24:
      link = "work-hours";
      icon = (
        <WorkHourIcon style={{ color: Colors.magenta[6] }} size={iconSize} />
      );
      break;

    case 25:
      link = "work-groups";
      icon = (
        <GroupShiftIcon style={{ color: Colors.magenta[6] }} size={iconSize} />
      );
      break;

    case 26:
      link = "work-shifts";
      icon = (
        <WorkShiftIcon style={{ color: Colors.magenta[6] }} size={iconSize} />
      );
      break;

    case 27:
      link = "reged-cards";
      icon = <CardIcon style={{ color: Colors.magenta[6] }} size={iconSize} />;
      break;

    // Colors.geekblue[6]
    // Colors.gold[7]
    // Colors.magenta[5]
    // Colors.red[5]

    default:
      break;
  }

  return { link, icon };
};

const tabs = [
  {
    name: "security",
    title: (
      <TabTitle
        title={Words.security}
        color={Colors.green[6]}
        icon={SecurityIcon}
      />
    ),
    pages: [
      { pageName: "SecurityGuards" },
      { pageName: "SecurityGuardRegedCards" },
    ],
  },
  {
    name: "indexes",
    title: (
      <TabTitle
        title={Words.indexes}
        color={Colors.orange[6]}
        icon={CalculateIcon}
      />
    ),
    pages: [
      { pageName: "Holidays" },
      { pageName: "DepartmentExtraWorkCapacities" },

      { pageName: "ExtraWorkCommandSources" },
      { pageName: "NoAlternativeEmployees" },
    ],
  },
  {
    name: "vacations",
    title: (
      <TabTitle
        title={Words.vacations}
        color={Colors.blue[6]}
        icon={VacationIcon}
      />
    ),
    pages: [
      { pageName: "VacationTypes" },
      { pageName: "VacationRequests" },
      { pageName: "VacationCardexes" },
      { pageName: "VacationCardexSettings" },
    ],
  },
  {
    name: "missions",
    title: (
      <TabTitle
        title={Words.missions}
        color={Colors.volcano[6]}
        icon={MissionIcon}
      />
    ),
    pages: [
      { pageName: "MissionTypes" },
      { pageName: "MissionTargets" },
      { pageName: "MissionRequests" },
    ],
  },
  {
    name: "work_time_info",
    title: (
      <TabTitle
        title={Words.work_time_info}
        color={Colors.magenta[6]}
        icon={WorkTimeIcon}
      />
    ),
    pages: [
      { pageName: "OfficialExperts" },
      { pageName: "WorkHours" },
      { pageName: "WorkGroups" },
      { pageName: "WorkShifts" },
      { pageName: "RegedCards" },
    ],
  },
  {
    name: "reports",
    title: (
      <TabTitle
        title={Words.reports}
        color={Colors.geekblue[6]}
        icon={ChartIcon}
      />
    ),
    pages: [],
  },
];

const SettingsTimexMenu = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);
  const [lastPathKey, setLastPathKey] = useState("");
  const [openKeys, setOpenKeys] = React.useState([]);

  const currentLocation = useLocation();

  useMount(async () => {
    const timex_module_id = 4;
    const accessiblePages = await modulesService.accessiblePages(
      timex_module_id
    );

    setAccessiblePages(accessiblePages);
  });

  useEffect(() => {
    const pathKeys = currentLocation.pathname.split("/");
    const _lastPathKey = pathKeys[pathKeys.length - 1]
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
          (p) => p.pageName.replaceAll("-", "").toLocaleLowerCase() === pageName
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

  const getChildItems = (pages) => {
    const timex_module_path_name = "timex";
    const isEndsWithModuleName = currentLocation.pathname.endsWith(
      `/${timex_module_path_name}`
    );
    const prePath = isEndsWithModuleName ? `${timex_module_path_name}/` : "";

    //------

    let sub_items = [];

    pages.forEach(({ PageID, PageName, PageTitle }) => {
      sub_items = [
        ...sub_items,
        {
          label: (
            <Link to={`${prePath}${mapper(PageID).link}`}>{PageTitle}</Link>
          ),
          key: PageName.replaceAll("-", "").toLocaleLowerCase(),
          icon: mapper(PageID).icon,
        },
      ];
    });

    return sub_items;
  };

  const getMenuTabs = () => {
    let tab_items = [];

    tabs.forEach((tab) => {
      if (
        accessiblePages.filter((p) =>
          tab.pages.filter((tp) => tp.pageName === p.PageName)
        ).length > 0
      ) {
        tab_items = [
          ...tab_items,
          {
            label: tab.title,
            key: tab.name,
            children: getChildItems(
              accessiblePages.filter(
                (ap) =>
                  tab.pages.filter((tp) => tp.pageName === ap.PageName)
                    .length === 1
              )
            ),
          },
        ];
      }
    });

    return tab_items;
  };

  const getMenuItems = () => {
    let items = [
      {
        label: <Link to={`/home/settings`}>{Words.admin_panel}</Link>,
        key: "settings",
        icon: (
          <DashboardIcon style={{ color: Colors.green[6] }} size={iconSize} />
        ),
      },
      {
        type: "divider",
      },
      ...getMenuTabs(),
    ];

    return items;
  };

  return (
    <Menu
      mode="inline"
      theme="light"
      openKeys={openKeys}
      selectedKeys={[lastPathKey]}
      onOpenChange={onOpenChange}
      items={getMenuItems()}
    />
  );
};

export default SettingsTimexMenu;
