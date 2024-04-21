import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Button, Space, Alert } from "antd";
import {
  InfoCircleOutlined as InfoIcon,
  ClockCircleOutlined as ClockIcon,
} from "@ant-design/icons";
import Words from "../../../../resources/words";
import utils from "../../../../tools/utils";
import service from "../../../../services/official/timex/user-official-check-extra-work-requests-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import { usePageContext } from "../../../contexts/page-context";
import Colors from "../../../../resources/colors";
import ExtraWorkModal from "./user-official-check-extra-work-request-modal";
import SearchModal from "./user-official-check-extra-work-requests-search-modal";
import DetailsModal from "./user-official-check-extra-work-request-details-modal";

const { Text } = Typography;

const getRequestStatusColor = (record) => {
  let color = Colors.orange[5];

  const { IsAccepted, ResponseMemberID } = record;

  if (ResponseMemberID > 0 && !IsAccepted) color = Colors.red[6];
  else if (ResponseMemberID > 0 && IsAccepted) color = Colors.green[6];

  return color;
};

const getRequestStatusTitle = (record) => {
  let title = Words.new;

  const { IsAccepted, ResponseMemberID } = record;

  if (ResponseMemberID > 0 && !IsAccepted) title = Words.rejected;
  else if (ResponseMemberID > 0 && IsAccepted) title = Words.accepted;

  return title;
};

