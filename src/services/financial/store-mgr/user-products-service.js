import http from "../../http-service";
import configInfo from "../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint = apiUrl + "/financial/store-mgr/user-products";

export async function getParams() {
  const { data } = await http.get(`${apiEndpoint}/params`);

  return data;
}

export async function getAllData() {
  const { data } = await http.get(`${apiEndpoint}`);

  return data;
}

export async function searchData(filter) {
  const { data } = await http.post(`${apiEndpoint}/search`, filter);

  return data;
}

export async function saveData(record) {
  const { data } = await http.post(`${apiEndpoint}`, record);

  return data;
}

export async function saveFeature(record) {
  const { data } = await http.post(`${apiEndpoint}/feature`, record);

  return data;
}

export async function saveMeasureUnit(record) {
  const { data } = await http.post(`${apiEndpoint}/measure-unit`, record);

  return data;
}

export async function saveMeasureConvert(record) {
  const { data } = await http.post(`${apiEndpoint}/measure-convert`, record);

  return data;
}

export async function saveStore(record) {
  const { data } = await http.post(`${apiEndpoint}/store`, record);

  return data;
}

export async function saveInventoryControlAgent(record) {
  const { data } = await http.post(
    `${apiEndpoint}/inventory-control-agent`,
    record
  );

  return data;
}

export async function deleteData(recordID) {
  const { data } = await http.delete(`${apiEndpoint}/${recordID}`);

  return data;
}

export async function deleteFeature(recordID) {
  const { data } = await http.delete(`${apiEndpoint}/feature/${recordID}`);

  return data;
}

export async function deleteMeasureUnit(recordID) {
  const { data } = await http.delete(`${apiEndpoint}/measure-unit/${recordID}`);

  return data;
}

export async function deleteMeasureConvert(recordID) {
  const { data } = await http.delete(
    `${apiEndpoint}/measure-convert/${recordID}`
  );

  return data;
}

export async function deleteStore(recordID) {
  const { data } = await http.delete(`${apiEndpoint}/store/${recordID}`);

  return data;
}

export async function deleteInventoryControlAgent(recordID) {
  const { data } = await http.delete(
    `${apiEndpoint}/inventory-control-agent/${recordID}`
  );

  return data;
}

const service = {
  getParams,
  getAllData,
  searchData,
  saveData,
  deleteData,
  //------
  saveFeature,
  deleteFeature,
  saveMeasureUnit,
  deleteMeasureUnit,
  saveMeasureConvert,
  deleteMeasureConvert,
  saveStore,
  deleteStore,
  saveInventoryControlAgent,
  deleteInventoryControlAgent,
};

export default service;
