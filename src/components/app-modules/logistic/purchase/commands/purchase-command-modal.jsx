import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Divider, Typography } from "antd";
import ModalWindow from "../../../../common/modal-window";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import { v4 as uuid } from "uuid";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
  handleError,
} from "../../../../../tools/form-manager";
import service from "../../../../../services/logistic/purchase/purchase-commands-service";
import InputItem from "../../../../form-controls/input-item";
import DateItem from "../../../../form-controls/date-item";
import TextItem from "../../../../form-controls/text-item";
import {
  useModalContext,
  useResetContext,
} from "../../../../contexts/modal-context";
import DetailsTable from "../../../../common/details-table";
import CommandItemModal from "./purchase-command-item-modal";
import {
  schema,
  initRecord,
  getCommandItemColumns,
  getNewButton,
  getFooterButtons,
} from "./purchase-command-modal-code";

const { Text } = Typography;

const formRef = React.createRef();

const PurchaseCommandModal = ({
  access,
  isOpen,
  selectedObject,
  title,
  onOk,
  onCancel,
  onSaveCommandItem,
  onDeleteCommandItem,
  onReject,
  onApprove,
}) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [hasSaveApproveAccess, setHasSaveApproveAccess] = useState(false);
  const [hasRejectAccess, setHasRejectAccess] = useState(false);

  const [statuses, setStatuses] = useState([]);
  const [invoiceItem, setInvoiceItem] = useState(null);

  const [selectedCommandItem, setSelectedCommandItem] = useState(null);
  const [showCommandItemModal, setShowCommandItemModal] = useState(false);
  const [, setCurrentDate] = useState("");
  // const [currentDate, setCurrentDate] = useState("");

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.OrderDate = "";
    record.DetailsText = "";
    record.StatusID = 1;
    record.Items = [];

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();

    //------

    setProgress(true);

    try {
      const data = await service.getParams();

      let { HasSaveApproveAccess, HasRejectAccess, CurrentDate } = data;

      setHasSaveApproveAccess(HasSaveApproveAccess);
      setHasRejectAccess(HasRejectAccess);
      setCurrentDate(CurrentDate);

      //------

      if (!selectedObject) {
        const rec = { ...initRecord };
        rec.CommandDate = `${CurrentDate}`;

        setRecord({ ...rec });
        loadFieldsValue(formRef, { ...rec });
      } else {
        initModal(formRef, selectedObject, setRecord);
      }
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  });

  const isEdit = selectedObject !== null;

  const handleSubmit = async () => {
    saveModalChanges(
      formConfig,
      selectedObject,
      setProgress,
      onOk,
      clearRecord
    );
  };

  const handleSubmitAndApprove = async () => {
    const rec = { ...record };
    rec.Items.forEach((item) => {
      if (item.StatusID === 1) {
        item.StatusID = 2;
        item.StatusTitle = Words.purchase_command_status_2;
      }
    });
    rec.StatusID = 2;
    setRecord(rec);

    const updated_config = { ...formConfig };
    updated_config.record = rec;

    saveModalChanges(
      updated_config,
      selectedObject,
      setProgress,
      onOk,
      clearRecord
    );
  };

  //------

  const handleGetItemParams = (params) => {
    const { InvoiceItem, Statuses } = params;

    setInvoiceItem(InvoiceItem);
    setStatuses(Statuses);
  };

  const handleSaveCommandItem = async (command_item) => {
    if (selectedObject !== null && selectedObject.CommandID > 0) {
      command_item.CommandID = selectedObject.CommandID;

      const saved_command_item = await onSaveCommandItem(command_item);

      const index = record.Items.findIndex(
        (item) => item.ItemID === command_item.ItemID
      );

      if (index === -1) {
        record.Items = [...record.Items, saved_command_item];
      } else {
        record.Items[index] = saved_command_item;
      }
    } else {
      //While adding items temporarily, we have no jpin operation in database
      //So, we need to select titles manually

      if (invoiceItem) {
        const {
          NeededItemCode,
          NeededItemTitle,
          MeasureUnitTitle,
          FrontSideAccountTitle,
          NeedDate,
          RequestDate,
          InquiryDeadline,
          AgentFirstName,
          AgentLastName,
          // StatusTitle,
        } = invoiceItem;

        command_item = {
          ...command_item,
          NeededItemCode,
          NeededItemTitle,
          MeasureUnitTitle,
          FrontSideAccountTitle,
          NeedDate,
          RequestDate,
          InquiryDeadline,
          AgentFirstName,
          AgentLastName,
          // StatusTitle,
        };
      }

      command_item.StatusTitle = statuses?.find(
        (sts) => sts.StatusID === command_item.StatusID
      )?.Title;

      //--- managing unique id (UID) for new items
      if (command_item.ItemID === 0 && selectedCommandItem === null) {
        command_item.UID = uuid();
        record.Items = [...record.Items, command_item];
      } else if (command_item.ItemID === 0 && selectedCommandItem !== null) {
        const index = record.Items.findIndex(
          (item) => item.UID === selectedCommandItem.UID
        );
        record.Items[index] = command_item;
      }
    }

    //------

    setRecord({ ...record });
    setSelectedCommandItem(null);
  };

  const handleDeleteCommandItem = async (item) => {
    setProgress(true);

    try {
      if (item.ItemID > 0) {
        await onDeleteCommandItem(item.ItemID);

        record.Items = record.Items.filter((i) => i.ItemID !== item.ItemID);
      } else {
        record.Items = record.Items.filter((i) => i.UID !== item.UID);
      }

      setRecord({ ...record });
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleCloseCommandItemModal = () => {
    setSelectedCommandItem(null);
    setShowCommandItemModal(false);
  };

  const handleEditCommandItem = (data) => {
    setSelectedCommandItem(data);
    setShowCommandItemModal(true);
  };

  const handleNewItemClick = () => {
    setSelectedCommandItem(null);
    setShowCommandItemModal(true);
  };

  //------

  const is_disable =
    record?.Items?.length === 0 || (validateForm({ record, schema }) && true);

  const status_id =
    selectedObject === null ? record.StatusID : selectedObject.StatusID;

  const footer_config = {
    is_disable,
    progress,
    hasSaveApproveAccess,
    selectedObject,
    handleSubmit,
    handleSubmitAndApprove,
    hasRejectAccess,
    clearRecord,
    onApprove,
    onReject,
    onCancel,
  };

  //------

  return (
    <>
      <ModalWindow
        isOpen={isOpen}
        isEdit={isEdit}
        inProgress={progress}
        disabled={is_disable}
        width={1250}
        footer={getFooterButtons(footer_config)}
        onCancel={onCancel}
        title={title}
      >
        <Form ref={formRef} name="dataForm">
          <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
            {selectedObject && selectedObject.CommandID > 0 && (
              <Col xs={24}>
                <TextItem
                  title={Words.id}
                  value={
                    selectedObject
                      ? utils.farsiNum(selectedObject.CommandID)
                      : "-"
                  }
                  valueColor={Colors.magenta[6]}
                />
              </Col>
            )}
            <Col xs={24} md={12} lg={8}>
              <DateItem
                horizontal
                title={Words.purchase_command_date}
                fieldName="CommandDate"
                formConfig={formConfig}
                required
              />
            </Col>
            <Col xs={24}>
              <InputItem
                title={Words.descriptions}
                fieldName="DetailsText"
                multiline
                rows={2}
                showCount
                maxLength={512}
                formConfig={formConfig}
              />
            </Col>

            {/* ToDo: Implement base_doc_id field based on the selected base type */}
            <Col xs={24}>
              <Divider orientation="right">
                <Text style={{ fontSize: 14, color: Colors.green[6] }}>
                  {Words.purchase_command_items}
                </Text>
              </Divider>
            </Col>

            {record.Items && (
              <>
                <Col xs={24}>
                  <Form.Item>
                    <Row gutter={[0, 15]}>
                      <Col xs={24}>
                        <DetailsTable
                          records={record.Items}
                          columns={getCommandItemColumns(
                            access,
                            status_id,
                            handleEditCommandItem,
                            handleDeleteCommandItem
                          )}
                          emptyDataMessage={Words.no_purchase_command_item}
                        />
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
              </>
            )}

            {status_id === 1 && (
              <Col xs={24}>
                <Form.Item>{getNewButton(false, handleNewItemClick)}</Form.Item>
              </Col>
            )}
          </Row>
        </Form>
      </ModalWindow>

      {showCommandItemModal && (
        <CommandItemModal
          isOpen={showCommandItemModal}
          selectedObject={selectedCommandItem}
          selectedItems={record?.Items}
          setParams={handleGetItemParams}
          onOk={handleSaveCommandItem}
          onCancel={handleCloseCommandItemModal}
        />
      )}
    </>
  );
};

export default PurchaseCommandModal;
