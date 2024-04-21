import React, { useState } from "react";
import { useMount } from "react-use";
import { Row, Col } from "antd";
import DashboardTile from "../../../common/dashboard-tile";
import { AiOutlineGroup as GroupIcon } from "react-icons/ai";
import {
  MdOutlineSupportAgent as PurchasingAgentIcon,
  MdOutlineMiscellaneousServices as ServiceIcon,
} from "react-icons/md";
import {
  FaUsersCog as PurchasingAdminIcon,
  FaWarehouse as SupplierIcon,
  FaClipboardList as ActivityListIcon,
} from "react-icons/fa";
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
    case 300:
      link = "purchasing-admins";
      icon = <PurchasingAdminIcon {...iconProps} />;
      backColor = Colors.purple[3];
      break;

    case 301:
      link = "purchasing-agents";
      icon = <PurchasingAgentIcon {...iconProps} />;
      backColor = Colors.orange[3];
      break;

    case 302:
      link = "suppliers";
      icon = <SupplierIcon {...iconProps} />;
      backColor = Colors.green[3];
      break;

    case 303:
      link = "SupplierActivityTypes";
      icon = <ActivityListIcon {...iconProps} />;
      backColor = Colors.volcano[3];
      break;

    case 304:
      link = "service-groups";
      icon = <GroupIcon {...iconProps} />;
      backColor = Colors.cyan[4];
      break;

    case 305:
      link = "purchasing-services";
      icon = <ServiceIcon {...iconProps} />;
      backColor = Colors.magenta[4];
      break;

    default:
      break;
  }

  return { link, icon, backColor };
};

const LogisticBasicInfoDashboard = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);

  useMount(async () => {
    const logistic_basic_info_module_id = 31;
    const accessiblePages = await modulesService.accessiblePages(
      logistic_basic_info_module_id
    );

    setAccessiblePages(accessiblePages);
  });

  return (
    <Row gutter={[10, 16]}>
      {accessiblePages.map((page) => (
        <Col xs={24} md={8} lg={6} key={page.PageID}>
          <DashboardTile
            to={`basic-info/${mapper(page.PageID).link}`}
            icon={mapper(page.PageID).icon}
            backColor={mapper(page.PageID).backColor}
            title={page.PageTitle}
          />
        </Col>
      ))}
    </Row>
  );
};

export default LogisticBasicInfoDashboard;
