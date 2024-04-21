import React, { useState } from "react";
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
import { useMount } from "react-use";
import modulesService from "../../../services/app/modules-service";
import Colors from "../../../resources/colors";
import CategoryMenu from "../category-menu";

const iconSize = 20;

const mapper = (moduleID) => {
  let link = "";
  let icon = null;

  switch (moduleID) {
    case 31:
      link = "basic-info";
      icon = (
        <BasicInfoIcon style={{ color: Colors.blue[6] }} size={iconSize} />
      );
      break;

    case 32:
      link = "purchase";
      icon = <BasketIcon style={{ color: Colors.cyan[6] }} size={iconSize} />;
      break;

    // case 19:
    //   link = "accounts";
    //   icon = (
    //     <AccountsIcon style={{ color: Colors.volcano[6] }} size={iconSize} />
    //   );
    //   break;

    // case 22:
    //   link = "ledger";
    //   icon = (
    //     <LedgerIcon style={{ color: Colors.magenta[6] }} size={iconSize} />
    //   );
    //   break;

    // case 23:
    //   link = "treasury/basic";
    //   icon = <TreasuryIcon style={{ color: Colors.grey[6] }} size={iconSize} />;
    //   break;

    // case 24:
    //   link = "treasury/receive";
    //   icon = <ReceiveIcon style={{ color: Colors.green[6] }} size={iconSize} />;
    //   break;

    // case 25:
    //   link = "treasury/pay";
    //   icon = (
    //     <PaymentIcon style={{ color: Colors.orange[6] }} size={iconSize} />
    //   );
    //   break;

    // case 27:
    //   link = "treasury/fund";
    //   icon = <FundIcon style={{ color: Colors.geekblue[6] }} size={iconSize} />;
    //   break;

    // case 28:
    //   link = "treasury/collector-agent";
    //   icon = (
    //     <CollectorAgentIcon style={{ color: Colors.red[6] }} size={iconSize} />
    //   );
    //   break;

    // case 29:
    //   link = "docs";
    //   icon = <DocsIcon style={{ color: Colors.purple[6] }} size={iconSize} />;
    //   break;

    default:
      break;
  }

  return { link, icon };
};

const UserLogisticMenu = () => {
  const [accessibleModules, setAccessibleModules] = useState([]);

  useMount(async () => {
    const logistic_category_id = 4;
    const accessibleModules = await modulesService.accessibleModules(
      logistic_category_id
    );

    setAccessibleModules(accessibleModules);
  });

  return (
    <CategoryMenu
      type="logistic"
      accessibleModules={accessibleModules}
      iconSize={iconSize}
      mapper={mapper}
    />
  );
};

export default UserLogisticMenu;
