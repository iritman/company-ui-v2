import React, { useState } from "react";
import { useMount } from "react-use";
import { Row, Col } from "antd";
import DashboardTile from "../../../common/dashboard-tile";
import {
  TbBuildingBank as StoresIcon,
  // TbBrandCodesandbox as MeasureTypeIcon,
  // TbRuler2 as MeasureUnitIcon,
  // TbReportMoney as PricingTypeIcon,
  // TbShape2 as BachPatternIcon,
} from "react-icons/tb";
// import { CgListTree as CategoryIcon } from "react-icons/cg";
// import { AiOutlineControl as InventoryControlAgentIcon } from "react-icons/ai";
import { FaReceipt as ItemsIcon } from "react-icons/fa";
// import {
//   MdOutlineFeaturedPlayList as FeatureIcon,
//   MdDonutSmall as ProductIcon,
//   MdOutlineStorage as StorageIcon,
//   MdOutlineFeaturedPlayList as FeaturesIcon,
// } from "react-icons/md";
// import { AiOutlineDeploymentUnit as NatureIcon } from "react-icons/ai";
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
    case 280:
      link = "product-requests";
      icon = <StoresIcon {...iconProps} />;
      backColor = Colors.orange[3];
      break;

    case 281:
      link = "product-request-items";
      icon = <ItemsIcon {...iconProps} />;
      backColor = Colors.green[3];
      break;

    // case 143:
    //   link = "user-measure-types";
    //   icon = <MeasureTypeIcon {...iconProps} />;
    //   backColor = Colors.blue[3];
    //   break;

    // case 144:
    //   link = "user-measure-units";
    //   icon = <MeasureUnitIcon {...iconProps} />;
    //   backColor = Colors.cyan[3];
    //   break;

    // case 145:
    //   link = "user-pricing-types";
    //   icon = <PricingTypeIcon {...iconProps} />;
    //   backColor = Colors.purple[3];
    //   break;

    // case 146:
    //   link = "user-product-categories";
    //   icon = <CategoryIcon {...iconProps} />;
    //   backColor = Colors.magenta[3];
    //   break;

    // case 147:
    //   link = "user-features";
    //   icon = <FeatureIcon {...iconProps} />;
    //   backColor = Colors.lime[4];
    //   break;

    // case 148:
    //   link = "user-products";
    //   icon = <ProductIcon {...iconProps} />;
    //   backColor = Colors.volcano[3];
    //   break;

    // case 149:
    //   link = "user-inventory-control-agents";
    //   icon = <InventoryControlAgentIcon {...iconProps} />;
    //   backColor = Colors.red[3];
    //   break;

    // case 150:
    //   link = "user-bach-patterns";
    //   icon = <BachPatternIcon {...iconProps} />;
    //   backColor = Colors.cyan[3];
    //   break;

    // case 151:
    //   link = "user-baches";
    //   icon = <BachIcon {...iconProps} />;
    //   backColor = Colors.geekblue[3];
    //   break;

    // case 152:
    //   link = "user-storage-centers";
    //   icon = <StorageIcon {...iconProps} />;
    //   backColor = Colors.magenta[4];
    //   break;

    // case 153:
    //   link = "user-group-features";
    //   icon = <FeaturesIcon {...iconProps} />;
    //   backColor = Colors.yellow[6];
    //   break;

    default:
      break;
  }

  return { link, icon, backColor };
};

const UserStoreOperationsDashboard = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);

  useMount(async () => {
    const store_operations_module_id = 16;
    const accessiblePages = await modulesService.accessiblePages(
      store_operations_module_id
    );

    setAccessiblePages(accessiblePages);
  });

  return (
    <Row gutter={[10, 16]}>
      {accessiblePages.map((page) => (
        <Col xs={24} md={8} lg={6} key={page.PageID}>
          <DashboardTile
            to={`store-opr/${mapper(page.PageID).link}`}
            icon={mapper(page.PageID).icon}
            backColor={mapper(page.PageID).backColor}
            title={page.PageTitle}
          />
        </Col>
      ))}
    </Row>
  );
};

export default UserStoreOperationsDashboard;
