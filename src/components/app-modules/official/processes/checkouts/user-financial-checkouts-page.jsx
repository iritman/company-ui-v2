import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import service from "../../../../../services/official/processes/user-financial-checkouts-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../../tools/form-manager";
import SimpleDataTable from "../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../common/simple-data-page-header";
import { usePageContext } from "../../../../contexts/page-context";
import SearchModal from "./user-financial-checkouts-search-modal";
import DetailsModal from "./user-financial-checkout-details-modal";
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
        label: Words.checkout_person,
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

const handleCheckEditable = (row) => false;
const handleCheckDeletable = (row) => false;

const recordID = "CheckoutID";

const UserFinancialCheckoutsPage = ({ pageName }) => {
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

    const inprogress_checkouts_filter = {
      RegMemberID: 0,
      CheckoutMemberID: 0,
      FinalStatusID: 1,
      FromDate: "",
      ToDate: "",
    };

    await handleAdvancedSearch(inprogress_checkouts_filter);
  });

  const { handleResetContext, handleAdvancedSearch } = GetSimplaDataPageMethods(
    {
      service,
      recordID,
    }
  );

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
        null, //handleEdit,
        null, //handleDelete,
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

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.checkout_financial}
            sheets={getSheets(records)}
            fileName="Checkouts"
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
          onOk={() => {
            setShowDetails(false);
            setSelectedObject(null);
          }}
          onResponse={handleSubmitResponse}
          isOpen={showDetails}
          checkout={selectedObject}
        />
      )}
    </>
  );
};

export default UserFinancialCheckoutsPage;
