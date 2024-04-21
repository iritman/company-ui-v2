import { Space, Button } from "antd";

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
