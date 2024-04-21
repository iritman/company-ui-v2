import React, { useState } from "react";
import { useMount } from "react-use";
import {
  Button,
  Row,
  Col,
  Typography,
  Descriptions,
  Tabs,
  Space,
  Popconfirm,
  Popover,
  Menu,
  message,
} from "antd";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import {
  QuestionCircleOutlined as QuestionIcon,
  // RetweetOutlined as RefreshIcon,
  SettingOutlined as SettingsIcon,
} from "@ant-design/icons";
import { handleError } from "../../../../../tools/form-manager";
import DetailsTable from "../../../../common/details-table";
import ModalWindow from "../../../../common/modal-window";
import service from "../../../../../services/logistic/purchase/inquiry-requests-service";
import invoiceService from "../../../../../services/logistic/purchase/invoices-service";
import {
  getInquiryItemColumns,
  getInquirySupplierColumns,
} from "./inquiry-request-modal-code";
import InvoiceModal from "../../../logistic/purchase/invoices/invoice-modal";

const { Text } = Typography;

const InquiryRequestDetailsModal = ({
  selectedObject,
  isOpen,
  onOk,
  onUndoApprove,
}) => {
  const valueColor = Colors.blue[7];

  const [progress, setProgress] = useState(false);
  const [hasUndoApproveAccess, setHasUndoApproveAccess] = useState(false);
  const [isReturnableInquiry, setIsReturnableInquiry] = useState(false);
  const [, setHasShowRelationsAccess] = useState(false);
  // const [hasShowRelationsAccess, setHasShowRelationsAccess] = useState(false);
  const [hasRegInvoiceAccess, setHasRegInvoiceAccess] = useState(false);

  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [newInvoice, setNewInvoice] = useState(null);

  const {
    RequestID,
    InquiryDeadline,
    InquiryDate,
    // RegMemberID,
    RegFirstName,
    RegLastName,
    // StatusID,
    StatusTitle,
    RegDate,
    RegTime,
    DetailsText,
    Items,
    Suppliers,
  } = selectedObject;

  useMount(async () => {
    setProgress(true);

    try {
      //------ load params

      let data = await service.getParams();
      let is_returnable_invoice = await service.isReturnableRequest(
        selectedObject?.RequestID
      );

      let {
        HasUndoApproveAccess,
        HasShowRelationsAccess,
        HasRegInvoiceAccess,
      } = data;

      setIsReturnableInquiry(is_returnable_invoice.IsReturnable);
      setHasUndoApproveAccess(HasUndoApproveAccess);
      setHasShowRelationsAccess(HasShowRelationsAccess);
      setHasRegInvoiceAccess(HasRegInvoiceAccess);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  });

  const handleRegInvoice = async () => {
    try {
      const valid_requested_items_for_invoice =
        await invoiceService.getValidInquiryItemsForInvoice(RequestID);

      if (valid_requested_items_for_invoice.length > 0) {
        const invoice = {
          InvoiceID: 0,
          InvoiceNo: "",
          SupplierID: 0,
          TransportTypeID: 0,
          PurchaseWayID: 0,
          InvoiceDate: "",
          CreditDate: "",
          PaymentTypeID: 0,
          PaymentAmount: 0,
          DetailsText: "",
          StatusID: 1,
        };

        let items = [];
        // let suppliers = [];

        valid_requested_items_for_invoice.forEach((item) => {
          const request_item = {};

          request_item.ItemID = 0;
          request_item.InvoiceID = 0;
          request_item.NeededItemCode = item.NeededItemCode;
          request_item.NeededItemTitle = item.NeededItemTitle;
          request_item.RefItemID = item.RefItemID;
          request_item.RequestCount = item.RequestCount;
          request_item.MeasureUnitTitle = item.MeasureUnitTitle;
          request_item.PurchaseAgentID = item.PurchaseAgentID;
          request_item.AgentFirstName = item.AgentFirstName;
          request_item.AgentLastName = item.AgentLastName;
          request_item.Fee = 0;
          request_item.Price = 0;
          request_item.Returnable = false;
          request_item.DeliveryDuration = 0;
          request_item.DetailsText = "";
          request_item.StatusID = 1;
          request_item.StatusTitle = Words.invoice_status_1;
          items = [...items, request_item];

          //------

          // item.Suppliers.forEach((supplier) => {
          //   const _supplier = {};

          //   _supplier.RowID = 0;
          //   _supplier.RefItemID = item.RefItemID;
          //   _supplier.RequestID = 0;
          //   _supplier.SupplierID = supplier.SupplierID;
          //   _supplier.SupplierTitle = supplier.Title;
          //   _supplier.ActivityTypeID = supplier.ActivityTypeID;
          //   _supplier.ActivityTypeTitle = supplier.ActivityTypeTitle;

          //   suppliers = [...suppliers, _supplier];
          // });
        });

        invoice.Items = items;
        // invoice.Suppliers = suppliers;

        setNewInvoice(invoice);
        setShowInvoiceModal(true);
      } else {
        message.warn(Words.no_valid_inquiry_request_item_to_invoice);
      }
    } catch (ex) {
      handleError(ex);
    }
  };

  const handleShowRelations = () => {
    // ToDo...
  };

  const getSettingsMenu = (has_reg_invoice_access) => {
    let items = [];

    if (has_reg_invoice_access)
      items = [...items, { label: Words.reg_invoice, key: "reg_invoice_item" }];

    items = [
      ...items,
      { label: Words.show_relations, key: "show_relations_item" },
    ];

    const onClick = (e) => {
      switch (e.key) {
        case "reg_invoice_item": {
          handleRegInvoice();
          break;
        }

        case "show_relations_item": {
          handleShowRelations();
          break;
        }

        default: {
          break;
        }
      }

      setShowSettingsMenu(false);
    };

    return <Menu onClick={onClick} items={items} selectable={false} />;
  };

  const getFooterButtons = () => {
    return (
      <Space>
        {selectedObject !== null && selectedObject.StatusID === 2 && (
          <>
            <Popover
              trigger="click"
              content={getSettingsMenu(hasRegInvoiceAccess)}
              open={showSettingsMenu}
              onOpenChange={() => setShowSettingsMenu(!showSettingsMenu)}
            >
              <Button
                key="settings-button"
                disabled={progress}
                loading={progress}
                icon={<SettingsIcon style={{ color: Colors.grey[6] }} />}
              />
            </Popover>

            {hasUndoApproveAccess && isReturnableInquiry && (
              <Popconfirm
                title={Words.questions.sure_to_undo_approve_inquiry_request}
                onConfirm={onUndoApprove}
                okText={Words.yes}
                cancelText={Words.no}
                icon={<QuestionIcon style={{ color: "red" }} />}
                key="undo-approve-confirm"
                disabled={progress}
              >
                <Button
                  key="undo-approve-button"
                  type="primary"
                  disabled={progress}
                >
                  {Words.undo_approve}
                </Button>
              </Popconfirm>
            )}
          </>
        )}

        <Button key="close-button" onClick={onOk}>
          {Words.close}
        </Button>
      </Space>
    );
  };

  const items = [
    {
      label: Words.inquiry_items,
      key: "items-tab",
      children: (
        <Row gutter={[0, 15]}>
          <Col xs={24}>
            <DetailsTable records={Items} columns={getInquiryItemColumns()} />
          </Col>
        </Row>
      ),
    },
    {
      label: Words.suppliers,
      key: "suppliers-tab",
      children: (
        <Row gutter={[0, 15]}>
          <Col xs={24}>
            <DetailsTable
              records={Suppliers}
              columns={getInquirySupplierColumns()}
            />
          </Col>
        </Row>
      ),
    },
  ];

  const handleSaveInvoice = async (request) => {
    const savedRow = await invoiceService.saveData(request);

    setIsReturnableInquiry(false);
    setNewInvoice(savedRow);
  };

  // ------

  return (
    <>
      <ModalWindow
        isOpen={isOpen}
        title={Words.more_details}
        footer={getFooterButtons()}
        showIcon={false}
        onCancel={onOk}
        width={1050}
      >
        <Row gutter={[10, 10]}>
          <Col xs={24}>
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
              <Descriptions.Item label={Words.id}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(`${RequestID}`)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.request_date}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(utils.slashDate(InquiryDate))}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.inquiry_final_deadline}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(utils.slashDate(InquiryDeadline))}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.status} span={2}>
                <Text
                  style={{
                    color: valueColor,
                  }}
                >
                  {StatusTitle}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.reg_member}>
                <Text
                  style={{ color: valueColor }}
                >{`${RegFirstName} ${RegLastName}`}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.reg_date_time} span={2}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(
                    `${utils.slashDate(RegDate)} - ${utils.colonTime(RegTime)}`
                  )}
                </Text>
              </Descriptions.Item>
              {DetailsText?.length > 0 && (
                <Descriptions.Item label={Words.descriptions} span={3}>
                  <Text
                    style={{
                      color: Colors.purple[7],
                      whiteSpace: "pre-line",
                    }}
                  >
                    {utils.farsiNum(DetailsText)}
                  </Text>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Col>
          <Col xs={24}>
            <Tabs type="card" defaultActiveKey="0" items={items} />
          </Col>
        </Row>
      </ModalWindow>

      {showInvoiceModal && (
        <InvoiceModal
          access={{ CanEdit: true, CanDelete: true }}
          onOk={handleSaveInvoice}
          title={Words.reg_invoice}
          onCancel={() => setShowInvoiceModal(false)}
          isOpen={showInvoiceModal}
          selectedObject={newInvoice}
        />
      )}
    </>
  );
};

export default InquiryRequestDetailsModal;
