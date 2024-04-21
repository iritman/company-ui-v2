import React, { useState, useEffect } from "react";
import { useMount } from "react-use";
import { TbReportMoney as DocsIcon } from "react-icons/tb";
import { MdOutlineDescription as DescriptionIcon } from "react-icons/md";
import modulesService from "../../../services/app/modules-service";
import Colors from "../../../resources/colors";
import { useLocation } from "react-router-dom";
import ModuleMenu from "./../module-menu";
import Words from "../../../resources/words";

const iconSize = 20;

const mapper = (pageID) => {
  let link = "";
  let icon = null;

  switch (pageID) {
    case 504:
      link = "vouchers";
      icon = <DocsIcon style={{ color: Colors.green[6] }} size={iconSize} />;
      break;

    case 505:
      link = "voucher-descriptions";
      icon = (
        <DescriptionIcon style={{ color: Colors.blue[6] }} size={iconSize} />
      );
      break;

    //   Colors.blue[2];
    //   Colors.purple[3];
    //   Colors.orange[3];
    //   Colors.yellow[6];
    //   Colors.volcano[4];
    //   Colors.cyan[3];
    //   Colors.red[3];
    //   Colors.purple[2];
    //   Colors.magenta[3];
    //   Colors.blue[4];
    //   Colors.geekblue[3];

    default:
      break;
  }

  return { link, icon };
};

const UserFinancialDocsMenu = () => {
  const [accessiblePages, setAccessiblePages] = useState([]);
  const [lastPathKey, setLastPathKey] = useState("");

  const currentLocation = useLocation();

  useMount(async () => {
    const financial_docs_id = 29;
    const accessiblePages = await modulesService.accessiblePages(
      financial_docs_id
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
      modulePathName="docs"
      lastPathKey={lastPathKey}
      accessiblePages={accessiblePages}
      iconSize={iconSize}
      mapper={mapper}
    />
  );
};

export default UserFinancialDocsMenu;
