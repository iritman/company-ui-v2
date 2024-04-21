import React from "react";
import { Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "../../components/common/protected-route";
//---
import CeremonyDashboard from "../../components/app-modules/settings/ceremony/ceremony-dashboard";
import ClientTypesPage from "../../components/app-modules/settings/ceremony/client-types-page";
import SessionLocationsPage from "../../components/app-modules/settings/ceremony/session-locations-page";
//---

const modulePath = "settings/ceremony";

const CeremonyRoutes = ({ path }) => {
  return (
    <Switch>
      <ProtectedRoute
        path={`${path}/${modulePath}`}
        exact
        component={CeremonyDashboard}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/client-types`}
        exact
        render={() => <ClientTypesPage pageName="ClientTypes" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/session-locations`}
        exact
        render={() => <SessionLocationsPage pageName="SessionLocations" />}
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default CeremonyRoutes;
