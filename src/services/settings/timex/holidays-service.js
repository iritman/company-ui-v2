import http from "../../http-service";
import configInfo from "../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint = apiUrl + "/settings/timex/holidays";

export async function getHolidays(year) {
  const { data } = await http.get(`${apiEndpoint}/days/${year}`);

  return data;
}

export async function getParams() {
  const { data } = await http.get(`${apiEndpoint}/params`);

  return data;
}

export async function setJomeHolidays(year) {
  const { data } = await http.post(`${apiEndpoint}/${year}`);

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
  getHolidays,
  getParams,
  setJomeHolidays,
  saveData,
  deleteData,
};

export default service;
