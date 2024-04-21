import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Space, Button, Popconfirm, Typography } from "antd";
import {
  QuestionCircleOutlined as QuestionIcon,
  DeleteOutlined as DeleteIcon,
} from "@ant-design/icons";
import Joi from "joi-browser";
import ModalWindow from "./../../../common/modal-window";
import Words from "../../../../resources/words";
import Colors from "./../../../../resources/colors";
import utils from "../../../../tools/utils";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
} from "../../../../tools/form-manager";
import InputItem from "./../../../form-controls/input-item";
import DropdownItem from "./../../../form-controls/dropdown-item";
import ColorItem from "./../../../form-controls/color-item";
import {
  useModalContext,
  useResetContext,
} from "./../../../contexts/modal-context";
import service from "./../../../../services/official/edocs/user-folders-service";
import { handleError } from "./../../../../tools/form-manager";
import PermissionsModal from "./user-permissions-modal";

const { Text } = Typography;

const schema = {
  FolderID: Joi.number().required(),
  GroupID: Joi.number().required(),
  ParentFolderID: Joi.number().required(),
  Title: Joi.string()
    .min(2)
    .max(50)
    .required()
    .label(Words.title)
    .regex(utils.VALID_REGEX),
  Color: Joi.string().required(),
};

const initRecord = {
  FolderID: 0,
  GroupID: 0,
  ParentFolderID: 0,
  Title: "",
  Color: "",
};

const formRef = React.createRef();

const UserFolderModal = ({
  isOpen,
  selectedObject,
  access,
  onOk,
  onCancel,
  onDelete,
}) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [folderGroups, setFolderGroups] = useState([]);
  const [parentFolders, setParentFolders] = useState([]);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.GroupID = 0;
    record.ParentFolderID = 0;
    record.Title = "";
    record.Color = "";

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();
    setRecord(initRecord);
    initModal(formRef, selectedObject, setRecord);

    if (selectedObject !== null) {
      selectedObject.LevelTypeID = selectedObject.ParentFolderID === 0 ? 2 : 3;
      selectedObject.LevelID = selectedObject.FolderID;
    }

    setProgress(true);
    try {
      const data = await service.getParams();

      const { FolderGroups, Folders } = data;

      setFolderGroups(FolderGroups);
      setParentFolders(Folders);
    } catch (ex) {
      handleError(ex);
    }
    setProgress(false);
  });

  const isEdit = selectedObject !== null;

  const handleSubmit = async () => {
    saveModalChanges(
      formConfig,
      selectedObject,
      setProgress,
      onOk,
      clearRecord
    );
  };

  const getFilteredParentFolders = () => {
    const result = parentFolders
      .filter((folder) => folder.GroupID === record.GroupID)
      .filter(
        (folder) =>
          selectedObject === null || folder.FolderID !== selectedObject.FolderID
      );

    result.forEach((folder) => (folder.ParentFolderID = folder.FolderID));

    return result;
  };

  const handleChangeFolderGroup = (value) => {
    const rec = { ...record };
    rec.GroupID = value || 0;
    rec.ParentFolderID = 0;

    setRecord(rec);

    loadFieldsValue(formRef, rec);
  };

  const handleDelete = async () => {
    await onDelete(selectedObject);
    onCancel();
  };

  return (
    <>
      <ModalWindow
        isOpen={isOpen}
        isEdit={isEdit}
        inProgress={progress}
        disabled={validateForm({ record, schema }) && true}
        buttons={
          selectedObject && [
            selectedObject.SubFolders.length === 0 && (
              <Popconfirm
                title={Words.questions.sure_to_delete_folder}
                onConfirm={handleDelete}
                okText={Words.yes}
                cancelText={Words.no}
                icon={<QuestionIcon style={{ color: "red" }} />}
                key="submit-confirm"
                disabled={progress}
              >
                <Button type="primary" icon={<DeleteIcon />} danger>
                  {Words.delete}
                </Button>
              </Popconfirm>
            ),
            <Button onClick={() => setShowPermissionsModal(true)}>
              {Words.accesses}
            </Button>,
          ]
        }
        onClear={clearRecord}
        onSubmit={handleSubmit}
        onCancel={onCancel}
      >
        <Form ref={formRef} name="dataForm">
          <Row gutter={[5, 10]} style={{ marginLeft: 1 }}>
            <Col xs={24}>
              <DropdownItem
                title={Words.folder_group}
                dataSource={folderGroups}
                keyColumn="GroupID"
                valueColumn="Title"
                onChange={handleChangeFolderGroup}
                formConfig={formConfig}
                required
              />
            </Col>
            <Col xs={24}>
              <DropdownItem
                title={Words.parent_folder}
                dataSource={getFilteredParentFolders()}
                keyColumn="ParentFolderID"
                valueColumn="Title"
                formConfig={formConfig}
              />
            </Col>
            <Col xs={24}>
              <InputItem
                title={Words.title}
                fieldName="Title"
                required
                autoFocus
                maxLength={50}
                formConfig={formConfig}
              />
            </Col>
            <Col xs={24}>
              <ColorItem
                title={Words.color_code}
                fieldName="Color"
                required
                formConfig={formConfig}
              />
            </Col>

            {selectedObject !== null && (
              <>
                <Col xs={24}>
                  <Space>
                    <Text>{`${Words.registerar}:`}</Text>

                    <Text style={{ color: Colors.magenta[6] }}>
                      {`${selectedObject.FirstName} ${selectedObject.LastName}`}
                    </Text>
                  </Space>
                </Col>
                <Col xs={24}>
                  <Space>
                    <Text>{`${Words.reg_date_time}:`}</Text>

                    <Text style={{ color: Colors.magenta[6] }}>
                      {utils.farsiNum(
                        `${utils.slashDate(
                          selectedObject.RegDate
                        )} - ${utils.colonTime(selectedObject.RegTime)}`
                      )}
                    </Text>
                  </Space>
                </Col>
              </>
            )}
          </Row>
        </Form>
      </ModalWindow>

      {selectedObject !== null && showPermissionsModal && (
        <PermissionsModal
          isOpen={showPermissionsModal}
          selectedObject={selectedObject}
          access={access}
          onOk={() => setShowPermissionsModal(false)}
        />
      )}
    </>
  );
};

export default UserFolderModal;
