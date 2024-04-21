import React, { useState } from "react";
import { useMount } from "react-use";
import { Row, Col } from "antd";
import DashboardTile from "../../common/dashboard-tile";
// import {
//   FaDatabase as StoreIcon,
//   FaMoneyCheckAlt as TreasuryIcon,
// } from "react-icons/fa";
// import {
//   TbNotebook as LedgerIcon,
//   TbReportMoney as DocsIcon,
// } from "react-icons/tb";
import {
  // MdSettings as SettingsIcon,
  // MdAccountBalanceWallet as AccountsIcon,
  // MdSouthWest as ReceiveIcon,
  // MdNorthEast as PaymentIcon,
  MdSettingsInputComponent as BasicInfoIcon,
} from "react-icons/md";
import { FaShoppingBasket as BasketIcon } from "react-icons/fa";
// import { BsFileEarmarkPersonFill as CollectorAgentIcon } from "react-icons/bs";
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
    case 31:
      link = "basic-info";
      icon = <BasicInfoIcon {...iconProps} />;
      backColor = Colors.blue[3];
      break;

    case 32:
      link = "purchase";
      icon = <BasketIcon {...iconProps} />;
      backColor = Colors.cyan[3];
      break;

    // case 19:
    //   link = "accounts";
    //   icon = <AccountsIcon {...iconProps} />;
    //   backColor = Colors.volcano[3];
    //   break;

    // case 22:
    //   link = "ledger";
    //   icon = <LedgerIcon {...iconProps} />;
    //   backColor = Colors.magenta[3];
    //   break;

    // case 23:
    //   link = "treasury/basic";
    //   icon = <TreasuryIcon {...iconProps} />;
    //   backColor = Colors.grey[5];
    //   break;

    // case 24:
    //   link = "treasury/receive";
    //   icon = <ReceiveIcon {...iconProps} />;
    //   backColor = Colors.green[3];
    //   break;

    // case 25:
    //   link = "treasury/pay";
    //   icon = <PaymentIcon {...iconProps} />;
    //   backColor = Colors.orange[3];
    //   break;

    // case 27:
    //   link = "treasury/fund";
    //   icon = <FundIcon {...iconProps} />;
    //   backColor = Colors.geekblue[3];
    //   break;

    // case 28:
    //   link = "treasury/collector-agent";
    //   icon = <CollectorAgentIcon {...iconProps} />;
    //   backColor = Colors.red[3];
    //   break;

    // case 29:
    //   link = "docs";
    //   icon = <DocsIcon {...iconProps} />;
    //   backColor = Colors.purple[3];
    //   break;

    default:
      break;
  }

  return { link, icon, backColor };
};

const UserLogisticDashboard = () => {
  const [accessibleModules, setAccessibleModules] = useState([]);

  useMount(async () => {
    const user_logistic_category_id = 4;
    const accessibleModules = await modulesService.accessibleModules(
      user_logistic_category_id
    );

    setAccessibleModules(accessibleModules);
  });

  return (
    <Row gutter={[10, 16]}>
      {accessibleModules.map((module) => (
        <Col xs={24} md={8} lg={6} key={module.ModuleID}>
          <DashboardTile
            to={`logistic/${mapper(module.ModuleID).link}`}
            icon={mapper(module.ModuleID).icon}
            backColor={mapper(module.ModuleID).backColor}
            title={module.ModuleTitle}
          />
        </Col>
      ))}
    </Row>
  );
};

export default UserLogisticDashboard;
