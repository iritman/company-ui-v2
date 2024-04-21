import React, { useState } from "react";
import { useMount } from "react-use";
import { Row, Col } from "antd";
import DashboardTile from "../../../common/dashboard-tile";
import {
  FaProjectDiagram as ProjectsIcon,
  FaMoneyCheckAlt as CostCentersIcon,
} from "react-icons/fa";
import {
  SiWebmoney as CostCenterTypesIcon,
  SiConvertio as RatioIcon,
} from "react-icons/si";
import { HiOutlineCurrencyDollar as CurrenciesIcon } from "react-icons/hi";
import { VscSourceControl as CreditSourceTypesIcon } from "react-icons/vsc";
import { RiDatabaseLine as CreditSourcesIcon } from "react-icons/ri";
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
    case 161:
      link = "projects";
      icon = <ProjectsIcon {...iconProps} />;
      backColor = Colors.orange[3];
      break;

    case 162:
      link = "cost-center-types";
      icon = <CostCenterTypesIcon {...iconProps} />;
      backColor = Colors.green[3];
      break;

    case 163:
      link = "cost-centers";
      icon = <CostCentersIcon {...iconProps} />;
      backColor = Colors.blue[3];
      break;

    case 164:
      link = "currencies";
      icon = <CurrenciesIcon {...iconProps} />;
      backColor = Colors.cyan[3];
      break;

    case 165:
      link = "currency-ratios";
      icon = <RatioIcon {...iconProps} />;
      backColor = Colors.purple[3];
      break;

    case 166:
      link = "credit-source-types";
      icon = <CreditSourceTypesIcon {...iconProps} />;
      backColor = Colors.magenta[3];
      break;

    case 167:
      link = "credit-sources";
      icon = <CreditSourcesIcon {...iconProps} />;
      backColor = Colors.lime[4];
      break;

    // case 148:
    //   link = "user-products";
    //   icon = <ProductIcon {...iconProps} />;
    //   backColor = Colors.volcano[3];
    //   break;

    // case 149:
    //   link = "user-inventory-control-agents";
    //   icon = <InventoryControlAgentIcon {...iconProps} />;
    //   backColor = Colors.red[3];
    //   break;

    // case 150:
    //   link = "user-bach-patterns";
    //   icon = <BachPatternIcon {...iconProps} />;
    //   backColor = Colors.cyan[3];
    //   break;

    // case 151:
    //   link = "user-baches";
    //   icon = <BachIcon {...iconProps} />;
    //   backColor = Colors.geekblue[3];
    //   break;

    default:
      break;
  }

  return { link, icon, backColor };
};

const UserPublicSettingsDashboard = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);

  useMount(async () => {
    const public_settings_module_id = 17;
    const accessiblePages = await modulesService.accessiblePages(
      public_settings_module_id
    );

    setAccessiblePages(accessiblePages);
  });

  return (
    <Row gutter={[10, 16]}>
      {accessiblePages.map((page) => (
        <Col xs={24} md={8} lg={6} key={page.PageID}>
          <DashboardTile
            to={`public-settings/${mapper(page.PageID).link}`}
            icon={mapper(page.PageID).icon}
            backColor={mapper(page.PageID).backColor}
            title={page.PageTitle}
          />
        </Col>
      ))}
    </Row>
  );
};

export default UserPublicSettingsDashboard;
