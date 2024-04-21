import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Button } from "antd";
import { InfoCircleOutlined as InfoIcon } from "@ant-design/icons";
import Words from "../../../../resources/words";
import utils from "./../../../../tools/utils";
import service from "./../../../../services/official/announces/user-my-announces-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  handleError,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import ChangableAnnounceModal from "./user-my-changable-announce-modal";
import AnnounceDetailsModal from "./announce-details-modal";
import SearchModal from "./user-my-announces-search-modal";
import { usePageContext } from "./../../../contexts/page-context";
import Colors from "./../../../../resources/colors";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "MyAnnounces",
    data: records,
    columns: [
      { label: Words.id, value: "AnnounceID" },
      { label: Words.title, value: "Title" },
      { label: Words.descriptions, value: "DetailsText" },
      {
        label: Words.contacts,
        value: (record) => JSON.stringify(record.Contacts),
      },
      {
        label: Words.seen_count,
        value: "SeenCount",
      },
      {
        label: Words.not_seen_count,
        value: (record) => record.Contacts.length - record.SeenCount,
      },
      {
        label: Words.registerar,
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
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 100,
    align: "center",
    dataIndex: "AnnounceID",
    sorter: getSorter("AnnounceID"),
    render: (AnnounceID) => <Text>{utils.farsiNum(`${AnnounceID}`)}</Text>,
  },
  {
    title: Words.title,
    width: 200,
    align: "center",
    dataIndex: "Title",
    sorter: getSorter("Title"),
    render: (Title) => (
      <Text style={{ color: Colors.blue[6] }}>{utils.farsiNum(Title)}</Text>
    ),
  },
  {
    title: Words.seen_count,
    width: 200,
    align: "center",
    // dataIndex: "SeenCount",
    sorter: getSorter("SeenCount"),
    render: (record) => (
      <Text style={{ color: Colors.orange[6] }}>
        {utils.farsiNum(`${record.SeenCount}/${record.Contacts.length}`)}
      </Text>
    ),
  },
  {
    title: Words.reg_date,
    width: 100,
    align: "center",
    dataIndex: "RegDate",
    sorter: getSorter("RegDate"),
    render: (RegDate) => (
      <Text style={{ color: Colors.cyan[6] }}>
        {utils.farsiNum(utils.slashDate(RegDate))}
      </Text>
    ),
  },
  {
    title: Words.reg_time,
    width: 100,
    align: "center",
    dataIndex: "RegTime",
    sorter: getSorter("RegTime"),
    render: (RegTime) => (
      <Text style={{ color: Colors.purple[6] }}>
        {utils.farsiNum(utils.colonTime(RegTime))}
      </Text>
    ),
  },
];

const recordID = "AnnounceID";

const UserMyAnnouncesPage = ({ pageName }) => {
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

    const default_search_filter = {
      FromDate: "",
      ToDate: "",
      SearchText: "",
    };
    setFilter(default_search_filter);
    handleSearch(default_search_filter);
  });

  const {
    handleCloseModal,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSave,
    handleResetContext,
  } = GetSimplaDataPageMethods({
    service,
    recordID,
  });

  const handleSearch = async (filter) => {
    setFilter(filter);
    setShowSearchModal(false);

    setProgress(true);

    try {
      const data = await service.searchArchiveData(filter);

      setRecords(data);
      setSearched(true);
    } catch (err) {
      handleError(err);
    }

    setProgress(false);
  };

  const getOperationalButtons = (record) => {
    return (
      <Button
        type="link"
        icon={<InfoIcon style={{ color: Colors.green[6] }} />}
        onClick={() => {
          setSelectedObject(record);
          setShowDetails(true);
        }}
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
            title={Words.my_announces}
            sheets={getSheets(records)}
            fileName="MyAnnounces"
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

      {showModal && (
        <ChangableAnnounceModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          onDelete={handleDelete}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}

      {showSearchModal && (
        <SearchModal
          onOk={handleSearch}
          onCancel={() => setShowSearchModal(false)}
          isOpen={showSearchModal}
          filter={filter}
        />
      )}

      {showDetails && (
        <AnnounceDetailsModal
          isOpen={showDetails}
          selectedObject={selectedObject}
          showContacts={true}
          onOk={() => {
            setShowDetails(false);
            setSelectedObject(null);
          }}
        />
      )}
    </>
  );
};

export default UserMyAnnouncesPage;
