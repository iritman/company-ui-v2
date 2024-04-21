import React from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../common/modal-window";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
  handleError,
} from "../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "../../../contexts/modal-context";
import service from "../../../../services/settings/org/bank-accounts-service";
import accessesService from "../../../../services/app/accesses-service";
import DropdownItem from "../../../form-controls/dropdown-item";
import TextItem from "../../../form-controls/text-item";
import InputItem from "../../../form-controls/input-item";
import MemberProfileImage from "../../../common/member-profile-image";

const schema = {
  AccountID: Joi.number().required(),
  MemberID: Joi.number().required().min(1),
  BankID: Joi.number().required().min(1),
  AccountNo: Joi.string()
    .min(4)
    .max(50)
    .required()
    .regex(/^[0-9]+$/)
    .label(Words.account_no),
  CardNo: Joi.string()
    .min(16)
    .max(16)
    .allow("")
    .required()
    .regex(/^[0-9]+$/)
    .label(Words.card_no),
  ShebaNo: Joi.string()
    .min(24)
    .max(24)
    .allow("")
    .regex(/^[0-9]+$/)
    .label(Words.sheba_no),
};

const initRecord = {
  AccountID: 0,
  MemberID: 0,
  BankID: 0,
  AccountNo: "",
  CardNo: "",
  ShebaNo: "",
};

const formRef = React.createRef();

const BankAccountModal = ({ isOpen, selectedObject, onOk, onCancel }) => {
  const {
    memberSearchProgress,
    setMemberSearchProgress,
    banks,
    setBanks,
    members,
    setMembers,
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
    record.AccountID = 0;
    record.MemberID = 0;
    record.BankID = 0;
    record.AccountNo = "";
    record.CardNo = "";
    record.ShebaNo = "";

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
      const { Banks } = data;
      setBanks(Banks);
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

  const handleSearchMembers = async (searchValue) => {
    setMemberSearchProgress(true);

    try {
      const data = await accessesService.searchMembers(
        "BankAccounts",
        searchValue
      );

      setMembers(data);
    } catch (ex) {
      handleError(ex);
    }

    setMemberSearchProgress(false);
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
            <>
              <Col
                xs={24}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <MemberProfileImage fileName={record.PicFileName} size={60} />
              </Col>
              <Col xs={24}>
                <TextItem
                  title={Words.member}
                  value={`${record.FirstName} ${record.LastName}`}
                  valueColor={Colors.magenta[6]}
                />
              </Col>
            </>
          )}

          {!isEdit && (
            <Col xs={24} md={12}>
              <DropdownItem
                title={Words.member}
                dataSource={members}
                keyColumn="MemberID"
                valueColumn="FullName"
                formConfig={formConfig}
                required
                autoFocus
                loading={memberSearchProgress}
                onSearch={handleSearchMembers}
              />
            </Col>
          )}

          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.bank}
              dataSource={banks}
              keyColumn="BankID"
              valueColumn="Title"
              formConfig={formConfig}
              required
              autoFocus={isEdit}
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.account_no}
              fieldName="AccountNo"
              maxLength={50}
              formConfig={formConfig}
              allowClear
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <InputItem
              title={Words.card_no}
              fieldName="CardNo"
              maxLength={16}
              formConfig={formConfig}
              allowClear
            />
          </Col>
          <Col xs={24}>
            <InputItem
              title={Words.sheba_no}
              fieldName="ShebaNo"
              maxLength={24}
              formConfig={formConfig}
              addonAfter="IR"
              allowClear
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default BankAccountModal;
