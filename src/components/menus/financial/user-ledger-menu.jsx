import React, { useState, useEffect } from "react";
import { FaProjectDiagram as DocTypesIcon } from "react-icons/fa";
import {
  MdAvTimer as FinancialPeriodsIcon,
  MdOutlineCollectionsBookmark as LedgersIcon,
} from "react-icons/md";
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
    case 210:
      link = "financial-periods";
      icon = (
        <FinancialPeriodsIcon
          style={{ color: Colors.purple[6] }}
          size={iconSize}
        />
      );
      break;

    case 211:
      link = "ledgers";
      icon = (
        <LedgersIcon style={{ color: Colors.orange[6] }} size={iconSize} />
      );
      break;

    case 212:
      link = "doc-types";
      icon = (
        <DocTypesIcon style={{ color: Colors.green[6] }} size={iconSize} />
      );
      break;

    default:
      break;
  }

  return { link, icon };
};

const UserLedgerMenu = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);
  const [lastPathKey, setLastPathKey] = useState("");

  const currentLocation = useLocation();

  useMount(async () => {
    const financial_ledger_module_id = 22;
    const accessiblePages = await modulesService.accessiblePages(
      financial_ledger_module_id
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
      modulePathName="ledger"
      lastPathKey={lastPathKey}
      accessiblePages={accessiblePages}
      iconSize={iconSize}
      mapper={mapper}
    />
  );
};

export default UserLedgerMenu;
