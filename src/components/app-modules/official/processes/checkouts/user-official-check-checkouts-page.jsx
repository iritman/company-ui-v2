import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, message } from "antd";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import service from "../../../../../services/official/processes/user-checkouts-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../../tools/form-manager";
import SimpleDataTable from "../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../common/simple-data-page-header";
import { usePageContext } from "../../../../contexts/page-context";
import SearchModal from "./user-official-check-checkouts-search-modal";
import CheckoutModal from "./user-official-check-checkout-modal";
import DetailsModal from "./user-official-check-checkout-details-modal";
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
    title: "Checkouts",
    data: records,
    columns: [
      { label: Words.id, value: "CheckoutID" },
      {
        label: Words.employee,
        value: (record) =>
          `${record.CheckoutFirstName} ${record.CheckoutLastName}`,
      },
      { label: Words.status, value: (record) => getFinalStatusTitle(record) },
      {
        label: Words.reg_member,
        value: (record) => `${record.RegFirstName} ${record.RegLastName}`,
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
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 75,
    align: "center",
    dataIndex: "CheckoutID",
    sorter: getSorter("CheckoutID"),
    render: (CheckoutID) => <Text>{utils.farsiNum(`${CheckoutID}`)}</Text>,
  },
  {
    title: Words.reg_member,
    width: 200,
    align: "center",
    sorter: getSorter("RegLastName"),
    render: (record) => (
      <Text
        style={{ color: Colors.cyan[6] }}
      >{`${record.RegFirstName} ${record.RegLastName}`}</Text>
    ),
  },
  {
    title: Words.employee,
    width: 200,
    align: "center",
    sorter: getSorter("CheckoutLastName"),
    render: (record) => (
      <Text
        style={{ color: Colors.red[6] }}
      >{`${record.CheckoutFirstName} ${record.CheckoutLastName}`}</Text>
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

const recordID = "CheckoutID";

const UserOfficialCheckCheckoutsPage = ({ pageName }) => {
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
    showModal,
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

    const inprogress_checkouts_filter = {
      RegMemberID: 0,
      CheckoutMemberID: 0,
      FinalStatusID: 1,
      FromDate: "",
      ToDate: "",
    };

    await handleAdvancedSearch(inprogress_checkouts_filter);
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

  const handleSubmitResponse = async (response) => {
    const { CheckoutID } = selectedObject;
    const action_data = await service.saveResponse({ CheckoutID, ...response });

    const index = records.findIndex((r) => r.CheckoutID === CheckoutID);

    records[index] = action_data;
    setRecords([...records]);
    setSelectedObject(action_data);
  };

  const handleRegReport = async (report) => {
    const newReport = await service.saveReport(report);

    const index = records.findIndex((r) => r.CheckoutID === report.CheckoutID);

    records[index].Reports = [...records[index].Reports, newReport];
    records[index].Reports.sort((a, b) => (a.ReportID > b.ReportID ? -1 : 1));
    records[index].Editable = false;
    records[index].Deletable = false;

    setRecords([...records]);
    setSelectedObject(records[index]);
  };

  const handleDeleteReport = async (report) => {
    const data = await service.deleteReport(report.ReportID);

    const index = records.findIndex((r) => r.CheckoutID === report.CheckoutID);

    records[index].Reports = records[index].Reports.filter(
      (r) => r.ReportID !== report.ReportID
    );
    records[index].Reports.sort((a, b) => (a.ReportID > b.ReportID ? -1 : 1));
    if (records[index].Reports.length === 0) {
      records[index].Editable = true;
      records[index].Deletable = true;
    }

    setRecords([...records]);
    setSelectedObject(records[index]);

    message.success(data.Message);
  };

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.checkout_official}
            sheets={getSheets(records)}
            fileName="Checkouts"
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
        <CheckoutModal
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
          onRegReport={handleRegReport}
          onDeleteReport={handleDeleteReport}
          onResponse={handleSubmitResponse}
          isOpen={showDetails}
          checkout={selectedObject}
        />
      )}
    </>
  );
};

export default UserOfficialCheckCheckoutsPage;
