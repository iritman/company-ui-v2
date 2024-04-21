import React from "react";
import {
  Button,
  Modal,
  Row,
  Col,
  Typography,
  Descriptions,
  Space,
  Alert,
  Tabs,
} from "antd";
import { CheckOutlined as CheckIcon } from "@ant-design/icons";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import DetailsTable from "../../../../common/details-table";
import { getSorter } from "../../../../../tools/form-manager";

const { Text } = Typography;

const getStoresColumns = () => {
  let columns = [
    {
      title: Words.id,
      width: 75,
      align: "center",
      dataIndex: "StoreID",
      sorter: getSorter("StoreID"),
      render: (StoreID) => <Text>{utils.farsiNum(`${StoreID}`)}</Text>,
    },
    {
      title: Words.title,
      width: 120,
      align: "center",
      dataIndex: "Title",
      sorter: getSorter("Title"),
      render: (Title) => (
        <Text
          style={{
            color: Colors.cyan[7],
          }}
        >
          {Title}
        </Text>
      ),
    },
    {
      title: Words.storage_center,
      width: 120,
      align: "center",
      dataIndex: "StorageCenterTitle",
      sorter: getSorter("StorageCenterTitle"),
      render: (StorageCenterTitle) => (
        <Text
          style={{
            color: Colors.orange[7],
          }}
        >
          {StorageCenterTitle}
        </Text>
      ),
    },
    {
      title: Words.status,
      width: 120,
      align: "center",
      dataIndex: "IsActive",
      sorter: getSorter("IsActive"),
      render: (IsActive) => (
        <Text
          style={{
            color: IsActive ? Colors.green[6] : Colors.red[6],
          }}
        >
          {IsActive ? Words.active : Words.inactive}
        </Text>
      ),
    },
  ];

  return columns;
};

const getMeasureUnitsColumns = () => {
  let columns = [
    {
      title: Words.id,
      width: 75,
      align: "center",
      dataIndex: "MeasureUnitID",
      sorter: getSorter("MeasureUnitID"),
      render: (MeasureUnitID) => (
        <Text>{utils.farsiNum(`${MeasureUnitID}`)}</Text>
      ),
    },
    {
      title: Words.measure_unit,
      width: 120,
      align: "center",
      dataIndex: "MeasureUnitTitle",
      sorter: getSorter("MeasureUnitTitle"),
      render: (MeasureUnitTitle) => (
        <Text
          style={{
            color: Colors.red[7],
          }}
        >
          {MeasureUnitTitle}
        </Text>
      ),
    },
    {
      title: Words.measure_type,
      width: 150,
      align: "center",
      dataIndex: "MeasureTypeTitle",
      sorter: getSorter("MeasureTypeTitle"),
      render: (MeasureTypeTitle) => (
        <Text style={{ color: Colors.green[7] }}>{MeasureTypeTitle}</Text>
      ),
    },
    {
      title: Words.default,
      width: 75,
      align: "center",
      dataIndex: "IsDefault",
      sorter: getSorter("IsDefault"),
      render: (IsDefault) => (
        <>{IsDefault && <CheckIcon style={{ color: Colors.green[6] }} />}</>
      ),
    },
  ];

  return columns;
};

