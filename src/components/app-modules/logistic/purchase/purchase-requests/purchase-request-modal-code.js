import React from "react";
import Joi from "joi-browser";
import { Button, Space, Popconfirm, Popover, Typography, Tag } from "antd";
import {
  PlusOutlined as AddIcon,
  DeleteOutlined as DeleteIcon,
  EditOutlined as EditIcon,
  QuestionCircleOutlined as QuestionIcon,
} from "@ant-design/icons";
import {
  MdInfoOutline as InfoIcon,
  MdGroups as GroupIcon,
} from "react-icons/md";
import { getSorter } from "../../../../../tools/form-manager";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";

const { Text } = Typography;

export const schema = {
  RequestID: Joi.number().required().label(Words.id),
  StorageCenterID: Joi.number().min(1).required().label(Words.storage_center),
  FrontSideTypeID: Joi.number().min(1).required().label(Words.front_side_type),
  FrontSideAccountID: Joi.number()
    .min(1)
    .required()
    .label(Words.front_side_account),
  RequestMemberID: Joi.number().required().label(Words.request_member),
  RequestTypeID: Joi.number().required().label(Words.request_type),
  RequestDate: Joi.string().required().label(Words.request_date),
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
  RequestID: 0,
  StorageCenterID: 0,
  FrontSideTypeID: 0,
  FrontSideAccountID: 0,
  RequestMemberID: 0,
  RequestTypeID: 0,
  RequestDate: "",
  DetailsText: "",
  StatusID: 1,
  Items: [],
};

export const getPurchaseRequestItemsColumns = (
  access,
  statusID,
  onEdit,
  onDelete
) => {
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
      width: 170,
      align: "center",
      dataIndex: "BaseTypeTitle",
      sorter: getSorter("BaseTypeTitle"),
      render: (BaseTypeTitle) => (
        <Text style={{ color: Colors.magenta[6] }}> {BaseTypeTitle}</Text>
      ),
    },
    {
      title: Words.product_code,
      width: 150,
      align: "center",
      dataIndex: "NeededItemCode",
      sorter: getSorter("NeededItemCode"),
      render: (NeededItemCode) => (
        <Text style={{ color: Colors.orange[6] }}>
          {utils.farsiNum(NeededItemCode)}
        </Text>
      ),
    },
    {
      title: Words.product,
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
      title: Words.measure_unit,
      width: 120,
      align: "center",
      dataIndex: "MeasureUnitTitle",
      sorter: getSorter("MeasureUnitTitle"),
      render: (MeasureUnitTitle) => (
        <Text style={{ color: Colors.grey[6] }}>
          {utils.farsiNum(MeasureUnitTitle)}
        </Text>
      ),
    },
    {
      title: Words.need_date,
      width: 120,
      align: "center",
      dataIndex: "NeedDate",
      sorter: getSorter("NeedDate"),
      render: (NeedDate) => (
        <Text style={{ color: Colors.orange[6] }}>
          {utils.farsiNum(utils.slashDate(NeedDate))}
        </Text>
      ),
    },
    {
      title: Words.purchase_type,
      width: 120,
      align: "center",
      dataIndex: "PurchaseTypeTitle",
      sorter: getSorter("PurchaseTypeTitle"),
      render: (PurchaseTypeTitle) => (
        <Text style={{ color: Colors.green[6] }}>{PurchaseTypeTitle}</Text>
      ),
    },
    {
      title: Words.inquiry_final_deadline,
      width: 120,
      align: "center",
      dataIndex: "InquiryDeadline",
      sorter: getSorter("InquiryDeadline"),
      render: (InquiryDeadline) => (
        <Text
          style={{
            color: Colors.green[6],
          }}
        >
          {InquiryDeadline?.length > 0
            ? utils.farsiNum(utils.slashDate(InquiryDeadline))
            : ""}
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
            : ""}
        </Text>
      ),
    },
    {
      title: Words.suppliers,
      width: 150,
      align: "center",
      //   dataIndex: "---",
      // sorter: getSorter("AgentLastName"),
      render: (record) => (
        <>
          {record?.Suppliers?.length > 0 && (
            <Popover
              content={
                <>
                  {record?.Suppliers?.map((sp) => (
                    <Tag color="magenta" key={sp.SupplierID}>
                      {utils.farsiNum(sp.Title)}
                    </Tag>
                  ))}
                </>
              }
            >
              <GroupIcon
                style={{
                  color: Colors.orange[6],
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
      title: Words.descriptions,
      width: 100,
      align: "center",
      render: (record) => (
        <>
          {record.DetailsText.length > 0 && (
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

export const getNewPurchaseRequestItemButton = (disabled, onClick) => {
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
      {(selectedObject === null || selectedObject.RequestID === 0) && (
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
        selectedObject.RequestID > 0 &&
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
                title={Words.questions.sure_to_cancel_request}
                onConfirm={onReject}
                okText={Words.yes}
                cancelText={Words.no}
                icon={<QuestionIcon style={{ color: "red" }} />}
                key="reject-confirm"
                disabled={progress}
              >
                <Button key="reject-button" type="primary" danger>
                  {Words.cancel_request}
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
  getPurchaseRequestItemsColumns,
  getNewPurchaseRequestItemButton,
  getFooterButtons,
};

export default codes;
