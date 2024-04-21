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
  Tabs,
  Alert,
  Typography,
  Space,
  Badge,
} from "antd";
import {
  TagsOutlined as TagIcon,
  TeamOutlined as UsersIcon,
  QuestionCircleOutlined as QuestionIcon,
  DeleteOutlined as DeleteIcon,
  PaperClipOutlined as AttachedFileIcon,
  PlusOutlined as PlusIcon,
  CalendarOutlined as CalendarIcon,
  ClockCircleOutlined as ClockIcon,
  EyeInvisibleOutlined as UnseenIcon,
  EyeOutlined as SeenIcon,
} from "@ant-design/icons";
import Joi from "joi-browser";
import ModalWindow from "../../../common/modal-window";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
} from "../../../../tools/form-manager";
import InputItem from "./../../../form-controls/input-item";
import DateItem from "./../../../form-controls/date-item";
import TimeItem from "./../../../form-controls/time-item";
import DropdownItem from "./../../../form-controls/dropdown-item";
import {
  useModalContext,
  useResetContext,
} from "../../../contexts/modal-context";
import service from "../../../../services/official/tasks/employees-tasks-service";
import favoriteSupervisorsService from "../../../../services/official/tasks/selected-supervisors-service";
import { handleError } from "./../../../../tools/form-manager";
import SupervisorsPopupContent from "./supervisors-popup-content";
import TagsPopupContent from "./tags-popup-content";
import utils from "../../../../tools/utils";
import { onUpload } from "../../../../tools/upload-tools";
import FileUploader from "../../../common/file-uploader";
import configInfo from "./../../../../config.json";
import NewReportModal from "./new-report-modal";
import MemberProfileImage from "./../../../common/member-profile-image";

const {
  taskFileConfig: fileConfig,
  taskFilesUrl,
  taskReportFilesUrl,
} = configInfo;
const { Text } = Typography;

const schema = {
  TaskID: Joi.number().required(),
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
  MemberID: Joi.number(),
  ReminderDate: Joi.string(),
  ReminderTime: Joi.string(),
  Tags: Joi.array(),
  Supervisors: Joi.array(),
  Files: Joi.array(),
};

const initRecord = {
  TaskID: 0,
  Title: "",
  DetailsText: "",
  MemberID: 0,
  ReminderDate: "",
  ReminderTime: "",
  Tags: [],
  Supervisors: [],
  Files: [],
};

const formRef = React.createRef();

const { TabPane } = Tabs;

