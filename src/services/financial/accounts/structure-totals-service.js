import http from "../../http-service";
import configInfo from "../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint = apiUrl + "/financial/accounts/structure-totals";

export async function getParams() {
  const { data } = await http.get(`${apiEndpoint}/params`);

  return data;
}

export async function getNewCode(groupID) {
  const { data } = await http.get(`${apiEndpoint}/new-code/${groupID}`);

  return data;
}

export async function getAllData(groupID) {
  const { data } = await http.get(`${apiEndpoint}/${groupID}`);

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
  getParams,
  getNewCode,
  getAllData,
  saveData,
  deleteData,
};

export default service;
