import http from "../../http-service";
import configInfo from "../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint = apiUrl + "/logistic/basic-info/purchasing-agents";

async function searchEmployees(searchText) {
  const { data } = await http.get(`${apiEndpoint}/employees/${searchText}`);

  return data;
}

async function getAllData() {
  const { data } = await http.get(`${apiEndpoint}`);

  return data;
}

async function searchData(searchText) {
  const { data } = await http.post(`${apiEndpoint}/search`, { searchText });

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
  searchEmployees,
  getAllData,
  searchData,
  saveData,
  deleteData,
};

export default service;
