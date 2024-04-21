import React, { useState, useEffect } from "react";
import {
  AiFillBank as BankIcon,
  AiOutlineBranches as BankAccountTypeIcon,
  AiFillCreditCard as CompanyBankAccountIcon,
} from "react-icons/ai";
import {
  VscTypeHierarchySub as BankBranchIcon,
  VscGithubAction as FinancialOperationIcon,
} from "react-icons/vsc";
import { HiCreditCard as BankAccountIcon } from "react-icons/hi";
import { GiBanknote as ChequeBookIcon } from "react-icons/gi";
import { RiFlowChart as CashFlowIcon } from "react-icons/ri";
import { BsChatSquareText as DescriptionIcon } from "react-icons/bs";
import {
  FaProjectDiagram as BankTypesIcon,
  FaWpforms as RegardIcon,
  FaCashRegister as CashBoxIcon,
} from "react-icons/fa";
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
    case 221:
      link = "bank-types";
      icon = (
        <BankTypesIcon style={{ color: Colors.green[6] }} size={iconSize} />
      );
      break;

    case 222:
      link = "banks";
      icon = <BankIcon style={{ color: Colors.blue[5] }} size={iconSize} />;
      break;

    case 223:
      link = "bank-branches";
      icon = (
        <BankBranchIcon style={{ color: Colors.purple[6] }} size={iconSize} />
      );
      break;

    case 224:
      link = "bank-account-types";
      icon = (
        <BankAccountTypeIcon
          style={{ color: Colors.orange[6] }}
          size={iconSize}
        />
      );
      break;

    case 225:
      link = "company-bank-accounts";
      icon = (
        <CompanyBankAccountIcon
          style={{ color: Colors.yellow[8] }}
          size={iconSize}
        />
      );
      break;

    case 226:
      link = "cheque-books";
      icon = (
        <ChequeBookIcon style={{ color: Colors.volcano[6] }} size={iconSize} />
      );
      break;

    case 227:
      link = "cash-boxes";
      icon = <CashBoxIcon style={{ color: Colors.cyan[6] }} size={iconSize} />;
      break;

    case 228:
      link = "person-company-bank-accounts";
      icon = (
        <BankAccountIcon style={{ color: Colors.red[6] }} size={iconSize} />
      );
      break;

    case 229:
      link = "financial-operations";
      icon = (
        <FinancialOperationIcon
          style={{ color: Colors.purple[5] }}
          size={iconSize}
        />
      );
      break;

    case 230:
      link = "cash-flows";
      icon = (
        <CashFlowIcon style={{ color: Colors.magenta[6] }} size={iconSize} />
      );
      break;

    case 231:
      link = "regards";
      icon = <RegardIcon style={{ color: Colors.blue[6] }} size={iconSize} />;
      break;

    case 232:
      link = "standard-descriptions";
      icon = (
        <DescriptionIcon
          style={{ color: Colors.geekblue[6] }}
          size={iconSize}
        />
      );
      break;

    default:
      break;
  }

  return { link, icon };
};

const UserTreasuryBasicInfoMenu = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);
  const [lastPathKey, setLastPathKey] = useState("");

  const currentLocation = useLocation();

  useMount(async () => {
    const financial_treasury_basic_info_id = 23;
    const accessiblePages = await modulesService.accessiblePages(
      financial_treasury_basic_info_id
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
      modulePathName="basic"
      lastPathKey={lastPathKey}
      accessiblePages={accessiblePages}
      iconSize={iconSize}
      mapper={mapper}
    />
  );
};

export default UserTreasuryBasicInfoMenu;
