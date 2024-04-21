import React from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../common/modal-window";
import Words from "../../../../resources/words";
import utils from "../../../../tools/utils";
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
import service from "../../../../services/settings/org/bank-accounts-service";
import accessesService from "../../../../services/app/accesses-service";
import DropdownItem from "./../../../form-controls/dropdown-item";
import InputItem from "./../../../form-controls/input-item";
import SwitchItem from "./../../../form-controls/switch-item";

const schema = {
  MemberID: Joi.number(),
  BankID: Joi.number(),
  SearchText: Joi.string()
    .allow("")
    .regex(utils.VALID_REGEX)
    .label(Words.search_text),
  JustEmployees: Joi.boolean(),
};

const initRecord = {
  MemberID: 0,
  BankID: 0,
  SearchText: "",
  JustEmployees: false,
};

const formRef = React.createRef();

const BankAccountsSearchModal = ({ isOpen, filter, onOk, onCancel }) => {
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
    record.MemberID = 0;
    record.BankID = 0;
    record.SearchText = "";
    record.JustEmployees = false;

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
      const { Banks } = data;
      setBanks(Banks);
    } catch (err) {
      handleError(err);
    }
    setProgress(false);
  });

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

  return (
    <ModalWindow
      isOpen={isOpen}
      inProgress={progress}
      disabled={
        !utils.hasSelectedFilter(record, initRecord) ||
        (validateForm({ record, schema }) && true)
      }
      searchModal
      onClear={clearRecord}
      onSubmit={() => onOk(record)}
      onCancel={onCancel}
      width={700}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[10, 5]} style={{ marginLeft: 1 }}>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.member}
              dataSource={members}
              keyColumn="MemberID"
              valueColumn="FullName"
              formConfig={formConfig}
              autoFocus
              loading={memberSearchProgress}
              onSearch={handleSearchMembers}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.bank}
              dataSource={banks}
              keyColumn="BankID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24}>
            <InputItem
              title={Words.search_text}
              fieldName="SearchText"
              maxLength={50}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24}>
            <SwitchItem
              title={Words.search_in_employees}
              fieldName="JustEmployees"
              initialValue={false}
              checkedTitle={Words.yes}
              unCheckedTitle={Words.no}
              formConfig={formConfig}
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default BankAccountsSearchModal;
