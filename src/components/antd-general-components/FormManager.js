import React from "react";
import { Label } from "./Label";
import accessesService from "../../services/app/accesses-service";
import { Space, Button, Popconfirm, message, Popover, Typography } from "antd";
import {
  EditOutlined as EditIcon,
  QuestionCircleOutlined as QuestionIcon,
  DeleteOutlined as DeleteIcon,
} from "@ant-design/icons";
import { MdInfoOutline as InfoIcon } from "react-icons/md";
import Words from "../../resources/words";
import Colors from "../../resources/colors";

const { Text } = Typography;

export const getSorter = (fieldName) => (a, b) => {
  if (a[fieldName] < b[fieldName]) return -1;
  if (a[fieldName] > b[fieldName]) return 1;
  return 0;
};

export const emptyColumn = {
  title: "",
  fixed: "right",
  align: "center",
  width: 1,
  render: () => <></>,
};

export const modifyColumn = (access, onEdit, onDelete) => {
  return {
    title: "",
    fixed: "right",
    align: "center",
    width: 75,
    render: (record) => (
      <Space>
        {access.CanDelete && onDelete && (
          <Popconfirm
            title={Words.questions.sure_to_delete_selected_item}
            onConfirm={async () => await onDelete(record)}
            okText={Words.yes}
            cancelText={Words.no}
            icon={<QuestionIcon style={{ color: "red" }} />}
          >
            <Button type="link" icon={<DeleteIcon />} danger />
          </Popconfirm>
        )}

        {access.CanEdit && onEdit && (
          <Button
            type="link"
            icon={<EditIcon />}
            onClick={() => onEdit(record)}
          />
        )}
      </Space>
    ),
  };
};

export const getColumn = (title, width, fieldName, config = {}) => {
  const {
    align = "center",
    noDataIndex = false,
    noSorter = false,
    isDescriptions = false,
    labelProps = {},
    renderFunc = null,
  } = config;

  let column = {
    title,
    width,
    align,
    // dataIndex: fieldName,
    // sorter: getSorter(fieldName),
    render: (data) => (
      <>
        {isDescriptions ? (
          <>
            {data[fieldName]?.length > 0 && (
              <Popover content={<Text>{data[fieldName]}</Text>}>
                <InfoIcon
                  style={{
                    color: Colors.green[6],
                    fontSize: 19,
                    cursor: "pointer",
                  }}
                />
              </Popover>
            )}
          </>
        ) : (
          <Label {...labelProps}>{renderFunc ? renderFunc(data) : data}</Label>
        )}
      </>
    ),
  };

  if (!noDataIndex) column = { ...column, dataIndex: fieldName };

  if (!noSorter) column = { ...column, sorter: getSorter(fieldName) };

  return column;
};

export const getSheetColumn = (label, fieldName, renderFunc = null) => {
  return {
    label,
    value: renderFunc || fieldName,
  };
};

export const getSheets = (title, data, columns) => [
  {
    title,
    data,
    columns,
  },
];

export const checkAccess = async (setAccess, pageName) => {
  try {
    const userAccess = await accessesService.getPageAccess(pageName);

    setAccess(userAccess);
  } catch (ex) {
    window.location = "/invalid-access";
  }
};

export const getPageColumns = (
  baseColumns,
  getOperationalButtons,
  access,
  onEdit,
  onDelete,
  checkEditableFunc,
  checkDeletableFunc,
  colWidth
) => {
  const { CanEdit, CanDelete } = access;
  let columns = baseColumns;

  if ((CanEdit && onEdit) || (CanDelete && onDelete) || getOperationalButtons) {
    columns = [
      ...columns,
      {
        title: "",
        fixed: "right",
        align: "center",
        width: colWidth || 110,
        render: (record) => (
          <Space>
            {getOperationalButtons && getOperationalButtons(record)}

            {CanEdit &&
              onEdit &&
              (!checkEditableFunc || checkEditableFunc(record) === true) && (
                <Button
                  type="link"
                  icon={<EditIcon />}
                  onClick={() => onEdit(record)}
                />
              )}

            {CanDelete &&
              onDelete &&
              (!checkDeletableFunc || checkDeletableFunc(record) === true) && (
                <Popconfirm
                  title={Words.questions.sure_to_delete_item}
                  onConfirm={async () => await onDelete(record)}
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

  columns.forEach((col, index) => {
    col.key = index;
  });

  return columns;
};

export const handleError = (ex) => {
  if (ex.response && ex.response.status === 400) {
    if (ex.response.data.Error) {
      message.error(ex.response.data.Error);
    } else {
      message.error(Words.messages.operation_failed);
    }
  } else if (ex.errorFields && ex.errorFields.length > 0) {
    // Antd form validation error
  } else {
    message.error(Words.messages.operation_failed);
  }
};
