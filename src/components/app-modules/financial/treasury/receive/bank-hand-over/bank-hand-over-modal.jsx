import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Space, Popconfirm, Button, Tabs } from "antd";
import { QuestionCircleOutlined as QuestionIcon } from "@ant-design/icons";
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
import service from "../../../../../../services/financial/treasury/receive/bank-hand-overs-service";
import DateItem from "../../../../../form-controls/date-item";
import DropdownItem from "../../../../../form-controls/dropdown-item";
import TextItem from "../../../../../form-controls/text-item";
import {
  useModalContext,
  useResetContext,
} from "../../../../../contexts/modal-context";
import DetailsTable from "../../../../../common/details-table";
import ChequeModal from "./bank-hand-over-cheque-modal";
import DemandModal from "./bank-hand-over-demand-modal";
import { v4 as uuid } from "uuid";
import PriceViewer from "../../../../../common/price-viewer";
import {
  schema,
  initRecord,
  getChequeColumns,
  getDemandColumns,
  getNewButton,
  calculatePrice,
} from "./bank-hand-over-modal-code";

const { TabPane } = Tabs;

const formRef = React.createRef();

const BankHandOverModal = ({
  access,
  isOpen,
  selectedObject,
  onOk,
  onCancel,
  onSaveBankHandOverItem,
  onDeleteBankHandOverItem,
  onReject,
  onApprove,
}) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [companyBankAccounts, setCompanyBankAccounts] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [itemTypes] = useState([
    { ItemType: 1, Title: Words.cheque },
    { ItemType: 2, Title: Words.demand },
  ]);
  const [operations, setOperations] = useState([]);
  const [standardDetails, setStandardDetails] = useState([]);
  const [hasSaveApproveAccess, setHasSaveApproveAccess] = useState(false);
  const [hasRejectAccess, setHasRejectAccess] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [showChequeModal, setShowChequeModal] = useState(false);
  const [showDemandModal, setShowDemandModal] = useState(false);

  const [selectedTab, setSelectedTab] = useState("cheques");
  const [selectedCheque, setSelectedCheque] = useState(null);
  const [selectedDemand, setSelectedDemand] = useState(null);

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.CompanyBankAccountID = 0;
    record.CurrencyID = 0;
    record.ItemType = 0;
    record.HandOverDate = "";
    record.OperationID = 0;
    record.StandardDetailsID = 0;
    record.StatusID = 1;
    record.Cheques = [];
    record.Demands = [];

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();

    //------

    setProgress(true);

    try {
      //------ load receipt params

      let data = await service.getParams();

      let {
        CompanyBankAccounts,
        Currencies,
        Operations,
        StandardDetails,
        HasSaveApproveAccess,
        HasRejectAccess,
      } = data;

      setCompanyBankAccounts(CompanyBankAccounts);
      setCurrencies(Currencies);
      setOperations(Operations);
      setStandardDetails(StandardDetails);
      setHasSaveApproveAccess(HasSaveApproveAccess);
      setHasRejectAccess(HasRejectAccess);

      if (selectedObject !== null) {
        setSelectedTab(selectedObject.ItemType === 1 ? "cheques" : "demands");

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

  const handleSelectCheque = (cheque) => {
    if (cheque.ChequeID > 0) setSelectedCheque(cheque);
    else setSelectedCheque(null);
  };

  const handleSaveCheque = async () => {
    if (selectedObject !== null) {
      selectedCheque.HandOverID = selectedObject.HandOverID;

      const saved_cheque = await onSaveBankHandOverItem(
        "cheque",
        "ItemID",
        selectedCheque
      );

      const index = record.Cheques.findIndex(
        (item) => item.ItemID === selectedCheque.ItemID
      );

      if (index === -1) {
        record.Cheques = [...record.Cheques, saved_cheque];
      } else {
        record.Cheques[index] = saved_cheque;
      }
    } else {
      const cheque_to_save = { ...selectedCheque };

      //--- managing unique id (UID) for new items
      if (cheque_to_save.ItemID === 0 && selectedItem === null) {
        cheque_to_save.UID = uuid();
        record.Cheques = [...record.Cheques, cheque_to_save];
      } else if (cheque_to_save.ItemID === 0 && selectedItem !== null) {
        const index = record.Cheques.findIndex(
          (item) => item.UID === selectedItem.UID
        );
        record.Cheques[index] = cheque_to_save;
      }
    }

    //------

    setRecord({ ...record });
    setSelectedItem(null);
  };

  const handleDeleteCheque = async (cheque_to_delete) => {
    setProgress(true);

    try {
      if (cheque_to_delete.ItemID > 0) {
        await onDeleteBankHandOverItem(
          "cheque",
          "ItemID",
          cheque_to_delete.ItemID
        );

        record.Cheques = record.Cheques.filter(
          (i) => i.ItemID !== cheque_to_delete.ItemID
        );
      } else {
        record.Cheques = record.Cheques.filter(
          (i) => i.UID !== cheque_to_delete.UID
        );
      }

      setRecord({ ...record });
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleCloseChequeModal = () => {
    setSelectedItem(null);
    setShowChequeModal(false);
  };

  const handleEditCheque = (data) => {
    setSelectedItem(data);
    setShowChequeModal(true);
  };

  //------

  const handleSelectDemand = (cheque) => {
    if (cheque.DemandID > 0) setSelectedDemand(cheque);
    else setSelectedDemand(null);
  };

  const handleSaveDemand = async () => {
    if (selectedObject !== null) {
      selectedDemand.HandOverID = selectedObject.HandOverID;

      const saved_demand = await onSaveBankHandOverItem(
        "demand",
        "ItemID",
        selectedDemand
      );

      const index = record.Demands.findIndex(
        (item) => item.ItemID === selectedDemand.ItemID
      );

      if (index === -1) {
        record.Demands = [...record.Demands, saved_demand];
      } else {
        record.Demands[index] = saved_demand;
      }
    } else {
      const demand_to_save = { ...selectedDemand };

      //--- managing unique id (UID) for new items
      if (demand_to_save.ItemID === 0 && selectedItem === null) {
        demand_to_save.UID = uuid();
        record.Demands = [...record.Demands, demand_to_save];
      } else if (demand_to_save.ItemID === 0 && selectedItem !== null) {
        const index = record.Demands.findIndex(
          (item) => item.UID === selectedItem.UID
        );
        record.Demands[index] = demand_to_save;
      }
    }

    //------

    setRecord({ ...record });
    setSelectedItem(null);
  };

  const handleDeleteDemand = async (demand_to_delete) => {
    setProgress(true);

    try {
      if (demand_to_delete.ItemID > 0) {
        await onDeleteBankHandOverItem(
          "demand",
          "ItemID",
          demand_to_delete.ItemID
        );

        record.Demands = record.Demands.filter(
          (i) => i.ItemID !== demand_to_delete.ItemID
        );
      } else {
        record.Demands = record.Demands.filter(
          (i) => i.UID !== demand_to_delete.UID
        );
      }

      setRecord({ ...record });
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleCloseDemandModal = () => {
    setSelectedItem(null);
    setShowDemandModal(false);
  };

  const handleEditDemand = (data) => {
    setSelectedItem(data);
    setShowDemandModal(true);
  };

  //------

  const handleShowNewModal = () => {
    switch (selectedTab) {
      case "cheques":
        setShowChequeModal(true);
        break;
      case "demands":
        setShowDemandModal(true);
        break;
      default:
        break;
    }
  };

  const handleNewButtonClick = () => {
    setSelectedItem(null);
    handleShowNewModal();
  };

  const getFooterButtons = (is_disable) => {
    return (
      <Space>
        {selectedObject === null && (
          <>
            <Button
              key="submit-button"
              type="primary"
              onClick={handleSubmit}
              loading={progress}
              disabled={is_disable}
            >
              {Words.submit}
            </Button>

            {hasSaveApproveAccess && (
              <Popconfirm
                title={Words.questions.sure_to_submit_approve_bank_hand_over}
                onConfirm={handleSubmitAndApprove}
                okText={Words.yes}
                cancelText={Words.no}
                icon={<QuestionIcon style={{ color: "red" }} />}
                key="submit-approve-button"
                disabled={is_disable || progress}
              >
                <Button
                  key="submit-approve-button"
                  type="primary"
                  disabled={is_disable || progress}
                >
                  {Words.submit_and_approve}
                </Button>
              </Popconfirm>
            )}

            <Button key="clear-button" onClick={clearRecord}>
              {Words.clear}
            </Button>
          </>
        )}

        {selectedObject !== null && selectedObject.StatusID === 1 && (
          <>
            {hasSaveApproveAccess && (
              <Popconfirm
                title={Words.questions.sure_to_submit_approve_bank_hand_over}
                onConfirm={onApprove}
                okText={Words.yes}
                cancelText={Words.no}
                icon={<QuestionIcon style={{ color: "red" }} />}
                key="submit-approve-button"
                disabled={is_disable || progress}
              >
                <Button
                  key="submit-approve-button"
                  type="primary"
                  disabled={is_disable || progress}
                >
                  {Words.submit_and_approve}
                </Button>
              </Popconfirm>
            )}

            {hasRejectAccess && (
              <Popconfirm
                title={Words.questions.sure_to_reject_request}
                onConfirm={onReject}
                okText={Words.yes}
                cancelText={Words.no}
                icon={<QuestionIcon style={{ color: "red" }} />}
                key="reject-confirm"
                disabled={progress}
              >
                <Button key="reject-button" type="primary" danger>
                  {Words.reject_request}
                </Button>
              </Popconfirm>
            )}
          </>
        )}

        <Button key="close-button" onClick={onCancel}>
          {Words.close}
        </Button>
      </Space>
    );
  };

  const handleChangeItemType = (value) => {
    const rec = { ...record };
    rec.ItemType = value || 0;
    if (value === 0) rec.OperationID = 0;
    setRecord(rec);
    setSelectedTab(value === 1 ? "cheques" : "demands");

    //-- Reset selected financial operation while changing item type (cheque/demand)
    loadFieldsValue(formRef, rec);
  };

  //------

  const getDisableStatus = () => {
    const is_disable =
      (record?.Cheques?.length || 0 + record?.Demands?.length || 0) === 0 ||
      (validateForm({ record, schema }) && true);

    return is_disable;
  };

  const status_id =
    selectedObject === null ? record.StatusID : selectedObject.StatusID;

  const price = calculatePrice(record);

  return (
    <>
      <ModalWindow
        isOpen={isOpen}
        isEdit={isEdit}
        inProgress={progress}
        disabled={getDisableStatus()}
        width={1050}
        footer={getFooterButtons(getDisableStatus())}
        onCancel={onCancel}
      >
        <Form ref={formRef} name="dataForm">
          <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
            <Col xs={24} md={12}>
              <DropdownItem
                title={Words.bank_account}
                dataSource={companyBankAccounts}
                keyColumn="CompanyBankAccountID"
                valueColumn="InfoTitle"
                formConfig={formConfig}
                required
                autoFocus
                disabled={
                  record?.Cheques?.length > 0 || record?.Demands?.length > 0
                }
              />
            </Col>
            <Col xs={24} md={12}>
              <DropdownItem
                title={Words.item_type}
                dataSource={itemTypes}
                keyColumn="ItemType"
                valueColumn="Title"
                formConfig={formConfig}
                required
                disabled={
                  record?.Cheques?.length > 0 || record?.Demands?.length > 0
                }
                onChange={handleChangeItemType}
              />
            </Col>
            <Col xs={24} md={12}>
              <DropdownItem
                title={Words.currency}
                dataSource={currencies}
                keyColumn="CurrencyID"
                valueColumn="Title"
                formConfig={formConfig}
                required
              />
            </Col>
            <Col xs={24} md={12}>
              <DropdownItem
                title={Words.financial_operation}
                dataSource={operations.filter(
                  (o) => o.ItemTypeID === record.ItemType
                )}
                keyColumn="OperationID"
                valueColumn="Title"
                formConfig={formConfig}
                required
                disabled={record.ItemType === 0}
              />
            </Col>
            <Col xs={24} md={12}>
              <DateItem
                horizontal
                required
                title={Words.hand_over_date}
                fieldName="HandOverDate"
                formConfig={formConfig}
              />
            </Col>
            <Col xs={24} md={12}>
              <DropdownItem
                title={Words.standard_description}
                dataSource={standardDetails}
                keyColumn="StandardDetailsID"
                valueColumn="DetailsText"
                formConfig={formConfig}
              />
            </Col>

            {price.Total > 0 && (
              <Col xs={24}>
                <TextItem
                  title={Words.price}
                  value={`${utils.farsiNum(utils.moneyNumber(price.Total))} ${
                    Words.ryal
                  }`}
                  valueColor={Colors.magenta[6]}
                />
              </Col>
            )}

            {record?.ItemType > 0 && record?.CompanyBankAccountID > 0 && (
              <>
                <Col xs={24}>
                  <Form.Item>
                    <Tabs
                      type="card"
                      defaultActiveKey="0"
                      // onChange={handleTabChange}
                    >
                      {record.ItemType === 1 && (
                        <TabPane tab={Words.cheque} key="cheques">
                          <Row gutter={[0, 15]}>
                            <Col xs={24}>
                              <DetailsTable
                                records={record.Cheques}
                                columns={getChequeColumns(
                                  access,
                                  status_id,
                                  handleEditCheque,
                                  handleDeleteCheque
                                )}
                              />
                            </Col>
                            <Col xs={24}>
                              <PriceViewer price={price.ChequesAmount} />
                            </Col>
                          </Row>
                        </TabPane>
                      )}

                      {record.ItemType === 2 && (
                        <TabPane tab={Words.demand} key="demands">
                          <Row gutter={[0, 15]}>
                            <Col xs={24}>
                              <DetailsTable
                                records={record.Demands}
                                columns={getDemandColumns(
                                  access,
                                  status_id,
                                  handleEditDemand,
                                  handleDeleteDemand
                                )}
                              />
                            </Col>
                            <Col xs={24}>
                              <PriceViewer price={price.DemandsAmount} />
                            </Col>
                          </Row>
                        </TabPane>
                      )}
                    </Tabs>
                  </Form.Item>
                </Col>

                {status_id === 1 && (
                  <Col xs={24}>
                    <Form.Item>{getNewButton(handleNewButtonClick)}</Form.Item>
                  </Col>
                )}
              </>
            )}
          </Row>
        </Form>
      </ModalWindow>

      {showChequeModal && (
        <ChequeModal
          isOpen={showChequeModal}
          selectedObject={selectedItem}
          currentCheques={record.Cheques}
          companyBankAccountID={record?.CompanyBankAccountID}
          onSelectCheque={handleSelectCheque}
          onOk={handleSaveCheque}
          onCancel={handleCloseChequeModal}
        />
      )}

      {showDemandModal && (
        <DemandModal
          isOpen={showDemandModal}
          selectedObject={selectedItem}
          currentDemands={record.Demands}
          companyBankAccountID={record?.CompanyBankAccountID}
          onSelectDemand={handleSelectDemand}
          onOk={handleSaveDemand}
          onCancel={handleCloseDemandModal}
        />
      )}
    </>
  );
};

export default BankHandOverModal;