const getMeasureConvertsColumns = () => {
  let columns = [
    {
      title: Words.id,
      width: 75,
      align: "center",
      dataIndex: "ConvertID",
      sorter: getSorter("ConvertID"),
      render: (ConvertID) => <Text>{utils.farsiNum(`${ConvertID}`)}</Text>,
    },
    {
      title: Words.from_measure_unit,
      width: 120,
      align: "center",
      dataIndex: "FromUnitTitle",
      sorter: getSorter("FromUnitTitle"),
      render: (FromUnitTitle) => (
        <Text
          style={{
            color: Colors.green[7],
          }}
        >
          {FromUnitTitle}
        </Text>
      ),
    },
    {
      title: Words.to_measure_unit,
      width: 120,
      align: "center",
      dataIndex: "ToUnitTitle",
      sorter: getSorter("ToUnitTitle"),
      render: (ToUnitTitle) => (
        <Text
          style={{
            color: Colors.blue[5],
          }}
        >
          {ToUnitTitle}
        </Text>
      ),
    },
    {
      title: Words.rate,
      width: 150,
      align: "center",
      dataIndex: "Rate",
      sorter: getSorter("Rate"),
      render: (Rate) => (
        <Text style={{ color: Colors.orange[6] }}>{utils.farsiNum(Rate)}</Text>
      ),
    },
    {
      title: Words.tolerance,
      width: 100,
      align: "center",
      dataIndex: "TolerancePercent",
      sorter: getSorter("TolerancePercent"),
      render: (TolerancePercent) => (
        <Text style={{ color: Colors.purple[5] }}>
          {utils.farsiNum(TolerancePercent)}
        </Text>
      ),
    },
  ];

  return columns;
};

const getFeaturesColumns = () => {
  const getFeatureValue = (record) => {
    let result = "";

    switch (record.FeatureTypeID) {
      case 5:
        result = record.StringValue;
        break;
      case 6:
        result = record.BoolValue ? Words.yes : Words.no;
        break;
      default:
        result = record.ItemCode;
        break;
    }

    return result;
  };

  let columns = [
    // {
    //   title: Words.id,
    //   width: 75,
    //   align: "center",
    //   dataIndex: "PFID",
    //   sorter: getSorter("PFID"),
    //   render: (PFID) => <Text>{utils.farsiNum(`${PFID}`)}</Text>,
    // },
    {
      title: Words.feature,
      width: 120,
      align: "center",
      dataIndex: "GroupFeatureTitle",
      sorter: getSorter("GroupFeatureTitle"),
      render: (GroupFeatureTitle) => (
        <Text
          style={{
            color: Colors.green[7],
          }}
        >
          {GroupFeatureTitle}
        </Text>
      ),
    },
    {
      title: Words.value,
      width: 150,
      align: "center",
      // dataIndex: "FeatureValue",
      sorter: getSorter("FeatureValue"),
      render: (record) => (
        <Text style={{ color: Colors.orange[7] }}>
          {utils.farsiNum(getFeatureValue(record))}
        </Text>
      ),
    },
  ];

  return columns;
};

const getInventoryControlAgentsColumns = () => {
  let columns = [
    // {
    //   title: Words.id,
    //   width: 75,
    //   align: "center",
    //   dataIndex: "PAID",
    //   sorter: getSorter("PAID"),
    //   render: (PAID) => <Text>{utils.farsiNum(`${PAID}`)}</Text>,
    // },
    {
      title: Words.title,
      width: 120,
      align: "center",
      dataIndex: "Title",
      sorter: getSorter("Title"),
      render: (Title) => (
        <Text
          style={{
            color: Colors.red[7],
          }}
        >
          {Title}
        </Text>
      ),
    },
    {
      title: Words.value_type,
      width: 75,
      align: "center",
      dataIndex: "FeatureTypeTitle",
      sorter: getSorter("FeatureTypeTitle"),
      render: (FeatureTypeTitle) => (
        <Text
          style={{
            color: Colors.cyan[7],
          }}
        >
          {FeatureTypeTitle}
        </Text>
      ),
    },
  ];

  return columns;
};

