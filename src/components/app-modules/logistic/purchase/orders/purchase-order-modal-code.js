import React from "react";
import Joi from "joi-browser";
import { Button, Space, Popconfirm, Popover, Typography } from "antd";
import {
  PlusOutlined as AddIcon,
  DeleteOutlined as DeleteIcon,
  EditOutlined as EditIcon,
  QuestionCircleOutlined as QuestionIcon,
} from "@ant-design/icons";
import { MdInfoOutline as InfoIcon } from "react-icons/md";
import { getSorter } from "../../../../../tools/form-manager";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";

const { Text } = Typography;

export const schema = {
  OrderID: Joi.number().required().label(Words.id),
  OrderDate: Joi.string().required().label(Words.purchase_order_date),
  BaseTypeID: Joi.number().required().min(1).label(Words.base_type),
  BaseID: Joi.number().required().label(Words.base_id),
  SupplierID: Joi.number().required().label(Words.supplier),
  DetailsText: Joi.string()
    .min(5)
    .max(250)
    .allow("")
    .regex(utils.VALID_REGEX)
    .label(Words.standard_description),
  StatusID: Joi.number(),
  Items: Joi.array(),
};

export const initRecord = {
  OrderID: 0,
  OrderDate: "",
  BaseTypeID: 1,
  BaseID: 0,
  SupplierID: 0,
  DetailsText: "",
  StatusID: 1,
  Items: [],
};

