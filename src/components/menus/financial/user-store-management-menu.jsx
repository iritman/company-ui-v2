import React, { useState, useEffect } from "react";
import {
  AiOutlineDeploymentUnit as NatureIcon,
  AiOutlineControl as InventoryControlAgentIcon,
} from "react-icons/ai";
import {
  TbBuildingBank as StoresIcon,
  TbBrandCodesandbox as MeasureTypeIcon,
  TbRuler2 as MeasureUnitIcon,
  TbReportMoney as PricingTypeIcon,
  TbShape2 as BachPatternIcon,
} from "react-icons/tb";
import { CgListTree as CategoryIcon } from "react-icons/cg";
import { FaBarcode as BachIcon } from "react-icons/fa";
import {
  MdOutlineFeaturedPlayList as FeatureIcon,
  MdDonutSmall as ProductIcon,
  MdOutlineStorage as StorageIcon,
  MdOutlineFeaturedPlayList as FeaturesIcon,
} from "react-icons/md";
import { useMount } from "react-use";
import modulesService from "../../../services/app/modules-service";
import Colors from "../../../resources/colors";
import { useLocation } from "react-router-dom";
import ModuleMenu from "../module-menu";
import Words from "../../../resources/words";

const iconSize = 20;

const mapper = (pageID) => {
  let link = "";
  let icon = null;

  switch (pageID) {
    case 141:
      link = "user-stores";
      icon = <StoresIcon style={{ color: Colors.orange[6] }} size={iconSize} />;
      break;

    case 142:
      link = "user-product-natures";
      icon = <NatureIcon style={{ color: Colors.green[6] }} size={iconSize} />;
      break;

    case 143:
      link = "user-measure-types";
      icon = (
        <MeasureTypeIcon style={{ color: Colors.blue[6] }} size={iconSize} />
      );
      break;

    case 144:
      link = "user-measure-units";
      icon = (
        <MeasureUnitIcon style={{ color: Colors.cyan[6] }} size={iconSize} />
      );
      break;

    case 145:
      link = "user-pricing-types";
      icon = (
        <PricingTypeIcon style={{ color: Colors.purple[6] }} size={iconSize} />
      );
      break;

    case 146:
      link = "user-product-categories";
      icon = (
        <CategoryIcon style={{ color: Colors.magenta[6] }} size={iconSize} />
      );
      break;

    case 147:
      link = "user-features";
      icon = <FeatureIcon style={{ color: Colors.lime[6] }} size={iconSize} />;
      break;

    case 148:
      link = "user-products";
      icon = (
        <ProductIcon style={{ color: Colors.volcano[6] }} size={iconSize} />
      );
      break;

    case 149:
      link = "user-inventory-control-agents";
      icon = (
        <InventoryControlAgentIcon
          style={{ color: Colors.red[6] }}
          size={iconSize}
        />
      );
      break;

    case 150:
      link = "user-bach-patterns";
      icon = (
        <BachPatternIcon style={{ color: Colors.cyan[6] }} size={iconSize} />
      );
      break;

    case 151:
      link = "user-baches";
      icon = <BachIcon style={{ color: Colors.geekblue[6] }} size={iconSize} />;
      break;

    case 152:
      link = "user-storage-centers";
      icon = (
        <StorageIcon style={{ color: Colors.magenta[7] }} size={iconSize} />
      );
      break;

    case 153:
      link = "user-group-features";
      icon = (
        <FeaturesIcon style={{ color: Colors.yellow[8] }} size={iconSize} />
      );
      break;

    default:
      break;
  }

  return { link, icon };
};

const UserStoreManagementMenu = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);
  const [lastPathKey, setLastPathKey] = useState("");

  const currentLocation = useLocation();

  useMount(async () => {
    const store_management_module_id = 14;
    const accessiblePages = await modulesService.accessiblePages(
      store_management_module_id
    );

    setAccessiblePages(accessiblePages);
  });

  useEffect(() => {
    const pathKeys = currentLocation.pathname.split("/");
    const _lastPathKey = pathKeys[pathKeys.length - 1]
      .replace("user-", "")
      .replaceAll("-", "")
      .toLocaleLowerCase();
    setLastPathKey(_lastPathKey);
  }, [currentLocation.pathname]);

  return (
    <ModuleMenu
      type="financial"
      typeTitle={Words.financial}
      modulePathName="store-mgr"
      lastPathKey={lastPathKey}
      accessiblePages={accessiblePages}
      iconSize={iconSize}
      mapper={mapper}
    />
  );
};

export default UserStoreManagementMenu;
