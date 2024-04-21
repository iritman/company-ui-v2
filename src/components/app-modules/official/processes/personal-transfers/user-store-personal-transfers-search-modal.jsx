import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../../common/modal-window";
import Words from "../../../../../resources/words";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  handleError,
} from "../../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "../../../../contexts/modal-context";
import service from "../../../../../services/official/processes/user-store-personal-transfers-service";
import DropdownItem from "./../../../../form-controls/dropdown-item";
import DateItem from "../../../../form-controls/date-item";

const schema = {
  TransferMemberID: Joi.number(),
  FromDepartmentID: Joi.number(),
  FromRoleID: Joi.number(),
  ToDepartmentID: Joi.number(),
  ToRoleID: Joi.number(),
  FinalStatusID: Joi.number(),
  FromDate: Joi.string().allow(""),
  ToDate: Joi.string().allow(""),
};

const initRecord = {
  TransferMemberID: 0,
  FromDepartmentID: 0,
  FromRoleID: 0,
  ToDepartmentID: 0,
  ToRoleID: 0,
  FinalStatusID: 0,
  FromDate: "",
  ToDate: "",
};

const formRef = React.createRef();

const UserStorePersonalTransfersSearchModal = ({
  isOpen,
  filter,
  onOk,
  onCancel,
}) => {
  const [finalStatuses, setFinalStatuses] = useState([]);
  const [transferMembers, setTransferMembers] = useState([]);
  const [fromDepartments, setFromDepartments] = useState([]);
  const [fromRoles, setFromRoles] = useState([]);
  const [toDepartments, setToDepartments] = useState([]);
  const [toRoles, setToRoles] = useState([]);

  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.TransferMemberID = 0;
    record.FromDepartmentID = 0;
    record.FromRoleID = 0;
    record.ToDepartmentID = 0;
    record.ToRoleID = 0;
    record.FinalStatusID = 0;
    record.FromDate = "";
    record.ToDate = "";

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  const setMembers = (employees, column_id, set_func) => {
    let members = [];
    employees.forEach((member) => {
      members.push({
        [column_id]: member.MemberID,
        FullName: member.FullName,
      });
    });
    set_func(members);
  };

  const setRoles = (roles, column_id, set_func) => {
    const deps = [...roles];
    deps.forEach((role) => {
      role[column_id] = role.RoleID;
    });
    set_func(deps);
  };

  const setDepartments = (departments, column_id, set_func) => {
    const deps = [...departments];
    deps.forEach((department) => {
      department[column_id] = department.DepartmentID;
    });
    set_func(deps);
  };

  useMount(async () => {
    resetContext();

    setRecord(initRecord);
    initModal(formRef, filter, setRecord);

    setProgress(true);
    try {
      const data = await service.getParams();

      const { Employees, Departments, Roles } = data;

      setMembers(Employees, "TransferMemberID", setTransferMembers);

      setRoles(Roles, "FromRoleID", setFromRoles);
      setRoles(Roles, "ToRoleID", setToRoles);

      setDepartments(Departments, "FromDepartmentID", setFromDepartments);
      setDepartments(Departments, "ToDepartmentID", setToDepartments);

      setFinalStatuses([
        { FinalStatusID: 1, Title: Words.in_progress },
        { FinalStatusID: 2, Title: Words.accepted },
        { FinalStatusID: 3, Title: Words.rejected },
      ]);
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
      onSubmit={async () => await onOk(record)}
      onCancel={onCancel}
      width={750}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[10, 5]} style={{ marginLeft: 1 }}>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.employee}
              dataSource={transferMembers}
              keyColumn="TransferMemberID"
              valueColumn="FullName"
              formConfig={formConfig}
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.status}
              dataSource={finalStatuses}
              keyColumn="FinalStatusID"
              valueColumn="Title"
              formConfig={formConfig}
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.from_department}
              dataSource={fromDepartments}
              keyColumn="FromDepartmentID"
              valueColumn="DepartmentTitle"
              formConfig={formConfig}
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.from_role}
              dataSource={fromRoles}
              keyColumn="FromRoleID"
              valueColumn="RoleTitle"
              formConfig={formConfig}
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.to_department}
              dataSource={toDepartments}
              keyColumn="ToDepartmentID"
              valueColumn="DepartmentTitle"
              formConfig={formConfig}
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.to_role}
              dataSource={toRoles}
              keyColumn="ToRoleID"
              valueColumn="RoleTitle"
              formConfig={formConfig}
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.from_date}
              fieldName="FromDate"
              formConfig={formConfig}
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

export default UserStorePersonalTransfersSearchModal;
