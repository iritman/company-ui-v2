import React, { useState, useEffect } from "react";
import {
  MdSouthWest as ReceiveIcon,
  MdReceiptLong as ReceiptIcon,
} from "react-icons/md";
import { TbTransferIn as HandOverIcon } from "react-icons/tb";
import { GiReceiveMoney as CollectionRejectionIcon } from "react-icons/gi";
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
    case 241:
      link = "receive-requests";
      icon = <ReceiveIcon style={{ color: Colors.blue[6] }} size={iconSize} />;
      break;

    case 242:
      link = "receive-receipts";
      icon = <ReceiptIcon style={{ color: Colors.cyan[6] }} size={iconSize} />;
      break;

    case 243:
      link = "bank-hand-overs";
      icon = (
        <HandOverIcon style={{ color: Colors.purple[6] }} size={iconSize} />
      );
      break;

    case 244:
      link = "collection-rejections";
      icon = (
        <CollectionRejectionIcon
          style={{ color: Colors.orange[6] }}
          size={iconSize}
        />
      );
      break;

    default:
      break;
  }

  return { link, icon };
};

const UserTreasuryReceiveMenu = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);
  const [lastPathKey, setLastPathKey] = useState("");

  const currentLocation = useLocation();

  useMount(async () => {
    const financial_treasury_receive_id = 24;
    const accessiblePages = await modulesService.accessiblePages(
      financial_treasury_receive_id
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
      modulePathName="receive"
      lastPathKey={lastPathKey}
      accessiblePages={accessiblePages}
      iconSize={iconSize}
      mapper={mapper}
    />
  );
};

export default UserTreasuryReceiveMenu;
