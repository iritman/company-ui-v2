import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Descriptions, Typography } from "antd";
import ModalWindow from "../../../../common/modal-window";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import {
  loadFieldsValue,
  initModal,
  saveModalChanges,
  handleError,
} from "../../../../../tools/form-manager";
import service from "../../../../../services/financial/financial-docs/vouchers-service";
import InputItem from "../../../../form-controls/input-item";
import NumericInputItem from "../../../../form-controls/numeric-input-item";
import DateItem from "../../../../form-controls/date-item";
import DropdownItem from "../../../../form-controls/dropdown-item";
import TextItem from "../../../../form-controls/text-item";
import {
  useModalContext,
  useResetContext,
} from "../../../../contexts/modal-context";
import DetailsTable from "../../../../common/details-table";
import VoucherItemModal from "./voucher-item-modal";
import { v4 as uuid } from "uuid";
import {
  schema,
  initRecord,
  //   getTabPanes,
  getColumns,
  getNewButton,
  getFooterButtons,
  getDisableStatus,
  calculatePrice,
  findTitle,
} from "./voucher-modal-code";

const { Text } = Typography;

const formRef = React.createRef();

const VoucherModal = ({
  access,
  isOpen,
  selectedObject,
  onOk,
  onCancel,
  onSaveVoucherItem,
  onDeleteVoucherItem,
  onReject,
  onApprove,
}) => {
  const {
    progress,
    setProgress,
    record,
    setRecord,
    showModal,
    setShowModal,
    errors,
    setErrors,
  } = useModalContext();

  const [moeins, setMoeins] = useState([]);
  //   const [employees, setEmployees] = useState([]);
  //   const [statuses, setStatuses] = useState([]);
  const [standardDetails, setStandardDetails] = useState([]);
  const [hasSaveApproveAccess, setHasSaveApproveAccess] = useState(false);
  const [hasRejectAccess, setHasRejectAccess] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.SubNo = 0;
    record.VoucherDate = "";
    record.StandardDetailsID = 0;
    record.DetailsText = "";
    record.StatusID = 1;
    record.Items = [];
    record.Logs = [];

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();
    setRecord({ ...initRecord });
    loadFieldsValue(formRef, { ...initRecord });
    initModal(formRef, selectedObject, setRecord);

    //------

    setProgress(true);

    try {
      let data = await service.getParams();

      let {
        Moeins,
        // Employees,
        // Statuses,
        StandardDetails,
        HasSaveApproveAccess,
        HasRejectAccess,
      } = data;

      setMoeins(Moeins);
      //   setEmployees(Employees);
      //   setStatuses(Statuses);
      setStandardDetails(StandardDetails);

      setHasSaveApproveAccess(HasSaveApproveAccess);
      setHasRejectAccess(HasRejectAccess);
    } catch (ex) {
      handleError(ex);
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

  const handleSubmitAndApprove = async () => {
    record.StatusID = 2;
    setRecord({ ...record });

    saveModalChanges(
      formConfig,
      selectedObject,
      setProgress,
      onOk,
      clearRecord
    );
  };

  //------

  const handleSaveItem = async (item_to_save) => {
    if (selectedObject !== null) {
      item_to_save.VoucherID = selectedObject.VoucherID;

      const saved_item = await onSaveVoucherItem(item_to_save);

      const index = record.Items.findIndex(
        (item) => item.ItemID === item_to_save.ItemID
      );

      if (index === -1) {
        record.Items = [...record.Items, saved_item];
      } else {
        record.Items[index] = saved_item;
      }
    } else {
      //While adding items temporarily, we have no join operation in database
      //So, we need to select titles manually

      item_to_save.MoeinTitle = findTitle(
        moeins,
        "MoeinID",
        "MoeinTitle",
        item_to_save.MoeinID
      );

      item_to_save.TafsilAccountTitle_Level4 =
        item_to_save.TafsilAccountID_Level4 > 0
          ? moeins
              .find((m) => m.MoeinID === item_to_save.MoeinID)
              .TafsilAccounts_Level4.find(
                (a) => a.TafsilAccountID === item_to_save.TafsilAccountID_Level4
              ).Title
          : "-";

      item_to_save.TafsilAccountTitle_Level5 =
        item_to_save.TafsilAccountID_Level5 > 0
          ? moeins
              .find((m) => m.MoeinID === item_to_save.MoeinID)
              .TafsilAccounts_Level5.find(
                (a) => a.TafsilAccountID === item_to_save.TafsilAccountID_Level5
              ).Title
          : "-";

      item_to_save.TafsilAccountTitle_Level6 =
        item_to_save.TafsilAccountID_Level6 > 0
          ? moeins
              .find((m) => m.MoeinID === item_to_save.MoeinID)
              .TafsilAccounts_Level6.find(
                (a) => a.TafsilAccountID === item_to_save.TafsilAccountID_Level6
              ).Title
          : "-";

      item_to_save.StandardDetailsText = findTitle(
        standardDetails,
        "StandardDetailsID",
        "DetailsText",
        item_to_save.StandardDetailsID
      );

      //--- managing unique id (UID) for new items
      if (item_to_save.ItemID === 0 && selectedItem === null) {
        item_to_save.UID = uuid();
        record.Items = [...record.Items, item_to_save];
      } else if (item_to_save.ItemID === 0 && selectedItem !== null) {
        const index = record.Items.findIndex(
          (item) => item.UID === selectedItem.UID
        );
        record.Items[index] = item_to_save;
      }
    }

    //------

    setRecord({ ...record });
    setSelectedItem(null);
  };

  const handleDeleteItem = async (item_to_delete) => {
    setProgress(true);

    try {
      if (item_to_delete.ItemID > 0) {
        await onDeleteVoucherItem(item_to_delete.ItemID);

        record.Items = record.Items.filter(
          (i) => i.ItemID !== item_to_delete.ItemID
        );
      } else {
        record.Items = record.Items.filter((i) => i.UID !== item_to_delete.UID);
      }

      setRecord({ ...record });
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setShowModal(false);
  };

  const handleEditItem = (data) => {
    setSelectedItem(data);
    setShowModal(true);
  };

  //------

  const handleShowNewModal = () => {
    setShowModal(true);
  };

  const handleClickNewButton = () => {
    setSelectedItem(null);
    handleShowNewModal();
  };

  //------

  const status_id =
    selectedObject === null ? record.StatusID : selectedObject.StatusID;

  const price = calculatePrice(record);

  const footerConfig = {
    selectedObject,
    handleSubmit,
    handleSubmitAndApprove,
    onApprove,
    hasRejectAccess,
    onReject,
    onCancel,
    clearRecord,
    progress,
    hasSaveApproveAccess,
  };

  const isEdit = selectedObject !== null;

  //------

  return (
    <>
      <ModalWindow
        isOpen={isOpen}
        isEdit={isEdit}
        inProgress={progress}
        disabled={getDisableStatus(record)}
        footer={getFooterButtons(getDisableStatus(record), footerConfig)}
        onCancel={onCancel}
        width={1250}
      >
        <Form ref={formRef} name="dataForm">
          <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
            {selectedObject && (
              <>
                <Col xs={24} md={12}>
                  <TextItem
                    title={Words.voucher_id}
                    value={utils.farsiNum(selectedObject.VoucherID)}
                    valueColor={Colors.grey[6]}
                  />
                </Col>
                <Col xs={24} md={12}>
                  <TextItem
                    title={Words.voucher_no}
                    value={utils.farsiNum(selectedObject.VoucherNo)}
                    valueColor={Colors.red[6]}
                  />
                </Col>
              </>
            )}
            <Col xs={24} md={12}>
              <NumericInputItem
                horizontal
                title={Words.sub_no}
                fieldName="SubNo"
                min={0}
                max={999999999}
                formConfig={formConfig}
                autoFocus
              />
            </Col>
            <Col xs={24} md={12}>
              <DateItem
                horizontal
                required
                title={Words.voucher_date}
                fieldName="VoucherDate"
                formConfig={formConfig}
              />
            </Col>
            <Col xs={24} md={12}>
              <TextItem
                title={Words.doc_type}
                value={Words.general}
                valueColor={Colors.cyan[6]}
              />
            </Col>
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

            {record && record.Items && (
              <Col xs={24}>
                <DetailsTable
                  records={record.Items}
                  columns={getColumns(
                    access,
                    status_id,
                    handleEditItem,
                    handleDeleteItem
                  )}
                />
              </Col>
            )}

            {status_id === 1 && (
              <Col xs={24}>
                <Form.Item>{getNewButton(handleClickNewButton)}</Form.Item>
              </Col>
            )}

            <Col xs={24}>
              <Descriptions
                bordered
                column={{
                  //   md: 2, sm: 2,
                  lg: 3,
                  md: 3,
                  xs: 1,
                }}
                size="middle"
              >
                <Descriptions.Item label={Words.total_bedehkar}>
                  <Text
                    style={{
                      color: Colors.red[6],
                    }}
                  >
                    {`${utils.farsiNum(utils.moneyNumber(price.Bedehkar))} ${
                      Words.ryal
                    }`}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.total_bestankar} span={2}>
                  <Text
                    style={{
                      color: Colors.green[6],
                    }}
                  >
                    {`${utils.farsiNum(utils.moneyNumber(price.Bestankar))} ${
                      Words.ryal
                    }`}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.remained_bedehkar}>
                  <Text
                    style={{
                      color: Colors.red[6],
                    }}
                  >
                    {`${utils.farsiNum(
                      utils.moneyNumber(price.RemainedBedehkar)
                    )} ${Words.ryal}`}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.remained_bestankar} span={2}>
                  <Text
                    style={{
                      color: Colors.green[6],
                    }}
                  >
                    {`${utils.farsiNum(
                      utils.moneyNumber(price.RemainedBestankar)
                    )} ${Words.ryal}`}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Form>
      </ModalWindow>

      {showModal && (
        <VoucherItemModal
          isOpen={showModal}
          selectedObject={selectedItem}
          moeins={moeins}
          standardDetails={standardDetails}
          onOk={handleSaveItem}
          onCancel={handleCloseModal}
        />
      )}
    </>
  );
};

export default VoucherModal;
