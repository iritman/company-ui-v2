import React, { useState } from "react";
import { useMount } from "react-use";
import {
  Row,
  Col,
  Space,
  Button,
  Typography,
  Popconfirm,
  Alert,
  Breadcrumb,
} from "antd";
import {
  PlusOutlined as PlusIcon,
  CheckOutlined as CheckIcon,
  CloseOutlined as CloseIcon,
  DeleteOutlined as DeleteIcon,
  EditOutlined as EditIcon,
  QuestionCircleOutlined as QuestionIcon,
  LeftOutlined as LeftIcon,
} from "@ant-design/icons";
import ModalWindow from "../../../common/modal-window";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import service from "../../../../services/official/edocs/user-folder-permissions-service";
import PermissionModal from "./user-folder-permission-modal";
import { handleError, getSorter } from "../../../../tools/form-manager";
import DetailsTable from "../../../common/details-table";

const { Text } = Typography;

const PathViewer = ({ levelInfo }) => {
  let result = <></>;

  if (levelInfo !== null) {
    let titles = [];

    const { GroupTitle, ParentFolderTitle, FolderTitle } = levelInfo;

    titles = [...titles, { Title: GroupTitle }];
    if (ParentFolderTitle.length > 0)
      titles = [...titles, { Title: ParentFolderTitle }];
    if (FolderTitle.length > 0) titles = [...titles, { Title: FolderTitle }];

    result = (
      <Breadcrumb
        separator={<LeftIcon style={{ color: Colors.cyan[6], fontSize: 12 }} />}
      >
        {titles.map((folder_path) => (
          <Breadcrumb.Item>
            {
              <Text style={{ color: Colors.magenta[5] }}>
                {folder_path.Title}
              </Text>
            }
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    );
  }

  return result;
};

const getPermissionsColumns = (access, onDelete, onEdit) => {
  let columns = [
    {
      title: Words.id,
      width: 75,
      align: "center",
      dataIndex: "PermissionID",
      sorter: getSorter("PermissionID"),
      render: (PermissionID) => (
        <Text>{utils.farsiNum(`${PermissionID}`)}</Text>
      ),
    },
    {
      title: Words.access_path,
      width: 200,
      align: "center",
      //   sorter: getSorter("LevelInfo"),
      dataIndex: "LevelInfo",
      render: (LevelInfo) => <PathViewer levelInfo={LevelInfo} />,
    },
    {
      title: Words.just_view,
      width: 50,
      align: "center",
      dataIndex: "CanView",
      sorter: getSorter("CanView"),
      render: (CanView) => (
        <>
          {CanView ? (
            <CheckIcon style={{ color: Colors.green[6] }} />
          ) : (
            <CloseIcon style={{ color: Colors.red[6] }} />
          )}
        </>
      ),
    },
    {
      title: Words.just_add,
      width: 50,
      align: "center",
      dataIndex: "CanAdd",
      sorter: getSorter("CanAdd"),
      render: (CanAdd) => (
        <>
          {CanAdd ? (
            <CheckIcon style={{ color: Colors.green[6] }} />
          ) : (
            <CloseIcon style={{ color: Colors.red[6] }} />
          )}
        </>
      ),
    },
    {
      title: Words.just_edit,
      width: 50,
      align: "center",
      dataIndex: "CanEdit",
      sorter: getSorter("CanEdit"),
      render: (CanEdit) => (
        <>
          {CanEdit ? (
            <CheckIcon style={{ color: Colors.green[6] }} />
          ) : (
            <CloseIcon style={{ color: Colors.red[6] }} />
          )}
        </>
      ),
    },
    {
      title: Words.just_delete,
      width: 50,
      align: "center",
      dataIndex: "CanDelete",
      sorter: getSorter("CanDelete"),
      render: (CanDelete) => (
        <>
          {CanDelete ? (
            <CheckIcon style={{ color: Colors.green[6] }} />
          ) : (
            <CloseIcon style={{ color: Colors.red[6] }} />
          )}
        </>
      ),
    },
  ];

  if (access.CanEdit || access.CanDelete) {
    columns = [
      ...columns,
      {
        title: "",
        fixed: "right",
        align: "center",
        width: 75,
        render: (record) => (
          <Space>
            {access.CanEdit && (
              <Button
                type="link"
                icon={<EditIcon />}
                onClick={async () => await onEdit(record)}
              />
            )}

            {access.CanDelete && (
              <Popconfirm
                title={Words.questions.sure_to_delete_permission}
                onConfirm={async () => await onDelete(record.PermissionID)}
                okText={Words.yes}
                cancelText={Words.no}
                icon={<QuestionIcon style={{ color: "red" }} />}
              >
                <Button type="link" icon={<DeleteIcon />} danger />
              </Popconfirm>
            )}
          </Space>
        ),
      },
    ];
  }

  return columns;
};

const UserFolderPermissionsModal = ({ isOpen, employee, access, onOk }) => {
  const [permissions, setPermissions] = useState([]);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [progress, setProgress] = useState(false);

  useMount(async () => {
    setProgress(true);

    try {
      const data = await service.getEmployeeFolderPermissions(
        employee.MemberID
      );

      setPermissions(data);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  });

  const handleClosePermissionModal = () => {
    setSelectedPermission(null);
    setShowPermissionModal(false);
  };

  const handleSubmit = async (record) => {
    const data = await service.saveData(record);

    if (record.PermissionID === 0) {
      setPermissions([...permissions, data]);
    } else {
      const index = permissions.findIndex(
        (p) => p.PermissionID === data.PermissionID
      );

      permissions[index] = data;
      setPermissions([...permissions]);
    }
  };

  const handleDelete = async (recordID) => {
    setProgress(true);

    try {
      await service.deleteData(recordID);

      setPermissions([
        ...permissions.filter((p) => p.PermissionID !== recordID),
      ]);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleEdit = (rec) => {
    setSelectedPermission(rec);
    setShowPermissionModal(true);
  };

  // ------

  return (
    <>
      <ModalWindow
        title={Words.accesses}
        isOpen={isOpen}
        inProgress={progress}
        footer={[
          <Button key="submit-button" onClick={onOk}>
            {Words.close}
          </Button>,
        ]}
        onSubmit={onOk}
        onCancel={onOk}
        width={850}
      >
        <Row gutter={[5, 10]} style={{ marginLeft: 1 }}>
          <Col xs={24}>
            <Alert
              type="error"
              message={
                <Text
                  style={{ color: Colors.red[6] }}
                >{`${employee.FirstName} ${employee.LastName}`}</Text>
              }
            />
          </Col>
          <Col xs={24}>
            <Button
              type="primary"
              icon={<PlusIcon />}
              onClick={() => setShowPermissionModal(true)}
            >
              {Words.new_access}
            </Button>
          </Col>
          <Col xs={24}>
            <DetailsTable
              records={permissions}
              columns={getPermissionsColumns(access, handleDelete, handleEdit)}
            />
          </Col>
        </Row>
      </ModalWindow>

      {showPermissionModal && (
        <PermissionModal
          isOpen={showPermissionModal}
          selectedPermission={selectedPermission}
          folderPath={
            selectedPermission ? (
              <PathViewer levelInfo={selectedPermission.LevelInfo} />
            ) : (
              <></>
            )
          }
          employee={employee}
          onOk={handleSubmit}
          onCancel={handleClosePermissionModal}
        />
      )}
    </>
  );
};

export default UserFolderPermissionsModal;
