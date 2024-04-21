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
  DeliveryID: Joi.number().required().label(Words.id),
  DeliveryDate: Joi.string().required().label(Words.purchase_delivery_date),
  TransfereeTypeID: Joi.number().required().min(1).label(Words.transferee_type),
  TransfereeTafsilAccountID: Joi.number().required().label(Words.transferee),
  DeliveryTafsilAccountID: Joi.number().required().label(Words.delivery_person),
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
  DeliveryID: 0,
  DeliveryDate: "",
  TransfereeTypeID: 0,
  TransfereeTafsilAccountID: 0,
  DeliveryTafsilAccountID: 0,
  DetailsText: "",
  StatusID: 1,
  Items: [],
};

export const getDeliveryItemColumns = (access, statusID, onEdit, onDelete) => {
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
      title: Words.front_side,
      width: 250,
      align: "center",
      dataIndex: "FrontSideAccountTitle",
      sorter: getSorter("FrontSideAccountTitle"),
      render: (FrontSideAccountTitle) => (
        <Text style={{ color: Colors.grey[6] }}>{FrontSideAccountTitle}</Text>
      ),
    },
    {
      title: Words.base_id,
      width: 150,
      align: "center",
      dataIndex: "OrderItemID",
      sorter: getSorter("OrderItemID"),
      render: (OrderItemID) => (
        <Text style={{ color: Colors.grey[6] }}>
          {OrderItemID === 0 ? "-" : utils.farsiNum(OrderItemID)}
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
      title: Words.item_count,
      width: 150,
      align: "center",
      dataIndex: "ItemCount",
      sorter: getSorter("ItemCount"),
      render: (ItemCount) => (
        <Text style={{ color: Colors.red[6] }}>
          {utils.farsiNum(ItemCount)}
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
      title: Words.acceptable_decrease_amount,
      width: 120,
      align: "center",
      dataIndex: "AcceptableDecreaseAmount",
      sorter: getSorter("AcceptableDecreaseAmount"),
      render: (AcceptableDecreaseAmount) => (
        <Text style={{ color: Colors.cyan[6] }}>
          {utils.farsiNum(AcceptableDecreaseAmount)}
        </Text>
      ),
    },
    {
      title: Words.extra_amount,
      width: 120,
      align: "center",
      dataIndex: "ExtraAmount",
      sorter: getSorter("ExtraAmount"),
      render: (ExtraAmount) => (
        <Text style={{ color: Colors.orange[7] }}>
          {utils.farsiNum(ExtraAmount)}
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
        <Text
          style={{ color: Colors.grey[6] }}
        >{`${record.AgentFirstName} ${record.AgentLastName}`}</Text>
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

      {selectedObject !== null && selectedObject.StatusID === 1 && (
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
  getDeliveryItemColumns,
  getNewButton,
  getFooterButtons,
};

export default codes;
