import React from "react";
import {
  Button,
  Row,
  Col,
  Typography,
  Descriptions,
  Alert,
  Popover,
} from "antd";
import { MdInfoOutline as InfoIcon } from "react-icons/md";
import Words from "../../../../../../resources/words";
import Colors from "../../../../../../resources/colors";
import utils from "../../../../../../tools/utils";
import { getSorter } from "../../../../../../tools/form-manager";
import DetailsTable from "../../../../../common/details-table";
import ModalWindow from "../../../../../common/modal-window";
import PriceViewer from "../../../../../common/price-viewer";
import { calculateTotalPrice } from "./payment-request-modal-code";

const { Text } = Typography;

const columns = [
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
    title: Words.receive_type,
    width: 120,
    align: "center",
    dataIndex: "ItemTypeTitle",
    sorter: getSorter("ItemTypeTitle"),
    render: (ItemTypeTitle) => (
      <Text style={{ color: Colors.magenta[6] }}> {ItemTypeTitle}</Text>
    ),
  },
  {
    title: Words.price,
    width: 150,
    align: "center",
    dataIndex: "Price",
    sorter: getSorter("Price"),
    render: (Price) => (
      <Text style={{ color: Colors.cyan[6] }}>
        {utils.farsiNum(utils.moneyNumber(Price))}
      </Text>
    ),
  },
  {
    title: Words.payment_date,
    width: 100,
    align: "center",
    dataIndex: "PaymentDate",
    sorter: getSorter("PaymentDate"),
    render: (PaymentDate) => (
      <Text
        style={{
          color: Colors.orange[6],
        }}
      >
        {utils.farsiNum(utils.slashDate(PaymentDate))}
      </Text>
    ),
  },
  {
    title: Words.due_date,
    width: 100,
    align: "center",
    dataIndex: "DueDate",
    sorter: getSorter("DueDate"),
    render: (DueDate) => (
      <Text
        style={{
          color: Colors.orange[6],
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
              <Text>{`${record.StandardDetailsText}${
                record.DetailsText.length > 0 ? `\r\n` : ""
              }${record.DetailsText}`}</Text>
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

const PaymentRequestDetailsModal = ({ selectedObject, isOpen, onOk }) => {
  const valueColor = Colors.blue[7];

  const {
    RequestID,
    // FrontSideAccountID,
    FrontSideAccountTitle,
    // CurrencyID,
    CurrencyTitle,
    // PayTypeID,
    PayTypeTitle,
    PayDate,
    // StandardDetailsID,
    StandardDetailsText,
    DetailsText,
    StatusID,
    StatusTitle,
    Items,
  } = selectedObject;

  return (
    <ModalWindow
      isOpen={isOpen}
      title={Words.more_details}
      footer={[
        <Button key="close-button" onClick={onOk}>
          {Words.close}
        </Button>,
      ]}
      showIcon={false}
      onCancel={onOk}
      width={900}
    >
      <section>
        <article
          id="info-content"
          className="scrollbar-normal"
          style={{ maxHeight: "calc(100vh - 180px)" }}
        >
          <Row gutter={[10, 10]}>
            <Col xs={24}>
              <Alert
                message={
                  <Text style={{ fontSize: 14 }}>
                    {utils.farsiNum(FrontSideAccountTitle)}
                  </Text>
                }
                type="info"
              />
            </Col>
            <Col xs={24}>
              <Descriptions
                bordered
                column={{
                  //   md: 2, sm: 2,
                  lg: 2,
                  md: 2,
                  xs: 1,
                }}
                size="middle"
              >
                <Descriptions.Item label={Words.id}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${RequestID}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.currency}>
                  <Text style={{ color: valueColor }}>{CurrencyTitle}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.pay_type}>
                  <Text style={{ color: valueColor }}>{PayTypeTitle}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.request_date}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(utils.slashDate(PayDate))}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.status}>
                  <Text
                    style={{
                      color:
                        StatusID === 1
                          ? Colors.blue[6]
                          : StatusID === 2
                          ? Colors.green[6]
                          : Colors.red[6],
                    }}
                  >
                    {StatusTitle}
                  </Text>
                </Descriptions.Item>
                {StandardDetailsText.length > 0 && (
                  <Descriptions.Item
                    label={Words.standard_details_text}
                    span={2}
                  >
                    <Text
                      style={{
                        color: Colors.purple[7],
                        whiteSpace: "pre-line",
                      }}
                    >
                      {utils.farsiNum(StandardDetailsText)}
                    </Text>
                  </Descriptions.Item>
                )}
                {DetailsText.length > 0 && (
                  <Descriptions.Item
                    label={Words.standard_description}
                    span={2}
                  >
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
              <DetailsTable
                records={Items}
                columns={columns}
                emptyDataMessage={Words.no_payment_item}
              />
            </Col>
            <Col xs={24}>
              <PriceViewer price={calculateTotalPrice(Items)} />
            </Col>
          </Row>
        </article>
      </section>
    </ModalWindow>
  );
};

export default PaymentRequestDetailsModal;
