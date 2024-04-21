import React, { useState } from "react";
import { useMount } from "react-use";
import {
  Button,
  Row,
  Col,
  Typography,
  Descriptions,
  Tabs,
  Space,
  Popconfirm,
} from "antd";
import Words from "../../../../../../resources/words";
import Colors from "../../../../../../resources/colors";
import utils from "../../../../../../tools/utils";
import { QuestionCircleOutlined as QuestionIcon } from "@ant-design/icons";
import { getSorter, handleError } from "../../../../../../tools/form-manager";
import DetailsTable from "../../../../../common/details-table";
import ModalWindow from "../../../../../common/modal-window";
import PriceViewer from "../../../../../common/price-viewer";
import service from "../../../../../../services/financial/treasury/collector-agent/collector-agent-make-cashes-service";

const { Text } = Typography;
const { TabPane } = Tabs;

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
  {
    title: "",
    fixed: "right",
    align: "center",
    width: 1,
    render: () => <></>,
  },
];

const CollectorAgentMakeCashDetailsModal = ({
  selectedObject,
  isOpen,
  onOk,
  onSubmitReceiveReceipt,
}) => {
  const valueColor = Colors.blue[7];

  const [progress, setProgress] = useState(false);
  const [hasSubmitReceiveReceiptAccess, setHasSubmitReceiveReceiptAccess] =
    useState(false);

  const {
    OperationID,
    AgentTitle,
    OperationDate,
    SubNo,
    ReceiveID,
    ReceiveStatusID,
    ReceiveStatusTitle,
    StandardDetailsText,
    DetailsText,
    RegFirstName,
    RegLastName,
    RegDate,
    RegTime,
    Price,
    Cheques,
  } = selectedObject;

  useMount(async () => {
    setProgress(true);

    try {
      //------ load params

      let data = await service.getParams();

      let { HasSubmitReceiveReceiptAccess } = data;

      setHasSubmitReceiveReceiptAccess(HasSubmitReceiveReceiptAccess);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  });

  const getFooterButtons = () => {
    return (
      <Space>
        {selectedObject !== null && selectedObject.ReceiveID === 0 && (
          <>
            {hasSubmitReceiveReceiptAccess && (
              <Popconfirm
                title={Words.questions.sure_to_submit_receive_receipt}
                onConfirm={onSubmitReceiveReceipt}
                okText={Words.yes}
                cancelText={Words.no}
                icon={<QuestionIcon style={{ color: "red" }} />}
                key="submit-receive-receipt-confirm"
                disabled={progress}
              >
                <Button
                  key="submit-receive-receipt-button"
                  type="primary"
                  disabled={progress}
                >
                  {Words.submit_receive_receipt}
                </Button>
              </Popconfirm>
            )}
          </>
        )}

        <Button key="close-button" onClick={onOk}>
          {Words.close}
        </Button>
      </Space>
    );
  };

  const calculatePrice = () => {
    const price = {};
    let sum = 0;

    selectedObject.Cheques?.forEach((i) => {
      sum += i.Amount;
    });
    price.ChequesAmount = sum;
    sum = 0;

    for (const key in price) {
      sum += price[key];
    }
    price.Total = sum;

    return price;
  };

  const price = calculatePrice();

  return (
    <>
      <ModalWindow
        isOpen={isOpen}
        title={Words.more_details}
        footer={getFooterButtons()}
        showIcon={false}
        onCancel={onOk}
        width={1050}
      >
        <Row gutter={[10, 10]}>
          <Col xs={24}>
            <Descriptions
              bordered
              column={{
                //   md: 2, sm: 2,
                lg: 3,
                md: 2,
                xs: 1,
              }}
              size="middle"
            >
              <Descriptions.Item label={Words.id}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(`${OperationID}`)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.collector_agent}>
                <Text style={{ color: valueColor }}>{AgentTitle}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.date}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(utils.slashDate(OperationDate))}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.sub_no}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(`${SubNo}`)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.status}>
                <Text
                  style={{
                    color:
                      ReceiveStatusID <= 1
                        ? Colors.blue[6]
                        : ReceiveStatusID === 2
                        ? Colors.green[6]
                        : Colors.red[6],
                  }}
                >
                  {ReceiveID > 0 ? ReceiveStatusTitle : Words.not_issued}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.reg_member}>
                <Text
                  style={{ color: valueColor }}
                >{`${RegFirstName} ${RegLastName}`}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.reg_date_time}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(
                    `${utils.slashDate(RegDate)} - ${utils.colonTime(RegTime)}`
                  )}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.price} span={2}>
                <Text
                  style={{
                    color: Colors.magenta[7],
                  }}
                >
                  {`${utils.farsiNum(utils.moneyNumber(Price))} ${Words.ryal}`}
                </Text>
              </Descriptions.Item>
              {StandardDetailsText.length > 0 && (
                <Descriptions.Item label={Words.standard_details_text} span={3}>
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
                <Descriptions.Item label={Words.descriptions} span={3}>
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
            <Tabs type="card" defaultActiveKey="0">
              <TabPane tab={Words.cheque} key="cheque">
                <Row gutter={[0, 15]}>
                  <Col xs={24}>
                    <DetailsTable records={Cheques} columns={cheque_columns} />
                  </Col>
                  <Col xs={24}>
                    <PriceViewer price={price.ChequesAmount} />
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </ModalWindow>
    </>
  );
};

export default CollectorAgentMakeCashDetailsModal;
