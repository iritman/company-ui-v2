import React, { useState, useEffect } from "react";
import {
  VscGroupByRefType as FolderGroupIcon,
  VscKey as KeyIcon,
} from "react-icons/vsc";
import { FaFolderOpen as FolderIcon, FaTags as TagsIcon } from "react-icons/fa";
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
    case 135:
      link = "user-folder-groups";
      icon = (
        <FolderGroupIcon style={{ color: Colors.orange[6] }} size={iconSize} />
      );
      break;

    case 136:
      link = "user-folders";
      icon = <FolderIcon style={{ color: Colors.green[6] }} size={iconSize} />;
      break;

    case 137:
      link = "user-folder-permissions";
      icon = <KeyIcon style={{ color: Colors.magenta[5] }} size={iconSize} />;
      break;

    case 138:
      link = "user-label-tags";
      icon = <TagsIcon style={{ color: Colors.blue[5] }} size={iconSize} />;
      break;

    default:
      break;
  }

  return { link, icon };
};

const UserEDocsMenu = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);
  const [lastPathKey, setLastPathKey] = useState("");

  const currentLocation = useLocation();

  useMount(async () => {
    const edocs_module_id = 15;
    const accessiblePages = await modulesService.accessiblePages(
      edocs_module_id
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
      type="official"
      typeTitle={Words.official}
      modulePathName="edocs"
      lastPathKey={lastPathKey}
      accessiblePages={accessiblePages}
      iconSize={iconSize}
      mapper={mapper}
    />
  );
};

export default UserEDocsMenu;
