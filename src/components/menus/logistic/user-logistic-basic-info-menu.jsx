import React, { useState, useEffect } from "react";
import {
  MdOutlineSupportAgent as PurchasingAgentIcon,
  MdOutlineMiscellaneousServices as ServiceIcon,
} from "react-icons/md";
import { AiOutlineGroup as GroupIcon } from "react-icons/ai";
import {
  FaUsersCog as PurchasingAdminIcon,
  FaWarehouse as SupplierIcon,
  FaClipboardList as ActivityListIcon,
} from "react-icons/fa";
import { useMount } from "react-use";
import modulesService from "../../../services/app/modules-service";
import Colors from "../../../resources/colors";
import { useLocation } from "react-router-dom";
import ModuleMenu from "../module-menu";
import Words from "../../../resources/words";

const iconSize = 20;

const mapper = (pageID) => {
  let link = "";
  let icon = null;

  switch (pageID) {
    case 300:
      link = "purchasing-admins";
      icon = (
        <PurchasingAdminIcon
          style={{ color: Colors.purple[6] }}
          size={iconSize}
        />
      );
      break;

    case 301:
      link = "purchasing-agents";
      icon = (
        <PurchasingAgentIcon
          style={{ color: Colors.orange[6] }}
          size={iconSize}
        />
      );
      break;

    case 302:
      link = "suppliers";
      icon = (
        <SupplierIcon style={{ color: Colors.green[6] }} size={iconSize} />
      );
      break;

    case 303:
      link = "supplier-activity-types";
      icon = (
        <ActivityListIcon
          style={{ color: Colors.volcano[6] }}
          size={iconSize}
        />
      );
      break;

    case 304:
      link = "service-groups";
      icon = <GroupIcon style={{ color: Colors.cyan[6] }} size={iconSize} />;
      break;

    case 305:
      link = "purchasing-services";
      icon = (
        <ServiceIcon style={{ color: Colors.magenta[6] }} size={iconSize} />
      );
      break;

    default:
      break;
  }

  return { link, icon };
};

const UserLogisticBasicInfoMenu = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);
  const [lastPathKey, setLastPathKey] = useState("");

  const currentLocation = useLocation();

  useMount(async () => {
    const logistic_basic_info_module_id = 31;
    const accessiblePages = await modulesService.accessiblePages(
      logistic_basic_info_module_id
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
  }, [currentLocation.pathname]);

  return (
    <ModuleMenu
      type="logistic"
      typeTitle={Words.logistic}
      modulePathName="basic-info"
      lastPathKey={lastPathKey}
      accessiblePages={accessiblePages}
      iconSize={iconSize}
      mapper={mapper}
    />
  );
};

export default UserLogisticBasicInfoMenu;
