import React, { useState, useEffect } from "react";
import {
  MdNorthEast as PaymentIcon,
  MdReceiptLong as ReceiptIcon,
} from "react-icons/md";
import { FaReceipt as PayReceiptIcon } from "react-icons/fa";
import { useMount } from "react-use";
import modulesService from "../../../services/app/modules-service";
import Colors from "../../../resources/colors";
import { useLocation } from "react-router-dom";
import ModuleMenu from "./../module-menu";
import Words from "../../../resources/words";

const iconSize = 20;

const mapper = (pageID) => {
  let link = "";
  let icon = null;

  switch (pageID) {
    case 270:
      link = "payment-requests";
      icon = (
        <PaymentIcon style={{ color: Colors.orange[6] }} size={iconSize} />
      );
      break;

    case 271:
      link = "payment-orders";
      icon = <ReceiptIcon style={{ color: Colors.cyan[6] }} size={iconSize} />;
      break;

    case 272:
      link = "payment-receipts";
      icon = (
        <PayReceiptIcon style={{ color: Colors.purple[6] }} size={iconSize} />
      );
      break;

    // case 244:
    //   link = "collection-rejection";
    //   icon = (
    //     <CollectionRejectionIcon
    //       style={{ color: Colors.orange[6] }}
    //       size={iconSize}
    //     />
    //   );
    //   break;

    default:
      break;
  }

  return { link, icon };
};

const UserTreasuryPaymentMenu = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);
  const [lastPathKey, setLastPathKey] = useState("");

  const currentLocation = useLocation();

  useMount(async () => {
    const financial_treasury_payment_id = 25;
    const accessiblePages = await modulesService.accessiblePages(
      financial_treasury_payment_id
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
      type="financial"
      typeTitle={Words.financial}
      modulePathName="pay"
      lastPathKey={lastPathKey}
      accessiblePages={accessiblePages}
      iconSize={iconSize}
      mapper={mapper}
    />
  );
};

export default UserTreasuryPaymentMenu;
