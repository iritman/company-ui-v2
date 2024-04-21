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
import service from "../../../../../services/logistic/purchase/purchase-requests-service";
import inquiryRequestService from "../../../../../services/logistic/purchase/inquiry-requests-service";
import { getPurchaseRequestItemsColumns } from "./purchase-request-modal-code";
import InquiryRequestModal from "../../../logistic/purchase/inquiry-requests/inquiry-request-modal";

const { Text } = Typography;

const PurchaseRequestDetailsModal = ({
  selectedObject,
  isOpen,
  onOk,
  onUndoApprove,
}) => {
  const valueColor = Colors.blue[7];

  const [progress, setProgress] = useState(false);
  const [hasUndoApproveAccess, setHasUndoApproveAccess] = useState(false);
  const [isReturnableRequest, setIsReturnableRequest] = useState(false);
  const [, setHasShowRelationsAccess] = useState(false);
  // const [hasShowRelationsAccess, setHasShowRelationsAccess] = useState(false);
  const [hasRegInquiryRequestAccess, setHasRegInquiryRequestAccess] =
    useState(false);

  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showInquiryRequestModal, setShowInquiryRequestModal] = useState(false);
  const [newInquiryRequest, setNewInquiryRequest] = useState(null);

  const {
    RequestID,
    //   StorageCenterID,
    StorageCenterTitle,
    //   FrontSideTypeID,
    FrontSideTypeTitle,
    //   FrontSideAccountID,
    FrontSideAccountTitle,
    // RegMemberID,
    RegFirstName,
    RegLastName,
    RequestDate,
    // RequestMemberID,
    RequestMemberFirstName,
    RequestMemberLastName,
    // RequestTypeID,
    RequestTypeTitle,
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
        HasShowRelationsAccess,
        HasRegInquiryRequestAccess,
      } = data;

      setIsReturnableRequest(is_returnable_request.IsReturnable);
      setHasUndoApproveAccess(HasUndoApproveAccess);
      setHasShowRelationsAccess(HasShowRelationsAccess);
      setHasRegInquiryRequestAccess(HasRegInquiryRequestAccess);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  });

  const handleRegInquiryRequest = async () => {
    try {
      const valid_requested_items_for_inquiry =
        await inquiryRequestService.getValidPurchaseItemsForInquiry(RequestID);

      if (valid_requested_items_for_inquiry.length > 0) {
        const inquiry_request = {
          RequestID: 0,
          InquiryDeadline: "",
          InquiryDate: "",
          DetailsText: "",
          StatusID: 1,
        };

        let items = [];
        let suppliers = [];

        valid_requested_items_for_inquiry.forEach((item) => {
          const request_item = {};

          request_item.ItemID = 0;
          request_item.RequestID = 0;
          request_item.NeededItemCode = item.NeededItemCode;
          request_item.NeededItemTitle = item.NeededItemTitle;
          request_item.RefItemID = item.RefItemID;
          request_item.RequestCount = item.RequestCount;
          request_item.MeasureUnitTitle = item.MeasureUnitTitle;
          request_item.PurchaseAgentID = item.PurchaseAgentID;
          request_item.AgentFirstName = item.AgentFirstName;
          request_item.AgentLastName = item.AgentLastName;
          request_item.DetailsText = "";
          request_item.StatusID = 1;
          request_item.StatusTitle = Words.inquiry_request_status_1;
          items = [...items, request_item];

          //------

          item.Suppliers.forEach((supplier) => {
            const _supplier = {};

            _supplier.RowID = 0;
            _supplier.RefItemID = item.RefItemID;
            _supplier.RequestID = 0;
            _supplier.SupplierID = supplier.SupplierID;
            _supplier.SupplierTitle = supplier.Title;
            _supplier.ActivityTypeID = supplier.ActivityTypeID;
            _supplier.ActivityTypeTitle = supplier.ActivityTypeTitle;

            suppliers = [...suppliers, _supplier];
          });
        });

        inquiry_request.Items = items;
        inquiry_request.Suppliers = suppliers;

        setNewInquiryRequest(inquiry_request);
        setShowInquiryRequestModal(true);
      } else {
        message.warn(Words.no_valid_purchase_request_item_to_inquiry);
      }
    } catch (ex) {
      handleError(ex);
    }
  };

  const handleShowRelations = () => {
    // ToDo...
  };

  const getSettingsMenu = (has_reg_inquiry_request_access) => {
    let items = [];

    if (
      has_reg_inquiry_request_access &&
      Items.filter((item) => item.PurchaseTypeID === 2 /* Need cost inquiry */)
        .length > 0
    )
      items = [
        ...items,
        { label: Words.reg_inquiry_request, key: "reg_inquiry_request_item" },
      ];

    items = [
      ...items,
      { label: Words.show_relations, key: "show_relations_item" },
    ];

    const onClick = (e) => {
      switch (e.key) {
        case "reg_inquiry_request_item": {
          handleRegInquiryRequest();
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
              content={getSettingsMenu(hasRegInquiryRequestAccess)}
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

            {hasUndoApproveAccess && isReturnableRequest && (
              <Popconfirm
                title={Words.questions.sure_to_undo_approve_purchase_request}
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
      label: Words.purchase_items,
      key: "purchase-items",
      children: (
        <Row gutter={[0, 15]}>
          <Col xs={24}>
            <DetailsTable
              records={Items}
              columns={getPurchaseRequestItemsColumns()}
            />
          </Col>
        </Row>
      ),
    },
  ];

  const handleSaveInquiryRequest = async (request) => {
    const savedRow = await inquiryRequestService.saveData(request);

    setIsReturnableRequest(false);
    setNewInquiryRequest(savedRow);
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
              <Descriptions.Item label={Words.storage_center}>
                <Text style={{ color: valueColor }}>{StorageCenterTitle}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.request_date}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(utils.slashDate(RequestDate))}
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
              <Descriptions.Item label={Words.status} span={2}>
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
              <Descriptions.Item label={Words.reg_date_time} span={2}>
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

      {showInquiryRequestModal && (
        <InquiryRequestModal
          access={{ CanEdit: true, CanDelete: true }}
          onOk={handleSaveInquiryRequest}
          title={Words.reg_inquiry_request}
          onCancel={() => setShowInquiryRequestModal(false)}
          isOpen={showInquiryRequestModal}
          selectedObject={newInquiryRequest}
        />
      )}
    </>
  );
};

export default PurchaseRequestDetailsModal;
