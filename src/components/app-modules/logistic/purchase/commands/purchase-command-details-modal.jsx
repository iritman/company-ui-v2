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
import service from "../../../../../services/logistic/purchase/purchase-commands-service";
import orderService from "../../../../../services/logistic/purchase/purchase-orders-service";
import { getCommandItemColumns } from "./purchase-command-modal-code";
import OrderModal from "../../../logistic/purchase/orders/purchase-order-modal";

const { Text } = Typography;

const PurchaseCommandDetailsModal = ({
  selectedObject,
  isOpen,
  onOk,
  onUndoApprove,
}) => {
  const valueColor = Colors.blue[7];

  const [progress, setProgress] = useState(false);
  const [hasUndoApproveAccess, setHasUndoApproveAccess] = useState(false);
  const [isReturnableCommand, setIsReturnableCommand] = useState(false);
  const [, setHasShowRelationsAccess] = useState(false);
  // const [hasShowRelationsAccess, setHasShowRelationsAccess] = useState(false);
  const [hasRegOrderAccess, setHasRegOrderAccess] = useState(false);

  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [newOrder, setNewOrder] = useState(null);
  const [currentDate, setCurrentDate] = useState("");

  const {
    CommandID,
    CommandDate,
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
      let is_returnable_command = await service.isReturnableCommand(
        selectedObject?.CommandID
      );

      let {
        HasUndoApproveAccess,
        HasShowRelationsAccess,
        HasRegOrderAccess,
        CurrentDate,
      } = data;

      setIsReturnableCommand(is_returnable_command.IsReturnable);
      setHasUndoApproveAccess(HasUndoApproveAccess);
      setHasShowRelationsAccess(HasShowRelationsAccess);
      setHasRegOrderAccess(HasRegOrderAccess);
      setCurrentDate(CurrentDate);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  });

  const handleRegOrder = async () => {
    try {
      const valid_requested_items_for_order =
        await orderService.getValidCommandItemsForOrder(CommandID);

      if (valid_requested_items_for_order.length > 0) {
        const order = {
          OrderID: 0,
          OrderDate: `${currentDate}`,
          SupplierID: 0,
          BaseTypeID: 1,
          BaseID: 0,
          DetailsText: "",
          StatusID: 1,
        };

        let items = [];
        // let suppliers = [];

        valid_requested_items_for_order.forEach((item) => {
          const order_item = {};

          order_item.ItemID = 0;
          order_item.OrderID = 0;
          order_item.BaseTypeID = 3;
          order_item.BaseTypeTitle = Words.purchase_command_items;
          order_item.ItemCode = item.NeededItemCode;
          order_item.NeededItemCode = item.NeededItemCode;
          order_item.NeededItemTitle = item.NeededItemTitle;
          order_item.RefItemID = item.RefItemID;
          order_item.RequestCount = item.RequestCount;
          order_item.MeasureUnitID = item.MeasureUnitID;
          order_item.MeasureUnitTitle = item.MeasureUnitTitle;
          order_item.PurchaseAgentID = item.PurchaseAgentID;
          order_item.AgentFirstName = item.AgentFirstName;
          order_item.AgentLastName = item.AgentLastName;
          order_item.Fee = item.Fee;
          order_item.Price = item.Fee * item.RequestCount;
          order_item.TolerancePercent = item.TolerancePercent;
          order_item.Returnable = false;
          order_item.DeliveryDuration = 0;
          order_item.DetailsText = "";
          order_item.StatusID = 1;
          order_item.StatusTitle = Words.invoice_status_1;
          items = [...items, order_item];

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

        order.Items = items;
        // invoice.Suppliers = suppliers;
        console.log(order);
        setNewOrder(order);
        setShowOrderModal(true);
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

  const getSettingsMenu = (has_reg_order_access) => {
    let items = [];

    if (has_reg_order_access)
      items = [...items, { label: Words.reg_order, key: "reg_order_item" }];

    items = [
      ...items,
      { label: Words.show_relations, key: "show_relations_item" },
    ];

    const onClick = (e) => {
      switch (e.key) {
        case "reg_order_item": {
          handleRegOrder();
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
              content={getSettingsMenu(hasRegOrderAccess)}
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

            {hasUndoApproveAccess && isReturnableCommand && (
              <Popconfirm
                title={Words.questions.sure_to_undo_approve_command_request}
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

  const handleSaveOrder = async (request) => {
    const savedRow = await orderService.saveData(request);

    setIsReturnableCommand(false);
    setNewOrder(savedRow);
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
                lg: 3,
                md: 3,
                xs: 1,
              }}
              size="middle"
            >
              <Descriptions.Item label={Words.id}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(`${CommandID}`)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.purchase_command_date}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(utils.slashDate(CommandDate))}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.status}>
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
                  columns={getCommandItemColumns()}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </ModalWindow>

      {showOrderModal && (
        <OrderModal
          access={{ CanEdit: true, CanDelete: true }}
          onOk={handleSaveOrder}
          title={Words.reg_order}
          onCancel={() => setShowOrderModal(false)}
          isOpen={showOrderModal}
          selectedObject={newOrder}
        />
      )}
    </>
  );
};

export default PurchaseCommandDetailsModal;
