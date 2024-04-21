import React from "react";
import { Button, Row, Col, Typography, Descriptions } from "antd";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import { getColumns } from "./voucher-details-modal-code";
import { calculatePrice } from "./voucher-modal-code";
import ModalWindow from "../../../../common/modal-window";
import DetailsTable from "../../../../common/details-table";

const { Text } = Typography;

const VoucherDetailsModal = ({ selectedObject, isOpen, onOk }) => {
  const valueColor = Colors.blue[7];

  const {
    VoucherID,
    VoucherNo,
    SubNo,
    // DocTypeID,
    DocTypeTitle,
    VoucherDate,
    // StandardDetailsID,
    StandardDetailsText,
    DetailsText,
    // StatusID,
    StatusTitle,
    // RegMemberID,
    RegFirstName,
    RegLastName,
    RegDate,
    RegTime,
    // TotalAmount,
    Items,
    // Logs,
  } = selectedObject;

  const price = calculatePrice(selectedObject);

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
      width={1700}
    >
      <Row gutter={[10, 10]}>
        <Col xs={24}>
          <Descriptions
            bordered
            column={{
              //   md: 2, sm: 2,
              lg: 3,
              md: 3,
              xs: 1,
            }}
            size="middle"
          >
            <Descriptions.Item label={Words.voucher_id}>
              <Text style={{ color: valueColor }}>
                {utils.farsiNum(`${VoucherID}`)}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label={Words.voucher_no}>
              <Text style={{ color: valueColor }}>
                {utils.farsiNum(`${VoucherNo}`)}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label={Words.sub_no}>
              <Text style={{ color: valueColor }}>
                {utils.farsiNum(`${SubNo}`)}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label={Words.doc_type}>
              <Text style={{ color: Colors.cyan[6] }}>{DocTypeTitle}</Text>
            </Descriptions.Item>
            <Descriptions.Item label={Words.voucher_date}>
              <Text style={{ color: Colors.orange[6] }}>
                {utils.farsiNum(utils.slashDate(VoucherDate))}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label={Words.status} span={2}>
              <Text style={{ color: valueColor }}>{StatusTitle}</Text>
            </Descriptions.Item>
            <Descriptions.Item label={Words.reg_member}>
              <Text
                style={{ color: valueColor }}
              >{`${RegFirstName} ${RegLastName}`}</Text>
            </Descriptions.Item>
            <Descriptions.Item label={Words.reg_date_time} span={2}>
              <Text style={{ color: valueColor }}>
                {utils.farsiNum(
                  `${utils.slashDate(RegDate)} - ${utils.colonTime(RegTime)}`
                )}
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
              <Descriptions.Item label={Words.standard_description} span={3}>
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
          <DetailsTable records={Items} columns={getColumns()} />
        </Col>
        <Col xs={24}>
          <Descriptions
            bordered
            column={{
              //   md: 2, sm: 2,
              lg: 3,
              md: 3,
              xs: 1,
            }}
            size="middle"
          >
            <Descriptions.Item label={Words.total_bedehkar}>
              <Text
                style={{
                  color: Colors.red[6],
                }}
              >
                {`${utils.farsiNum(utils.moneyNumber(price.Bedehkar))} ${
                  Words.ryal
                }`}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label={Words.total_bestankar} span={2}>
              <Text
                style={{
                  color: Colors.green[6],
                }}
              >
                {`${utils.farsiNum(utils.moneyNumber(price.Bestankar))} ${
                  Words.ryal
                }`}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label={Words.remained_bedehkar}>
              <Text
                style={{
                  color: Colors.red[6],
                }}
              >
                {`${utils.farsiNum(
                  utils.moneyNumber(price.RemainedBedehkar)
                )} ${Words.ryal}`}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label={Words.remained_bestankar} span={2}>
              <Text
                style={{
                  color: Colors.green[6],
                }}
              >
                {`${utils.farsiNum(
                  utils.moneyNumber(price.RemainedBestankar)
                )} ${Words.ryal}`}
              </Text>
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </ModalWindow>
  );
};

export default VoucherDetailsModal;
