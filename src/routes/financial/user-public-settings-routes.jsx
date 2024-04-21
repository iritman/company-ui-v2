import React from "react";
import { Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "../../components/common/protected-route";
//---
import UserPublicSettingsDashboard from "../../components/app-modules/financial/public-settings/user-public-settings-dashboard";
import ProjectsPage from "../../components/app-modules/financial/public-settings/projects-page";
import CostCenterTypesPage from "../../components/app-modules/financial/public-settings/cost-center-types-page";
import CostCentersPage from "../../components/app-modules/financial/public-settings/cost-centers-page";
import CurrenciesPage from "../../components/app-modules/financial/public-settings/currencies-page";
import CurrencyRatiosPage from "../../components/app-modules/financial/public-settings/currency-ratios-page";
import CreditSourceTypesPage from "../../components/app-modules/financial/public-settings/credit-source-types-page";
import CreditSourcesPage from "../../components/app-modules/financial/public-settings/credit-sources-page";
//---

const modulePath = "financial/public-settings";

const UserPublicSettingsRoutes = ({ path }) => {
  return (
    <Switch>
      <ProtectedRoute
        path={`${path}/${modulePath}`}
        exact
        component={UserPublicSettingsDashboard}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/projects`}
        exact
        render={() => <ProjectsPage pageName="Projects" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/cost-center-types`}
        exact
        render={() => <CostCenterTypesPage pageName="CostCenterTypes" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/cost-centers`}
        exact
        render={() => <CostCentersPage pageName="CostCenters" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/currencies`}
        exact
        render={() => <CurrenciesPage pageName="Currencies" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/currency-ratios`}
        exact
        render={() => <CurrencyRatiosPage pageName="CurrencyRatios" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/credit-source-types`}
        exact
        render={() => <CreditSourceTypesPage pageName="CreditSourceTypes" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/credit-sources`}
        exact
        render={() => <CreditSourcesPage pageName="CreditSources" />}
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default UserPublicSettingsRoutes;
