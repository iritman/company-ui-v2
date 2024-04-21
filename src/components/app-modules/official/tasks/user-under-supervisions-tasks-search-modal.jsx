import React from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../common/modal-window";
import Words from "../../../../resources/words";
import utils from "../../../../tools/utils";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  handleError,
} from "../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "../../../contexts/modal-context";
import service from "../../../../services/official/tasks/my-tasks-service";
import DropdownItem from "./../../../form-controls/dropdown-item";
import DateItem from "../../../form-controls/date-item";
import InputItem from "./../../../form-controls/input-item";
import SwitchItem from "./../../../form-controls/switch-item";

const schema = {
  MemberID: Joi.number(),
  DepartmentID: Joi.number(),
  HasNewReport: Joi.boolean(),
  UnfinishedTasks: Joi.boolean(),
  FromDoneDate: Joi.string().allow(""),
  ToDoneDate: Joi.string().allow(""),
  FromReminderDate: Joi.string().allow(""),
  ToReminderDate: Joi.string().allow(""),
  SearchText: Joi.string()
    .min(3)
    .max(50)
    .allow("")
    .regex(utils.VALID_REGEX)
    .label(Words.search_text),
};

const initRecord = {
  MemberID: 0,
  DepartmentID: 0,
  HasNewReport: false,
  UnfinishedTasks: false,
  FromDoneDate: "",
  ToDoneDate: "",
  FromReminderDate: "",
  ToReminderDate: "",
  SearchText: "",
};

const formRef = React.createRef();

const UserUnderSupervisionTasksSearchModal = ({
  isOpen,
  filter,
  onOk,
  onCancel,
}) => {
  const {
    progress,
    setProgress,
    record,
    setRecord,
    errors,
    setErrors,
    employees,
    setEmployees,
    departments,
    setDepartments,
  } = useModalContext();

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.MemberID = 0;
    record.DepartmentID = 0;
    record.HasNewReport = false;
    record.UnfinishedTasks = false;
    record.FromDoneDate = "";
    record.ToDoneDate = "";
    record.FromReminderDate = "";
    record.ToReminderDate = "";
    record.SearchText = "";

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();

    setRecord(initRecord);
    initModal(formRef, filter, setRecord);

    setProgress(true);
    try {
      const data = await service.getSearchUnderSupervisionTasksParams();

      const { Employees, Departments } = data;

      setEmployees(Employees);
      setDepartments(Departments);
    } catch (err) {
      handleError(err);
    }
    setProgress(false);
  });

  return (
    <ModalWindow
      isOpen={isOpen}
      inProgress={progress}
      disabled={
        !utils.hasSelectedFilter(record, initRecord) ||
        (validateForm({ record, schema }) && true)
      }
      searchModal
      onClear={clearRecord}
      onSubmit={() => onOk(record)}
      onCancel={onCancel}
      width={750}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[10, 5]} style={{ marginLeft: 1 }}>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.definer}
              dataSource={employees}
              keyColumn="MemberID"
              valueColumn="FullName"
              formConfig={formConfig}
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.department}
              dataSource={departments}
              keyColumn="DepartmentID"
              valueColumn="Title"
              formConfig={formConfig}
              autoFocus
            />
          </Col>
          <Col xs={12}>
            <SwitchItem
              title={Words.has_new_report}
              fieldName="HasNewReport"
              initialValue={false}
              checkedTitle={Words.yes}
              unCheckedTitle={Words.no}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={12}>
            <SwitchItem
              title={Words.in_progress_task}
              fieldName="UnfinishedTasks"
              initialValue={false}
              checkedTitle={Words.yes}
              unCheckedTitle={Words.no}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.from_reminder_date}
              fieldName="FromReminderDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.to_reminder_date}
              fieldName="ToReminderDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.from_done_date}
              fieldName="FromDoneDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.to_done_date}
              fieldName="ToDoneDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24}>
            <InputItem
              title={Words.search_text}
              fieldName="SearchText"
              maxLength={50}
              formConfig={formConfig}
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default UserUnderSupervisionTasksSearchModal;
