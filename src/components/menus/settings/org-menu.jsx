import React, { useState, useEffect } from "react";
import { AiOutlineCodepen as RoleIcon } from "react-icons/ai";
import {
  FaUsers as MemberIcon,
  FaIdCard as EmployeeIcon,
  FaUsersCog as AgentIcon,
  FaTasks as RoleDutyIcon,
  FaWallet as WalletIcon,
} from "react-icons/fa";
import { BiUnite as DepartmentIcon } from "react-icons/bi";
import {
  RiBuilding2Fill as CompanyIcon,
  RiOrganizationChart as OrgChartIcon,
} from "react-icons/ri";
import { VscUngroupByRefType as DutyLevelIcon } from "react-icons/vsc";
import { GoTasklist as PersonalDutyIcon } from "react-icons/go";
import { useMount } from "react-use";
import modulesService from "../../../services/app/modules-service";
import Colors from "../../../resources/colors";
import Words from "../../../resources/words";
import { useLocation } from "react-router-dom";
import ModuleMenu from "./../module-menu";

const iconSize = 20;

const mapper = (pageID) => {
  let link = "";
  let icon = null;

  switch (pageID) {
    case 3:
      link = "departments";
      icon = (
        <DepartmentIcon style={{ color: Colors.green[6] }} size={iconSize} />
      );
      break;

    case 4:
      link = "org-chart";
      icon = (
        <OrgChartIcon style={{ color: Colors.orange[6] }} size={iconSize} />
      );
      break;

    case 5:
      link = "roles";
      icon = <RoleIcon style={{ color: Colors.blue[6] }} size={iconSize} />;
      break;

    case 6:
      link = "companies";
      icon = (
        <CompanyIcon style={{ color: Colors.volcano[6] }} size={iconSize} />
      );
      break;

    case 7:
      link = "members";
      icon = (
        <MemberIcon style={{ color: Colors.magenta[6] }} size={iconSize} />
      );
      break;

    case 8:
      link = "employees";
      icon = (
        <EmployeeIcon style={{ color: Colors.geekblue[6] }} size={iconSize} />
      );
      break;

    case 9:
      link = "company-agents";
      icon = <AgentIcon style={{ color: Colors.gold[7] }} size={iconSize} />;
      break;

    case 10:
      link = "duty-levels";
      icon = (
        <DutyLevelIcon style={{ color: Colors.magenta[5] }} size={iconSize} />
      );
      break;

    case 11:
      link = "personal-duties";
      icon = (
        <PersonalDutyIcon style={{ color: Colors.red[5] }} size={iconSize} />
      );
      break;

    case 29:
      link = "role-duties";
      icon = <RoleDutyIcon style={{ color: Colors.red[6] }} size={iconSize} />;
      break;

    case 72:
      link = "bank-accounts";
      icon = <WalletIcon style={{ color: Colors.cyan[6] }} size={iconSize} />;
      break;

    case 115:
      link = "store-experts";
      icon = <MemberIcon style={{ color: Colors.purple[3] }} size={iconSize} />;
      break;

    case 116:
      link = "informatic-experts";
      icon = <MemberIcon style={{ color: Colors.orange[4] }} size={iconSize} />;
      break;

    case 117:
      link = "financial-experts";
      icon = (
        <MemberIcon style={{ color: Colors.magenta[3] }} size={iconSize} />
      );
      break;

    case 118:
      link = "ceremony-experts";
      icon = (
        <MemberIcon style={{ color: Colors.geekblue[4] }} size={iconSize} />
      );
      break;

    default:
      break;
  }

  return { link, icon };
};

const OrgMenu = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);
  const [lastPathKey, setLastPathKey] = useState("");

  const currentLocation = useLocation();

  useMount(async () => {
    const org_module_id = 3;
    const accessiblePages = await modulesService.accessiblePages(org_module_id);

    setAccessiblePages(accessiblePages);
  });

  useEffect(() => {
    const pathKeys = currentLocation.pathname.split("/");
    const _lastPathKey = pathKeys[pathKeys.length - 1]
      .replaceAll("-", "")
      .toLocaleLowerCase();
    setLastPathKey(_lastPathKey);
  }, [currentLocation.pathname]);

  return (
    <ModuleMenu
      type="settings"
      typeTitle={Words.admin_panel}
      modulePathName="org"
      lastPathKey={lastPathKey}
      accessiblePages={accessiblePages}
      iconSize={iconSize}
      mapper={mapper}
    />
  );
};

export default OrgMenu;
