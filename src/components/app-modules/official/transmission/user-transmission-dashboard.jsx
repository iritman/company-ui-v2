import React, { useState } from "react";
import { useMount } from "react-use";
import { Row, Col, Typography, Alert } from "antd";
import service from "../../../../services/official/transmission/user-transmission-requests-service";
import { handleError } from "./../../../../tools/form-manager";
import Words from "./../../../../resources/words";
import utils from "./../../../../tools/utils";
import LinkButton from "../../../common/link-button";
import ReloadButton from "../../../common/reload-button";

const { Text } = Typography;

const UserTransmissionDashboard = () => {
  const [inProgress, setInProgress] = useState(false);
  const [newRequestsCount, setNewRequestsCount] = useState(0);

  useMount(async () => {
    await loadNewRequests();
  });

  const loadNewRequests = async () => {
    setInProgress(true);

    try {
      const data = await service.getNewRequestsCount();

      setNewRequestsCount(data.NewRequests);
    } catch (ex) {
      handleError(ex);
    }

    setInProgress(false);
  };

  return (
    <Row gutter={[10, 16]}>
      <Col xs={24}>
        <Text
          style={{
            paddingBottom: 20,
            paddingRight: 5,
            fontSize: 18,
          }}
          strong
          type="success"
        >
          {Words.transmission}
        </Text>
      </Col>
      <Col xs={24}>
        {newRequestsCount > 0 ? (
          <Alert
            showIcon
            message={
              <Text>
                {utils.farsiNum(
                  Words.messages.num_of_new_requests_submitted.replace(
                    "#",
                    newRequestsCount
                  )
                )}
              </Text>
            }
            type="info"
            action={
              <LinkButton title={Words.view} link="transmission-requests" />
            }
          />
        ) : (
          <Alert
            showIcon
            message={Words.messages.no_new_requests}
            type="warning"
            action={
              <ReloadButton
                tooltip={Words.update}
                inProgress={inProgress}
                onClick={loadNewRequests}
              />
            }
          />
        )}
      </Col>
    </Row>
  );
};

export default UserTransmissionDashboard;
