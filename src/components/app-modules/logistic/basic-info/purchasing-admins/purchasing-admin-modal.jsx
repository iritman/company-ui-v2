import React from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../../common/modal-window";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
  handleError,
} from "../../../../../tools/form-manager";
import DropdownItem from "../../../../form-controls/dropdown-item";
import InputItem from "../../../../form-controls/input-item";
import TextItem from "../../../../form-controls/text-item";
import SwitchItem from "../../../../form-controls/switch-item";
import service from "../../../../../services/logistic/basic-info/purchasing-admins-service";
import {
  useModalContext,
  useResetContext,
} from "../../../../contexts/modal-context";

const schema = {
  AdminID: Joi.number().required(),
  MemberID: Joi.number().required().min(1),
  DetailsText: Joi.string()
    .min(5)
    .max(512)
    .allow("")
    .regex(utils.VALID_REGEX)
    .label(Words.descriptions),
  IsActive: Joi.boolean(),
};

const initRecord = {
  AdminID: 0,
  MemberID: 0,
  DetailsText: "",
  IsActive: true,
};

const formRef = React.createRef();

const PurchasingAdminModal = ({ isOpen, selectedObject, onOk, onCancel }) => {
  const {
    employeeSearchProgress,
    setEmployeeSearchProgress,
    employees,
    setEmployees,
    progress,
    setProgress,
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
    record.AdminID = 0;
    record.MemberID = 0;
    record.DetailsText = "";
    record.IsActive = true;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();
    setRecord(initRecord);
    initModal(formRef, selectedObject, setRecord);
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

  const handleSearchEmployees = async (searchValue) => {
    setEmployeeSearchProgress(true);

    try {
      const data = await service.searchEmployees(searchValue);

      setEmployees(data);
    } catch (ex) {
      handleError(ex);
    }

    setEmployeeSearchProgress(false);
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
      width={750}
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
                loading={employeeSearchProgress}
                onSearch={handleSearchEmployees}
              />
            </Col>
          )}
          <Col xs={24}>
            <InputItem
              title={Words.descriptions}
              fieldName="DetailsText"
              multiline
              rows={7}
              showCount
              maxLength={512}
              formConfig={formConfig}
            />
          </Col>
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

export default PurchasingAdminModal;
