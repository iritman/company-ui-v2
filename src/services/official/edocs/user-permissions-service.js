import http from "../../http-service";
import configInfo from "../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint = apiUrl + "/official/edocs/user-permissions";

async function getParams(levelTypeID, levelID) {
  const { data } = await http.get(
    `${apiEndpoint}/params/${levelTypeID}/${levelID}`
  );

  return data;
}

async function searchData(levelTypeID, levelID) {
  const { data } = await http.get(
    `${apiEndpoint}/search/${levelTypeID}/${levelID}`
  );

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
  searchData,
  saveData,
  deleteData,
};

export default service;
