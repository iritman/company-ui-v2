import http from "../../http-service";
import configInfo from "../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint = apiUrl + "/official/timex/user-members-extra-work-requests";

async function getParams() {
  const { data } = await http.get(`${apiEndpoint}/params`);

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

async function deleteData(recordID) {
  const { data } = await http.delete(`${apiEndpoint}/${recordID}`);

  return data;
}

const service = {
  getParams,
  searchData,
  saveData,
  deleteData,
};

export default service;
