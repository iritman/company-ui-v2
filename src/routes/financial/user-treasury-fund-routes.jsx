import React from "react";
import { Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "../../components/common/protected-route";
//---
import TreasuryFundDashboard from "../../components/app-modules/financial/treasury/fund/treasury-fund-dashboard";
import FundsPage from "../../components/app-modules/financial/treasury/fund/funds-page";
//---

const modulePath = "financial/treasury/fund";

const UserTreasuryReceiveRoutes = ({ path }) => {
  return (
    <Switch>
      <ProtectedRoute
        path={`${path}/${modulePath}`}
        exact
        component={TreasuryFundDashboard}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/funds`}
        exact
        render={() => <FundsPage pageName="Funds" />}
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default UserTreasuryReceiveRoutes;
