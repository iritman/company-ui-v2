import React from "react";
import { Typography, Space, Popconfirm, Button } from "antd";
import {
  PlusOutlined as AddIcon,
  DeleteOutlined as DeleteIcon,
  EditOutlined as EditIcon,
  QuestionCircleOutlined as QuestionIcon,
} from "@ant-design/icons";
import { getSorter } from "../../../../../../tools/form-manager";
import Words from "../../../../../../resources/words";
import Colors from "../../../../../../resources/colors";
import utils from "../../../../../../tools/utils";
import Joi from "joi-browser";

const { Text } = Typography;

export const schema = {
  HandOverID: Joi.number().required().label(Words.id),
  CompanyBankAccountID: Joi.number()
    .min(1)
    .required()
    .label(Words.bank_account),
  CurrencyID: Joi.number().min(1).required().label(Words.currency),
  ItemType: Joi.number().min(1).required().label(Words.item_type),
  HandOverDate: Joi.string().required().label(Words.hand_over_date),
  OperationID: Joi.number().label(Words.financial_operation),
  StandardDetailsID: Joi.number().label(Words.standard_description),
  StatusID: Joi.number(),
  Cheques: Joi.array(),
  Demands: Joi.array(),
};

export const initRecord = {
  HandOverID: 0,
  CompanyBankAccountID: 0,
  CurrencyID: 0,
  ItemType: 0,
  HandOverDate: "",
  OperationID: 0,
  StandardDetailsID: 0,
  StatusID: 1,
  Cheques: [],
  Demands: [],
};

export const getChequeColumns = (access, statusID, onEdit, onDelete) => {
  let columns = [
    {
      title: Words.id,
      width: 75,
      align: "center",
      dataIndex: "ChequeID",
      sorter: getSorter("ChequeID"),
      render: (ChequeID) => (
        <Text>{ChequeID > 0 ? utils.farsiNum(`${ChequeID}`) : ""}</Text>
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
      title: Words.account_no,
      width: 100,
      align: "center",
      dataIndex: "AccountNo",
      sorter: getSorter("AccountNo"),
      render: (AccountNo) => (
        <Text style={{ color: Colors.orange[6] }}>
          {utils.farsiNum(AccountNo)}
        </Text>
      ),
    },
    {
      title: Words.bank,
      width: 100,
      align: "center",
      dataIndex: "BankTitle",
      sorter: getSorter("BankTitle"),
      render: (BankTitle) => (
        <Text style={{ color: Colors.green[6] }}>{BankTitle}</Text>
      ),
    },
    {
      title: Words.city,
      width: 120,
      align: "center",
      dataIndex: "CityTitle",
      sorter: getSorter("CityTitle"),
      render: (CityTitle) => (
        <Text style={{ color: Colors.blue[6] }}>{CityTitle}</Text>
      ),
    },
    {
      title: Words.bank_branch,
      width: 100,
      align: "center",
      dataIndex: "BranchName",
      sorter: getSorter("BranchName"),
      render: (BranchName) => (
        <Text style={{ color: Colors.grey[6] }}>
          {utils.farsiNum(BranchName)}
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
  }

  return columns;
};

export const getDemandColumns = (access, statusID, onEdit, onDelete) => {
  let columns = [
    {
      title: Words.id,
      width: 75,
      align: "center",
      dataIndex: "DemandID",
      sorter: getSorter("DemandID"),
      render: (DemandID) => (
        <Text>{DemandID > 0 ? utils.farsiNum(`${DemandID}`) : ""}</Text>
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
      title: Words.demand_no,
      width: 150,
      align: "center",
      dataIndex: "DemandNo",
      sorter: getSorter("DemandNo"),
      render: (DemandNo) => (
        <Text style={{ color: Colors.red[6] }}>{utils.farsiNum(DemandNo)}</Text>
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
  }

  return columns;
};

export const getNewButton = (onClick) => {
  return (
    <Button type="primary" onClick={onClick} icon={<AddIcon />}>
      {Words.new}
    </Button>
  );
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

  for (const key in price) {
    sum += price[key];
  }
  price.Total = sum;

  return price;
};

const codes = {
  schema,
  initRecord,
  getChequeColumns,
  getDemandColumns,
  getNewButton,
  calculatePrice,
};

export default codes;
