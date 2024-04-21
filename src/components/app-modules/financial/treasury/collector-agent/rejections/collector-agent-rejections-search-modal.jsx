import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../../../common/modal-window";
import Words from "../../../../../../resources/words";
import utils from "../../../../../../tools/utils";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  handleError,
} from "../../../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "../../../../../contexts/modal-context";
import service from "../../../../../../services/financial/treasury/collector-agent/collector-agent-rejections-service";
import DropdownItem from "../../../../../form-controls/dropdown-item";
import DateItem from "../../../../../form-controls/date-item";
import NumericInputItem from "../../../../../form-controls/numeric-input-item";

const schema = {
  RejectionID: Joi.number().label(Words.id),
  AgentID: Joi.number(),
  SubNo: Joi.string().allow("").label(Words.sub_no).regex(utils.VALID_REGEX),
  StatusID: Joi.number(),
  FromDate: Joi.string().allow(""),
  ToDate: Joi.string().allow(""),
  RegMemberID: Joi.number(),
};

const initRecord = {
  RejectionID: 0,
  AgentID: 0,
  SubNo: "",
  StatusID: 0,
  FromDate: "",
  ToDate: "",
  RegMemberID: 0,
};

const formRef = React.createRef();

const CollectorAgentRejectionsSearchModal = ({
  isOpen,
  filter,
  onOk,
  onCancel,
}) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [agents, setAgents] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.RejectionID = 0;
    record.AgentID = 0;
    record.SubNo = "";
    record.StatusID = 0;
    record.FromDate = "";
    record.ToDate = "";
    record.RegMemberID = 0;

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

      const { Agents, Employees, Statuses } = data;

      setAgents(Agents);
      setEmployees(Employees);
      setStatuses(Statuses);
    } catch (err) {
      handleError(err);
    }
    setProgress(false);
  });

  // ------

  return (
    <ModalWindow
      isOpen={isOpen}
      inProgress={progress}
      disabled={validateForm({ record, schema }) && true}
      searchModal
      onClear={clearRecord}
      onSubmit={() => onOk(record)}
      onCancel={onCancel}
      width={900}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[10, 5]} style={{ marginLeft: 1 }}>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              title={Words.id}
              fieldName="RejectionID"
              min={0}
              max={9999999999}
              formConfig={formConfig}
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.collector_agent}
              dataSource={agents}
              keyColumn="AgentID"
              valueColumn="TafsilAccountTitle"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              title={Words.sub_no}
              fieldName="SubNo"
              min={0}
              max={999999999}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.status}
              dataSource={statuses}
              keyColumn="StatusID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={24}>
            <DropdownItem
              title={Words.reg_member}
              dataSource={employees}
              keyColumn="RegMemberID"
              valueColumn="FullName"
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

export default CollectorAgentRejectionsSearchModal;
