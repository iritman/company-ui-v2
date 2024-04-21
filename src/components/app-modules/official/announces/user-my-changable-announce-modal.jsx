import React, { useState } from "react";
import { useMount } from "react-use";
import {
  Form,
  Row,
  Col,
  Tag,
  Popover,
  Button,
  message,
  Popconfirm,
} from "antd";
import {
  TeamOutlined as UsersIcon,
  QuestionCircleOutlined as QuestionIcon,
  DeleteOutlined as DeleteIcon,
  PaperClipOutlined as AttachedFileIcon,
} from "@ant-design/icons";
import Joi from "joi-browser";
import ModalWindow from "../../../common/modal-window";
import Words from "../../../../resources/words";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
} from "../../../../tools/form-manager";
import InputItem from "./../../../form-controls/input-item";
import {
  useModalContext,
  useResetContext,
} from "../../../contexts/modal-context";
import service from "../../../../services/official/announces/user-my-announces-service";
import { handleError } from "./../../../../tools/form-manager";
import ContactsPopupContent from "./contacts-popup-content";
import utils from "../../../../tools/utils";
import { onUpload } from "../../../../tools/upload-tools";
import FileUploader from "../../../common/file-uploader";
import configInfo from "./../../../../config.json";

const { announceFileConfig: fileConfig, announceFilesUrl } = configInfo;

const schema = {
  AnnounceID: Joi.number().required(),
  Title: Joi.string()
    .min(2)
    .max(50)
    .required()
    .regex(utils.VALID_REGEX)
    .label(Words.title),
  DetailsText: Joi.string()
    .allow("")
    .max(512)
    .regex(utils.VALID_REGEX)
    .label(Words.descriptions),
  Contacts: Joi.array(),
  Files: Joi.array(),
};

const initRecord = {
  AnnounceID: 0,
  Title: "",
  DetailsText: "",
  Contacts: [],
  Files: [],
};

const formRef = React.createRef();

