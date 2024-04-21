import React from "react";
import { Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "../../components/common/protected-route";
//---
import StoreOperationsDashboard from "../../components/app-modules/financial/store-operations/store-operations-dashboard";
import ProductRequestsPage from "../../components/app-modules/financial/store-operations/product-requests/ProductRequestsPage";
import ProductRequestItemsPage from "../../components/app-modules/financial/store-operations/product-request-items/product-request-items-page";
//---

const modulePath = "financial/store-opr";

const UserStoreOperationsRoutes = ({ path }) => {
  return (
    <Switch>
      <ProtectedRoute
        path={`${path}/${modulePath}`}
        exact
        component={StoreOperationsDashboard}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/product-requests`}
        exact
        render={() => <ProductRequestsPage pageName="ProductRequests" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/product-request-items`}
        exact
        render={() => (
          <ProductRequestItemsPage pageName="ProductRequestItems" />
        )}
      />
      {/*<ProtectedRoute
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
      /> */}
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default UserStoreOperationsRoutes;
