import React from "react";
import {
  Button,
  Modal,
  Row,
  Col,
  Typography,
  Descriptions,
  Alert,
  Tabs,
  Space,
} from "antd";
import {
  AiFillLock as LockIcon,
  AiOutlineCheck as CheckIcon,
} from "react-icons/ai";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import TafsilInfoViewer from "./../../../../common/tafsil-info-viewer";

const { Text } = Typography;
const valueColor = Colors.blue[7];

const FundDetailsModal = ({ selectedObject, isOpen, onOk }) => {
  const {
    FundID,
    // Title,
    // FunderMemberID,
    FunderFirstName,
    FunderLastName,
    EstablishDate,
    // CurrencyID,
    CurrencyTitle,
    InitialInventory,
    MaxInventory,
    // StandardDetailsID,
    DetailsText,
    IsActive,
    TafsilInfo,
  } = selectedObject;

  const items = [
    {
      label: Words.info,
      key: "info",
      children: (
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
          <Descriptions.Item label={Words.funder_member}>
            <Text style={{ color: Colors.cyan[6] }}>
              {`${FunderFirstName} ${FunderLastName}`}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.establish_date}>
            <Text style={{ color: Colors.green[6] }}>
              {utils.farsiNum(utils.slashDate(EstablishDate))}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.currency}>
            <Text style={{ color: Colors.magenta[6] }}>{CurrencyTitle}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.status}>
            <Space>
              {IsActive ? (
                <CheckIcon style={{ color: Colors.green[6] }} />
              ) : (
                <LockIcon style={{ color: Colors.red[6] }} />
              )}

              <Text style={{ color: valueColor }}>
                {`${IsActive ? Words.active : Words.inactive} `}
              </Text>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label={Words.initial_inventory}>
            <Text style={{ color: Colors.orange[6] }}>
              {`${utils.farsiNum(utils.moneyNumber(InitialInventory))} ${
                Words.ryal
              }`}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.max_inventory}>
            <Text style={{ color: Colors.orange[6] }}>
              {`${utils.farsiNum(utils.moneyNumber(MaxInventory))} ${
                Words.ryal
              }`}
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
      ),
    },
    {
      label: Words.tafsil_account,
      key: "tafsil-account",
      children: <TafsilInfoViewer tafsilInfo={TafsilInfo} />,
    },
  ];

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
                      `#${FundID} - ${FunderFirstName} ${FunderLastName}`
                    )}
                  </Text>
                }
                type="info"
              />
            </Col>
            <Col xs={24}>
              <Tabs defaultActiveKey="1" type="card" items={items} />
            </Col>
          </Row>
        </article>
      </section>
    </Modal>
  );
};

export default FundDetailsModal;
