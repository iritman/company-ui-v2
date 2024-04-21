import React, { useState } from "react";
import { useMount } from "react-use";
import { Row, Col } from "antd";
import DashboardTile from "../../../common/dashboard-tile";
import { FaProjectDiagram as DocTypesIcon } from "react-icons/fa";
import {
  MdAvTimer as FinancialPeriodsIcon,
  MdOutlineCollectionsBookmark as LedgersIcon,
} from "react-icons/md";
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
    case 210:
      link = "financial-periods";
      icon = <FinancialPeriodsIcon {...iconProps} />;
      backColor = Colors.purple[3];
      break;

    case 211:
      link = "ledgers";
      icon = <LedgersIcon {...iconProps} />;
      backColor = Colors.orange[3];
      break;

    case 212:
      link = "doc-types";
      icon = <DocTypesIcon {...iconProps} />;
      backColor = Colors.green[3];
      break;

    default:
      break;
  }

  return { link, icon, backColor };
};

const LedgerDashboard = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);

  useMount(async () => {
    const financial_ledger_module_id = 22;
    const accessiblePages = await modulesService.accessiblePages(
      financial_ledger_module_id
    );

    setAccessiblePages(accessiblePages);
  });

  return (
    <Row gutter={[10, 16]}>
      {accessiblePages.map((page) => (
        <Col xs={24} md={8} lg={6} key={page.PageID}>
          <DashboardTile
            to={`ledger/${mapper(page.PageID).link}`}
            icon={mapper(page.PageID).icon}
            backColor={mapper(page.PageID).backColor}
            title={page.PageTitle}
          />
        </Col>
      ))}
    </Row>
  );
};

export default LedgerDashboard;
