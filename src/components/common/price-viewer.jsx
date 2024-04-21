import React from "react";
import { Typography } from "antd";
import Words from "../../resources/words";
import Colors from "../../resources/colors";
import utils from "../../tools/utils";

const { Text } = Typography;

const PriceViewer = ({ price }) => {
  return price === 0 ? (
    <></>
  ) : (
    <Text style={{ color: Colors.blue[7] }}>{`${
      Words.total_price
    }: ${utils.farsiNum(utils.moneyNumber(price))} ${Words.ryal}`}</Text>
  );
};

export default PriceViewer;
