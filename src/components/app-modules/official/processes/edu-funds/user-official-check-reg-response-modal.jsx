import React, { useState } from "react";
import { useMount } from "react-use";
import Joi from "joi-browser";
import { Row, Col, Form, message } from "antd";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
} from "../../../../../tools/form-manager";
import Words from "../../../../../resources/words";
import utils from "../../../../../tools/utils";
import ModalWindow from "../../../../common/modal-window";
import InputItem from "../../../../form-controls/input-item";
import SwitchItem from "../../../../form-controls/switch-item";
import FileUploader from "../../../../common/file-uploader";
import configInfo from "./../../../../../config.json";
import { onUpload } from "../../../../../tools/upload-tools";

const { eduFundResponseFileConfig: fileConfig } = configInfo;

const schema = {
  FundID: Joi.number(),
  IsAccepted: Joi.boolean(),
  DetailsText: Joi.string()
    .min(5)
    .max(512)
    .required()
    .regex(utils.VALID_REGEX)
    .label(Words.descriptions),
  Files: Joi.array(),
};

const initRecord = (fundID) => {
  return {
    FundID: fundID,
    IsAccepted: true,
    DetailsText: "",
    Files: [],
  };
};

const formRef = React.createRef();

const UserOfficialCheckRegResponseModal = ({
  isOpen,
  onOk,
  onCancel,
  eduFund,
}) => {
  const [record, setRecord] = useState({
    FundID: 0,
    IsAccepted: true,
    DetailsText: "",
    Files: [],
  });
  const [errors, setErrors] = useState({});
  const [progress, setProgress] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.IsAccepted = true;
    record.DetailsText = "";
    record.Files = [];

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    setRecord(initRecord(eduFund.FundID));
    initModal(formRef, null, setRecord);
  });

  const getRemovedFiles = () => {
    let files = [];

    record.Files.filter(
      (f) => fileList.filter((fl) => fl.FileID === f.FileID).length === 0
    ).forEach((f) => {
      files = [...files, { FileName: f.FileName }];
    });

    return files;
  };

  const handleSubmit = async () => {
    if (eduFund.FinalStatusID > 1)
      message.error(
        Words.messages.submit_response_in_finished_edu_fund_request_failed
      );
    else {
      const data = await onUpload({
        fileList,
        setFileList,
        removedFiles: getRemovedFiles(),
        fileConfig,
        setUploading,
        setUploadProgress,
      });
      if (data.error) {
        message.error(Words.messages.upload_failed);
      } else {
        let files = fileList.filter((f) => f.FileID && f.FileID > 0);
        data.files.forEach((f) => {
          files = [
            ...files,
            { FileID: 0, FileName: f.filename, FileSize: f.size },
          ];
        });
        const rec = { ...record };
        rec.Files = files;
        setRecord(rec);

        // When record change, formConfig not change!
        // so we are going to create new instance of formConfig
        // with updated "record" prop
        const form_config = { ...formConfig };
        form_config.record = rec;

        await saveModalChanges(
          form_config,
          null, // selectedObject,
          setProgress,
          onOk,
          clearRecord
        );

        onCancel();
      }
    }
  };

  return (
    <ModalWindow
      isOpen={isOpen}
      isEdit={false}
      inProgress={progress}
      disabled={validateForm({ record: record, schema }) && true}
      onClear={clearRecord}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      width={750}
      title={Words.submit_response}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24} md={12}>
            <SwitchItem
              title={Words.your_response}
              fieldName="IsAccepted"
              initialValue={false}
              checkedTitle={Words.accept_request}
              unCheckedTitle={Words.reject_request}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24}>
            <InputItem
              title={Words.descriptions}
              fieldName="DetailsText"
              multiline
              rows={7}
              showCount
              maxLength={512}
              formConfig={formConfig}
              autoFocus
              required
            />
          </Col>
          <Col xs={24}>
            <Form.Item>
              <FileUploader
                fileList={fileList}
                setFileList={setFileList}
                maxCount={5}
                fileConfig={fileConfig}
                uploading={uploading}
                uploadProgress={uploadProgress}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default UserOfficialCheckRegResponseModal;
