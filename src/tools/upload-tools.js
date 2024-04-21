import fileService from "./../services/file-service";

export function onUploadProgress(progressEvent, setProgressFunc) {
  const progress = Math.round(
    (progressEvent.loaded / progressEvent.total) * 100
  );

  setProgressFunc(progress);
}

export async function onUpload(config) {
  const {
    fileList,
    setFileList,
    removedFiles,
    fileConfig,
    setUploading,
    setUploadProgress,
  } = config;

  let result = null;

  setUploading(true);
  setUploadProgress(0);

  try {
    const fd = new FormData();

    // Select new files where they have not FileID prop
    const newFiles = fileList.filter((f) => !f.FileID);

    newFiles.forEach((f) => {
      fd.append("dataFiles", f.originFileObj, f.name);
    });

    if (removedFiles.length > 0)
      fileConfig.removedFiles = JSON.stringify(removedFiles);

    //---

    result = await fileService.uploadFiles(fd, fileConfig, (e) =>
      onUploadProgress(e, setUploadProgress)
    );

    setFileList([]);
  } catch (ex) {
    result = { error: ex.message };
  }

  setUploadProgress(0);
  setUploading(false);

  return result;
}

const methods = {
  onUploadProgress,
  onUpload,
};

export default methods;
