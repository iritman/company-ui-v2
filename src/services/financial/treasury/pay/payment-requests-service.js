import http from "../../../http-service";
import configInfo from "../../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint = apiUrl + "/financial/treasury/pay/payment-requests";

export async function getParams() {
  const { data } = await http.get(`${apiEndpoint}/params`);

  return data;
}

export async function searchFrontSideAccounts(searchText) {
  const { data } = await http.post(`${apiEndpoint}/accounts`, { searchText });

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

export async function saveItem(record) {
  const { data } = await http.post(`${apiEndpoint}/item`, record);

  return data;
}

export async function rejectPaymentRequest(requestID) {
  const { data } = await http.post(`${apiEndpoint}/reject/${requestID}`, {});

  return data;
}

export async function approvePaymentRequest(requestID) {
  const { data } = await http.post(`${apiEndpoint}/approve/${requestID}`, {});

  return data;
}

export async function deleteData(recordID) {
  const { data } = await http.delete(`${apiEndpoint}/${recordID}`);

  return data;
}

export async function deleteItem(recordID) {
  const { data } = await http.delete(`${apiEndpoint}/item/${recordID}`);

  return data;
}

const service = {
  getParams,
  searchFrontSideAccounts,
  searchData,
  saveData,
  saveItem,
  rejectPaymentRequest,
  approvePaymentRequest,
  deleteData,
  deleteItem,
};

export default service;
