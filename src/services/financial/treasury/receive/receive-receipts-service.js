import http from "../../../http-service";
import configInfo from "../../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint = apiUrl + "/financial/treasury/receive/receive-receipts";

export async function getParams() {
  const { data } = await http.get(`${apiEndpoint}/params`);

  return data;
}

export async function getItemsParams() {
  const { data } = await http.get(`${apiEndpoint}/items/params`);

  return data;
}

export async function getPayedToOtherChequesForRefund(
  cashBoxID,
  chequeStatusID,
  frontSideAccountID
) {
  const { data } = await http.get(
    `${apiEndpoint}/refund/from-other/${cashBoxID}/${chequeStatusID}/${frontSideAccountID}`
  );

  return data;
}

export async function getPayedToOtherChequeForRefundByID(chequeID) {
  const { data } = await http.get(
    `${apiEndpoint}/refund/from-other/${chequeID}`
  );

  return data;
}

export async function getPayedChequesForRefund(cashBoxID, frontSideAccountID) {
  const { data } = await http.get(
    `${apiEndpoint}/refund/payed/cheque/${cashBoxID}/${frontSideAccountID}`
  );

  return data;
}

export async function getPayedChequeForRefundByID(chequeID) {
  const { data } = await http.get(
    `${apiEndpoint}/refund/payed/cheque/${chequeID}`
  );

  return data;
}

export async function getPayedDemandsForRefund(cashBoxID, frontSideAccountID) {
  const { data } = await http.get(
    `${apiEndpoint}/refund/payed/demand/${cashBoxID}/${frontSideAccountID}`
  );

  return data;
}

export async function getPayedDemandForRefundByID(demandID) {
  const { data } = await http.get(
    `${apiEndpoint}/refund/payed/demand/${demandID}`
  );

  return data;
}

export async function searchFrontSideAccounts(searchText) {
  const { data } = await http.post(`${apiEndpoint}/accounts`, { searchText });

  return data;
}

export async function searchFrontSideAccountByID(accountID) {
  const { data } = await http.get(`${apiEndpoint}/account/${accountID}`);

  return data;
}

export async function searchDeliveryMembers(searchText) {
  const { data } = await http.post(`${apiEndpoint}/delivery-members`, {
    searchText,
  });

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

export async function rejectReceiveReceipt(receiveID) {
  const { data } = await http.post(`${apiEndpoint}/reject/${receiveID}`, {});

  return data;
}

export async function approveReceiveReceipt(receiveID) {
  const { data } = await http.post(`${apiEndpoint}/approve/${receiveID}`, {});

  return data;
}

export async function undoApprove(receiveID) {
  const { data } = await http.post(
    `${apiEndpoint}/undo-approve/${receiveID}`,
    {}
  );

  return data;
}

export async function submitVoucher(receiveID) {
  const { data } = await http.post(
    `${apiEndpoint}/submit-voucher/${receiveID}`,
    {}
  );

  return data;
}

export async function deleteVoucher(receiveID) {
  const { data } = await http.post(
    `${apiEndpoint}/delete-voucher/${receiveID}`,
    {}
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

const service = {
  getParams,
  getItemsParams,
  getPayedToOtherChequesForRefund,
  getPayedToOtherChequeForRefundByID,
  getPayedChequesForRefund,
  getPayedChequeForRefundByID,
  getPayedDemandsForRefund,
  getPayedDemandForRefundByID,
  searchFrontSideAccounts,
  searchFrontSideAccountByID,
  searchDeliveryMembers,
  searchData,
  saveData,
  saveItem,
  rejectReceiveReceipt,
  approveReceiveReceipt,
  undoApprove,
  submitVoucher,
  deleteVoucher,
  viewVoucher,
  deleteData,
  deleteItem,
};

export default service;
