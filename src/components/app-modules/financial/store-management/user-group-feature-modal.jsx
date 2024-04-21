import React, { useState } from "react";
import { useMount } from "react-use";
import {
  Form,
  Row,
  Col,
  Typography,
  Divider,
  Button,
  Popconfirm,
  Space,
} from "antd";
import {
  PlusOutlined as AddIcon,
  DeleteOutlined as DeleteIcon,
  EditOutlined as EditIcon,
  QuestionCircleOutlined as QuestionIcon,
} from "@ant-design/icons";
import Joi from "joi-browser";
import ModalWindow from "./../../../common/modal-window";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import service from "../../../../services/financial/store-mgr/user-group-features-service";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
  getSorter,
} from "../../../../tools/form-manager";
import InputItem from "./../../../form-controls/input-item";
import DropdownItem from "./../../../form-controls/dropdown-item";
import SwitchItem from "./../../../form-controls/switch-item";
import { handleError } from "./../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "./../../../contexts/modal-context";
import DetailsTable from "../../../common/details-table";
import ItemModal from "./user-group-feature-item-modal";
import { getFieldValue } from "./user-group-feature-item-columns-code";
import { v4 as uuid } from "uuid";

const { Text } = Typography;

const schema = {
  GroupFeatureID: Joi.number().required(),
  FeatureTypeID: Joi.number().min(1).required().label(Words.type),
  Title: Joi.string()
    .min(2)
    .max(50)
    .required()
    .label(Words.title)
    .regex(utils.VALID_REGEX),
  IsActive: Joi.boolean(),
  Items: Joi.array(),
};

const initRecord = {
  GroupFeatureID: 0,
  FeatureTypeID: 0,
  Title: "",
  IsActive: true,
  Items: [],
};

const formRef = React.createRef();

