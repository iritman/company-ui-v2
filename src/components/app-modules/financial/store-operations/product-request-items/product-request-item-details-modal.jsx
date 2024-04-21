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
  Popover,
} from "antd";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import { MdInfoOutline as InfoIcon } from "react-icons/md";
import { getSorter, handleError } from "../../../../../tools/form-manager";
import DetailsTable from "../../../../common/details-table";
import ModalWindow from "../../../../common/modal-window";
import service from "../../../../../services/financial/store-operations/product-request-items-service";

const { Text } = Typography;
const valueColor = Colors.blue[7];

const RenderDetails = ({ data }) => {
  const {
    RequestID,
    RequestDate,
    NeededDate,
    FrontSideTypeTitle,
    FrontSideAccountTitle,
    RequestTypeTitle,
    RequestMemberFirstName,
    RequestMemberLastName,
    FromStoreTitle,
    ToStoreTitle,
    StatusID,
    StatusTitle,
    RegFirstName,
    RegLastName,
    RegDate,
    RegTime,
    DetailsText,
  } = data;

  return (
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
      <Descriptions.Item label={Words.request_id}>
        <Text style={{ color: valueColor }}>
          {utils.farsiNum(`${RequestID}`)}
        </Text>
      </Descriptions.Item>
      {/* <Descriptions.Item label={Words.storage_center}>
                <Text style={{ color: valueColor }}>{StorageCenterTitle}</Text>
              </Descriptions.Item> */}
      <Descriptions.Item label={Words.request_date}>
        <Text style={{ color: valueColor }}>
          {utils.farsiNum(utils.slashDate(RequestDate))}
        </Text>
      </Descriptions.Item>
      <Descriptions.Item label={Words.need_date}>
        <Text style={{ color: valueColor }}>
          {utils.farsiNum(utils.slashDate(NeededDate))}
        </Text>
      </Descriptions.Item>
      <Descriptions.Item label={Words.front_side_type}>
        <Text style={{ color: valueColor }}>{FrontSideTypeTitle}</Text>
      </Descriptions.Item>
      <Descriptions.Item label={Words.front_side}>
        <Text style={{ color: valueColor }}>{FrontSideAccountTitle}</Text>
      </Descriptions.Item>
      <Descriptions.Item label={Words.request_type}>
        <Text style={{ color: valueColor }}>{RequestTypeTitle}</Text>
      </Descriptions.Item>
      <Descriptions.Item label={Words.request_member}>
        <Text style={{ color: valueColor }}>
          {`${RequestMemberFirstName} ${RequestMemberLastName}`}
        </Text>
      </Descriptions.Item>
      <Descriptions.Item label={Words.from_store}>
        <Text style={{ color: valueColor }}>{FromStoreTitle}</Text>
      </Descriptions.Item>
      <Descriptions.Item label={Words.to_store}>
        <Text style={{ color: valueColor }}>{ToStoreTitle}</Text>
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
  );
};

const getProductRequestItemsColumns = () => {
  let columns = [
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
      title: Words.product_code,
      width: 150,
      align: "center",
      dataIndex: "ProductCode",
      sorter: getSorter("ProductCode"),
      render: (ProductCode) => (
        <Text style={{ color: Colors.orange[6] }}>
          {utils.farsiNum(ProductCode)}
        </Text>
      ),
    },
    {
      title: Words.product,
      width: 150,
      align: "center",
      dataIndex: "Title",
      sorter: getSorter("Title"),
      render: (Title) => (
        <Text style={{ color: Colors.cyan[6] }}>{utils.farsiNum(Title)}</Text>
      ),
    },
    {
      title: Words.request_count,
      width: 150,
      align: "center",
      dataIndex: "RequestCount",
      sorter: getSorter("RequestCount"),
      render: (RequestCount) => (
        <Text style={{ color: Colors.red[6] }}>
          {utils.farsiNum(RequestCount)}
        </Text>
      ),
    },
    {
      title: Words.measure_unit,
      width: 120,
      align: "center",
      dataIndex: "MeasureUnitTitle",
      sorter: getSorter("MeasureUnitTitle"),
      render: (MeasureUnitTitle) => (
        <Text style={{ color: Colors.grey[6] }}>
          {utils.farsiNum(MeasureUnitTitle)}
        </Text>
      ),
    },
    {
      title: Words.descriptions,
      width: 100,
      align: "center",
      render: (record) => (
        <>
          {record.DetailsText.length > 0 && (
            <Popover content={<Text>{record.DetailsText}</Text>}>
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
      title: Words.status,
      width: 150,
      align: "center",
      dataIndex: "StatusTitle",
      sorter: getSorter("StatusTitle"),
      render: (StatusTitle) => (
        <Text style={{ color: Colors.grey[6] }}>{StatusTitle}</Text>
      ),
    },
  ];

  columns = [
    ...columns,
    {
      title: "",
      fixed: "right",
      align: "center",
      width: 1,
      render: () => <></>,
    },
  ];

  return columns;
};

const ProductRequestItemDetailsModal = ({ requestID, isOpen, onOk }) => {
  const [, setProgress] = useState(false);
  // const [progress, setProgress] = useState(false);
  const [productRequest, setProductRequest] = useState(null);

  useMount(async () => {
    setProgress(true);

    try {
      let data = await service.getInfo(requestID);

      setProductRequest(data);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  });

  const getFooterButtons = () => {
    return (
      <Space>
        <Button key="close-button" onClick={onOk}>
          {Words.close}
        </Button>
      </Space>
    );
  };

  const items = [
    {
      label: Words.product_items,
      key: "product-items",
      children: (
        <Row gutter={[0, 15]}>
          <Col xs={24}>
            <DetailsTable
              records={productRequest?.Items || []}
              columns={getProductRequestItemsColumns()}
            />
          </Col>
        </Row>
      ),
    },
  ];

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
            {productRequest !== null && <RenderDetails data={productRequest} />}
          </Col>
          <Col xs={24}>
            <Tabs type="card" defaultActiveKey="0" items={items} />
          </Col>
        </Row>
      </ModalWindow>
    </>
  );
};

export default ProductRequestItemDetailsModal;
