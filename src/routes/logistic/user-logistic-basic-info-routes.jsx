import React from "react";
import { Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "../../components/common/protected-route";
//---
import BasicInfoDashboard from "../../components/app-modules/logistic/basic-info/logistic-basic-info-dashboard";
import PurchasingAgentsPage from "../../components/app-modules/logistic/basic-info/purchasing-agents/purchasing-agents-page";
import PurchasingAdminsPage from "../../components/app-modules/logistic/basic-info/purchasing-admins/purchasing-admins-page";
import SuppliersPage from "../../components/app-modules/logistic/basic-info/suppliers/suppliers-page";
import SupplierActivityTypesPage from "../../components/app-modules/logistic/basic-info/supplier-activity-types/supplier-activity-types-page";
import ServiceGroupsPage from "../../components/app-modules/logistic/basic-info/service-groups/service-groups-page";
import PurchasingServicesPage from "../../components/app-modules/logistic/basic-info/purchasing-services/purchasing-services-page";

//---

const modulePath = "logistic/basic-info";

const UserLogisticBasicInfoRoutes = ({ path }) => {
  return (
    <Switch>
      <ProtectedRoute
        path={`${path}/${modulePath}`}
        exact
        component={BasicInfoDashboard}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/purchasing-agents`}
        exact
        render={() => <PurchasingAgentsPage pageName="PurchasingAgents" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/purchasing-admins`}
        exact
        render={() => <PurchasingAdminsPage pageName="PurchasingAdmins" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/suppliers`}
        exact
        render={() => <SuppliersPage pageName="Suppliers" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/supplier-activity-types`}
        exact
        render={() => (
          <SupplierActivityTypesPage pageName="SupplierActivityTypes" />
        )}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/service-groups`}
        exact
        render={() => <ServiceGroupsPage pageName="ServiceGroups" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/purchasing-services`}
        exact
        render={() => <PurchasingServicesPage pageName="PurchasingServices" />}
      />

      <Redirect to="/not-found" />
    </Switch>
  );
};

export default UserLogisticBasicInfoRoutes;
