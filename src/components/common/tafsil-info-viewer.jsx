import React from "react";
import { Typography, Descriptions, Alert } from "antd";
import Words from "../../resources/words";
import Colors from "../../resources/colors";
import utils from "../../tools/utils";

const { Text } = Typography;
const valueColor = Colors.blue[7];

const TafsilInfoViewer = ({ tafsilInfo }) => {
  const { TafsilAccountID, TafsilCode, TafsilTypeTitle, TafsilAccountTitle } =
    tafsilInfo;

  return (
    <>
      {tafsilInfo.length === 0 ? (
        <Alert
          message={Words.messages.no_tafsil_account}
          type="warning"
          showIcon
        />
      ) : (
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
          <Descriptions.Item label={Words.tafsil_id}>
            <Text style={{ color: Colors.red[6] }}>
              {utils.farsiNum(`${TafsilAccountID}`)}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.tafsil_code}>
            <Text style={{ color: Colors.cyan[6] }}>
              {utils.farsiNum(TafsilCode)}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.tafsil_type}>
            <Text style={{ color: valueColor }}>{TafsilTypeTitle}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.title}>
            <Text style={{ color: valueColor }}>
              {utils.farsiNum(TafsilAccountTitle)}
            </Text>
          </Descriptions.Item>
        </Descriptions>
      )}
    </>
  );
};

export default TafsilInfoViewer;
