import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, message } from "antd";
import Joi from "joi-browser";
import ModalWindow from "./../../../../common/modal-window";
import Words from "../../../../../resources/words";
import utils from "../../../../../tools/utils";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
  handleError,
} from "../../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "./../../../../contexts/modal-context";
import service from "../../../../../services/official/processes/user-checkouts-service";
import DropdownItem from "./../../../../form-controls/dropdown-item";
import InputItem from "../../../../form-controls/input-item";
import FileUploader from "../../../../common/file-uploader";
import configInfo from "./../../../../../config.json";
import { onUpload } from "../../../../../tools/upload-tools";

const { checkoutFilesUrl, checkoutFileConfig: fileConfig } = configInfo;

const schema = {
  CheckoutID: Joi.number().required(),
  CheckoutMemberID: Joi.number().min(1).required(),
  DetailsText: Joi.string()
    .required()
    .min(10)
    .max(512)
    .regex(utils.VALID_REGEX)
    .label(Words.descriptions),
  Files: Joi.array(),
};

const initRecord = {
  CheckoutID: 0,
  CheckoutMemberID: 0,
  DetailsText: "",
  Files: [],
};

const formRef = React.createRef();

const UserCheckoutModal = ({ isOpen, selectedObject, onOk, onCancel }) => {
  const [fileList, setFileList] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const {
    progress,
    setProgress,
    record,
    setRecord,
    errors,
    setErrors,
    employees,
    setEmployees,
  } = useModalContext();

  const resetContext = useResetContext();

  const clearRecord = () => {
    record.CheckoutMemberID = 0;
    record.DetailsText = "";
    record.Files = [];

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  useMount(async () => {
    resetContext();

    setRecord(initRecord);
    initModal(formRef, selectedObject, setRecord);

    //------

    if (selectedObject) {
      let files = [];
      selectedObject.Files.forEach((f) => {
        files = [
          ...files,
          {
            uid: f.FileID,
            name: Words.attached_file, //f.filename,
            url: `${checkoutFilesUrl}/${f.FileName}`,
            FileID: f.FileID,
            FileName: f.FileName,
            FileSize: f.FileSize,
          },
        ];
      });

      setFileList(files);
    }

    initModal(formRef, selectedObject, setRecord);

    //------

    setProgress(true);
    try {
      const data = await service.getParams();

      const { Employees } = data;

      Employees.forEach((employee) => {
        employee.CheckoutMemberID = employee.MemberID;
      });

      setEmployees(Employees);
    } catch (err) {
      handleError(err);
    }
    setProgress(false);
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
        selectedObject,
        setProgress,
        onOk,
        clearRecord
      );

      // After updating task we need to get files list separately
      // and then update fileList & record.Files
      if (selectedObject) {
        const saved_files = await service.getCheckoutFiles(
          selectedObject.CheckoutID
        );

        saved_files.forEach((f) => {
          f.uid = f.FileID;
          f.name = Words.attached_file;
          f.url = `${checkoutFilesUrl}/${f.FileName}`;
        });

        rec.Files = [...saved_files];
        setRecord(rec);
        setFileList([...saved_files]);
      }

      // onCancel();
    }
  };

  const isEdit = selectedObject !== null;

  return (
    <ModalWindow
      isOpen={isOpen}
      isEdit={isEdit}
      inProgress={progress}
      disabled={validateForm({ record, schema }) && true}
      onClear={clearRecord}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      width={750}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24}>
            <DropdownItem
              title={Words.employee}
              dataSource={employees}
              keyColumn="CheckoutMemberID"
              valueColumn="FullName"
              formConfig={formConfig}
              required
              autoFocus
            />
          </Col>
          <Col xs={24}>
            <InputItem
              horizontal
              title={Words.descriptions}
              fieldName="DetailsText"
              formConfig={formConfig}
              multiline
              rows={7}
              maxLength={512}
              showCount
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

export default UserCheckoutModal;
