import React from "react";
import { Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "../../components/common/protected-route";
//---
import UserEDocsDashboard from "../../components/app-modules/official/edocs/user-edocs-dashboard";
import UserFolderGroupsPage from "../../components/app-modules/official/edocs/user-folder-groups-page";
import UserFoldersPage from "../../components/app-modules/official/edocs/user-folders-page";
import UserFolderPermissionsPage from "../../components/app-modules/official/edocs/user-folder-permissions-page";
import UserLabelTagsPage from "../../components/app-modules/official/edocs/user-label-tags-page";
//---

const modulePath = "official/edocs";

const UserOrgRoutes = ({ path }) => {
  return (
    <Switch>
      <ProtectedRoute
        path={`${path}/${modulePath}`}
        exact
        component={UserEDocsDashboard}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/user-folder-groups`}
        exact
        render={() => <UserFolderGroupsPage pageName="user-FolderGroups" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/user-folders`}
        exact
        render={() => <UserFoldersPage pageName="user-Folders" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/user-folder-permissions`}
        exact
        render={() => (
          <UserFolderPermissionsPage pageName="user-FolderPermissions" />
        )}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/user-label-tags`}
        exact
        render={() => <UserLabelTagsPage pageName="user-LabelTags" />}
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default UserOrgRoutes;
