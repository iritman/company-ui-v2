import React from "react";
import { Typography } from "antd";
import { getSorter } from "../../../../tools/form-manager";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";

const { Text } = Typography;

const getValueField = (type_id) => {
  let value_field = "";

  switch (type_id) {
    case 1:
      value_field = "TextValue";
      break;
    case 2:
      value_field = "IntValue";
      break;
    case 3:
      value_field = "DecimalValue";
      break;
    case 4:
      value_field = "DateValue";
      break;
    default:
      value_field = "TextValue";
      break;
  }

  return value_field;
};

export const getFieldValue = (type_id, record) => {
  let value_filed = getValueField(type_id);
  let result = "";

  if (record) {
    if (type_id !== 4) result = utils.farsiNum(record[value_filed]);
    else result = utils.farsiNum(utils.slashDate(record[value_filed]));
  }

  return result;
};

export const getItemColumns = (featureTypeID) => {
  let columns = [
    // {
    //   title: Words.id,
    //   width: 75,
    //   align: "center",
    //   dataIndex: "ItemID",
    //   sorter: getSorter("ItemID"),
    //   render: (ItemID) => <Text>{utils.farsiNum(`${ItemID}`)}</Text>,
    // },
    {
      title: Words.code,
      width: 120,
      align: "center",
      dataIndex: "ItemCode",
      sorter: getSorter("ItemCode"),
      render: (ItemCode) => (
        <Text
          style={{
            color: Colors.green[6],
          }}
        >
          {ItemCode}
        </Text>
      ),
    },
    {
      title: Words.value,
      width: 100,
      align: "center",
      // Not Work!!!
      //   dataIndex: getValueField(featureTypeID),
      //   sorter: getValueField(featureTypeID),
      render: (record) => (
        <Text
          style={{
            color: Colors.orange[6],
          }}
        >
          {getFieldValue(featureTypeID, record)}
        </Text>
      ),
    },
  ];

  return columns;
};

const codes = {
  getFieldValue,
  getItemColumns,
};

export default codes;
