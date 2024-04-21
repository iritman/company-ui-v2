import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Tabs, Typography, Alert } from "antd";
import Joi from "joi-browser";
import ModalWindow from "./../../../../common/modal-window";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
  getSorter,
  handleError,
} from "../../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "./../../../../contexts/modal-context";
import service from "../../../../../services/financial/treasury/basic-info/cheque-books-service";
import DropdownItem from "./../../../../form-controls/dropdown-item";
import InputItem from "../../../../form-controls/input-item";
import NumericInputItem from "./../../../../form-controls/numeric-input-item";
import SwitchItem from "./../../../../form-controls/switch-item";
import DateItem from "./../../../../form-controls/date-item";
import TextItem from "./../../../../form-controls/text-item";
import DetailsTable from "./../../../../common/details-table";

const { Text } = Typography;

const schema = {
  ChequeBookID: Joi.number().required(),
  AccountID: Joi.number().min(1).required().label(Words.bank_account),
  Series: Joi.string()
    .min(2)
    .max(50)
    .required()
    .regex(utils.VALID_REGEX)
    .label(Words.cheque_book_series),
  TotalPages: Joi.number().min(1).required().label(Words.total_pages),
  StartSerialNo: Joi.number().min(1).required().label(Words.start_serial_no),
  IssueDate: Joi.string().required().label(Words.issue_date),
  CashBoxID: Joi.number().label(Words.cash_box),
  IsSayad: Joi.boolean(),
};

const initRecord = {
  ChequeBookID: 0,
  AccountID: 0,
  Series: "",
  TotalPages: 0,
  StartSerialNo: 0,
  IssueDate: "",
  CashBoxID: 0,
  IsSayad: false,
};

const columns = [
  {
    title: Words.id,
    width: 75,
    align: "center",
    dataIndex: "CompanyChequeID",
    sorter: getSorter("CompanyChequeID"),
    render: (CompanyChequeID) => (
      <Text>{utils.farsiNum(`${CompanyChequeID}`)}</Text>
    ),
  },
  {
    title: Words.cheque_no,
    width: 150,
    align: "center",
    dataIndex: "ChequeNo",
    sorter: getSorter("ChequeNo"),
    render: (ChequeNo) => (
      <Text
        style={{
          color: Colors.green[6],
        }}
      >
        {utils.farsiNum(`${ChequeNo}`)}
      </Text>
    ),
  },
  // {
  //   title: Words.sayad_no,
  //   width: 150,
  //   align: "center",
  //   dataIndex: "SayadNo",
  //   sorter: getSorter("SayadNo"),
  //   render: (SayadNo) => (
  //     <Text
  //       style={{
  //         color: Colors.blue[6],
  //       }}
  //     >
  //       {SayadNo.length > 0 ? utils.farsiNum(`${SayadNo}`) : ""}
  //     </Text>
  //   ),
  // },
  {
    title: Words.status,
    width: 120,
    align: "center",
    dataIndex: "StatusTitle",
    sorter: getSorter("StatusTitle"),
    render: (StatusTitle) => <Text>{StatusTitle}</Text>,
  },
];

const formRef = React.createRef();

const ChequeBookModal = ({ isOpen, selectedObject, onOk, onCancel }) => {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [cashBoxes, setCashBoxes] = useState([]);

  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const resetContext = useResetContext();

  const clearRecord = () => {
    record.AccountID = 0;
    record.Series = "";
    record.TotalPages = 0;
    record.StartSerialNo = 0;
    record.IssueDate = "";
    record.CashBoxID = 0;
    record.IsSayad = false;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
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

      const { BankAccounts, CashBoxes } = data;

      setBankAccounts(BankAccounts);
      setCashBoxes(CashBoxes);
    } catch (err) {
      handleError(err);
    }

    setProgress(false);
  });

  const handleSubmit = async () => {
    await saveModalChanges(
      formConfig,
      selectedObject,
      setProgress,
      onOk,
      clearRecord
    );
  };

  const getSelectedAccountInfo = (accountID) => {
    let result = "";

    if (accountID > 0) {
      const account = bankAccounts.find((a) => a.AccountID === accountID);

      if (account) {
        const { BankTitle, BankBranchTitle, BranchCode } = account;
        result = utils.farsiNum(
          `${BankTitle} - ${BankBranchTitle} (${Words.branch_code}: ${BranchCode})`
        );
      }
    }

    return result;
  };

  const isEdit = selectedObject !== null;

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
      width={750}
    >
      <Form ref={formRef} name="dataForm">
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab={Words.cheque_book_info} key="cheque_book_info">
            <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
              <Col xs={24}>
                <DropdownItem
                  title={Words.bank_account}
                  dataSource={bankAccounts}
                  keyColumn="AccountID"
                  valueColumn="AccountNo"
                  formConfig={formConfig}
                  required
                />
              </Col>
              {record.AccountID > 0 && (
                <Col xs={24}>
                  <Form.Item>
                    <Alert
                      type="warning"
                      message={
                        <Text>{getSelectedAccountInfo(record.AccountID)}</Text>
                      }
                    />
                  </Form.Item>
                </Col>
              )}
              <Col xs={24} md={12}>
                <InputItem
                  title={Words.cheque_book_series}
                  fieldName="Series"
                  formConfig={formConfig}
                  maxLength={50}
                  required
                />
              </Col>
              <Col xs={24} md={12}>
                <NumericInputItem
                  horizontal
                  title={Words.total_pages}
                  fieldName="TotalPages"
                  min={1}
                  max={300}
                  formConfig={formConfig}
                  disabled={isEdit}
                  required
                />
              </Col>
              <Col xs={24} md={12}>
                <NumericInputItem
                  horizontal
                  title={Words.start_serial_no}
                  fieldName="StartSerialNo"
                  min={1}
                  max={9999999}
                  formConfig={formConfig}
                  disabled={isEdit}
                  required
                />
              </Col>
              <Col xs={24} md={12}>
                <DateItem
                  horizontal
                  title={Words.issue_date}
                  fieldName="IssueDate"
                  formConfig={formConfig}
                  required
                />
              </Col>
              <Col xs={24} md={12}>
                <DropdownItem
                  title={Words.cash_box}
                  dataSource={cashBoxes}
                  keyColumn="CashBoxID"
                  valueColumn="Title"
                  formConfig={formConfig}
                />
              </Col>
              <Col xs={24} md={12}>
                <SwitchItem
                  title={Words.sayad_cheque}
                  fieldName="IsSayad"
                  initialValue={false}
                  checkedTitle={Words.yes}
                  unCheckedTitle={Words.no}
                  formConfig={formConfig}
                />
              </Col>

              {selectedObject !== null && (
                <>
                  <Col xs={24} md={12}>
                    <TextItem
                      title={Words.remained_pages}
                      value={utils.farsiNum(selectedObject.RemainedPages)}
                      valueColor={Colors.magenta[6]}
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <TextItem
                      title={Words.first_usable_serial_no}
                      value={selectedObject.FirstUsableSerialNo}
                      valueColor={Colors.magenta[6]}
                    />
                  </Col>
                </>
              )}
            </Row>
          </Tabs.TabPane>
          {selectedObject !== null && (
            <Tabs.TabPane tab={Words.cheque_items} key="cheque_items">
              <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
                <Col xs={24}>
                  <DetailsTable records={record.Cheques} columns={columns} />
                </Col>
              </Row>
            </Tabs.TabPane>
          )}
        </Tabs>
      </Form>
    </ModalWindow>
  );
};

export default ChequeBookModal;
