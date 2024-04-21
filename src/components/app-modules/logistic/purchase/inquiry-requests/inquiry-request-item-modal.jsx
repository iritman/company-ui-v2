import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Typography, Descriptions } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../../common/modal-window";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import service from "../../../../../services/logistic/purchase/inquiry-requests-service";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
  handleError,
} from "../../../../../tools/form-manager";
import InputItem from "../../../../form-controls/input-item";
import NumericInputItem from "../../../../form-controls/numeric-input-item";
import DropdownItem from "../../../../form-controls/dropdown-item";
import TextItem from "./../../../../form-controls/text-item";

const { Text } = Typography;
const valueColor = Colors.blue[7];

const PurchaseItemDetails = ({ selectedItem }) => {
  if (!selectedItem) return <></>;

  const {
    // RefItemID,
    RequestID,
    NeededItemCode,
    NeededItemTitle,
    FrontSideAccountTitle,
    RequestCount,
    MeasureUnitTitle,
    PurchaseAgentID,
    AgentFirstName,
    AgentLastName,
    NeedDate,
    RequestDate,
    InquiryDeadline,
  } = selectedItem;

  return (
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
          {utils.farsiNum(`${RefItemID}`)}
        </Text>
      </Descriptions.Item> */}

      <Descriptions.Item label={Words.request_no}>
        <Text style={{ color: Colors.red[6] }}>
          {utils.farsiNum(RequestID)}
        </Text>
      </Descriptions.Item>

      <Descriptions.Item label={Words.item_code}>
        <Text style={{ color: valueColor }}>
          {utils.farsiNum(NeededItemCode)}
        </Text>
      </Descriptions.Item>
      <Descriptions.Item label={Words.item_title}>
        <Text style={{ color: valueColor }}>{NeededItemTitle}</Text>
      </Descriptions.Item>
      <Descriptions.Item label={Words.consumer}>
        <Text style={{ color: valueColor }}>
          {utils.farsiNum(FrontSideAccountTitle)}
        </Text>
      </Descriptions.Item>
      <Descriptions.Item label={Words.request_count}>
        <Text style={{ color: valueColor }}>
          {utils.farsiNum(RequestCount)}
        </Text>
      </Descriptions.Item>
      <Descriptions.Item label={Words.unit}>
        <Text style={{ color: valueColor }}>{MeasureUnitTitle}</Text>
      </Descriptions.Item>

      <Descriptions.Item label={Words.request_date}>
        <Text style={{ color: valueColor }}>
          {RequestDate?.length > 0
            ? utils.farsiNum(utils.slashDate(RequestDate))
            : "-"}
        </Text>
      </Descriptions.Item>
      <Descriptions.Item label={Words.need_date}>
        <Text style={{ color: valueColor }}>
          {NeedDate?.length > 0
            ? utils.farsiNum(utils.slashDate(NeedDate))
            : "-"}
        </Text>
      </Descriptions.Item>
      <Descriptions.Item label={Words.inquiry_deadline}>
        <Text style={{ color: valueColor }}>
          {InquiryDeadline?.length > 0
            ? utils.farsiNum(utils.slashDate(InquiryDeadline))
            : "-"}
        </Text>
      </Descriptions.Item>
      <Descriptions.Item label={Words.purchasing_agent}>
        <Text style={{ color: valueColor }}>
          {PurchaseAgentID > 0 ? `${AgentFirstName} ${AgentLastName}` : "-"}
        </Text>
      </Descriptions.Item>

      {/* {DetailsText.length > 0 && (
        <Descriptions.Item label={Words.descriptions} span={2}>
          <Text
            style={{
              color: Colors.purple[7],
              whiteSpace: "pre-line",
            }}
          >
            {utils.farsiNum(DetailsText)}
          </Text>
        </Descriptions.Item>
      )} */}
      {/* <Descriptions.Item label={Words.status} span={2}>
                      <Space>
                        {IsActive ? (
                          <CheckIcon style={{ color: Colors.green[6] }} />
                        ) : (
                          <LockIcon style={{ color: Colors.red[6] }} />
                        )}

                        <Text style={{ color: valueColor }}>
                          {`${IsActive ? Words.active : Words.inactive} `}
                        </Text>
                      </Space>
                    </Descriptions.Item> */}
    </Descriptions>
  );
};

const schema = {
  ItemID: Joi.number().required(),
  RequestID: Joi.number().required(),
  RefItemID: Joi.number().min(1).required().label(Words.item_title),
  RequestCount: Joi.number()
    .min(0)
    .max(999999)
    .positive()
    .precision(2)
    .label(Words.request_count),
  PurchaseAgentID: Joi.number().min(1).required().label(Words.purchasing_agent),
  DetailsText: Joi.string()
    .min(5)
    .max(250)
    .allow("")
    .regex(utils.VALID_REGEX)
    .label(Words.descriptions),
  StatusID: Joi.number().min(1).required(),
};

