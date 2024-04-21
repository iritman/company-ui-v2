import React from "react";
import { Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "../../components/common/protected-route";
//---
import TreasuryCollectorAgentDashboard from "../../components/app-modules/financial/treasury/collector-agent/treasury-collector-agent-dashboard";
import CollectorAgentsPage from "../../components/app-modules/financial/treasury/collector-agent/agents/collector-agents-page";
import TransferToCollectorAgentsPage from "../../components/app-modules/financial/treasury/collector-agent/transfer-to-agent/transfer-to-collector-agents-page";
import CollectorAgentMakeCashesPage from "../../components/app-modules/financial/treasury/collector-agent/make-cashes/collector-agent-make-cashes-page";
import CollectorAgentRefundsPage from "../../components/app-modules/financial/treasury/collector-agent/refund-to-cash-box/collector-agent-refunds-page";
import CollectorAgentRejectionsPage from "../../components/app-modules/financial/treasury/collector-agent/rejections/collector-agent-rejections-page";
//---

const modulePath = "financial/treasury/collector-agent";

const UserTreasuryReceiveRoutes = ({ path }) => {
  return (
    <Switch>
      <ProtectedRoute
        path={`${path}/${modulePath}`}
        exact
        component={TreasuryCollectorAgentDashboard}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/collector-agents`}
        exact
        render={() => <CollectorAgentsPage pageName="CollectorAgents" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/transfer-to-collector-agents`}
        exact
        render={() => (
          <TransferToCollectorAgentsPage pageName="TransferToCollectorAgents" />
        )}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/collector-agent-make-cashes`}
        exact
        render={() => (
          <CollectorAgentMakeCashesPage pageName="CollectorAgentMakeCashes" />
        )}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/collector-agent-refunds`}
        exact
        render={() => (
          <CollectorAgentRefundsPage pageName="CollectorAgentRefunds" />
        )}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/collector-agent-rejections`}
        exact
        render={() => (
          <CollectorAgentRejectionsPage pageName="CollectorAgentRejections" />
        )}
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default UserTreasuryReceiveRoutes;
