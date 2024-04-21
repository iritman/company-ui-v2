import React from "react";
import { Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "../../components/common/protected-route";
//---
import LedgerDashboard from "../../components/app-modules/financial/ledger/ledger-dashboard";
import FinancialPeriodsPage from "../../components/app-modules/financial/ledger/financial-periods-page";
import LedgersPage from "../../components/app-modules/financial/ledger/ledgers-page";
import DocTypesPage from "../../components/app-modules/financial/ledger/doc-types-page";
//---

const modulePath = "financial/ledger";

const UserLedgerRoutes = ({ path }) => {
  return (
    <Switch>
      <ProtectedRoute
        path={`${path}/${modulePath}`}
        exact
        component={LedgerDashboard}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/financial-periods`}
        exact
        render={() => <FinancialPeriodsPage pageName="FinancialPeriods" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/ledgers`}
        exact
        render={() => <LedgersPage pageName="Ledgers" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/doc-types`}
        exact
        render={() => <DocTypesPage pageName="DocTypes" />}
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default UserLedgerRoutes;
