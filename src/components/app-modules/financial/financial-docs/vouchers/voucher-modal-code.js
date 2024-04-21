import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import { Button, Space, Typography, Popconfirm /*, Popover */ } from "antd";
import { getSorter, validateForm } from "../../../../../tools/form-manager";
import {
  PlusOutlined as AddIcon,
  DeleteOutlined as DeleteIcon,
  EditOutlined as EditIcon,
  QuestionCircleOutlined as QuestionIcon,
} from "@ant-design/icons";
// import { MdInfoOutline as InfoIcon } from "react-icons/md";
import Joi from "joi-browser";

const { Text } = Typography;

export const schema = {
  VoucherID: Joi.number().required().label(Words.voucher_id),
  SubNo: Joi.number().required().label(Words.sub_no),
  VoucherDate: Joi.string().required().label(Words.voucher_date),
  StandardDetailsID: Joi.number().label(Words.standard_description),
  DetailsText: Joi.string()
    .min(5)
    .max(250)
    .allow("")
    .regex(utils.VALID_REGEX)
    .label(Words.standard_description),
  StatusID: Joi.number(),
  Items: Joi.array(),
  Logs: Joi.array(),
};

export const initRecord = {
  VoucherID: 0,
  SubNo: 0,
  VoucherDate: "",
  StandardDetailsID: 0,
  DetailsText: "",
  StatusID: 1,
  Items: [],
  Logs: [],
};

export const getColumns = (access, statusID, onEdit, onDelete) => {
  let columns = [
    {
      title: Words.id,
      width: 75,
      align: "center",
      dataIndex: "ItemID",
      sorter: getSorter("ItemID"),
      render: (ItemID) => (
        <Text>{ItemID > 0 ? utils.farsiNum(`${ItemID}`) : ""}</Text>
      ),
    },
    {
      title: Words.account_moein,
      width: 200,
      align: "center",
      dataIndex: "MoeinTitle",
      sorter: getSorter("MoeinTitle"),
      render: (MoeinTitle) => (
        <Text style={{ color: Colors.cyan[6] }}>
          {utils.farsiNum(MoeinTitle)}
        </Text>
      ),
    },
    {
      title: Words.level_4,
      width: 250,
      align: "center",
      dataIndex: "TafsilAccountTitle_Level4",
      sorter: getSorter("TafsilAccountTitle_Level4"),
      render: (TafsilAccountTitle_Level4) => (
        <Text>{utils.farsiNum(TafsilAccountTitle_Level4)}</Text>
      ),
    },
    {
      title: Words.level_5,
      width: 250,
      align: "center",
      dataIndex: "TafsilAccountTitle_Level5",
      sorter: getSorter("TafsilAccountTitle_Level5"),
      render: (TafsilAccountTitle_Level5) => (
        <Text>{utils.farsiNum(TafsilAccountTitle_Level5)}</Text>
      ),
    },
    {
      title: Words.level_6,
      width: 250,
      align: "center",
      dataIndex: "TafsilAccountTitle_Level6",
      sorter: getSorter("TafsilAccountTitle_Level6"),
      render: (TafsilAccountTitle_Level6) => (
        <Text>{utils.farsiNum(TafsilAccountTitle_Level6)}</Text>
      ),
    },
    {
      title: Words.standard_description,
      width: 400,
      align: "center",
      render: (record) => (
        <>
          {(record.StandardDetailsID > 0 || record.DetailsText.length > 0) && (
            <Text>{`${utils.farsiNum(
              utils.getDescription(
                record.StandardDetailsText,
                record.DetailsText
              )
            )}`}</Text>
            // <Popover
            //   content={
            //     <Text>{`${utils.getDescription(
            //       record.StandardDetailsText,
            //       record.DetailsText
            //     )}`}</Text>
            //   }
            // >
            //   <InfoIcon
            //     style={{
            //       color: Colors.green[6],
            //       fontSize: 19,
            //       cursor: "pointer",
            //     }}
            //   />
            // </Popover>
          )}
        </>
      ),
    },
    {
      title: Words.bedehkar,
      width: 200,
      align: "center",
      dataIndex: "BedehkarAmount",
      sorter: getSorter("BedehkarAmount"),
      render: (BedehkarAmount) => (
        <Text style={{ color: Colors.red[6] }}>
          {utils.farsiNum(utils.moneyNumber(BedehkarAmount))}
        </Text>
      ),
    },
    {
      title: Words.bestankar,
      width: 200,
      align: "center",
      dataIndex: "BestankarAmount",
      sorter: getSorter("BestankarAmount"),
      render: (BestankarAmount) => (
        <Text style={{ color: Colors.green[6] }}>
          {utils.farsiNum(utils.moneyNumber(BestankarAmount))}
        </Text>
      ),
    },
    {
      title: Words.follow_code,
      width: 160,
      align: "center",
      dataIndex: "FollowCode",
      sorter: getSorter("FollowCode"),
      render: (FollowCode) => (
        <Text style={{ color: Colors.purple[6] }}>
          {utils.farsiNum(FollowCode)}
        </Text>
      ),
    },
    {
      title: Words.follow_date,
      width: 150,
      align: "center",
      dataIndex: "FollowDate",
      sorter: getSorter("FollowDate"),
      render: (FollowDate) => (
        <Text style={{ color: Colors.grey[6] }}>
          {FollowDate.length > 0
            ? utils.farsiNum(utils.slashDate(FollowDate))
            : ""}
        </Text>
      ),
    },
  ];

  // StatusID : 1 => Not Approve, Not Reject! Just Save...
  if (
    statusID === 1 &&
    ((access.CanDelete && onDelete) || (access.CanEdit && onEdit))
  ) {
    columns = [
      ...columns,
      {
        title: "",
        fixed: "right",
        align: "center",
        width: 75,
        render: (record) => (
          <Space>
            {access.CanDelete && onDelete && (
              <Popconfirm
                title={Words.questions.sure_to_delete_selected_item}
                onConfirm={async () => await onDelete(record)}
                okText={Words.yes}
                cancelText={Words.no}
                icon={<QuestionIcon style={{ color: "red" }} />}
              >
                <Button type="link" icon={<DeleteIcon />} danger />
              </Popconfirm>
            )}

            {access.CanEdit && onEdit && (
              <Button
                type="link"
                icon={<EditIcon />}
                onClick={() => onEdit(record)}
              />
            )}
          </Space>
        ),
      },
    ];
  } else {
    columns = [
      ...columns,
      {
        title: "",
        fixed: "right",
        align: "center",
        width: 1,
        render: () => <></>,
      },
    ];
  }

  return columns;
};

