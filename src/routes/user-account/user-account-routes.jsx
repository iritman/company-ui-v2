import React from "react";
import { Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "../../components/common/protected-route";
import AccountDashboard from "../../components/app-modules/user-account/user-account-dashboard";
//---
import ProfilePage from "../../components/app-modules/user-account/user-profile-page";
import ChangePasswordPage from "../../components/app-modules/user-account/user-change-password-page";
//---

const UserAccountRoutes = ({ path }) => {
  return (
    <Switch>
      <ProtectedRoute
        path={`${path}/account`}
        exact
        component={AccountDashboard}
      />
      <ProtectedRoute
        path={`${path}/account/profile`}
        exact
        component={ProfilePage}
      />
      <ProtectedRoute
        path={`${path}/account/change-password`}
        exact
        component={ChangePasswordPage}
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default UserAccountRoutes;
