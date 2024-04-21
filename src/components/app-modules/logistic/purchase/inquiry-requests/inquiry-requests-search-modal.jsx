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
import service from "../../../../../services/logistic/purchase/inquiry-requests-service";
import DropdownItem from "../../../../form-controls/dropdown-item";
import DateItem from "../../../../form-controls/date-item";
import NumericInputItem from "../../../../form-controls/numeric-input-item";

const schema = {
  RequestID: Joi.number().label(Words.id),
  FromDate: Joi.string().allow(""),
  ToDate: Joi.string().allow(""),
  StatusID: Joi.number(),
  RequestTypeID: Joi.number(),
};

const initRecord = {
  RequestID: 0,
  FromDate: "",
  ToDate: "",
  StatusID: 0,
  RequestTypeID: 0,
};

const formRef = React.createRef();

const InquiryRequestsSearchModal = ({ isOpen, filter, onOk, onCancel }) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [statuses, setStatuses] = useState([]);
  const [inquiryRequestTypes, setInquiryRequestTypes] = useState([]);

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.RequestID = 0;
    record.FromDate = "";
    record.ToDate = "";
    record.StatusID = 0;
    record.RequestTypeID = 0;

    setErrors({});
    setRecord(record);
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();

    setRecord(initRecord);
    initModal(formRef, filter, setRecord);

    setProgress(true);
    try {
      const data = await service.getSearchParams();

      const { Statuses, RequestTypes } = data;

      setStatuses(Statuses);
      setInquiryRequestTypes(RequestTypes);
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
      width={850}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[10, 5]} style={{ marginLeft: 1 }}>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              title={Words.id}
              fieldName="RequestID"
              min={0}
              max={9999999999}
              formConfig={formConfig}
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.request_type}
              dataSource={inquiryRequestTypes}
              keyColumn="RequestTypeID"
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
          <Col xs={24}>
            <DropdownItem
              title={Words.status}
              dataSource={statuses}
              keyColumn="StatusID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default InquiryRequestsSearchModal;
