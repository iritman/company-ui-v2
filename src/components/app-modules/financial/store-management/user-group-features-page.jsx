import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import {
  AiFillLock as LockIcon,
  AiOutlineCheck as CheckIcon,
} from "react-icons/ai";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import service from "../../../../services/financial/store-mgr/user-group-features-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import GroupFeatureModal from "./user-group-feature-modal";
import DetailsModal from "./user-group-feature-details-modal";
import { usePageContext } from "../../../contexts/page-context";
import DetailsButton from "./../../../common/details-button";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "GroupFeatures",
    data: records,
    columns: [
      { label: Words.id, value: "GroupFeatureID" },
      { label: Words.title, value: "Title" },
      { label: Words.value_type, value: "FeatureTypeTitle" },
      {
        label: Words.status,
        value: (record) => (record.IsActive ? Words.active : Words.inactive),
      },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 75,
    align: "center",
    dataIndex: "GroupFeatureID",
    sorter: getSorter("GroupFeatureID"),
    render: (GroupFeatureID) => (
      <Text>{utils.farsiNum(`${GroupFeatureID}`)}</Text>
    ),
  },
  {
    title: Words.title,
    width: 200,
    align: "center",
    dataIndex: "Title",
    sorter: getSorter("Title"),
    render: (Title) => <Text style={{ color: Colors.blue[7] }}>{Title}</Text>,
  },
  {
    title: Words.type,
    width: 75,
    align: "center",
    dataIndex: "FeatureTypeTitle",
    sorter: getSorter("FeatureTypeTitle"),
    render: (FeatureTypeTitle) => (
      <Text style={{ color: Colors.green[6] }}>{FeatureTypeTitle}</Text>
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

const handleCheckEditable = (row) => row.Editable;
const handleCheckDeletable = (row) => row.Deletable;

const recordID = "GroupFeatureID";

const UserFeaturesPage = ({ pageName }) => {
  const {
    progress,
    searched,
    searchText,
    setSearchText,
    records,
    setRecords,
    access,
    setAccess,
    selectedObject,
    setSelectedObject,
    showModal,
    showDetails,
    setShowDetails,
  } = usePageContext();

  useMount(async () => {
    handleResetContext();
    await checkAccess(setAccess, pageName);
  });

  const {
    handleCloseModal,
    handleGetAll,
    handleSearch,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSave,
    handleResetContext,
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

  const handleSaveItem = async (item) => {
    const saved_item = await service.saveItem(item);

    const rec = { ...selectedObject };
    if (item.ItemID === 0) {
      rec.Items = [...rec.Items, saved_item];
    } else {
      const index = rec.Items.findIndex((i) => i.ItemID === item.ItemID);
      rec.Items[index] = saved_item;
    }
    setSelectedObject(rec);

    //------

    const feature_index = records.findIndex(
      (feature) => feature.GroupFeatureID === item.GroupFeatureID
    );

    records[feature_index] = rec;

    //------

    setRecords([...records]);

    return saved_item;
  };

  const handleDeleteItem = async (item_id) => {
    await service.deleteItem(item_id);

    if (selectedObject) {
      const rec = { ...selectedObject };
      rec.Items = rec.Items.filter((i) => i.ItemID !== item_id);
      setSelectedObject(rec);

      //------

      const feature_index = records.findIndex(
        (feature) => feature.GroupFeatureID === rec.GroupFeatureID
      );

      records[feature_index] = rec;

      setRecords([...records]);
    }
  };

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.group_features}
            searchText={searchText}
            sheets={getSheets(records)}
            fileName="GroupFeatures"
            onSearchTextChanged={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            onClear={() => setRecords([])}
            onGetAll={handleGetAll}
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
        <GroupFeatureModal
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
          access={access}
          onSaveItem={handleSaveItem}
          onDeleteItem={handleDeleteItem}
        />
      )}

      {showDetails && (
        <DetailsModal
          isOpen={showDetails}
          selectedObject={selectedObject}
          onOk={() => {
            setShowDetails(false);
            setSelectedObject(null);
          }}
        />
      )}
    </>
  );
};

export default UserFeaturesPage;
