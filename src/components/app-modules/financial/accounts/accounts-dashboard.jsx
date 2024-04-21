import React, { useState } from "react";
import { useMount } from "react-use";
import { Row, Col } from "antd";
import DashboardTile from "../../../common/dashboard-tile";
import { FaProjectDiagram as TafsilTypesIcon } from "react-icons/fa";
import {
  MdOutlineAccountTree as TafsilAccountsIcon,
  MdOutlineConstruction as StructureIcon,
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
    case 201:
      link = "account-structures";
      icon = <StructureIcon {...iconProps} />;
      backColor = Colors.purple[3];
      break;

    case 202:
      link = "tafsil-types";
      icon = <TafsilTypesIcon {...iconProps} />;
      backColor = Colors.orange[3];
      break;

    case 203:
      link = "tafsil-accounts";
      icon = <TafsilAccountsIcon {...iconProps} />;
      backColor = Colors.green[3];
      break;

    default:
      break;
  }

  return { link, icon, backColor };
};

const AccountsDashboard = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);

  useMount(async () => {
    const financial_accounts_module_id = 19;
    const accessiblePages = await modulesService.accessiblePages(
      financial_accounts_module_id
    );

    setAccessiblePages(accessiblePages);
  });

  return (
    <Row gutter={[10, 16]}>
      {accessiblePages.map((page) => (
        <Col xs={24} md={8} lg={6} key={page.PageID}>
          <DashboardTile
            to={`accounts/${mapper(page.PageID).link}`}
            icon={mapper(page.PageID).icon}
            backColor={mapper(page.PageID).backColor}
            title={page.PageTitle}
          />
        </Col>
      ))}
    </Row>
  );
};

export default AccountsDashboard;
