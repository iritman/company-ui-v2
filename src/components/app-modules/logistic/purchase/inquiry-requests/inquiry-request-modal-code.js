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
  RequestID: Joi.number().required().label(Words.id),
  // RequestTypeID: Joi.number().required().min(1).label(Words.request_type),
  // BaseID: Joi.number().required().min(1).label(Words.request),
  InquiryDeadline: Joi.string().required().label(Words.inquiry_final_deadline),
  InquiryDate: Joi.string().required().label(Words.request_date),
  DetailsText: Joi.string()
    .min(5)
    .max(250)
    .allow("")
    .regex(utils.VALID_REGEX)
    .label(Words.standard_description),
  StatusID: Joi.number(),
  Items: Joi.array(),
  Suppliers: Joi.array(),
};

export const initRecord = {
  RequestID: 0,
  // RequestTypeID: 0,
  // BaseID: 0,
  InquiryDeadline: "",
  InquiryDate: "",
  DetailsText: "",
  StatusID: 1,
  Items: [],
  Suppliers: [],
};

export const getInquiryItemColumns = (access, statusID, onEdit, onDelete) => {
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
      title: Words.item_code,
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
      title: Words.item_title,
      width: 175,
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
        <Text style={{ color: Colors.grey[6] }}>
          {utils.farsiNum(MeasureUnitTitle)}
        </Text>
      ),
    },
    {
      title: Words.consumer,
      width: 200,
      align: "center",
      dataIndex: "FrontSideAccountTitle",
      sorter: getSorter("FrontSideAccountTitle"),
      render: (FrontSideAccountTitle) => (
        <Text style={{ color: Colors.cyan[6] }}>{FrontSideAccountTitle}</Text>
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
          {NeedDate?.length > 0
            ? utils.farsiNum(utils.slashDate(NeedDate))
            : "-"}
        </Text>
      ),
    },
    {
      title: Words.request_date,
      width: 120,
      align: "center",
      dataIndex: "RequestDate",
      sorter: getSorter("RequestDate"),
      render: (RequestDate) => (
        <Text style={{ color: Colors.red[7] }}>
          {RequestDate?.length > 0
            ? utils.farsiNum(utils.slashDate(RequestDate))
            : "-"}
        </Text>
      ),
    },
    {
      title: Words.inquiry_deadline,
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
            : "-"}
        </Text>
      ),
    },
    // {
    //   title: Words.supplier,
    //   width: 200,
    //   align: "center",
    //   dataIndex: "SupplierTitle",
    //   sorter: getSorter("SupplierTitle"),
    //   render: (SupplierTitle) => (
    //     <Text style={{ color: Colors.purple[6] }}>
    //       {utils.farsiNum(SupplierTitle)}
    //     </Text>
    //   ),
    // },
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
      width: 120,
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

export const getInquirySupplierColumns = (access, statusID, onDelete) => {
  let columns = [
    {
      title: Words.id,
      width: 75,
      align: "center",
      dataIndex: "RowID",
      sorter: getSorter("RowID"),
      render: (RowID) => (
        <Text>{RowID > 0 ? utils.farsiNum(`${RowID}`) : ""}</Text>
      ),
    },
    {
      title: Words.suplier_id,
      width: 100,
      align: "center",
      dataIndex: "SupplierID",
      sorter: getSorter("SupplierID"),
      render: (SupplierID) => (
        <Text>{SupplierID > 0 ? utils.farsiNum(`${SupplierID}`) : ""}</Text>
      ),
    },
    {
      title: Words.supplier,
      width: 175,
      align: "center",
      dataIndex: "SupplierTitle",
      sorter: getSorter("SupplierTitle"),
      render: (SupplierTitle) => (
        <Text style={{ color: Colors.cyan[6] }}>
          {utils.farsiNum(SupplierTitle)}
        </Text>
      ),
    },
    {
      title: Words.activity_type,
      width: 150,
      align: "center",
      dataIndex: "ActivityTypeTitle",
      sorter: getSorter("ActivityTypeTitle"),
      render: (ActivityTypeTitle) => (
        <Text style={{ color: Colors.orange[6] }}>
          {utils.farsiNum(ActivityTypeTitle)}
        </Text>
      ),
    },
  ];

  if (access) {
    // StatusID : 1 => Not Approve, Not Reject! Just Save...
    if (statusID === 1 && access.CanDelete && onDelete) {
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
  getInquiryItemColumns,
  getInquirySupplierColumns,
  getNewButton,
  getFooterButtons,
};

export default codes;
