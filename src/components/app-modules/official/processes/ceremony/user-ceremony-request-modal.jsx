import React from "react";
// , { useState }
import { useMount } from "react-use";
import {
  Form,
  Row,
  Col,
  // , message
} from "antd";
import Joi from "joi-browser";
import ModalWindow from "./../../../../common/modal-window";
import Words from "../../../../../resources/words";
import utils from "../../../../../tools/utils";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
  //   handleError,
} from "../../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "./../../../../contexts/modal-context";
// import service from "../../../../../services/official/processes/user-ceremony-requests-service";
// import DropdownItem from "./../../../../form-controls/dropdown-item";
import InputItem from "../../../../form-controls/input-item";
import NumericInputItem from "../../../../form-controls/numeric-input-item";
import DateItem from "../../../../form-controls/date-item";
import TimeItem from "../../../../form-controls/time-item";
import SwitchItem from "../../../../form-controls/switch-item";
// import FileUploader from "../../../../common/file-uploader";
// import configInfo from "./../../../../../config.json";
// import { onUpload } from "../../../../../tools/upload-tools";

// const { eduFundFilesUrl, eduFundFileConfig: fileConfig } = configInfo;

const schema = {
  RequestID: Joi.number().required(),
  Title: Joi.string()
    .min(2)
    .max(50)
    .required()
    .regex(utils.VALID_REGEX)
    .label(Words.title),
  ClientCounts: Joi.number()
    .min(1)
    .max(1000)
    .required()
    .label(Words.client_counts),
  Clients: Joi.string()
    .allow("")
    .min(10)
    .max(512)
    .regex(utils.VALID_REGEX)
    .label(Words.clients),
  StartDate: Joi.string().required(),
  FinishDate: Joi.string().required(),
  EstimatedEntryTime: Joi.string().required(),
  NeedFruit: Joi.boolean(),
  NeedSweet: Joi.boolean(),
  NeedBreakfast: Joi.boolean(),
  NeedLunch: Joi.boolean(),
  NeedDinner: Joi.boolean(),
  NeedHoteling: Joi.boolean(),
  NeedVehicle: Joi.boolean(),
  NeededFacilities: Joi.string()
    .allow("")
    .min(10)
    .max(512)
    .regex(utils.VALID_REGEX)
    .label(Words.needed_facilities),
  OfficialClientTypeID: Joi.number(),
  OfficialSelectedSessionLocationID: Joi.number(),
  DetailsText: Joi.string()
    .allow("")
    .min(10)
    .max(512)
    .regex(utils.VALID_REGEX)
    .label(Words.descriptions),
  //   Files: Joi.array(),
};

const initRecord = {
  RequestID: 0,
  Title: "",
  ClientCounts: 1,
  Clients: "",
  StartDate: "",
  FinishDate: "",
  EstimatedEntryTime: "",
  NeedFruit: false,
  NeedSweet: false,
  NeedBreakfast: false,
  NeedLunch: false,
  NeedDinner: false,
  NeedHoteling: false,
  NeedVehicle: false,
  NeededFacilities: "",
  OfficialClientTypeID: 0,
  OfficialSelectedSessionLocationID: 0,
  DetailsText: "",
  //   Files: [],
};

const formRef = React.createRef();

