import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Popover } from "antd";
import { MdOutlineTextsms as InfoIcon } from "react-icons/md";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import service from "../../../../../services/financial/store-operations/product-request-items-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
  handleError,
} from "../../../../../tools/form-manager";
import SimpleDataTable from "../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../common/simple-data-page-header";
import SearchModal from "./product-request-items-search-modal";
import DetailsModal from "./product-request-item-details-modal";
import { usePageContext } from "../../../../contexts/page-context";
import DetailsButton from "../../../../common/details-button";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "ProductRequestItems",
    data: records,
    columns: [
      { label: Words.id, value: "RequestID" },
      { label: Words.request_type, value: "RequestTypeTitle" },
      {
        label: Words.request_member,
        value: (record) =>
          `${record.RequestMemberFirstName} ${record.RequestMemberLastName}`,
      },
      { label: Words.front_side_type, value: "FrontSideTypeTitle" },
      { label: Words.front_side_account, value: "FrontSideAccountTitle" },
      {
        label: Words.request_date,
        value: (record) => utils.slashDate(record.PayDate),
      },
      {
        label: Words.need_date,
        value: (record) => utils.slashDate(record.NeededDate),
      },
      //   { label: Words.storage_center, value: "StorageCenterTitle" },
      { label: Words.from_store, value: "FromStoreTitle" },
      { label: Words.to_store, value: "ToStoreTitle" },
      {
        label: Words.status,
        value: "StatusTitle",
      },
      {
        label: Words.product,
        value: "ProductTitle",
      },
      {
        label: Words.product_code,
        value: "ProductCode",
      },
      {
        label: Words.measure_unit,
        value: "MeasureUnitTitle",
      },
      {
        label: Words.request_count,
        value: "RequestCount",
      },
      { label: Words.standard_description, value: "DetailsText" },
    ],
  },
];

