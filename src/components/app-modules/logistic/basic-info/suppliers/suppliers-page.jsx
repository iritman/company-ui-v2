import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import {
  AiFillLock as LockIcon,
  AiOutlineCheck as CheckIcon,
} from "react-icons/ai";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import service from "../../../../../services/logistic/basic-info/suppliers-service";
import {
  checkAccess,
  getSorter,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../../tools/form-manager";
import SimpleDataTable from "../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../common/simple-data-page-header";
import { usePageContext } from "../../../../contexts/page-context";
import SearchModal from "./suppliers-search-modal";
import DetailsModal from "./supplier-details-modal";
import SupplierModal from "./supplier-modal";
import DetailsButton from "../../../../common/details-button";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "Suppliers",
    data: records,
    columns: [
      { label: Words.id, value: "SupplierID" },
      { label: Words.tafsil_account, value: "TafsilAccountTitle" },
      { label: Words.tafsil_code, value: "TafsilCode" },
      {
        label: Words.relation_start_date,
        value: (record) => utils.slashDate(record.RelationStartDate),
      },
      { label: Words.activity_type, value: "ActivityTypeTitle" },
      { label: Words.details_text, value: "DetailsText" },
      {
        label: Words.status,
        value: (record) => (record.IsActive ? Words.active : Words.inactive),
      },
      { label: Words.reg_date, value: "RegDate" },
      { label: Words.reg_time, value: "RegTime" },
      {
        label: Words.reg_member,
        value: (record) => `${record.RegFirstName} ${record.RegLastName}`,
      },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 100,
    align: "center",
    dataIndex: "SupplierID",
    sorter: getSorter("SupplierID"),
    render: (SupplierID) => <Text>{utils.farsiNum(`${SupplierID}`)}</Text>,
  },
  {
    title: Words.tafsil_account,
    width: 250,
    align: "center",
    dataIndex: "TafsilAccountTitle",
    sorter: getSorter("TafsilAccountTitle"),
    render: (TafsilAccountTitle) => (
      <Text style={{ color: Colors.blue[6] }}>
        {utils.farsiNum(TafsilAccountTitle)}
      </Text>
    ),
  },
  {
    title: Words.activity_type,
    width: 150,
    align: "center",
    dataIndex: "ActivityTypeTitle",
    sorter: getSorter("ActivityTypeTitle"),
    render: (ActivityTypeTitle) => (
      <Text style={{ color: Colors.purple[6] }}>{ActivityTypeTitle}</Text>
    ),
  },
  {
    title: Words.status,
    width: 75,
    align: "center",
    sorter: getSorter("IsActive"),
    render: (record) =>
      record.IsActive ? (
        <CheckIcon style={{ color: Colors.green[6] }} />
      ) : (
        <LockIcon style={{ color: Colors.red[6] }} />
      ),
  },
];

const recordID = "SupplierID";

const SuppliersPage = ({ pageName }) => {
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
    showModal,
    filter,
    setFilter,
  } = usePageContext();

  useMount(async () => {
    handleResetContext();

    await checkAccess(setAccess, pageName);
  });

  const {
    handleCloseModal,
    handleResetContext,
    handleAdvancedSearch,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSave,
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
        handleDelete
        // handleCheckEditable,
        // handleCheckDeletable
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
            title={Words.suppliers}
            sheets={getSheets(records, "Suppliers")}
            fileName="Suppliers"
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

      {showSearchModal && (
        <SearchModal
          onOk={handleAdvancedSearch}
          onCancel={() => setShowSearchModal(false)}
          isOpen={showSearchModal}
          filter={filter}
        />
      )}

      {showModal && (
        <SupplierModal
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
          selectedObject={selectedObject}
        />
      )}
    </>
  );
};

export default SuppliersPage;
