import React, { useState } from "react";
import { useMount } from "react-use";
import Joi from "joi-browser";
import { Row, Col, Form, message, Popconfirm, Button } from "antd";
import { QuestionCircleOutlined as QuestionIcon } from "@ant-design/icons";
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
import FileUploader from "../../../../common/file-uploader";
import configInfo from "./../../../../../config.json";
import { onUpload } from "../../../../../tools/upload-tools";
import service from "../../../../../services/official/processes/user-official-check-ceremony-requests-service";
import { handleError } from "./../../../../../tools/form-manager";
import DropdownItem from "./../../../../form-controls/dropdown-item";
import SwitchItem from "./../../../../form-controls/switch-item";

const { ceremonyRequestActionFileConfig: fileConfig } = configInfo;

const schema = {
  IsAccepted: Joi.boolean(),
  OfficialIsVehicleApproved: Joi.boolean(),
  OfficialIsHotelingApproved: Joi.boolean(),
  ClientTypeID: Joi.number(),
  LocationID: Joi.number(),
  DetailsText: Joi.string()
    .allow("")
    .min(5)
    .max(512)
    .required()
    .regex(utils.VALID_REGEX)
    .label(Words.descriptions),
  OfficialVehicleDetailsText: Joi.string()
    .allow("")
    .min(5)
    .max(512)
    .required()
    .regex(utils.VALID_REGEX)
    .label(Words.transmission_descriptions),
  OfficialHotelingDetailsText: Joi.string()
    .allow("")
    .min(5)
    .max(512)
    .required()
    .regex(utils.VALID_REGEX)
    .label(Words.hoteling_descriptions),
  Files: Joi.array(),
};

const initRecord = {
  IsAccepted: false,
  OfficialIsVehicleApproved: false,
  OfficialIsHotelingApproved: false,
  ClientTypeID: 0,
  LocationID: 0,
  DetailsText: "",
  OfficialVehicleDetailsText: "",
  OfficialHotelingDetailsText: "",
  Files: [],
};

const formRef = React.createRef();

const UserOfficialCheckCeremonyRequestRegResponse = ({
  isOpen,
  onOk,
  onCancel,
  request,
}) => {
  const [record, setRecord] = useState({
    DetailsText: "",
    Files: [],
  });
  const [errors, setErrors] = useState({});
  const [progress, setProgress] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [clientTypes, setClientTypes] = useState([]);
  const [locations, setLocations] = useState([]);

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.IsAccepted = false;
    record.OfficialIsVehicleApproved = false;
    record.OfficialIsHotelingApproved = false;
    record.ClientTypeID = 0;
    record.LocationID = 0;
    record.DetailsText = "";
    record.OfficialVehicleDetailsText = "";
    record.OfficialHotelingDetailsText = "";
    record.Files = [];

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    setRecord(initRecord);
    initModal(formRef, null, setRecord);

    setProgress(true);
    try {
      const data = await service.getParams();

      const { ClientTypes, Locations } = data;

      setClientTypes(ClientTypes);
      setLocations(Locations);
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
    if (request.FinalStatusID > 1)
      message.error(
        Words.messages.submit_response_in_finished_ceremony_request_failed
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

  const handleSwitchChange = (checked) => {
    const rec = { ...record };
    const { NeedVehicle, NeedHoteling } = request;

    rec.IsAccepted = checked;

    if (checked) {
      schema.ClientTypeID = Joi.number()
        .min(1)
        .required()
        .label(Words.client_type);
      schema.LocationID = Joi.number()
        .min(1)
        .required()
        .label(Words.session_location);

      rec.OfficialIsVehicleApproved = NeedVehicle;
      rec.OfficialIsHotelingApproved = NeedHoteling;
    } else {
      schema.ClientTypeID = Joi.number().label(Words.client_type);
      schema.LocationID = Joi.number().label(Words.session_location);

      rec.ClientTypeID = 0;
      rec.LocationID = 0;
      rec.OfficialVehicleDetailsText = "";
      rec.OfficialHotelingDetailsText = "";
    }

    validateForm({ record, schema });

    setRecord(rec);
    loadFieldsValue(formRef, rec);
  };

  return (
    <ModalWindow
      isOpen={isOpen}
      isEdit={false}
      inProgress={progress}
      onClear={clearRecord}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      width={750}
      title={Words.submit_response}
      confirm={
        <Popconfirm
          title={Words.questions.sure_to_submit_response}
          onConfirm={handleSubmit}
          okText={Words.yes}
          cancelText={Words.no}
          icon={<QuestionIcon style={{ color: "red" }} />}
          disabled={validateForm({ record, schema }) && true}
        >
          <Button type="primary">{Words.submit}</Button>
        </Popconfirm>
      }
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24}>
            <SwitchItem
              title={Words.your_response}
              fieldName="IsAccepted"
              initialValue={false}
              checkedTitle={Words.accept_request}
              unCheckedTitle={Words.reject_request}
              formConfig={formConfig}
              onChange={handleSwitchChange}
            />
          </Col>
          {record.IsAccepted && (
            <>
              <Col xs={24} md={12}>
                <DropdownItem
                  title={Words.client_type}
                  dataSource={clientTypes}
                  keyColumn="ClientTypeID"
                  valueColumn="ClientTypeTitle"
                  formConfig={formConfig}
                  required
                />
              </Col>
              <Col xs={24} md={12}>
                <DropdownItem
                  title={Words.session_location}
                  dataSource={locations}
                  keyColumn="LocationID"
                  valueColumn="LocationTitle"
                  formConfig={formConfig}
                  required
                />
              </Col>
              {request.NeedVehicle && (
                <>
                  <Col xs={24}>
                    <SwitchItem
                      title={Words.questions.vehicle_request_approved}
                      fieldName="OfficialIsVehicleApproved"
                      initialValue={true}
                      checkedTitle={Words.yes}
                      unCheckedTitle={Words.no}
                      formConfig={formConfig}
                    />
                  </Col>
                  <Col xs={24}>
                    <InputItem
                      title={Words.transmission_descriptions}
                      fieldName="OfficialVehicleDetailsText"
                      multiline
                      rows={7}
                      showCount
                      maxLength={512}
                      formConfig={formConfig}
                    />
                  </Col>
                </>
              )}
              {request.NeedHoteling && (
                <>
                  <Col xs={24}>
                    <SwitchItem
                      title={Words.questions.hoteling_request_approved}
                      fieldName="OfficialIsHotelingApproved"
                      initialValue={true}
                      checkedTitle={Words.yes}
                      unCheckedTitle={Words.no}
                      formConfig={formConfig}
                    />
                  </Col>
                  <Col xs={24}>
                    <InputItem
                      title={Words.transmission_descriptions}
                      fieldName="OfficialHotelingDetailsText"
                      multiline
                      rows={7}
                      showCount
                      maxLength={512}
                      formConfig={formConfig}
                    />
                  </Col>
                </>
              )}
            </>
          )}

          <Col xs={24}>
            <InputItem
              title={Words.descriptions}
              fieldName="DetailsText"
              multiline
              rows={7}
              showCount
              maxLength={512}
              formConfig={formConfig}
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

export default UserOfficialCheckCeremonyRequestRegResponse;
