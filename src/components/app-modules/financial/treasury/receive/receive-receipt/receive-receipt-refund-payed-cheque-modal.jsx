import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Descriptions, Typography } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../../../common/modal-window";
import Words from "../../../../../../resources/words";
import Colors from "../../../../../../resources/colors";
import utils from "../../../../../../tools/utils";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
  handleError,
} from "../../../../../../tools/form-manager";
import service from "../../../../../../services/financial/treasury/receive/receive-receipts-service";
import InputItem from "../../../../../form-controls/input-item";
import DropdownItem from "../../../../../form-controls/dropdown-item";

const { Text } = Typography;
const valueColor = Colors.blue[7];

const schema = {
  RefundID: Joi.number().required(),
  ReceiveID: Joi.number().required(),
  FrontSideAccountID: Joi.number().min(1).required().label(Words.front_side),
  CompanyChequeID: Joi.number().min(1).required().label(Words.cheque_no),
  Amount: Joi.number(),
  CashFlowID: Joi.number().min(1).required().label(Words.cash_flow),
  StandardDetailsID: Joi.number(),
  DetailsText: Joi.string()
    .min(5)
    .max(250)
    .allow("")
    .regex(utils.VALID_REGEX)
    .label(Words.standard_description),
};

const initRecord = {
  RefundID: 0,
  ReceiveID: 0,
  FrontSideAccountID: 0,
  CompanyChequeID: 0,
  Amount: 0,
  CashFlowID: 0,
  StandardDetailsID: 0,
  DetailsText: "",
};

const formRef = React.createRef();

