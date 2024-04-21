import React, { useState, useEffect } from "react";
import {
  MdOutlineRequestQuote as PurchaseRequestIcon,
  MdPriceCheck as InquiryRequestIcon,
  MdReceiptLong as PurchaseCommandIcon,
  MdListAlt as PurchaseOrderIcon,
} from "react-icons/md";
import { TbTruckDelivery as DeliveryIcon } from "react-icons/tb";
import { FaFileInvoiceDollar as InvoiceIcon } from "react-icons/fa";
import { RiToolsFill as ServiceRequestIcon } from "react-icons/ri";
import { useMount } from "react-use";
import modulesService from "../../../services/app/modules-service";
import Colors from "../../../resources/colors";
import { useLocation } from "react-router-dom";
import ModuleMenu from "../module-menu";
import Words from "../../../resources/words";

const iconSize = 20;

const mapper = (pageID) => {
  let link = "";
  let icon = null;

  switch (pageID) {
    case 306:
      link = "purchase-requests";
      icon = (
        <PurchaseRequestIcon
          style={{ color: Colors.purple[6] }}
          size={iconSize}
        />
      );
      break;

    case 307:
      link = "service-requests";
      icon = (
        <ServiceRequestIcon
          style={{ color: Colors.geekblue[6] }}
          size={iconSize}
        />
      );
      break;

    case 308:
      link = "inquiry-requests";
      icon = (
        <InquiryRequestIcon
          style={{ color: Colors.orange[6] }}
          size={iconSize}
        />
      );
      break;

    case 309:
      link = "invoices";
      icon = <InvoiceIcon style={{ color: Colors.green[6] }} size={iconSize} />;
      break;

    case 310:
      link = "purchase-commands";
      icon = (
        <PurchaseCommandIcon
          style={{ color: Colors.volcano[6] }}
          size={iconSize}
        />
      );
      break;

    case 311:
      link = "purchase-orders";
      icon = (
        <PurchaseOrderIcon style={{ color: Colors.cyan[6] }} size={iconSize} />
      );
      break;

    case 312:
      link = "purchase-deliveries";
      icon = (
        <DeliveryIcon style={{ color: Colors.magenta[6] }} size={iconSize} />
      );
      break;

    default:
      break;
  }

  return { link, icon };
};

const UserLogisticBasicInfoMenu = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);
  const [lastPathKey, setLastPathKey] = useState("");

  const currentLocation = useLocation();

  useMount(async () => {
    const logistic_purchase_module_id = 32;
    const accessiblePages = await modulesService.accessiblePages(
      logistic_purchase_module_id
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
      type="logistic"
      typeTitle={Words.logistic}
      modulePathName="purchase"
      lastPathKey={lastPathKey}
      accessiblePages={accessiblePages}
      iconSize={iconSize}
      mapper={mapper}
    />
  );
};

export default UserLogisticBasicInfoMenu;
