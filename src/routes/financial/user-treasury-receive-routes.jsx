import React from "react";
import { Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "../../components/common/protected-route";
//---
import TreasuryReceiveDashboard from "../../components/app-modules/financial/treasury/receive/treasury-receive-dashboard";
import ReceiveRequestsPage from "../../components/app-modules/financial/treasury/receive/receive-request/receive-requests-page";
import ReceiveReceiptsPage from "../../components/app-modules/financial/treasury/receive/receive-receipt/receive-receipts-page";
import BankHandOversPage from "../../components/app-modules/financial/treasury/receive/bank-hand-over/bank-hand-overs-page";
import CollectionRejectionsPage from "../../components/app-modules/financial/treasury/receive/collection-rejection/collection-rejections-page";
//---

const modulePath = "financial/treasury/receive";

const UserTreasuryReceiveRoutes = ({ path }) => {
  return (
    <Switch>
      <ProtectedRoute
        path={`${path}/${modulePath}`}
        exact
        component={TreasuryReceiveDashboard}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/receive-requests`}
        exact
        render={() => <ReceiveRequestsPage pageName="ReceiveRequests" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/receive-receipts`}
        exact
        render={() => <ReceiveReceiptsPage pageName="ReceiveReceipts" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/bank-hand-overs`}
        exact
        render={() => <BankHandOversPage pageName="BankHandOvers" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/collection-rejections`}
        exact
        render={() => (
          <CollectionRejectionsPage pageName="CollectionRejections" />
        )}
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default UserTreasuryReceiveRoutes;
