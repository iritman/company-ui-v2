import http from "../../http-service";
import configInfo from "../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint =
  apiUrl + "/official/processes/user-official-check-violations";

async function getParams() {
  const { data } = await http.get(`${apiEndpoint}/params`);

  return data;
}

async function searchData(filter) {
  const { data } = await http.post(`${apiEndpoint}/search`, filter);

  return data;
}

export async function saveData(record) {
  const { data } = await http.post(`${apiEndpoint}/response`, record);

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

export async function saveAnnounce(record) {
  const { data } = await http.post(`${apiEndpoint}/announce`, record);

  return data;
}

export async function deleteAnnounce(recordID) {
  const { data } = await http.delete(`${apiEndpoint}/announce/${recordID}`);

  return data;
}

const service = {
  getParams,
  searchData,
  saveData,
  saveReport,
  deleteReport,
  saveAnnounce,
  deleteAnnounce,
};

export default service;
