import React from "react";
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import Words from "../../resources/words";

const BreadcrumbMap = ({ location }) => {
  const breadcrumbNameMap = {
    "/home": Words.dashboard,
    //---
    "/home/account": Words.user_account,
    //---
    "/home/settings": Words.admin_panel,
    "/home/settings/accesses": Words.accesses,
    "/home/settings/basic-info": Words.basic_settings,
    "/home/settings/org": Words.org_structure,
    "/home/settings/timex": Words.timex_settings,
    "/home/settings/transmission": Words.transmission,
    "/home/settings/ceremony": Words.ceremony_requests,
    //---
    "/home/official": Words.official,
    "/home/official/org": Words.org_structure,
    "/home/official/timex": Words.timex,
    "/home/official/transmission": Words.transmission,
    "/home/official/tasks": Words.tasks,
    "/home/official/processes": Words.processes,
    "/home/official/edocs": Words.edocs,
    "/home/official/announces": Words.announces,
    //---
    "/home/financial": Words.financial,
    "/home/financial/store-mgr": Words.store_basic_info,
    "/home/financial/store-opr": Words.store_operations,
    "/home/financial/public-settings": Words.public_settings,
    "/home/financial/ledger": Words.ledger,
    "/home/financial/treasury/basic": Words.treasury_basic_info,
    "/home/financial/treasury/pay": Words.treasury_payment,
    "/home/financial/treasury/receive": Words.treasury_receive,
    "/home/financial/treasury/fund": Words.fund,
    "/home/financial/treasury/collector-agent": Words.collector_agent,
    //---
    "/home/logistic": Words.logistic,
    "/home/logistic/basic-info": Words.logistic_basic_info,
    "/home/logistic/purchase": Words.logistic_purchase_operation,
    //---
    "/home/financial/accounts": Words.accounts,
    //---
    "/home/financial/docs": Words.financial_docs,
  };

  const pathSnippets = location.pathname.split("/").filter((i) => i);

  const getBreadcrumbItems = () => {
    let breadcrumbItems = [];

    pathSnippets.forEach((p, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;

      if (breadcrumbNameMap[url]) {
        breadcrumbItems = [
          ...breadcrumbItems,
          { title: <Link to={url}>{breadcrumbNameMap[url]}</Link> },
        ];
      }
    });

    return breadcrumbItems;
  };

  return (
    <Breadcrumb
      style={{
        marginTop: 16,
        marginLeft: 16,
        marginRight: 16,
        overflow: "initial",
      }}
      items={getBreadcrumbItems()}
    />
  );
};

export default BreadcrumbMap;
