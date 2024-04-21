import React from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Typography } from "antd";
import Joi from "joi-browser";
import ModalWindow from "./../../../common/modal-window";
import Words from "../../../../resources/words";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
} from "../../../../tools/form-manager";
import service from "../../../../services/official/timex/user-official-check-vacation-cardexes-service";
import utils from "./../../../../tools/utils";
import {
  useModalContext,
  useResetContext,
} from "./../../../contexts/modal-context";
import DropdownItem from "../../../form-controls/dropdown-item";
import NumericInputItem from "./../../../form-controls/numeric-input-item";
import { handleError } from "./../../../../tools/form-manager";

const { Text } = Typography;

const schema = {
  CardexID: Joi.number().required(),
  MemberID: Joi.number().min(1).required(),
  CardexYear: Joi.number().min(1400).required().label(Words.year),
  CapacityInMin: Joi.number()
    .min(1)
    .max(144000)
    .required()
    .label(Words.personal_vacation_capacity),
};

const initRecord = {
  CardexID: 0,
  MemberID: 0,
  CardexYear: parseInt(utils.currentPersianDateWithoutSlash().substring(0, 4)),
  CapacityInMin: 0,
};

const formRef = React.createRef();

const UserOfficialCheckVacationCardexModal = ({
  isOpen,
  selectedObject,
  onOk,
  onCancel,
}) => {
  const {
    progress,
    setProgress,
    members,
    setMembers,
    record,
    setRecord,
    errors,
    setErrors,
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
    record.MemberID = 0;
    record.CardexYear = parseInt(
      utils.currentPersianDateWithoutSlash().substring(0, 4)
    );
    record.CapacityInMin = 0;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();
    setRecord(initRecord);
    loadFieldsValue(formRef, initRecord);
    initModal(formRef, selectedObject, setRecord);

    setProgress(true);
    try {
      const data = await service.getParams();

      const { Members, MaxCapacityInMin } = data;

      setMembers(Members);

      if (selectedObject === null) {
        const rec = { ...initRecord };
        rec.CapacityInMin = MaxCapacityInMin;
        setRecord(rec);
        loadFieldsValue(formRef, rec);
      }
    } catch (err) {
      handleError(err);
    }
    setProgress(false);
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
      width={700}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24}>
            <DropdownItem
              required
              title={Words.employee}
              dataSource={members}
              keyColumn="MemberID"
              valueColumn="FullName"
              formConfig={formConfig}
            />
          </Col>

          <Col xs={24} md={8}>
            <NumericInputItem
              horizontal
              required
              title={Words.year}
              fieldName="CardexYear"
              min={1400}
              max={1499}
              formConfig={formConfig}
            />
          </Col>

          <Col xs={20} md={12}>
            <NumericInputItem
              horizontal
              required
              title={Words.personal_vacation_capacity_in_min}
              fieldName="CapacityInMin"
              min={1}
              max={144000}
              formConfig={formConfig}
            />
          </Col>
          {record.CapacityInMin > 0 && (
            <Col xs={4}>
              <Form.Item>
                <Text>
                  {utils.farsiNum(utils.minToTime(record.CapacityInMin))}
                </Text>
              </Form.Item>
            </Col>
          )}
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default UserOfficialCheckVacationCardexModal;
