import React, { useState } from "react";
import { useMount } from "react-use";
import { Row, Col } from "antd";
import DashboardTile from "../../../common/dashboard-tile";
import {
  MdOutlineRequestQuote as PurchaseRequestIcon,
  MdPriceCheck as InquiryRequestIcon,
  MdReceiptLong as PurchaseCommandIcon,
  MdListAlt as PurchaseOrderIcon,
} from "react-icons/md";
import { TbTruckDelivery as DeliveryIcon } from "react-icons/tb";
import { FaFileInvoiceDollar as InvoiceIcon } from "react-icons/fa";
import { RiToolsFill as ServiceRequestIcon } from "react-icons/ri";
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
    case 306:
      link = "purchase-requests";
      icon = <PurchaseRequestIcon {...iconProps} />;
      backColor = Colors.purple[3];
      break;

    case 307:
      link = "service-requests";
      icon = <ServiceRequestIcon {...iconProps} />;
      backColor = Colors.geekblue[3];
      break;

    case 308:
      link = "inquiry-requests";
      icon = <InquiryRequestIcon {...iconProps} />;
      backColor = Colors.orange[3];
      break;

    case 309:
      link = "invoices";
      icon = <InvoiceIcon {...iconProps} />;
      backColor = Colors.green[3];
      break;

    case 310:
      link = "purchase-commands";
      icon = <PurchaseCommandIcon {...iconProps} />;
      backColor = Colors.volcano[3];
      break;

    case 311:
      link = "purchase-orders";
      icon = <PurchaseOrderIcon {...iconProps} />;
      backColor = Colors.cyan[4];
      break;

    case 312:
      link = "purchase-deliveries";
      icon = <DeliveryIcon {...iconProps} />;
      backColor = Colors.magenta[4];
      break;

    default:
      break;
  }

  return { link, icon, backColor };
};

const LogisticPurchaseDashboard = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);

  useMount(async () => {
    const logistic_purchase_module_id = 32;
    const accessiblePages = await modulesService.accessiblePages(
      logistic_purchase_module_id
    );

    setAccessiblePages(accessiblePages);
  });

  return (
    <Row gutter={[10, 16]}>
      {accessiblePages.map((page) => (
        <Col xs={24} md={8} lg={6} key={page.PageID}>
          <DashboardTile
            to={`purchase/${mapper(page.PageID).link}`}
            icon={mapper(page.PageID).icon}
            backColor={mapper(page.PageID).backColor}
            title={page.PageTitle}
          />
        </Col>
      ))}
    </Row>
  );
};

export default LogisticPurchaseDashboard;
