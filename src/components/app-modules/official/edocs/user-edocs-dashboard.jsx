import React, { useState } from "react";
import { useMount } from "react-use";
import { Row, Col } from "antd";
import DashboardTile from "../../../common/dashboard-tile";
import {
  VscGroupByRefType as FolderGroupIcon,
  VscKey as KeyIcon,
} from "react-icons/vsc";
import { FaFolderOpen as FolderIcon, FaTags as TagsIcon } from "react-icons/fa";
import Colors from "../../../../resources/colors";
import modulesService from "../../../../services/app/modules-service";

const iconProps = {
  size: 55,
  style: { marginTop: 10 },
};

const mapper = (pageID) => {
  let link = "";
  let icon = null;
  let backColor = Colors.blue[3];

  switch (pageID) {
    case 135:
      link = "user-folder-groups";
      icon = <FolderGroupIcon {...iconProps} />;
      backColor = Colors.orange[3];
      break;

    case 136:
      link = "user-folders";
      icon = <FolderIcon {...iconProps} />;
      backColor = Colors.green[3];
      break;

    case 137:
      link = "user-folder-permissions";
      icon = <KeyIcon {...iconProps} />;
      backColor = Colors.magenta[3];
      break;

    case 138:
      link = "user-label-tags";
      icon = <TagsIcon {...iconProps} />;
      backColor = Colors.blue[3];
      break;

    default:
      break;
  }

  return { link, icon, backColor };
};

const UserEDocsDashboard = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);

  useMount(async () => {
    const edocs_module_id = 15;
    const accessiblePages = await modulesService.accessiblePages(
      edocs_module_id
    );

    setAccessiblePages(accessiblePages);
  });

  return (
    <Row gutter={[10, 16]}>
      {accessiblePages.map((page) => (
        <Col xs={24} md={8} lg={6} key={page.PageID}>
          <DashboardTile
            to={`edocs/${mapper(page.PageID).link}`}
            icon={mapper(page.PageID).icon}
            backColor={mapper(page.PageID).backColor}
            title={page.PageTitle}
          />
        </Col>
      ))}
    </Row>
  );
};

export default UserEDocsDashboard;
