import http from "../../http-service";
import configInfo from "../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint =
  apiUrl + "/official/timex/user-members-new-missions-check-manager";

async function getRole() {
  const { data } = await http.get(`${apiEndpoint}/role`);

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

async function getNewReports() {
  const { data } = await http.get(`${apiEndpoint}/reports/new`);

  return data;
}

async function saveReportResponse(response) {
  const { data } = await http.post(`${apiEndpoint}/report/response`, response);

  return data;
}

const service = {
  getRole,
  getParams,
  searchData,
  saveResponse,
  getNewReports,
  saveReportResponse,
};

export default service;
