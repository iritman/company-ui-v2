import React from "react";
import { Row, Col } from "antd";
import DashboardTile from "../../common/dashboard-tile";
import { CgProfile as ProfileIcon } from "react-icons/cg";
import { RiLockPasswordLine as PasswordIcon } from "react-icons/ri";
import Colors from "../../../resources/colors";
import Words from "./../../../resources/words";

const iconProps = {
  size: 55,
  style: { marginTop: 10 },
};

const UserAccountDashboard = () => {
  return (
    <Row gutter={[10, 16]}>
      <Col xs={24} md={8} lg={6} key="profile">
        <DashboardTile
          to={`account/profile`}
          icon={<ProfileIcon {...iconProps} />}
          backColor={Colors.blue[3]}
          title={Words.profile}
        />
      </Col>
      <Col xs={24} md={8} lg={6} key="change-password">
        <DashboardTile
          to={`account/change-password`}
          icon={<PasswordIcon {...iconProps} />}
          backColor={Colors.red[3]}
          title={Words.change_password}
        />
      </Col>
    </Row>
  );
};

export default UserAccountDashboard;