const UserMyChangableAnnounceModal = ({
  isOpen,
  selectedObject,
  onOk,
  onCancel,
  onDelete,
}) => {
  const {
    progress,
    setProgress,
    record,
    setRecord,
    employees,
    setEmployees,
    errors,
    setErrors,
  } = useModalContext();

  const [fileList, setFileList] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [departments, setDepartments] = useState([]);

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.AnnounceID = 0;
    record.Title = "";
    record.DetailsText = "";
    record.Contacts = [];
    record.Files = [];

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();
    setRecord(initRecord);

    if (selectedObject) {
      let files = [];
      selectedObject.Files.forEach((f) => {
        files = [
          ...files,
          {
            uid: f.FileID,
            name: Words.attached_file, //f.filename,
            url: `${announceFilesUrl}/${f.FileName}`,
            FileID: f.FileID,
            FileName: f.FileName,
            FileSize: f.FileSize,
          },
        ];
      });

      setFileList(files);
    }

    initModal(formRef, selectedObject, setRecord);

    setProgress(true);
    try {
      const data = await service.getParams();

      const { Employees, Departments } = data;

      setEmployees(Employees);
      setDepartments(Departments);
    } catch (ex) {
      handleError(ex);
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

      // After updating announce we need to get files list separately
      // and then update fileList & record.Files
      if (selectedObject) {
        const saved_files = await service.getAnnounceFiles(
          selectedObject.AnnounceID
        );

        saved_files.forEach((f) => {
          f.uid = f.FileID;
          f.name = Words.attached_file;
          f.url = `${announceFilesUrl}/${f.FileName}`;
        });

        rec.Files = [...saved_files];
        setRecord(rec);
        setFileList([...saved_files]);
      }
    }
  };

  const handleSelectContact = (contact) => {
    const rec = { ...record };
    rec.Contacts = [...rec.Contacts, contact];

    setRecord(rec);
  };

  const handleSelectContactList = (contactList) => {
    const rec = { ...record };
    rec.Contacts = [...rec.Contacts, ...contactList];

    setRecord(rec);
  };

  const handleRemoveContact = (contact) => {
    const rec = { ...record };
    rec.Contacts = rec.Contacts.filter((s) => s.MemberID !== contact.MemberID);

    setRecord(rec);
  };

  const handleDelete = async () => {
    await onDelete(selectedObject);
    onCancel();
  };

  //-----------------------------------------------------------

  const isEdit = selectedObject !== null;

  const getFooterButtons = () => {
    let buttons = selectedObject?.IsDeletable && [
      <Popconfirm
        title={Words.questions.sure_to_delete_announce}
        onConfirm={handleDelete}
        okText={Words.yes}
        cancelText={Words.no}
        icon={<QuestionIcon style={{ color: "red" }} />}
        key="submit-confirm"
        disabled={progress}
      >
        <Button type="primary" icon={<DeleteIcon />} danger>
          {Words.delete}
        </Button>
      </Popconfirm>,
    ];

    return buttons;
  };

  return (
    <>
      <ModalWindow
        isOpen={isOpen}
        isEdit={isEdit}
        inProgress={progress}
        disabled={validateForm({ record, schema }) && true}
        onClear={clearRecord}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        width={750}
        title={Words.my_announce}
        buttons={getFooterButtons()}
      >
        <Form ref={formRef} name="dataForm">
          <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
            {isEdit && (
              <Col xs={24}>
                <Form.Item label={Words.id}>
                  <Tag color="magenta">
                    {utils.farsiNum(`#${selectedObject.AnnounceID}`)}
                  </Tag>
                </Form.Item>
              </Col>
            )}

            <Col xs={24}>
              <InputItem
                title={Words.title}
                fieldName="Title"
                required
                autoFocus
                maxLength={50}
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
              />
            </Col>
            <Col xs={24} md={5}>
              <Form.Item>
                {record.Contacts && (
                  <Popover
                    content={
                      <ContactsPopupContent
                        departments={departments}
                        contacts={employees.filter(
                          (e) => e.MemberID !== record.MemberID
                        )}
                        selectedContacts={record.Contacts}
                        onClick={handleSelectContact}
                        onSelectList={handleSelectContactList}
                      />
                    }
                    title={Words.contacts}
                    trigger="click"
                  >
                    <Button
                      icon={<UsersIcon style={{ fontSize: 16 }} />}
                      type={record.Contacts.length > 0 ? "primary" : "default"}
                    >
                      {`${Words.contacts}${
                        record.Contacts.length > 0
                          ? utils.farsiNum(
                              ` (${record.Contacts.length} ${Words.person})`
                            )
                          : ""
                      }`}
                    </Button>
                  </Popover>
                )}
              </Form.Item>
            </Col>
            <Col xs={24} md={19}>
              <Form.Item>
                {record.Contacts?.map((contact) => (
                  <Tag
                    key={contact.MemberID}
                    color="magenta"
                    closable
                    onClose={() => handleRemoveContact(contact)}
                    style={{ margin: 5 }}
                  >
                    {contact.FullName ||
                      `${contact.FirstName} ${contact.LastName}`}
                  </Tag>
                ))}
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item>
                {!isEdit || (isEdit && selectedObject.SeenCount === 0) ? (
                  <FileUploader
                    fileList={fileList}
                    setFileList={setFileList}
                    maxCount={5}
                    fileConfig={fileConfig}
                    uploading={uploading}
                    uploadProgress={uploadProgress}
                  />
                ) : (
                  selectedObject.Files.map((f) => (
                    <a
                      key={f.FileID}
                      href={`${announceFilesUrl}/${f.FileName}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Tag color="magenta" icon={<AttachedFileIcon />}>
                        {Words.attached_file}
                      </Tag>
                    </a>
                  ))
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </ModalWindow>
    </>
  );
};

export default UserMyChangableAnnounceModal;
