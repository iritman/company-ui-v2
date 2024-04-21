import React from "react";
import { Card, Statistic } from "antd";
import { Link } from "react-router-dom";

const StatisticTile = (props) => {
  const { title, value, color, linkPrefix, link, inProgress } = props;

  //   const link_prefix = "/home/official/tasks";

  return (
    <Card loading={inProgress} hoverable style={{ height: "100%" }}>
      <Link to={`${linkPrefix}/${link}`}>
        <Statistic
          title={title}
          value={value}
          valueStyle={{
            color,
          }}
          // prefix={icon}
        />
      </Link>
    </Card>
  );
};

export default StatisticTile;
