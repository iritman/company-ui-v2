import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Progress, Statistic } from "antd";
import Joi from "joi-browser";
import ModalWindow from "./../../../common/modal-window";
import Words from "../../../../resources/words";
import Colors from "./../../../../resources/colors";
import utils from "../../../../tools/utils";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
  handleError,
} from "../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "./../../../contexts/modal-context";
import service from "../../../../services/official/timex/user-members-extra-work-requests-service";
import DropdownItem from "./../../../form-controls/dropdown-item";
import MultiSelectItem from "./../../../form-controls/multi-select-item";
import DateItem from "../../../form-controls/date-item";
import TimeItem from "../../../form-controls/time-item";
import InputItem from "../../../form-controls/input-item";

const schema = {
  RequestID: Joi.number().required(),
  SourceID: Joi.number(),
  StartDate: Joi.string().required(),
  FinishDate: Joi.string().required(),
  StartTime: Joi.string().required(),
  FinishTime: Joi.string().required(),
  Employees: Joi.array(),
  EmployeesIDs: Joi.array(),
  DetailsText: Joi.string().allow("").max(512),
};

const initRecord = {
  RequestID: 0,
  SourceID: 0,
  StartDate: "",
  FinishDate: "",
  StartTime: "",
  FinishTime: "",
  Employees: [],
  EmployeesIDs: [],
  DetailsText: "",
};

const formRef = React.createRef();

const UserMembersExtraWorkRequestModal = ({
  isOpen,
  selectedObject,
  onOk,
  onCancel,
}) => {
  const [capacityInfo, setCapacityInfo] = useState({
    TotalCapacityInMin: 0,
    UsedCapacityInMin: 0,
    RemainCapacityInMin: 0,
    UsedCapacityInPercent: 0,
  });

  const {
    progress,
    setProgress,
    record,
    setRecord,
    errors,
    setErrors,
    commandSources,
    setCommandSources,
    members,
    setMembers,
  } = useModalContext();

  const resetContext = useResetContext();

  const clearRecord = async () => {
    setProgress(true);
    try {
      record.SourceID = 0;
      record.StartDate = "";
      record.FinishDate = "";
      record.StartTime = "";
      record.FinishTime = "";
      record.Employees = [];
      record.EmployeesIDs = [];
      record.DetailsText = "";

      setRecord(record);
      setErrors({});
      loadFieldsValue(formRef, record);
    } catch (err) {
      handleError(err);
    }
    setProgress(false);
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

    setProgress(true);
    try {
      const data = await service.getParams();

      const {
        CommandSources,
        Members,
        TotalCapacityInMin,
        UsedCapacityInMin,
        RemainCapacityInMin,
        UsedCapacityInPercent,
      } = data;

      setCapacityInfo({
        TotalCapacityInMin,
        UsedCapacityInMin,
        RemainCapacityInMin,
        UsedCapacityInPercent,
      });
      setCommandSources(CommandSources);
      setMembers(Members);
    } catch (err) {
      handleError(err);
    }
    setProgress(false);
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
            <Form.Item label={Words.extra_work_capacity}>
              <Row>
                <Col xs={24}>
                  <Progress percent={capacityInfo.UsedCapacityInPercent} />
                </Col>
                <Col xs={24} md={8}>
                  <Statistic
                    title={Words.total}
                    value={utils.farsiNum(
                      utils.minToTime(capacityInfo.TotalCapacityInMin)
                    )}
                    valueStyle={{ color: Colors.blue[6] }}
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Statistic
                    title={Words.used}
                    value={utils.farsiNum(
                      utils.minToTime(capacityInfo.UsedCapacityInMin)
                    )}
                    valueStyle={{ color: Colors.red[6] }}
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Statistic
                    title={Words.remain}
                    value={utils.farsiNum(
                      utils.minToTime(capacityInfo.RemainCapacityInMin)
                    )}
                    valueStyle={{ color: Colors.green[6] }}
                  />
                </Col>
              </Row>
            </Form.Item>
          </Col>

          <Col xs={24}>
            <DropdownItem
              title={Words.extra_work_command_source}
              dataSource={commandSources}
              keyColumn="SourceID"
              valueColumn="Title"
              formConfig={formConfig}
              autoFocus
            />
          </Col>
          <Col xs={24}>
            <MultiSelectItem
              title={Words.employees}
              dataSource={members}
              keyColumn="MemberID"
              valueColumn="FullName"
              fieldName="Employees"
              fieldIDs="EmployeesIDs"
              formConfig={formConfig}
              required
            />
          </Col>

          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.start_date}
              fieldName="StartDate"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <TimeItem
              horizontal
              title={Words.start_time}
              fieldName="StartTime"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.finish_date}
              fieldName="FinishDate"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <TimeItem
              horizontal
              title={Words.finish_time}
              fieldName="FinishTime"
              formConfig={formConfig}
              required
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
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default UserMembersExtraWorkRequestModal;
