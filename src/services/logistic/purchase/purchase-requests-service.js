import http from "../../http-service";
import configInfo from "../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint = apiUrl + "/logistic/purchase/purchase-requests";

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

export async function searchMembers(searchText) {
  const { data } = await http.post(`${apiEndpoint}/search/members`, {
    searchText,
  });

  return data;
}

export async function searchMemberByID(memberID) {
  const { data } = await http.get(`${apiEndpoint}/search/member/${memberID}`);

  return data;
}

export async function searchFrontSideAccounts(typeID) {
  const { data } = await http.get(
    `${apiEndpoint}/search/front-side/type/${typeID}`
  );

  return data;
}

export async function searchFrontSideAccountByID(accountID) {
  const { data } = await http.get(
    `${apiEndpoint}/search/front-side/${accountID}`
  );

  return data;
}

export async function getRegedProductRequestItems() {
  const { data } = await http.get(`${apiEndpoint}/product-request-items`);

  return data;
}

export async function getRegedProductRequestItemByID(itemID) {
  const { data } = await http.get(
    `${apiEndpoint}/product-request-item/${itemID}`
  );

  return data;
}

export async function getNotExistsProductsForPurchase(productRequestID) {
  const { data } = await http.get(
    `${apiEndpoint}/product-request-items/not-exists/${productRequestID}`
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

export async function rejectPurchaseRequest(requestID) {
  const { data } = await http.post(`${apiEndpoint}/reject/${requestID}`, {});

  return data;
}

export async function approvePurchaseRequest(requestID) {
  const { data } = await http.post(`${apiEndpoint}/approve/${requestID}`, {});

  return data;
}

export async function undoApprovePurchaseRequest(requestID) {
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

const service = {
  getParams,
  getSearchParams,
  getItemParams,
  isReturnableRequest,
  searchMembers,
  searchMemberByID,
  searchFrontSideAccounts,
  searchFrontSideAccountByID,
  getRegedProductRequestItems,
  getRegedProductRequestItemByID,
  getNotExistsProductsForPurchase,
  searchData,
  saveData,
  saveItem,
  rejectPurchaseRequest,
  approvePurchaseRequest,
  undoApprovePurchaseRequest,
  deleteData,
  deleteItem,
};

export default service;
