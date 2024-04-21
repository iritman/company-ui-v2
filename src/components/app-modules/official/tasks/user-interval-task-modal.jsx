import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Steps, Button, Typography, message } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../common/modal-window";
import Words from "../../../../resources/words";
import utils from "../../../../tools/utils";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
} from "../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "../../../contexts/modal-context";
import InputItem from "../../../form-controls/input-item";
import DropdownItem from "../../../form-controls/dropdown-item";
import DateItem from "../../../form-controls/date-item";
import TimeItem from "../../../form-controls/time-item";

const { Text } = Typography;
const { Step } = Steps;

const schema = {
  IntervalID: Joi.number().required(),
  Title: Joi.string()
    .min(2)
    .max(50)
    .required()
    .label(Words.title)
    .regex(utils.VALID_REGEX),
  DetailsText: Joi.string()
    .allow("")
    .max(512)
    .regex(utils.VALID_REGEX)
    .label(Words.descriptions),
  ResponseMemberID: Joi.number().min(10).required(),
  IntervalTypeID: Joi.number().min(10).required(),
};

const initRecord = {
  IntervalID: 0,
  Title: "",
  DetailsText: "",
  ResponseMemberID: 0,
  IntervalTypeID: 0,
};

const formRef = React.createRef();

const UserIntervalTaskModal = ({ isOpen, selectedObject, onOk, onCancel }) => {
  const [current, setCurrent] = useState(0);

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
    record.Title = "";
    record.Title = "";
    record.DetailsText = "";
    record.ResponseMemberID = 0;
    record.IntervalTypeID = 0;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(() => {
    resetContext();
    setRecord(initRecord);
    initModal(formRef, selectedObject, setRecord);
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

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const isEdit = selectedObject !== null;

  const steps = [
    {
      id: 1,
      title: Words.task_info,
      content: (
        <>
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
            <DropdownItem
              title={Words.response_member}
              //   dataSource={members}
              keyColumn="MemberID"
              valueColumn="FullName"
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
        </>
      ),
    },
    {
      id: 2,
      title: Words.timing,
      content: (
        <>
          <Col xs={24}>
            <DropdownItem
              title={Words.interval_type}
              //   dataSource={members}
              keyColumn="MemberID"
              valueColumn="FullName"
              formConfig={formConfig}
              required
            />
          </Col>
        </>
      ),
    },
    {
      id: 3,
      title: Words.run_time,
      content: (
        <>
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
            />
          </Col>
          <Col xs={24} md={12}>
            <TimeItem
              horizontal
              title={Words.finish_time}
              fieldName="FinishTime"
              formConfig={formConfig}
            />
          </Col>
        </>
      ),
    },
    { id: 4, title: Words.supervisors, content: <></> },
  ];

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
            <Steps size="small" current={current}>
              {steps.map((step) => (
                <Step
                  key={step.id}
                  title={<Text style={{ fontSize: 14 }}>{step.title}</Text>}
                />
              ))}
            </Steps>
          </Col>
          <Col xs={24}>
            <div style={{ height: 20 }} />
          </Col>
          {steps[current].content}
          <Col xs={24}>
            {current < 3 && (
              <Button type="primary" onClick={() => next()}>
                Next
              </Button>
            )}
            {current === 3 && (
              <Button
                type="primary"
                onClick={() => message.success("Processing complete!")}
              >
                Done
              </Button>
            )}
            {current > 0 && (
              <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
                Previous
              </Button>
            )}
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default UserIntervalTaskModal;
