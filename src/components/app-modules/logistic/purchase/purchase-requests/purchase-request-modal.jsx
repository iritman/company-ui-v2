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
import service from "../../../../../services/logistic/purchase/purchase-requests-service";
import InputItem from "../../../../form-controls/input-item";
import DateItem from "../../../../form-controls/date-item";
import DropdownItem from "../../../../form-controls/dropdown-item";
import TextItem from "../../../../form-controls/text-item";
import {
  useModalContext,
  useResetContext,
} from "../../../../contexts/modal-context";
import DetailsTable from "../../../../common/details-table";
import PurchaseRequestItemModal from "./purchase-request-item-modal";
import {
  schema,
  initRecord,
  getPurchaseRequestItemsColumns,
  getNewPurchaseRequestItemButton,
  getFooterButtons,
} from "./purchase-request-modal-code";

const { Text } = Typography;

const formRef = React.createRef();

const PurchaseRequestModal = ({
  access,
  isOpen,
  selectedObject,
  title,
  onOk,
  onCancel,
  onSavePurchaseRequestItem,
  onDeletePurchaseRequestItem,
  onReject,
  onApprove,
}) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [frontSideAccountSearchProgress, setFrontSideAccountSearchProgress] =
    useState(false);
  const [frontSideAccounts, setFrontSideAccounts] = useState([]);

  const [memberSearchProgress, setMemberSearchProgress] = useState(false);
  const [members, setMembers] = useState([]);

  const [storageCenters, setStorageCenters] = useState([]);
  const [purchaseRequestTypes, setPurchaseRequestTypes] = useState([]);
  const [frontSideTypes, setFrontSideTypes] = useState([]);
  const [hasSaveApproveAccess, setHasSaveApproveAccess] = useState(false);
  const [hasRejectAccess, setHasRejectAccess] = useState(false);

  const [baseTypes, setBaseTypes] = useState([]);
  //   const [bases, setBases] = useState([]);
  const [products, setProducts] = useState([]);
  const [purchaseTypes, setPurchaseTypes] = useState([]);
  const [agents, setAgents] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [currentDate, setCurrentDate] = useState("");

  const [selectedPurchaseRequestItem, setSelectedPurchaseRequestItem] =
    useState(null);
  const [showPurchaseRequestItemModal, setShowPurchaseRequestItemModal] =
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
    record.StorageCenterID = 0;
    record.FrontSideTypeID = 0;
    record.FrontSideAccountID = 0;
    record.RequestMemberID = 0;
    record.RequestTypeID = 0;
    record.RequestDate = currentDate;
    record.DetailsText = "";
    record.StatusID = 1;
    record.Items = [];

    setRecord(record);
    setErrors({});
    setFrontSideAccounts([]);
    setMembers([]);
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();

    //------

    setProgress(true);

    try {
      const data = await service.getParams();

      let {
        StorageCenters,
        PurchaseRequestTypes,
        FrontSideTypes,
        HasSaveApproveAccess,
        HasRejectAccess,
        CurrentDate,
      } = data;

      setStorageCenters(StorageCenters);
      setPurchaseRequestTypes(PurchaseRequestTypes);
      setFrontSideTypes(FrontSideTypes);
      setHasSaveApproveAccess(HasSaveApproveAccess);
      setHasRejectAccess(HasRejectAccess);
      setCurrentDate(CurrentDate);

      //------

      if (!selectedObject) {
        const rec = { ...initRecord };
        rec.RequestDate = `${CurrentDate}`;

        setRecord({ ...rec });
        loadFieldsValue(formRef, { ...rec });
      } else {
        const request_member = await service.searchMemberByID(
          selectedObject.RequestMemberID
        );

        request_member.forEach((m) => {
          m.RequestMemberID = m.MemberID;
        });

        setMembers(request_member);

        //---

        const front_side_account = await service.searchFrontSideAccountByID(
          selectedObject.FrontSideAccountID
        );

        setFrontSideAccounts(front_side_account);
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
        item.StatusTitle = Words.purchase_request_status_2;
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
    const { BaseTypes, Choices, PurchaseTypes, Agents, Statuses } = params;

    setBaseTypes(BaseTypes);
    setProducts(Choices);
    setPurchaseTypes(PurchaseTypes);
    setAgents(Agents);
    setStatuses(Statuses);
  };

  const handleSavePurchaseRequestItem = async (purchase_item) => {
    if (selectedObject !== null && selectedObject.RequestID > 0) {
      purchase_item.RequestID = selectedObject.RequestID;

      const saved_purchase_request_item = await onSavePurchaseRequestItem(
        purchase_item
      );

      const index = record.Items.findIndex(
        (item) => item.ItemID === purchase_item.ItemID
      );

      if (index === -1) {
        record.Items = [...record.Items, saved_purchase_request_item];
      } else {
        record.Items[index] = saved_purchase_request_item;
      }
    } else {
      //While adding items temporarily, we have no jpin operation in database
      //So, we need to select titles manually
      purchase_item.BaseTypeTitle = baseTypes.find(
        (r) => r.BaseTypeID === purchase_item.BaseTypeID
      )?.Title;

      const product = products.find(
        (r) => r.NeededItemID === purchase_item.NeededItemID
      );

      if (product) {
        purchase_item.NeededItemCode = product.ProductCode;
        purchase_item.NeededItemTitle = product.Title;
        purchase_item.MeasureUnitTitle = product.MeasureUnits.find(
          (mu) =>
            mu.NeededItemMeasureUnitID === purchase_item.NeededItemMeasureUnitID
        )?.MeasureUnitTitle;
      }

      purchase_item.PurchaseTypeTitle = purchaseTypes.find(
        (r) => r.PurchaseTypeID === purchase_item.PurchaseTypeID
      )?.Title;

      const agent = agents.find(
        (r) => r.PurchaseAgentID === purchase_item.PurchaseAgentID
      );

      purchase_item.AgentFirstName = agent ? agent.FirstName : "";
      purchase_item.AgentLastName = agent ? agent.LastName : "";

      purchase_item.StatusTitle = statuses.find(
        (sts) => sts.StatusID === purchase_item.StatusID
      )?.Title;

      //--- managing unique id (UID) for new items
      if (purchase_item.ItemID === 0 && selectedPurchaseRequestItem === null) {
        purchase_item.UID = uuid();
        record.Items = [...record.Items, purchase_item];
      } else if (
        purchase_item.ItemID === 0 &&
        selectedPurchaseRequestItem !== null
      ) {
        const index = record.Items.findIndex(
          (item) => item.UID === selectedPurchaseRequestItem.UID
        );
        record.Items[index] = purchase_item;
      }
    }

    //------

    setRecord({ ...record });
    setSelectedPurchaseRequestItem(null);
  };

  const handleDeletePurchaseRequestItem = async (item) => {
    setProgress(true);

    try {
      if (item.ItemID > 0) {
        await onDeletePurchaseRequestItem(item.ItemID);

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

  const handleClosePurchaseRequestItemModal = () => {
    setSelectedPurchaseRequestItem(null);
    setShowPurchaseRequestItemModal(false);
  };

  const handleEditPurchaseRequestItem = (data) => {
    setSelectedPurchaseRequestItem(data);
    setShowPurchaseRequestItemModal(true);
  };

  const handleNewItemClick = () => {
    setSelectedPurchaseRequestItem(null);
    setShowPurchaseRequestItemModal(true);
  };

  //------

  const handleSearchMember = async (searchText) => {
    setMemberSearchProgress(true);

    try {
      const data = await service.searchMembers(searchText);

      data.forEach((m) => {
        m.RequestMemberID = m.MemberID;
      });

      setMembers(data);
    } catch (ex) {
      handleError(ex);
    }

    setMemberSearchProgress(false);
  };

  const handleChangeFrontSideType = async (value) => {
    const rec = { ...record };
    rec.FrontSideTypeID = value || 0;
    rec.FrontSideAccountID = 0;

    setRecord(rec);

    if (value === 0) {
      setFrontSideAccounts([]);
    } else {
      const data = await handleSearchFrontSideAccount(value);
      setFrontSideAccounts(data);
    }
    loadFieldsValue(formRef, rec);
  };

  const handleSearchFrontSideAccount = async (typeID) => {
    let data = [];

    setFrontSideAccountSearchProgress(true);

    try {
      data = await service.searchFrontSideAccounts(typeID);

      setFrontSideAccounts(data);
    } catch (ex) {
      handleError(ex);
    }

    setFrontSideAccountSearchProgress(false);

    return data;
  };

  //------

  // const hasUncompletedItems = (items) => {
  //   return (
  //     items?.filter(
  //       (i) =>
  //         i.Suppliers?.length === 0 ||
  //         i.PurchaseTypeID === 0 ||
  //         i.PurchaseAgentID === 0
  //     ).length > 0
  //   );
  // };

  const is_disable =
    !record?.Items ||
    record?.Items?.length === 0 ||
    // hasUncompletedItems(record?.Items) ||
    (validateForm({ record, schema }) && true);

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
            {selectedObject && (
              <Col xs={24}>
                <TextItem
                  title={Words.id}
                  value={
                    selectedObject
                      ? utils.farsiNum(selectedObject.RequestID)
                      : "-"
                  }
                  valueColor={Colors.magenta[6]}
                />
              </Col>
            )}
            <Col xs={24} md={12} lg={8}>
              <DropdownItem
                title={Words.storage_center}
                dataSource={storageCenters}
                keyColumn="StorageCenterID"
                valueColumn="Title"
                formConfig={formConfig}
                required
              />
            </Col>
            <Col xs={24} md={12} lg={8}>
              <DropdownItem
                title={Words.request_type}
                dataSource={purchaseRequestTypes}
                keyColumn="RequestTypeID"
                valueColumn="Title"
                formConfig={formConfig}
              />
            </Col>
            <Col xs={24} md={12} lg={8}>
              <DropdownItem
                title={Words.request_member}
                dataSource={members}
                keyColumn="RequestMemberID"
                valueColumn="FullName"
                formConfig={formConfig}
                loading={memberSearchProgress}
                onSearch={handleSearchMember}
              />
            </Col>
            <Col xs={24} md={12} lg={8}>
              <DateItem
                horizontal
                required
                title={Words.request_date}
                fieldName="RequestDate"
                formConfig={formConfig}
              />
            </Col>
            <Col xs={24} md={12} lg={8}>
              <DropdownItem
                title={Words.front_side_type}
                dataSource={frontSideTypes}
                keyColumn="FrontSideTypeID"
                valueColumn="Title"
                formConfig={formConfig}
                onChange={handleChangeFrontSideType}
                required
              />
            </Col>
            <Col xs={24} md={12} lg={8}>
              <DropdownItem
                title={Words.front_side_account}
                dataSource={frontSideAccounts}
                keyColumn="FrontSideAccountID"
                valueColumn="FrontSideAccountTitle"
                formConfig={formConfig}
                loading={frontSideAccountSearchProgress}
                onSearch={handleSearchFrontSideAccount}
                disabled={record.FrontSideTypeID === 0}
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
                  {Words.purchase_items}
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
                          columns={getPurchaseRequestItemsColumns(
                            access,
                            status_id,
                            handleEditPurchaseRequestItem,
                            handleDeletePurchaseRequestItem
                          )}
                          emptyDataMessage={Words.no_purchase_item}
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
                  {getNewPurchaseRequestItemButton(
                    record?.FrontSideAccountID === 0,
                    handleNewItemClick
                  )}
                </Form.Item>
              </Col>
            )}
          </Row>
        </Form>
      </ModalWindow>

      {showPurchaseRequestItemModal && (
        <PurchaseRequestItemModal
          isOpen={showPurchaseRequestItemModal}
          selectedObject={selectedPurchaseRequestItem}
          setParams={handleGetItemParams}
          onOk={handleSavePurchaseRequestItem}
          onCancel={handleClosePurchaseRequestItemModal}
        />
      )}
    </>
  );
};

export default PurchaseRequestModal;
