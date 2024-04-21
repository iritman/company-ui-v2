import http from "../../http-service";
import configInfo from "../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint = apiUrl + "/settings/timex/work-shifts";

async function getParams() {
  const { data } = await http.get(`${apiEndpoint}/params`);

  return data;
}

async function repeatWorkShift(repeat_config) {
  const { data } = await http.post(`${apiEndpoint}/repeat`, repeat_config);

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

export async function deleteWorkShifts(delete_config) {
  const { data } = await http.post(`${apiEndpoint}/delete`, delete_config);

  return data;
}

const service = {
  getParams,
  repeatWorkShift,
  searchData,
  saveData,
  deleteData,
  deleteWorkShifts,
};

export default service;
