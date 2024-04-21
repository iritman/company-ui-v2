import React from "react";
import { Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "../../components/common/protected-route";
//---
import AccountsDashboard from "../../components/app-modules/financial/accounts/accounts-dashboard";
import TafsilTypesPage from "../../components/app-modules/financial/accounts/tafsil-types-page";
import TafsilAccountsPage from "../../components/app-modules/financial/accounts/tafsil-accounts-page";
import AccountStructuresPage from "../../components/app-modules/financial/accounts/account-structures-page";
//---

const modulePath = "financial/accounts";

const UserPublicSettingsRoutes = ({ path }) => {
  return (
    <Switch>
      <ProtectedRoute
        path={`${path}/${modulePath}`}
        exact
        component={AccountsDashboard}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/tafsil-types`}
        exact
        render={() => <TafsilTypesPage pageName="TafsilTypes" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/tafsil-accounts`}
        exact
        render={() => <TafsilAccountsPage pageName="TafsilAccounts" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/account-structures`}
        exact
        render={() => <AccountStructuresPage pageName="AccountStructures" />}
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default UserPublicSettingsRoutes;