export const getNewButton = (onClick) => {
  return (
    <Button
      type="primary"
      onClick={onClick}
      icon={<AddIcon />}
      style={{ marginTop: 5 }}
    >
      {Words.new}
    </Button>
  );
};

export const getFooterButtons = (is_disable, config) => {
  const {
    selectedObject,
    handleSubmit,
    handleSubmitAndApprove,
    onApprove,
    hasRejectAccess,
    onReject,
    onCancel,
    clearRecord,
    progress,
    hasSaveApproveAccess,
  } = config;

  return (
    <Space>
      {selectedObject === null && (
        <>
          <Button
            key="submit-button"
            type="primary"
            onClick={handleSubmit}
            loading={progress}
            disabled={is_disable}
          >
            {Words.submit}
          </Button>

          {hasSaveApproveAccess && (
            <Popconfirm
              title={Words.questions.sure_to_submit_approve_receive_receipt}
              onConfirm={handleSubmitAndApprove}
              okText={Words.yes}
              cancelText={Words.no}
              icon={<QuestionIcon style={{ color: "red" }} />}
              key="submit-approve-button"
              disabled={is_disable || progress}
            >
              <Button
                key="submit-approve-button"
                type="primary"
                disabled={is_disable || progress}
              >
                {Words.submit_and_approve}
              </Button>
            </Popconfirm>
          )}

          <Button key="clear-button" onClick={clearRecord}>
            {Words.clear}
          </Button>
        </>
      )}

      {selectedObject !== null && selectedObject.StatusID === 1 && (
        <>
          {hasSaveApproveAccess && (
            <Popconfirm
              title={Words.questions.sure_to_submit_approve_receive_receipt}
              onConfirm={onApprove}
              okText={Words.yes}
              cancelText={Words.no}
              icon={<QuestionIcon style={{ color: "red" }} />}
              key="submit-approve-button"
              disabled={is_disable || progress}
            >
              <Button
                key="submit-approve-button"
                type="primary"
                disabled={is_disable || progress}
              >
                {Words.submit_and_approve}
              </Button>
            </Popconfirm>
          )}

          {hasRejectAccess && (
            <Popconfirm
              title={Words.questions.sure_to_reject_request}
              onConfirm={onReject}
              okText={Words.yes}
              cancelText={Words.no}
              icon={<QuestionIcon style={{ color: "red" }} />}
              key="reject-confirm"
              disabled={progress}
            >
              <Button key="reject-button" type="primary" danger>
                {Words.reject_request}
              </Button>
            </Popconfirm>
          )}
        </>
      )}

      <Button key="close-button" onClick={onCancel}>
        {Words.close}
      </Button>
    </Space>
  );
};

export const getDisableStatus = (record) => {
  const price = calculatePrice(record);

  const { RemainedBedehkar, RemainedBestankar } = price;

  const is_disable =
    record?.Items?.length === 0 ||
    RemainedBedehkar + RemainedBestankar > 0 ||
    (validateForm({ record, schema }) && true);

  return is_disable;
};

export const calculatePrice = (record) => {
  const price = {
    Bedehkar: 0,
    Bestankar: 0,
    RemainedBedehkar: 0,
    RemainedBestankar: 0,
  };

  record?.Items?.forEach((i) => {
    price.Bedehkar += i.BedehkarAmount;
    price.Bestankar += i.BestankarAmount;
  });

  const remain = price.Bedehkar - price.Bestankar;

  price.RemainedBedehkar = remain > 0 ? price.Bedehkar : 0;
  price.RemainedBestankar = remain < 0 ? Math.abs(remain) : 0;

  return price;
};

export const findTitle = (data_source, id_col, title_col, search_value) => {
  const record = data_source.find((row) => row[id_col] === search_value);

  return record ? record[title_col] : "";
};

const codes = {
  schema,
  initRecord,
  //   getTabPanes,
  getColumns,
  getNewButton,
  getFooterButtons,
  getDisableStatus,
  calculatePrice,
  findTitle,
};

export default codes;
