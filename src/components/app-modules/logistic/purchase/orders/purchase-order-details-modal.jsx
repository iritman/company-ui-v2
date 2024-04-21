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
} from "antd";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import { QuestionCircleOutlined as QuestionIcon } from "@ant-design/icons";
import { handleError } from "../../../../../tools/form-manager";
import DetailsTable from "../../../../common/details-table";
import ModalWindow from "../../../../common/modal-window";
import service from "../../../../../services/logistic/purchase/purchase-orders-service";
import { getOrderItemColumns } from "./purchase-order-modal-code";

const { Text } = Typography;

const PurchaseOrderDetailsModal = ({
  selectedObject,
  isOpen,
  onOk,
  onUndoApprove,
}) => {
  const valueColor = Colors.blue[7];

  const [progress, setProgress] = useState(false);
  const [hasUndoApproveAccess, setHasUndoApproveAccess] = useState(false);

  const {
    OrderID,
    OrderDate,
    // SupplierID,
    SupplierTitle,
    // BaseTypeID,
    BaseTypeTitle,
    BaseID,
    DetailsText,
    // StatusID,
    StatusTitle,
    // RegMemberID,
    RegFirstName,
    RegLastName,
    RegDate,
    RegTime,
    Price,
    Items,
  } = selectedObject;

  useMount(async () => {
    setProgress(true);

    try {
      //------ load params

      let data = await service.getParams();

      let { HasUndoApproveAccess } = data;

      setHasUndoApproveAccess(HasUndoApproveAccess);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  });

  const getFooterButtons = () => {
    return (
      <Space>
        {selectedObject !== null && selectedObject.StatusID === 2 && (
          <>
            {hasUndoApproveAccess && (
              <Popconfirm
                title={Words.questions.sure_to_undo_approve_order_request}
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

  return (
    <>
      <ModalWindow
        isOpen={isOpen}
        title={Words.more_details}
        footer={getFooterButtons()}
        showIcon={false}
        onCancel={onOk}
        width={1250}
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
                  {utils.farsiNum(`${OrderID}`)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.purchase_order_date}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(utils.slashDate(OrderDate))}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.status}>
                <Text style={{ color: valueColor }}>{StatusTitle}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.base_type}>
                <Text style={{ color: valueColor }}>{BaseTypeTitle}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.base}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(BaseID)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.supplier}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(SupplierTitle)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.price}>
                <Text style={{ color: Colors.orange[6] }}>
                  {utils.farsiNum(`${utils.moneyNumber(Price)} ${Words.ryal}`)}
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
            <Divider orientation="right">
              <Text style={{ fontSize: 14, color: Colors.green[6] }}>
                {Words.purchase_order_items}
              </Text>
            </Divider>
          </Col>

          <Col xs={24}>
            <Row gutter={[0, 15]}>
              <Col xs={24}>
                <DetailsTable records={Items} columns={getOrderItemColumns()} />
              </Col>
            </Row>
          </Col>
        </Row>
      </ModalWindow>
    </>
  );
};

export default PurchaseOrderDetailsModal;
