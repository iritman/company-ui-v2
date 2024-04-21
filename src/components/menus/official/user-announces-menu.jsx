import React, { useState, useEffect } from "react";
import { AiOutlineMail as NewAnnouncesIcon } from "react-icons/ai";
import { TbMailForward as MyAnnouncesIcon } from "react-icons/tb";
import { RiMailSendLine as AnnouncesIcon } from "react-icons/ri";
import { HiOutlineMailOpen as ArchivedAnnouncesIcon } from "react-icons/hi";
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
    case 130:
      link = "new-announces";
      icon = (
        <NewAnnouncesIcon style={{ color: Colors.orange[6] }} size={iconSize} />
      );
      break;

    case 131:
      link = "archived-announces";
      icon = (
        <ArchivedAnnouncesIcon
          style={{ color: Colors.magenta[5] }}
          size={iconSize}
        />
      );
      break;

    case 132:
      link = "my-announces";
      icon = (
        <MyAnnouncesIcon style={{ color: Colors.green[6] }} size={iconSize} />
      );
      break;

    case 133:
      link = "all-announces";
      icon = (
        <AnnouncesIcon style={{ color: Colors.blue[6] }} size={iconSize} />
      );
      break;

    default:
      break;
  }

  return { link, icon };
};

const UserAnnouncesMenu = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);
  const [lastPathKey, setLastPathKey] = useState("");

  const currentLocation = useLocation();

  useMount(async () => {
    const announces_module_id = 21;
    const accessiblePages = await modulesService.accessiblePages(
      announces_module_id
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
      type="official"
      typeTitle={Words.official}
      modulePathName="announces"
      lastPathKey={lastPathKey}
      accessiblePages={accessiblePages}
      iconSize={iconSize}
      mapper={mapper}
    />
  );
};

export default UserAnnouncesMenu;
