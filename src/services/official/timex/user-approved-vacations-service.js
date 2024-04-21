import http from "../../http-service";
import configInfo from "../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint = apiUrl + "/official/timex/user-approved-vacations";

async function getCurrentDate() {
  const { data } = await http.get(`${apiEndpoint}/current-date`);

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

const service = {
  getCurrentDate,
  getParams,
  searchData,
};

export default service;