const UserEmployeeTaskModal = ({
  isOpen,
  selectedObject,
  onOk,
  onCancel,
  onDelete,
  onSubmitReport,
  onDeleteReport,
  onSeenReports,
}) => {
  const {
    progress,
    setProgress,
    record,
    setRecord,
    tags,
    setTags,
    employees,
    setEmployees,
    errors,
    setErrors,
  } = useModalContext();

  const [fileList, setFileList] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [favoriteSupervisors, setFavoriteSupervisors] = useState([]);
  const [showNewReportModal, setShowNewReportModal] = useState(false);

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.TaskID = 0;
    record.Title = "";
    record.DetailsText = "";
    record.MemberID = 0;
    record.ReminderDate = "";
    record.ReminderTime = "";
    record.Tags = [];
    record.Supervisors = [];
    record.Files = [];

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();
    setRecord(initRecord);

    if (selectedObject) {
      selectedObject.MemberID = selectedObject.ResponseMemberID;

      let files = [];
      selectedObject.Files.forEach((f) => {
        files = [
          ...files,
          {
            uid: f.FileID,
            name: Words.attached_file, //f.filename,
            url: `${taskFilesUrl}/${f.FileName}`,
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

      const { Tags, Employees } = data;

      setTags(Tags);
      setEmployees(Employees);

      //----------------------

      const favorite_supervisors =
        await favoriteSupervisorsService.getAllData();

      setFavoriteSupervisors(favorite_supervisors);
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

      // After updating task we need to get files list separately
      // and then update fileList & record.Files
      if (selectedObject) {
        const saved_files = await service.getTaskFiles(selectedObject.TaskID);

        saved_files.forEach((f) => {
          f.uid = f.FileID;
          f.name = Words.attached_file;
          f.url = `${taskFilesUrl}/${f.FileName}`;
        });

        rec.Files = [...saved_files];
        setRecord(rec);
        setFileList([...saved_files]);
      }
    }
  };

  const handleSelectTag = (tag) => {
    const rec = { ...record };
    rec.Tags = [...rec.Tags, tag];

    setRecord(rec);
  };

  const handleRemoveTag = (tag) => {
    const rec = { ...record };
    rec.Tags = rec.Tags.filter((t) => t.TagID !== tag.TagID);

    setRecord(rec);
  };

  const handleSelectSupervisor = (supervisor) => {
    const rec = { ...record };
    rec.Supervisors = [...rec.Supervisors, supervisor];

    setRecord(rec);
  };

  const handleRemoveSupervisor = (supervisor) => {
    const rec = { ...record };
    rec.Supervisors = rec.Supervisors.filter(
      (s) => s.MemberID !== supervisor.MemberID
    );

    setRecord(rec);
  };

  const handleDelete = async () => {
    await onDelete(selectedObject);
    onCancel();
  };

  const handleTabChange = async (key) => {
    if (key === "task-reports" && selectedObject?.NewReportsCount > 0) {
      await onSeenReports();
    }
  };

  //-----------------------------------------------------------
  const isEdit = selectedObject !== null;

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
        title={Words.employees_tasks}
        buttons={
          selectedObject?.IsDeletable && [
            <Popconfirm
              title={Words.questions.sure_to_delete_task}
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
          ]
        }
      >
        <Form ref={formRef} name="dataForm">
          <Tabs defaultActiveKey="1" onChange={handleTabChange}>
            <TabPane tab={Words.task_details} key="task-info">
              <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
                {isEdit && (
                  <Col xs={24}>
                    <Form.Item label={Words.id}>
                      <Tag color="magenta">
                        {utils.farsiNum(`#${selectedObject.TaskID}`)}
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
                <Col xs={24} md={12}>
                  <DateItem
                    horizontal
                    title={Words.reminder_date}
                    fieldName="ReminderDate"
                    formConfig={formConfig}
                    required
                  />
                </Col>
                <Col xs={24} md={12}>
                  <TimeItem
                    horizontal
                    title={Words.reminder_time}
                    fieldName="ReminderTime"
                    formConfig={formConfig}
                    required
                  />
                </Col>
                <Col xs={24}>
                  <DropdownItem
                    title={Words.task_responsible}
                    dataSource={employees}
                    keyColumn="MemberID"
                    valueColumn="FullName"
                    formConfig={formConfig}
                    required
                  />
                </Col>
                {selectedObject && (
                  <Col xs={24}>
                    <Form.Item>
                      <Alert
                        type={
                          selectedObject.SeenDate.length === 0
                            ? "error"
                            : "info"
                        }
                        message={
                          selectedObject.SeenDate.length === 0 ? (
                            <Space>
                              <UnseenIcon style={{ color: Colors.red[6] }} />
                              <Text style={{ color: Colors.orange[5] }}>
                                {Words.unseen}
                              </Text>
                            </Space>
                          ) : (
                            <Space>
                              <SeenIcon style={{ color: Colors.green[6] }} />
                              <Text
                                style={{ color: Colors.grey[5], fontSize: 12 }}
                              >
                                {utils.farsiNum(
                                  `${Words.seen_in} ${utils.dayNameFromText(
                                    selectedObject.SeenDate
                                  )} - ${utils.colonTime(
                                    selectedObject.SeenTime
                                  )}`
                                )}
                              </Text>
                            </Space>
                          )
                        }
                      />
                    </Form.Item>
                  </Col>
                )}
                <Col xs={24} md={5}>
                  <Form.Item>
                    {record.Supervisors && (
                      <Popover
                        content={
                          <SupervisorsPopupContent
                            supervisors={employees.filter(
                              (e) => e.MemberID !== record.MemberID
                            )}
                            selectedSupervisors={record.Supervisors}
                            favoriteSupervisors={favoriteSupervisors}
                            onClick={handleSelectSupervisor}
                          />
                        }
                        title={Words.supervisors}
                        trigger="click"
                      >
                        <Button
                          icon={<UsersIcon style={{ fontSize: 16 }} />}
                          type={
                            record.Supervisors.length > 0
                              ? "primary"
                              : "default"
                          }
                        >
                          {`${Words.supervisors}${
                            record.Supervisors.length > 0
                              ? utils.farsiNum(
                                  ` (${record.Supervisors.length} ${Words.person})`
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
                    {record.Supervisors?.map((supervisor) => (
                      <Tag
                        key={supervisor.MemberID}
                        color="magenta"
                        closable
                        onClose={() => handleRemoveSupervisor(supervisor)}
                        style={{ margin: 5 }}
                      >
                        {supervisor.FullName}
                      </Tag>
                    ))}
                  </Form.Item>
                </Col>
                <Col xs={24} md={5}>
                  <Form.Item>
                    <Popover
                      content={
                        <TagsPopupContent
                          tags={tags}
                          selectedTags={record.Tags}
                          onClick={handleSelectTag}
                        />
                      }
                      title={Words.tags}
                      trigger="click"
                    >
                      <Button icon={<TagIcon style={{ fontSize: 16 }} />}>
                        {Words.tags}
                      </Button>
                    </Popover>
                  </Form.Item>
                </Col>
                <Col xs={24} md={19}>
                  <Form.Item>
                    {record.Tags?.map((tag) => (
                      <Tag
                        key={tag.TagID}
                        color={tag.Color}
                        closable
                        onClose={() => handleRemoveTag(tag)}
                        style={{ margin: 5 }}
                      >
                        {tag.Title}
                      </Tag>
                    ))}
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item>
                    {!isEdit ||
                    (isEdit && selectedObject.SeenDate.length === 0) ? (
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
                          href={`${taskFilesUrl}/${f.FileName}`}
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
            </TabPane>
            {selectedObject && (
              <TabPane
                tab={
                  <Space>
                    <Text>{`${Words.reports}${
                      selectedObject.Reports.length > 0
                        ? utils.farsiNum(` (${selectedObject.Reports.length})`)
                        : ""
                    }`}</Text>

                    {selectedObject.NewReportsCount > 0 && (
                      <Badge
                        style={{ backgroundColor: "#52c41a" }}
                        count={utils.farsiNum(selectedObject.NewReportsCount)}
                      />
                    )}
                  </Space>
                }
                key="task-reports"
              >
                <Row gutter={[10, 5]}>
                  {selectedObject.Reports.length === 0 && (
                    <Col xs={24}>
                      <Alert
                        type="warning"
                        showIcon
                        message={Words.messages.no_any_report}
                      />
                    </Col>
                  )}

                  <Col xs={24}>
                    <Button
                      type="primary"
                      icon={<PlusIcon />}
                      onClick={() => setShowNewReportModal(true)}
                    >
                      {Words.new_report}
                    </Button>
                  </Col>

                  {selectedObject.Reports.map((report) => (
                    <Col xs={24} key={report.ReportID}>
                      <Alert
                        type="success"
                        message={
                          <Row gutter={[10, 5]}>
                            <Col xs={24}>
                              <Space>
                                <Tag color="blue">
                                  {utils.farsiNum(`#${report.ReportID}`)}
                                </Tag>

                                <MemberProfileImage
                                  fileName={report.PicFileName}
                                  size="small"
                                />

                                <Text
                                  style={{ fontSize: 12 }}
                                >{`${report.FirstName} ${report.LastName}`}</Text>
                              </Space>
                            </Col>
                            <Col xs={24}>
                              <Text
                                style={{
                                  color: Colors.purple[7],
                                  whiteSpace: "pre-line",
                                }}
                              >
                                {utils.farsiNum(report.DetailsText)}
                              </Text>
                            </Col>

                            {report.Files.length > 0 && (
                              <Col xs={24}>
                                {report.Files.map((file) => (
                                  <a
                                    key={file.FileID}
                                    href={`${taskReportFilesUrl}/${file.FileName}`}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <Tag
                                      color="magenta"
                                      icon={<AttachedFileIcon />}
                                    >
                                      {Words.attached_file}
                                    </Tag>
                                  </a>
                                ))}
                              </Col>
                            )}

                            <Col xs={24}>
                              <div
                                style={{
                                  width: "100%",
                                  height: "1px",
                                  borderBottom: "1px dashed grey",
                                  marginTop: 5,
                                  marginBottom: 5,
                                }}
                              />

                              <Space>
                                <CalendarIcon style={{ fontSize: 10 }} />

                                <Text style={{ fontSize: 12 }}>
                                  {utils.farsiNum(
                                    utils.colonTime(report.RegTime)
                                  )}
                                </Text>

                                <ClockIcon style={{ fontSize: 10 }} />

                                <Text style={{ fontSize: 12 }}>
                                  {utils.farsiNum(
                                    utils.slashDate(report.RegDate)
                                  )}
                                </Text>
                              </Space>
                            </Col>
                          </Row>
                        }
                        action={
                          report.IsDeletable && (
                            <Popconfirm
                              title={Words.questions.sure_to_delete_report}
                              onConfirm={async () =>
                                await onDeleteReport(report)
                              }
                              okText={Words.yes}
                              cancelText={Words.no}
                              icon={<QuestionIcon style={{ color: "red" }} />}
                            >
                              <Button size="small" icon={<DeleteIcon />} />
                            </Popconfirm>
                          )
                        }
                      />
                    </Col>
                  ))}
                </Row>
              </TabPane>
            )}
          </Tabs>
        </Form>
      </ModalWindow>

      {showNewReportModal && (
        <NewReportModal
          onOk={onSubmitReport}
          onCancel={() => setShowNewReportModal(false)}
          isOpen={showNewReportModal}
          task={selectedObject}
        />
      )}
    </>
  );
};

export default UserEmployeeTaskModal;