const getItemColumns = (featureTypeID, access, onEdit, onDelete) => {
  let columns = [
    // {
    //   title: Words.id,
    //   width: 75,
    //   align: "center",
    //   dataIndex: "ItemID",
    //   sorter: getSorter("ItemID"),
    //   render: (ItemID) => <Text>{utils.farsiNum(`${ItemID}`)}</Text>,
    // },
    {
      title: Words.code,
      width: 120,
      align: "center",
      dataIndex: "ItemCode",
      sorter: getSorter("ItemCode"),
      render: (ItemCode) => (
        <Text
          style={{
            color: Colors.green[6],
          }}
        >
          {ItemCode}
        </Text>
      ),
    },
    {
      title: Words.value,
      width: 100,
      align: "center",
      // Not Work!!!
      //   dataIndex: getValueField(featureTypeID),
      //   sorter: getValueField(featureTypeID),
      render: (record) => (
        <Text
          style={{
            color: Colors.orange[6],
          }}
        >
          {getFieldValue(featureTypeID, record)}
        </Text>
      ),
    },
  ];

  const { CanEdit, CanDelete } = access;

  if ((CanEdit && onEdit) || (CanDelete && onDelete)) {
    columns = [
      ...columns,
      {
        title: "",
        fixed: "right",
        align: "center",
        width: 75,
        render: (record) => (
          <Space>
            {record.Editable && CanEdit && onEdit && (
              <Button
                type="link"
                icon={<EditIcon />}
                onClick={() => onEdit(record)}
              />
            )}

            {record.Deletable && CanDelete && onDelete && (
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

  return columns;
};

const UserGroupFeatureModal = ({
  isOpen,
  selectedObject,
  access,
  onOk,
  onCancel,
  onSaveItem,
  onDeleteItem,
}) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [featureTypes, setFeatureTypes] = useState([]);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.FeatureTypeID = 0;
    record.Title = "";
    record.IsActive = true;
    record.Items = [];

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();
    setRecord(initRecord);
    initModal(formRef, selectedObject, setRecord);

    setProgress(true);
    try {
      const data = await service.getParams();

      const { FeatureTypes } = data;

      setFeatureTypes(FeatureTypes);
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

  const handleNewButtonClick = () => {
    setShowItemsModal(true);
  };

  //------

  const handleSaveItem = async (item) => {
    if (selectedObject !== null) {
      item.GroupFeatureID = selectedObject.GroupFeatureID;

      const saved_item = await onSaveItem(item);

      const index = record.Items.findIndex((i) => i.ItemID === item.ItemID);

      if (index === -1) {
        record.Items = [...record.Items, saved_item];
      } else {
        record.Items[index] = saved_item;
      }
    } else {
      item.Editable = true;
      item.Deletable = true;

      //--- managing unique id (UID) for new items
      if (item.ItemID === 0 && selectedItem === null) {
        item.UID = uuid();
        record.Items = [...record.Items, item];
      } else if (item.ItemID === 0 && selectedItem !== null) {
        const index = record.Items.findIndex((i) => i.UID === selectedItem.UID);
        record.Items[index] = item;
      }
    }

    //------

    setRecord({ ...record });
    setSelectedItem(null);
  };

  const handleDeleteItem = async (item) => {
    setProgress(true);

    try {
      if (item.ItemID > 0) {
        await onDeleteItem(item.ItemID);

        record.Items = record.Items.filter((i) => i.ItemID !== item.ItemID);
      } else {
        record.Items = record.Items.filter((i) => i.UID !== item.UID);
      }

      setRecord({ ...record });
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleEditItem = (data) => {
    setSelectedItem(data);
    setShowItemsModal(true);
  };

  const handleCloseItemModal = () => {
    setSelectedItem(null);
    setShowItemsModal(false);
  };

  //------

  return (
    <>
      <ModalWindow
        isOpen={isOpen}
        isEdit={isEdit}
        inProgress={progress}
        disabled={validateForm({ record, schema }) && true}
        onClear={clearRecord}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        width={650}
      >
        <Form ref={formRef} name="dataForm">
          <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
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
            <Col xs={24} md={12}>
              <DropdownItem
                title={Words.type}
                dataSource={featureTypes}
                keyColumn="FeatureTypeID"
                valueColumn="Title"
                formConfig={formConfig}
                required
                disabled={record.Items?.length > 0}
              />
            </Col>
            <Col xs={24} md={12}>
              <SwitchItem
                title={Words.status}
                fieldName="IsActive"
                initialValue={true}
                checkedTitle={Words.active}
                unCheckedTitle={Words.inactive}
                formConfig={formConfig}
              />
            </Col>
            {record.FeatureTypeID < 5 && (
              <>
                <Col xs={24}>
                  <Divider orientation="right" plain>
                    <Text>{Words.fixed_values}</Text>
                  </Divider>
                </Col>
                {record.Items && (
                  <Col xs={24}>
                    <DetailsTable
                      records={record.Items}
                      columns={getItemColumns(
                        record.FeatureTypeID,
                        access,
                        handleEditItem,
                        handleDeleteItem
                      )}
                      emptyDataMessage={Words.no_feature_item_value}
                    />
                  </Col>
                )}
                <Col xs={24}>
                  <Button
                    type="primary"
                    onClick={handleNewButtonClick}
                    icon={<AddIcon />}
                    style={{ marginTop: 10 }}
                    disabled={record.FeatureTypeID === 0}
                  >
                    {Words.new}
                  </Button>
                </Col>
              </>
            )}
          </Row>
        </Form>
      </ModalWindow>

      {showItemsModal && (
        <ItemModal
          onOk={handleSaveItem}
          onCancel={handleCloseItemModal}
          isOpen={showItemsModal}
          selectedObject={
            selectedItem
          } /* selected object for ItemModal is selectedItem */
          featureTypeID={record.FeatureTypeID}
        />
      )}
    </>
  );
};

export default UserGroupFeatureModal;
