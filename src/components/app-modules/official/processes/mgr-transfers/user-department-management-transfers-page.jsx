import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import service from "../../../../../services/official/processes/user-department-management-transfers-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../../tools/form-manager";
import SimpleDataTable from "../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../common/simple-data-page-header";
import { usePageContext } from "../../../../contexts/page-context";
import SearchModal from "./user-department-management-transfers-search-modal";
import DetailsModal from "./user-department-management-transfer-details-modal";
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
    title: "ManagementTransfers",
    data: records,
    columns: [
      { label: Words.id, value: "TransferID" },
      {
        label: Words.employee,
        value: (record) =>
          `${record.TransferFirstName} ${record.TransferLastName}`,
      },
      { label: Words.from_department, value: "FromDepartmentTitle" },
      { label: Words.to_department, value: "ToDepartmentTitle" },
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
    dataIndex: "FromDepartmentTitle",
    sorter: getSorter("FromDepartmentTitle"),
    render: (FromDepartmentTitle) => (
      <Text style={{ color: Colors.blue[6] }}>{FromDepartmentTitle}</Text>
    ),
  },
  {
    title: Words.to_department,
    width: 200,
    align: "center",
    dataIndex: "ToDepartmentTitle",
    sorter: getSorter("ToDepartmentTitle"),
    render: (ToDepartmentTitle) => (
      <Text style={{ color: Colors.green[6] }}>{ToDepartmentTitle}</Text>
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

const UserDepartmentManagementTransfersPage = ({ pageName }) => {
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

    const new_management_transfers_filter = {
      TransferMemberID: 0,
      FromDepartmentID: 0,
      ToDepartmentID: 0,
      FinalStatusID: 0,
      FromDate: "",
      ToDate: "",
      JustUnseenTransfers: true,
    };

    await handleAdvancedSearch(new_management_transfers_filter);
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

  const handleSeenTransfer = async () => {
    try {
      const { TransferID } = selectedObject;
      await service.seenTransfer(TransferID);

      const index = records.findIndex((r) => r.TransferID === TransferID);

      records[index].IsSeen = true;
      setRecords([...records]);

      selectedObject.IsSeen = true;
      setSelectedObject({ ...selectedObject });
    } catch {}
  };

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.management_transfer_department}
            sheets={getSheets(records)}
            fileName="ManagementTransfers"
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
          onSeen={handleSeenTransfer}
          isOpen={showDetails}
          transfer={selectedObject}
        />
      )}
    </>
  );
};

export default UserDepartmentManagementTransfersPage;
