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
import service from "../../../../../../services/financial/treasury/pay/payment-receipts-service";
import InputItem from "../../../../../form-controls/input-item";
import DropdownItem from "../../../../../form-controls/dropdown-item";

const { Text } = Typography;
const valueColor = Colors.blue[7];

const schema = {
  ItemID: Joi.number().required(),
  ReceiptID: Joi.number().required(),
  FrontSideAccountID: Joi.number().min(1).required().label(Words.front_side),
  DemandID: Joi.number().min(1).required().label(Words.demand_no),
  Amount: Joi.number(),
  CashFlowID: Joi.number().required().label(Words.cash_flow),
  StandardDetailsID: Joi.number(),
  DetailsText: Joi.string()
    .min(5)
    .max(250)
    .allow("")
    .regex(utils.VALID_REGEX)
    .label(Words.standard_description),
};

const initRecord = {
  ItemID: 0,
  ReceiptID: 0,
  FrontSideAccountID: 0,
  DemandID: 0,
  Amount: 0,
  CashFlowID: 0,
  StandardDetailsID: 0,
  DetailsText: "",
};

const formRef = React.createRef();

const PaymentReceiptRefundReceivedDemandModal = ({
  isOpen,
  selectedObject,
  cashBoxID,
  selectedDemands,
  onOk,
  onCancel,
  onSelectDemand,
}) => {
  const [progress, setProgress] = useState(false);
  const [errors, setErrors] = useState({});
  const [record, setRecord] = useState({});

  const [frontSideAccountSearchProgress, setFrontSideAccountSearchProgress] =
    useState(false);
  const [frontSideAccounts, setFrontSideAccounts] = useState([]);

  const [demands, setDemands] = useState([]);
  //   const [currencies, setCurrencies] = useState([]);
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
    record.ReceiptID = 0;
    record.FrontSideAccountID = 0;
    record.DemandID = 0;
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

      let { CashFlows, Currencies, StandardDetails } = data;

      setCashFlows(CashFlows);
      //   setCurrencies(Currencies);
      setStandardDetails(StandardDetails);

      if (selectedObject) {
        const selected_front_side_account =
          await service.searchFrontSideAccountByID(
            selectedObject.FrontSideAccountID
          );

        const { FrontSideAccountID, Title } = selected_front_side_account;

        const selectable_demands = await service.getReceivedDemandsForRefund(
          cashBoxID,
          FrontSideAccountID
        );

        let ddl_demands = selectable_demands.filter(
          (d) => !selectedDemands?.find((dm) => dm.DemandID === d.DemandID)
        );

        let current_selected_demand = selectable_demands.find(
          (d) => d.DemandID === selectedObject?.DemandID
        );

        if (!current_selected_demand) {
          current_selected_demand =
            await service.getReceivedDemandForRefundByID(
              selectedObject.DemandID
            );
        }

        ddl_demands = [current_selected_demand, ...ddl_demands];

        setDemands(ddl_demands);
        setFrontSideAccounts([{ FrontSideAccountID, Title }]);
        initModal(formRef, selectedObject, setRecord);
      } else {
        utils.setDefaultCurrency(
          setRecord,
          initRecord,
          loadFieldsValue,
          formRef,
          Currencies
        );
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
      rec.DemandID = 0;
      setDemands([]);
    } else {
      const selectable_demands = await service.getReceivedDemandsForRefund(
        cashBoxID,
        value
      );

      let ddl_demands = selectable_demands?.filter(
        (d) => !selectedDemands?.find((dm) => dm.DemandID === d.DemandID)
      );

      setDemands(ddl_demands);
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

  const renderSelectedDemandInfo = () => {
    let result = <></>;
    let demand = null;

    demand = demands.find((d) => d.DemandID === record.DemandID);

    if (demand) {
      const {
        //   DemandID,
        DemandNo,
        Amount,
        DueDate,
        //   DurationTypeID,
        DurationTypeTitle,
        //   FrontSideAccountID,
        FrontSideAccountTitle,
        TafsilCode,
        TafsilTypeTitle,
        //   InfoTitle,
      } = demand;

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
            {utils.farsiNum(`${DemandID}`)}
          </Text>
        </Descriptions.Item> */}
          <Descriptions.Item label={Words.demand_no}>
            <Text style={{ color: Colors.red[6] }}>
              {utils.farsiNum(`${DemandNo}`)}
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

  const handleChangeDemand = (value) => {
    const demand = demands.find((d) => d.DemandID === value);
    onSelectDemand(value > 0 ? demand : null);

    const rec = { ...record };
    rec.DemandID = value || 0;
    rec.Amount = value > 0 ? demand.Amount : 0;
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
      title={Words.reg_refund_received_demand}
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
            />
          </Col>

          {demands && (
            <Col xs={24}>
              <DropdownItem
                title={Words.demand}
                dataSource={demands}
                keyColumn="DemandID"
                valueColumn="InfoTitle"
                formConfig={formConfig}
                disabled={record.FrontSideAccountID === 0}
                required
                autoFocus
                onChange={handleChangeDemand}
              />
            </Col>
          )}

          {record.DemandID > 0 && (
            <Col xs={24}>
              <Form.Item>{renderSelectedDemandInfo()}</Form.Item>
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

export default PaymentReceiptRefundReceivedDemandModal;
