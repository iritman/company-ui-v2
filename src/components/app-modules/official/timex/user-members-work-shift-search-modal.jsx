import React from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Spin } from "antd";
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
import service from "../../../../services/official/timex/user-members-work-shifts-service";
import DropdownItem from "./../../../form-controls/dropdown-item";
import NumericInputItem from "./../../../form-controls/numeric-input-item";
import utils from "./../../../../tools/utils";

const currentYear = parseInt(
  utils.currentPersianDateWithoutSlash().substring(0, 4)
);

const schema = {
  EmployeeID: Joi.number().min(1).required(),
  YearNo: Joi.number().min(1).required(),
};

const initRecord = {
  EmployeeID: 0,
  YearNo: currentYear,
};

const formRef = React.createRef();

const UserMembersWorkShiftSearchModal = ({
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
    record.EmployeeID = 0;
    record.YearNo = currentYear;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();

    initModal(formRef, filter || initRecord, setRecord);

    setProgress(true);
    try {
      const data = await service.getParams();

      const { Employees } = data;

      setEmployees(Employees);
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
      <Spin spinning={progress}>
        <Form ref={formRef} name="dataForm">
          <Row gutter={[10, 5]} style={{ marginLeft: 1 }}>
            <Col xs={24} md={5}>
              <NumericInputItem
                horizontal
                required
                title={Words.year}
                fieldName="YearNo"
                min={1400}
                max={1499}
                formConfig={formConfig}
                autoFocus
              />
            </Col>
            <Col xs={24} md={19}>
              <DropdownItem
                title={Words.employee}
                dataSource={employees}
                keyColumn="EmployeeID"
                valueColumn="FullName"
                formConfig={formConfig}
                required
              />
            </Col>
          </Row>
        </Form>
      </Spin>
    </ModalWindow>
  );
};

export default UserMembersWorkShiftSearchModal;
