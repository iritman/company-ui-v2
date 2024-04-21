import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Space, Typography } from "antd";
import Joi from "joi-browser";
import ModalWindow from "./../../../common/modal-window";
import Words from "../../../../resources/words";
import Colors from "./../../../../resources/colors";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
} from "../../../../tools/form-manager";
import DropdownItem from "./../../../form-controls/dropdown-item";
import SwitchItem from "./../../../form-controls/switch-item";
import { handleError } from "./../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "./../../../contexts/modal-context";
import service from "../../../../services/official/tasks/top-supervisors-service";

const { Text } = Typography;

const schema = {
  TopSupervisorID: Joi.number().required(),
  MemberID: Joi.number().min(1).required().label(Words.selected_supervisor),
  IsActive: Joi.boolean(),
};

const initRecord = {
  TopSupervisorID: 0,
  MemberID: 0,
  IsActive: true,
};

const formRef = React.createRef();

const UserTopSupervisorModal = ({ isOpen, selectedObject, onOk, onCancel }) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [employees, setEmployees] = useState([]);

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
    record.IsActive = true;

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

      const { Employees } = data;

      setEmployees(Employees);
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
          {selectedObject === null ? (
            <Col xs={24}>
              <DropdownItem
                title={Words.top_supervisor}
                dataSource={employees}
                keyColumn="MemberID"
                valueColumn="FullName"
                formConfig={formConfig}
                required
              />
            </Col>
          ) : (
            <Col xs={24}>
              <Space style={{ marginBottom: 10 }}>
                <Text>{Words.top_supervisor}</Text>
                <Text style={{ color: Colors.magenta[6] }}>
                  {`${selectedObject.FirstName} ${selectedObject.LastName}`}
                </Text>
              </Space>
            </Col>
          )}

          <Col xs={24}>
            <SwitchItem
              title={Words.status}
              fieldName="IsActive"
              initialValue={true}
              checkedTitle={Words.active}
              unCheckedTitle={Words.inactive}
              formConfig={formConfig}
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default UserTopSupervisorModal;
