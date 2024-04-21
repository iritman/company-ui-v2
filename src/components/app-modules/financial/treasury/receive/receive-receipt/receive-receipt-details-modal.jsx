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
} from "antd";
import Words from "../../../../../../resources/words";
import Colors from "../../../../../../resources/colors";
import utils from "../../../../../../tools/utils";
import { QuestionCircleOutlined as QuestionIcon } from "@ant-design/icons";
import { getTabPanes } from "./receive-receipt-details-modal-code";
import ModalWindow from "../../../../../common/modal-window";
import service from "../../../../../../services/financial/treasury/receive/receive-receipts-service";
import { handleError } from "../../../../../../tools/form-manager";
import VoucherDetailsModal from "./../../../financial-docs/vouchers/voucher-details-modal";

const { Text } = Typography;

const ReceiveReceiptDetailsModal = ({
  selectedObject,
  isOpen,
  onOk,
  onUndoApprove,
  onSubmitVoucher,
  onDeleteVoucher,
}) => {
  const valueColor = Colors.blue[7];

  const [selectedTab, setSelectedTab] = useState("cheques");
  const [progress, setProgress] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [hasUndoApproveAccess, setHasUndoApproveAccess] = useState(false);
  const [hasSubmitVoucherAccess, setHasSubmitVoucherAccess] = useState(false);
  const [hasDeleteVoucherAccess, setHasDeleteVoucherAccess] = useState(false);
  const [hasViewVoucherAccess, setHasViewVoucherAccess] = useState(false);

  const {
    ReceiveID,
    // ReceiveTypeID,
    ReceiveTypeTitle,
    // DeliveryMemberID,
    DeliveryMemberFirstName,
    DeliveryMemberLastName,
    // DeliveryMember,
    ReceiveDate,
    // RegardID,
    RegardTitle,
    // CashBoxID,
    CashBoxTitle,
    // StandardDetailsID,
    StandardDetailsText,
    DetailsText,
    // RegMemberID,
    RegMemberFirstName,
    RegMemberLastName,
    RegDate,
    RegTime,
    StatusID,
    StatusTitle,
    SubmittedVoucherID,
    Price,
    // Cheques,
    // Demands,
    // Cashes,
    // PaymentNotices,
    // ReturnFromOthers,
    // ReturnPayableCheques,
    // ReturnPayableDemands,
    RequestInfo,
  } = selectedObject;

  useMount(async () => {
    setProgress(true);

    try {
      //------ load receipt params

      let data = await service.getParams();

      let {
        HasUndoApproveAccess,
        HasSubmitVoucherAccess,
        HasDeleteVoucherAccess,
        HasViewVoucherAccess,
      } = data;

      setHasUndoApproveAccess(HasUndoApproveAccess);
      setHasSubmitVoucherAccess(HasSubmitVoucherAccess);
      setHasDeleteVoucherAccess(HasDeleteVoucherAccess);
      setHasViewVoucherAccess(HasViewVoucherAccess);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  });

  const handleShowVoucherModal = async () => {
    setProgress(true);

    try {
      const data = await service.viewVoucher(selectedObject.SubmittedVoucherID);

      setSelectedVoucher(data);
      setShowVoucherModal(true);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const getFooterButtons = () => {
    return (
      <Space>
        {selectedObject !== null && selectedObject.StatusID === 2 && (
          <>
            {hasUndoApproveAccess && SubmittedVoucherID === 0 && (
              <Popconfirm
                title={Words.questions.sure_to_undo_approve_receive_receipt}
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

            {hasSubmitVoucherAccess && SubmittedVoucherID === 0 && (
              <Popconfirm
                title={Words.questions.sure_to_submit_voucher}
                onConfirm={onSubmitVoucher}
                okText={Words.yes}
                cancelText={Words.no}
                icon={<QuestionIcon style={{ color: "red" }} />}
                key="submit-voucher-confirm"
                disabled={progress}
              >
                <Button key="submit-voucher-button" type="primary" danger>
                  {Words.submit_voucher}
                </Button>
              </Popconfirm>
            )}

            {hasDeleteVoucherAccess && SubmittedVoucherID > 0 && (
              <Popconfirm
                title={Words.questions.sure_to_delete_voucher}
                onConfirm={onDeleteVoucher}
                okText={Words.yes}
                cancelText={Words.no}
                icon={<QuestionIcon style={{ color: "red" }} />}
                key="delete-voucher-confirm"
                disabled={progress}
              >
                <Button key="delete-voucher-button" type="primary" danger>
                  {Words.delete_voucher}
                </Button>
              </Popconfirm>
            )}

            {hasViewVoucherAccess && SubmittedVoucherID > 0 && (
              <Button
                key="view-voucher-button"
                type="default"
                onClick={handleShowVoucherModal}
              >
                {Words.view_voucher}
              </Button>
            )}
          </>
        )}

        <Button key="close-button" onClick={onOk}>
          {Words.close}
        </Button>
      </Space>
    );
  };

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
                  {utils.farsiNum(`${ReceiveID}`)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.receive_base}>
                <Text style={{ color: valueColor }}>
                  {RequestInfo.RequestID
                    ? utils.farsiNum(
                        `#${RequestInfo.RequestID} - ${
                          RequestInfo.FrontSideAccountTitle
                        } - ${utils.moneyNumber(RequestInfo.TotalPrice)} ${
                          Words.ryal
                        }`
                      )
                    : "-"}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.receive_type}>
                <Text style={{ color: valueColor }}>{ReceiveTypeTitle}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.receive_date}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(utils.slashDate(ReceiveDate))}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.delivery_member}>
                <Text style={{ color: valueColor }}>
                  {`${DeliveryMemberFirstName} ${DeliveryMemberLastName}`}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.regards} span={2}>
                <Text style={{ color: valueColor }}>{RegardTitle}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.cash_box}>
                <Text style={{ color: valueColor }}>{CashBoxTitle}</Text>
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
                >{`${RegMemberFirstName} ${RegMemberLastName}`}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.reg_date_time}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(
                    `${utils.slashDate(RegDate)} - ${utils.colonTime(RegTime)}`
                  )}
                </Text>
              </Descriptions.Item>

              {StandardDetailsText.length > 0 && (
                <Descriptions.Item label={Words.standard_details_text} span={2}>
                  <Text
                    style={{
                      color: Colors.purple[7],
                      whiteSpace: "pre-line",
                    }}
                  >
                    {utils.farsiNum(StandardDetailsText)}
                  </Text>
                </Descriptions.Item>
              )}

              {DetailsText.length > 0 && (
                <Descriptions.Item label={Words.standard_description} span={2}>
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

              {Price > 0 && (
                <Descriptions.Item label={Words.price} span={2}>
                  <Text
                    style={{
                      color: Colors.magenta[7],
                    }}
                  >
                    {`${utils.farsiNum(utils.moneyNumber(Price))} ${
                      Words.ryal
                    }`}
                  </Text>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Col>
          <Col xs={24}>
            <Tabs
              type="card"
              defaultActiveKey="1"
              onChange={(key) => setSelectedTab(key)}
              items={getTabPanes(selectedObject, selectedTab)}
            />
          </Col>
        </Row>
      </ModalWindow>

      {selectedVoucher !== null && showVoucherModal && (
        <VoucherDetailsModal
          isOpen={showVoucherModal}
          selectedObject={selectedVoucher}
          onOk={() => {
            setShowVoucherModal(false);
            setSelectedVoucher(null);
          }}
        />
      )}
    </>
  );
};

export default ReceiveReceiptDetailsModal;
