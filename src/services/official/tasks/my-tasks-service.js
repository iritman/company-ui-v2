import http from "../../http-service";
import configInfo from "../../../config.json";

const { apiUrl } = configInfo;

const apiEndpoint = apiUrl + "/official/tasks/user-my-tasks";

async function getSearchMyDoneTasksParams() {
  const { data } = await http.get(`${apiEndpoint}/my/done/params`);

  return data;
}

async function getSearchUnderSupervisionTasksParams() {
  const { data } = await http.get(`${apiEndpoint}/supervision/params`);

  return data;
}

// async function getTaskFiles(taskID) {
//   const { data } = await http.get(`${apiEndpoint}/files/${taskID}`);

//   return data;
// }

async function getAllData() {
  const { data } = await http.get(`${apiEndpoint}`);

  return data;
}

export async function makeTaskSeen(taskID) {
  const { data } = await http.post(`${apiEndpoint}/task/seen/${taskID}`, {});

  return data;
}

// async function searchData(searchText) {
//   const { data } = await http.post(`${apiEndpoint}/search`, { searchText });

//   return data;
// }

export async function saveData(record) {
  const { data } = await http.post(`${apiEndpoint}`, record);

  return data;
}

export async function deleteData(recordID) {
  const { data } = await http.delete(`${apiEndpoint}/${recordID}`);

  return data;
}

export async function saveReport(record) {
  const { data } = await http.post(`${apiEndpoint}/report`, record);

  return data;
}

export async function deleteReport(recordID) {
  const { data } = await http.delete(`${apiEndpoint}/report/${recordID}`);

  return data;
}

export async function makeReportsSeen(taskID) {
  const { data } = await http.post(`${apiEndpoint}/report/seen/${taskID}`, {});

  return data;
}

export async function makeTaskDone(taskID) {
  const { data } = await http.post(`${apiEndpoint}/done/${taskID}`, {});

  return data;
}

async function searchMyDoneTasks(filter) {
  const { data } = await http.post(`${apiEndpoint}/search/done`, filter);

  return data;
}

async function searchUnderSupervisionTasks(filter) {
  const { data } = await http.post(
    `${apiEndpoint}/search/supervisions`,
    filter
  );

  return data;
}

const service = {
  getSearchMyDoneTasksParams,
  getSearchUnderSupervisionTasksParams,
  //   getTaskFiles,
  getAllData,
  makeTaskSeen,
  //   searchData,
  saveData,
  deleteData,
  saveReport,
  deleteReport,
  makeReportsSeen,
  makeTaskDone,
  searchMyDoneTasks,
  searchUnderSupervisionTasks,
};

export default service;