const ReceiveReceiptRefundPayedChequeModal = ({
  isOpen,
  selectedObject,
  cashBoxID,
  selectedCheques,
  onOk,
  onCancel,
  onSelectCheque,
}) => {
  const [progress, setProgress] = useState(false);
  const [errors, setErrors] = useState({});
  const [record, setRecord] = useState({});

  const [frontSideAccountSearchProgress, setFrontSideAccountSearchProgress] =
    useState(false);
  const [frontSideAccounts, setFrontSideAccounts] = useState([]);

  const [cheques, setCheques] = useState([]);
  const [cashFlows, setCashFlows] = useState([]);
  const [standardDetails, setStandardDetails] = useState([]);

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.ReceiveID = 0;
    record.FrontSideAccountID = 0;
    record.CompanyChequeID = 0;
    record.Amount = 0;
    record.CashFlowID = 0;
    record.StandardDetailsID = 0;
    record.DetailsText = "";

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    setProgress(true);

    try {
      const data = await service.getItemsParams();

      let { CashFlows, StandardDetails } = data;

      setCashFlows(CashFlows);
      setStandardDetails(StandardDetails);

      if (selectedObject) {
        const selected_front_side_account =
          await service.searchFrontSideAccountByID(
            selectedObject.FrontSideAccountID
          );

        const { FrontSideAccountID, Title } = selected_front_side_account;

        const selectable_cheques = await service.getPayedChequesForRefund(
          cashBoxID,
          FrontSideAccountID
        );

        let ddl_cheques = selectable_cheques.filter(
          (c) =>
            !selectedCheques?.find(
              (ch) => ch.CompanyChequeID === c.CompanyChequeID
            )
        );

        let current_selected_cheque = selectable_cheques.find(
          (c) => c.CompanyChequeID === selectedObject?.CompanyChequeID
        );

        if (!current_selected_cheque) {
          current_selected_cheque = await service.getPayedChequeForRefundByID(
            selectedObject.CompanyChequeID
          );
        }

        ddl_cheques = [current_selected_cheque, ...ddl_cheques];

        setCheques(ddl_cheques);
        setFrontSideAccounts([{ FrontSideAccountID, Title }]);
        initModal(formRef, selectedObject, setRecord);
      } else {
        setRecord(initRecord);
        loadFieldsValue(formRef, initRecord);
      }
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  });

  const handleChangeFrontSideAccount = async (value) => {
    const rec = { ...record };

    rec.FrontSideAccountID = value || 0;

    if (!value || value === 0) {
      rec.CompanyChequeID = 0;
      setCheques([]);
    } else {
      const selectable_cheques = await service.getPayedChequesForRefund(
        cashBoxID,
        value
      );

      let ddl_cheques = selectable_cheques.filter(
        (c) =>
          !selectedCheques?.find(
            (ch) => ch.CompanyChequeID === c.CompanyChequeID
          )
      );

      setCheques(ddl_cheques);
    }

    setRecord(rec);
    loadFieldsValue(formRef, rec);
  };

  const handleSearchFrontSideAccount = async (searchText) => {
    setFrontSideAccountSearchProgress(true);

    try {
      const data = await service.searchFrontSideAccounts(searchText);

      setFrontSideAccounts(data);
    } catch (ex) {
      handleError(ex);
    }

    setFrontSideAccountSearchProgress(false);
  };

  const isEdit = selectedObject !== null;

  const handleSubmit = async () => {
    await saveModalChanges(
      formConfig,
      selectedObject,
      setProgress,
      onOk,
      clearRecord,
      false // showMessage
    );

    onCancel();
  };

  const renderSelectedChequeInfo = () => {
    let result = <></>;
    let cheque = null;

    cheque = cheques.find((c) => c.CompanyChequeID === record.CompanyChequeID);

    if (cheque) {
      const {
        //   CompanyChequeID,
        ChequeNo,
        //   BankID,
        BankTitle,
        BranchName,
        CityTitle,
        AccountNo,
        Amount,
        DueDate,
        //   DurationTypeID,
        DurationTypeTitle,
        //   FrontSideAccountID,
        FrontSideAccountTitle,
        TafsilCode,
        TafsilTypeTitle,
        //   InfoTitle,
      } = cheque;

      result = (
        <Descriptions
          bordered
          column={{
            //   md: 2, sm: 2,
            lg: 2,
            md: 2,
            xs: 1,
          }}
          size="middle"
        >
          {/* <Descriptions.Item label={Words.id}>
          <Text style={{ color: valueColor }}>
            {utils.farsiNum(`${CompanyChequeID}`)}
          </Text>
        </Descriptions.Item> */}
          <Descriptions.Item label={Words.cheque_no}>
            <Text style={{ color: Colors.red[6] }}>
              {utils.farsiNum(`${ChequeNo}`)}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.bank}>
            <Text style={{ color: valueColor }}>{BankTitle}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.branch_name}>
            <Text style={{ color: valueColor }}>{BranchName}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.city}>
            <Text style={{ color: valueColor }}>{CityTitle}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.account_no}>
            <Text style={{ color: valueColor }}>
              {utils.farsiNum(AccountNo)}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.price}>
            <Text style={{ color: Colors.cyan[6] }}>
              {`${utils.farsiNum(utils.moneyNumber(Amount))} ${Words.ryal}`}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.due_date}>
            <Text style={{ color: valueColor }}>
              {utils.farsiNum(utils.slashDate(DueDate))}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.duration_type}>
            <Text style={{ color: valueColor }}>{DurationTypeTitle}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.front_side} span={2}>
            <Text style={{ color: valueColor }}>
              {utils.farsiNum(
                `${TafsilCode} - ${FrontSideAccountTitle} [${TafsilTypeTitle}]`
              )}
            </Text>
          </Descriptions.Item>
        </Descriptions>
      );
    }

    return result;
  };

  const handleChangeCheque = (value) => {
    const cheque = cheques.find((c) => c.CompanyChequeID === value);
    onSelectCheque(value > 0 ? cheque : null);

    const rec = { ...record };
    rec.CompanyChequeID = value || 0;
    rec.Amount = value > 0 ? cheque.Amount : 0;
    setRecord(rec);
  };

  //------

  return (
    <ModalWindow
      isOpen={isOpen}
      isEdit={isEdit}
      inProgress={progress}
      disabled={validateForm({ record: record, schema }) && true}
      onClear={clearRecord}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      title={Words.reg_receive_receipt_refund_payed_cheque}
      width={1250}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.front_side}
              dataSource={frontSideAccounts}
              keyColumn="FrontSideAccountID"
              valueColumn="Title"
              formConfig={formConfig}
              loading={frontSideAccountSearchProgress}
              onSearch={handleSearchFrontSideAccount}
              onChange={handleChangeFrontSideAccount}
              required
            />
          </Col>

          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.cash_flow}
              dataSource={cashFlows}
              keyColumn="CashFlowID"
              valueColumn="Title"
              formConfig={formConfig}
              required
            />
          </Col>

          {cheques && (
            <Col xs={24}>
              <DropdownItem
                title={Words.cheque}
                dataSource={cheques}
                keyColumn="CompanyChequeID"
                valueColumn="InfoTitle"
                formConfig={formConfig}
                disabled={record.FrontSideAccountID === 0}
                required
                autoFocus
                onChange={handleChangeCheque}
              />
            </Col>
          )}

          {record.CompanyChequeID > 0 && (
            <Col xs={24}>
              <Form.Item>{renderSelectedChequeInfo()}</Form.Item>
            </Col>
          )}

          <Col xs={24}>
            <DropdownItem
              title={Words.standard_details_text}
              dataSource={standardDetails}
              keyColumn="StandardDetailsID"
              valueColumn="DetailsText"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24}>
            <InputItem
              title={Words.standard_description}
              fieldName="DetailsText"
              multiline
              rows={2}
              showCount
              maxLength={250}
              formConfig={formConfig}
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default ReceiveReceiptRefundPayedChequeModal;
