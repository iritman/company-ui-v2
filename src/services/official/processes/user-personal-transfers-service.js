import http from "../../http-service";
import configInfo from "../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint = apiUrl + "/official/processes/user-personal-transfers";

async function getParams() {
  const { data } = await http.get(`${apiEndpoint}/params`);

  return data;
}

async function getTransferFiles(transferID) {
  const { data } = await http.get(`${apiEndpoint}/files/${transferID}`);

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

export async function saveResponse(record) {
  const { data } = await http.post(`${apiEndpoint}/response`, record);

  return data;
}

const service = {
  getParams,
  getTransferFiles,
  searchData,
  saveData,
  deleteData,
  saveResponse,
};

export default service;
