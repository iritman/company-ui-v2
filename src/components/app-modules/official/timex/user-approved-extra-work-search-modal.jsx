import React from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../common/modal-window";
import Words from "../../../../resources/words";
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
import service from "../../../../services/official/timex/user-approved-extra-works-service";
import DropdownItem from "../../../form-controls/dropdown-item";
import DateItem from "../../../form-controls/date-item";

const schema = {
  SourceID: Joi.number(),
  FromDate: Joi.string().required(),
  ToDate: Joi.string().allow(""),
  MemberID: Joi.number(),
  DepartmentID: Joi.number(),
};

const initRecord = {
  SourceID: 0,
  FromDate: "",
  ToDate: "",
  MemberID: 0,
  DepartmentID: 0,
};

const formRef = React.createRef();

const UserApprovedExtraWorkSearchModal = ({
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
    members,
    setMembers,
    commandSources,
    setCommandSources,
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
    record.SourceID = 0;
    record.FromDate = "";
    record.ToDate = "";
    record.MemberID = 0;
    record.DepartmentID = 0;

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
      const data = await service.getParams();

      const { Members, CommandSources, Departments } = data;

      setMembers(Members);
      setCommandSources(CommandSources);
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
      disabled={validateForm({ record, schema }) && true}
      searchModal
      onClear={clearRecord}
      onSubmit={() => onOk(record)}
      onCancel={onCancel}
      width={750}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[10, 5]} style={{ marginLeft: 1 }}>
          <Col xs={24}>
            <DropdownItem
              title={Words.employee}
              dataSource={members}
              keyColumn="MemberID"
              valueColumn="FullName"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.extra_work_command_source}
              dataSource={commandSources}
              keyColumn="SourceID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.department}
              dataSource={departments}
              keyColumn="DepartmentID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.from_date}
              fieldName="FromDate"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.to_date}
              fieldName="ToDate"
              formConfig={formConfig}
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default UserApprovedExtraWorkSearchModal;
