import React from "react";
import { Col, Descriptions, Row, Tabs, Button } from "antd";
import AntdModal from "../../../../antd-form-components/AntdModal";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import {
  getItem,
  getDescriptionsItem,
  LabelType,
} from "../../../../antd-general-components/Label";
import DetailsTable from "../../../../common/details-table";
import { getItemsColumns } from "./ProductRequestModalCode";

const valueColor = Colors.blue[7];

const ProductRequestDetailsModal = ({
  open,
  selectedObject,
  //   onOk,
  onCancel,
}) => {
  const {
    RequestID,
    //   StorageCenterID,
    // StorageCenterTitle,
    FrontSideTypeID,
    FrontSideTypeTitle,
    FrontSideAccountID,
    FrontSideAccountTitle,
    // RegMemberID,
    RegFirstName,
    RegLastName,
    RequestDate,
    NeededDate,
    RequestMemberID,
    RequestMemberFirstName,
    RequestMemberLastName,
    // RequestTypeID,
    RequestTypeTitle,
    // FromStoreID,
    FromStoreTitle,
    // ToStoreID,
    ToStoreTitle,
    StatusID,
    StatusTitle,
    // TafsilCode,
    // TafsilTypeID,
    // TafsilTypeTitle,
    RegDate,
    RegTime,
    DetailsText,
    Items,
  } = selectedObject;

  const items = [
    {
      label: Words.product_items,
      key: "list-items",
      children: (
        <Row gutter={[0, 15]}>
          <Col xs={24}>
            <DetailsTable records={Items} columns={getItemsColumns()} />
          </Col>
        </Row>
      ),
    },
  ];

  const details_items = [
    getItem(Words.id, valueColor, RequestID),
    getItem(Words.request_date, valueColor, RequestDate, {
      type: LabelType.date,
    }),
    getItem(Words.need_date, valueColor, NeededDate, {
      type: LabelType.date,
    }),
    getItem(Words.front_side_type, valueColor, FrontSideTypeTitle),
    getItem(Words.front_side, valueColor, FrontSideAccountTitle),
    getItem(Words.request_type, valueColor, RequestTypeTitle),
    getItem(
      Words.request_member,
      valueColor,
      `${RequestMemberFirstName} ${RequestMemberLastName}`
    ),
    getItem(Words.from_store, valueColor, FromStoreTitle),
    getItem(Words.to_store, valueColor, ToStoreTitle),
    getItem(Words.status, valueColor, StatusTitle),
    getItem(Words.reg_member, valueColor, `${RegFirstName} ${RegLastName}`),
    getItem(Words.reg_date_time, valueColor, null, {
      type: LabelType.date_time,
      date: RegDate,
      time: RegTime,
    }),
    getDescriptionsItem(Words.descriptions, valueColor, DetailsText),
  ];

  // --------------------

  const getFooterButtons = () => {
    return (
      <Button key="close-button" onClick={onCancel}>
        {Words.close}
      </Button>
    );
  };

  // --------------------

  return (
    <AntdModal
      open={open}
      initialValues={selectedObject}
      title={Words.more_details}
      progress={false}
      width={1050}
      footer={getFooterButtons}
      onCancel={onCancel}
    >
      <Row gutter={[10, 10]}>
        <Col xs={24}>
          <Descriptions
            bordered
            column={{
              lg: 3,
              md: 2,
              xs: 1,
            }}
            size="middle"
            items={details_items}
          />
        </Col>
        <Col xs={24}>
          <Tabs type="card" defaultActiveKey="0" items={items} />
        </Col>
      </Row>
    </AntdModal>
  );
};

export default ProductRequestDetailsModal;
