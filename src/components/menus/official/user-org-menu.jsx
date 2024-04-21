import React, { useState, useEffect } from "react";
import { RiOrganizationChart as OrgChartIcon } from "react-icons/ri";
import { VscUngroupByRefType as MyDutiesIcon } from "react-icons/vsc";
import { GoTasklist as MembersDutiesIcon } from "react-icons/go";
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
    case 30:
      link = "org-chart";
      icon = (
        <OrgChartIcon style={{ color: Colors.orange[6] }} size={iconSize} />
      );
      break;

    case 31:
      link = "my-duties";
      icon = (
        <MyDutiesIcon style={{ color: Colors.magenta[5] }} size={iconSize} />
      );
      break;

    case 32:
      link = "members-duties";
      icon = (
        <MembersDutiesIcon style={{ color: Colors.green[6] }} size={iconSize} />
      );
      break;

    default:
      break;
  }

  return { link, icon };
};

const UserOrgMenu = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);
  const [lastPathKey, setLastPathKey] = useState("");

  const currentLocation = useLocation();

  useMount(async () => {
    const org_module_id = 5;
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
      type="official"
      typeTitle={Words.official}
      modulePathName="org"
      lastPathKey={lastPathKey}
      accessiblePages={accessiblePages}
      iconSize={iconSize}
      mapper={mapper}
    />
  );
};

export default UserOrgMenu;
