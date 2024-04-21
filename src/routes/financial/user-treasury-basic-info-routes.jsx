import React from "react";
import { Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "../../components/common/protected-route";
//---
import TreasuryBasicInfoDashboard from "../../components/app-modules/financial/treasury/basic-info/treasury-basic-info-dashboard";
import BankTypesPage from "../../components/app-modules/financial/treasury/basic-info/bank-types-page";
import BanksPage from "../../components/app-modules/financial/treasury/basic-info/banks-page";
import BankAccountTypesPage from "../../components/app-modules/financial/treasury/basic-info/bank-account-types-page";
import BankBranchesPage from "../../components/app-modules/financial/treasury/basic-info/bank-branches-page";
import RegardsPage from "../../components/app-modules/financial/treasury/basic-info/regards-page";
import PersonCompanyBankAccountsPage from "../../components/app-modules/financial/treasury/basic-info/pc-bank-accounts-page";
import CompanyBankAccountsPage from "../../components/app-modules/financial/treasury/basic-info/company-bank-accounts-page";
import CashBoxesPage from "../../components/app-modules/financial/treasury/basic-info/cash-boxes-page";
import ChequeBooksPage from "../../components/app-modules/financial/treasury/basic-info/cheque-books-page";
import CashFlowsPage from "../../components/app-modules/financial/treasury/basic-info/cash-flows-page";
import FinancialOperationsPage from "../../components/app-modules/financial/treasury/basic-info/financial-operations-page";
import StandardDescriptionsPage from "../../components/app-modules/financial/treasury/basic-info/standard-descriptions-page";
//---

const modulePath = "financial/treasury/basic";

const UserTreasuryBasicInfoRoutes = ({ path }) => {
  return (
    <Switch>
      <ProtectedRoute
        path={`${path}/${modulePath}`}
        exact
        component={TreasuryBasicInfoDashboard}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/bank-types`}
        exact
        render={() => <BankTypesPage pageName="BankTypes" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/banks`}
        exact
        render={() => <BanksPage pageName="Banks" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/bank-account-types`}
        exact
        render={() => <BankAccountTypesPage pageName="BankAccountTypes" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/bank-branches`}
        exact
        render={() => <BankBranchesPage pageName="BankBranches" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/regards`}
        exact
        render={() => <RegardsPage pageName="Regards" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/person-company-bank-accounts`}
        exact
        render={() => (
          <PersonCompanyBankAccountsPage pageName="PersonCompanyBankAccounts" />
        )}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/company-bank-accounts`}
        exact
        render={() => (
          <CompanyBankAccountsPage pageName="CompanyBankAccounts" />
        )}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/cash-boxes`}
        exact
        render={() => <CashBoxesPage pageName="CashBoxes" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/cheque-books`}
        exact
        render={() => <ChequeBooksPage pageName="ChequeBooks" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/cash-flows`}
        exact
        render={() => <CashFlowsPage pageName="CashFlows" />}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/financial-operations`}
        exact
        render={() => (
          <FinancialOperationsPage pageName="FinancialOperations" />
        )}
      />
      <ProtectedRoute
        path={`${path}/${modulePath}/standard-descriptions`}
        exact
        render={() => (
          <StandardDescriptionsPage pageName="StandardDescriptions" />
        )}
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default UserTreasuryBasicInfoRoutes;
