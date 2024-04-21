// import { useState } from "react";
import { Upload, Button, Progress } from "antd";
import { UploadOutlined as UploadIcon } from "@ant-design/icons";
import Words from "../../resources/words";

const FileUploader = ({
  fileList,
  setFileList,
  maxCount,
  fileConfig,
  uploading,
  uploadProgress,
}) => {
  const { maxFileSize, sizeType, extensions } = fileConfig;

  const hasValidExtension = (fileName) => {
    const extension_list = extensions.split("|");
    const file_extension = fileName.toLowerCase().split(".").pop();

    const extensionIndex = extension_list.findIndex(
      (ext) => ext === file_extension
    );

    return extensionIndex !== -1;
  };

  const hasValidSize = (fileSize) => {
    const max_valid_file_size =
      maxFileSize * 1024 * (sizeType === "mb" ? 1024 : 1);

    return fileSize <= max_valid_file_size;
  };

  const props = {
    // onRemove: (file) => {
    // console.log("Delete", file);
    // const index = fileList.indexOf(file);
    // const newFileList = fileList.slice();
    // newFileList.splice(index, 1);
    // setFileList(newFileList);
    // },
    onChange: (info) => {
      const filtered_list = info.fileList.filter(
        (f) =>
          hasValidExtension(f.FileName || f.name) &&
          hasValidSize(f.FileSize || f.size)
      );

      setFileList(filtered_list);
    },
    beforeUpload: (file) => {
      return false;
    },

    fileList,
  };

  return (
    <>
      <Upload {...props} maxCount={maxCount} multiple>
        {fileList.length < maxCount && (
          <Button icon={<UploadIcon />}>{Words.select_file}</Button>
        )}
      </Upload>

      {uploading && <Progress percent={uploadProgress} size="small" />}
    </>
  );
};

export default FileUploader;
