import http from "../../http-service";
import configInfo from "../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint = apiUrl + "/official/timex/user-members-vacations";

async function getParams() {
  const { data } = await http.get(`${apiEndpoint}/params`);

  return data;
}

async function searchData(filter) {
  const { data } = await http.post(`${apiEndpoint}/search`, filter);

  return data;
}

const service = {
  getParams,
  searchData,
};

export default service;
