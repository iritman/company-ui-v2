import http from "../../../http-service";
import configInfo from "../../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint =
  apiUrl + "/financial/treasury/receive/collection-rejections";

export async function getParams() {
  const { data } = await http.get(`${apiEndpoint}/params`);

  return data;
}

export async function getItemsParams() {
  const { data } = await http.get(`${apiEndpoint}/items/params`);

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

export async function saveItem(itemType, record) {
  const { data } = await http.post(`${apiEndpoint}/item/${itemType}`, record);

  return data;
}

export async function reject(collection_rejection_id) {
  const { data } = await http.post(
    `${apiEndpoint}/reject/${collection_rejection_id}`,
    {}
  );

  return data;
}

export async function approve(collection_rejection_id) {
  const { data } = await http.post(
    `${apiEndpoint}/approve/${collection_rejection_id}`,
    {}
  );

  return data;
}

export async function undoApprove(collection_rejection_id) {
  const { data } = await http.post(
    `${apiEndpoint}/undo-approve/${collection_rejection_id}`,
    {}
  );

  return data;
}

export async function submitVoucher(collection_rejection_id) {
  const { data } = await http.post(
    `${apiEndpoint}/submit-voucher/${collection_rejection_id}`,
    {}
  );

  return data;
}

export async function deleteVoucher(collection_rejection_id) {
  const { data } = await http.delete(
    `${apiEndpoint}/delete-voucher/${collection_rejection_id}`
  );

  return data;
}

export async function viewVoucher(voucherID) {
  const { data } = await http.get(`${apiEndpoint}/view-voucher/${voucherID}`);

  return data;
}

export async function deleteData(recordID) {
  const { data } = await http.delete(`${apiEndpoint}/${recordID}`);

  return data;
}

export async function deleteItem(itemType, recordID) {
  const { data } = await http.delete(`${apiEndpoint}/${itemType}/${recordID}`);

  return data;
}

export async function getCheques(companyBankAccountID) {
  const { data } = await http.get(
    `${apiEndpoint}/cheques/${companyBankAccountID}`
  );

  return data;
}

export async function getDemands(companyBankAccountID) {
  const { data } = await http.get(
    `${apiEndpoint}/demands/${companyBankAccountID}`
  );

  return data;
}

const service = {
  getParams,
  getItemsParams,
  searchData,
  saveData,
  saveItem,
  reject,
  approve,
  undoApprove,
  submitVoucher,
  deleteVoucher,
  viewVoucher,
  deleteData,
  deleteItem,
  getCheques,
  getDemands,
};

export default service;
