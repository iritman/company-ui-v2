import http from "../../http-service";
import configInfo from "../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint = apiUrl + "/official/tasks/user-departments-tasks";

export async function getParams() {
  const { data } = await http.get(`${apiEndpoint}/params`);

  return data;
}

export async function searchData(filter) {
  const { data } = await http.post(`${apiEndpoint}/search`, filter);

  return data;
}

export async function saveReport(record) {
  const { data } = await http.post(`${apiEndpoint}/report`, record);

  return data;
}

export async function deleteReport(recordID) {
  const { data } = await http.delete(`${apiEndpoint}/report/${recordID}`);

  return data;
}

export async function makeReportsSeen(taskID) {
  const { data } = await http.post(`${apiEndpoint}/report/seen/${taskID}`, {});

  return data;
}

const service = {
  getParams,
  searchData,
  saveReport,
  deleteReport,
  makeReportsSeen,
};

export default service;
