import http from "../../../http-service";
import configInfo from "../../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint =
  apiUrl + "/financial/treasury/collector-agent/collector-agent-refunds";

export async function getParams() {
  const { data } = await http.get(`${apiEndpoint}/params`);

  return data;
}

export async function getCheques(agentID) {
  const { data } = await http.get(`${apiEndpoint}/cheques/${agentID}`);

  return data;
}

export async function searchData(filter) {
  const { data } = await http.post(`${apiEndpoint}/search`, filter);

  return data;
}

export async function getChequeByID(chequeID) {
  const { data } = await http.get(`${apiEndpoint}/cheque/${chequeID}`);

  return data;
}

export async function saveData(record) {
  const { data } = await http.post(`${apiEndpoint}`, record);

  return data;
}

export async function saveItem(record) {
  const { data } = await http.post(`${apiEndpoint}/item/cheque`, record);

  return data;
}

export async function reject(refundID) {
  const { data } = await http.post(`${apiEndpoint}/reject/${refundID}`, {});

  return data;
}

export async function approve(refundID) {
  const { data } = await http.post(`${apiEndpoint}/approve/${refundID}`, {});

  return data;
}

export async function undoApprove(refundID) {
  const { data } = await http.post(
    `${apiEndpoint}/undo-approve/${refundID}`,
    {}
  );

  return data;
}

export async function deleteData(recordID) {
  const { data } = await http.delete(`${apiEndpoint}/${recordID}`);

  return data;
}

export async function deleteItem(recordID) {
  const { data } = await http.delete(`${apiEndpoint}/cheque/${recordID}`);

  return data;
}

const service = {
  getParams,
  getCheques,
  searchData,
  getChequeByID,
  saveData,
  saveItem,
  reject,
  approve,
  undoApprove,
  deleteData,
  deleteItem,
};

export default service;
