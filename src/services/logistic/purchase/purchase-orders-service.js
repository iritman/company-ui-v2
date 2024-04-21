import http from "../../http-service";
import configInfo from "../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint = apiUrl + "/logistic/purchase/purchase-orders";

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

export async function getRegedInvoices(supplierID) {
  const { data } = await http.get(`${apiEndpoint}/invoices/${supplierID}`);

  return data;
}

export async function getRegedInvoiceByID(invoiceID) {
  const { data } = await http.get(`${apiEndpoint}/invoice/${invoiceID}`);

  return data;
}

export async function getRegedCommandItems(invoiceID) {
  const { data } = await http.get(`${apiEndpoint}/command/items/${invoiceID}`);

  return data;
}

export async function getRegedCommandItemByID(itemID) {
  const { data } = await http.get(`${apiEndpoint}/command/item/${itemID}`);

  return data;
}

export async function getRegedPurchaseRequestItems() {
  const { data } = await http.get(`${apiEndpoint}/purchase-request/items`);

  return data;
}

export async function getRegedPurchaseRequestItemByID(itemID) {
  const { data } = await http.get(
    `${apiEndpoint}/purchase-request/item/${itemID}`
  );

  return data;
}

export async function getValidCommandItemsForOrder(command_id) {
  const { data } = await http.get(
    `${apiEndpoint}/command/items-for-order/${command_id}`
  );

  return data;
}

export async function getProductByID(productID) {
  const { data } = await http.get(`${apiEndpoint}/product/${productID}`);

  return data;
}

export async function searchProducts(searchText) {
  const { data } = await http.post(`${apiEndpoint}/search/products`, {
    searchText,
  });

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

export async function rejectOrder(orderID) {
  const { data } = await http.post(`${apiEndpoint}/reject/${orderID}`, {});

  return data;
}

export async function approveOrder(orderID) {
  const { data } = await http.post(`${apiEndpoint}/approve/${orderID}`, {});

  return data;
}

export async function undoApproveOrder(orderID) {
  const { data } = await http.post(
    `${apiEndpoint}/undo-approve/${orderID}`,
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
  getRegedInvoices,
  getRegedInvoiceByID,
  getRegedCommandItems,
  getRegedCommandItemByID,
  getRegedPurchaseRequestItems,
  getRegedPurchaseRequestItemByID,
  getValidCommandItemsForOrder,
  getProductByID,
  searchProducts,
  searchData,
  saveData,
  saveItem,
  rejectOrder,
  approveOrder,
  undoApproveOrder,
  deleteData,
  deleteItem,
};

export default service;
