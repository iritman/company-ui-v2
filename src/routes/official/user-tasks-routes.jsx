import React from "react";
import { Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "../../components/common/protected-route";
//---
import UserTasksDashboard from "../../components/app-modules/official/tasks/user-tasks-dashboard";
import UserTaskTags from "../../components/app-modules/official/tasks/user-tags-page";
import UserMyTasksPage from "./../../components/app-modules/official/tasks/user-my-tasks-page";
import UserMyDoneTasksPage from "./../../components/app-modules/official/tasks/user-my-done-tasks-page";
import UserEmployeesTasksPage from "./../../components/app-modules/official/tasks/user-employees-tasks-page";
import UserUnderSupervisionTasksPage from "./../../components/app-modules/official/tasks/user-under-supervisions-tasks-page";
import UserIntervalTasksPage from "../../components/app-modules/official/tasks/user-interval-tasks-page";
import UserOthersTasksPage from "../../components/app-modules/official/tasks/user-others-tasks-page";
import UserDepartmentTasksPage from "../../components/app-modules/official/tasks/user-department-tasks-page";
import UserDepartmentsTasksPage from "../../components/app-modules/official/tasks/user-departments-tasks-page";
import UserColleaguesTasksPage from "../../components/app-modules/official/tasks/user-colleagues-tasks-page";
import UserSelectedSupervisorsPage from "./../../components/app-modules/official/tasks/user-selected-supervisors-page";
import UserTopSupervisorsPage from "./../../components/app-modules/official/tasks/user-top-supervisors-page";
//---

const modulePath = "official/tasks";

const UserTasksRoutes = ({ path }) => {
  return (
    <Switch>
      <ProtectedRoute
        path={`${path}/${modulePath}`}
        exact
        component={UserTasksDashboard}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/task-tags`}
        exact
        render={() => <UserTaskTags pageName="user-TaskTags" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/my-tasks`}
        exact
        render={() => <UserMyTasksPage pageName="user-MyTasks" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/my-done-tasks`}
        exact
        render={() => <UserMyDoneTasksPage pageName="user-MyDoneTasks" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/employees-tasks`}
        exact
        render={() => <UserEmployeesTasksPage pageName="user-EmployeesTasks" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/task-supervisions`}
        exact
        render={() => (
          <UserUnderSupervisionTasksPage pageName="user-TaskSupervisions" />
        )}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/interval-tasks`}
        exact
        render={() => <UserIntervalTasksPage pageName="user-IntervalTasks" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/others-tasks`}
        exact
        render={() => <UserOthersTasksPage pageName="user-OthersTasks" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/department-tasks`}
        exact
        render={() => (
          <UserDepartmentTasksPage pageName="user-DepartmentTasks" />
        )}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/departments-tasks`}
        exact
        render={() => (
          <UserDepartmentsTasksPage pageName="user-DepartmentsTasks" />
        )}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/colleagues-tasks`}
        exact
        render={() => (
          <UserColleaguesTasksPage pageName="user-ColleaguesTasks" />
        )}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/selected-supervisors`}
        exact
        render={() => (
          <UserSelectedSupervisorsPage pageName="user-SelectedSupervisors" />
        )}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/top-supervisors`}
        exact
        render={() => <UserTopSupervisorsPage pageName="user-TopSupervisors" />}
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default UserTasksRoutes;
