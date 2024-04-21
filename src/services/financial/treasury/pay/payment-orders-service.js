import http from "../../../http-service";
import configInfo from "../../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint = apiUrl + "/financial/treasury/pay/payment-orders";

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
  saveData,
  saveItem,
  rejectOrder,
  approveOrder,
  deleteData,
  deleteItem,
};

export default service;
