import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../../../common/modal-window";
import Words from "../../../../../../resources/words";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
  handleError,
} from "../../../../../../tools/form-manager";
import service from "../../../../../../services/financial/treasury/collector-agent/collector-agents-service";
import NumericInputItem from "../../../../../form-controls/numeric-input-item";
import DropdownItem from "../../../../../form-controls/dropdown-item";
import DateItem from "../../../../../form-controls/date-item";
import SwitchItem from "../../../../../form-controls/switch-item";
import {
  useModalContext,
  useResetContext,
} from "../../../../../contexts/modal-context";

const schema = {
  CollectorAgentID: Joi.number().required(),
  TafsilAccountID: Joi.number().min(1).required().label(Words.tafsil_account),
  AllocatedCeiling: Joi.number()
    .min(0)
    .required()
    .label(Words.allocated_ceiling),
  AppointmentDate: Joi.string().required().label(Words.appointment_date),
  IsActive: Joi.boolean(),
};

const initRecord = {
  CollectorAgentID: 0,
  TafsilAccountID: 0,
  AllocatedCeiling: 0,
  AppointmentDate: "",
  IsActive: true,
};

const formRef = React.createRef();

const CollectorAgentModal = ({ isOpen, selectedObject, onOk, onCancel }) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [tafsilAccounts, setTafsilAccounts] = useState([]);

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.TafsilAccountID = 0;
    record.AllocatedCeiling = 0;
    record.AppointmentDate = "";
    record.IsActive = true;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();
    setRecord(initRecord);
    loadFieldsValue(formRef, initRecord);
    initModal(formRef, selectedObject, setRecord);

    //------

    setProgress(true);

    try {
      const data = await service.getParams();

      let { TafsilAccounts } = data;

      setTafsilAccounts(TafsilAccounts);
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

  const getTafsilAccounts = () => {
    let tafsil_accounts = [];

    tafsilAccounts.forEach((acc) => {
      tafsil_accounts = [
        ...tafsil_accounts,
        {
          TafsilAccountID: acc.TafsilAccountID,
          Title: `${acc.TafsilCode} - ${acc.Title}`,
        },
      ];
    });

    return tafsil_accounts;
  };

  //------

  return (
    <ModalWindow
      isOpen={isOpen}
      isEdit={isEdit}
      inProgress={progress}
      disabled={validateForm({ record, schema }) && true}
      onClear={clearRecord}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      width={950}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.tafsil_account}
              dataSource={getTafsilAccounts()}
              keyColumn="TafsilAccountID"
              valueColumn="Title"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              title={Words.allocated_ceiling}
              fieldName="AllocatedCeiling"
              min={0}
              max={999999999999}
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              required
              title={Words.appointment_date}
              fieldName="AppointmentDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
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

export default CollectorAgentModal;
