import React, { useState } from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Tree, message, Badge, Space } from "antd";
import { AiFillFolder as FolderIcon } from "react-icons/ai";
import Words from "../../../../resources/words";
import service from "./../../../../services/official/edocs/user-folders-service";
import {
  checkAccess,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import FolderModal from "./user-folder-modal";
import PermissionsModal from "./user-permissions-modal";
import { usePageContext } from "./../../../contexts/page-context";
import Colors from "./../../../../resources/colors";
import { handleError } from "./../../../../tools/form-manager";

const { Text } = Typography;
const groupIconProps = { fontSize: 16, color: Colors.blue[6] };
const rootIconProps = { fontSize: 16, color: Colors.green[6] };
const leafIconProps = { fontSize: 16, color: Colors.magenta[6] };

const recordID = "FolderID";

const UserFoldersPage = ({ pageName }) => {
  const {
    progress,
    setProgress,
    searchText,
    setSearchText,
    records,
    setRecords,
    access,
    setAccess,
    selectedObject,
    setSelectedObject,
    showModal,
    setShowModal,
  } = usePageContext();

  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [groupID, setGroupID] = useState(0);

  const getSubFolders = (folder) => {
    let subFolders = [];

    folder.SubFolders.forEach((sub) => {
      subFolders = [
        ...subFolders,
        {
          title: (
            <Space>
              <Text> {sub.Title}</Text>
              <Badge
                count={sub.Documents}
                style={{ backgroundColor: Colors.orange[5] }}
              />
            </Space>
          ),
          key: `sub-folder-${sub.FolderID}`,
          icon: <FolderIcon style={leafIconProps} />,
        },
      ];
    });

    return subFolders;
  };

  const getGroupFolders = (group) => {
    let folders = [];

    group.Folders?.filter((f) => f.ParentFolderID === 0).forEach((folder) => {
      folders = [
        ...folders,
        {
          title: (
            <Space>
              <Text> {folder.Title}</Text>
              <Badge
                count={folder.Documents}
                style={{ backgroundColor: Colors.orange[5] }}
              />
            </Space>
          ),
          key: `folder-${folder.FolderID}`,
          icon: <FolderIcon style={rootIconProps} />,
          children: [...getSubFolders(folder)],
        },
      ];
    });

    return folders;
  };

  const getTreeData = () => {
    let result = [];

    if (records.length > 0) {
      records.forEach((group) => {
        result = [
          ...result,
          {
            title: group.Title,
            key: `group-${group.GroupID}`,
            icon: <FolderIcon style={groupIconProps} />,
            children: [...getGroupFolders(group)],
          },
        ];
      });
    }

    return result;
  };

  useMount(async () => {
    handleResetContext();
    await checkAccess(setAccess, pageName);

    await handleGetAll();
  });

  const {
    handleCloseModal,
    handleGetAll,
    handleSearch,
    handleAdd,
    handleResetContext,
  } = GetSimplaDataPageMethods({
    service,
    recordID,
  });

  const handleDelete = async (row) => {
    setProgress(true);

    try {
      let result = await service.deleteData(row[recordID]);

      if (result.Message) {
        message.success(result.Message);
      } else {
        message.error(result.Error);
      }

      await handleGetAll();
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleSave = async (row) => {
    await service.saveData(row);
    await handleGetAll();
  };

  const onSelect = (keys, info) => {
    const folderID = parseInt(
      info.node.key.replace("sub-folder-", "").replace("folder-", "")
    );

    let selected_folder = null;
    for (const group of records) {
      for (const folder of group.Folders) {
        if (folder.FolderID === folderID) {
          selected_folder = folder;
          selected_folder.GroupID = group.GroupID;
          break;
        }

        if (!selected_folder) {
          for (const subFolder of folder.SubFolders) {
            if (subFolder.FolderID === folderID) {
              selected_folder = subFolder;
              selected_folder.GroupID = group.GroupID;
              break;
            }
          }
        }
      }

      if (selected_folder !== null) break;
    }

    if (selected_folder) {
      setSelectedObject(selected_folder);
      setShowModal(true);
    } else {
      const groupID = parseInt(info.node.key.replace("group-", ""));
      setGroupID(groupID);
      setShowPermissionsModal(true);
    }
  };

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.folders_structure}
            searchText={searchText}
            fileName="Folders"
            onSearchTextChanged={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            onClear={() => setRecords([])}
            onGetAll={handleGetAll}
            onAdd={access?.CanAdd && handleAdd}
          />

          <Col xs={24}>
            <Tree
              showLine={{ showLeafIcon: false }}
              showIcon
              defaultExpandAll
              // defaultSelectedKeys={["0-0-0"]}
              treeData={getTreeData()}
              onSelect={onSelect}
            />
          </Col>
        </Row>
      </Spin>

      {showModal && (
        <FolderModal
          isOpen={showModal}
          selectedObject={selectedObject}
          access={access}
          onOk={handleSave}
          onCancel={handleCloseModal}
          onDelete={handleDelete}
        />
      )}

      {showPermissionsModal && (
        <PermissionsModal
          isOpen={showPermissionsModal}
          selectedObject={{ LevelTypeID: 1, LevelID: groupID }}
          access={access}
          onOk={() => setShowPermissionsModal(false)}
        />
      )}
    </>
  );
};

export default UserFoldersPage;
