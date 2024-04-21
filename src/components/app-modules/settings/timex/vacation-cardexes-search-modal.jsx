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
import utils from "./../../../../tools/utils";
import service from "../../../../services/settings/timex/vacation-cardexes-service";
import DropdownItem from "../../../form-controls/dropdown-item";
import NumericInputItem from "./../../../form-controls/numeric-input-item";

const schema = {
  CardexYear: Joi.number().min(1400),
  MemberID: Joi.number(),
};

const initRecord = {
  CardexYear: parseInt(utils.currentPersianDateWithoutSlash().substring(0, 4)),
  MemberID: 0,
};

const formRef = React.createRef();

const VacationCardexesSearchModal = ({ isOpen, filter, onOk, onCancel }) => {
  const {
    progress,
    setProgress,
    record,
    setRecord,
    errors,
    setErrors,
    members,
    setMembers,
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
    record.CardexYear = parseInt(
      utils.currentPersianDateWithoutSlash().substring(0, 4)
    );
    record.MemberID = 0;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();

    setRecord(initRecord);
    loadFieldsValue(formRef, initRecord);
    initModal(formRef, filter, setRecord);

    setProgress(true);
    try {
      const data = await service.getParams();

      const { Members } = data;

      setMembers(Members);
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
      width={650}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[10, 5]} style={{ marginLeft: 1 }}>
          <Col xs={24} md={5}>
            <NumericInputItem
              horizontal
              title={Words.year}
              fieldName="CardexYear"
              min={1400}
              max={1499}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={19}>
            <DropdownItem
              title={Words.employee}
              dataSource={members}
              keyColumn="MemberID"
              valueColumn="FullName"
              formConfig={formConfig}
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default VacationCardexesSearchModal;
