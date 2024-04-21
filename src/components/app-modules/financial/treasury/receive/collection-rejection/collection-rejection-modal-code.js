import Words from "../../../../../../resources/words";
import Colors from "../../../../../../resources/colors";
import utils from "../../../../../../tools/utils";
import { Button, Space, Typography, Popconfirm, Row, Col } from "antd";
import { getSorter, validateForm } from "../../../../../../tools/form-manager";
import {
  PlusOutlined as AddIcon,
  DeleteOutlined as DeleteIcon,
  EditOutlined as EditIcon,
  QuestionCircleOutlined as QuestionIcon,
} from "@ant-design/icons";
import Joi from "joi-browser";
import PriceViewer from "./../../../../../common/price-viewer";
import DetailsTable from "../../../../../common/details-table";

const { Text } = Typography;

export const schema = {
  CollectionRejectionID: Joi.number().required().label(Words.id),
  CompanyBankAccountID: Joi.number()
    .min(1)
    .required()
    .label(Words.bank_account),
  CurrencyID: Joi.number().min(1).required().label(Words.currency),
  ItemType: Joi.number().min(1).required().label(Words.item_type),
  CollectionRejectionDate: Joi.string()
    .required()
    .label(Words.collection_rejection_date),
  StandardDetailsID: Joi.number().label(Words.standard_description),
  StatusID: Joi.number(),
  Cheques: Joi.array(),
  Demands: Joi.array(),
};

export const initRecord = {
  CollectionRejectionID: 0,
  CompanyBankAccountID: 0,
  CurrencyID: 0,
  ItemType: 0,
  CollectionRejectionDate: "",
  StandardDetailsID: 0,
  StatusID: 1,
  Cheques: [],
  Demands: [],
};

const getChequeColumns = (access, statusID, onEdit, onDelete) => {
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
      title: Words.status,
      width: 150,
      align: "center",
      dataIndex: "StatusTitle",
      sorter: getSorter("StatusTitle"),
      render: (StatusTitle) => (
        <Text style={{ color: Colors.blue[6] }}>{StatusTitle}</Text>
      ),
    },
    {
      title: Words.bank_hand_over_id,
      width: 220,
      align: "center",
      dataIndex: "HandOverID",
      sorter: getSorter("HandOverID"),
      render: (HandOverID) => (
        <Text style={{ color: Colors.grey[6] }}>
          {utils.farsiNum(HandOverID)}
        </Text>
      ),
    },
    {
      title: Words.financial_operation,
      width: 200,
      align: "center",
      //   dataIndex: "OperationTitle",
      sorter: getSorter("OperationTitle"),
      render: (record) => (
        <Text style={{ color: Colors.purple[6] }}>
          {utils.farsiNum(`${record.OperationID} - ${record.OperationTitle}`)}
        </Text>
      ),
    },
    {
      title: Words.duration,
      width: 120,
      align: "center",
      dataIndex: "DurationTypeTitle",
      sorter: getSorter("DurationTypeTitle"),
      render: (DurationTypeTitle) => (
        <Text style={{ color: Colors.grey[6] }}>{DurationTypeTitle}</Text>
      ),
    },
    {
      title: Words.account_no,
      width: 150,
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

const getDemandColumns = (access, statusID, onEdit, onDelete) => {
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
      title: Words.status,
      width: 150,
      align: "center",
      dataIndex: "StatusTitle",
      sorter: getSorter("StatusTitle"),
      render: (StatusTitle) => (
        <Text style={{ color: Colors.blue[6] }}>{StatusTitle}</Text>
      ),
    },
    {
      title: Words.bank_hand_over_id,
      width: 220,
      align: "center",
      dataIndex: "HandOverID",
      sorter: getSorter("HandOverID"),
      render: (HandOverID) => (
        <Text style={{ color: Colors.grey[6] }}>
          {utils.farsiNum(HandOverID)}
        </Text>
      ),
    },
    {
      title: Words.financial_operation,
      width: 200,
      align: "center",
      //   dataIndex: "OperationTitle",
      sorter: getSorter("OperationTitle"),
      render: (record) => (
        <Text style={{ color: Colors.purple[6] }}>
          {utils.farsiNum(`${record.OperationID} - ${record.OperationTitle}`)}
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
              title={
                Words.questions.sure_to_submit_approve_collection_rejection
              }
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
              title={
                Words.questions.sure_to_submit_approve_collection_rejection
              }
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

export const getTabPanes = (config) => {
  const {
    record,
    price,
    access,
    status_id,
    handleEditCheque,
    handleDeleteCheque,
    handleEditDemand,
    handleDeleteDemand,
  } = config;

  let result = [];

  if (record.ItemType === 1) {
    result = [
      {
        label: Words.cheque,
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
    ];
  } else if (record.ItemType === 2) {
    result = [
      {
        label: Words.demand,
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
    ];
  }

  return result;
};

export const getDisableStatus = (record) => {
  const is_disable =
    (record?.Cheques?.length || 0 + record?.Demands?.length || 0) === 0 ||
    (validateForm({ record, schema }) && true);

  return is_disable;
};

const codes = {
  schema,
  initRecord,
  getNewButton,
  getFooterButtons,
  calculatePrice,
  getTabPanes,
  getDisableStatus,
};

export default codes;
