import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Space } from "antd";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import service from "../../../../../services/official/processes/user-store-personal-transfers-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../../tools/form-manager";
import SimpleDataTable from "../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../common/simple-data-page-header";
import { usePageContext } from "../../../../contexts/page-context";
import SearchModal from "./user-store-personal-transfers-search-modal";
import DetailsModal from "./user-store-personal-transfer-details-modal";
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
    title: "PersonalTransfers",
    data: records,
    columns: [
      { label: Words.id, value: "TransferID" },
      {
        label: Words.employee,
        value: (record) =>
          `${record.TransferFirstName} ${record.TransferLastName}`,
      },
      { label: Words.from_department, value: "FromDepartmentTitle" },
      { label: Words.from_role, value: "FromRoleTitle" },
      { label: Words.to_department, value: "ToDepartmentTitle" },
      { label: Words.to_role, value: "ToRoleTitle" },
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
      { label: Words.delivery_properties, value: "DeliveryProperties" },
      { label: Words.receiving_properties, value: "ReceivingProperties" },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 75,
    align: "center",
    dataIndex: "TransferID",
    sorter: getSorter("TransferID"),
    render: (TransferID) => <Text>{utils.farsiNum(`${TransferID}`)}</Text>,
  },
  {
    title: Words.employee,
    width: 200,
    align: "center",
    sorter: getSorter("TransferLastName"),
    render: (record) => (
      <Text
        style={{ color: Colors.red[6] }}
      >{`${record.TransferFirstName} ${record.TransferLastName}`}</Text>
    ),
  },
  {
    title: Words.from_department,
    width: 200,
    align: "center",
    // dataIndex: "FromDepartmentTitle",
    sorter: getSorter("FromDepartmentTitle"),
    render: (record) => (
      <Space direction="vertical">
        <Text style={{ color: Colors.blue[6] }}>
          {record.FromDepartmentTitle}
        </Text>
        <Text style={{ color: Colors.grey[6], fontSize: 12 }}>
          {record.FromRoleTitle}
        </Text>
      </Space>
    ),
  },
  {
    title: Words.to_department,
    width: 200,
    align: "center",
    // dataIndex: "ToDepartmentTitle",
    sorter: getSorter("ToDepartmentTitle"),
    render: (record) => (
      <Space direction="vertical">
        <Text style={{ color: Colors.green[6] }}>
          {record.ToDepartmentTitle}
        </Text>
        <Text style={{ color: Colors.grey[6], fontSize: 12 }}>
          {record.ToRoleTitle}
        </Text>
      </Space>
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

const recordID = "TransferID";

const UserStorePersonalTransfersPage = ({ pageName }) => {
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
    // showModal,
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

    const inprogress_personal_transfers_filter = {
      TransferMemberID: 0,
      FromDepartmentID: 0,
      FromRoleID: 0,
      ToDepartmentID: 0,
      ToRoleID: 0,
      FinalStatusID: 1,
      FromDate: "",
      ToDate: "",
    };

    await handleAdvancedSearch(inprogress_personal_transfers_filter);
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
        null, // handleEdit,
        null, // handleDelete,
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
    const { TransferID } = selectedObject;
    const action_data = await service.saveResponse({ TransferID, ...response });

    const index = records.findIndex((r) => r.TransferID === TransferID);

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
            title={Words.personal_transfer_store}
            sheets={getSheets(records)}
            fileName="PersonalTransfers"
            onSearch={() => setShowSearchModal(true)}
            onClear={handleClear}
            onGetAll={null}
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
          transfer={selectedObject}
          onOk={() => {
            setShowDetails(false);
            setSelectedObject(null);
          }}
          onResponse={handleSubmitResponse}
        />
      )}
    </>
  );
};

export default UserStorePersonalTransfersPage;
