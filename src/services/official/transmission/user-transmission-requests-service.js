import http from "../../http-service";
import configInfo from "../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint =
  apiUrl + "/official/transmission/user-transmission-requests";

async function getResponseParams() {
  const { data } = await http.get(`${apiEndpoint}/params/response`);

  return data;
}

async function getNewRequestsCount() {
  const { data } = await http.get(`${apiEndpoint}/new/count`);

  return data;
}

async function getParams() {
  const { data } = await http.get(`${apiEndpoint}/params`);

  return data;
}

async function searchData(filter) {
  const { data } = await http.post(`${apiEndpoint}/search`, filter);

  return data;
}

async function saveResponse(response) {
  const { data } = await http.post(`${apiEndpoint}/response`, response);

  return data;
}

const service = {
  getResponseParams,
  getNewRequestsCount,
  getParams,
  searchData,
  saveResponse,
};

export default service;
