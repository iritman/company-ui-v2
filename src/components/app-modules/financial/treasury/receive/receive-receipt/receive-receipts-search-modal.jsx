import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Button } from "antd";
import { EditOutlined as TextIcon } from "@ant-design/icons";
import Joi from "joi-browser";
import ModalWindow from "../../../../../common/modal-window";
import Words from "../../../../../../resources/words";
import utils from "../../../../../../tools/utils";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  handleError,
} from "../../../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "../../../../../contexts/modal-context";
import service from "../../../../../../services/financial/treasury/receive/receive-receipts-service";
import DropdownItem from "../../../../../form-controls/dropdown-item";
import DateItem from "../../../../../form-controls/date-item";
import InputItem from "../../../../../form-controls/input-item";
import NumericInputItem from "../../../../../form-controls/numeric-input-item";

const schema = {
  ReceiveID: Joi.number().label(Words.id),
  ReceiveTypeID: Joi.number(),
  DeliveryMemberID: Joi.number(),
  DeliveryMember: Joi.string()
    .allow("")
    .max(50)
    .label(Words.delivery_member)
    .regex(utils.VALID_REGEX),
  FromReceiveDate: Joi.string().allow(""),
  ToReceiveDate: Joi.string().allow(""),
  RegardID: Joi.number(),
  CashBoxID: Joi.number(),
  StatusID: Joi.number(),
};

const initRecord = {
  ReceiveID: 0,
  ReceiveTypeID: 0,
  DeliveryMemberID: 0,
  DeliveryMember: "",
  FromReceiveDate: "",
  ToReceiveDate: "",
  RegardID: 0,
  CashBoxID: 0,
  StatusID: 0,
};

const formRef = React.createRef();

const ReceiveReceiptsSearchModal = ({ isOpen, filter, onOk, onCancel }) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [deliveryMemberSearchProgress, setDeliveryMemberSearchProgress] =
    useState(false);
  const [toggleDeliveryMember, setToggleDeliveryMember] = useState(true);
  const [receiveTypes, setReceiveTypes] = useState([]);
  const [deliveryMembers, setDeliveryMembers] = useState([]);
  const [regards, setRegards] = useState([]);
  const [cashBoxes, setCashBoxes] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.ReceiveID = 0;
    record.ReceiveTypeID = 0;
    record.DeliveryMemberID = 0;
    record.DeliveryMember = "";
    record.FromReceiveDate = "";
    record.ToReceiveDate = "";
    record.RegardID = 0;
    record.CashBoxID = 0;
    record.StatusID = 0;

    setRecord(record);
    setErrors({});
    setDeliveryMembers([]);
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();

    setRecord(initRecord);
    initModal(formRef, filter, setRecord);

    setProgress(true);
    try {
      const data = await service.getParams();

      const { ReceiveTypes, Regards, CashBoxes, Statuses } = data;

      setReceiveTypes(ReceiveTypes);
      setRegards(Regards);
      setCashBoxes(CashBoxes);
      setStatuses(Statuses);
    } catch (err) {
      handleError(err);
    }
    setProgress(false);
  });

  const handleToggleDeliveryMember = () => {
    record.DeliveryMember = "";
    record.DeliveryMemberID = 0;
    setDeliveryMembers([]);
    setRecord({ ...record });

    setToggleDeliveryMember(!toggleDeliveryMember);
  };

  const handleSearchDeliveryMember = async (searchText) => {
    setDeliveryMemberSearchProgress(true);

    try {
      const data = await service.searchDeliveryMembers(searchText);

      setDeliveryMembers(data);
    } catch (ex) {
      handleError(ex);
    }

    setDeliveryMemberSearchProgress(false);
  };

  // ------

  return (
    <ModalWindow
      isOpen={isOpen}
      inProgress={progress}
      disabled={validateForm({ record, schema }) && true}
      searchModal
      onClear={clearRecord}
      onSubmit={() => onOk(record)}
      onCancel={onCancel}
      width={750}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[10, 5]} style={{ marginLeft: 1 }}>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              title={Words.id}
              fieldName="ReceiveID"
              min={0}
              max={9999999999}
              formConfig={formConfig}
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.receipt_receive_type}
              dataSource={receiveTypes}
              keyColumn="ReceiveTypeID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <Row>
              <Col xs={24} md={2}>
                <Form.Item>
                  <Button
                    type={toggleDeliveryMember ? "primary" : "default"}
                    size="small"
                    shape="circle"
                    icon={<TextIcon />}
                    onClick={handleToggleDeliveryMember}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={22}>
                {toggleDeliveryMember ? (
                  <InputItem
                    title={Words.delivery_member}
                    fieldName="DeliveryMember"
                    maxLength={50}
                    formConfig={formConfig}
                  />
                ) : (
                  <DropdownItem
                    title={Words.delivery_member}
                    dataSource={deliveryMembers}
                    keyColumn="DeliveryMemberID"
                    valueColumn="FullName"
                    formConfig={formConfig}
                    loading={deliveryMemberSearchProgress}
                    onSearch={handleSearchDeliveryMember}
                  />
                )}
              </Col>
            </Row>
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.regards}
              dataSource={regards}
              keyColumn="RegardID"
              valueColumn="Title"
              formConfig={formConfig}
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
            <DropdownItem
              title={Words.status}
              dataSource={statuses}
              keyColumn="StatusID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.from_receive_date}
              fieldName="FromReceiveDate"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DateItem
              horizontal
              title={Words.to_receive_date}
              fieldName="ToReceiveDate"
              formConfig={formConfig}
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default ReceiveReceiptsSearchModal;
