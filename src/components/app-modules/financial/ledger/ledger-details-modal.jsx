import React from "react";
import { Button, Modal, Row, Col, Typography, Descriptions, Alert } from "antd";
import {
  AiFillLock as LockIcon,
  AiOutlineCheck as CheckIcon,
} from "react-icons/ai";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import { getSorter } from "./../../../../tools/form-manager";
import DetailsTable from "../../../common/details-table";

const { Text } = Typography;

const columns = [
  // {
  //   title: Words.id,
  //   width: 75,
  //   align: "center",
  //   dataIndex: "FeatureID",
  //   sorter: getSorter("FeatureID"),
  //   render: (FeatureID) => <Text>{utils.farsiNum(`${FeatureID}`)}</Text>,
  // },
  {
    title: Words.financial_year,
    width: 120,
    align: "center",
    dataIndex: "YearNo",
    sorter: getSorter("YearNo"),
    render: (YearNo) => (
      <Text
        style={{
          color: Colors.green[6],
        }}
      >
        {utils.farsiNum(`${YearNo}`)}
      </Text>
    ),
  },
  {
    title: Words.start_date,
    width: 100,
    align: "center",
    dataIndex: "StartDate",
    sorter: getSorter("StartDate"),
    render: (StartDate) => (
      <Text
        style={{
          color: Colors.orange[6],
        }}
      >
        {utils.farsiNum(utils.slashDate(StartDate))}
      </Text>
    ),
  },
  {
    title: Words.finish_date,
    width: 100,
    align: "center",
    dataIndex: "FinishDate",
    sorter: getSorter("FinishDate"),
    render: (FinishDate) => (
      <Text
        style={{
          color: Colors.orange[6],
        }}
      >
        {utils.farsiNum(utils.slashDate(FinishDate))}
      </Text>
    ),
  },
  {
    title: Words.status,
    width: 75,
    align: "center",
    sorter: getSorter("IsActive"),
    render: (record) =>
      record.IsActive ? (
        <CheckIcon style={{ color: Colors.green[6] }} />
      ) : (
        <LockIcon style={{ color: Colors.red[6] }} />
      ),
  },
];

const LedgerDetailsModal = ({ selectedObject, isOpen, onOk }) => {
  const valueColor = Colors.blue[7];

  const {
    LedgerID,
    Title,
    IsMainLedger,
    IsDocable,
    DetailsText,
    IsActive,
    FinancialYears,
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
      width={800}
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
                  <Text style={{ fontSize: 14 }}>{utils.farsiNum(Title)}</Text>
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
                    {utils.farsiNum(`${LedgerID}`)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.is_main_ledger}>
                  <Text style={{ color: valueColor }}>
                    {IsMainLedger ? Words.yes : Words.no}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.is_docable_ledger}>
                  <Text style={{ color: valueColor }}>
                    {IsDocable ? Words.yes : Words.no}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={Words.status}>
                  <Text
                    style={{
                      color: IsActive ? Colors.green[6] : Colors.red[6],
                    }}
                  >
                    {IsActive ? Words.active : Words.inactive}
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
            <Col xs={24}>
              {FinancialYears?.length === 0 ? (
                <Col xs={24}>
                  <Alert
                    type="error"
                    showIcon
                    message={
                      <Text style={{ fontSize: 12 }}>
                        {Words.messages.no_financial_year_selected}
                      </Text>
                    }
                  />
                </Col>
              ) : (
                <DetailsTable records={FinancialYears} columns={columns} />
              )}
            </Col>
          </Row>
        </article>
      </section>
    </Modal>
  );
};

export default LedgerDetailsModal;
