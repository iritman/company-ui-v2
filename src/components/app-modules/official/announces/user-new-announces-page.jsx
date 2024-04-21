import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Button } from "antd";
import { InfoCircleOutlined as InfoIcon } from "@ant-design/icons";
import Words from "../../../../resources/words";
import utils from "./../../../../tools/utils";
import service from "./../../../../services/official/announces/user-my-announces-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  handleError,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import AnnounceDetailsModal from "./announce-details-modal";
import { usePageContext } from "./../../../contexts/page-context";
import Colors from "./../../../../resources/colors";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "NewAnnounces",
    data: records,
    columns: [
      { label: Words.id, value: "AnnounceID" },
      { label: Words.title, value: "Title" },
      { label: Words.descriptions, value: "DetailsText" },
      {
        label: Words.registerar,
        value: (record) => `${record.FirstName} ${record.LastName}`,
      },
      {
        label: Words.reg_date,
        value: (record) => utils.slashDate(record.RegDate),
      },
      {
        label: Words.reg_time,
        value: (record) => utils.colonTime(record.RegTime),
      },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 100,
    align: "center",
    dataIndex: "AnnounceID",
    sorter: getSorter("AnnounceID"),
    render: (AnnounceID) => <Text>{utils.farsiNum(`${AnnounceID}`)}</Text>,
  },
  {
    title: Words.title,
    width: 200,
    align: "center",
    dataIndex: "Title",
    sorter: getSorter("Title"),
    render: (Title) => (
      <Text style={{ color: Colors.blue[6] }}>{utils.farsiNum(Title)}</Text>
    ),
  },
  {
    title: Words.reg_date,
    width: 100,
    align: "center",
    dataIndex: "RegDate",
    sorter: getSorter("RegDate"),
    render: (RegDate) => (
      <Text style={{ color: Colors.cyan[6] }}>
        {utils.farsiNum(utils.slashDate(RegDate))}
      </Text>
    ),
  },
  {
    title: Words.reg_time,
    width: 100,
    align: "center",
    dataIndex: "RegTime",
    sorter: getSorter("RegTime"),
    render: (RegTime) => (
      <Text style={{ color: Colors.purple[6] }}>
        {utils.farsiNum(utils.colonTime(RegTime))}
      </Text>
    ),
  },
];

const recordID = "AnnounceID";

const UserNewAnnouncesPage = ({ pageName }) => {
  const {
    progress,
    setProgress,
    records,
    setRecords,
    access,
    setAccess,
    selectedObject,
    setSelectedObject,
    showDetails,
    setShowDetails,
  } = usePageContext();

  useMount(async () => {
    handleResetContext();
    await checkAccess(setAccess, pageName);

    await handleGetAll();
  });

  const handleGetAll = async () => {
    setProgress(true);

    try {
      const data = await service.getNewData();

      setRecords(data);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const { handleResetContext } = GetSimplaDataPageMethods({
    service,
    recordID,
  });

  const getOperationalButtons = (record) => {
    return (
      <Button
        type="link"
        icon={<InfoIcon style={{ color: Colors.green[6] }} />}
        onClick={() => {
          setSelectedObject(record);
          setShowDetails(true);
        }}
      />
    );
  };

  const columns = access
    ? getColumns(baseColumns, getOperationalButtons, access, null, null)
    : [];

  //------

  const handleSeenAnnounce = async (announceID) => {
    try {
      await service.seenData(announceID);
    } catch (ex) {
      handleError(ex);
    }
  };

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.new_announces}
            sheets={getSheets(records)}
            fileName="NewAnnounces"
            onGetAll={handleGetAll}
            onClear={() => setRecords([])}
          />

          <Col xs={24}>
            <SimpleDataTable records={records} columns={columns} />
          </Col>
        </Row>
      </Spin>

      {showDetails && (
        <AnnounceDetailsModal
          isOpen={showDetails}
          selectedObject={selectedObject}
          onOk={() => {
            setShowDetails(false);
            setSelectedObject(null);
          }}
          onSeen={handleSeenAnnounce}
        />
      )}
    </>
  );
};

export default UserNewAnnouncesPage;
