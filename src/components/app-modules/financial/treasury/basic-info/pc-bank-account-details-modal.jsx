import React from "react";
import { Button, Modal, Row, Col, Typography, Descriptions, Alert } from "antd";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";

const { Text } = Typography;
const valueColor = Colors.blue[7];

const PersonCompanyBankAccountDetailsModal = ({
  selectedObject,
  isOpen,
  onOk,
}) => {
  const {
    AccountID,
    BankBranchTitle,
    BranchCode,
    BankTitle,
    CityTitle,
    TypeTitle,
    AccountNo,
    ShebaID,
    MemberID,
    FirstName,
    LastName,
    CompanyTitle,
    InBlackList,
    DetailsText,
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
      width={750}
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
                    {utils.farsiNum(
                      MemberID > 0 ? `${FirstName} ${LastName}` : CompanyTitle
                    )}
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
                  <Text style={{ color: Colors.red[6] }}>
                    {utils.farsiNum(`${AccountID}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.city}>
                  <Text style={{ color: Colors.purple[6] }}>{CityTitle}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.bank}>
                  <Text style={{ color: Colors.cyan[6] }}>{BankTitle}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.bank_branch}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(`${BankBranchTitle} (${BranchCode})`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.account_no}>
                  <Text style={{ color: Colors.red[6] }}>
                    {utils.farsiNum(AccountNo)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.sheba_no}>
                  <Text style={{ color: Colors.grey[6] }}>
                    {ShebaID.length > 0 ? utils.farsiNum(ShebaID) : ""}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.doc_type}>
                  <Text style={{ color: valueColor }}>{TypeTitle}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.in_black_list} span={2}>
                  <Text
                    style={{
                      color: InBlackList ? Colors.red[6] : Colors.green[6],
                    }}
                  >
                    {InBlackList ? Words.yes : Words.no}
                  </Text>
                </Descriptions.Item>
                {DetailsText.length > 0 && (
                  <Descriptions.Item label={Words.descriptions} span={2}>
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
          </Row>
        </article>
      </section>
    </Modal>
  );
};

export default PersonCompanyBankAccountDetailsModal;
