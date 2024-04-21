import React, { useState, useEffect } from "react";
import { GiHouseKeys as KeyIcon } from "react-icons/gi";
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
    case 28:
      link = "page-accesses";
      icon = <KeyIcon style={{ color: Colors.red[6] }} size={iconSize} />;
      break;

    default:
      break;
  }

  return { link, icon };
};

const AccessMenu = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);
  const [lastPathKey, setLastPathKey] = useState("");

  const currentLocation = useLocation();

  useMount(async () => {
    const accesses_module_id = 1;
    const accessiblePages = await modulesService.accessiblePages(
      accesses_module_id
    );

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
      modulePathName="accesses"
      lastPathKey={lastPathKey}
      accessiblePages={accessiblePages}
      iconSize={iconSize}
      mapper={mapper}
    />
  );
};

export default AccessMenu;
