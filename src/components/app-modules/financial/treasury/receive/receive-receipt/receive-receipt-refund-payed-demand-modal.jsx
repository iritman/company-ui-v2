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
  DemandItemID: Joi.number().min(1).required().label(Words.demand_no),
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
  DemandItemID: 0,
  Amount: 0,
  CashFlowID: 0,
  StandardDetailsID: 0,
  DetailsText: "",
};

const formRef = React.createRef();

const ReceiveReceiptRefundPayedDemandModal = ({
  isOpen,
  selectedObject,
  cashBoxID,
  selectedCheques,
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
    record.DemandItemID = 0;
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

        const selectable_demands = await service.getPayedDemandsForRefund(
          cashBoxID,
          FrontSideAccountID
        );

        let ddl_demands = selectable_demands.filter(
          (d) =>
            !selectedCheques?.find((dm) => dm.DemandItemID === d.DemandItemID)
        );

        let current_selected_demand = selectable_demands.find(
          (c) => c.DemandItemID === selectedObject?.DemandItemID
        );

        if (!current_selected_demand) {
          current_selected_demand = await service.getPayedDemandForRefundByID(
            selectedObject.DemandItemID
          );
        }

        ddl_demands = [current_selected_demand, ...ddl_demands];

        setDemands(ddl_demands);
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
      rec.DemandItemID = 0;
      setDemands([]);
    } else {
      const selectable_cheques = await service.getPayedDemandsForRefund(
        cashBoxID,
        value
      );

      let ddl_demands = selectable_cheques.filter(
        (d) =>
          !selectedCheques?.find((dm) => dm.DemandItemID === d.DemandItemID)
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

    demand = demands.find((d) => d.DemandItemID === record.DemandItemID);

    if (demand) {
      const {
        //   DemandItemID,
        DemandNo,
        //   BankID,
        // BankTitle,
        // BranchName,
        // CityTitle,
        // AccountNo,
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
            {utils.farsiNum(`${DemandItemID}`)}
          </Text>
        </Descriptions.Item> */}
          <Descriptions.Item label={Words.demand_no}>
            <Text style={{ color: Colors.red[6] }}>
              {utils.farsiNum(`${DemandNo}`)}
            </Text>
          </Descriptions.Item>
          {/* <Descriptions.Item label={Words.bank}>
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
          </Descriptions.Item> */}
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
    const demand = demands.find((d) => d.DemandItemID === value);
    onSelectDemand(value > 0 ? demand : null);

    const rec = { ...record };
    rec.DemandItemID = value || 0;
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
      title={Words.reg_receive_receipt_refund_payed_demand}
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

          {demands && (
            <Col xs={24}>
              <DropdownItem
                title={Words.demand}
                dataSource={demands}
                keyColumn="DemandItemID"
                valueColumn="InfoTitle"
                formConfig={formConfig}
                disabled={record.FrontSideAccountID === 0}
                required
                autoFocus
                onChange={handleChangeDemand}
              />
            </Col>
          )}

          {record.DemandItemID > 0 && (
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

export default ReceiveReceiptRefundPayedDemandModal;