const getSheets = (records) => [
  {
    title: "ExtraWorkRequests",
    data: records,
    columns: [
      { label: Words.id, value: "RequestID" },
      {
        label: Words.extra_work_command_source,
        value: (record) => `${record.CommandSourceTitle}`,
      },
      {
        label: Words.start_date,
        value: (record) => `${record.StartDate}`,
      },
      {
        label: Words.start_time,
        value: (record) => `${record.StartTime}`,
      },
      {
        label: Words.finish_date,
        value: (record) => `${record.FinishDate}`,
      },
      {
        label: Words.finish_time,
        value: (record) => `${record.FinishTime}`,
      },
      {
        label: Words.request_duration,
        value: (record) => `${utils.minToTime(record.DurationInMin)}`,
      },
      {
        label: Words.descriptions,
        value: "DetailsText",
      },
      {
        label: Words.reg_member,
        value: (record) => `${record.RegFirstName} ${record.RegLastName}`,
      },
      {
        label: Words.department,
        value: "DepartmentTitle",
      },
      {
        label: Words.reg_date,
        value: (record) => utils.slashDate(record.RegDate),
      },
      {
        label: Words.reg_time,
        value: (record) => utils.colonTime(record.RegTime),
      },
      {
        label: Words.official_expert,
        value: (record) =>
          `${record.ResponseFirstName} ${record.ResponseLastName}`,
      },
      {
        label: Words.official_response,
        value: "ResponseDetailsText",
      },
      {
        label: Words.status,
        value: (record) => getRequestStatusTitle(record),
      },
      {
        label: Words.response_reg_date,
        value: (record) =>
          record.ResponseRegDate.length > 0
            ? utils.slashDate(record.ResponseRegDate)
            : "",
      },
      {
        label: Words.response_reg_time,
        value: (record) =>
          record.ResponseRegTime.length > 0
            ? utils.colonTime(record.ResponseRegTime)
            : "",
      },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 75,
    align: "center",
    dataIndex: "RequestID",
    sorter: getSorter("RequestID"),
    render: (RequestID) => <Text>{utils.farsiNum(`${RequestID}`)}</Text>,
  },
  {
    title: Words.department,
    width: 150,
    align: "center",
    dataIndex: "DepartmentTitle",
    sorter: getSorter("DepartmentTitle"),
    render: (DepartmentTitle) => (
      <Text style={{ color: Colors.purple[4] }}>{DepartmentTitle}</Text>
    ),
  },
  {
    title: Words.extra_work_command_source,
    width: 150,
    align: "center",
    dataIndex: "CommandSourceTitle",
    sorter: getSorter("CommandSourceTitle"),
    render: (CommandSourceTitle) => (
      <Text style={{ color: Colors.blue[6] }}>{CommandSourceTitle}</Text>
    ),
  },
  {
    title: Words.start,
    width: 150,
    align: "center",
    sorter: getSorter("StartDate"),
    render: (record) => (
      <Space direction="vertical">
        <Text style={{ color: Colors.cyan[6] }}>
          {utils.farsiNum(
            `${utils.weekDayNameFromText(record.StartDate)} ${utils.slashDate(
              record.StartDate
            )}`
          )}
        </Text>
        <Text style={{ color: Colors.orange[6] }}>
          {utils.farsiNum(utils.colonTime(record.StartTime))}
        </Text>
      </Space>
    ),
  },
  {
    title: Words.finish,
    width: 150,
    align: "center",
    sorter: getSorter("FinishDate"),
    render: (record) => (
      <Space direction="vertical">
        <Text style={{ color: Colors.cyan[6] }}>
          {utils.farsiNum(
            `${utils.weekDayNameFromText(record.FinishDate)} ${utils.slashDate(
              record.FinishDate
            )}`
          )}
        </Text>
        <Text style={{ color: Colors.orange[6] }}>
          {utils.farsiNum(utils.colonTime(record.FinishTime))}
        </Text>
      </Space>
    ),
  },
  {
    title: Words.request_duration,
    width: 100,
    align: "center",
    render: (record) => (
      <Text style={{ color: Colors.magenta[6] }}>
        {utils.farsiNum(utils.minToTime(record.DurationInMin))}
      </Text>
    ),
  },
  {
    title: Words.status,
    width: 100,
    align: "center",
    render: (record) => (
      <Text style={{ color: getRequestStatusColor(record) }}>
        {getRequestStatusTitle(record)}
      </Text>
    ),
  },
];

const handleCheckEditable = (row) => true;
const handleCheckDeletable = (row) => false;

const recordID = "RequestID";

const UserOfficialCheckExtraWorkRequestsPage = ({ pageName }) => {
  const {
    progress,
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
    showModal,
    showSearchModal,
    setShowSearchModal,
    filter,
    setFilter,
  } = usePageContext();

  useMount(async () => {
    handleResetContext();
    await checkAccess(setAccess, pageName);
  });

  const {
    handleCloseModal,
    // handleAdd,
    handleEdit,
    handleDelete,
    handleSave,
    handleResetContext,
    handleAdvancedSearch,
  } = GetSimplaDataPageMethods({
    service,
    recordID,
  });

  const getOperationalButtons = (record) => {
    return (
      <>
        {record.RegTypeID !== 1 && (
          <Button
            type="link"
            icon={<InfoIcon style={{ color: Colors.green[6] }} />}
            onClick={() => {
              setSelectedObject(record);
              setShowDetails(true);
            }}
          />
        )}
      </>
    );
  };

  const columns = access
    ? getColumns(
        baseColumns,
        getOperationalButtons,
        access,
        handleEdit,
        handleDelete,
        handleCheckEditable,
        handleCheckDeletable
      )
    : [];

  const handleClear = () => {
    setRecords([]);
    setFilter(null);
    setSearched(false);
  };

  const getTotalRequestedDurationInMin = () => {
    let result = 0;

    records.forEach((req) => {
      result += req.DurationInMin;
    });

    return result;
  };

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.extra_work_requests}
            sheets={getSheets(records)}
            fileName="ExtraWorkRequests"
            onSearch={() => setShowSearchModal(true)}
            onClear={handleClear}
            onGetAll={null}
            onAdd={null}
          />

          {records.length > 0 && (
            <Col xs={24}>
              <Alert
                message={
                  <Space>
                    <ClockIcon />
                    <Text>{`${Words.total_request_duration}:`}</Text>
                    <Text style={{ color: Colors.orange[6] }}>
                      {`${utils.farsiNum(
                        utils.minToTime(getTotalRequestedDurationInMin())
                      )}`}
                    </Text>
                  </Space>
                }
                type="warning"
              />
            </Col>
          )}

          <Col xs={24}>
            {searched && (
              <SimpleDataTable records={records} columns={columns} />
            )}
          </Col>
        </Row>
      </Spin>

      {showSearchModal && (
        <SearchModal
          onOk={handleAdvancedSearch}
          onCancel={() => setShowSearchModal(false)}
          isOpen={showSearchModal}
          filter={filter}
        />
      )}

      {showModal && (
        <ExtraWorkModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}

      {showDetails && (
        <DetailsModal
          onOk={() => {
            setShowDetails(false);
            setSelectedObject(null);
          }}
          isOpen={showDetails}
          extraWorkRequest={selectedObject}
        />
      )}
    </>
  );
};

export default UserOfficialCheckExtraWorkRequestsPage;
