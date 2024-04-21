import React from "react";
import { Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "../../components/common/protected-route";
//---
import OrgDashboard from "../../components/app-modules/settings/org/org-dashboard";
import RolesPage from "../../components/app-modules/settings/org/roles-page";
import DepartmentsPage from "../../components/app-modules/settings/org/departments-page";
import CompaniesPage from "../../components/app-modules/settings/org/companies-page";
import MembersPage from "../../components/app-modules/settings/org/members-page";
import EmployeesPage from "../../components/app-modules/settings/org/employees-page";
import CompanyAgentsPage from "../../components/app-modules/settings/org/company-agents-page";
import OrgChartPage from "../../components/app-modules/settings/org/org-chart-page";
import DutyLevelsPage from "../../components/app-modules/settings/org/duty-levels-page";
import PersonalDutiesPage from "../../components/app-modules/settings/org/personal-duties-page";
import RoleDutiesPage from "../../components/app-modules/settings/org/role-duties-page";
import BankAccountsPage from "../../components/app-modules/settings/org/bank-accounts-page";
import StoreExpertsPage from "../../components/app-modules/settings/org/store-experts-page";
import InformaticExpertsPage from "../../components/app-modules/settings/org/informatic-experts-page";
import FinancialExpertsPage from "../../components/app-modules/settings/org/financial-experts-page";
import CeremonyExpertsPage from "../../components/app-modules/settings/org/ceremony-experts-page";
//---

const modulePath = "settings/org";

const OrgRoutes = ({ path }) => {
  return (
    <Switch>
      <ProtectedRoute
        path={`${path}/${modulePath}`}
        exact
        component={OrgDashboard}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/roles`}
        exact
        render={() => <RolesPage pageName="Roles" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/departments`}
        exact
        render={() => <DepartmentsPage pageName="Departments" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/companies`}
        exact
        render={() => <CompaniesPage pageName="Companies" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/members`}
        exact
        render={() => <MembersPage pageName="Members" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/employees`}
        exact
        render={() => <EmployeesPage pageName="Employees" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/company-agents`}
        exact
        render={() => <CompanyAgentsPage pageName="CompanyAgents" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/org-chart`}
        exact
        render={() => <OrgChartPage pageName="OrgChart" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/duty-levels`}
        exact
        render={() => <DutyLevelsPage pageName="DutyLevels" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/personal-duties`}
        exact
        render={() => <PersonalDutiesPage pageName="PersonalDuties" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/role-duties`}
        exact
        render={() => <RoleDutiesPage pageName="RoleDuties" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/bank-accounts`}
        exact
        render={() => <BankAccountsPage pageName="BankAccounts" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/store-experts`}
        exact
        render={() => <StoreExpertsPage pageName="StoreExperts" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/informatic-experts`}
        exact
        render={() => <InformaticExpertsPage pageName="InformaticExperts" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/financial-experts`}
        exact
        render={() => <FinancialExpertsPage pageName="FinancialExperts" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/ceremony-experts`}
        exact
        render={() => <CeremonyExpertsPage pageName="CeremonyExperts" />}
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default OrgRoutes;
