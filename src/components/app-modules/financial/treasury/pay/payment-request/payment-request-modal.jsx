import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Divider, Typography } from "antd";
import ModalWindow from "../../../../../common/modal-window";
import Words from "../../../../../../resources/words";
import Colors from "../../../../../../resources/colors";
import utils from "../../../../../../tools/utils";
import { v4 as uuid } from "uuid";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
  handleError,
} from "../../../../../../tools/form-manager";
import service from "../../../../../../services/financial/treasury/pay/payment-requests-service";
import InputItem from "../../../../../form-controls/input-item";
import DateItem from "../../../../../form-controls/date-item";
import DropdownItem from "../../../../../form-controls/dropdown-item";
import {
  useModalContext,
  useResetContext,
} from "../../../../../contexts/modal-context";
import DetailsTable from "../../../../../common/details-table";
import PriceViewer from "../../../../../common/price-viewer";
import PaymentRequestItemModal from "./payment-request-item-modal";
import {
  schema,
  initRecord,
  getPaymentRequestItemsColumns,
  getNewPaymentRequestItemButton,
  calculateTotalPrice,
  getFooterButtons,
} from "./payment-request-modal-code";

const { Text } = Typography;

const formRef = React.createRef();

const PaymentRequestModal = ({
  access,
  isOpen,
  selectedObject,
  onOk,
  onCancel,
  onSavePaymentRequestItem,
  onDeletePaymentRequestItem,
  onReject,
  onApprove,
}) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [frontSideAccountSearchProgress, setFrontSideAccountSearchProgress] =
    useState(false);
  const [frontSideAccounts, setFrontSideAccounts] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [standardDetails, setStandardDetails] = useState([]);
  const [payTypes, setPayTypes] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [hasSaveApproveAccess, setHasSaveApproveAccess] = useState(false);
  const [hasRejectAccess, setHasRejectAccess] = useState(false);

  const [selectedPaymentRequestItem, setSelectedPaymentRequestItem] =
    useState(null);
  const [showPaymentRequestItemModal, setShowPaymentRequestItemModal] =
    useState(false);

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.CurrencyID = 0;
    record.PayTypeID = 0;
    record.FrontSideAccountID = 0;
    record.PayDate = "";
    record.StandardDetailsID = 0;
    record.DetailsText = "";
    record.StatusID = 1;
    record.Items = [];

    setRecord(record);
    setErrors({});
    setFrontSideAccounts([]);
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();

    //------

    setProgress(true);

    try {
      const data = await service.getParams();

      let {
        Currencies,
        PayTypes,
        StandardDetails,
        ItemTypes,
        HasSaveApproveAccess,
        HasRejectAccess,
      } = data;

      setCurrencies(Currencies);
      setPayTypes(PayTypes);
      setStandardDetails(StandardDetails);
      setItemTypes(ItemTypes);
      setHasSaveApproveAccess(HasSaveApproveAccess);
      setHasRejectAccess(HasRejectAccess);

      if (selectedObject) {
        const { FrontSideAccountID, FrontSideAccountTitle } = selectedObject;

        setFrontSideAccounts([
          { FrontSideAccountID, Title: FrontSideAccountTitle },
        ]);

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

  const isEdit = selectedObject !== null;

  const handleChangeFrontSideAccount = (value) => {
    const rec = { ...record };
    rec.FrontSideAccountID = value || 0;
    setRecord(rec);
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

  const handleSavePaymentRequestItem = async (payment_item) => {
    if (selectedObject !== null) {
      payment_item.RequestID = selectedObject.RequestID;

      const saved_payment_request_item = await onSavePaymentRequestItem(
        payment_item
      );

      const index = record.Items.findIndex(
        (item) => item.ItemID === payment_item.ItemID
      );

      if (index === -1) {
        record.Items = [...record.Items, saved_payment_request_item];
      } else {
        record.Items[index] = saved_payment_request_item;
      }
    } else {
      //While adding items temporarily, we have no jpin operation in database
      //So, we need to select titles manually
      payment_item.ItemTypeTitle = itemTypes.find(
        (it) => it.ItemTypeID === payment_item.ItemTypeID
      )?.Title;
      payment_item.StandardDetailsText = standardDetails.find(
        (si) => si.StandardDetailsID === payment_item.StandardDetailsID
      )?.StandardDetailsText;

      //--- managing unique id (UID) for new items
      if (payment_item.ItemID === 0 && selectedPaymentRequestItem === null) {
        payment_item.UID = uuid();
        record.Items = [...record.Items, payment_item];
      } else if (
        payment_item.ItemID === 0 &&
        selectedPaymentRequestItem !== null
      ) {
        const index = record.Items.findIndex(
          (item) => item.UID === selectedPaymentRequestItem.UID
        );
        record.Items[index] = payment_item;
      }
    }

    //------

    setRecord({ ...record });
    setSelectedPaymentRequestItem(null);
  };

  const handleDeletePaymentRequestItem = async (item) => {
    setProgress(true);

    try {
      if (item.ItemID > 0) {
        await onDeletePaymentRequestItem(item.ItemID);

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

  const handleClosePaymentRequestItemModal = () => {
    setSelectedPaymentRequestItem(null);
    setShowPaymentRequestItemModal(false);
  };

  const handleEditPaymentRequestItem = (data) => {
    setSelectedPaymentRequestItem(data);
    setShowPaymentRequestItemModal(true);
  };

  const handleNewItemClick = () => {
    setSelectedPaymentRequestItem(null);
    setShowPaymentRequestItemModal(true);
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

  return (
    <>
      <ModalWindow
        isOpen={isOpen}
        isEdit={isEdit}
        inProgress={progress}
        disabled={is_disable}
        width={1050}
        footer={getFooterButtons(footer_config)}
        onCancel={onCancel}
      >
        <Form ref={formRef} name="dataForm">
          <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
            <Col xs={24} md={12}>
              <DropdownItem
                title={Words.currencies}
                dataSource={currencies}
                keyColumn="CurrencyID"
                valueColumn="Title"
                formConfig={formConfig}
                required
              />
            </Col>
            <Col xs={24} md={12}>
              <DropdownItem
                title={Words.pay_type}
                dataSource={payTypes}
                keyColumn="PayTypeID"
                valueColumn="Title"
                formConfig={formConfig}
                required
              />
            </Col>
            <Col xs={24} md={12}>
              <DropdownItem
                title={Words.front_side}
                dataSource={frontSideAccounts}
                keyColumn="FrontSideAccountID"
                valueColumn="Title"
                formConfig={formConfig}
                required
                loading={frontSideAccountSearchProgress}
                onSearch={handleSearchFrontSideAccount}
                onChange={handleChangeFrontSideAccount}
              />
            </Col>
            <Col xs={24} md={12}>
              <DateItem
                horizontal
                required
                title={Words.request_date}
                fieldName="PayDate"
                formConfig={formConfig}
              />
            </Col>
            <Col xs={24} md={12}>
              <DropdownItem
                title={Words.standard_details_text}
                dataSource={standardDetails}
                keyColumn="StandardDetailsID"
                valueColumn="StandardDetailsText"
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
            {/* ToDo: Implement base_doc_id field based on the selected base type */}
            <Col xs={24}>
              <Divider orientation="right">
                <Text style={{ fontSize: 14, color: Colors.green[6] }}>
                  {Words.payment_items}
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
                          columns={getPaymentRequestItemsColumns(
                            access,
                            status_id,
                            handleEditPaymentRequestItem,
                            handleDeletePaymentRequestItem
                          )}
                          emptyDataMessage={Words.no_payment_item}
                        />
                      </Col>
                      <Col xs={24}>
                        <PriceViewer
                          price={calculateTotalPrice(record?.Items)}
                        />
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
              </>
            )}

            {status_id === 1 && (
              <Col xs={24}>
                <Form.Item>
                  {getNewPaymentRequestItemButton(handleNewItemClick)}
                </Form.Item>
              </Col>
            )}
          </Row>
        </Form>
      </ModalWindow>

      {showPaymentRequestItemModal && (
        <PaymentRequestItemModal
          isOpen={showPaymentRequestItemModal}
          selectedObject={selectedPaymentRequestItem}
          onOk={handleSavePaymentRequestItem}
          onCancel={handleClosePaymentRequestItemModal}
        />
      )}
    </>
  );
};

export default PaymentRequestModal;
