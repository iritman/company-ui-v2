import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import {
  SendOutlined as AnnounceIcon,
  // AuditOutlined as HokmIcon,
} from "@ant-design/icons";
import {
  RiRefund2Fill as FundIcon,
  RiArtboardFill as BoardIcon,
  RiWalkFill as CheckoutIcon,
  RiUserAddFill as AddUserIcon,
  RiExchangeFundsLine as PersonalTransferIcon,
  RiExchangeLine as ManagerTransferIcon,
  RiFileUserFill as HokmIcon,
} from "react-icons/ri";

import { GiPoliceOfficerHead as PoliceIcon } from "react-icons/gi";
import {
  MdPersonRemoveAlt1 as RemoveUserIcon,
  MdRoomService as CeremonyIcon,
} from "react-icons/md";
import {
  AiOutlineDashboard as DashboardIcon,
  // AiFillIdcard as MembersRegedCardIcon,
  // AiOutlineSchedule as WorkShiftIcon,
  // AiOutlineUserSwitch as ReplaceWorkRequestIcon,
  // AiOutlineIdcard as CardexIcon,
} from "react-icons/ai";
import {
  // MdCardTravel as VacationIcon,
  // MdOutlineWork as MissionIcon,
  // MdSpeakerNotes as ReportIcon,
  MdSecurity as SecurityIcon,
  MdDevices as InformaticIcon,
  // MdOutlineSwapCalls as AlternativeIcon,
} from "react-icons/md";
import {
  // FaChartPie as WorkReportIcon,
  FaLandmark as OfficialIcon,
  FaStore as StoreIcon,
} from "react-icons/fa";
import { BsCashCoin as MoneyIcon } from "react-icons/bs";
// import { BiAlarmAdd as ExtraWorkIcon } from "react-icons/bi";
// import { CgArrowsExchange as ExchangeIcon } from "react-icons/cg";
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
    case 91:
      link = "dismissals";
      icon = (
        <RemoveUserIcon style={{ color: Colors.red[6] }} size={iconSize} />
      );
      break;

    case 98:
      link = "dismissals-check-official";
      icon = (
        <RemoveUserIcon style={{ color: Colors.red[6] }} size={iconSize} />
      );
      break;

    case 92:
      link = "edu-funds";
      icon = <FundIcon style={{ color: Colors.green[6] }} size={iconSize} />;
      break;

    case 99:
      link = "edu-funds-check-official";
      icon = <FundIcon style={{ color: Colors.green[6] }} size={iconSize} />;
      break;

    case 100:
      link = "violations";
      icon = <PoliceIcon style={{ color: Colors.red[7] }} size={iconSize} />;
      break;

    case 101:
      link = "violations-check-official";
      icon = <PoliceIcon style={{ color: Colors.red[7] }} size={iconSize} />;
      break;

    case 102:
      link = "my-violation-announces";
      icon = <AnnounceIcon style={{ color: Colors.red[7] }} size={iconSize} />;
      break;

    case 103:
      link = "department-violation-responses";
      icon = <HokmIcon style={{ color: Colors.purple[6] }} size={iconSize} />;
      break;

    case 104:
      link = "my-violation-responses";
      icon = <HokmIcon style={{ color: Colors.purple[6] }} size={iconSize} />;
      break;

    case 93:
      link = "learnings";
      icon = <BoardIcon style={{ color: Colors.blue[6] }} size={iconSize} />;
      break;

    case 94:
      link = "checkouts-check-official";
      icon = (
        <CheckoutIcon style={{ color: Colors.orange[6] }} size={iconSize} />
      );
      break;

    case 105:
      link = "department-checkouts";
      icon = (
        <CheckoutIcon style={{ color: Colors.orange[6] }} size={iconSize} />
      );
      break;

    case 106:
      link = "informatic-checkouts";
      icon = (
        <CheckoutIcon style={{ color: Colors.orange[6] }} size={iconSize} />
      );
      break;

    case 107:
      link = "store-checkouts";
      icon = (
        <CheckoutIcon style={{ color: Colors.orange[6] }} size={iconSize} />
      );
      break;

    case 108:
      link = "financial-checkouts";
      icon = (
        <CheckoutIcon style={{ color: Colors.orange[6] }} size={iconSize} />
      );
      break;

    case 95:
      link = "employments";
      icon = (
        <AddUserIcon style={{ color: Colors.purple[6] }} size={iconSize} />
      );
      break;

    case 96:
      link = "personal-transfers";
      icon = (
        <PersonalTransferIcon
          style={{ color: Colors.magenta[6] }}
          size={iconSize}
        />
      );
      break;

    case 112:
      link = "department-personal-transfers";
      icon = (
        <PersonalTransferIcon
          style={{ color: Colors.magenta[6] }}
          size={iconSize}
        />
      );
      break;

    case 113:
      link = "personal-transfers-check-official";
      icon = (
        <PersonalTransferIcon
          style={{ color: Colors.magenta[6] }}
          size={iconSize}
        />
      );
      break;

    case 114:
      link = "store-personal-transfers";
      icon = (
        <PersonalTransferIcon
          style={{ color: Colors.magenta[6] }}
          size={iconSize}
        />
      );
      break;

    case 97:
      link = "management-transfers";
      icon = (
        <ManagerTransferIcon
          style={{ color: Colors.cyan[6] }}
          size={iconSize}
        />
      );
      break;

    case 109:
      link = "store-management-transfers";
      icon = (
        <ManagerTransferIcon
          style={{ color: Colors.cyan[6] }}
          size={iconSize}
        />
      );
      break;

    case 110:
      link = "my-management-transfers";
      icon = (
        <ManagerTransferIcon
          style={{ color: Colors.cyan[6] }}
          size={iconSize}
        />
      );
      break;

    case 111:
      link = "department-management-transfers";
      icon = (
        <ManagerTransferIcon
          style={{ color: Colors.cyan[6] }}
          size={iconSize}
        />
      );
      break;

    case 123:
      link = "user-ceremony-requests";
      icon = <CeremonyIcon style={{ color: Colors.blue[6] }} size={iconSize} />;
      break;

    case 124:
      link = "user-ceremony-requests-check-official";
      icon = <CeremonyIcon style={{ color: Colors.blue[6] }} size={iconSize} />;
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
      { pageName: "user-EduFunds" },
      { pageName: "user-Violations" },
      { pageName: "user-MyViolationAnnounces" },
      { pageName: "user-MyViolationResponses" },
      { pageName: "user-EmployeeManagementTransfers" },
      { pageName: "user-PersonalTransfers" },
      { pageName: "user-CeremonyRequests" },
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
      // { pageName: "user-SecurityGuardRegedCards" },
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
      { pageName: "user-Dismissals" },
      { pageName: "user-DepartmentViolationResponses" },
      { pageName: "user-DepartmentCheckouts" },
      { pageName: "user-DepartmentManagementTransfers" },
      { pageName: "user-DepartmentPersonalTransfers" },
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
      { pageName: "user-DismissalsCheckOfficial" },
      { pageName: "user-EduFundsCheckOfficial" },
      { pageName: "user-ViolationsCheckOfficial" },
      { pageName: "user-CheckoutsCheckOfficial" },
      { pageName: "user-ManagementTransfers" },
      { pageName: "user-PersonalTransfersCheckOfficial" },
      { pageName: "user-CeremonyRequestsCheckOfficial" },
    ],
  },
  {
    name: "informatic-cartable",
    title: (
      <TabTitle
        title={Words.informatic_cartable}
        color={Colors.magenta[6]}
        icon={InformaticIcon}
      />
    ),
    pages: [{ pageName: "user-InformaticCheckouts" }],
  },
  {
    name: "store-cartable",
    title: (
      <TabTitle
        title={Words.store_cartable}
        color={Colors.lime[7]}
        icon={StoreIcon}
      />
    ),
    pages: [
      { pageName: "user-StoreCheckouts" },
      { pageName: "user-StoreManagementTransfers" },
      { pageName: "user-StorePersonalTransfers" },
    ],
  },
  {
    name: "financial-cartable",
    title: (
      <TabTitle
        title={Words.financial_cartable}
        color={Colors.blue[7]}
        icon={MoneyIcon}
      />
    ),
    pages: [{ pageName: "user-FinancialCheckouts" }],
  },
];

const UserProcessesMenu = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);
  const [lastPathKey, setLastPathKey] = useState("");
  const [openKeys, setOpenKeys] = React.useState([]);

  const currentLocation = useLocation();

  useMount(async () => {
    const processes_module_id = 10;
    const accessiblePages = await modulesService.accessiblePages(
      processes_module_id
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
    const processes_module_path_name = "processes";
    const isEndsWithModuleName = currentLocation.pathname.endsWith(
      `/${processes_module_path_name}`
    );
    const prePath = isEndsWithModuleName
      ? `${processes_module_path_name}/`
      : "";

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

export default UserProcessesMenu;
