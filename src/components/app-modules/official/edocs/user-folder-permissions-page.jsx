import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Button, Tooltip } from "antd";
import { BsKeyFill as KeyIcon } from "react-icons/bs";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "./../../../../tools/utils";
import service from "./../../../../services/official/edocs/user-folder-permissions-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import PermissionModal from "./user-folder-permissions-modal";
import MemberProfileImage from "../../../common/member-profile-image";
import { usePageContext } from "./../../../contexts/page-context";

const { Text } = Typography;

const baseColumns = [
  {
    title: Words.id,
    width: 100,
    align: "center",
    dataIndex: "EmployeeID",
    sorter: getSorter("EmployeeID"),
    render: (EmployeeID) => <Text>{utils.farsiNum(`${EmployeeID}`)}</Text>,
  },
  {
    title: "",
    width: 75,
    align: "center",
    dataIndex: "PicFileName",
    render: (PicFileName) => <MemberProfileImage fileName={PicFileName} />,
  },
  {
    title: Words.first_name,
    width: 150,
    align: "center",
    dataIndex: "FirstName",
    sorter: getSorter("FirstName"),
    render: (FirstName) => (
      <Text style={{ color: Colors.blue[6] }}>{FirstName}</Text>
    ),
  },
  {
    title: Words.last_name,
    width: 175,
    align: "center",
    dataIndex: "LastName",
    sorter: getSorter("LastName"),
    render: (LastName) => (
      <Text style={{ color: Colors.blue[6] }}>{LastName}</Text>
    ),
  },
];

const recordID = "EmployeeID";

const UserFolderPermissionsPage = ({ pageName }) => {
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
    showDetails,
    setShowDetails,
  } = usePageContext();

  useMount(async () => {
    handleResetContext();
    await checkAccess(setAccess, pageName);
  });

  const { handleGetAll, handleSearch, handleResetContext } =
    GetSimplaDataPageMethods({
      service,
      recordID,
    });

  const getOperationalButtons = (record) => {
    return (
      <Tooltip title={Words.accesses}>
        <Button
          type="link"
          icon={<KeyIcon style={{ color: Colors.red[6], fontSize: 20 }} />}
          onClick={() => {
            setSelectedObject(record);
            setShowDetails(true);
          }}
        />
      </Tooltip>
    );
  };

  const columns = access
    ? getColumns(
        baseColumns,
        getOperationalButtons,
        access,
        null, //handleEdit,
        null //handleDelete
      )
    : [];

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.accesses}
            searchText={searchText}
            sheets={null}
            fileName="PageAccesses"
            onSearchTextChanged={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            onClear={() => setRecords([])}
            onGetAll={handleGetAll}
            onAdd={null}
          />

          <Col xs={24}>
            {searched && (
              <SimpleDataTable records={records} columns={columns} />
            )}
          </Col>
        </Row>
      </Spin>

      {showDetails && (
        <PermissionModal
          onOk={() => {
            setShowDetails(false);
            setSelectedObject(null);
          }}
          isOpen={showDetails}
          employee={selectedObject}
          access={access}
        />
      )}
    </>
  );
};

export default UserFolderPermissionsPage;
