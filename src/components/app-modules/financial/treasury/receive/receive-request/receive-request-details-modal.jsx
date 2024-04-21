import React, { useState } from "react";
import { useMount } from "react-use";
import {
  Button,
  Row,
  Col,
  Typography,
  Descriptions,
  Alert,
  Popover,
  Space,
  Popconfirm,
} from "antd";
import { MdInfoOutline as InfoIcon } from "react-icons/md";
import { QuestionCircleOutlined as QuestionIcon } from "@ant-design/icons";
import Words from "../../../../../../resources/words";
import Colors from "../../../../../../resources/colors";
import utils from "../../../../../../tools/utils";
import { getSorter } from "../../../../../../tools/form-manager";
import DetailsTable from "../../../../../common/details-table";
import ModalWindow from "../../../../../common/modal-window";
import service from "../../../../../../services/financial/treasury/receive/receive-requests-service";
import { handleError } from "../../../../../../tools/form-manager";

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
    dataIndex: "ReceiveTypeTitle",
    sorter: getSorter("ReceiveTypeTitle"),
    render: (ReceiveTypeTitle) => (
      <Text style={{ color: Colors.magenta[6] }}> {ReceiveTypeTitle}</Text>
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
    title: Words.receive_date,
    width: 100,
    align: "center",
    dataIndex: "ReceiveDate",
    sorter: getSorter("ReceiveDate"),
    render: (ReceiveDate) => (
      <Text
        style={{
          color: Colors.orange[6],
        }}
      >
        {utils.farsiNum(utils.slashDate(ReceiveDate))}
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
              <Text>
                {utils.getDescription(
                  record.StandardDetailsText,
                  record.DetailsText
                )}
              </Text>
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
];

const ReceiveRequestDetailsModal = ({
  selectedObject,
  isOpen,
  onOk,
  onUndoApprove,
}) => {
  const valueColor = Colors.blue[7];

  const [progress, setProgress] = useState(false);
  const [hasUndoApproveAccess, setHasUndoApproveAccess] = useState(false);

  const {
    RequestID,
    // FrontSideAccountID,
    FrontSideAccountTitle,
    TafsilCode,
    TafsilTypeTitle,
    // CurrencyID,
    CurrencyTitle,
    ReceiveDate,
    // StandardDetailsID,
    StandardDetailsText,
    DetailsText,
    // BaseTypeID,
    // BaseTypeTitle,
    // RequestableBalance,
    // BaseDocID,
    // SettlementDate,
    StatusID,
    StatusTitle,
    Items,
  } = selectedObject;

  useMount(async () => {
    setProgress(true);

    try {
      //------ load request params

      let data = await service.getParams();

      let { HasUndoApproveAccess } = data;

      setHasUndoApproveAccess(HasUndoApproveAccess);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  });

  const getFooterButtons = () => {
    return (
      <Space>
        {selectedObject !== null && selectedObject.StatusID === 2 && (
          <>
            {hasUndoApproveAccess && !selectedObject.IsReceiveBase && (
              <Popconfirm
                title={Words.questions.sure_to_undo_approve_receive_request}
                onConfirm={onUndoApprove}
                okText={Words.yes}
                cancelText={Words.no}
                icon={<QuestionIcon style={{ color: "red" }} />}
                key="undo-approve-confirm"
                disabled={progress}
              >
                <Button
                  key="undo-approve-button"
                  type="primary"
                  disabled={progress}
                >
                  {Words.undo_approve}
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

  let account_title = utils.farsiNum(
    `${TafsilCode} - ${FrontSideAccountTitle} [${TafsilTypeTitle}]`
  );

  return (
    <ModalWindow
      isOpen={isOpen}
      title={Words.more_details}
      footer={getFooterButtons()}
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
                message={<Text style={{ fontSize: 14 }}>{account_title}</Text>}
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
                <Descriptions.Item label={Words.receive_date}>
                  <Text style={{ color: valueColor }}>
                    {utils.farsiNum(utils.slashDate(ReceiveDate))}
                  </Text>
                </Descriptions.Item>
                {/* <Descriptions.Item label={Words.receive_base}>
                  <Text
                    style={{
                      color: Colors.cyan[6],
                    }}
                  >
                    {BaseTypeTitle}
                  </Text>
                </Descriptions.Item> */}
                {/* <Descriptions.Item label={Words.settlement_date}>
                  <Text style={{ color: valueColor }}>
                    {SettlementDate.length > 0
                      ? utils.farsiNum(utils.slashDate(SettlementDate))
                      : "-"}
                  </Text>
                </Descriptions.Item> */}
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
                emptyDataMessage={Words.no_receive_item}
              />
            </Col>
          </Row>
        </article>
      </section>
    </ModalWindow>
  );
};

export default ReceiveRequestDetailsModal;
