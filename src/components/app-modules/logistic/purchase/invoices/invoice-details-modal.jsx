import React, { useState } from "react";
import { useMount } from "react-use";
import {
  Button,
  Row,
  Col,
  Typography,
  Descriptions,
  Space,
  Popconfirm,
  Divider,
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
import service from "../../../../../services/logistic/purchase/invoices-service";
import purchaseCommandService from "../../../../../services/logistic/purchase/purchase-commands-service";
import { getInvoiceItemColumns } from "./invoice-modal-code";
import PurchaseCommandModal from "../../../logistic/purchase/commands/purchase-command-modal";

const { Text } = Typography;

const InvoiceDetailsModal = ({
  selectedObject,
  isOpen,
  onOk,
  onUndoApprove,
}) => {
  const valueColor = Colors.blue[7];

  const [progress, setProgress] = useState(false);
  const [hasUndoApproveAccess, setHasUndoApproveAccess] = useState(false);
  const [isReturnableInvoice, setIsReturnableInvoice] = useState(false);
  const [, setHasShowRelationsAccess] = useState(false);
  // const [hasShowRelationsAccess, setHasShowRelationsAccess] = useState(false);
  const [hasRegPurchaseCommandAccess, setHasRegPurchaseCommandAccess] =
    useState(false);

  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showPurchaseCommandModal, setShowPurchaseCommandModal] =
    useState(false);
  const [newPurchaseCommand, setNewPurchaseCommand] = useState(null);
  const [currentDate, setCurrentDate] = useState("");

  const {
    InvoiceID,
    InvoiceNo,
    // SupplierID,
    SupplierTitle,
    // TransportTypeID,
    TransportTypeTitle,
    // PurchaseWayID,
    PurchaseWayTitle,
    InvoiceDate,
    CreditDate,
    //   PaymentTypeID,
    PaymentTypeTitle,
    PrepaymentAmount,
    DetailsText,
    // StatusID,
    StatusTitle,
    // RegMemberID,
    RegFirstName,
    RegLastName,
    RegDate,
    RegTime,
    Items,
  } = selectedObject;

  useMount(async () => {
    setProgress(true);

    try {
      //------ load params

      let data = await service.getParams();
      let is_returnable_invoice = await service.isReturnableInvoice(
        selectedObject?.InvoiceID
      );

      let {
        HasUndoApproveAccess,
        HasShowRelationsAccess,
        HasRegPurchaseCommandAccess,
        CurrentDate,
      } = data;

      setIsReturnableInvoice(is_returnable_invoice.IsReturnable);
      setHasUndoApproveAccess(HasUndoApproveAccess);
      setHasShowRelationsAccess(HasShowRelationsAccess);
      setHasRegPurchaseCommandAccess(HasRegPurchaseCommandAccess);
      setCurrentDate(CurrentDate);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  });

  const handleRegPurchaseCommand = async () => {
    try {
      const valid_invoice_items_for_purchase_command =
        await purchaseCommandService.getValidInvoiceItemsForPurchaseCommand(
          InvoiceID
        );

      if (valid_invoice_items_for_purchase_command.length > 0) {
        const purchase_command = {
          CommandID: 0,
          CommandDate: `${currentDate}`,
          DetailsText: "",
          StatusID: 1,
        };

        let items = [];

        valid_invoice_items_for_purchase_command.forEach((item) => {
          const command_item = {};

          command_item.ItemID = 0;
          command_item.CommandID = 0;
          command_item.NeededItemCode = item.NeededItemCode;
          command_item.NeededItemTitle = item.NeededItemTitle;
          command_item.RefItemID = item.RefItemID;
          command_item.RequestCount = item.RequestCount;
          command_item.MeasureUnitTitle = item.MeasureUnitTitle;
          command_item.PurchaseAgentID = item.PurchaseAgentID;
          command_item.AgentFirstName = item.AgentFirstName;
          command_item.AgentLastName = item.AgentLastName;
          command_item.OrderingDate = `${currentDate}`;
          command_item.Fee = item.Fee;
          command_item.Price = item.Fee * item.RequestCount;
          command_item.TolerancePercent = 0;
          command_item.DetailsText = "";
          command_item.StatusID = 1;
          command_item.StatusTitle = Words.inquiry_request_status_1;
          items = [...items, command_item];
        });

        purchase_command.Items = items;

        setNewPurchaseCommand(purchase_command);
        setShowPurchaseCommandModal(true);
      } else {
        message.warn(Words.no_valid_invoice_item_to_purchase_command);
      }
    } catch (ex) {
      handleError(ex);
    }
  };

  const handleShowRelations = () => {
    // ToDo...
  };

  const getSettingsMenu = (has_reg_purchase_command_access) => {
    let items = [];

    if (has_reg_purchase_command_access)
      items = [
        ...items,
        { label: Words.reg_purchase_command, key: "reg_purchase_command_item" },
      ];

    items = [
      ...items,
      { label: Words.show_relations, key: "show_relations_item" },
    ];

    const onClick = (e) => {
      switch (e.key) {
        case "reg_purchase_command_item": {
          handleRegPurchaseCommand();
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
              content={getSettingsMenu(hasRegPurchaseCommandAccess)}
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

            {hasUndoApproveAccess && isReturnableInvoice && (
              <Popconfirm
                title={Words.questions.sure_to_undo_approve_invoice_request}
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

  const handleSavePurchaseCommand = async (purchase_command) => {
    const savedRow = await purchaseCommandService.saveData(purchase_command);

    setIsReturnableInvoice(false);
    setNewPurchaseCommand(savedRow);
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
                  {utils.farsiNum(`${InvoiceID}`)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.invoice_no}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(`${InvoiceNo}`)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.supplier}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(`${SupplierTitle}`)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.transport_type}>
                <Text style={{ color: valueColor }}>{TransportTypeTitle}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.purchase_way}>
                <Text style={{ color: valueColor }}>{PurchaseWayTitle}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.invoice_date}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(utils.slashDate(InvoiceDate))}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.credit_date}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(utils.slashDate(CreditDate))}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.payment_type}>
                <Text style={{ color: valueColor }}>{PaymentTypeTitle}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.pre_payment_amount}>
                <Text style={{ color: valueColor }}>
                  {PrepaymentAmount > 0
                    ? `${utils.farsiNum(utils.moneyNumber(PrepaymentAmount))} ${
                        Words.ryal
                      }`
                    : "-"}
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
              )}
            </Descriptions>
          </Col>

          <Col xs={24}>
            <Divider orientation="right">
              <Text style={{ fontSize: 14, color: Colors.green[6] }}>
                {Words.invoice_items}
              </Text>
            </Divider>
          </Col>

          <Col xs={24}>
            <Row gutter={[0, 15]}>
              <Col xs={24}>
                <DetailsTable
                  records={Items}
                  columns={getInvoiceItemColumns()}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </ModalWindow>

      {showPurchaseCommandModal && (
        <PurchaseCommandModal
          access={{ CanEdit: true, CanDelete: true }}
          onOk={handleSavePurchaseCommand}
          title={Words.reg_purchase_command}
          onCancel={() => setShowPurchaseCommandModal(false)}
          isOpen={showPurchaseCommandModal}
          selectedObject={newPurchaseCommand}
        />
      )}
    </>
  );
};

export default InvoiceDetailsModal;
