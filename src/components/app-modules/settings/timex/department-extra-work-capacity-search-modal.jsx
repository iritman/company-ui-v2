import React, { useState } from "react";
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
import service from "../../../../services/settings/timex/department-extra-work-capacities-service";
import DropdownItem from "./../../../form-controls/dropdown-item";
import NumericInputItem from "../../../form-controls/numeric-input-item";
import utils from "./../../../../tools/utils";

const currentYear = utils.currentPersianDateWithoutSlash().substring(0, 4);

const schema = {
  DepartmentID: Joi.number(),
  Year: Joi.number().min(1400).required().label(Words.year),
};

const initRecord = {
  DepartmentID: 0,
  Year: currentYear,
};

const formRef = React.createRef();

const DepartmentExtraWorkCapacitySearchModal = ({
  isOpen,
  filter,
  onOk,
  onCancel,
}) => {
  const [year, setYear] = useState(currentYear);

  const {
    progress,
    setProgress,
    record,
    setRecord,
    errors,
    setErrors,
    departments,
    setDepartments,
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
    record.DepartmentID = 0;
    record.Year = year;

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

      const { Departments, CurrentYear } = data;

      setDepartments(Departments);
      setYear(CurrentYear);
      record.Year = CurrentYear;
      loadFieldsValue(formRef, record);
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
      width={550}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[10, 5]} style={{ marginLeft: 1 }}>
          <Col xs={24}>
            <NumericInputItem
              horizontal
              required
              title={Words.year}
              fieldName="Year"
              min={1400}
              max={1499}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24}>
            <DropdownItem
              title={Words.department}
              dataSource={departments}
              keyColumn="DepartmentID"
              valueColumn="DepartmentTitle"
              formConfig={formConfig}
              autoFocus
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default DepartmentExtraWorkCapacitySearchModal;
