import http from "../../http-service";
import configInfo from "../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint = apiUrl + "/logistic/purchase/invoices";

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

export async function isReturnableInvoice(invoiceID) {
  const { data } = await http.get(`${apiEndpoint}/is-returnable/${invoiceID}`);

  return data;
}

export async function getRegedInquiryItems(supplierID) {
  const { data } = await http.get(`${apiEndpoint}/inquiry/items/${supplierID}`);

  return data;
}

export async function getRegedInquiryItemByID(itemID) {
  const { data } = await http.get(`${apiEndpoint}/inquiry/item/${itemID}`);

  return data;
}

export async function getValidInquiryItemsForInvoice(inquiry_request_id) {
  const { data } = await http.get(
    `${apiEndpoint}/inquiry/items-for-invoice/${inquiry_request_id}`
  );

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

export async function rejectInvoice(invoiceID) {
  const { data } = await http.post(`${apiEndpoint}/reject/${invoiceID}`, {});

  return data;
}

export async function approveInvoice(invoiceID) {
  const { data } = await http.post(`${apiEndpoint}/approve/${invoiceID}`, {});

  return data;
}

export async function undoApproveInvoice(invoiceID) {
  const { data } = await http.post(
    `${apiEndpoint}/undo-approve/${invoiceID}`,
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

const service = {
  getParams,
  getSearchParams,
  getItemParams,
  isReturnableInvoice,
  getRegedInquiryItems,
  getRegedInquiryItemByID,
  getValidInquiryItemsForInvoice,
  searchData,
  saveData,
  saveItem,
  rejectInvoice,
  approveInvoice,
  undoApproveInvoice,
  deleteData,
  deleteItem,
};

export default service;
