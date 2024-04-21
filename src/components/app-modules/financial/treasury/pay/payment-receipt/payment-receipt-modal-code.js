import Words from "../../../../../../resources/words";
import Colors from "../../../../../../resources/colors";
import utils from "../../../../../../tools/utils";
import {
  Button,
  Space,
  Typography,
  Popconfirm,
  Row,
  Col,
  Popover,
  Alert,
} from "antd";
import { getSorter, validateForm } from "../../../../../../tools/form-manager";
import {
  PlusOutlined as AddIcon,
  DeleteOutlined as DeleteIcon,
  EditOutlined as EditIcon,
  QuestionCircleOutlined as QuestionIcon,
} from "@ant-design/icons";
import { MdInfoOutline as InfoIcon } from "react-icons/md";
import Joi from "joi-browser";
import PriceViewer from "./../../../../../common/price-viewer";
import DetailsTable from "../../../../../common/details-table";
import BadgedTabTitle from "../../../../../common/badged-tab-title";

const { Text } = Typography;

export const schema = {
  ReceiptID: Joi.number().required().label(Words.id),
  BaseTypeID: Joi.number().required().min(1).label(Words.payment_base),
  BaseDocID: Joi.number().required().label(Words.base_doc_id),
  PayTypeID: Joi.number().min(1).required().label(Words.pay_type),
  PayDate: Joi.string().required().label(Words.payment_date),
  RegardID: Joi.number().required().label(Words.regards),
  CashBoxID: Joi.number().label(Words.cash_box),
  SubNo: Joi.number().allow("").label(Words.sub_no),
  StandardDetailsID: Joi.number().label(Words.standard_description),
  DetailsText: Joi.string()
    .min(5)
    .max(250)
    .allow("")
    .regex(utils.VALID_REGEX)
    .label(Words.standard_description),
  StatusID: Joi.number(),
  Cheques: Joi.array(),
  Demands: Joi.array(),
  Cashes: Joi.array(),
  WithdrawNotices: Joi.array(),
  TransferToOthers: Joi.array(),
  RefundReceivedCheques: Joi.array(),
  RefundReceivedDemands: Joi.array(),
};

export const initRecord = {
  ReceiptID: 0,
  BaseTypeID: 1,
  BaseDocID: 0,
  PayTypeID: 0,
  PayDate: "",
  RegardID: 0,
  CashBoxID: 0,
  SubNo: "",
  StandardDetailsID: 0,
  DetailsText: "",
  StatusID: 1,
  Cheques: [],
  Demands: [],
  Cashes: [],
  WithdrawNotices: [],
  TransferToOthers: [],
  RefundReceivedCheques: [],
  RefundReceivedDemands: [],
};