const baseColumns = [
  {
    title: Words.request_id,
    width: 75,
    align: "center",
    dataIndex: "RequestID",
    sorter: getSorter("RequestID"),
    render: (RequestID) => <Text>{utils.farsiNum(`${RequestID}`)}</Text>,
  },
  {
    title: Words.request_type,
    width: 150,
    align: "center",
    dataIndex: "RequestTypeTitle",
    sorter: getSorter("RequestTypeTitle"),
    render: (RequestTypeTitle) => (
      <Text style={{ color: Colors.volcano[6] }}>{RequestTypeTitle}</Text>
    ),
  },
  {
    title: Words.request_member,
    width: 150,
    align: "center",
    // dataIndex: "RequestTypeTitle",
    sorter: getSorter("RequestMemberLastName"),
    render: (record) => (
      <Text>{`${record.RequestMemberFirstName} ${record.RequestMemberLastName}`}</Text>
    ),
  },
  {
    title: Words.front_side_type,
    width: 150,
    align: "center",
    dataIndex: "FrontSideTypeTitle",
    sorter: getSorter("FrontSideTypeTitle"),
    render: (FrontSideTypeTitle) => <Text>{FrontSideTypeTitle}</Text>,
  },
  {
    title: Words.front_side,
    width: 200,
    align: "center",
    dataIndex: "FrontSideAccountTitle",
    sorter: getSorter("FrontSideAccountTitle"),
    render: (FrontSideAccountTitle) => (
      <Text style={{ color: Colors.cyan[6] }}>
        {utils.farsiNum(FrontSideAccountTitle)}
      </Text>
    ),
  },
  {
    title: Words.request_date,
    width: 150,
    align: "center",
    dataIndex: "RequestDate",
    sorter: getSorter("RequestDate"),
    render: (RequestDate) => (
      <Text style={{ color: Colors.blue[6] }}>
        {utils.farsiNum(utils.slashDate(RequestDate))}
      </Text>
    ),
  },
  {
    title: Words.need_date,
    width: 150,
    align: "center",
    dataIndex: "NeededDate",
    sorter: getSorter("NeededDate"),
    render: (NeededDate) => (
      <Text style={{ color: Colors.blue[6] }}>
        {utils.farsiNum(utils.slashDate(NeededDate))}
      </Text>
    ),
  },
  {
    title: Words.from_store,
    width: 150,
    align: "center",
    dataIndex: "FromStoreTitle",
    sorter: getSorter("FromStoreTitle"),
    render: (FromStoreTitle) => <Text>{FromStoreTitle}</Text>,
  },
  {
    title: Words.to_store,
    width: 150,
    align: "center",
    dataIndex: "ToStoreTitle",
    sorter: getSorter("ToStoreTitle"),
    render: (ToStoreTitle) => <Text>{ToStoreTitle}</Text>,
  },
  {
    title: Words.status,
    width: 150,
    align: "center",
    dataIndex: "StatusTitle",
    sorter: getSorter("StatusTitle"),
    render: (StatusTitle) => (
      <Text style={{ color: Colors.blue[6] }}>{StatusTitle}</Text>
    ),
  },
  {
    title: Words.product,
    width: 200,
    align: "center",
    dataIndex: "ProductTitle",
    sorter: getSorter("ProductTitle"),
    render: (ProductTitle) => (
      <Text style={{ color: Colors.volcano[6] }}>{ProductTitle}</Text>
    ),
  },
  {
    title: Words.product_code,
    width: 150,
    align: "center",
    dataIndex: "ProductCode",
    sorter: getSorter("ProductCode"),
    render: (ProductCode) => (
      <Text style={{ color: Colors.green[6] }}>
        {utils.farsiNum(ProductCode)}
      </Text>
    ),
  },
  {
    title: Words.measure_unit,
    width: 150,
    align: "center",
    dataIndex: "MeasureUnitTitle",
    sorter: getSorter("MeasureUnitTitle"),
    render: (MeasureUnitTitle) => (
      <Text style={{ color: Colors.grey[6] }}>{MeasureUnitTitle}</Text>
    ),
  },
  {
    title: Words.request_count,
    width: 150,
    align: "center",
    dataIndex: "RequestCount",
    sorter: getSorter("RequestCount"),
    render: (RequestCount) => (
      <Text style={{ color: Colors.magenta[6] }}>
        {utils.farsiNum(RequestCount)}
      </Text>
    ),
  },
  {
    title: Words.descriptions,
    width: 100,
    align: "center",
    render: (record) => (
      <>
        {record.DetailsText.length > 0 && (
          <Popover content={<Text>{record.DetailsText}</Text>}>
            <InfoIcon
              style={{
                color: Colors.cyan[6],
                fontSize: 19,
                cursor: "pointer",
              }}
            />
          </Popover>
        )}
      </>
    ),
  },
];

const recordID = "RequestID";

const ProductRequestItemsPage = ({ pageName }) => {
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
    showSearchModal,
    setShowSearchModal,
    filter,
    setFilter,
  } = usePageContext();

  useMount(async () => {
    handleResetContext();
    await checkAccess(setAccess, pageName);
  });

  const { handleAdd, handleEdit, handleDelete, handleResetContext } =
    GetSimplaDataPageMethods({
      service,
      recordID,
    });

  const handleSearch = async (filter) => {
    setFilter(filter);
    setShowSearchModal(false);

    setProgress(true);

    try {
      const data = await service.searchData(filter);

      setRecords(data);
      setSearched(true);
    } catch (err) {
      handleError(err);
    }

    setProgress(false);
  };

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
        (row) => row.StatusID === 1, // can edit func
        (row) => row.StatusID === 1 // can delete func
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
            title={Words.product_request_items}
            sheets={getSheets(records)}
            fileName="ProductRequestItems"
            onSearch={() => setShowSearchModal(true)}
            onClear={handleClear}
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
          onOk={handleSearch}
          onCancel={() => setShowSearchModal(false)}
          isOpen={showSearchModal}
          filter={filter}
        />
      )}

      {showDetails && (
        <DetailsModal
          isOpen={showDetails}
          requestID={selectedObject.RequestID}
          onOk={() => {
            setShowDetails(false);
            setSelectedObject(null);
          }}
        />
      )}
    </>
  );
};

export default ProductRequestItemsPage;
