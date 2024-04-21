import http from "../http-service";
import configInfo from "../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint = apiUrl + "/global/form";

export const forms = {
  FINANCIAL_STORE_PRODUCT_REQUEST: 1,
  FINANCIAL_STORE_PRODUCT_REQUEST_SEARCH: 2,
  FINANCIAL_STORE_PRODUCT_REQUEST_ITEM: 3,
};

export async function getFormUI(form_id) {
  const { data } = await http.get(`${apiEndpoint}/ui/${form_id}`);

  return data;
}

const service = {
  forms,
  getFormUI,
};

export default service;
