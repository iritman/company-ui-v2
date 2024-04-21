import React from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../common/modal-window";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
  handleError,
} from "../../../../tools/form-manager";
import DropdownItem from "../../../form-controls/dropdown-item";
import TextItem from "../../../form-controls/text-item";
import InputItem from "../../../form-controls/input-item";
import SwitchItem from "../../../form-controls/switch-item";
import DateItem from "../../../form-controls/date-item";
import NumericInputItem from "../../../form-controls/numeric-input-item";
import employeesService from "../../../../services/settings/org/employees-service";
import accessesService from "../../../../services/app/accesses-service";
import MemberProfileImage from "../../../common/member-profile-image";
import {
  useModalContext,
  useResetContext,
} from "../../../contexts/modal-context";

const schema = {
  EmployeeID: Joi.number().required(),
  MemberID: Joi.number().required().min(1),
  DepartmentID: Joi.number().required().min(1),
  RoleID: Joi.number().required().min(1),
  IsDepartmentManager: Joi.boolean(),
  IsDepartmentSupervisor: Joi.boolean(),
  CardNo: Joi.number().required().min(1).label(Words.card_no),
  IsMarried: Joi.boolean(),
  MarriageDate: Joi.string().allow(""),
  FatherName: Joi.string().allow(""),
  PersonalID: Joi.string().allow(""),
  Childs: Joi.number(),
  RelativeTelRole1: Joi.string().allow(""),
  RelativeTel1: Joi.string().allow(""),
  RelativeTelRole2: Joi.string().allow(""),
  RelativeTel2: Joi.string().allow(""),
  SaftehNo1: Joi.string().allow(""),
  SaftehNo2: Joi.string().allow(""),
  EduLevelID: Joi.number(),
  EduFieldID: Joi.number(),
  UniversityID: Joi.number(),
  LatestEduAverage: Joi.number()
    .positive()
    .allow(0)
    .precision(2)
    .label(Words.latest_edu_average),
  EmploymentTypeID: Joi.number(),
  EmploymentStatusID: Joi.number(),
  EmploymentStartDate: Joi.string().allow(""),
  EmploymentFinishDate: Joi.string().allow(""),
  WorkPlaceID: Joi.number(),
  WorkGroupID: Joi.number().min(1),
};

const initRecord = {
  EmployeeID: 0,
  MemberID: 0,
  DepartmentID: 0,
  RoleID: 0,
  IsDepartmentManager: false,
  IsDepartmentSupervisor: false,
  CardNo: 0,
  IsMarried: false,
  MarriageDate: "",
  FatherName: "",
  PersonalID: "",
  Childs: 0,
  RelativeTelRole1: "",
  RelativeTel1: "",
  RelativeTelRole2: "",
  RelativeTel2: "",
  SaftehNo1: "",
  SaftehNo2: "",
  EduLevelID: 0,
  EduFieldID: 0,
  UniversityID: 0,
  LatestEduAverage: 0,
  EmploymentTypeID: 0,
  EmploymentStatusID: 0,
  EmploymentStartDate: "",
  EmploymentFinishDate: "",
  WorkPlaceID: 0,
  WorkGroupID: 0,
};

const formRef = React.createRef();

