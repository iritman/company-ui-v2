import React, { useState } from "react";
import { useMount } from "react-use";
import { Row, Col } from "antd";
import DashboardTile from "../../../../common/dashboard-tile";
import {
  MdSouthWest as ReceiveIcon,
  MdReceiptLong as ReceiptIcon,
} from "react-icons/md";
import { TbTransferIn as HandOverIcon } from "react-icons/tb";
import { GiReceiveMoney as CollectionRejectionIcon } from "react-icons/gi";
import Colors from "../../../../../resources/colors";
import modulesService from "../../../../../services/app/modules-service";

const iconProps = {
  size: 55,
  style: { marginTop: 10 },
};

const mapper = (pageID) => {
  let link = "";
  let icon = null;
  let backColor = Colors.blue[3];

  switch (pageID) {
    case 241:
      link = "receive-requests";
      icon = <ReceiveIcon {...iconProps} />;
      backColor = Colors.blue[3];
      break;

    case 242:
      link = "receive-receipts";
      icon = <ReceiptIcon {...iconProps} />;
      backColor = Colors.cyan[3];
      break;

    case 243:
      link = "bank-hand-overs";
      icon = <HandOverIcon {...iconProps} />;
      backColor = Colors.purple[3];
      break;

    case 244:
      link = "collection-rejections";
      icon = <CollectionRejectionIcon {...iconProps} />;
      backColor = Colors.orange[3];
      break;

    default:
      break;
  }

  return { link, icon, backColor };
};

const TreasuryReceiveDashboard = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);

  useMount(async () => {
    const financial_treasury_receive_module_id = 24;
    const accessiblePages = await modulesService.accessiblePages(
      financial_treasury_receive_module_id
    );

    setAccessiblePages(accessiblePages);
  });

  return (
    <Row gutter={[10, 16]}>
      {accessiblePages.map((page) => (
        <Col xs={24} md={8} lg={6} key={page.PageID}>
          <DashboardTile
            to={`receive/${mapper(page.PageID).link}`}
            icon={mapper(page.PageID).icon}
            backColor={mapper(page.PageID).backColor}
            title={page.PageTitle}
          />
        </Col>
      ))}
    </Row>
  );
};

export default TreasuryReceiveDashboard;
