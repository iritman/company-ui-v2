import Words from "../../../../../../resources/words";
import Colors from "../../../../../../resources/colors";
import utils from "../../../../../../tools/utils";
import { Row, Col, Typography, Popover } from "antd";
import DetailsTable from "../../../../../common/details-table";
import PriceViewer from "./../../../../../common/price-viewer";
import { getSorter } from "./../../../../../../tools/form-manager";
import { MdInfoOutline as InfoIcon } from "react-icons/md";
import BadgedTabTitle from "../../../../../common/badged-tab-title";

const { Text } = Typography;

const cheque_columns = [
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
    width: 250,
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
    width: 150,
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
    width: 150,
    align: "center",
    dataIndex: "CashFlowTitle",
    sorter: getSorter("CashFlowTitle"),
    render: (CashFlowTitle) => (
      <Text style={{ color: Colors.purple[6] }}>{CashFlowTitle}</Text>
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
    title: Words.branch_code,
    width: 100,
    align: "center",
    dataIndex: "BranchCode",
    sorter: getSorter("BranchCode"),
    render: (BranchCode) => (
      <Text style={{ color: Colors.grey[6] }}>
        {utils.farsiNum(BranchCode)}
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
    title: Words.cheque_series,
    width: 150,
    align: "center",
    dataIndex: "ChequeSeries",
    sorter: getSorter("ChequeSeries"),
    render: (ChequeSeries) => (
      <Text style={{ color: Colors.grey[6] }}>
        {utils.farsiNum(ChequeSeries)}
      </Text>
    ),
  },
  {
    title: Words.sheba_no,
    width: 200,
    align: "center",
    dataIndex: "ShebaID",
    sorter: getSorter("ShebaID"),
    render: (ShebaID) => (
      <Text style={{ color: Colors.grey[6] }}>{ShebaID}</Text>
    ),
  },
  {
    title: Words.sayad_no,
    width: 200,
    align: "center",
    dataIndex: "SayadNo",
    sorter: getSorter("SayadNo"),
    render: (SayadNo) => (
      <Text style={{ color: Colors.grey[6] }}>{SayadNo}</Text>
    ),
  },
  {
    title: Words.currency,
    width: 120,
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
  {
    title: "",
    fixed: "right",
    align: "center",
    width: 1,
    render: () => <></>,
  },
];

const demand_columns = [
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
    width: 250,
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
    width: 150,
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
    width: 150,
    align: "center",
    dataIndex: "CashFlowTitle",
    sorter: getSorter("CashFlowTitle"),
    render: (CashFlowTitle) => (
      <Text style={{ color: Colors.purple[6] }}>{CashFlowTitle}</Text>
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
    title: Words.demand_series,
    width: 150,
    align: "center",
    dataIndex: "DemandSeries",
    sorter: getSorter("DemandSeries"),
    render: (ChequeSeries) => (
      <Text style={{ color: Colors.grey[6] }}>
        {utils.farsiNum(ChequeSeries)}
      </Text>
    ),
  },
  {
    title: Words.currency,
    width: 120,
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
  {
    title: "",
    fixed: "right",
    align: "center",
    width: 1,
    render: () => <></>,
  },
];

const cash_columns = [
  {
    title: Words.id,
    width: 75,
    align: "center",
    dataIndex: "CashID",
    sorter: getSorter("CashID"),
    render: (CashID) => (
      <Text>{CashID > 0 ? utils.farsiNum(`${CashID}`) : ""}</Text>
    ),
  },
  {
    title: Words.front_side,
    width: 250,
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
    width: 150,
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
    width: 150,
    align: "center",
    dataIndex: "CashFlowTitle",
    sorter: getSorter("CashFlowTitle"),
    render: (CashFlowTitle) => (
      <Text style={{ color: Colors.purple[6] }}>{CashFlowTitle}</Text>
    ),
  },
  {
    title: Words.currency,
    width: 120,
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
  {
    title: "",
    fixed: "right",
    align: "center",
    width: 1,
    render: () => <></>,
  },
];

const payment_notice_columns = [
  {
    title: Words.id,
    width: 75,
    align: "center",
    dataIndex: "NoticeID",
    sorter: getSorter("NoticeID"),
    render: (NoticeID) => (
      <Text>{NoticeID > 0 ? utils.farsiNum(`${NoticeID}`) : ""}</Text>
    ),
  },
  {
    title: Words.front_side,
    width: 250,
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
    width: 150,
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
    width: 150,
    align: "center",
    dataIndex: "CashFlowTitle",
    sorter: getSorter("CashFlowTitle"),
    render: (CashFlowTitle) => (
      <Text style={{ color: Colors.purple[6] }}>{CashFlowTitle}</Text>
    ),
  },
  {
    title: Words.payment_notice_no,
    width: 150,
    align: "center",
    dataIndex: "NoticeNo",
    sorter: getSorter("NoticeNo"),
    render: (NoticeNo) => (
      <Text style={{ color: Colors.red[6] }}>{utils.farsiNum(NoticeNo)}</Text>
    ),
  },
  {
    title: Words.payment_notice_date,
    width: 150,
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
    title: Words.bank_account,
    width: 150,
    align: "center",
    dataIndex: "AccountNo",
    sorter: getSorter("AccountNo"),
    render: (AccountNo) => (
      <Text style={{ color: Colors.purple[6] }}>
        {utils.farsiNum(AccountNo)}
      </Text>
    ),
  },
  {
    title: Words.account_name,
    width: 185,
    align: "center",
    dataIndex: "AccountName",
    sorter: getSorter("AccountName"),
    render: (AccountName) => (
      <Text style={{ color: Colors.grey[6] }}>
        {utils.farsiNum(AccountName)}
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
      <Text style={{ color: Colors.blue[6] }}>{utils.farsiNum(BankTitle)}</Text>
    ),
  },
  {
    title: Words.currency,
    width: 120,
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
  {
    title: "",
    fixed: "right",
    align: "center",
    width: 1,
    render: () => <></>,
  },
];

const calculatePrice = (receive_receipt) => {
  const price = {};
  let sum = 0;

  receive_receipt.Cheques?.forEach((i) => {
    sum += i.Amount;
  });
  price.ChequesAmount = sum;
  sum = 0;

  receive_receipt.Demands?.forEach((i) => {
    sum += i.Amount;
  });
  price.DemandsAmount = sum;
  sum = 0;

  receive_receipt.Cashes?.forEach((i) => {
    sum += i.Amount;
  });
  price.CashesAmount = sum;
  sum = 0;

  receive_receipt.PaymentNotices?.forEach((i) => {
    sum += i.Amount;
  });
  price.PaymentNoticesAmount = sum;
  sum = 0;

  receive_receipt.ReturnFromOthers?.forEach((i) => {
    sum += i.Amount;
  });
  price.ReturnFromOthersAmount = sum;
  sum = 0;

  receive_receipt.ReturnPayableCheques?.forEach((i) => {
    sum += i.Amount;
  });
  price.ReturnPayableChequesAmount = sum;
  sum = 0;

  receive_receipt.ReturnPayableDemands?.forEach((i) => {
    sum += i.Amount;
  });
  price.ReturnPayableDemandsAmount = sum;
  sum = 0;

  for (const key in price) {
    sum += price[key];
  }
  price.Total = sum;

  return price;
};

export const getTabPanes = (receive_receipt, selectedTab) => {
  const price = calculatePrice(receive_receipt);

  const {
    Cheques,
    Demands,
    Cashes,
    PaymentNotices,
    ReturnFromOthers,
    ReturnPayableCheques,
    ReturnPayableDemands,
  } = receive_receipt;

  const tabPanes = [
    {
      label: (
        <BadgedTabTitle
          selectedTab={selectedTab}
          selectionTitle="cheques"
          title={Words.cheque}
          items={Cheques}
        />
      ),
      key: "cheques",
      children: (
        <Row gutter={[0, 15]}>
          <Col xs={24}>
            <DetailsTable records={Cheques} columns={cheque_columns} />
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
          items={Demands}
        />
      ),
      key: "demands",
      children: (
        <Row gutter={[0, 15]}>
          <Col xs={24}>
            <DetailsTable records={Demands} columns={demand_columns} />
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
          items={Cashes}
        />
      ),
      key: "cashes",
      children: (
        <Row gutter={[0, 15]}>
          <Col xs={24}>
            <DetailsTable records={Cashes} columns={cash_columns} />
          </Col>
          <Col xs={24}>
            <PriceViewer price={price.CashesAmount} />
          </Col>
        </Row>
      ),
    },
    {
      label: (
        <BadgedTabTitle
          selectedTab={selectedTab}
          selectionTitle="payment-notices"
          title={Words.payment_notice}
          items={PaymentNotices}
        />
      ),
      key: "payment-notices",
      children: (
        <Row gutter={[0, 15]}>
          <Col xs={24}>
            <DetailsTable
              records={PaymentNotices}
              columns={payment_notice_columns}
            />
          </Col>
          <Col xs={24}>
            <PriceViewer price={price.PaymentNoticesAmount} />
          </Col>
        </Row>
      ),
    },
    {
      label: (
        <BadgedTabTitle
          selectedTab={selectedTab}
          selectionTitle="return-from-others"
          title={Words.refund_from_other_cheque}
          items={ReturnFromOthers}
        />
      ),
      key: "return-from-others",
    },
    {
      label: (
        <BadgedTabTitle
          selectedTab={selectedTab}
          selectionTitle="refund-payed-cheques"
          title={Words.refund_payed_cheque}
          items={ReturnPayableCheques}
        />
      ),
      key: "refund-payed-cheques",
    },
    {
      label: (
        <BadgedTabTitle
          selectedTab={selectedTab}
          selectionTitle="refund-payed-demands"
          title={Words.refund_payed_demand}
          items={ReturnPayableDemands}
        />
      ),
      key: "refund-payed-demands",
    },
  ];

  return tabPanes;
};

const codes = {
  getTabPanes,
};

export default codes;
