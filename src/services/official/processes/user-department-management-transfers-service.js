import http from "../../http-service";
import configInfo from "../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint =
  apiUrl + "/official/processes/user-department-mgr-transfers";

async function getParams() {
  const { data } = await http.get(`${apiEndpoint}/params`);

  return data;
}

async function searchData(filter) {
  const { data } = await http.post(`${apiEndpoint}/search`, filter);

  return data;
}

async function seenTransfer(transferID) {
  const { data } = await http.post(`${apiEndpoint}/seen/${transferID}`, {});

  return data;
}

const service = {
  getParams,
  searchData,
  seenTransfer,
};

export default service;
