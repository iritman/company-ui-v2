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
  {
    title: "",
    fixed: "right",
    align: "center",
    width: 1,
    render: () => <></>,
  },
];

const receive_notice_columns = [
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
  {
    title: "",
    fixed: "right",
    align: "center",
    width: 1,
    render: () => <></>,
  },
];

const pay_to_other_columns = [
  {
    title: Words.id,
    width: 75,
    align: "center",
    dataIndex: "PayID",
    sorter: getSorter("PayID"),
    render: (PayID) => (
      <Text>{PayID > 0 ? utils.farsiNum(`${PayID}`) : ""}</Text>
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

  receive_receipt.ReceiveNotices?.forEach((i) => {
    sum += i.Amount;
  });
  price.ReceiveNoticesAmount = sum;
  sum = 0;

  receive_receipt.PayToOthers?.forEach((i) => {
    sum += i.Amount;
  });
  price.PayToOthersAmount = sum;
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

export const getTabPanes = (payment_order, selectedTab) => {
  const price = calculatePrice(payment_order);

  const {
    Cheques,
    Demands,
    Cashes,
    ReceiveNotices,
    PayToOthers,
    ReturnPayableCheques,
    ReturnPayableDemands,
  } = payment_order;

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
          selectionTitle="receive-notices"
          title={Words.receive_notice}
          items={ReceiveNotices}
        />
      ),
      key: "receive-notices",
      children: (
        <Row gutter={[0, 15]}>
          <Col xs={24}>
            <DetailsTable
              records={ReceiveNotices}
              columns={receive_notice_columns}
            />
          </Col>
          <Col xs={24}>
            <PriceViewer price={price.PayToOthersAmount} />
          </Col>
        </Row>
      ),
    },
    {
      label: (
        <BadgedTabTitle
          selectedTab={selectedTab}
          selectionTitle="pay-to-others"
          title={Words.pay_to_other}
          items={PayToOthers}
        />
      ),
      key: "pay-to-others",
      children: (
        <Row gutter={[0, 15]}>
          <Col xs={24}>
            <DetailsTable
              records={PayToOthers}
              columns={pay_to_other_columns}
            />
          </Col>
          <Col xs={24}>
            <PriceViewer price={price.PayToOthersAmount} />
          </Col>
        </Row>
      ),
    },
    {
      label: (
        <BadgedTabTitle
          selectedTab={selectedTab}
          selectionTitle="return-payable-cheques"
          title={Words.return_payable_cheque}
          items={ReturnPayableCheques}
        />
      ),
      key: "return-payable-cheques",
    },
    {
      label: (
        <BadgedTabTitle
          selectedTab={selectedTab}
          selectionTitle="return-payable-demands"
          title={Words.return_payable_demand}
          items={ReturnPayableDemands}
        />
      ),
      key: "return-payable-demands",
    },
  ];

  return tabPanes;
};

const codes = {
  getTabPanes,
};

export default codes;
