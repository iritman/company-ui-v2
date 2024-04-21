import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "./../../../common/modal-window";
import Words from "../../../../resources/words";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
} from "../../../../tools/form-manager";
import DropdownItem from "./../../../form-controls/dropdown-item";
import { handleError } from "./../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "./../../../contexts/modal-context";
import service from "../../../../services/official/tasks/selected-supervisors-service";

const schema = {
  SSID: Joi.number().required(),
  SupervisorMemberID: Joi.number()
    .min(1)
    .required()
    .label(Words.selected_supervisor),
};

const initRecord = {
  SSID: 0,
  SupervisorMemberID: 0,
};

const formRef = React.createRef();

const UserSelectedSupervisorModal = ({
  isOpen,
  selectedObject,
  onOk,
  onCancel,
}) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [supervisors, setSupervisors] = useState([]);

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.SupervisorMemberID = 0;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();
    setRecord(initRecord);
    initModal(formRef, selectedObject, setRecord);

    setProgress(true);
    try {
      const data = await service.getParams();

      const { Supervisors } = data;

      setSupervisors(Supervisors);
    } catch (ex) {
      handleError(ex);
    }
    setProgress(false);
  });

  const isEdit = selectedObject !== null;

  const handleSubmit = async () => {
    saveModalChanges(
      formConfig,
      selectedObject,
      setProgress,
      onOk,
      clearRecord
    );

    setSupervisors(
      supervisors.filter(
        (s) => s.SupervisorMemberID !== record.SupervisorMemberID
      )
    );
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
      width={650}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24}>
            <DropdownItem
              title={Words.selected_supervisor}
              dataSource={supervisors}
              keyColumn="SupervisorMemberID"
              valueColumn="FullName"
              formConfig={formConfig}
              required
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default UserSelectedSupervisorModal;
