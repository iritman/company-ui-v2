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
import service from "../../../../../../services/financial/treasury/collector-agent/transfer-to-collector-agents-service";
import DropdownItem from "../../../../../form-controls/dropdown-item";

const { Text } = Typography;
const valueColor = Colors.blue[7];

const schema = {
  ItemID: Joi.number().required(),
  ChequeID: Joi.number().required(),
};

const initRecord = {
  ItemID: 0,
  ChequeID: 0,
};

const formRef = React.createRef();

const TransferToCollectorAgentChequeModal = ({
  isOpen,
  selectedObject,
  currentCheques,
  onOk,
  onCancel,
  onSelectCheque,
}) => {
  const [progress, setProgress] = useState(false);
  const [errors, setErrors] = useState({});
  const [record, setRecord] = useState({});

  const [cheques, setCheques] = useState([]);

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.ChequeID = 0;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    setRecord(initRecord);
    loadFieldsValue(formRef, initRecord);
    initModal(formRef, selectedObject, setRecord);

    //------

    setProgress(true);

    try {
      const data = await service.getCheques();

      setCheques(
        data.Cheques.filter(
          (c) => !currentCheques.find((ch) => ch.ChequeID === c.ChequeID)
        )
      );
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  });

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

    if (selectedObject !== null) cheque = { ...selectedObject };
    else if (cheques && cheques.length > 0) {
      cheque = cheques.find((c) => c.ChequeID === record.ChequeID);
    }

    if (cheque) {
      const {
        //   ChequeID,
        ChequeNo,
        //   BankID,
        BankTitle,
        BranchName,
        CityTitle,
        AccountNo,
        Amount,
        DueDate,
        AgreedDate,
        //   DurationTypeID,
        DurationTypeTitle,
        //   FrontSideAccountID,
        FrontSideAccountTitle,
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
            {utils.farsiNum(`${ChequeID}`)}
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
          <Descriptions.Item label={Words.agreed_date}>
            <Text style={{ color: valueColor }}>
              {AgreedDate.length > 0
                ? utils.farsiNum(utils.slashDate(AgreedDate))
                : "-"}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.duration_type}>
            <Text style={{ color: valueColor }}>{DurationTypeTitle}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.front_side}>
            <Text style={{ color: valueColor }}>
              {utils.farsiNum(FrontSideAccountTitle)}
            </Text>
          </Descriptions.Item>
        </Descriptions>
      );
    }

    return result;
  };

  const handleChangeCheque = (value) => {
    const cheque = cheques.find((c) => c.ChequeID === value);
    cheque.ItemID = record.ItemID;
    onSelectCheque(cheque);

    const rec = { ...record };
    rec.ChequeID = value || 0;
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
      title={Words.reg_cheque}
      width={900}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          {selectedObject === null && (
            <Col xs={24}>
              <DropdownItem
                title={Words.cheque}
                dataSource={cheques}
                keyColumn="ChequeID"
                valueColumn="InfoTitle"
                formConfig={formConfig}
                required
                autoFocus
                onChange={handleChangeCheque}
              />
            </Col>
          )}

          {record.ChequeID > 0 && (
            <Col xs={24}>{renderSelectedChequeInfo()}</Col>
          )}
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default TransferToCollectorAgentChequeModal;
