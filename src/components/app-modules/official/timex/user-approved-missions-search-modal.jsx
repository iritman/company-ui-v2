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
import service from "../../../../services/official/timex/user-approved-missions-service";
import DropdownItem from "../../../form-controls/dropdown-item";
import DateItem from "../../../form-controls/date-item";

const schema = {
  MemberID: Joi.number().required(),
  MissionTypeID: Joi.number(),
  TargetID: Joi.number(),
  FromDate: Joi.string().allow(""),
  ToDate: Joi.string().allow(""),
};

const initRecord = {
  MemberID: 0,
  MissionTypeID: 0,
  TargetID: 0,
  FromDate: "",
  ToDate: "",
};

const formRef = React.createRef();

const UserApprovedMissionsSearchModal = ({
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
    missionTypes,
    setMissionTypes,
    targets,
    setTargets,
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
    record.MissionTypeID = 0;
    record.TargetID = 0;
    record.FromDate = "";
    record.ToDate = "";

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

      const { Members, MissionTypes, Targets } = data;

      setMembers(Members);
      setMissionTypes(MissionTypes);
      setTargets(Targets);
    } catch (err) {
      handleError(err);
    }
    setProgress(false);
  });

  const hasSearchParam = () => {
    let result = false;

    for (const key in record) {
      if (record[key] !== initRecord[key]) {
        result = true;
        break;
      }
    }

    return result;
  };

  return (
    <ModalWindow
      isOpen={isOpen}
      inProgress={progress}
      disabled={!hasSearchParam() || (validateForm({ record, schema }) && true)}
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
              title={Words.mission_type}
              dataSource={missionTypes}
              keyColumn="MissionTypeID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.mission_target}
              dataSource={targets}
              keyColumn="TargetID"
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

export default UserApprovedMissionsSearchModal;
