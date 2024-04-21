import React from "react";
// import { useMount } from "react-use";
import {
  Row,
  // , Col
} from "antd";
// import DashboardTile from "../../../common/dashboard-tile";
// import { MdPersonRemoveAlt1 as RemoveUserIcon } from "react-icons/md";
// import {
//   RiRefund2Fill as FundIcon,
//   RiArtboardFill as BoardIcon,
//   RiWalkFill as CheckoutIcon,
//   RiUserAddFill as AddUserIcon,
//   RiExchangeFundsLine as PersonalReplacementIcon,
//   RiExchangeLine as ManagerReplacementIcon,
// } from "react-icons/ri";
// import Colors from "../../../../resources/colors";
// import modulesService from "../../../../services/app/modules-service";

// const iconProps = {
//   size: 55,
//   style: { marginTop: 10 },
// };

// const mapper = (pageID) => {
//   let link = "";
//   let icon = null;
//   let backColor = Colors.blue[3];

//   switch (pageID) {
//     case 91:
//       link = "dismissals";
//       icon = <RemoveUserIcon {...iconProps} />;
//       backColor = Colors.red[3];
//       break;

//     case 92:
//       link = "edu-funds";
//       icon = <FundIcon {...iconProps} />;
//       backColor = Colors.green[3];
//       break;

//     case 93:
//       link = "learnings";
//       icon = <BoardIcon {...iconProps} />;
//       backColor = Colors.blue[3];
//       break;

//     case 94:
//       link = "checkouts";
//       icon = <CheckoutIcon {...iconProps} />;
//       backColor = Colors.orange[3];
//       break;

//     case 95:
//       link = "employments";
//       icon = <AddUserIcon {...iconProps} />;
//       backColor = Colors.purple[3];
//       break;

//     case 96:
//       link = "personal-replacements";
//       icon = <PersonalReplacementIcon {...iconProps} />;
//       backColor = Colors.magenta[3];
//       break;

//     case 97:
//       link = "manager-replacements";
//       icon = <ManagerReplacementIcon {...iconProps} />;
//       backColor = Colors.cyan[3];
//       break;

//     default:
//       break;
//   }

//   return { link, icon, backColor };
// };

const UserProcessesDashboard = () => {
  // const [accessiblePages, setAccessiblePages] = useState([]);

  // useMount(async () => {
  //   const processes_module_id = 10;
  //   const accessiblePages = await modulesService.accessiblePages(
  //     processes_module_id
  //   );

  //   setAccessiblePages(accessiblePages);
  // });

  return (
    <Row gutter={[10, 16]}>
      {/* {accessiblePages.map((page) => (
        <Col xs={24} md={8} lg={6} key={page.PageID}>
          <DashboardTile
            to={`processes/${mapper(page.PageID).link}`}
            icon={mapper(page.PageID).icon}
            backColor={mapper(page.PageID).backColor}
            title={page.PageTitle}
          />
        </Col>
      ))} */}
    </Row>
  );
};

export default UserProcessesDashboard;
