import http from "../http-service";
import configInfo from "../../config.json";

const { apiUrl } = configInfo;
const apiEndpoint = apiUrl + "/account";

async function getMemberProfile() {
  const { data } = await http.get(`${apiEndpoint}/profile`);

  return data;
}

async function changePassword(password_info) {
  const { CurrentPassword, NewPassword } = password_info;

  const { data } = await http.post(`${apiEndpoint}/change-password`, {
    CurrentPassword,
    NewPassword,
  });

  return data;
}

const service = {
  getMemberProfile,
  changePassword,
};

export default service;
