import http from "../../http-service";
import configInfo from "../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint = apiUrl + "/logistic/basic-info/suppliers";

async function searchTafsilAccounts(searchText) {
  const { data } = await http.get(
    `${apiEndpoint}/tafsil-accounts/${searchText}`
  );

  return data;
}

async function getAllData() {
  const { data } = await http.get(`${apiEndpoint}`);

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

export async function saveData(record) {
  const { data } = await http.post(`${apiEndpoint}`, record);

  return data;
}

export async function deleteData(recordID) {
  const { data } = await http.delete(`${apiEndpoint}/${recordID}`);

  return data;
}

const service = {
  searchTafsilAccounts,
  getAllData,
  getParams,
  searchData,
  saveData,
  deleteData,
};

export default service;
