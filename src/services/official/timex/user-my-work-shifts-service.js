import http from "../../http-service";
import configInfo from "../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint = apiUrl + "/official/timex/user-my-work-shifts";

async function searchData(year) {
  const { data } = await http.get(`${apiEndpoint}/${year}`);

  return data;
}

const service = {
  searchData,
};

export default service;
