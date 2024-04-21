import React from "react";
import { Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "../components/common/protected-route";
import MainDashboard from "../pages/main-dashboard";
//---
import SettingsRoutes from "./settings/settings-routes";
import UserOfficialRoutes from "./official/user-official-routes";
import UserFinancialRoutes from "./financial/user-financial-routes";
import UserLogisticRoutes from "./logistic/user-logistic-routes";
//---
import UserProfileRoutes from "./user-account/user-account-routes";
//---

const PageRoutes = ({ path }) => {
  return (
    <Switch>
      <ProtectedRoute path={`${path}/`} exact component={MainDashboard} />
      <ProtectedRoute
        path={`${path}/settings`}
        render={() => <SettingsRoutes path={path} />}
      />
      <ProtectedRoute
        path={`${path}/official`}
        render={() => <UserOfficialRoutes path={path} />}
      />
      <ProtectedRoute
        path={`${path}/financial`}
        render={() => <UserFinancialRoutes path={path} />}
      />
      <ProtectedRoute
        path={`${path}/logistic`}
        render={() => <UserLogisticRoutes path={path} />}
      />
      <ProtectedRoute
        path={`${path}/account`}
        render={() => <UserProfileRoutes path={path} />}
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default PageRoutes;
