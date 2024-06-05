import http from "../../http-service";
import configInfo from "../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint = apiUrl + "/financial/store-opr/product-requests";

export async function getParams() {
  const { data } = await http.get(`${apiEndpoint}/params`);

  return data;
}

export async function getItemParams() {
  const { data } = await http.get(`${apiEndpoint}/item/params`);

  return data;
}

export async function getRequestItems(requestID) {
  const { data } = await http.get(`${apiEndpoint}/items/${requestID}`);

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

export async function searchProducts(searchText) {
  const { data } = await http.post(`${apiEndpoint}/search/products`, {
    searchText,
  });

  return data;
}

export async function searchProductByID(productID) {
  const { data } = await http.get(`${apiEndpoint}/search/product/${productID}`);

  return data;
}

export async function searchFrontSideAccounts(typeID) {
  const { data } = await http.get(
    `${apiEndpoint}/search/front-side/by-type/${typeID}`
  );

  return data;
}

export async function searchFrontSideAccountByID(accountID) {
  const { data } = await http.get(
    `${apiEndpoint}/search/front-side/by-id/${accountID}`
  );

  return data;
}

export async function getNextStep(requestID) {
  const { data } = await http.get(`${apiEndpoint}/next-step/${requestID}`);

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

export async function regFeedback(feedback) {
  const { data } = await http.post(`${apiEndpoint}/feedback`, feedback);

  return data;
}

export async function rejectProductRequest(requestID) {
  const { data } = await http.post(`${apiEndpoint}/reject/${requestID}`, {});

  return data;
}

export async function approveProductRequest(requestID) {
  const { data } = await http.post(`${apiEndpoint}/approve/${requestID}`, {});

  return data;
}

export async function undoApproveProductRequest(requestID) {
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

const service = {
  getParams,
  getItemParams,
  getRequestItems,
  isReturnableRequest,
  searchMembers,
  searchMemberByID,
  searchProducts,
  searchProductByID,
  searchFrontSideAccounts,
  searchFrontSideAccountByID,
  getNextStep,
  searchData,
  saveData,
  regFeedback,
  rejectProductRequest,
  approveProductRequest,
  undoApproveProductRequest,
  deleteData,
};

export default service;
