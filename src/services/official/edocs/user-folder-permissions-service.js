import http from "../../http-service";
import configInfo from "../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint = apiUrl + "/official/edocs/user-folder-permissions";

async function getParams() {
  const { data } = await http.get(`${apiEndpoint}/params`);

  return data;
}

async function getAllData() {
  const { data } = await http.get(`${apiEndpoint}`);

  return data;
}

async function getEmployeeFolderPermissions(memberID) {
  const { data } = await http.get(`${apiEndpoint}/permissions/${memberID}`);

  return data;
}

async function searchData(searchText) {
  const { data } = await http.post(`${apiEndpoint}/search`, { searchText });

  return data;
}

async function saveData(record) {
  const { data } = await http.post(`${apiEndpoint}`, record);

  return data;
}

async function deleteData(recordID) {
  const { data } = await http.delete(`${apiEndpoint}/${recordID}`);

  return data;
}

const service = {
  getParams,
  getAllData,
  getEmployeeFolderPermissions,
  searchData,
  saveData,
  deleteData,
};

export default service;
