import { Button } from "antd";
import { PlusOutlined as AddIcon } from "@ant-design/icons";
import Words from "../../../../../resources/words";
import {
  emptyColumn,
  modifyColumn,
  getColumn,
} from "../../../../antd-general-components/FormManager";
import Colors from "../../../../../resources/colors";
import { LabelType } from "../../../../antd-general-components/Label";

export const getItemsColumns = (access, statusID, onEdit, onDelete) => {
  let columns = [
    getColumn(Words.id, 75, "ItemID", { labelProps: { farsi: true } }),
    getColumn(Words.product_code, 150, "ProductCode", {
      labelProps: { farsi: true, color: Colors.orange[6] },
    }),
    getColumn(Words.product, 150, "Title", {
      labelProps: { farsi: true, color: Colors.cyan[6] },
    }),
    getColumn(Words.request_count, 150, "RequestCount", {
      labelProps: { farsi: true, color: Colors.red[6] },
    }),
    getColumn(Words.storage_inventory_count, 150, "StorageInventoryCount", {
      labelProps: {
        farsi: true,
        color: Colors.green[6],
      },
      renderFunc: (data) => (!data || data === -1 ? "-" : data),
    }),
    getColumn(Words.store_inventory_count, 150, "StoreInventoryCount", {
      labelProps: {
        farsi: true,
        color: Colors.green[6],
      },
      renderFunc: (data) => (!data || data === -1 ? "-" : data),
    }),
    getColumn(Words.measure_unit, 150, "MeasureUnitTitle", {
      labelProps: { farsi: true, color: Colors.grey[6] },
    }),
    getColumn(Words.descriptions, 100, "DetailsText", {
      noDataIndex: true,
      noSorter: true,
      isDescriptions: true,
    }),
    getColumn(Words.status, 150, "StatusTitle", {
      labelProps: { color: Colors.grey[6] },
    }),
  ];

  if (access) {
    // StatusID : 1 => Not Approve, Not Reject! Just Save...
    if (
      statusID === 1 &&
      ((access.CanDelete && onDelete) || (access.CanEdit && onEdit))
    ) {
      columns = [...columns, modifyColumn(access, onEdit, onDelete)];
    }
  }

  columns = [...columns, emptyColumn];

  return columns;
};

export const getActionsColumns = () => {
  let columns = [
    getColumn(Words.id, 75, "ActionID", { labelProps: { farsi: true } }),
    getColumn(Words.registerar, 150, "", {
      labelProps: {
        farsi: true,
        color: Colors.cyan[6],
        noDataIndex: true,
        noSorter: true,
      },
      renderFunc: (data) => `${data.FirstName} ${data.LastName}`,
    }),
    getColumn(Words.role, 150, "SysRoleTitle", {
      labelProps: {
        farsi: true,
        color: Colors.green[6],
      },
    }),
    getColumn(Words.reg_date, 100, "RegDate", {
      labelProps: {
        farsi: true,
        color: Colors.orange[6],
        noDataIndex: true,
        noSorter: true,
        type: LabelType.date,
      },
    }),
    getColumn(Words.reg_time, 100, "RegTime", {
      labelProps: {
        farsi: true,
        color: Colors.orange[6],
        noDataIndex: true,
        noSorter: true,
        type: LabelType.time,
      },
    }),
  ];

  return columns;
};

export const getNewButton = (disabled, onClick) => {
  return (
    <Button
      type="primary"
      onClick={onClick}
      icon={<AddIcon />}
      disabled={disabled}
    >
      {Words.new}
    </Button>
  );
};

// export const getFooterButtons = (config) => {
//   const {
//     is_disable,
//     progress,
//     hasSaveApproveAccess,
//     selectedObject,
//     handleSubmit,
//     handleSubmitAndApprove,
//     hasRejectAccess,
//     clearRecord,
//     onApprove,
//     onReject,
//     onCancel,
//   } = config;

//   return (
//     <Space>
//       {selectedObject === null && (
//         <>
//           <Button
//             key="submit-button"
//             type="primary"
//             onClick={handleSubmit}
//             loading={progress}
//             disabled={is_disable}
//           >
//             {Words.submit}
//           </Button>

//           {hasSaveApproveAccess && (
//             <Popconfirm
//               title={Words.questions.sure_to_submit_approve_request}
//               onConfirm={handleSubmitAndApprove}
//               okText={Words.yes}
//               cancelText={Words.no}
//               icon={<QuestionIcon style={{ color: "red" }} />}
//               key="submit-approve-button"
//               disabled={is_disable || progress}
//             >
//               <Button
//                 key="submit-approve-button"
//                 type="primary"
//                 disabled={is_disable || progress}
//               >
//                 {Words.submit_and_approve}
//               </Button>
//             </Popconfirm>
//           )}

//           <Button key="clear-button" onClick={clearRecord}>
//             {Words.clear}
//           </Button>
//         </>
//       )}

//       {selectedObject !== null && selectedObject.StatusID === 1 && (
//         <>
//           <Button
//             key="submit-button"
//             type="primary"
//             onClick={handleSubmit}
//             loading={progress}
//             disabled={is_disable}
//           >
//             {Words.submit}
//           </Button>

//           {hasSaveApproveAccess && (
//             <Popconfirm
//               title={Words.questions.sure_to_submit_approve_request}
//               onConfirm={onApprove}
//               okText={Words.yes}
//               cancelText={Words.no}
//               icon={<QuestionIcon style={{ color: "red" }} />}
//               key="submit-approve-button"
//               disabled={is_disable || progress}
//             >
//               <Button
//                 key="submit-approve-button"
//                 type="primary"
//                 disabled={is_disable || progress}
//               >
//                 {Words.submit_and_approve}
//               </Button>
//             </Popconfirm>
//           )}

//           {hasRejectAccess && (
//             <Popconfirm
//               title={Words.questions.sure_to_cancel_request}
//               onConfirm={onReject}
//               okText={Words.yes}
//               cancelText={Words.no}
//               icon={<QuestionIcon style={{ color: "red" }} />}
//               key="reject-confirm"
//               disabled={progress}
//             >
//               <Button key="reject-button" type="primary" danger>
//                 {Words.cancel_request}
//               </Button>
//             </Popconfirm>
//           )}
//         </>
//       )}

//       <Button key="close-button" onClick={onCancel}>
//         {Words.close}
//       </Button>
//     </Space>
//   );
// };
