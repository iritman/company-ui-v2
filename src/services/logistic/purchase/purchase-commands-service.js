import http from "../../http-service";
import configInfo from "../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint = apiUrl + "/logistic/purchase/purchase-commands";

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

export async function isReturnableCommand(commandID) {
  const { data } = await http.get(`${apiEndpoint}/is-returnable/${commandID}`);

  return data;
}

export async function getRegedInvoiceItems() {
  const { data } = await http.get(`${apiEndpoint}/invoice/items`);

  return data;
}

export async function getRegedInvoiceItemByID(itemID) {
  const { data } = await http.get(`${apiEndpoint}/invoice/item/${itemID}`);

  return data;
}

export async function getValidInvoiceItemsForPurchaseCommand(invoiceID) {
  const { data } = await http.get(
    `${apiEndpoint}/invoice/items-for-purchase-command/${invoiceID}`
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

export async function rejectCommand(commandID) {
  const { data } = await http.post(`${apiEndpoint}/reject/${commandID}`, {});

  return data;
}

export async function approveCommand(commandID) {
  const { data } = await http.post(`${apiEndpoint}/approve/${commandID}`, {});

  return data;
}

export async function undoApproveCommand(commandID) {
  const { data } = await http.post(
    `${apiEndpoint}/undo-approve/${commandID}`,
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
  isReturnableCommand,
  getRegedInvoiceItems,
  getRegedInvoiceItemByID,
  getValidInvoiceItemsForPurchaseCommand,
  searchData,
  saveData,
  saveItem,
  rejectCommand,
  approveCommand,
  undoApproveCommand,
  deleteData,
  deleteItem,
};

export default service;
