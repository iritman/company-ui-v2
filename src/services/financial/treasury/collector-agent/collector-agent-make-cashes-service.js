import http from "../../../http-service";
import configInfo from "../../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint =
  apiUrl + "/financial/treasury/collector-agent/collector-agent-make-cashes";

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

export async function submitReceiveReceipt(operationID) {
  const { data } = await http.post(
    `${apiEndpoint}/submit-receive-receipt/${operationID}`,
    {}
  );

  return data;
}

/*

export async function reject(transferID) {
  const { data } = await http.post(`${apiEndpoint}/reject/${transferID}`, {});

  return data;
}

export async function approve(transferID) {
  const { data } = await http.post(`${apiEndpoint}/approve/${transferID}`, {});

  return data;
}

export async function undoApprove(transferID) {
  const { data } = await http.post(
    `${apiEndpoint}/undo-approve/${transferID}`,
    {}
  );

  return data;
}

*/

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
  submitReceiveReceipt,
  // reject,
  // approve,
  // undoApprove,
  deleteData,
  deleteItem,
};

export default service;
