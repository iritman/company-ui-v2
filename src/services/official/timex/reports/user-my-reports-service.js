import http from "../../../http-service";
import configInfo from "../../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint = apiUrl + "/official/timex/reports/user-my-reports";

async function getMyInOutCards(filter) {
  const { data } = await http.post(`${apiEndpoint}/my/in-out-cards`, filter);

  return data;
}

const service = {
  getMyInOutCards,
};

export default service;
