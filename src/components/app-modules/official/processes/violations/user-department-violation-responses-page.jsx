import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Space } from "antd";
import { MdOutlineNotificationsActive as AlarmIcon } from "react-icons/md";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import service from "../../../../../services/official/processes/user-department-violations-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../../tools/form-manager";
import SimpleDataTable from "../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../common/simple-data-page-header";
import { usePageContext } from "../../../../contexts/page-context";
import SearchModal from "./user-department-violation-responses-search-modal";
import DetailsModal from "./user-department-violation-response-details-modal";
import DetailsButton from "../../../../common/details-button";
import utils from "../../../../../tools/utils";

const { Text } = Typography;

const getFinalStatusColor = (record) => {
  let color = Colors.grey[6];

  const { FinalStatusID } = record;

  if (FinalStatusID > 1) {
    color = FinalStatusID === 2 ? Colors.green[6] : Colors.red[6];
  }

  return color;
};

const getFinalStatusTitle = (record) => {
  let title = Words.in_progress;

  const { FinalStatusID } = record;

  if (FinalStatusID > 1) {
    title = FinalStatusID === 2 ? Words.accepted : Words.rejected;
  }

  return title;
};

const getSheets = (records) => [
  {
    title: "Violations",
    data: records,
    columns: [
      { label: Words.id, value: "ViolationID" },
      {
        label: Words.audience,
        value: (record) =>
          `${record.ViolationFirstName} ${record.ViolationLastName}`,
      },
      { label: Words.status, value: (record) => getFinalStatusTitle(record) },
      //   {
      //     label: Words.reg_member,
      //     value: (record) => `${record.RegFirstName} ${record.RegLastName}`,
      //   },
      {
        label: Words.reg_date,
        value: (record) => utils.slashDate(record.RegDate),
      },
      {
        label: Words.reg_time,
        value: (record) => utils.colonTime(record.RegTime),
      },
      //   { label: Words.descriptions, value: "DetailsText" },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 75,
    align: "center",
    dataIndex: "ViolationID",
    sorter: getSorter("ViolationID"),
    render: (ViolationID) => <Text>{utils.farsiNum(`${ViolationID}`)}</Text>,
  },
  //   {
  //     title: Words.reg_member,
  //     width: 200,
  //     align: "center",
  //     sorter: getSorter("RegLastName"),
  //     render: (record) => (
  //       <Text
  //         style={{ color: Colors.cyan[6] }}
  //       >{`${record.RegFirstName} ${record.RegLastName}`}</Text>
  //     ),
  //   },
  {
    title: Words.audience,
    width: 200,
    align: "center",
    sorter: getSorter("ViolationLastName"),
    render: (record) => (
      <Text
        style={{ color: Colors.blue[6] }}
      >{`${record.ViolationFirstName} ${record.ViolationLastName}`}</Text>
    ),
  },
  {
    title: Words.status,
    width: 100,
    align: "center",
    render: (record) => (
      <Text style={{ color: getFinalStatusColor(record) }}>
        {getFinalStatusTitle(record)}
      </Text>
    ),
  },
  {
    title: "",
    width: 50,
    align: "center",
    render: (record) => (
      <>
        {!record.SeenInfo && (
          <Space>
            <AlarmIcon style={{ fontSize: 16 }} />
            <Text style={{ color: Colors.red[6] }}>{Words.new}</Text>
          </Space>
        )}
      </>
    ),
  },
];

const handleCheckEditable = (row) => false;
const handleCheckDeletable = (row) => false;

const recordID = "ViolationID";

const UserDepartmentViolationResponsesPage = ({ pageName }) => {
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
    showSearchModal,
    setShowSearchModal,
    filter,
    setFilter,
  } = usePageContext();

  useMount(async () => {
    handleResetContext();
    await checkAccess(setAccess, pageName);

    const new_violation_responses_filter = {
      IsNew: true,
      ViolationMemberID: 0,
      FinalStatusID: 0,
      FromDate: "",
      ToDate: "",
    };

    await handleAdvancedSearch(new_violation_responses_filter);
  });

  const { handleEdit, handleDelete, handleResetContext, handleAdvancedSearch } =
    GetSimplaDataPageMethods({
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

  const handleSeenResponse = async (violationID) => {
    try {
      const data = await service.makeSeenViolationResponse(violationID);

      const index = records.findIndex((r) => r.ViolationID === violationID);

      records[index].SeenInfo = data.SeenInfo;
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
            title={Words.department_violation_responses}
            sheets={getSheets(records)}
            fileName="Violations"
            onSearch={() => setShowSearchModal(true)}
            onClear={handleClear}
            onGetAll={null}
            onAdd={null}
          />

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

      {showDetails && (
        <DetailsModal
          isOpen={showDetails}
          violation={selectedObject}
          onOk={() => {
            setShowDetails(false);
            setSelectedObject(null);
          }}
          onSeen={handleSeenResponse}
        />
      )}
    </>
  );
};

export default UserDepartmentViolationResponsesPage;