const EmployeeModal = ({ isOpen, selectedObject, onOk, onCancel }) => {
  const {
    memberSearchProgress,
    setMemberSearchProgress,
    departments,
    setDepartments,
    roles,
    setRoles,
    eduLevels,
    setEduLevels,
    eduFields,
    setEduFields,
    universities,
    setUniversities,
    employmentTypes,
    setEmploymentTypes,
    employmentStatuses,
    setEmploymentStatuses,
    workPlaces,
    setWorkPlaces,
    workGroups,
    setWorkGroups,
    members,
    setMembers,
    progress,
    setProgress,
    record,
    setRecord,
    errors,
    setErrors,
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
    record.EmployeeID = 0;
    record.MemberID = 0;
    record.DepartmentID = 0;
    record.RoleID = 0;
    record.IsDepartmentManager = false;
    record.IsDepartmentSupervisor = false;
    record.CardNo = 0;
    record.IsMarried = false;
    record.MarriageDate = "";
    record.FatherName = "";
    record.PersonalID = "";
    record.Childs = 0;
    record.RelativeTelRole1 = "";
    record.RelativeTel1 = "";
    record.RelativeTelRole2 = "";
    record.RelativeTel2 = "";
    record.SaftehNo1 = "";
    record.SaftehNo2 = "";
    record.EduLevelID = 0;
    record.EduFieldID = 0;
    record.UniversityID = 0;
    record.LatestEduAverage = 0;
    record.EmploymentTypeID = 0;
    record.EmploymentStatusID = 0;
    record.EmploymentStartDate = "";
    record.EmploymentFinishDate = "";
    record.WorkPlaceID = 0;
    record.WorkGroupID = 0;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();
    setRecord(initRecord);
    initModal(formRef, selectedObject, setRecord);

    const data = await employeesService.getParams();

    const {
      Departments,
      Roles,
      EduLevels,
      EduFields,
      Universities,
      EmploymentTypes,
      EmploymentStatuses,
      WorkPlaces,
      WorkGroups,
    } = data;

    setDepartments(Departments);
    setRoles(Roles);
    setEduLevels(EduLevels);
    setEduFields(EduFields);
    setUniversities(Universities);
    setEmploymentTypes(EmploymentTypes);
    setEmploymentStatuses(EmploymentStatuses);
    setWorkPlaces(WorkPlaces);
    setWorkGroups(WorkGroups);
  });

  const handleSubmit = async () => {
    saveModalChanges(
      formConfig,
      selectedObject,
      setProgress,
      onOk,
      clearRecord
    );
  };

  const handleSearchMembers = async (searchValue) => {
    setMemberSearchProgress(true);

    try {
      const data = await accessesService.searchMembers(
        "Employees",
        searchValue
      );

      setMembers(data);
    } catch (ex) {
      handleError(ex);
    }

    setMemberSearchProgress(false);
  };

  const isEdit = selectedObject !== null;

  const handleDepartmentManagerChange = (checked) => {
    record.IsDepartmentManager = checked;

    if (checked === true) record.IsDepartmentSupervisor = false;

    setRecord({ ...record });
    loadFieldsValue(formRef, record);
  };

  const handleDepartmentSupervisorChange = (checked) => {
    record.IsDepartmentSupervisor = checked;

    if (checked === true) record.IsDepartmentManager = false;

    setRecord({ ...record });
    loadFieldsValue(formRef, record);
  };

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
          {isEdit && (
            <>
              <Col
                xs={24}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <MemberProfileImage fileName={record.PicFileName} size={60} />
              </Col>
              <Col xs={24}>
                <TextItem
                  title={Words.member}
                  value={`${record.FirstName} ${record.LastName}`}
                  valueColor={Colors.magenta[6]}
                />
              </Col>
            </>
          )}

          {!isEdit && (
            <Col xs={24}>
              <DropdownItem
                title={Words.member}
                dataSource={members}
                keyColumn="MemberID"
                valueColumn="FullName"
                formConfig={formConfig}
                required
                autoFocus
                loading={memberSearchProgress}
                onSearch={handleSearchMembers}
              />
            </Col>
          )}

          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.department}
              dataSource={departments}
              keyColumn="DepartmentID"
              valueColumn="DepartmentTitle"
              formConfig={formConfig}
              required
              autoFocus={isEdit}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.role}
              dataSource={roles}
              keyColumn="RoleID"
              valueColumn="RoleTitle"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              required
              title={Words.card_no}
              fieldName="CardNo"
              min={0}
              max={99999}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <SwitchItem
              title={Words.is_married}
              fieldName="IsMarried"
              initialValue={false}
              checkedTitle={Words.married}
              unCheckedTitle={Words.single}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <SwitchItem
              title={Words.department_manager}
              fieldName="IsDepartmentManager"
              initialValue={false}
              checkedTitle={Words.active}
              unCheckedTitle={Words.inactive}
              onChange={handleDepartmentManagerChange}
            />
          </Col>
          <Col xs={24} md={12}>
            <SwitchItem
              title={Words.department_supervisor}
              fieldName="IsDepartmentSupervisor"
              initialValue={false}
              checkedTitle={Words.active}
              unCheckedTitle={Words.inactive}
              onChange={handleDepartmentSupervisorChange}
            />
          </Col>
          {record.IsMarried && (
            <Col xs={24} md={12}>
              <DateItem
                horizontal
                title={Words.marriage_date}
                fieldName="MarriageDate"
                formConfig={formConfig}
              />
            </Col>
          )}
          <Col xs={24} md={12}>
            <InputItem
              title={Words.father_name}
              fieldName="FatherName"
              maxLength={50}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.personal_id}
              fieldName="PersonalID"
              maxLength={50}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              title={Words.childs_count}
              fieldName="Childs"
              min={0}
              max={9}
              formConfig={formConfig}
            />
          </Col>
          {!isEdit && <Col xs={24} md={12}></Col>}
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.edu_level}
              dataSource={eduLevels}
              keyColumn="EduLevelID"
              valueColumn="EduLevelTitle"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.edu_field}
              dataSource={eduFields}
              keyColumn="EduFieldID"
              valueColumn="EduFieldTitle"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.university}
              dataSource={universities}
              keyColumn="UniversityID"
              valueColumn="UniversityTitle"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              title={Words.latest_edu_average}
              fieldName="LatestEduAverage"
              min={0}
              max={20}
              precision={2}
              maxLength={4}
              step="0.01"
              stringMode
              decimalText
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.employment_type}
              dataSource={employmentTypes}
              keyColumn="EmploymentTypeID"
              valueColumn="EmploymentTypeTitle"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.employment_status}
              dataSource={employmentStatuses}
              keyColumn="EmploymentStatusID"
              valueColumn="EmploymentStatusTitle"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.employment_start_date}
              fieldName="EmploymentStartDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.employment_finish_date}
              fieldName="EmploymentFinishDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.work_place}
              dataSource={workPlaces}
              keyColumn="WorkPlaceID"
              valueColumn="WorkPlaceTitle"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.work_groups}
              dataSource={workGroups}
              keyColumn="WorkGroupID"
              valueColumn="WorkGroupTitle"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={utils.farsiNum(Words.relative_tel_role_1)}
              fieldName="RelativeTelRole1"
              maxLength={50}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={utils.farsiNum(Words.relative_tel_1)}
              fieldName="RelativeTel1"
              maxLength={50}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={utils.farsiNum(Words.relative_tel_role_2)}
              fieldName="RelativeTelRole2"
              maxLength={50}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={utils.farsiNum(Words.relative_tel_2)}
              fieldName="RelativeTel2"
              maxLength={50}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={utils.farsiNum(Words.safteh_no_1)}
              fieldName="SaftehNo1"
              maxLength={50}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={utils.farsiNum(Words.safteh_no_2)}
              fieldName="SaftehNo2"
              maxLength={50}
              formConfig={formConfig}
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default EmployeeModal;
