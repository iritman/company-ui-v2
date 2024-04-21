import React, { useState } from "react";
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
import DateItem from "../../../../form-controls/date-item";
import service from "../../../../../services/logistic/basic-info/suppliers-service";
import {
  useModalContext,
  useResetContext,
} from "../../../../contexts/modal-context";

const schema = {
  SupplierID: Joi.number().required(),
  TafsilAccountID: Joi.number().required().min(1),
  RelationStartDate: Joi.string().allow(""),
  ActivityTypeID: Joi.number().min(1),
  DetailsText: Joi.string()
    .min(5)
    .max(512)
    .allow("")
    .regex(utils.VALID_REGEX)
    .label(Words.descriptions),
  IsActive: Joi.boolean(),
};

const initRecord = {
  SupplierID: 0,
  TafsilAccountID: 0,
  RelationStartDate: "",
  ActivityTypeID: 0,
  DetailsText: "",
  IsActive: true,
};

const formRef = React.createRef();

const SupplierModal = ({ isOpen, selectedObject, onOk, onCancel }) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const resetContext = useResetContext();

  const [tafsilSearchProgress, setTafsilSearchProgress] = useState(false);
  const [tafsilAccounts, setTafsilAccounts] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.TafsilAccountID = 0;
    record.RelationStartDate = "";
    record.ActivityTypeID = 0;
    record.DetailsText = "";
    record.IsActive = true;

    setTafsilAccounts([]);

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();
    setRecord(initRecord);
    initModal(formRef, selectedObject, setRecord);

    //------

    setProgress(true);

    try {
      const data = await service.getParams();

      const { ActivityTypes } = data;

      setActivityTypes(ActivityTypes);
    } catch (ex) {
      handleError(ex);
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

  const handleSearchTafsilAccount = async (searchValue) => {
    setTafsilSearchProgress(true);

    try {
      const data = await service.searchTafsilAccounts(searchValue);

      setTafsilAccounts(data);
    } catch (ex) {
      handleError(ex);
    }

    setTafsilSearchProgress(false);
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
                title={Words.id}
                value={utils.farsiNum(
                  `${record.TafsilCode} - ${record.TafsilAccountTitle} [${record.TafsilTypeTitle}]`
                )}
                valueColor={Colors.magenta[6]}
              />
            </Col>
          )}

          {!isEdit && (
            <Col xs={24}>
              <DropdownItem
                title={Words.tafsil_account}
                dataSource={tafsilAccounts}
                keyColumn="TafsilAccountID"
                valueColumn="InfoTitle"
                formConfig={formConfig}
                required
                autoFocus
                loading={tafsilSearchProgress}
                onSearch={handleSearchTafsilAccount}
              />
            </Col>
          )}
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.relation_start_date}
              fieldName="RelationStartDate"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.activity_type}
              dataSource={activityTypes}
              keyColumn="ActivityTypeID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
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

export default SupplierModal;
