import React, { useState } from "react";
import { useMount } from "react-use";
import { Row, Col } from "antd";
import DashboardTile from "../../common/dashboard-tile";
import {
  FaDatabase as StoreIcon,
  FaWarehouse as StoreOperationsIcon,
  FaMoneyCheckAlt as TreasuryIcon,
} from "react-icons/fa";
import {
  TbNotebook as LedgerIcon,
  TbReportMoney as DocsIcon,
} from "react-icons/tb";
import {
  MdSettings as SettingsIcon,
  MdAccountBalanceWallet as AccountsIcon,
  MdSouthWest as ReceiveIcon,
  MdNorthEast as PaymentIcon,
} from "react-icons/md";
import { RiRefundFill as FundIcon } from "react-icons/ri";
import { BsFileEarmarkPersonFill as CollectorAgentIcon } from "react-icons/bs";
import Colors from "../../../resources/colors";
import modulesService from "../../../services/app/modules-service";

const iconProps = {
  size: 55,
  style: { marginTop: 10 },
};

const mapper = (moduleID) => {
  let link = "";
  let icon = null;
  let backColor = Colors.blue[3];

  switch (moduleID) {
    case 14:
      link = "store-mgr";
      icon = <StoreIcon {...iconProps} />;
      backColor = Colors.blue[3];
      break;

    case 16:
      link = "store-opr";
      icon = <StoreOperationsIcon {...iconProps} />;
      backColor = Colors.orange[3];
      break;

    case 17:
      link = "public-settings";
      icon = <SettingsIcon {...iconProps} />;
      backColor = Colors.cyan[3];
      break;

    case 19:
      link = "accounts";
      icon = <AccountsIcon {...iconProps} />;
      backColor = Colors.volcano[3];
      break;

    case 22:
      link = "ledger";
      icon = <LedgerIcon {...iconProps} />;
      backColor = Colors.magenta[3];
      break;

    case 23:
      link = "treasury/basic";
      icon = <TreasuryIcon {...iconProps} />;
      backColor = Colors.grey[5];
      break;

    case 24:
      link = "treasury/receive";
      icon = <ReceiveIcon {...iconProps} />;
      backColor = Colors.green[3];
      break;

    case 25:
      link = "treasury/pay";
      icon = <PaymentIcon {...iconProps} />;
      backColor = Colors.orange[3];
      break;

    case 27:
      link = "treasury/fund";
      icon = <FundIcon {...iconProps} />;
      backColor = Colors.geekblue[3];
      break;

    case 28:
      link = "treasury/collector-agent";
      icon = <CollectorAgentIcon {...iconProps} />;
      backColor = Colors.red[3];
      break;

    case 29:
      link = "docs";
      icon = <DocsIcon {...iconProps} />;
      backColor = Colors.purple[3];
      break;

    default:
      break;
  }

  return { link, icon, backColor };
};

const UserOfficialDashboard = () => {
  const [accessibleModules, setAccessibleModules] = useState([]);

  useMount(async () => {
    const user_financial_category_id = 3;
    const accessibleModules = await modulesService.accessibleModules(
      user_financial_category_id
    );

    setAccessibleModules(accessibleModules);
  });

  return (
    <Row gutter={[10, 16]}>
      {accessibleModules.map((module) => (
        <Col xs={24} md={8} lg={6} key={module.ModuleID}>
          <DashboardTile
            to={`financial/${mapper(module.ModuleID).link}`}
            icon={mapper(module.ModuleID).icon}
            backColor={mapper(module.ModuleID).backColor}
            title={module.ModuleTitle}
          />
        </Col>
      ))}
    </Row>
  );
};

export default UserOfficialDashboard;
