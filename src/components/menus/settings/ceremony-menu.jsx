import React, { useState, useEffect } from "react";
import { BsPersonLinesFill as ClientTypeIcon } from "react-icons/bs";
import { MdLocationOn as LocationIcon } from "react-icons/md";
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
    case 121:
      link = "client-types";
      icon = (
        <ClientTypeIcon style={{ color: Colors.green[6] }} size={iconSize} />
      );
      break;

    case 122:
      link = "session-locations";
      icon = (
        <LocationIcon style={{ color: Colors.orange[6] }} size={iconSize} />
      );
      break;

    default:
      break;
  }

  return { link, icon };
};

const CeremonyMenu = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);
  const [lastPathKey, setLastPathKey] = useState("");

  const currentLocation = useLocation();

  useMount(async () => {
    const ceremony_module_id = 11;
    const accessiblePages = await modulesService.accessiblePages(
      ceremony_module_id
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
      modulePathName="ceremony"
      lastPathKey={lastPathKey}
      accessiblePages={accessiblePages}
      iconSize={iconSize}
      mapper={mapper}
    />
  );
};

export default CeremonyMenu;
