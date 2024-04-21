import http from "../../http-service";
import configInfo from "../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint = apiUrl + "/financial/store-opr/product-request-items";

export async function getSearchParams() {
  const { data } = await http.get(`${apiEndpoint}/search/params`);

  return data;
}

export async function searchMembers(searchText) {
  const { data } = await http.post(`${apiEndpoint}/search/members`, {
    searchText,
  });

  return data;
}

export async function searchTafsilAccounts(searchText) {
  const { data } = await http.post(`${apiEndpoint}/search/tafsil-accounts`, {
    searchText,
  });

  return data;
}

export async function searchData(filter) {
  const { data } = await http.post(`${apiEndpoint}/search`, filter);

  return data;
}

export async function getInfo(itemID) {
  const { data } = await http.get(`${apiEndpoint}/info/${itemID}`);

  return data;
}

const service = {
  getSearchParams,
  searchMembers,
  searchTafsilAccounts,
  searchData,
  getInfo,
};

export default service;
