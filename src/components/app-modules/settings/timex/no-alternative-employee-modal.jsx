import React from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "./../../../common/modal-window";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
  handleError,
} from "../../../../tools/form-manager";
import DropdownItem from "./../../../form-controls/dropdown-item";
import TextItem from "./../../../form-controls/text-item";
import service from "./../../../../services/settings/timex/no-alternative-employees-service";
import utils from "./../../../../tools/utils";
import {
  useModalContext,
  useResetContext,
} from "./../../../contexts/modal-context";

const schema = {
  AlternativeID: Joi.number().required(),
  MemberID: Joi.number().required().min(1),
};

const initRecord = {
  AlternativeID: 0,
  MemberID: 0,
};

const formRef = React.createRef();

const NoAlternativeEmployeeModal = ({
  isOpen,
  selectedObject,
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
    employees,
    setEmployees,
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
    record.AlternativeID = 0;
    record.MemberID = 0;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();
    setRecord(initRecord);
    initModal(formRef, selectedObject, setRecord);

    try {
      const data = await service.getParams();

      setEmployees(data.Employees);
    } catch (err) {
      handleError(err);
    }
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
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          {isEdit && (
            <Col xs={24}>
              <TextItem
                title={Words.employee}
                value={`${record.FirstName} ${record.LastName}`}
                valueColor={Colors.magenta[6]}
              />
            </Col>
          )}

          {!isEdit && (
            <Col xs={24}>
              <DropdownItem
                title={Words.employee}
                dataSource={employees}
                keyColumn="MemberID"
                valueColumn="FullName"
                formConfig={formConfig}
                required
                autoFocus
              />
            </Col>
          )}

          {isEdit && (
            <>
              <Col xs={24} ms={12}>
                <TextItem
                  title={Words.reg_member}
                  value={`${record.RegFirstName} ${record.RegLastName}`}
                  valueColor={Colors.magenta[6]}
                />
              </Col>
              <Col xs={24} md={12}>
                <TextItem
                  title={Words.reg_date_time}
                  value={utils.formattedDateTime(
                    record.RegDate,
                    record.RegTime
                  )}
                  valueColor={Colors.magenta[6]}
                />
              </Col>
            </>
          )}
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default NoAlternativeEmployeeModal;
