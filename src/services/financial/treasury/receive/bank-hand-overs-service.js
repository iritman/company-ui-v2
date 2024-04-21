import http from "../../../http-service";
import configInfo from "../../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint = apiUrl + "/financial/treasury/receive/bank-hand-overs";

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

export async function reject(handOverID) {
  const { data } = await http.post(`${apiEndpoint}/reject/${handOverID}`, {});

  return data;
}

export async function approve(handOverID) {
  const { data } = await http.post(`${apiEndpoint}/approve/${handOverID}`, {});

  return data;
}

export async function undoApprove(handOverID) {
  const { data } = await http.post(
    `${apiEndpoint}/undo-approve/${handOverID}`,
    {}
  );

  return data;
}

export async function submitVoucher(handOverID) {
  const { data } = await http.post(
    `${apiEndpoint}/submit-voucher/${handOverID}`,
    {}
  );

  return data;
}

export async function deleteVoucher(handOverID) {
  const { data } = await http.delete(
    `${apiEndpoint}/delete-voucher/${handOverID}`
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

export async function getCheques(company_bank_account_id) {
  const { data } = await http.get(
    `${apiEndpoint}/cheques/${company_bank_account_id}`
  );

  return data;
}

export async function getDemands(company_bank_account_id) {
  const { data } = await http.get(
    `${apiEndpoint}/demands/${company_bank_account_id}`
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
