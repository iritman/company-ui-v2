import http from "../../http-service";
import configInfo from "../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint = apiUrl + "/logistic/purchase/inquiry-requests";

export async function getParams() {
  const { data } = await http.get(`${apiEndpoint}/params`);

  return data;
}

export async function getSearchParams() {
  const { data } = await http.get(`${apiEndpoint}/search/params`);

  return data;
}

export async function getItemParams() {
  const { data } = await http.get(`${apiEndpoint}/item/params`);

  return data;
}

export async function isReturnableRequest(requestID) {
  const { data } = await http.get(`${apiEndpoint}/is-returnable/${requestID}`);

  return data;
}

export async function getSupplierParams() {
  const { data } = await http.get(`${apiEndpoint}/supplier/params`);

  return data;
}

export async function getRegedPurchaseItems() {
  const { data } = await http.get(`${apiEndpoint}/purchase/items`);

  return data;
}

export async function getRegedPurchaseItemByID(itemID) {
  const { data } = await http.get(`${apiEndpoint}/purchase/item/${itemID}`);

  return data;
}

export async function getValidPurchaseItemsForInquiry(purchase_request_id) {
  const { data } = await http.get(
    `${apiEndpoint}/purchase/items-for-inquiry/${purchase_request_id}`
  );

  return data;
}

export async function isReturnableInquiry(requestID) {
  const { data } = await http.get(`${apiEndpoint}/is-returnable/${requestID}`);

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

export async function saveSupplier(record) {
  const { data } = await http.post(`${apiEndpoint}/supplier`, record);

  return data;
}

export async function rejectInquiryRequest(requestID) {
  const { data } = await http.post(`${apiEndpoint}/reject/${requestID}`, {});

  return data;
}

export async function approveInquiryRequest(requestID) {
  const { data } = await http.post(`${apiEndpoint}/approve/${requestID}`, {});

  return data;
}

export async function undoApproveInquiryRequest(requestID) {
  const { data } = await http.post(
    `${apiEndpoint}/undo-approve/${requestID}`,
    {}
  );

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

export async function deleteSupplier(recordID) {
  const { data } = await http.delete(`${apiEndpoint}/supplier/${recordID}`);

  return data;
}

const service = {
  getParams,
  getSearchParams,
  getItemParams,
  isReturnableRequest,
  getSupplierParams,
  getRegedPurchaseItems,
  getRegedPurchaseItemByID,
  getValidPurchaseItemsForInquiry,
  searchData,
  saveData,
  saveItem,
  saveSupplier,
  rejectInquiryRequest,
  approveInquiryRequest,
  undoApproveInquiryRequest,
  deleteData,
  deleteItem,
  deleteSupplier,
};

export default service;
