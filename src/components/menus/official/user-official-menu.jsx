import React, { useState } from "react";
import { FaCar as CarIcon, FaTasks as TasksIcon } from "react-icons/fa";
import { RiFlowChart as ProcessIcon } from "react-icons/ri";
import {
  HiOutlineDocumentDuplicate as EDocsIcon,
  HiSpeakerphone as AnnouncesIcon,
} from "react-icons/hi";
import {
  AiFillBank as OrgIcon,
  AiOutlineFieldTime as TimexIcon,
  AiOutlineDeploymentUnit as AutomationIcon,
} from "react-icons/ai";
import { useMount } from "react-use";
import modulesService from "../../../services/app/modules-service";
import Colors from "../../../resources/colors";
import CategoryMenu from "./../category-menu";

const iconSize = 20;

const mapper = (moduleID) => {
  let link = "";
  let icon = null;

  switch (moduleID) {
    case 5:
      link = "org";
      icon = <OrgIcon style={{ color: Colors.blue[6] }} size={iconSize} />;
      break;

    case 6:
      link = "timex";
      icon = <TimexIcon style={{ color: Colors.orange[6] }} size={iconSize} />;
      break;

    case 7:
      link = "automation";
      icon = (
        <AutomationIcon style={{ color: Colors.red[6] }} size={iconSize} />
      );
      break;

    case 8:
      link = "transmission";
      icon = <CarIcon style={{ color: Colors.cyan[6] }} size={iconSize} />;
      break;

    case 9:
      link = "tasks";
      icon = <TasksIcon style={{ color: Colors.purple[6] }} size={iconSize} />;
      break;

    case 10:
      link = "processes";
      icon = <ProcessIcon style={{ color: Colors.red[6] }} size={iconSize} />;
      break;

    case 15:
      link = "edocs";
      icon = <EDocsIcon style={{ color: Colors.magenta[6] }} size={iconSize} />;
      break;

    case 21:
      link = "announces";
      icon = (
        <AnnouncesIcon style={{ color: Colors.lime[6] }} size={iconSize} />
      );
      break;

    default:
      break;
  }

  return { link, icon };
};

const UserOfficialMenu = () => {
  const [accessibleModules, setAccessibleModules] = useState([]);

  useMount(async () => {
    const official_category_id = 2;
    const accessibleModules = await modulesService.accessibleModules(
      official_category_id
    );

    setAccessibleModules(accessibleModules);
  });

  return (
    <CategoryMenu
      type="official"
      accessibleModules={accessibleModules}
      iconSize={iconSize}
      mapper={mapper}
    />
  );
};

export default UserOfficialMenu;
