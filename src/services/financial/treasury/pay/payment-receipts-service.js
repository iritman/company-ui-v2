import http from "../../../http-service";
import configInfo from "../../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint = apiUrl + "/financial/treasury/pay/payment-receipts";

export async function getParams() {
  const { data } = await http.get(`${apiEndpoint}/params`);

  return data;
}

export async function getItemsParams() {
  const { data } = await http.get(`${apiEndpoint}/items/params`);

  return data;
}

export async function searchFrontSideAccounts(searchText) {
  const { data } = await http.post(`${apiEndpoint}/accounts`, { searchText });

  return data;
}

export async function searchFrontSideAccountByID(accountID) {
  const { data } = await http.get(`${apiEndpoint}/account/${accountID}`);

  return data;
}

export async function searchPaymentRequestByID(requestID) {
  const { data } = await http.get(`${apiEndpoint}/request/${requestID}`);

  return data;
}

export async function searchData(filter) {
  const { data } = await http.post(`${apiEndpoint}/search`, filter);

  return data;
}

export async function searchOrders() {
  const { data } = await http.get(`${apiEndpoint}/search/orders`);

  return data;
}

export async function getWhiteCompanyCheques(companyBankAccountID) {
  const { data } = await http.get(
    `${apiEndpoint}/company-cheques/white/${companyBankAccountID}`
  );

  return data;
}

export async function getReceivedChequesForTransferToOthers(cashBoxID) {
  const { data } = await http.get(
    `${apiEndpoint}/received-cheques/transfer-to-others/${cashBoxID}`
  );

  return data;
}

export async function getReceivedChequeForTransferToOthersByID(chequeID) {
  const { data } = await http.get(
    `${apiEndpoint}/received-cheque/transfer-to-others/${chequeID}`
  );

  return data;
}

export async function getReceivedChequesForRefund(
  cashBoxID,
  frontSideAccountID
) {
  const { data } = await http.get(
    `${apiEndpoint}/received-cheques/refund/${cashBoxID}/${frontSideAccountID}`
  );

  return data;
}

export async function getReceivedChequeForRefundByID(chequeID) {
  const { data } = await http.get(
    `${apiEndpoint}/received-cheque/refund/${chequeID}`
  );

  return data;
}

export async function getReceivedDemandsForRefund(
  cashBoxID,
  frontSideAccountID
) {
  const { data } = await http.get(
    `${apiEndpoint}/received-demands/refund/${cashBoxID}/${frontSideAccountID}`
  );

  return data;
}

export async function getReceivedDemandForRefundByID(demandID) {
  const { data } = await http.get(
    `${apiEndpoint}/received-demand/refund/${demandID}`
  );

  return data;
}

export async function saveData(record) {
  const { data } = await http.post(`${apiEndpoint}`, record);

  return data;
}

export async function saveItem(itemType, record) {
  const { data } = await http.post(`${apiEndpoint}/item/${itemType}`, record);

  return data;
}

export async function rejectOrder(orderID) {
  const { data } = await http.post(`${apiEndpoint}/reject/${orderID}`, {});

  return data;
}

export async function approveOrder(orderID) {
  const { data } = await http.post(`${apiEndpoint}/approve/${orderID}`, {});

  return data;
}

export async function deleteData(recordID) {
  const { data } = await http.delete(`${apiEndpoint}/${recordID}`);

  return data;
}

export async function deleteItem(itemType, recordID) {
  const { data } = await http.delete(`${apiEndpoint}/${itemType}/${recordID}`);

  return data;
}

const service = {
  getParams,
  getItemsParams,
  searchFrontSideAccounts,
  searchFrontSideAccountByID,
  searchPaymentRequestByID,
  searchData,
  searchOrders,
  getWhiteCompanyCheques,
  getReceivedChequesForTransferToOthers,
  getReceivedChequeForTransferToOthersByID,
  getReceivedChequesForRefund,
  getReceivedChequeForRefundByID,
  getReceivedDemandsForRefund,
  getReceivedDemandForRefundByID,
  saveData,
  saveItem,
  rejectOrder,
  approveOrder,
  deleteData,
  deleteItem,
};

export default service;