const UserCeremonyRequestModal = ({
  isOpen,
  selectedObject,
  onOk,
  onCancel,
}) => {
  //   const [fileList, setFileList] = useState([]);
  //   const [uploadProgress, setUploadProgress] = useState(0);
  //   const [uploading, setUploading] = useState(false);
  //   const [clientTypes, setClientTypes] = useState(false);
  //   const [locations, setLocations] = useState(false);

  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const resetContext = useResetContext();

  const clearRecord = () => {
    record.Title = "";
    record.ClientCounts = 1;
    record.Clients = "";
    record.StartDate = "";
    record.FinishDate = "";
    record.EstimatedEntryTime = "";
    record.NeedFruit = false;
    record.NeedSweet = false;
    record.NeedBreakfast = false;
    record.NeedLunch = false;
    record.NeedDinner = false;
    record.NeedHoteling = false;
    record.NeedVehicle = false;
    record.NeededFacilities = "";
    record.OfficialClientTypeID = 0;
    record.OfficialSelectedSessionLocationID = 0;
    record.DetailsText = "";
    // record.Files = [];

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
    loadFieldsValue(formRef, initRecord);
    initModal(formRef, selectedObject, setRecord);

    //------

    // if (selectedObject) {
    //   let files = [];
    //   selectedObject.Files.forEach((f) => {
    //     files = [
    //       ...files,
    //       {
    //         uid: f.FileID,
    //         name: Words.attached_file, //f.filename,
    //         url: `${eduFundFilesUrl}/${f.FileName}`,
    //         FileID: f.FileID,
    //         FileName: f.FileName,
    //         FileSize: f.FileSize,
    //       },
    //     ];
    //   });

    //   setFileList(files);
    // }

    initModal(formRef, selectedObject, setRecord);

    //------

    // setProgress(true);
    // try {
    //   const data = await service.getParams();

    //   const { ClientTypes, Locations } = data;

    //   setClientTypes(ClientTypes);
    //   setLocations(Locations);
    // } catch (err) {
    //   handleError(err);
    // }
    // setProgress(false);
  });

  //   const getRemovedFiles = () => {
  //     let files = [];

  //     record.Files.filter(
  //       (f) => fileList.filter((fl) => fl.FileID === f.FileID).length === 0
  //     ).forEach((f) => {
  //       files = [...files, { FileName: f.FileName }];
  //     });

  //     return files;
  //   };

  const handleSubmit = async () => {
    await saveModalChanges(
      formConfig,
      selectedObject,
      setProgress,
      onOk,
      clearRecord
    );
  };

  //   const handleSubmit = async () => {
  //     const data = await onUpload({
  //       fileList,
  //       setFileList,
  //       removedFiles: getRemovedFiles(),
  //       fileConfig,
  //       setUploading,
  //       setUploadProgress,
  //     });

  //     if (data.error) {
  //       message.error(Words.messages.upload_failed);
  //     } else {
  //       let files = fileList.filter((f) => f.FileID && f.FileID > 0);
  //       data.files.forEach((f) => {
  //         files = [
  //           ...files,
  //           { FileID: 0, FileName: f.filename, FileSize: f.size },
  //         ];
  //       });
  //       const rec = { ...record };
  //       rec.Files = files;
  //       setRecord(rec);

  //       // When record change, formConfig not change!
  //       // so we are going to create new instance of formConfig
  //       // with updated "record" prop
  //       const form_config = { ...formConfig };
  //       form_config.record = rec;

  //       await saveModalChanges(
  //         form_config,
  //         selectedObject,
  //         setProgress,
  //         onOk,
  //         clearRecord
  //       );

  //       // After updating task we need to get files list separately
  //       // and then update fileList & record.Files
  //       if (selectedObject) {
  //         const saved_files = await service.getEduFundFiles(
  //           selectedObject.RequestID
  //         );

  //         saved_files.forEach((f) => {
  //           f.uid = f.FileID;
  //           f.name = Words.attached_file;
  //           f.url = `${eduFundFilesUrl}/${f.FileName}`;
  //         });

  //         rec.Files = [...saved_files];
  //         setRecord(rec);
  //         setFileList([...saved_files]);
  //       }

  //       // onCancel();
  //     }
  //   };

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
          <Col xs={24} md={18}>
            <InputItem
              title={Words.subject}
              fieldName="Title"
              formConfig={formConfig}
              maxLength={50}
              required
              autoFocus
            />
          </Col>
          <Col xs={24} md={6}>
            <NumericInputItem
              horizontal
              required
              title={Words.client_counts}
              fieldName="ClientCounts"
              min={1}
              max={1000}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24}>
            <InputItem
              horizontal
              title={Words.clients}
              fieldName="Clients"
              formConfig={formConfig}
              multiline
              rows={3}
              maxLength={512}
              showCount
            />
          </Col>
          <Col xs={24} md={8}>
            <DateItem
              horizontal
              title={Words.start_date}
              fieldName="StartDate"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={8}>
            <DateItem
              horizontal
              title={Words.finish_date}
              fieldName="FinishDate"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={8}>
            <TimeItem
              horizontal
              title={Words.estimated_entry_time}
              fieldName="EstimatedEntryTime"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={12} md={5}>
            <SwitchItem
              title={Words.fruit}
              fieldName="NeedFruit"
              initialValue={false}
              checkedTitle={Words.yes}
              unCheckedTitle={Words.no}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={12} md={5}>
            <SwitchItem
              title={Words.sweet}
              fieldName="NeedSweet"
              initialValue={false}
              checkedTitle={Words.yes}
              unCheckedTitle={Words.no}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={8} md={5}>
            <SwitchItem
              title={Words.breakfast}
              fieldName="NeedBreakfast"
              initialValue={false}
              checkedTitle={Words.yes}
              unCheckedTitle={Words.no}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={8} md={5}>
            <SwitchItem
              title={Words.lunch}
              fieldName="NeedLunch"
              initialValue={false}
              checkedTitle={Words.yes}
              unCheckedTitle={Words.no}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={8} md={4}>
            <SwitchItem
              title={Words.dinner}
              fieldName="NeedDinner"
              initialValue={false}
              checkedTitle={Words.yes}
              unCheckedTitle={Words.no}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={12}>
            <SwitchItem
              title={Words.need_vehicle}
              fieldName="NeedVehicle"
              initialValue={false}
              checkedTitle={Words.yes}
              unCheckedTitle={Words.no}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={12}>
            <SwitchItem
              title={Words.need_hoteling}
              fieldName="NeedHoteling"
              initialValue={false}
              checkedTitle={Words.yes}
              unCheckedTitle={Words.no}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24}>
            <InputItem
              horizontal
              title={Words.needed_facilities}
              fieldName="NeededFacilities"
              formConfig={formConfig}
              multiline
              rows={7}
              maxLength={512}
              showCount
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
            />
          </Col>
          {/* <Col xs={24}>
            <DropdownItem
              title={Words.subject}
              dataSource={Title}
              keyColumn="EduLevelID"
              valueColumn="EduLevelTitle"
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
          </Col> */}
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default UserCeremonyRequestModal;
