import React from "react";
import { Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "../../components/common/protected-route";
import UserFinancialDashboard from "../../components/app-modules/financial/user-financial-dashboard";
import UserPublicSettingsRoutes from "./user-public-settings-routes";
import UserStoreManagementRoutes from "./user-store-management-routes";
import UserStoreOperationsRoutes from "./user-store-operations-routes";
import UserAccountsRoutes from "./user-accounts-routes";
import UserLedgerRoutes from "./user-ledger-routes";
import UserTreasuryBasicInfoRoutes from "./user-treasury-basic-info-routes";
import UserTreasuryPaymentRoutes from "./user-treasury-payment-routes";
import UserTreasuryReceiveRoutes from "./user-treasury-receive-routes";
import UserTreasuryCollectorAgentRoutes from "./user-treasury-collector-agent-routes";
import UserTreasuryFundRoutes from "./user-treasury-fund-routes";
import UserFinancialDocsRoutes from "./user-financial-docs-routes";
//---

const UserFinancialRoutes = ({ path }) => {
  return (
    <Switch>
      <ProtectedRoute
        path={`${path}/financial`}
        exact
        component={UserFinancialDashboard}
      />
      <ProtectedRoute
        path={`${path}/financial/public-settings`}
        render={() => <UserPublicSettingsRoutes path={path} />}
      />
      <ProtectedRoute
        path={`${path}/financial/store-mgr`}
        render={() => <UserStoreManagementRoutes path={path} />}
      />
      <ProtectedRoute
        path={`${path}/financial/store-opr`}
        render={() => <UserStoreOperationsRoutes path={path} />}
      />
      <ProtectedRoute
        path={`${path}/financial/accounts`}
        render={() => <UserAccountsRoutes path={path} />}
      />
      <ProtectedRoute
        path={`${path}/financial/ledger`}
        render={() => <UserLedgerRoutes path={path} />}
      />
      <ProtectedRoute
        path={`${path}/financial/treasury/basic`}
        render={() => <UserTreasuryBasicInfoRoutes path={path} />}
      />
      <ProtectedRoute
        path={`${path}/financial/treasury/pay`}
        render={() => <UserTreasuryPaymentRoutes path={path} />}
      />
      <ProtectedRoute
        path={`${path}/financial/treasury/receive`}
        render={() => <UserTreasuryReceiveRoutes path={path} />}
      />
      <ProtectedRoute
        path={`${path}/financial/treasury/collector-agent`}
        render={() => <UserTreasuryCollectorAgentRoutes path={path} />}
      />
      <ProtectedRoute
        path={`${path}/financial/treasury/fund`}
        render={() => <UserTreasuryFundRoutes path={path} />}
      />
      <ProtectedRoute
        path={`${path}/financial/docs`}
        render={() => <UserFinancialDocsRoutes path={path} />}
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default UserFinancialRoutes;
