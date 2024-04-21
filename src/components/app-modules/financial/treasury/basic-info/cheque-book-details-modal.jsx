import React from "react";
import { Button, Modal, Row, Col, Typography, Descriptions, Tabs } from "antd";
import { getSorter } from "../../../../../tools/form-manager";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import DetailsTable from "../../../../common/details-table";

const { Text } = Typography;
const valueColor = Colors.blue[7];

const columns = [
  {
    title: Words.id,
    width: 75,
    align: "center",
    dataIndex: "CompanyChequeID",
    sorter: getSorter("CompanyChequeID"),
    render: (CompanyChequeID) => (
      <Text>{utils.farsiNum(`${CompanyChequeID}`)}</Text>
    ),
  },
  {
    title: Words.cheque_no,
    width: 150,
    align: "center",
    dataIndex: "ChequeNo",
    sorter: getSorter("ChequeNo"),
    render: (ChequeNo) => (
      <Text
        style={{
          color: Colors.green[6],
        }}
      >
        {utils.farsiNum(`${ChequeNo}`)}
      </Text>
    ),
  },
  // {
  //   title: Words.sayad_no,
  //   width: 150,
  //   align: "center",
  //   dataIndex: "SayadNo",
  //   sorter: getSorter("SayadNo"),
  //   render: (SayadNo) => (
  //     <Text
  //       style={{
  //         color: Colors.blue[6],
  //       }}
  //     >
  //       {SayadNo.length > 0 ? utils.farsiNum(`${SayadNo}`) : ""}
  //     </Text>
  //   ),
  // },
  {
    title: Words.status,
    width: 120,
    align: "center",
    dataIndex: "StatusTitle",
    sorter: getSorter("StatusTitle"),
    render: (StatusTitle) => <Text>{StatusTitle}</Text>,
  },
];

const ChequeBookDetailsModal = ({ selectedObject, isOpen, onOk }) => {
  const {
    ChequeBookID,
    AccountNo,
    BankBranchTitle,
    BranchCode,
    BankTitle,
    Series,
    TotalPages,
    StartSerialNo,
    IssueDate,
    CashBoxTitle,
    IsSayad,
    RemainedPages,
    FirstUsableSerialNo,
    Cheques,
    // AccountID,
    // BankID,
    // CashBoxID,
  } = selectedObject;

  return (
    <Modal
      open={isOpen}
      maskClosable={false}
      centered={true}
      title={Words.more_details}
      footer={[
        <Button key="close-button" onClick={onOk}>
          {Words.close}
        </Button>,
      ]}
      onCancel={onOk}
      width={850}
    >
      <section>
        <article
          id="info-content"
          className="scrollbar-normal"
          style={{ maxHeight: "calc(100vh - 180px)" }}
        >
          <Row gutter={[10, 10]}>
            <Col xs={24}>
              <Tabs defaultActiveKey="1">
                <Tabs.TabPane
                  tab={Words.cheque_book_info}
                  key="cheque_book_info"
                >
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
                        {utils.farsiNum(ChequeBookID)}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label={Words.account_no}>
                      <Text style={{ color: valueColor }}>
                        {utils.farsiNum(AccountNo)}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label={Words.bank}>
                      <Text style={{ color: valueColor }}>{BankTitle}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label={Words.bank_branch}>
                      <Text style={{ color: valueColor }}>
                        {utils.farsiNum(`${BankBranchTitle} (${BranchCode})}`)}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label={Words.cheque_book_series}>
                      <Text style={{ color: valueColor }}>
                        {utils.farsiNum(Series)}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label={Words.total_pages}>
                      <Text style={{ color: Colors.magenta[6] }}>
                        {utils.farsiNum(TotalPages)}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label={Words.start_serial_no}>
                      <Text style={{ color: valueColor }}>
                        {utils.farsiNum(StartSerialNo)}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label={Words.issue_date}>
                      <Text style={{ color: valueColor }}>
                        {utils.farsiNum(utils.slashDate(IssueDate))}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label={Words.cash_box}>
                      <Text style={{ color: valueColor }}>{CashBoxTitle}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label={Words.sayad_cheque}>
                      <Text
                        style={{
                          color: IsSayad ? Colors.green[6] : Colors.red[6],
                        }}
                      >
                        {`${IsSayad ? Words.yes : Words.no} `}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label={Words.remained_pages}>
                      <Text style={{ color: Colors.red[6] }}>
                        {utils.farsiNum(RemainedPages)}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label={Words.first_usable_serial_no}>
                      <Text style={{ color: Colors.cyan[6] }}>
                        {utils.farsiNum(FirstUsableSerialNo)}
                      </Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Tabs.TabPane>
                <Tabs.TabPane tab={Words.cheque_items} key="cheque_items">
                  <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
                    <Col xs={24}>
                      <DetailsTable records={Cheques} columns={columns} />
                    </Col>
                  </Row>
                </Tabs.TabPane>
              </Tabs>
            </Col>
          </Row>
        </article>
      </section>
    </Modal>
  );
};

export default ChequeBookDetailsModal;
