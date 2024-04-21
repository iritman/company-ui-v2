import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import { Typography, Space } from "antd";
import { getSorter } from "../../../../../tools/form-manager";
// import { MdInfoOutline as InfoIcon } from "react-icons/md";

const { Text } = Typography;

export const getColumns = () => {
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
      // dataIndex: "MoeinTitle",
      sorter: getSorter("MoeinTitle"),
      render: (record) => (
        <Space direction="vertical">
          <Text style={{ color: Colors.cyan[6] }}>
            {utils.farsiNum(record.MoeinTitle)}
          </Text>
          <Text>{utils.farsiNum(record.MoeinCode)}</Text>
        </Space>
      ),
    },
    {
      title: Words.level_4,
      width: 250,
      align: "center",
      // dataIndex: "TafsilAccountTitle_Level4",
      sorter: getSorter("TafsilAccountTitle_Level4"),
      render: (record) => (
        <>
          {record.TafsilAccountID_Level4 > 0 && (
            <Space direction="vertical">
              <Text>{utils.farsiNum(record.TafsilAccountTitle_Level4)}</Text>
              <Text style={{ color: Colors.purple[7] }}>
                {utils.farsiNum(record.TafsilCode_Level4)}
              </Text>
            </Space>
          )}
        </>
      ),
    },
    {
      title: Words.level_5,
      width: 250,
      align: "center",
      // dataIndex: "TafsilAccountTitle_Level5",
      sorter: getSorter("TafsilAccountTitle_Level5"),
      render: (record) => (
        <>
          {record.TafsilAccountID_Level5 > 0 && (
            <Space direction="vertical">
              <Text>{utils.farsiNum(record.TafsilAccountTitle_Level5)}</Text>
              <Text style={{ color: Colors.purple[7] }}>
                {utils.farsiNum(record.TafsilCode_Level5)}
              </Text>
            </Space>
          )}
        </>
      ),
    },
    {
      title: Words.level_6,
      width: 250,
      align: "center",
      // dataIndex: "TafsilAccountTitle_Level6",
      sorter: getSorter("TafsilAccountTitle_Level6"),
      render: (record) => (
        <>
          {record.TafsilAccountID_Level6 > 0 && (
            <Space direction="vertical">
              <Text>{utils.farsiNum(record.TafsilAccountTitle_Level6)}</Text>
              <Text style={{ color: Colors.purple[7] }}>
                {utils.farsiNum(record.TafsilCode_Level6)}
              </Text>
            </Space>
          )}
        </>
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
    {
      title: "",
      fixed: "right",
      align: "center",
      width: 1,
      render: () => <></>,
    },
  ];

  return columns;
};

const codes = {
  getColumns,
};

export default codes;
