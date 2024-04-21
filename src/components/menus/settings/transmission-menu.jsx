import React, { useState, useEffect } from "react";
import { FaCar as CarIcon } from "react-icons/fa";
import {
  MdOutlineCategory as TypeIcon,
  MdOutlineBrandingWatermark as BrandIcon,
  MdModelTraining as ModelIcon,
} from "react-icons/md";
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
    case 55:
      link = "vehicle-types";
      icon = <TypeIcon style={{ color: Colors.green[6] }} size={iconSize} />;
      break;

    case 56:
      link = "vehicle-brands";
      icon = <BrandIcon style={{ color: Colors.orange[6] }} size={iconSize} />;
      break;

    case 57:
      link = "vehicle-models";
      icon = <ModelIcon style={{ color: Colors.blue[6] }} size={iconSize} />;
      break;

    case 58:
      link = "vehicles";
      icon = <CarIcon style={{ color: Colors.volcano[6] }} size={iconSize} />;
      break;

    default:
      break;
  }

  return { link, icon };
};

const TransmissionMenu = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);
  const [lastPathKey, setLastPathKey] = useState("");

  const currentLocation = useLocation();

  useMount(async () => {
    const transmission_module_id = 7;
    const accessiblePages = await modulesService.accessiblePages(
      transmission_module_id
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
      modulePathName="transmission"
      lastPathKey={lastPathKey}
      accessiblePages={accessiblePages}
      iconSize={iconSize}
      mapper={mapper}
    />
  );
};

export default TransmissionMenu;
