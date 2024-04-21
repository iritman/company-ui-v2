import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import service from "../../../../../services/official/processes/user-violations-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../../tools/form-manager";
import SimpleDataTable from "../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../common/simple-data-page-header";
import { usePageContext } from "../../../../contexts/page-context";
import DetailsModal from "./user-violation-announcement-details-modal";
import DetailsButton from "../../../../common/details-button";
import utils from "../../../../../tools/utils";
import { handleError } from "./../../../../../tools/form-manager";

const { Text } = Typography;

const getAnnouncementColor = (record) => {
  let color = Colors.grey[6];

  color = record?.SeenDate?.length === 0 ? Colors.red[6] : Colors.grey[6];

  return color;
};

const getAnnouncementTitle = (record) => {
  let title = "";

  title = record?.SeenDate?.length === 0 ? Words.new_announcement : Words.seen;

  return title;
};

const getSheets = (records) => [
  {
    title: "Announces",
    data: records,
    columns: [
      { label: Words.id, value: "AnnounceID" },
      {
        label: Words.announcement_sender,
        value: (record) => `${record.RegFirtsName} ${record.RegLastName}`,
      },
      {
        label: Words.complainant,
        value: "record.SenderName",
      },
      {
        label: Words.violation_report,
        value: "SenderRequestDetails",
      },
      {
        label: Words.reg_date,
        value: (record) => utils.slashDate(record.RegDate),
      },
      {
        label: Words.reg_time,
        value: (record) => utils.colonTime(record.RegTime),
      },
      { label: Words.descriptions, value: "DetailsText" },
      {
        label: Words.seen_date,
        value: (record) => utils.slashDate(record.SeenDate),
      },
      {
        label: Words.seen_time,
        value: (record) => utils.colonTime(record.SeenTime),
      },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 75,
    align: "center",
    dataIndex: "AnnounceID",
    sorter: getSorter("AnnounceID"),
    render: (AnnounceID) => <Text>{utils.farsiNum(`${AnnounceID}`)}</Text>,
  },
  {
    title: Words.announcement_sender,
    width: 150,
    align: "center",
    sorter: getSorter("RegLastName"),
    render: (record) => (
      <Text style={{ color: Colors.green[7] }}>
        {`${record.RegFirstName} ${record.RegLastName}`}
      </Text>
    ),
  },
  {
    title: Words.issue_date,
    width: 100,
    align: "center",
    dataIndex: "RegDate",
    sorter: getSorter("RegDate"),
    render: (RegDate) => (
      <Text style={{ color: Colors.blue[7] }}>
        {utils.farsiNum(utils.slashDate(RegDate))}
      </Text>
    ),
  },
  {
    title: Words.status,
    width: 100,
    align: "center",
    render: (record) => (
      <Text style={{ color: getAnnouncementColor(record) }}>
        {getAnnouncementTitle(record)}
      </Text>
    ),
  },
];

const handleCheckEditable = (row) => false;
const handleCheckDeletable = (row) => false;

const recordID = "AnnounceID";

const UseViolationAnnouncesPage = ({ pageName }) => {
  const {
    progress,
    setProgress,
    searched,
    setSearched,
    records,
    setRecords,
    access,
    setAccess,
    selectedObject,
    setSelectedObject,
    showDetails,
    setShowDetails,
  } = usePageContext();

  const handleGetAll = async () => {
    setProgress(true);
    try {
      const announces = await service.getAnnounces();

      setRecords(announces);
    } catch (ex) {
      handleError(ex);
    }
    setProgress(false);
    setSearched(true);
  };

  useMount(async () => {
    handleResetContext();
    await checkAccess(setAccess, pageName);

    await handleGetAll();
  });

  const { handleResetContext } = GetSimplaDataPageMethods({
    service,
    recordID,
  });

  const getOperationalButtons = (record) => {
    return (
      <DetailsButton
        record={record}
        setSelectedObject={setSelectedObject}
        setShowDetails={setShowDetails}
      />
    );
  };

  const columns = access
    ? getColumns(
        baseColumns,
        getOperationalButtons,
        access,
        null, // handleEdit,
        null, // handleDelete,
        handleCheckEditable,
        handleCheckDeletable
      )
    : [];

  const handleClear = () => {
    setRecords([]);
    setSearched(false);
  };

  const handleSeenAnnounce = async () => {
    try {
      const data = await service.makeSeenViolationAnnounce(
        selectedObject.AnnounceID
      );

      const { SeenDate, SeenTime } = data;

      const index = records.findIndex(
        (a) => a.AnnounceID === selectedObject.AnnounceID
      );
      records[index].SeenDate = SeenDate;
      records[index].SeenTime = SeenTime;

      setRecords([...records]);
      setSelectedObject({ ...records[index] });
    } catch {}
  };

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.my_violation_announcement}
            sheets={getSheets(records)}
            fileName="Announces"
            onSearch={null}
            onClear={handleClear}
            onGetAll={handleGetAll}
            onAdd={null}
          />

          <Col xs={24}>
            {searched && (
              <SimpleDataTable records={records} columns={columns} />
            )}
          </Col>
        </Row>
      </Spin>

      {showDetails && (
        <DetailsModal
          isOpen={showDetails}
          announce={selectedObject}
          onCancel={() => {
            setShowDetails(false);
            setSelectedObject(null);
          }}
          onSeen={handleSeenAnnounce}
        />
      )}
    </>
  );
};

export default UseViolationAnnouncesPage;
