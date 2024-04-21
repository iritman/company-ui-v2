import React from "react";
import { Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "../../components/common/protected-route";
//---
import UserStoreManagementDashboard from "../../components/app-modules/financial/store-management/user-store-management-dashboard";
import UserStoresPage from "../../components/app-modules/financial/store-management/user-stores-page";
import UserProductNaturesPage from "../../components/app-modules/financial/store-management/user-product-natures-page";
import UserMeasureTypesPage from "../../components/app-modules/financial/store-management/user-measure-types-page";
import UserMeasureUnitsPage from "../../components/app-modules/financial/store-management/user-measure-units-page";
import UserPricingTypesPage from "../../components/app-modules/financial/store-management/user-pricing-types-page";
import UserProductCategoriesPage from "../../components/app-modules/financial/store-management/user-product-categories-page";
import UserFeaturesPage from "../../components/app-modules/financial/store-management/user-features-page";
import UserInventoryControlAgentsPage from "../../components/app-modules/financial/store-management/inventory-control-agent/user-inventory-control-agents-page";
import UserProductsPage from "../../components/app-modules/financial/store-management/product/user-products-page";
import UserBachPatternsPage from "../../components/app-modules/financial/store-management/user-bach-patterns-page";
import UserBachesPage from "../../components/app-modules/financial/store-management/user-baches-page";
import UserStorageCentersPage from "../../components/app-modules/financial/store-management/user-storage-centers-page";
import UserGroupFeaturesPage from "../../components/app-modules/financial/store-management/user-group-features-page";
//---

const modulePath = "financial/store-mgr";

const UserStoreManagementRoutes = ({ path }) => {
  return (
    <Switch>
      <ProtectedRoute
        path={`${path}/${modulePath}`}
        exact
        component={UserStoreManagementDashboard}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/user-stores`}
        exact
        render={() => <UserStoresPage pageName="user-Stores" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/user-product-natures`}
        exact
        render={() => <UserProductNaturesPage pageName="user-ProductNatures" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/user-measure-types`}
        exact
        render={() => <UserMeasureTypesPage pageName="user-MeasureTypes" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/user-measure-units`}
        exact
        render={() => <UserMeasureUnitsPage pageName="user-MeasureUnits" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/user-pricing-types`}
        exact
        render={() => <UserPricingTypesPage pageName="user-PricingTypes" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/user-product-categories`}
        exact
        render={() => (
          <UserProductCategoriesPage pageName="user-ProductCategories" />
        )}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/user-features`}
        exact
        render={() => <UserFeaturesPage pageName="user-Features" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/user-inventory-control-agents`}
        exact
        render={() => (
          <UserInventoryControlAgentsPage pageName="user-InventoryControlAgents" />
        )}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/user-products`}
        exact
        render={() => <UserProductsPage pageName="user-Products" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/user-bach-patterns`}
        exact
        render={() => <UserBachPatternsPage pageName="user-BachPatterns" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/user-baches`}
        exact
        render={() => <UserBachesPage pageName="user-Baches" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/user-storage-centers`}
        exact
        render={() => <UserStorageCentersPage pageName="user-StorageCenters" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/user-group-features`}
        exact
        render={() => <UserGroupFeaturesPage pageName="user-GroupFeatures" />}
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default UserStoreManagementRoutes;
