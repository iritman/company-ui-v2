import http from "../../http-service";
import configInfo from "../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint = apiUrl + "/official/processes/user-financial-checkouts";

async function getParams() {
  const { data } = await http.get(`${apiEndpoint}/params`);

  return data;
}

async function searchData(filter) {
  const { data } = await http.post(`${apiEndpoint}/search`, filter);

  return data;
}

export async function saveResponse(record) {
  const { data } = await http.post(`${apiEndpoint}/response`, record);

  return data;
}

const service = {
  getParams,
  searchData,
  saveResponse,
};

export default service;
