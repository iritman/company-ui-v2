import { useState } from "react";
import { Upload, Button } from "antd";
import { UploadOutlined as UploadIcon } from "@ant-design/icons";
import Words from "./../resources/words";
import configInfo from "./../config.json";

const { taskFileConfig: fileConfig } = configInfo;

const TestPage = () => {
  const [fileList, setFileList] = useState([]);
  // const [uploading, setUploading] = useState(false);

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

  // const handleUpload = () => {
  //   // const { fileList } = this.state;
  //   const formData = new FormData();

  //   fileList.forEach((file) => {
  //     formData.append("files[]", file);
  //   });

  //   setUploading(true);

  //   // You can use any AJAX library you like
  //   fetch("https://www.mocky.io/v2/5cc8019d300000980a055e76", {
  //     method: "POST",
  //     body: formData,
  //   })
  //     .then((res) => res.json())
  //     .then(() => {
  //       setFileList([]);
  //       message.success("upload successfully.");
  //     })
  //     .catch(() => {
  //       message.error("upload failed.");
  //     })
  //     .finally(() => {
  //       setUploading(false);
  //     });
  // };

  const props = {
    // onRemove: (file) => {
    //   const index = fileList.indexOf(file);
    //   const newFileList = fileList.slice();
    //   newFileList.splice(index, 1);
    //   setFileList(newFileList);
    // },
    onChange: (info) => {
      const filtered_list = info.fileList.filter(
        (f) => hasValidExtension(f.name) && hasValidSize(f.size)
      );

      setFileList(filtered_list);
    },
    beforeUpload: (file) => {
      return false;
    },
    fileList,
  };

  return (
    <div style={{ width: 300 }}>
      <Upload {...props} maxCount={5} multiple>
        {fileList.length < 5 && (
          <Button icon={<UploadIcon />}>{Words.select_file}</Button>
        )}
      </Upload>

      {/* <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        style={{ marginTop: 16 }}
      >
        {uploading ? "Uploading" : "Start Upload"}
      </Button> */}
    </div>
  );
};

export default TestPage;
