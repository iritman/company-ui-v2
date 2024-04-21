import http from "../../http-service";
import configInfo from "../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint = apiUrl + "/logistic/purchase/service-requests";

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
  const { data } = await http.get(`${apiEndpoint}/search/front-side/${typeID}`);

  return data;
}

export async function searchFrontSideAccountByID(accountID) {
  const { data } = await http.get(
    `${apiEndpoint}/search/front-side/${accountID}`
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

export async function rejectServiceRequest(requestID) {
  const { data } = await http.post(`${apiEndpoint}/reject/${requestID}`, {});

  return data;
}

export async function approveServiceRequest(requestID) {
  const { data } = await http.post(`${apiEndpoint}/approve/${requestID}`, {});

  return data;
}

export async function undoApproveServiceRequest(requestID) {
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
  searchMembers,
  searchMemberByID,
  searchFrontSideAccounts,
  searchFrontSideAccountByID,
  searchData,
  saveData,
  saveItem,
  rejectServiceRequest,
  approveServiceRequest,
  undoApproveServiceRequest,
  deleteData,
  deleteItem,
};

export default service;
