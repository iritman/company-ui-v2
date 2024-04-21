import http from "../../http-service";
import configInfo from "../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint = apiUrl + "/financial/ledger/ledgers";

export async function getAllData() {
  const { data } = await http.get(`${apiEndpoint}`);

  return data;
}

export async function searchData(searchText) {
  const { data } = await http.post(`${apiEndpoint}/search`, { searchText });

  return data;
}

export async function saveData(record) {
  const { data } = await http.post(`${apiEndpoint}`, record);

  return data;
}

export async function saveFinancialYear(record) {
  const { data } = await http.post(`${apiEndpoint}/financial-year`, record);

  return data;
}

export async function deleteData(recordID) {
  const { data } = await http.delete(`${apiEndpoint}/${recordID}`);

  return data;
}

export async function deleteFinancialYear(recordID) {
  const { data } = await http.delete(
    `${apiEndpoint}/financial-year/${recordID}`
  );

  return data;
}

const service = {
  getAllData,
  searchData,
  saveData,
  saveFinancialYear,
  deleteData,
  deleteFinancialYear,
};

export default service;
