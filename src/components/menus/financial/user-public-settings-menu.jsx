import React, { useState, useEffect } from "react";
import {
  FaProjectDiagram as ProjectsIcon,
  FaMoneyCheckAlt as CostCentersIcon,
} from "react-icons/fa";
import {
  SiWebmoney as CostCenterTypesIcon,
  SiConvertio as RatioIcon,
} from "react-icons/si";
import { HiOutlineCurrencyDollar as CurrenciesIcon } from "react-icons/hi";
import { VscSourceControl as CreditSourceTypesIcon } from "react-icons/vsc";
import { RiDatabaseLine as CreditSourcesIcon } from "react-icons/ri";
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
    case 161:
      link = "projects";
      icon = (
        <ProjectsIcon style={{ color: Colors.orange[6] }} size={iconSize} />
      );
      break;

    case 162:
      link = "cost-center-types";
      icon = (
        <CostCenterTypesIcon
          style={{ color: Colors.green[6] }}
          size={iconSize}
        />
      );
      break;

    case 163:
      link = "cost-centers";
      icon = (
        <CostCentersIcon style={{ color: Colors.blue[6] }} size={iconSize} />
      );
      break;

    case 164:
      link = "currencies";
      icon = (
        <CurrenciesIcon style={{ color: Colors.cyan[6] }} size={iconSize + 4} />
      );
      break;

    case 165:
      link = "currency-ratios";
      icon = <RatioIcon style={{ color: Colors.purple[6] }} size={iconSize} />;
      break;

    case 166:
      link = "credit-source-types";
      icon = (
        <CreditSourceTypesIcon
          style={{ color: Colors.magenta[6] }}
          size={iconSize}
        />
      );
      break;

    case 167:
      link = "credit-sources";
      icon = (
        <CreditSourcesIcon
          style={{ color: Colors.lime[6] }}
          size={iconSize + 4}
        />
      );
      break;

    // case 148:
    //   link = "user-products";
    //   icon = (
    //     <ProductIcon style={{ color: Colors.volcano[6] }} size={iconSize} />
    //   );
    //   break;

    // case 149:
    //   link = "user-inventory-control-agents";
    //   icon = (
    //     <InventoryControlAgentIcon
    //       style={{ color: Colors.red[6] }}
    //       size={iconSize}
    //     />
    //   );
    //   break;

    // case 150:
    //   link = "user-bach-patterns";
    //   icon = (
    //     <BachPatternIcon style={{ color: Colors.cyan[6] }} size={iconSize} />
    //   );
    //   break;

    // case 151:
    //   link = "user-baches";
    //   icon = <BachIcon style={{ color: Colors.geekblue[6] }} size={iconSize} />;
    //   break;

    default:
      break;
  }

  return { link, icon };
};

const UserPublicSettingsMenu = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);
  const [lastPathKey, setLastPathKey] = useState("");

  const currentLocation = useLocation();

  useMount(async () => {
    const public_settings_module_id = 17;
    const accessiblePages = await modulesService.accessiblePages(
      public_settings_module_id
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
      type="financial"
      typeTitle={Words.financial}
      modulePathName="public-settings"
      lastPathKey={lastPathKey}
      accessiblePages={accessiblePages}
      iconSize={iconSize}
      mapper={mapper}
    />
  );
};

export default UserPublicSettingsMenu;
