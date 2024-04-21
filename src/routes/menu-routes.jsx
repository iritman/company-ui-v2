import React from "react";
import { Switch } from "react-router-dom";
import ProtectedRoute from "../components/common/protected-route";
import MainMenu from "../components/menus/main-menu";
//---
import AccountMenu from "../components/menus/user-account/user-account-menu";
//---
import SettingsMenu from "../components/menus/settings/settings-menu";
import AccessesMenu from "../components/menus/settings/accesses-menu";
import BasicInfoMenu from "../components/menus/settings/basic-info-menu";
import OrgMenu from "../components/menus/settings/org-menu";
import TimexMenu from "../components/menus/settings/timex-menu";
import TransmissionMenu from "../components/menus/settings/transmission-menu";
import CeremonyMenu from "../components/menus/settings/ceremony-menu";
//---
import UserOfficialMenu from "../components/menus/official/user-official-menu";
import UserOrgMenu from "../components/menus/official/user-org-menu";
import UserTimexMenu from "../components/menus/official/user-timex-menu";
import UserTransmissionMenu from "../components/menus/official/user-transmission-menu";
import UserTasksMenu from "../components/menus/official/user-tasks-menu";
import UserProcessesMenu from "../components/menus/official/user-processes-menu";
import UserEDocsMenu from "../components/menus/official/user-edocs-menu";
//---
import UserAnnouncesMenu from "../components/menus/official/user-announces-menu";
//---
import UserFinancialMenu from "../components/menus/financial/user-financial-menu";
import UserPublicSettingsMenu from "../components/menus/financial/user-public-settings-menu";
import UserStoreManagementMenu from "../components/menus/financial/user-store-management-menu";
import UserStoreOperationsMenu from "../components/menus/financial/user-store-operations-menu";
import UserAccountsMenu from "../components/menus/financial/user-accounts-menu";
import UserLedgerMenu from "../components/menus/financial/user-ledger-menu";
import UserTreasuryBasicInfoMenu from "../components/menus/financial/user-treasury-basic-info-menu";
import UserTreasuryPaymentMenu from "../components/menus/financial/user-treasury-payment-menu";
import UserTreasuryReceiveMenu from "../components/menus/financial/user-treasury-receive-menu";
import UserTreasuryFundMenu from "../components/menus/financial/user-treasury-fund-menu";
import UserTreasuryCollectorAgentMenu from "../components/menus/financial/user-treasury-collector-agent-menu";
//---
import UserFinancialDocsMenu from "../components/menus/financial/user-financial-docs-menu";
//---
import UserLogisticMenu from "../components/menus/logistic/user-logistic-menu";
import UserLogisticBasicInfoMenu from "../components/menus/logistic/user-logistic-basic-info-menu";
import UserLogisticPurchaseMenu from "../components/menus/logistic/user-logistic-purchase-menu";
//---

const MenuRoutes = ({ path }) => {
  return (
    <Switch>
      <ProtectedRoute path={`${path}/account`} component={AccountMenu} />
      {/* ----------- */}
      <ProtectedRoute
        path={`${path}/settings`}
        exact
        component={SettingsMenu}
      />
      <ProtectedRoute
        path={`${path}/settings/accesses`}
        component={AccessesMenu}
      />
      <ProtectedRoute
        path={`${path}/settings/basic-info`}
        component={BasicInfoMenu}
      />
      <ProtectedRoute path={`${path}/settings/org`} component={OrgMenu} />
      <ProtectedRoute path={`${path}/settings/timex`} component={TimexMenu} />
      <ProtectedRoute
        path={`${path}/settings/transmission`}
        component={TransmissionMenu}
      />
      <ProtectedRoute
        path={`${path}/settings/ceremony`}
        component={CeremonyMenu}
      />
      {/* ----------- */}
      <ProtectedRoute
        path={`${path}/official`}
        exact
        component={UserOfficialMenu}
      />
      <ProtectedRoute path={`${path}/official/org`} component={UserOrgMenu} />
      <ProtectedRoute
        path={`${path}/official/timex`}
        component={UserTimexMenu}
      />
      <ProtectedRoute
        path={`${path}/official/transmission`}
        component={UserTransmissionMenu}
      />
      <ProtectedRoute
        path={`${path}/official/tasks`}
        component={UserTasksMenu}
      />
      <ProtectedRoute
        path={`${path}/official/processes`}
        component={UserProcessesMenu}
      />
      <ProtectedRoute
        path={`${path}/official/edocs`}
        component={UserEDocsMenu}
      />
      <ProtectedRoute
        path={`${path}/official/announces`}
        component={UserAnnouncesMenu}
      />
      {/* ----------- */}
      <ProtectedRoute
        path={`${path}/financial`}
        exact
        component={UserFinancialMenu}
      />
      <ProtectedRoute
        path={`${path}/financial/public-settings`}
        component={UserPublicSettingsMenu}
      />
      <ProtectedRoute
        path={`${path}/financial/store-mgr`}
        component={UserStoreManagementMenu}
      />
      <ProtectedRoute
        path={`${path}/financial/store-opr`}
        component={UserStoreOperationsMenu}
      />
      <ProtectedRoute
        path={`${path}/financial/accounts`}
        component={UserAccountsMenu}
      />
      <ProtectedRoute
        path={`${path}/financial/ledger`}
        component={UserLedgerMenu}
      />
      <ProtectedRoute
        path={`${path}/financial/treasury/basic`}
        component={UserTreasuryBasicInfoMenu}
      />
      <ProtectedRoute
        path={`${path}/financial/treasury/pay`}
        component={UserTreasuryPaymentMenu}
      />
      <ProtectedRoute
        path={`${path}/financial/treasury/receive`}
        component={UserTreasuryReceiveMenu}
      />
      <ProtectedRoute
        path={`${path}/financial/treasury/fund`}
        component={UserTreasuryFundMenu}
      />
      <ProtectedRoute
        path={`${path}/financial/treasury/collector-agent`}
        component={UserTreasuryCollectorAgentMenu}
      />
      {/* ----------- */}
      <ProtectedRoute
        path={`${path}/financial/docs`}
        component={UserFinancialDocsMenu}
      />
      {/* ----------- */}
      <ProtectedRoute
        path={`${path}/logistic`}
        exact
        component={UserLogisticMenu}
      />
      <ProtectedRoute
        path={`${path}/logistic/basic-info`}
        component={UserLogisticBasicInfoMenu}
      />
      <ProtectedRoute
        path={`${path}/logistic/purchase`}
        component={UserLogisticPurchaseMenu}
      />
      {/* ----------- */}
      <ProtectedRoute path={`${path}/`} exact component={MainMenu} />
    </Switch>
  );
};

export default MenuRoutes;
