import React, { useState, useEffect } from "react";
import { BiRepeat as RepeatIcon } from "react-icons/bi";
import { FiUserCheck as PersonCheckIcon } from "react-icons/fi";
import {
  BsUiChecks as DoneListIcon,
  BsFillPersonLinesFill as SupervisonIcon,
} from "react-icons/bs";
import {
  FaTags as TagsIcon,
  FaListUl as MyTasksIcon,
  FaUsersCog as UsersIcon,
  FaUserCheck as SelectedUserIcon,
  FaThList as DepartmentTasksIcon,
  FaTh as DepartmentsTasksIcon,
  FaUserShield as TopSupervisorsIcon,
} from "react-icons/fa";
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
    case 76:
      link = "task-tags";
      icon = <TagsIcon style={{ color: Colors.orange[6] }} size={iconSize} />;
      break;

    case 77:
      link = "my-tasks";
      icon = (
        <MyTasksIcon style={{ color: Colors.magenta[6] }} size={iconSize} />
      );
      break;

    case 78:
      link = "interval-tasks";
      icon = <RepeatIcon style={{ color: Colors.green[6] }} size={iconSize} />;
      break;

    case 79:
      link = "employees-tasks";
      icon = (
        <PersonCheckIcon style={{ color: Colors.blue[6] }} size={iconSize} />
      );
      break;

    case 80:
      link = "my-done-tasks";
      icon = <DoneListIcon style={{ color: Colors.cyan[6] }} size={iconSize} />;
      break;

    case 81:
      link = "task-supervisions";
      icon = (
        <SupervisonIcon style={{ color: Colors.red[6] }} size={iconSize} />
      );
      break;

    case 74:
      link = "colleagues-tasks";
      icon = <UsersIcon style={{ color: Colors.purple[3] }} size={iconSize} />;
      break;

    case 75:
      link = "others-tasks";
      icon = (
        <UsersIcon style={{ color: Colors.geekblue[6] }} size={iconSize} />
      );
      break;

    case 87:
      link = "selected-supervisors";
      icon = (
        <SelectedUserIcon
          style={{ color: Colors.volcano[4] }}
          size={iconSize}
        />
      );
      break;

    case 88:
      link = "department-tasks";
      icon = (
        <DepartmentTasksIcon
          style={{ color: Colors.magenta[4] }}
          size={iconSize}
        />
      );
      break;

    case 89:
      link = "departments-tasks";
      icon = (
        <DepartmentsTasksIcon
          style={{ color: Colors.blue[4] }}
          size={iconSize}
        />
      );
      break;

    case 90:
      link = "top-supervisors";
      icon = (
        <TopSupervisorsIcon
          style={{ color: Colors.green[5] }}
          size={iconSize}
        />
      );
      break;

    default:
      break;
  }

  return { link, icon };
};

const UserTasksMenu = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);
  const [lastPathKey, setLastPathKey] = useState("");

  const currentLocation = useLocation();

  useMount(async () => {
    const tasks_module_id = 9;
    const accessiblePages = await modulesService.accessiblePages(
      tasks_module_id
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
      modulePathName="tasks"
      lastPathKey={lastPathKey}
      accessiblePages={accessiblePages}
      iconSize={iconSize}
      mapper={mapper}
    />
  );
};

export default UserTasksMenu;