export const getOrderItemColumns = (access, statusID, onEdit, onDelete) => {
  let columns = [
    {
      title: Words.id,
      width: 75,
      align: "center",
      dataIndex: "ItemID",
      sorter: getSorter("ItemID"),
      render: (ItemID) => (
        <Text>{ItemID > 0 ? utils.farsiNum(`${ItemID}`) : ""}</Text>
      ),
    },
    {
      title: Words.base_type,
      width: 150,
      align: "center",
      dataIndex: "BaseTypeTitle",
      sorter: getSorter("BaseTypeTitle"),
      render: (BaseTypeTitle) => (
        <Text style={{ color: Colors.grey[6] }}>{BaseTypeTitle}</Text>
      ),
    },
    {
      title: Words.base_id,
      width: 150,
      align: "center",
      dataIndex: "RefItemID",
      sorter: getSorter("RefItemID"),
      render: (RefItemID) => (
        <Text style={{ color: Colors.grey[6] }}>
          {utils.farsiNum(RefItemID)}
        </Text>
      ),
    },
    {
      title: Words.item_code,
      width: 150,
      align: "center",
      dataIndex: "ItemCode",
      sorter: getSorter("ItemCode"),
      render: (ItemCode) => (
        <Text style={{ color: Colors.orange[6] }}>
          {utils.farsiNum(ItemCode)}
        </Text>
      ),
    },
    {
      title: Words.item_title,
      width: 150,
      align: "center",
      dataIndex: "NeededItemTitle",
      sorter: getSorter("NeededItemTitle"),
      render: (NeededItemTitle) => (
        <Text style={{ color: Colors.cyan[6] }}>
          {utils.farsiNum(NeededItemTitle)}
        </Text>
      ),
    },
    {
      title: Words.request_count,
      width: 150,
      align: "center",
      dataIndex: "RequestCount",
      sorter: getSorter("RequestCount"),
      render: (RequestCount) => (
        <Text style={{ color: Colors.red[6] }}>
          {utils.farsiNum(RequestCount)}
        </Text>
      ),
    },
    {
      title: Words.unit,
      width: 150,
      align: "center",
      dataIndex: "MeasureUnitTitle",
      sorter: getSorter("MeasureUnitTitle"),
      render: (MeasureUnitTitle) => (
        <Text style={{ color: Colors.grey[6] }}>{MeasureUnitTitle}</Text>
      ),
    },
    {
      title: Words.fee,
      width: 200,
      align: "center",
      dataIndex: "Fee",
      sorter: getSorter("Fee"),
      render: (Fee) => (
        <Text style={{ color: Colors.cyan[6] }}>
          {utils.farsiNum(utils.moneyNumber(Fee))}
        </Text>
      ),
    },
    {
      title: Words.price,
      width: 200,
      align: "center",
      // dataIndex: "Price",
      // sorter: getSorter("Price"),
      render: (record) => (
        <Text style={{ color: Colors.cyan[7] }}>
          {utils.farsiNum(utils.moneyNumber(record.Fee * record.RequestCount))}
        </Text>
      ),
    },
    {
      title: Words.returnable,
      width: 120,
      align: "center",
      dataIndex: "Returnable",
      sorter: getSorter("Returnable"),
      render: (Returnable) => (
        <Text style={{ color: Colors.orange[6] }}>
          {Returnable ? Words.yes : Words.no}
        </Text>
      ),
    },
    {
      title: Words.tolerance_percent,
      width: 150,
      align: "center",
      dataIndex: "TolerancePercent",
      sorter: getSorter("TolerancePercent"),
      render: (TolerancePercent) => (
        <Text
          style={{
            color: Colors.green[6],
          }}
        >
          {utils.farsiNum(TolerancePercent)}
        </Text>
      ),
    },
    {
      title: Words.purchasing_agent,
      width: 150,
      align: "center",
      //   dataIndex: "---",
      sorter: getSorter("AgentLastName"),
      render: (record) => (
        <Text style={{ color: Colors.grey[6] }}>
          {record.PurchaseAgentID > 0
            ? `${record.AgentFirstName} ${record.AgentLastName}`
            : "-"}
        </Text>
      ),
    },
    {
      title: Words.descriptions,
      width: 100,
      align: "center",
      render: (record) => (
        <>
          {record?.DetailsText?.length > 0 && (
            <Popover content={<Text>{record.DetailsText}</Text>}>
              <InfoIcon
                style={{
                  color: Colors.green[6],
                  fontSize: 19,
                  cursor: "pointer",
                }}
              />
            </Popover>
          )}
        </>
      ),
    },
    {
      title: Words.status,
      width: 150,
      align: "center",
      dataIndex: "StatusTitle",
      sorter: getSorter("StatusTitle"),
      render: (StatusTitle) => (
        <Text style={{ color: Colors.grey[6] }}>{StatusTitle}</Text>
      ),
    },
  ];

  if (access) {
    // StatusID : 1 => Not Approve, Not Reject! Just Save...
    if (
      statusID === 1 &&
      ((access.CanDelete && onDelete) || (access.CanEdit && onEdit))
    ) {
      columns = [
        ...columns,
        {
          title: "",
          fixed: "right",
          align: "center",
          width: 75,
          render: (record) => (
            <Space>
              {access.CanDelete && onDelete && (
                <Popconfirm
                  title={Words.questions.sure_to_delete_selected_item}
                  onConfirm={async () => await onDelete(record)}
                  okText={Words.yes}
                  cancelText={Words.no}
                  icon={<QuestionIcon style={{ color: "red" }} />}
                >
                  <Button type="link" icon={<DeleteIcon />} danger />
                </Popconfirm>
              )}

              {access.CanEdit && onEdit && (
                <Button
                  type="link"
                  icon={<EditIcon />}
                  onClick={() => onEdit(record)}
                />
              )}
            </Space>
          ),
        },
      ];
    }
  } else {
    columns = [
      ...columns,
      {
        title: "",
        fixed: "right",
        align: "center",
        width: 1,
        render: () => <></>,
      },
    ];
  }

  return columns;
};

export const getNewButton = (disabled, onClick) => {
  return (
    <Button
      type="primary"
      onClick={onClick}
      icon={<AddIcon />}
      disabled={disabled}
    >
      {Words.new}
    </Button>
  );
};

export const getFooterButtons = (config) => {
  const {
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
  } = config;

  return (
    <Space>
      {(selectedObject === null || selectedObject.OrderID === 0) && (
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
              title={Words.questions.sure_to_submit_approve_request}
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

      {selectedObject !== null &&
        selectedObject.OrderID > 0 &&
        selectedObject.StatusID === 1 && (
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
                title={Words.questions.sure_to_submit_approve_request}
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

const codes = {
  schema,
  initRecord,
  getOrderItemColumns,
  getNewButton,
  getFooterButtons,
};

export default codes;
