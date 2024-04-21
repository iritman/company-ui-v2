import React from "react";
import { Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "../../components/common/protected-route";
//---
import UserAnnouncesDashboard from "../../components/app-modules/official/announces/user-announces-dashboard";
import UserAnnouncesPage from "../../components/app-modules/official/announces/user-announces-page";
import UserMyAnnouncesPage from "../../components/app-modules/official/announces/user-my-announces-page";
import UserNewAnnouncesPage from "../../components/app-modules/official/announces/user-new-announces-page";
import UserArchivedAnnouncesPage from "../../components/app-modules/official/announces/user-archived-announces-page";
//---

const modulePath = "official/announces";

const UserOrgRoutes = ({ path }) => {
  return (
    <Switch>
      <ProtectedRoute
        path={`${path}/${modulePath}`}
        exact
        component={UserAnnouncesDashboard}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/all-announces`}
        exact
        render={() => <UserAnnouncesPage pageName="user-AllAnnounces" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/my-announces`}
        exact
        render={() => <UserMyAnnouncesPage pageName="user-MyAnnounces" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/new-announces`}
        exact
        render={() => <UserNewAnnouncesPage pageName="user-NewAnnounces" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/archived-announces`}
        exact
        render={() => (
          <UserArchivedAnnouncesPage pageName="user-ArchivedAnnounces" />
        )}
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default UserOrgRoutes;
