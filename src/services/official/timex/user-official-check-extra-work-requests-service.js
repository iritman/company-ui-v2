import http from "../../http-service";
import configInfo from "../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint =
  apiUrl + "/official/timex/user-official-check-extra-work-requests";

async function getParams() {
  const { data } = await http.get(`${apiEndpoint}/params`);

  return data;
}

async function getExtraWorkCapacity(requestID) {
  const { data } = await http.get(`${apiEndpoint}/capacity/${requestID}`);

  return data;
}

async function searchData(filter) {
  const { data } = await http.post(`${apiEndpoint}/search`, filter);

  return data;
}

async function saveData(record) {
  record.Employees = JSON.stringify(record.Employees);

  const { data } = await http.post(`${apiEndpoint}`, record);

  return data;
}

const service = {
  getParams,
  getExtraWorkCapacity,
  searchData,
  saveData,
};

export default service;