const getChequeColumns = (access, statusID, onEdit, onDelete) => {
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
      title: Words.front_side,
      width: 200,
      align: "center",
      dataIndex: "FrontSideAccountTitle",
      sorter: getSorter("FrontSideAccountTitle"),
      render: (FrontSideAccountTitle) => (
        <Text style={{ color: Colors.cyan[6] }}>
          {utils.farsiNum(FrontSideAccountTitle)}
        </Text>
      ),
    },
    // {
    //   title: Words.payment_base,
    //   width: 150,
    //   align: "center",
    //   //   dataIndex: "ChequeID",
    //   //   sorter: getSorter("ChequeID"),
    //   render: (record) => (
    //     <Text style={{ color: Colors.red[5] }}>
    //       {record.RequestID > 0
    //         ? utils.farsiNum(`${Words.request_with_id}: ${record.RequestID}`)
    //         : Words.withou_base}
    //     </Text>
    //   ),
    // },
    {
      title: Words.financial_operation,
      width: 200,
      align: "center",
      //   dataIndex: "Price",
      sorter: getSorter("OperationTitle"),
      render: (record) => (
        <Text style={{ color: Colors.blue[6] }}>
          {utils.farsiNum(`${record.OperationID} - ${record.OperationTitle}`)}
        </Text>
      ),
    },
    {
      title: Words.nature,
      width: 100,
      align: "center",
      dataIndex: "PaperNatureTitle",
      sorter: getSorter("PaperNatureTitle"),
      render: (PaperNatureTitle) => (
        <Text style={{ color: Colors.grey[6] }}>{PaperNatureTitle}</Text>
      ),
    },
    {
      title: Words.duration,
      width: 100,
      align: "center",
      dataIndex: "DurationTypeTitle",
      sorter: getSorter("DurationTypeTitle"),
      render: (DurationTypeTitle) => (
        <Text style={{ color: Colors.grey[6] }}>{DurationTypeTitle}</Text>
      ),
    },
    {
      title: Words.cash_flow,
      width: 200,
      align: "center",
      dataIndex: "CashFlowTitle",
      sorter: getSorter("CashFlowTitle"),
      render: (CashFlowTitle) => (
        <Text style={{ color: Colors.purple[6] }}>{CashFlowTitle}</Text>
      ),
    },
    // {
    //   title: Words.account_no,
    //   width: 100,
    //   align: "center",
    //   dataIndex: "AccountNo",
    //   sorter: getSorter("AccountNo"),
    //   render: (AccountNo) => (
    //     <Text style={{ color: Colors.orange[6] }}>
    //       {utils.farsiNum(AccountNo)}
    //     </Text>
    //   ),
    // },
    // {
    //   title: Words.bank,
    //   width: 100,
    //   align: "center",
    //   dataIndex: "BankTitle",
    //   sorter: getSorter("BankTitle"),
    //   render: (BankTitle) => (
    //     <Text style={{ color: Colors.green[6] }}>{BankTitle}</Text>
    //   ),
    // },
    // {
    //   title: Words.city,
    //   width: 150,
    //   align: "center",
    //   dataIndex: "CityTitle",
    //   sorter: getSorter("CityTitle"),
    //   render: (CityTitle) => (
    //     <Text style={{ color: Colors.blue[6] }}>{CityTitle}</Text>
    //   ),
    // },
    // {
    //   title: Words.bank_branch,
    //   width: 100,
    //   align: "center",
    //   dataIndex: "BranchName",
    //   sorter: getSorter("BranchName"),
    //   render: (BranchName) => (
    //     <Text style={{ color: Colors.grey[6] }}>
    //       {utils.farsiNum(BranchName)}
    //     </Text>
    //   ),
    // },
    // {
    //   title: Words.branch_code,
    //   width: 100,
    //   align: "center",
    //   dataIndex: "BranchCode",
    //   sorter: getSorter("BranchCode"),
    //   render: (BranchCode) => (
    //     <Text style={{ color: Colors.grey[6] }}>
    //       {utils.farsiNum(BranchCode)}
    //     </Text>
    //   ),
    // },
    // {
    //   title: Words.cheque_no,
    //   width: 150,
    //   align: "center",
    //   dataIndex: "ChequeNo",
    //   sorter: getSorter("ChequeNo"),
    //   render: (ChequeNo) => (
    //     <Text style={{ color: Colors.red[6] }}>{utils.farsiNum(ChequeNo)}</Text>
    //   ),
    // },
    // {
    //   title: Words.cheque_series,
    //   width: 150,
    //   align: "center",
    //   dataIndex: "ChequeSeries",
    //   sorter: getSorter("ChequeSeries"),
    //   render: (ChequeSeries) => (
    //     <Text style={{ color: Colors.grey[6] }}>
    //       {utils.farsiNum(ChequeSeries)}
    //     </Text>
    //   ),
    // },
    // {
    //   title: Words.sheba_no,
    //   width: 200,
    //   align: "center",
    //   dataIndex: "ShebaID",
    //   sorter: getSorter("ShebaID"),
    //   render: (ShebaID) => (
    //     <Text style={{ color: Colors.grey[6] }}>{ShebaID}</Text>
    //   ),
    // },
    // {
    //   title: Words.sayad_no,
    //   width: 200,
    //   align: "center",
    //   dataIndex: "SayadNo",
    //   sorter: getSorter("SayadNo"),
    //   render: (SayadNo) => (
    //     <Text style={{ color: Colors.grey[6] }}>{SayadNo}</Text>
    //   ),
    // },
    {
      title: Words.currency,
      width: 150,
      align: "center",
      dataIndex: "CurrencyTitle",
      sorter: getSorter("CurrencyTitle"),
      render: (CurrencyTitle) => (
        <Text style={{ color: Colors.grey[6] }}>{CurrencyTitle}</Text>
      ),
    },
    {
      title: Words.price,
      width: 200,
      align: "center",
      dataIndex: "Amount",
      sorter: getSorter("Amount"),
      render: (Amount) => (
        <Text style={{ color: Colors.green[6] }}>
          {utils.farsiNum(utils.moneyNumber(Amount))}
        </Text>
      ),
    },
    {
      title: Words.due_date,
      width: 120,
      align: "center",
      dataIndex: "DueDate",
      sorter: getSorter("DueDate"),
      render: (DueDate) => (
        <Text
          style={{
            color: Colors.geekblue[6],
          }}
        >
          {utils.farsiNum(utils.slashDate(DueDate))}
        </Text>
      ),
    },
    {
      title: Words.agreed_date,
      width: 120,
      align: "center",
      dataIndex: "AgreedDate",
      sorter: getSorter("AgreedDate"),
      render: (AgreedDate) => (
        <Text
          style={{
            color: Colors.blue[6],
          }}
        >
          {AgreedDate.length > 0
            ? utils.farsiNum(utils.slashDate(AgreedDate))
            : "-"}
        </Text>
      ),
    },
    {
      title: Words.standard_description,
      width: 100,
      align: "center",
      render: (record) => (
        <>
          {(record.StandardDetailsID > 0 || record.DetailsText.length > 0) && (
            <Popover
              content={
                <Text>{`${utils.getDescription(
                  record.StandardDetailsText,
                  record.DetailsText
                )}`}</Text>
              }
            >
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
  ];

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

const getDemandColumns = (access, statusID, onEdit, onDelete) => {
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
      title: Words.front_side,
      width: 200,
      align: "center",
      dataIndex: "FrontSideAccountTitle",
      sorter: getSorter("FrontSideAccountTitle"),
      render: (FrontSideAccountTitle) => (
        <Text style={{ color: Colors.cyan[6] }}>
          {utils.farsiNum(FrontSideAccountTitle)}
        </Text>
      ),
    },
    {
      title: Words.financial_operation,
      width: 200,
      align: "center",
      //   dataIndex: "Price",
      sorter: getSorter("OperationTitle"),
      render: (record) => (
        <Text style={{ color: Colors.blue[6] }}>
          {utils.farsiNum(`${record.OperationID} - ${record.OperationTitle}`)}
        </Text>
      ),
    },
    {
      title: Words.nature,
      width: 100,
      align: "center",
      dataIndex: "PaperNatureTitle",
      sorter: getSorter("PaperNatureTitle"),
      render: (PaperNatureTitle) => (
        <Text style={{ color: Colors.grey[6] }}>{PaperNatureTitle}</Text>
      ),
    },
    {
      title: Words.duration,
      width: 100,
      align: "center",
      dataIndex: "DurationTypeTitle",
      sorter: getSorter("DurationTypeTitle"),
      render: (DurationTypeTitle) => (
        <Text style={{ color: Colors.grey[6] }}>{DurationTypeTitle}</Text>
      ),
    },
    {
      title: Words.cash_flow,
      width: 200,
      align: "center",
      dataIndex: "CashFlowTitle",
      sorter: getSorter("CashFlowTitle"),
      render: (CashFlowTitle) => (
        <Text style={{ color: Colors.purple[6] }}>{CashFlowTitle}</Text>
      ),
    },
    {
      title: Words.currency,
      width: 150,
      align: "center",
      dataIndex: "CurrencyTitle",
      sorter: getSorter("CurrencyTitle"),
      render: (CurrencyTitle) => (
        <Text style={{ color: Colors.grey[6] }}>{CurrencyTitle}</Text>
      ),
    },
    {
      title: Words.price,
      width: 200,
      align: "center",
      dataIndex: "Amount",
      sorter: getSorter("Amount"),
      render: (Amount) => (
        <Text style={{ color: Colors.green[6] }}>
          {utils.farsiNum(utils.moneyNumber(Amount))}
        </Text>
      ),
    },
    {
      title: Words.demand_no,
      width: 200,
      align: "center",
      dataIndex: "DemandNo",
      sorter: getSorter("DemandNo"),
      render: (DemandNo) => (
        <Text style={{ color: Colors.orange[6] }}>
          {utils.farsiNum(DemandNo)}
        </Text>
      ),
    },
    {
      title: Words.due_date,
      width: 120,
      align: "center",
      dataIndex: "DueDate",
      sorter: getSorter("DueDate"),
      render: (DueDate) => (
        <Text
          style={{
            color: Colors.geekblue[6],
          }}
        >
          {utils.farsiNum(utils.slashDate(DueDate))}
        </Text>
      ),
    },
    {
      title: Words.standard_description,
      width: 100,
      align: "center",
      render: (record) => (
        <>
          {(record.StandardDetailsID > 0 || record.DetailsText.length > 0) && (
            <Popover
              content={
                <Text>{`${utils.getDescription(
                  record.StandardDetailsText,
                  record.DetailsText
                )}`}</Text>
              }
            >
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
  ];

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

const getCashColumns = (access, statusID, onEdit, onDelete) => {
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
      title: Words.front_side,
      width: 200,
      align: "center",
      dataIndex: "FrontSideAccountTitle",
      sorter: getSorter("FrontSideAccountTitle"),
      render: (FrontSideAccountTitle) => (
        <Text style={{ color: Colors.cyan[6] }}>
          {utils.farsiNum(FrontSideAccountTitle)}
        </Text>
      ),
    },
    {
      title: Words.payment_base,
      width: 150,
      align: "center",
      //   dataIndex: "ChequeID",
      //   sorter: getSorter("ChequeID"),
      render: (record) => (
        <Text style={{ color: Colors.red[5] }}>
          {record.RequestID > 0
            ? utils.farsiNum(`${Words.request_with_id}: ${record.RequestID}`)
            : Words.withou_base}
        </Text>
      ),
    },
    {
      title: Words.financial_operation,
      width: 200,
      align: "center",
      //   dataIndex: "Price",
      sorter: getSorter("OperationTitle"),
      render: (record) => (
        <Text style={{ color: Colors.blue[6] }}>
          {utils.farsiNum(`${record.OperationID} - ${record.OperationTitle}`)}
        </Text>
      ),
    },
    {
      title: Words.nature,
      width: 100,
      align: "center",
      dataIndex: "PaperNatureTitle",
      sorter: getSorter("PaperNatureTitle"),
      render: (PaperNatureTitle) => (
        <Text style={{ color: Colors.grey[6] }}>{PaperNatureTitle}</Text>
      ),
    },
    {
      title: Words.duration,
      width: 100,
      align: "center",
      dataIndex: "DurationTypeTitle",
      sorter: getSorter("DurationTypeTitle"),
      render: (DurationTypeTitle) => (
        <Text style={{ color: Colors.grey[6] }}>{DurationTypeTitle}</Text>
      ),
    },
    {
      title: Words.cash_flow,
      width: 200,
      align: "center",
      dataIndex: "CashFlowTitle",
      sorter: getSorter("CashFlowTitle"),
      render: (CashFlowTitle) => (
        <Text style={{ color: Colors.purple[6] }}>{CashFlowTitle}</Text>
      ),
    },
    {
      title: Words.currency,
      width: 150,
      align: "center",
      dataIndex: "CurrencyTitle",
      sorter: getSorter("CurrencyTitle"),
      render: (CurrencyTitle) => (
        <Text style={{ color: Colors.grey[6] }}>{CurrencyTitle}</Text>
      ),
    },
    {
      title: Words.price,
      width: 200,
      align: "center",
      dataIndex: "Amount",
      sorter: getSorter("Amount"),
      render: (Amount) => (
        <Text style={{ color: Colors.green[6] }}>
          {utils.farsiNum(utils.moneyNumber(Amount))}
        </Text>
      ),
    },
    {
      title: Words.standard_description,
      width: 100,
      align: "center",
      render: (record) => (
        <>
          {(record.StandardDetailsID > 0 || record.DetailsText.length > 0) && (
            <Popover
              content={
                <Text>{`${utils.getDescription(
                  record.StandardDetailsText,
                  record.DetailsText
                )}`}</Text>
              }
            >
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
  ];

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

const getWithdrawNoticeColumns = (access, statusID, onEdit, onDelete) => {
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
      title: Words.front_side,
      width: 200,
      align: "center",
      dataIndex: "FrontSideAccountTitle",
      sorter: getSorter("FrontSideAccountTitle"),
      render: (FrontSideAccountTitle) => (
        <Text style={{ color: Colors.cyan[6] }}>
          {utils.farsiNum(FrontSideAccountTitle)}
        </Text>
      ),
    },
    {
      title: Words.financial_operation,
      width: 200,
      align: "center",
      //   dataIndex: "Price",
      sorter: getSorter("OperationTitle"),
      render: (record) => (
        <Text style={{ color: Colors.blue[6] }}>
          {utils.farsiNum(`${record.OperationID} - ${record.OperationTitle}`)}
        </Text>
      ),
    },
    {
      title: Words.nature,
      width: 100,
      align: "center",
      dataIndex: "PaperNatureTitle",
      sorter: getSorter("PaperNatureTitle"),
      render: (PaperNatureTitle) => (
        <Text style={{ color: Colors.grey[6] }}>{PaperNatureTitle}</Text>
      ),
    },
    {
      title: Words.duration,
      width: 100,
      align: "center",
      dataIndex: "DurationTypeTitle",
      sorter: getSorter("DurationTypeTitle"),
      render: (DurationTypeTitle) => (
        <Text style={{ color: Colors.grey[6] }}>{DurationTypeTitle}</Text>
      ),
    },
    {
      title: Words.cash_flow,
      width: 200,
      align: "center",
      dataIndex: "CashFlowTitle",
      sorter: getSorter("CashFlowTitle"),
      render: (CashFlowTitle) => (
        <Text style={{ color: Colors.purple[6] }}>{CashFlowTitle}</Text>
      ),
    },
    {
      title: Words.currency,
      width: 150,
      align: "center",
      dataIndex: "CurrencyTitle",
      sorter: getSorter("CurrencyTitle"),
      render: (CurrencyTitle) => (
        <Text style={{ color: Colors.grey[6] }}>{CurrencyTitle}</Text>
      ),
    },
    {
      title: Words.price,
      width: 200,
      align: "center",
      dataIndex: "Amount",
      sorter: getSorter("Amount"),
      render: (Amount) => (
        <Text style={{ color: Colors.green[6] }}>
          {utils.farsiNum(utils.moneyNumber(Amount))}
        </Text>
      ),
    },
    {
      title: Words.withdraw_notice_no,
      width: 200,
      align: "center",
      dataIndex: "NoticeNo",
      sorter: getSorter("NoticeNo"),
      render: (NoticeNo) => (
        <Text style={{ color: Colors.orange[6] }}>
          {utils.farsiNum(NoticeNo)}
        </Text>
      ),
    },
    {
      title: Words.withdraw_notice_date,
      width: 120,
      align: "center",
      dataIndex: "NoticeDate",
      sorter: getSorter("NoticeDate"),
      render: (NoticeDate) => (
        <Text
          style={{
            color: Colors.geekblue[6],
          }}
        >
          {utils.farsiNum(utils.slashDate(NoticeDate))}
        </Text>
      ),
    },
    {
      title: Words.standard_description,
      width: 100,
      align: "center",
      render: (record) => (
        <>
          {(record.StandardDetailsID > 0 || record.DetailsText.length > 0) && (
            <Popover
              content={
                <Text>{`${utils.getDescription(
                  record.StandardDetailsText,
                  record.DetailsText
                )}`}</Text>
              }
            >
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
  ];

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

const getTransferToOtherColumns = (access, statusID, onEdit, onDelete) => {
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
      title: Words.front_side,
      width: 200,
      align: "center",
      dataIndex: "FrontSideAccountTitle",
      sorter: getSorter("FrontSideAccountTitle"),
      render: (FrontSideAccountTitle) => (
        <Text style={{ color: Colors.cyan[6] }}>
          {utils.farsiNum(FrontSideAccountTitle)}
        </Text>
      ),
    },
    {
      title: Words.cheque_no,
      width: 150,
      align: "center",
      dataIndex: "ChequeNo",
      sorter: getSorter("ChequeNo"),
      render: (ChequeNo) => (
        <Text style={{ color: Colors.red[6] }}>{utils.farsiNum(ChequeNo)}</Text>
      ),
    },
    {
      title: Words.account_no,
      width: 200,
      align: "center",
      dataIndex: "AccountNo",
      sorter: getSorter("AccountNo"),
      render: (AccountNo) => (
        <Text style={{ color: Colors.grey[6] }}>
          {utils.farsiNum(AccountNo)}
        </Text>
      ),
    },
    {
      title: Words.bank,
      width: 150,
      align: "center",
      dataIndex: "BankTitle",
      sorter: getSorter("BankTitle"),
      render: (BankTitle) => (
        <Text style={{ color: Colors.purple[6] }}>
          {utils.farsiNum(BankTitle)}
        </Text>
      ),
    },
    {
      title: Words.branch_name,
      width: 150,
      align: "center",
      dataIndex: "BranchName",
      sorter: getSorter("BranchName"),
      render: (BranchName) => (
        <Text style={{ color: Colors.orange[6] }}>
          {utils.farsiNum(BranchName)}
        </Text>
      ),
    },
    // {
    //   title: Words.financial_operation,
    //   width: 200,
    //   align: "center",
    //   //   dataIndex: "Price",
    //   sorter: getSorter("OperationTitle"),
    //   render: (record) => (
    //     <Text style={{ color: Colors.blue[6] }}>
    //       {utils.farsiNum(`${record.OperationID} - ${record.OperationTitle}`)}
    //     </Text>
    //   ),
    // },
    // {
    //   title: Words.nature,
    //   width: 100,
    //   align: "center",
    //   dataIndex: "PaperNatureTitle",
    //   sorter: getSorter("PaperNatureTitle"),
    //   render: (PaperNatureTitle) => (
    //     <Text style={{ color: Colors.grey[6] }}>{PaperNatureTitle}</Text>
    //   ),
    // },
    {
      title: Words.duration,
      width: 100,
      align: "center",
      dataIndex: "DurationTypeTitle",
      sorter: getSorter("DurationTypeTitle"),
      render: (DurationTypeTitle) => (
        <Text style={{ color: Colors.grey[6] }}>{DurationTypeTitle}</Text>
      ),
    },
    {
      title: Words.cash_flow,
      width: 200,
      align: "center",
      dataIndex: "CashFlowTitle",
      sorter: getSorter("CashFlowTitle"),
      render: (CashFlowTitle) => (
        <Text style={{ color: Colors.purple[6] }}>{CashFlowTitle}</Text>
      ),
    },
    {
      title: Words.currency,
      width: 150,
      align: "center",
      dataIndex: "CurrencyTitle",
      sorter: getSorter("CurrencyTitle"),
      render: (CurrencyTitle) => (
        <Text style={{ color: Colors.grey[6] }}>{CurrencyTitle}</Text>
      ),
    },
    {
      title: Words.price,
      width: 200,
      align: "center",
      dataIndex: "Amount",
      sorter: getSorter("Amount"),
      render: (Amount) => (
        <Text style={{ color: Colors.green[6] }}>
          {utils.farsiNum(utils.moneyNumber(Amount))}
        </Text>
      ),
    },
    {
      title: Words.due_date,
      width: 120,
      align: "center",
      dataIndex: "DueDate",
      sorter: getSorter("DueDate"),
      render: (DueDate) => (
        <Text
          style={{
            color: Colors.geekblue[6],
          }}
        >
          {utils.farsiNum(utils.slashDate(DueDate))}
        </Text>
      ),
    },
    {
      title: Words.agreed_date,
      width: 120,
      align: "center",
      dataIndex: "AgreedDate",
      sorter: getSorter("AgreedDate"),
      render: (AgreedDate) => (
        <Text
          style={{
            color: Colors.blue[6],
          }}
        >
          {AgreedDate.length > 0
            ? utils.farsiNum(utils.slashDate(AgreedDate))
            : "-"}
        </Text>
      ),
    },
    {
      title: Words.standard_description,
      width: 100,
      align: "center",
      render: (record) => (
        <>
          {(record.StandardDetailsID > 0 || record.DetailsText.length > 0) && (
            <Popover
              content={
                <Text>{`${utils.getDescription(
                  record.StandardDetailsText,
                  record.DetailsText
                )}`}</Text>
              }
            >
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
  ];

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

const getRefundReceivedChequeColumns = (access, statusID, onEdit, onDelete) => {
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
      title: Words.front_side,
      width: 200,
      align: "center",
      dataIndex: "FrontSideAccountTitle",
      sorter: getSorter("FrontSideAccountTitle"),
      render: (FrontSideAccountTitle) => (
        <Text style={{ color: Colors.cyan[6] }}>
          {utils.farsiNum(FrontSideAccountTitle)}
        </Text>
      ),
    },
    {
      title: Words.cheque_no,
      width: 150,
      align: "center",
      dataIndex: "ChequeNo",
      sorter: getSorter("ChequeNo"),
      render: (ChequeNo) => (
        <Text style={{ color: Colors.red[6] }}>{utils.farsiNum(ChequeNo)}</Text>
      ),
    },
    {
      title: Words.account_no,
      width: 200,
      align: "center",
      dataIndex: "AccountNo",
      sorter: getSorter("AccountNo"),
      render: (AccountNo) => (
        <Text style={{ color: Colors.grey[6] }}>
          {utils.farsiNum(AccountNo)}
        </Text>
      ),
    },
    {
      title: Words.bank,
      width: 150,
      align: "center",
      dataIndex: "BankTitle",
      sorter: getSorter("BankTitle"),
      render: (BankTitle) => (
        <Text style={{ color: Colors.purple[6] }}>
          {utils.farsiNum(BankTitle)}
        </Text>
      ),
    },
    {
      title: Words.branch_name,
      width: 150,
      align: "center",
      dataIndex: "BranchName",
      sorter: getSorter("BranchName"),
      render: (BranchName) => (
        <Text style={{ color: Colors.orange[6] }}>
          {utils.farsiNum(BranchName)}
        </Text>
      ),
    },
    // {
    //   title: Words.financial_operation,
    //   width: 200,
    //   align: "center",
    //   //   dataIndex: "Price",
    //   sorter: getSorter("OperationTitle"),
    //   render: (record) => (
    //     <Text style={{ color: Colors.blue[6] }}>
    //       {utils.farsiNum(`${record.OperationID} - ${record.OperationTitle}`)}
    //     </Text>
    //   ),
    // },
    // {
    //   title: Words.nature,
    //   width: 100,
    //   align: "center",
    //   dataIndex: "PaperNatureTitle",
    //   sorter: getSorter("PaperNatureTitle"),
    //   render: (PaperNatureTitle) => (
    //     <Text style={{ color: Colors.grey[6] }}>{PaperNatureTitle}</Text>
    //   ),
    // },
    {
      title: Words.duration,
      width: 100,
      align: "center",
      dataIndex: "DurationTypeTitle",
      sorter: getSorter("DurationTypeTitle"),
      render: (DurationTypeTitle) => (
        <Text style={{ color: Colors.grey[6] }}>{DurationTypeTitle}</Text>
      ),
    },
    {
      title: Words.cash_flow,
      width: 200,
      align: "center",
      dataIndex: "CashFlowTitle",
      sorter: getSorter("CashFlowTitle"),
      render: (CashFlowTitle) => (
        <Text style={{ color: Colors.purple[6] }}>{CashFlowTitle}</Text>
      ),
    },
    {
      title: Words.currency,
      width: 150,
      align: "center",
      dataIndex: "CurrencyTitle",
      sorter: getSorter("CurrencyTitle"),
      render: (CurrencyTitle) => (
        <Text style={{ color: Colors.grey[6] }}>{CurrencyTitle}</Text>
      ),
    },
    {
      title: Words.price,
      width: 200,
      align: "center",
      dataIndex: "Amount",
      sorter: getSorter("Amount"),
      render: (Amount) => (
        <Text style={{ color: Colors.green[6] }}>
          {utils.farsiNum(utils.moneyNumber(Amount))}
        </Text>
      ),
    },
    {
      title: Words.due_date,
      width: 120,
      align: "center",
      dataIndex: "DueDate",
      sorter: getSorter("DueDate"),
      render: (DueDate) => (
        <Text
          style={{
            color: Colors.geekblue[6],
          }}
        >
          {utils.farsiNum(utils.slashDate(DueDate))}
        </Text>
      ),
    },
    {
      title: Words.agreed_date,
      width: 120,
      align: "center",
      dataIndex: "AgreedDate",
      sorter: getSorter("AgreedDate"),
      render: (AgreedDate) => (
        <Text
          style={{
            color: Colors.blue[6],
          }}
        >
          {AgreedDate.length > 0
            ? utils.farsiNum(utils.slashDate(AgreedDate))
            : "-"}
        </Text>
      ),
    },
    {
      title: Words.standard_description,
      width: 100,
      align: "center",
      render: (record) => (
        <>
          {(record.StandardDetailsID > 0 || record.DetailsText.length > 0) && (
            <Popover
              content={
                <Text>{`${utils.getDescription(
                  record.StandardDetailsText,
                  record.DetailsText
                )}`}</Text>
              }
            >
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
  ];

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

const getRefundReceivedDemandColumns = (access, statusID, onEdit, onDelete) => {
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
      title: Words.front_side,
      width: 200,
      align: "center",
      dataIndex: "FrontSideAccountTitle",
      sorter: getSorter("FrontSideAccountTitle"),
      render: (FrontSideAccountTitle) => (
        <Text style={{ color: Colors.cyan[6] }}>
          {utils.farsiNum(FrontSideAccountTitle)}
        </Text>
      ),
    },
    // {
    //   title: Words.financial_operation,
    //   width: 200,
    //   align: "center",
    //   //   dataIndex: "Price",
    //   sorter: getSorter("OperationTitle"),
    //   render: (record) => (
    //     <Text style={{ color: Colors.blue[6] }}>
    //       {utils.farsiNum(`${record.OperationID} - ${record.OperationTitle}`)}
    //     </Text>
    //   ),
    // },
    // {
    //   title: Words.nature,
    //   width: 100,
    //   align: "center",
    //   dataIndex: "PaperNatureTitle",
    //   sorter: getSorter("PaperNatureTitle"),
    //   render: (PaperNatureTitle) => (
    //     <Text style={{ color: Colors.grey[6] }}>{PaperNatureTitle}</Text>
    //   ),
    // },
    {
      title: Words.duration,
      width: 100,
      align: "center",
      dataIndex: "DurationTypeTitle",
      sorter: getSorter("DurationTypeTitle"),
      render: (DurationTypeTitle) => (
        <Text style={{ color: Colors.grey[6] }}>{DurationTypeTitle}</Text>
      ),
    },
    {
      title: Words.cash_flow,
      width: 200,
      align: "center",
      dataIndex: "CashFlowTitle",
      sorter: getSorter("CashFlowTitle"),
      render: (CashFlowTitle) => (
        <Text style={{ color: Colors.purple[6] }}>{CashFlowTitle}</Text>
      ),
    },
    {
      title: Words.currency,
      width: 150,
      align: "center",
      dataIndex: "CurrencyTitle",
      sorter: getSorter("CurrencyTitle"),
      render: (CurrencyTitle) => (
        <Text style={{ color: Colors.grey[6] }}>{CurrencyTitle}</Text>
      ),
    },
    {
      title: Words.price,
      width: 200,
      align: "center",
      dataIndex: "Amount",
      sorter: getSorter("Amount"),
      render: (Amount) => (
        <Text style={{ color: Colors.green[6] }}>
          {utils.farsiNum(utils.moneyNumber(Amount))}
        </Text>
      ),
    },
    {
      title: Words.demand_no,
      width: 200,
      align: "center",
      dataIndex: "DemandNo",
      sorter: getSorter("DemandNo"),
      render: (DemandNo) => (
        <Text style={{ color: Colors.orange[6] }}>
          {utils.farsiNum(DemandNo)}
        </Text>
      ),
    },
    {
      title: Words.due_date,
      width: 120,
      align: "center",
      dataIndex: "DueDate",
      sorter: getSorter("DueDate"),
      render: (DueDate) => (
        <Text
          style={{
            color: Colors.geekblue[6],
          }}
        >
          {utils.farsiNum(utils.slashDate(DueDate))}
        </Text>
      ),
    },
    {
      title: Words.standard_description,
      width: 100,
      align: "center",
      render: (record) => (
        <>
          {(record.StandardDetailsID > 0 || record.DetailsText.length > 0) && (
            <Popover
              content={
                <Text>{`${utils.getDescription(
                  record.StandardDetailsText,
                  record.DetailsText
                )}`}</Text>
              }
            >
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
  ];

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

export const getTabPanes = (config, selectedTab) => {
  const {
    record,
    price,
    access,
    status_id,
    cash_box_id,
    handleEditCheque,
    handleDeleteCheque,
    handleEditDemand,
    handleDeleteDemand,
    handleEditCash,
    handleDeleteCash,
    handleEditWithdrawNotice,
    handleDeleteWithdrawNotice,
    handleEditTransferToOther,
    handleDeleteTransferToOther,
    handleEditRefundReceivedCheque,
    handleDeleteRefundReceivedCheque,
    handleEditRefundReceivedDemand,
    handleDeleteRefundReceivedDemand,
  } = config;

  return [
    {
      label: (
        <BadgedTabTitle
          selectedTab={selectedTab}
          selectionTitle="cheques"
          title={Words.cheque}
          items={record.Cheques}
        />
      ),
      key: "cheques",
      children: (
        <Row gutter={[0, 15]}>
          <Col xs={24}>
            <DetailsTable
              records={record.Cheques}
              columns={getChequeColumns(
                access,
                status_id,
                handleEditCheque,
                handleDeleteCheque
              )}
            />
          </Col>
          <Col xs={24}>
            <PriceViewer price={price.ChequesAmount} />
          </Col>
        </Row>
      ),
    },
    {
      label: (
        <BadgedTabTitle
          selectedTab={selectedTab}
          selectionTitle="demands"
          title={Words.demand}
          items={record.Demands}
        />
      ),
      key: "demands",
      children: (
        <Row gutter={[0, 15]}>
          <Col xs={24}>
            <DetailsTable
              records={record.Demands}
              columns={getDemandColumns(
                access,
                status_id,
                handleEditDemand,
                handleDeleteDemand
              )}
            />
          </Col>
          <Col xs={24}>
            <PriceViewer price={price.DemandsAmount} />
          </Col>
        </Row>
      ),
    },
    {
      label: (
        <BadgedTabTitle
          selectedTab={selectedTab}
          selectionTitle="cashes"
          title={Words.cash}
          items={record.Cashes}
        />
      ),
      key: "cashes",
      children: (
        <Row gutter={[0, 15]}>
          {cash_box_id > 0 ? (
            <>
              <Col xs={24}>
                <DetailsTable
                  records={record.Cashes}
                  columns={getCashColumns(
                    access,
                    status_id,
                    handleEditCash,
                    handleDeleteCash
                  )}
                />
              </Col>
              <Col xs={24}>
                <PriceViewer price={price.CashesAmount} />
              </Col>
            </>
          ) : (
            <Col xs={24}>
              <Alert
                message={Words.messages.no_selected_cash_box}
                type="warning"
                showIcon
              />
            </Col>
          )}
        </Row>
      ),
    },
    {
      label: (
        <BadgedTabTitle
          selectedTab={selectedTab}
          selectionTitle="withdraw-notices"
          title={Words.withraw_notices}
          items={record.WithdrawNotices}
        />
      ),
      key: "withdraw-notices",
      children: (
        <Row gutter={[0, 15]}>
          <Col xs={24}>
            <DetailsTable
              records={record.WithdrawNotices}
              columns={getWithdrawNoticeColumns(
                access,
                status_id,
                handleEditWithdrawNotice,
                handleDeleteWithdrawNotice
              )}
            />
          </Col>
          <Col xs={24}>
            <PriceViewer price={price.WithdrawNoticesAmount} />
          </Col>
        </Row>
      ),
    },
    {
      label: (
        <BadgedTabTitle
          selectedTab={selectedTab}
          selectionTitle="transfer-to-others"
          title={Words.pay_to_other}
          items={record.TransferToOthers}
        />
      ),
      key: "transfer-to-others",
      children: (
        <Row gutter={[0, 15]}>
          <Col xs={24}>
            <DetailsTable
              records={record.TransferToOthers}
              columns={getTransferToOtherColumns(
                access,
                status_id,
                handleEditTransferToOther,
                handleDeleteTransferToOther
              )}
            />
          </Col>
          <Col xs={24}>
            <PriceViewer price={price.TransferToOthersAmount} />
          </Col>
        </Row>
      ),
    },
    {
      label: (
        <BadgedTabTitle
          selectedTab={selectedTab}
          selectionTitle="refund-received-cheques"
          title={Words.refund_received_cheque}
          items={record.RefundReceivedCheques}
        />
      ),
      key: "refund-received-cheques",
      children: (
        <Row gutter={[0, 15]}>
          <Col xs={24}>
            <DetailsTable
              records={record.RefundReceivedCheques}
              columns={getRefundReceivedChequeColumns(
                access,
                status_id,
                handleEditRefundReceivedCheque,
                handleDeleteRefundReceivedCheque
              )}
            />
          </Col>
          <Col xs={24}>
            <PriceViewer price={price.RefundReceivedChequesAmount} />
          </Col>
        </Row>
      ),
    },
    {
      label: (
        <BadgedTabTitle
          selectedTab={selectedTab}
          selectionTitle="refund-received-demands"
          title={Words.refund_received_demand}
          items={record.RefundReceivedDemands}
        />
      ),
      key: "refund-received-demands",
      children: (
        <Row gutter={[0, 15]}>
          <Col xs={24}>
            <DetailsTable
              records={record.RefundReceivedDemands}
              columns={getRefundReceivedDemandColumns(
                access,
                status_id,
                handleEditRefundReceivedDemand,
                handleDeleteRefundReceivedDemand
              )}
            />
          </Col>
          <Col xs={24}>
            <PriceViewer price={price.RefundReceivedDemandsAmount} />
          </Col>
        </Row>
      ),
    },
  ];
};

export const getNewButton = (onClick) => {
  return (
    <Button type="primary" onClick={onClick} icon={<AddIcon />}>
      {Words.new}
    </Button>
  );
};

export const getFooterButtons = (is_disable, config) => {
  const {
    selectedObject,
    handleSubmit,
    handleSubmitAndApprove,
    onApprove,
    hasRejectAccess,
    onReject,
    onCancel,
    clearRecord,
    progress,
    hasSaveApproveAccess,
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
              title={Words.questions.sure_to_submit_approve_receive_receipt}
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
          {hasSaveApproveAccess && (
            <Popconfirm
              title={Words.questions.sure_to_submit_approve_receive_receipt}
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

export const getDisableStatus = (record) => {
  const is_disable =
    (record?.Cheques?.length ||
      0 + record?.Demands?.length ||
      0 + record?.Cashes?.length ||
      0 + record?.WithdrawNotices?.length ||
      0 + record?.TransferToOthers?.length ||
      0 + record?.RefundReceivedCheques?.length ||
      0 + record?.RefundReceivedDemands?.length ||
      0) === 0 ||
    (validateForm({ record, schema }) && true);

  return is_disable;
};

export const calculatePrice = (record) => {
  const price = {};
  let sum = 0;

  record.Cheques?.forEach((i) => {
    sum += i.Amount;
  });
  price.ChequesAmount = sum;
  sum = 0;

  record.Demands?.forEach((i) => {
    sum += i.Amount;
  });
  price.DemandsAmount = sum;
  sum = 0;

  record.Cashes?.forEach((i) => {
    sum += i.Amount;
  });
  price.CashesAmount = sum;
  sum = 0;

  record.WithdrawNotices?.forEach((i) => {
    sum += i.Amount;
  });
  price.WithdrawNoticesAmount = sum;
  sum = 0;

  record.TransferToOthers?.forEach((i) => {
    sum += i.Amount;
  });
  price.TransferToOthersAmount = sum;
  sum = 0;

  record.RefundReceivedCheques?.forEach((i) => {
    sum += i.Amount;
  });
  price.RefundReceivedChequesAmount = sum;
  sum = 0;

  record.RefundReceivedDemands?.forEach((i) => {
    sum += i.Amount;
  });
  price.RefundReceivedDemandsAmount = sum;
  sum = 0;

  for (const key in price) {
    sum += price[key];
  }
  price.Total = sum;

  return price;
};

export const findTitle = (data_source, id_col, title_col, search_value) => {
  const record = data_source.find((row) => row[id_col] === search_value);

  return record ? record[title_col] : "";
};

const codes = {
  schema,
  initRecord,
  getTabPanes,
  getNewButton,
  getFooterButtons,
  getDisableStatus,
  calculatePrice,
  findTitle,
};

export default codes;
