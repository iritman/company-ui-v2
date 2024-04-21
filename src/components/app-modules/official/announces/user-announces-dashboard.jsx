import React, { useState } from "react";
import { useMount } from "react-use";
import { Row, Col, Typography, Space } from "antd";
import service from "./../../../../services/dashboard/user-dashboard-service";
import { handleError } from "./../../../../tools/form-manager";
import utils from "./../../../../tools/utils";
import Words from "./../../../../resources/words";
import Colors from "./../../../../resources/colors";
import ReloadButton from "../../../common/reload-button";
import StatisticTile from "../../../common/statistic-tile";

const { Text } = Typography;
const link_prefix = "/home/official/announces";

const UserAnnouncesDashboard = () => {
  const [inProgress, setInProgress] = useState(false);
  const [statistics, setStatistics] = useState({
    TotalAnnounces: 0,
    MyAnnounces: 0,
    NewAnnounces: 0,
    ArchivedAnnounces: 0,
  });

  useMount(async () => {
    await loadStatistics();
  });

  const loadStatistics = async () => {
    setInProgress(true);

    try {
      const data = await service.getAnnounceStatistics();

      setStatistics(data);
    } catch (ex) {
      handleError(ex);
    }

    setInProgress(false);
  };

  const { TotalAnnounces, MyAnnounces, NewAnnounces, ArchivedAnnounces } =
    statistics;

  return (
    <Row gutter={[20, 16]}>
      <Col xs={24}>
        <Space>
          <Text
            style={{
              paddingBottom: 20,
              paddingRight: 5,
              fontSize: 18,
            }}
            strong
            type="success"
          >
            {Words.announces}
          </Text>

          <ReloadButton
            tooltip={Words.update}
            inProgress={inProgress}
            onClick={loadStatistics}
          />
        </Space>
      </Col>
      <Col xs={12} md={6}>
        <StatisticTile
          linkPrefix={link_prefix}
          link=""
          inProgress={inProgress}
          title={Words.total}
          value={TotalAnnounces > 0 ? utils.farsiNum(TotalAnnounces) : "-"}
          color={Colors.green[6]}
        />
      </Col>
      <Col xs={12} md={6}>
        <StatisticTile
          linkPrefix={link_prefix}
          link="new-announces"
          inProgress={inProgress}
          title={Words.new_announces}
          value={NewAnnounces > 0 ? utils.farsiNum(NewAnnounces) : "-"}
          color={Colors.purple[6]}
        />
      </Col>
      <Col xs={12} md={6}>
        <StatisticTile
          linkPrefix={link_prefix}
          link="archived-announces"
          inProgress={inProgress}
          title={Words.archived_announces}
          value={
            ArchivedAnnounces > 0 ? utils.farsiNum(ArchivedAnnounces) : "-"
          }
          color={Colors.red[6]}
        />
      </Col>
      <Col xs={12} md={6}>
        <StatisticTile
          linkPrefix={link_prefix}
          link="my-announces"
          inProgress={inProgress}
          title={Words.my_announces}
          value={MyAnnounces > 0 ? utils.farsiNum(MyAnnounces) : "-"}
          color={Colors.blue[6]}
        />
      </Col>
    </Row>
  );
};

export default UserAnnouncesDashboard;
