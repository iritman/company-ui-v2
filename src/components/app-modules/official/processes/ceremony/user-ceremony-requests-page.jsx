import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import service from "../../../../../services/official/processes/user-ceremony-requests-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../../tools/form-manager";
import SimpleDataTable from "../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../common/simple-data-page-header";
import { usePageContext } from "../../../../contexts/page-context";
import CeremonyRequestModal from "./user-ceremony-request-modal";
import SearchModal from "./user-ceremony-requests-search-modal";
import DetailsModal from "./user-ceremony-request-details-modal";
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
    title: "CeremonyRequests",
    data: records,
    columns: [
      { label: Words.id, value: "RequestID" },
      {
        label: Words.title,
        value: "Title",
      },
      {
        label: Words.client_counts,
        value: "ClientCounts",
      },
      {
        label: Words.clients,
        value: "Clients",
      },
      {
        label: Words.start_date,
        value: (record) => utils.slashDate(record.StartDate),
      },
      {
        label: Words.finish_date,
        value: (record) => utils.slashDate(record.FinishDate),
      },
      {
        label: Words.estimated_entry_time,
        value: (record) => utils.colonTime(record.EstimatedEntryTime),
      },
      {
        label: Words.fruit,
        value: (record) => (record.NeedFruit ? "*" : "-"),
      },
      {
        label: Words.sweet,
        value: (record) => (record.NeedSweet ? "*" : "-"),
      },
      {
        label: Words.breakfast,
        value: (record) => (record.NeedBreakfast ? "*" : "-"),
      },
      {
        label: Words.lunch,
        value: (record) => (record.NeedLunch ? "*" : "-"),
      },
      {
        label: Words.dinner,
        value: (record) => (record.NeedDinner ? "*" : "-"),
      },
      {
        label: Words.need_hoteling,
        value: (record) => (record.NeedHoteling ? "*" : "-"),
      },
      {
        label: Words.need_vehicle,
        value: (record) => (record.NeedVehicle ? "*" : "-"),
      },
      {
        label: Words.needed_facilities,
        value: "NeededFacilities",
      },
      {
        label: Words.client_type,
        value: "ClientTypeTitle",
      },
      {
        label: Words.client_type_details_text,
        value: "ClientTypeDetailsText",
      },
      {
        label: Words.dishes,
        value: "Dishes",
      },
      {
        label: Words.foods,
        value: "Foods",
      },
      {
        label: Words.session_location,
        value: "LocationTitle",
      },
      {
        label: Words.descriptions,
        value: "DetailsText",
      },
      { label: Words.status, value: (record) => getFinalStatusTitle(record) },
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
    width: 75,
    align: "center",
    dataIndex: "RequestID",
    sorter: getSorter("RequestID"),
    render: (RequestID) => <Text>{utils.farsiNum(`${RequestID}`)}</Text>,
  },
  {
    title: Words.subject,
    width: 200,
    align: "center",
    dataIndex: "Title",
    sorter: getSorter("Title"),
    render: (Title) => <Text style={{ color: Colors.blue[7] }}>{Title}</Text>,
  },
  {
    title: Words.client_type,
    width: 150,
    align: "center",
    dataIndex: "ClientTypeTitle",
    sorter: getSorter("ClientTypeTitle"),
    render: (ClientTypeTitle) => (
      <Text style={{ color: Colors.orange[6] }}>{ClientTypeTitle}</Text>
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
];

const handleCheckEditable = (row) => row.Editable;
const handleCheckDeletable = (row) => row.Deletable;

const recordID = "RequestID";

const UserCeremonyRequestsPage = ({ pageName }) => {
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

    const inprogress_edu_funds_filter = {
      Title: "",
      ClientTypeID: 0,
      LocationID: 0,
      FinalStatusID: 1,
      FromDate: "",
      ToDate: "",
    };

    await handleAdvancedSearch(inprogress_edu_funds_filter);
  });

  const {
    handleCloseModal,
    handleAdd,
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

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.ceremony_requests}
            sheets={getSheets(records)}
            fileName="CeremonyRequests"
            onSearch={() => setShowSearchModal(true)}
            onClear={handleClear}
            onGetAll={null}
            onAdd={access?.CanAdd && handleAdd}
          />

          <Col xs={24}>
            {searched && (
              <SimpleDataTable records={records} columns={columns} />
            )}
          </Col>
        </Row>
      </Spin>

      {showModal && (
        <CeremonyRequestModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}

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
          onOk={() => {
            setShowDetails(false);
            setSelectedObject(null);
          }}
          isOpen={showDetails}
          request={selectedObject}
        />
      )}
    </>
  );
};

export default UserCeremonyRequestsPage;
