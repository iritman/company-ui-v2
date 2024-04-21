import React from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../../common/modal-window";
import Words from "../../../../../resources/words";
import {
  validateForm,
  loadFieldsValue,
  initModal,
} from "../../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "../../../../contexts/modal-context";
import DateItem from "../../../../form-controls/date-item";

const schema = {
  CheckDate: Joi.string().required(),
};

const initRecord = {
  CheckDate: "",
};

const formRef = React.createRef();

const UserReportMyInOutCardsSearchModal = ({
  isOpen,
  filter,
  onOk,
  onCancel,
}) => {
  const { progress, record, setRecord, errors, setErrors } = useModalContext();

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.CheckDate = "";

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(() => {
    resetContext();

    setRecord(initRecord);
    initModal(formRef, filter, setRecord);
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
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[10, 5]} style={{ marginLeft: 1 }}>
          <Col xs={24}>
            <DateItem
              horizontal
              title={Words.date}
              fieldName="CheckDate"
              formConfig={formConfig}
              required
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default UserReportMyInOutCardsSearchModal;
