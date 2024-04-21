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
import service from "../../../../../services/logistic/purchase/service-requests-service";
import InputItem from "../../../../form-controls/input-item";
import DateItem from "../../../../form-controls/date-item";
import DropdownItem from "../../../../form-controls/dropdown-item";
import TextItem from "../../../../form-controls/text-item";
import {
  useModalContext,
  useResetContext,
} from "../../../../contexts/modal-context";
import DetailsTable from "../../../../common/details-table";
import ServiceRequestItemModal from "./service-request-item-modal";
import {
  schema,
  initRecord,
  getServiceRequestItemsColumns,
  getNewServiceRequestItemButton,
  getFooterButtons,
} from "./service-request-modal-code";

const { Text } = Typography;

const formRef = React.createRef();

const ServiceRequestModal = ({
  access,
  isOpen,
  selectedObject,
  onOk,
  onCancel,
  onSaveServiceRequestItem,
  onDeleteServiceRequestItem,
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
  const [purchaseRequestTypes, setPurchaseRequestTypes] = useState([]); // NOTE: purchase is correct
  const [frontSideTypes, setFrontSideTypes] = useState([]);
  const [hasSaveApproveAccess, setHasSaveApproveAccess] = useState(false);
  const [hasRejectAccess, setHasRejectAccess] = useState(false);

  const [baseTypes, setBaseTypes] = useState([]);
  //   const [bases, setBases] = useState([]);
  const [services, setServices] = useState([]);
  const [purchaseTypes, setPurchaseTypes] = useState([]);
  const [agents, setAgents] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [currentDate, setCurrentDate] = useState("");

  const [selectedServiceRequestItem, setSelectedServiceRequestItem] =
    useState(null);
  const [showServiceRequestItemModal, setShowServiceRequestItemModal] =
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
    setServices(Choices);
    setPurchaseTypes(PurchaseTypes);
    setAgents(Agents);
    setStatuses(Statuses);
  };

  const handleSaveServiceRequestItem = async (service_item) => {
    if (selectedObject !== null) {
      service_item.RequestID = selectedObject.RequestID;

      const saved_service_request_item = await onSaveServiceRequestItem(
        service_item
      );

      const index = record.Items.findIndex(
        (item) => item.ItemID === service_item.ItemID
      );

      if (index === -1) {
        record.Items = [...record.Items, saved_service_request_item];
      } else {
        record.Items[index] = saved_service_request_item;
      }
    } else {
      //While adding items temporarily, we have no jpin operation in database
      //So, we need to select titles manually
      service_item.BaseTypeTitle = baseTypes.find(
        (r) => r.BaseTypeID === service_item.BaseTypeID
      )?.Title;

      const service = services.find(
        (r) => r.NeededItemID === service_item.NeededItemID
      );

      if (service) {
        service_item.NeededItemCode = `${service.NeededItemID}`;
        service_item.NeededItemTitle = service.Title;
        service_item.MeasureUnitTitle = service.MeasureUnitTitle;
      }

      service_item.PurchaseTypeTitle = purchaseTypes.find(
        (r) => r.PurchaseTypeID === service_item.PurchaseTypeID
      )?.Title;

      const agent = agents.find(
        (r) => r.ServiceAgentID === service_item.ServiceAgentID
      );

      service_item.AgentFirstName = agent ? agent.FirstName : "";
      service_item.AgentLastName = agent ? agent.LastName : "";

      service_item.StatusTitle = statuses.find(
        (sts) => sts.StatusID === service_item.StatusID
      )?.Title;

      //--- managing unique id (UID) for new items
      if (service_item.ItemID === 0 && selectedServiceRequestItem === null) {
        service_item.UID = uuid();
        record.Items = [...record.Items, service_item];
      } else if (
        service_item.ItemID === 0 &&
        selectedServiceRequestItem !== null
      ) {
        const index = record.Items.findIndex(
          (item) => item.UID === selectedServiceRequestItem.UID
        );
        record.Items[index] = service_item;
      }
    }

    //------

    setRecord({ ...record });
    setSelectedServiceRequestItem(null);
  };

  const handleDeleteServiceRequestItem = async (item) => {
    setProgress(true);

    try {
      if (item.ItemID > 0) {
        await onDeleteServiceRequestItem(item.ItemID);

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

  const handleCloseServiceRequestItemModal = () => {
    setSelectedServiceRequestItem(null);
    setShowServiceRequestItemModal(false);
  };

  const handleEditServiceRequestItem = (data) => {
    setSelectedServiceRequestItem(data);
    setShowServiceRequestItemModal(true);
  };

  const handleNewItemClick = () => {
    setSelectedServiceRequestItem(null);
    setShowServiceRequestItemModal(true);
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
        width={1250}
        footer={getFooterButtons(footer_config)}
        onCancel={onCancel}
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
                  {Words.service_items}
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
                          columns={getServiceRequestItemsColumns(
                            access,
                            status_id,
                            handleEditServiceRequestItem,
                            handleDeleteServiceRequestItem
                          )}
                          emptyDataMessage={Words.no_service_item}
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
                  {getNewServiceRequestItemButton(
                    record?.FrontSideAccountID === 0,
                    handleNewItemClick
                  )}
                </Form.Item>
              </Col>
            )}
          </Row>
        </Form>
      </ModalWindow>

      {showServiceRequestItemModal && (
        <ServiceRequestItemModal
          isOpen={showServiceRequestItemModal}
          selectedObject={selectedServiceRequestItem}
          setParams={handleGetItemParams}
          onOk={handleSaveServiceRequestItem}
          onCancel={handleCloseServiceRequestItemModal}
        />
      )}
    </>
  );
};

export default ServiceRequestModal;
