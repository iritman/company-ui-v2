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
  Tooltip,
  Popover,
  Menu,
  message,
} from "antd";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import {
  QuestionCircleOutlined as QuestionIcon,
  RetweetOutlined as RefreshIcon,
  SettingOutlined as SettingsIcon,
} from "@ant-design/icons";
import { handleError } from "../../../../../tools/form-manager";
import DetailsTable from "../../../../common/details-table";
import ModalWindow from "../../../../common/modal-window";
import service from "../../../../../services/financial/store-operations/product-requests-service";
import purchaseRequestService from "../../../../../services/logistic/purchase/purchase-requests-service";
import { getProductRequestItemsColumns } from "./product-request-modal-code";
import PurchaseRequestModal from "../../../logistic/purchase/purchase-requests/purchase-request-modal";

const { Text } = Typography;

const ProductRequestDetailsModal = ({
  selectedObject,
  isOpen,
  onOk,
  onUndoApprove,
  onRefreshStoreInventory,
}) => {
  const valueColor = Colors.blue[7];

  const [progress, setProgress] = useState(false);
  const [hasUndoApproveAccess, setHasUndoApproveAccess] = useState(false);
  const [isReturnableRequest, setIsReturnableRequest] = useState(false);
  const [hasSeeStoreInventoryAccess, setHasSeeStoreInventoryAccess] =
    useState(false);
  const [hasShowRelationsAccess, setHasShowRelationsAccess] = useState(false);
  const [hasRegPurchaseRequestAccess, setHasRegPurchaseRequestAccess] =
    useState(false);
  const [
    hasRegStoreInventoryVoucherAccess,
    setHasRegStoreInventoryVoucherAccess,
  ] = useState(false);

  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showPurchaseRequestModal, setShowPurchaseRequestModal] =
    useState(false);
  const [newPurchaseRequest, setNewPurchaseRequest] = useState(null);

  const {
    RequestID,
    //   StorageCenterID,
    // StorageCenterTitle,
    FrontSideTypeID,
    FrontSideTypeTitle,
    FrontSideAccountID,
    FrontSideAccountTitle,
    // RegMemberID,
    RegFirstName,
    RegLastName,
    RequestDate,
    NeededDate,
    RequestMemberID,
    RequestMemberFirstName,
    RequestMemberLastName,
    // RequestTypeID,
    RequestTypeTitle,
    // FromStoreID,
    FromStoreTitle,
    // ToStoreID,
    ToStoreTitle,
    StatusID,
    StatusTitle,
    // TafsilCode,
    // TafsilTypeID,
    // TafsilTypeTitle,
    RegDate,
    RegTime,
    DetailsText,
    Items,
  } = selectedObject;

  useMount(async () => {
    setProgress(true);

    try {
      //------ load params

      let data = await service.getParams();
      let is_returnable_request = await service.isReturnableRequest(
        selectedObject?.RequestID
      );

      let {
        HasUndoApproveAccess,
        HasSeeStoreInventoryAccess,
        HasShowRelationsAccess,
        HasRegPurchaseRequestAccess,
        HasRegStoreInventoryVoucherAccess,
      } = data;

      setIsReturnableRequest(is_returnable_request.IsReturnable);
      setHasUndoApproveAccess(HasUndoApproveAccess);
      setHasSeeStoreInventoryAccess(HasSeeStoreInventoryAccess);
      setHasShowRelationsAccess(HasShowRelationsAccess);
      setHasRegPurchaseRequestAccess(HasRegPurchaseRequestAccess);
      setHasRegStoreInventoryVoucherAccess(HasRegStoreInventoryVoucherAccess);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  });

  const handleRegPurchaseRequest = async () => {
    try {
      const valid_requested_products_for_purchase =
        await purchaseRequestService.getNotExistsProductsForPurchase(RequestID);

      if (valid_requested_products_for_purchase.length > 0) {
        const purchase_request = {
          RequestID: 0,
          ItemsTypeID: 1,
          StorageCenterID: 1,
          FrontSideTypeID,
          FrontSideAccountID,
          RequestMemberID,
          RequestTypeID: 0,
          RequestDate,
          DetailsText: "",
          StatusID: 1,
        };

        let items = [];

        valid_requested_products_for_purchase.forEach((product) => {
          const request_product = {};

          request_product.ItemID = 0;
          request_product.RequestID = 0;
          request_product.BaseTypeID = 2; // request product from store inventory
          request_product.BaseTypeTitle = Words.product_requests;
          request_product.BaseID = product.ItemID;
          request_product.NeededItemTypeID = 1;
          request_product.NeededItemID = product.ProductID;
          request_product.NeededItemTitle = product.Title;
          request_product.NeededItemCode = product.ProductCode;
          request_product.NeededItemMeasureUnitID = product.MeasureUnitID;
          request_product.MeasureUnitTitle = product.MeasureUnitTitle;
          request_product.RequestCount = product.RequestCount;
          request_product.NeedDate = NeededDate;
          request_product.PurchaseTypeID = 0;
          request_product.PurchaseTypeTitle = "";
          request_product.InquiryDeadline = "";
          request_product.PurchaseAgentID = 0;
          request_product.AgentFirstName = "";
          request_product.AgentLastName = "";
          request_product.Suppliers = [];
          request_product.SuppliersIDs = [];
          request_product.DetailsText = "";
          request_product.StatusID = 1;
          request_product.StatusTitle = Words.purchase_request_status_1;

          items = [...items, request_product];
        });

        purchase_request.Items = items;

        setNewPurchaseRequest(purchase_request);
        setShowPurchaseRequestModal(true);
      } else {
        message.warn(Words.no_valid_product_request_to_purchase);
      }
    } catch (ex) {
      handleError(ex);
    }
  };

  const handleRegStoreInventoryVoucher = () => {
    // ToDo...
  };

  const handleShowRelations = () => {
    // ToDo...
  };

  const getSettingsMenu = (
    has_reg_purchase_request_access,
    has_reg_store_inventory_voucher_access
  ) => {
    let items = [];

    if (has_reg_purchase_request_access)
      items = [
        ...items,
        { label: Words.reg_purchase_request, key: "reg_purchase_request_item" },
      ];

    if (has_reg_store_inventory_voucher_access)
      items = [
        ...items,
        {
          label: Words.reg_store_inventory_voucher,
          key: "reg_store_inventory_voucher_item",
        },
      ];

    items = [
      ...items,
      { label: Words.show_relations, key: "show_relations_item" },
    ];

    const onClick = (e) => {
      switch (e.key) {
        case "reg_purchase_request_item": {
          handleRegPurchaseRequest();
          break;
        }

        case "reg_store_inventory_voucher_item": {
          handleRegStoreInventoryVoucher();
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
              content={getSettingsMenu(
                hasRegPurchaseRequestAccess,
                hasRegStoreInventoryVoucherAccess
              )}
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

            {hasSeeStoreInventoryAccess && (
              <Tooltip title={Words.update_store_inventory}>
                <Button
                  key="refresh-inventory-stock"
                  disabled={progress}
                  loading={progress}
                  icon={<RefreshIcon style={{ color: Colors.red[6] }} />}
                  onClick={onRefreshStoreInventory}
                />
              </Tooltip>
            )}

            {hasUndoApproveAccess && isReturnableRequest && (
              <Popconfirm
                title={Words.questions.sure_to_undo_approve_product_request}
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
      label: Words.product_items,
      key: "product-items",
      children: (
        <Row gutter={[0, 15]}>
          <Col xs={24}>
            <DetailsTable
              records={Items}
              columns={getProductRequestItemsColumns()}
            />
          </Col>
        </Row>
      ),
    },
  ];

  const handleSavePurchaseRequest = async (request) => {
    const savedRow = await purchaseRequestService.saveData(request);

    setIsReturnableRequest(false);
    setNewPurchaseRequest(savedRow);
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
              {/* <Descriptions.Item label={Words.storage_center}>
                <Text style={{ color: valueColor }}>{StorageCenterTitle}</Text>
              </Descriptions.Item> */}
              <Descriptions.Item label={Words.request_date}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(utils.slashDate(RequestDate))}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.need_date}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(utils.slashDate(NeededDate))}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.front_side_type}>
                <Text style={{ color: valueColor }}>{FrontSideTypeTitle}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.front_side}>
                <Text style={{ color: valueColor }}>
                  {FrontSideAccountTitle}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.request_type}>
                <Text style={{ color: valueColor }}>{RequestTypeTitle}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.request_member}>
                <Text style={{ color: valueColor }}>
                  {`${RequestMemberFirstName} ${RequestMemberLastName}`}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.from_store}>
                <Text style={{ color: valueColor }}>{FromStoreTitle}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.to_store}>
                <Text style={{ color: valueColor }}>{ToStoreTitle}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.status}>
                <Text
                  style={{
                    color:
                      StatusID === 1
                        ? Colors.blue[6]
                        : StatusID === 2
                        ? Colors.green[6]
                        : Colors.red[6],
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
              <Descriptions.Item label={Words.reg_date_time}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(
                    `${utils.slashDate(RegDate)} - ${utils.colonTime(RegTime)}`
                  )}
                </Text>
              </Descriptions.Item>
              {DetailsText.length > 0 && (
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

      {showPurchaseRequestModal && (
        <PurchaseRequestModal
          access={{ CanEdit: true, CanDelete: true }}
          onOk={handleSavePurchaseRequest}
          title={Words.reg_purchase_request}
          onCancel={() => setShowPurchaseRequestModal(false)}
          isOpen={showPurchaseRequestModal}
          selectedObject={newPurchaseRequest}
        />
      )}
    </>
  );
};

export default ProductRequestDetailsModal;
