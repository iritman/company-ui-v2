import http from "./http-service";
import configInfo from "../config.json";
// import { saveAs } from "file-saver";

const { apiUrl } = configInfo;
const apiEndpoint = apiUrl + "/filemanager";

export async function uploadFile(formData, uploadConditions, eventHandler) {
  let headers = {};

  if (uploadConditions) {
    const { category, extensions, maxFileSize, sizeType, deleteFileName } =
      uploadConditions;

    if (category) {
      headers.category = category;
    }
    if (extensions) {
      headers.extensions = extensions;
    }
    if (maxFileSize) {
      headers.maxFileSize = maxFileSize;
    }
    if (maxFileSize) {
      headers.sizeType = sizeType;
    }
    if (deleteFileName) {
      headers.deleteFileName = deleteFileName;
    }
  }

  const { data } = await http.post(apiEndpoint + "/upload", formData, {
    headers,
    onUploadProgress: eventHandler,
  });

  return data;
}

export async function uploadFiles(formData, uploadConditions, eventHandler) {
  let headers = {};

  if (uploadConditions) {
    const { category, extensions, maxFileSize, sizeType, removedFiles } =
      uploadConditions;

    if (category) {
      headers.category = category;
    }
    if (extensions) {
      headers.extensions = extensions;
    }
    if (maxFileSize) {
      headers.maxFileSize = maxFileSize;
    }
    if (maxFileSize) {
      headers.sizeType = sizeType;
    }
    if (removedFiles) {
      headers.removedFiles = removedFiles;
    }
  }

  const { data } = await http.post(apiEndpoint + "/uploads", formData, {
    headers,
    onUploadProgress: eventHandler,
  });

  return data;
}

// export async function downloadFile(fileName, category) {
//   const headers = { category };

//   const { data } = await http.get(`${apiEndpoint}/download/${fileName}`, {
//     headers,
//   });

//   saveAs(new Blob([data]), fileName);
// }

export async function deleteFile(fileName, category) {
  const headers = { category };

  //const { data } =
  await http.delete(`${apiEndpoint}/${fileName}`, {
    headers,
  });
}

const service = {
  uploadFile,
  uploadFiles,
  //   downloadFile,
  deleteFile,
};

export default service;