const UserProductDetailsModal = ({ product, isOpen, onOk }) => {
  const valueColor = Colors.blue[7];

  const {
    ProductID,
    ProductCode,
    CategoryTitle,
    NatureTitle,
    Title,
    OrderPoint,
    IsBuyable,
    IsSalable,
    IsBuildable,
    IsFixProperty,
    IsSparePart,
    DetailsText,
    BachPatternTitle,
    Stores,
    MeasureUnits,
    MeasureConverts,
    Features,
    InventoryControlAgents,
  } = product;

  const infoTabItems = [
    {
      label: Words.measure_units,
      key: "measure-units",
      children: (
        <Row gutter={[2, 5]}>
          <Col xs={24}>
            <DetailsTable
              records={MeasureUnits}
              columns={getMeasureUnitsColumns()}
            />
          </Col>
        </Row>
      ),
    },
    {
      label: Words.measure_converts,
      key: "measure-converts",
      children: (
        <Row gutter={[2, 5]}>
          <Col xs={24}>
            <DetailsTable
              records={MeasureConverts}
              columns={getMeasureConvertsColumns()}
            />
          </Col>
        </Row>
      ),
    },
    {
      label: Words.features,
      key: "features",
      children: (
        <Row gutter={[2, 5]}>
          <Col xs={24}>
            <DetailsTable records={Features} columns={getFeaturesColumns()} />
          </Col>
        </Row>
      ),
    },
    {
      label: Words.inventory_control_agent,
      key: "inventory-control-agents",
      children: (
        <Row gutter={[2, 5]}>
          <Col xs={24}>
            <DetailsTable
              records={InventoryControlAgents}
              columns={getInventoryControlAgentsColumns()}
            />
          </Col>
        </Row>
      ),
    },
  ];

  const items = [
    {
      label: Words.main_info,
      key: "main-info",
      children: (
        <Row gutter={[2, 5]}>
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
                  {utils.farsiNum(`${ProductID}`)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.product_code}>
                <Text style={{ color: Colors.red[7] }}>
                  {utils.farsiNum(ProductCode)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.product_category}>
                <Text style={{ color: Colors.green[6] }}>{CategoryTitle}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.product_nature}>
                <Text style={{ color: Colors.blue[6] }}>{NatureTitle}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.order_point}>
                <Text style={{ color: Colors.red[6] }}>
                  {utils.farsiNum(OrderPoint)}
                </Text>
              </Descriptions.Item>

              <Descriptions.Item label={Words.status}>
                <Space direction="vertical">
                  {IsBuyable && (
                    <Text style={{ color: Colors.magenta[6] }}>
                      {Words.is_buyable}
                    </Text>
                  )}
                  {IsSalable && (
                    <Text style={{ color: Colors.magenta[6] }}>
                      {Words.is_salable}
                    </Text>
                  )}
                  {IsBuildable && (
                    <Text style={{ color: Colors.magenta[6] }}>
                      {Words.is_buildable}
                    </Text>
                  )}
                  {IsFixProperty && (
                    <Text style={{ color: Colors.magenta[6] }}>
                      {Words.fix_property}
                    </Text>
                  )}
                  {IsSparePart && (
                    <Text style={{ color: Colors.magenta[6] }}>
                      {Words.spare_part}
                    </Text>
                  )}
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col xs={24}>
            <Tabs defaultActiveKey="1" type="card" items={infoTabItems} />
          </Col>
        </Row>
      ),
    },
    {
      label: Words.descriptions,
      key: "descriptions",
      children: (
        <>
          {DetailsText.length > 0 ? (
            <Text
              style={{
                color: Colors.purple[7],
                whiteSpace: "pre-line",
              }}
            >
              {utils.farsiNum(DetailsText)}
            </Text>
          ) : (
            <Alert message={Words.empty_data} type="warning" showIcon />
          )}
        </>
      ),
    },
    {
      label: Words.bach_pattern,
      key: "bach-pattern",
      children: (
        <Text
          style={{
            color: Colors.orange[6],
          }}
        >
          {BachPatternTitle}
        </Text>
      ),
    },
    {
      label: Words.store,
      key: "stores",
      children: (
        <Col xs={24}>
          <DetailsTable records={Stores} columns={getStoresColumns()} />
        </Col>
      ),
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
      width={1050}
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
                      `#${ProductID} - ${Title} (${ProductCode})`
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

export default UserProductDetailsModal;