const initRecord = {
  ItemID: 0,
  RequestID: 0,
  RefItemID: 0,
  RequestCount: 0,
  PurchaseAgentID: 0,
  DetailsText: "",
  StatusID: 1,
};

const formRef = React.createRef();

const InquiryRequestItemModal = ({
  isOpen,
  selectedObject,
  selectedItems,
  setParams,
  onOk,
  onCancel,
}) => {
  const [progress, setProgress] = useState(false);
  const [errors, setErrors] = useState({});
  const [record, setRecord] = useState({});

  const [items, setItems] = useState([]);
  const [agents, setAgents] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.RefItemID = 0;
    record.RequestCount = 0;
    record.PurchaseAgentID = 0;
    record.DetailsText = "";
    record.StatusID = 1;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    setRecord(initRecord);
    loadFieldsValue(formRef, initRecord);
    initModal(formRef, selectedObject, setRecord);

    setProgress(true);

    try {
      const params = await service.getItemParams();

      const { Agents, Statuses } = params;

      setAgents(Agents);
      setStatuses(Statuses);

      //------

      const data = await service.getRegedPurchaseItems();

      let choices = data.filter(
        (i) => !selectedItems.find((itm) => itm.RefItemID === i.RefItemID)
      );

      let selected_purchase_item = null;

      if (selectedObject) {
        selected_purchase_item = data.find(
          (i) => i.RefItemID === selectedObject.RefItemID
        );

        if (
          (!selected_purchase_item && selectedObject.ItemID === 0) ||
          selectedObject.ItemID > 0
        ) {
          selected_purchase_item = await service.getRegedPurchaseItemByID(
            selectedObject.RefItemID
          );
        }

        choices = [selected_purchase_item, ...choices];
      }

      setParams({
        Agents,
        Statuses,
        PurchaseItem: selected_purchase_item,
      });

      setItems(choices);
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

  const getSelectedItem = (item_id) => {
    let selected_item = null;

    if (item_id > 0) {
      selected_item = items.find((i) => i.RefItemID === item_id);

      if (!selected_item) selected_item = null;
    }

    return selected_item;
  };

  const handleChangeItem = (value) => {
    const rec = { ...record };
    rec.RefItemID = value;

    if (value === 0) {
      rec.RequestCount = 0;
      rec.PurchaseAgentID = 0;
    } else {
      const selected_item = getSelectedItem(value);

      setParams({
        Agents: agents,
        Statuses: statuses,
        PurchaseItem: selected_item,
      });

      rec.RequestCount = selected_item?.RequestCount;

      if (
        agents?.find(
          (ag) => ag.PurchaseAgentID === selected_item.PurchaseAgentID
        )
      )
        rec.PurchaseAgentID = selected_item.PurchaseAgentID;
    }

    setRecord(rec);
    loadFieldsValue(formRef, rec);
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
      width={950}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24}>
            <DropdownItem
              title={Words.base}
              dataSource={items}
              keyColumn="RefItemID"
              valueColumn={"InfoTitle"}
              formConfig={formConfig}
              onChange={handleChangeItem}
              disabled={selectedObject?.ItemID > 0}
              required
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              title={Words.request_count}
              fieldName="RequestCount"
              min={0}
              max={999999}
              precision={2}
              maxLength={7}
              step="0.01"
              stringMode
              decimalText
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.purchasing_agent}
              dataSource={agents}
              keyColumn="PurchaseAgentID"
              valueColumn={"FullName"}
              formConfig={formConfig}
              required
            />
          </Col>
          {record?.RefItemID > 0 && (
            <Col xs={24}>
              <Form.Item>
                <PurchaseItemDetails
                  selectedItem={getSelectedItem(record.RefItemID)}
                />
              </Form.Item>
            </Col>
          )}
          <Col xs={24} md={12}>
            {selectedObject && selectedObject.ItemID > 0 ? (
              <DropdownItem
                title={Words.status}
                dataSource={statuses}
                keyColumn="StatusID"
                valueColumn="Title"
                formConfig={formConfig}
              />
            ) : (
              <TextItem
                title={Words.status}
                value={Words.inquiry_request_status_1}
                valueColor={Colors.magenta[6]}
              />
            )}
          </Col>
          <Col xs={24}>
            <InputItem
              title={Words.standard_description}
              fieldName="DetailsText"
              multiline
              rows={3}
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

export default InquiryRequestItemModal;
