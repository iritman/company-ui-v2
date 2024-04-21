import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Space, Typography, TreeSelect } from "antd";
import { FolderOpenFilled as FolderIcon } from "@ant-design/icons";
import Joi from "joi-browser";
import ModalWindow from "../../../common/modal-window";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
} from "../../../../tools/form-manager";
import SwitchItem from "../../../form-controls/switch-item";
import {
  useModalContext,
  useResetContext,
} from "../../../contexts/modal-context";
import service from "../../../../services/official/edocs/user-folder-permissions-service";
import { handleError } from "../../../../tools/form-manager";
import FolderNode from "../../../common/folder-node";

const { Text } = Typography;
const { TreeNode } = TreeSelect;

const FoldersList = ({ value, groups, folders, onChange }) => {
  return (
    <TreeSelect
      showSearch
      style={{
        width: "100%",
      }}
      value={value}
      dropdownStyle={{
        maxHeight: 400,
        overflow: "auto",
      }}
      placeholder={Words.select_folder}
      allowClear
      treeDefaultExpandAll
      onChange={onChange}
      treeLine={{
        showLeafIcon: false,
      }}
    >
      {groups.map((group) => (
        <TreeNode
          value={`group-${group.GroupID}`}
          title={<FolderNode title={group.Title} color={Colors.blue[6]} />}
        >
          {folders
            .filter(
              (f) => f.GroupID === group.GroupID && f.ParentFolderID === 0
            )
            .map((folder) => (
              <TreeNode
                value={`folder-${folder.FolderID}`}
                title={
                  <FolderNode title={folder.Title} color={Colors.green[6]} />
                }
              >
                {folders
                  .filter((f) => f.ParentFolderID === folder.FolderID)
                  .map((subFolder) => (
                    <TreeNode
                      value={`sub-folder-${subFolder.FolderID}`}
                      title={
                        <FolderNode
                          title={subFolder.Title}
                          color={Colors.magenta[6]}
                        />
                      }
                    ></TreeNode>
                  ))}
              </TreeNode>
            ))}
        </TreeNode>
      ))}
    </TreeSelect>
  );
};

const schema = {
  PermissionID: Joi.number().required(),
  LevelTypeID: Joi.number().required(),
  LevelID: Joi.number().required(),
  MemberID: Joi.number().required(),
  CanView: Joi.boolean(),
  CanAdd: Joi.boolean(),
  CanEdit: Joi.boolean(),
  CanDelete: Joi.boolean(),
};

const initRecord = (memberID, permission) => {
  let [levelTypeID, levelID] = [0, 0];

  if (permission) {
    const { LevelTypeID, LevelID } = permission;

    levelTypeID = LevelTypeID;
    levelID = LevelID;
  }

  return {
    PermissionID: 0,
    LevelTypeID: levelTypeID,
    LevelID: levelID,
    MemberID: memberID,
    CanView: true,
    CanAdd: true,
    CanEdit: true,
    CanDelete: true,
  };
};

const formRef = React.createRef();

const UserFolderPermissionModal = ({
  isOpen,
  selectedPermission,
  folderPath,
  employee,
  onOk,
  onCancel,
}) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [folderGroups, setFolderGroups] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolderTreeNode, setSelectedFolderTreeNode] =
    useState(undefined);

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.MemberID =
      selectedPermission === null ? 0 : selectedPermission.MemberID;
    record.CanView = true;
    record.CanAdd = true;
    record.CanEdit = true;
    record.CanDelete = true;

    setSelectedFolderTreeNode(undefined);

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();
    setRecord(initRecord(employee.MemberID, selectedPermission));
    initModal(formRef, selectedPermission, setRecord);

    setProgress(true);
    try {
      const data = await service.getParams();

      const { FolderGroups, Folders } = data;

      setFolderGroups(FolderGroups);
      setFolders(Folders);
    } catch (ex) {
      handleError(ex);
    }
    setProgress(false);
  });

  const isEdit = selectedPermission !== null;

  const handleSubmit = async () => {
    saveModalChanges(
      formConfig,
      selectedPermission,
      setProgress,
      onOk,
      clearRecord
    );
  };

  const handleSelectedFolderChange = (newValue) => {
    setSelectedFolderTreeNode(newValue);

    if (newValue.includes("group")) {
      record.LevelTypeID = 1;
      record.LevelID = parseInt(newValue.replace("group-", ""));
    } else if (newValue.includes("sub-folder-")) {
      record.LevelTypeID = 3;
      record.LevelID = parseInt(newValue.replace("sub-folder-", ""));
    } else {
      record.LevelTypeID = 2;
      record.LevelID = parseInt(newValue.replace("folder-", ""));
    }

    setRecord({ ...record });
  };

  // ------

  return (
    <ModalWindow
      isOpen={isOpen}
      isEdit={isEdit}
      inProgress={progress}
      disabled={validateForm({ record, schema }) && true}
      onClear={clearRecord}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      width={700}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 10]} style={{ marginLeft: 1 }}>
          {selectedPermission && (
            <Col xs={24}>
              <Space>
                <FolderIcon style={{ color: Colors.orange[6] }} />
                {folderPath}
              </Space>
            </Col>
          )}

          {!selectedPermission && (
            <Col xs={24}>
              <FoldersList
                value={selectedFolderTreeNode}
                groups={folderGroups}
                folders={folders}
                onChange={handleSelectedFolderChange}
              />
            </Col>
          )}

          <Col xs={12} md={6}>
            <SwitchItem
              title={Words.can_view}
              fieldName="CanView"
              initialValue={true}
              checkedTitle={Words.yes}
              unCheckedTitle={Words.no}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={12} md={6}>
            <SwitchItem
              title={Words.can_add}
              fieldName="CanAdd"
              initialValue={true}
              checkedTitle={Words.yes}
              unCheckedTitle={Words.no}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={12} md={6}>
            <SwitchItem
              title={Words.can_edit}
              fieldName="CanEdit"
              initialValue={true}
              checkedTitle={Words.yes}
              unCheckedTitle={Words.no}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={12} md={6}>
            <SwitchItem
              title={Words.can_delete}
              fieldName="CanDelete"
              initialValue={true}
              checkedTitle={Words.yes}
              unCheckedTitle={Words.no}
              formConfig={formConfig}
            />
          </Col>

          {selectedPermission !== null && (
            <>
              <Col xs={24}>
                <Space>
                  <Text>{`${Words.registerar}:`}</Text>

                  <Text style={{ color: Colors.magenta[6] }}>
                    {`${selectedPermission.RegFirstName} ${selectedPermission.RegLastName}`}
                  </Text>
                </Space>
              </Col>
              <Col xs={24}>
                <Space>
                  <Text>{`${Words.reg_date_time}:`}</Text>

                  <Text style={{ color: Colors.magenta[6] }}>
                    {utils.farsiNum(
                      `${utils.slashDate(
                        selectedPermission.RegDate
                      )} - ${utils.colonTime(selectedPermission.RegTime)}`
                    )}
                  </Text>
                </Space>
              </Col>
            </>
          )}
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default UserFolderPermissionModal;
