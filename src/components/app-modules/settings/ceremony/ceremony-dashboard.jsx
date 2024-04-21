import React, { useState } from "react";
import { useMount } from "react-use";
import { Row, Col } from "antd";
import DashboardTile from "../../../common/dashboard-tile";
import { BsPersonLinesFill as ClientTypeIcon } from "react-icons/bs";
import { MdLocationOn as LocationIcon } from "react-icons/md";
import Colors from "../../../../resources/colors";
import modulesService from "../../../../services/app/modules-service";

const iconProps = {
  size: 55,
  style: { marginTop: 10 },
};

const mapper = (pageID) => {
  let link = "";
  let icon = null;
  let backColor = Colors.blue[3];

  switch (pageID) {
    case 121:
      link = "client-types";
      icon = <ClientTypeIcon {...iconProps} />;
      backColor = Colors.green[3];
      break;

    case 122:
      link = "session-locations";
      icon = <LocationIcon {...iconProps} />;
      backColor = Colors.orange[3];
      break;

    default:
      break;
  }

  return { link, icon, backColor };
};

const CeremonyDashboard = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);

  useMount(async () => {
    const ceremony_module_id = 11;
    const accessiblePages = await modulesService.accessiblePages(
      ceremony_module_id
    );

    setAccessiblePages(accessiblePages);
  });

  return (
    <Row gutter={[10, 16]}>
      {accessiblePages.map((page) => (
        <Col xs={24} md={8} lg={6} key={page.PageID}>
          <DashboardTile
            to={`ceremony/${mapper(page.PageID).link}`}
            icon={mapper(page.PageID).icon}
            backColor={mapper(page.PageID).backColor}
            title={page.PageTitle}
          />
        </Col>
      ))}
    </Row>
  );
};

export default CeremonyDashboard;
