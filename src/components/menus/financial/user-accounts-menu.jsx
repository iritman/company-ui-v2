import React, { useState, useEffect } from "react";
import { FaProjectDiagram as TafsilTypesIcon } from "react-icons/fa";
import {
  MdOutlineAccountTree as TafsilAccountsIcon,
  MdOutlineConstruction as StructureIcon,
} from "react-icons/md";
import { useMount } from "react-use";
import modulesService from "../../../services/app/modules-service";
import Colors from "../../../resources/colors";
import { useLocation } from "react-router-dom";
import ModuleMenu from "../module-menu";
import Words from "./../../../resources/words";

const iconSize = 20;

const mapper = (pageID) => {
  let link = "";
  let icon = null;

  switch (pageID) {
    case 201:
      link = "account-structures";
      icon = (
        <StructureIcon style={{ color: Colors.purple[6] }} size={iconSize} />
      );
      break;

    case 202:
      link = "tafsil-types";
      icon = (
        <TafsilTypesIcon style={{ color: Colors.orange[6] }} size={iconSize} />
      );
      break;

    case 203:
      link = "tafsil-accounts";
      icon = (
        <TafsilAccountsIcon
          style={{ color: Colors.green[6] }}
          size={iconSize}
        />
      );
      break;

    default:
      break;
  }

  return { link, icon };
};

const UserAccountsMenu = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);
  const [lastPathKey, setLastPathKey] = useState("");

  const currentLocation = useLocation();

  useMount(async () => {
    const financial_accounts_module_id = 19;
    const accessiblePages = await modulesService.accessiblePages(
      financial_accounts_module_id
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
      modulePathName="accounts"
      lastPathKey={lastPathKey}
      accessiblePages={accessiblePages}
      iconSize={iconSize}
      mapper={mapper}
    />
  );
};

export default UserAccountsMenu;
