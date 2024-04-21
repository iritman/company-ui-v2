import http from "../../http-service";
import configInfo from "../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint = apiUrl + "/logistic/purchase/deliveries";

export async function getParams() {
  const { data } = await http.get(`${apiEndpoint}/params`);

  return data;
}

export async function getSearchParams() {
  const { data } = await http.get(`${apiEndpoint}/search/params`);

  return data;
}

export async function getItemParams() {
  const { data } = await http.get(`${apiEndpoint}/item/params`);

  return data;
}

export async function getRegedRegedOrderItems() {
  const { data } = await http.get(`${apiEndpoint}/order-items`);

  return data;
}

export async function getRegedOrderItemByID(order_item_id) {
  const { data } = await http.get(`${apiEndpoint}/order-item/${order_item_id}`);

  return data;
}

export async function searchTransferees(searchText) {
  const { data } = await http.post(`${apiEndpoint}/search/transferees`, {
    searchText,
  });

  return data;
}

export async function searchTransfereeByID(transferee_tafsil_account_id) {
  const { data } = await http.get(
    `${apiEndpoint}/search/transferee/${transferee_tafsil_account_id}`
  );

  return data;
}

export async function searchDeliveryPersons(searchText) {
  const { data } = await http.post(`${apiEndpoint}/search/delivery-persons`, {
    searchText,
  });

  return data;
}

export async function searchDeliveryPersonByID(delivery_tafsil_account_id) {
  const { data } = await http.get(
    `${apiEndpoint}/search/delivery-person/${delivery_tafsil_account_id}`
  );

  return data;
}

export async function searchDeliveryFrontSideAccounts(searchText) {
  const { data } = await http.post(
    `${apiEndpoint}/search/front-side-accounts`,
    {
      searchText,
    }
  );

  return data;
}

export async function searchDeliveryFrontSideAccountByID(
  front_side_account_id
) {
  const { data } = await http.get(
    `${apiEndpoint}/search/front-side-account/${front_side_account_id}`
  );

  return data;
}

export async function searchDeliveryProducts(searchText) {
  const { data } = await http.post(`${apiEndpoint}/search/products`, {
    searchText,
  });

  return data;
}

export async function searchDeliveryProductByID(product_id) {
  const { data } = await http.get(
    `${apiEndpoint}/search/product/${product_id}`
  );

  return data;
}

export async function searchTafsilAccount(search_type, accountID) {
  const { data } = await http.get(
    `${apiEndpoint}/search/tafsil-account/${
      search_type === "transferee" ? 1 : 2
    }/${accountID}`
  );

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

export async function saveItem(record) {
  const { data } = await http.post(`${apiEndpoint}/item`, record);

  return data;
}

export async function rejectDelivery(deliveryID) {
  const { data } = await http.post(`${apiEndpoint}/reject/${deliveryID}`, {});

  return data;
}

export async function approveDelivery(deliveryID) {
  const { data } = await http.post(`${apiEndpoint}/approve/${deliveryID}`, {});

  return data;
}

export async function undoApproveDelivery(deliveryID) {
  const { data } = await http.post(
    `${apiEndpoint}/undo-approve/${deliveryID}`,
    {}
  );

  return data;
}

export async function deleteData(recordID) {
  const { data } = await http.delete(`${apiEndpoint}/${recordID}`);

  return data;
}

export async function deleteItem(recordID) {
  const { data } = await http.delete(`${apiEndpoint}/item/${recordID}`);

  return data;
}

const service = {
  getParams,
  getSearchParams,
  getItemParams,
  getRegedRegedOrderItems,
  getRegedOrderItemByID,
  searchTransferees,
  searchTransfereeByID,
  searchDeliveryPersons,
  searchDeliveryPersonByID,
  searchDeliveryFrontSideAccounts,
  searchDeliveryFrontSideAccountByID,
  searchDeliveryProducts,
  searchDeliveryProductByID,
  searchTafsilAccount,
  searchData,
  saveData,
  saveItem,
  rejectDelivery,
  approveDelivery,
  undoApproveDelivery,
  deleteData,
  deleteItem,
};

export default service;
