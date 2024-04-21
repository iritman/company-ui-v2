import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Button, Typography, Popconfirm, Alert } from "antd";
import {
  PlusOutlined as AddIcon,
  DeleteOutlined as DeleteIcon,
  QuestionCircleOutlined as QuestionIcon,
} from "@ant-design/icons";
import Joi from "joi-browser";
import ModalWindow from "./../../../common/modal-window";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
} from "../../../../tools/form-manager";
import InputItem from "./../../../form-controls/input-item";
import DropdownItem from "./../../../form-controls/dropdown-item";
import { getSorter, handleError } from "./../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "./../../../contexts/modal-context";
import service from "../../../../services/financial/store-mgr/user-bach-patterns-service";
import DetailsTable from "../../../common/details-table";

const { Text } = Typography;

const schema = {
  PatternID: Joi.number().required(),
  Title: Joi.string()
    .min(2)
    .max(50)
    .required()
    .label(Words.title)
    .regex(utils.VALID_REGEX),
  Features: Joi.array(),
};

const initRecord = {
  PatternID: 0,
  Title: "",
  Features: [],
};

const formRef = React.createRef();

const getFeaturesColumns = (access, onDelete) => {
  let columns = [
    {
      title: Words.id,
      width: 75,
      align: "center",
      dataIndex: "FeatureID",
      sorter: getSorter("FeatureID"),
      render: (FeatureID) => <Text>{utils.farsiNum(`${FeatureID}`)}</Text>,
    },
    {
      title: Words.title,
      width: 120,
      align: "center",
      dataIndex: "Title",
      sorter: getSorter("Title"),
      render: (Title) => (
        <Text
          style={{
            color: Colors.green[6],
          }}
        >
          {Title}
        </Text>
      ),
    },
    {
      title: Words.value_type,
      width: 100,
      align: "center",
      dataIndex: "ValueTypeTitle",
      sorter: getSorter("ValueTypeTitle"),
      render: (ValueTypeTitle) => (
        <Text
          style={{
            color: Colors.orange[6],
          }}
        >
          {ValueTypeTitle}
        </Text>
      ),
    },
  ];

  if (access.CanDelete && onDelete) {
    columns = [
      ...columns,
      {
        title: "",
        fixed: "right",
        align: "center",
        width: 75,
        render: (record) => (
          <>
            {access.CanDelete && onDelete && (
              <Popconfirm
                title={Words.questions.sure_to_delete_bach_pattern_feature}
                onConfirm={async () => await onDelete(record.FeatureID)}
                okText={Words.yes}
                cancelText={Words.no}
                icon={<QuestionIcon style={{ color: "red" }} />}
              >
                <Button type="link" icon={<DeleteIcon />} danger />
              </Popconfirm>
            )}
          </>
        ),
      },
    ];
  }

  return columns;
};

const UserBachPatternModal = ({
  access,
  isOpen,
  selectedObject,
  onOk,
  onCancel,
}) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [selectedFeatureID, setSelectedFeatureID] = useState(0);
  const [features, setFeatures] = useState([]);
  const [paramsFeatures, setParamsFeatures] = useState([]);

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.Title = "";
    record.Features = [];

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

      const { Features } = data;

      if (selectedObject !== null) {
        setFeatures(
          Features.filter(
            (f) =>
              selectedObject.Features.filter(
                (fx) => fx.FeatureID === f.FeatureID
              ).length === 0
          )
        );
      } else setFeatures(Features);

      setParamsFeatures(Features);
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

  const handleChangeFeature = (value) => {
    setSelectedFeatureID(value);
  };

  const handleAddFeature = () => {
    if (selectedFeatureID > 0) {
      record.Features = [
        ...record.Features,
        features.find((f) => f.FeatureID === selectedFeatureID),
      ];
      setRecord(record);

      //------

      const filtered_features = features.filter(
        (f) => f.FeatureID !== selectedFeatureID
      );
      setFeatures(filtered_features);

      //------

      setSelectedFeatureID(0);
    }
  };

  const handleDeleteFeature = (featureID) => {
    record.Features = record.Features.filter((f) => f.FeatureID !== featureID);
    setRecord(record);

    //------

    setFeatures([
      ...features,
      paramsFeatures.find((f) => f.FeatureID === featureID),
    ]);
  };

  return (
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
          <Col xs={24} md={20}>
            <DropdownItem
              title={Words.feature}
              dataSource={features}
              keyColumn="FeatureID"
              valueColumn="Title"
              //   formConfig={formConfig}
              onChange={handleChangeFeature}
            />
          </Col>
          <Col xs={24} md={4}>
            <Button
              icon={<AddIcon />}
              type="primary"
              style={{ marginBottom: 5 }}
              disabled={selectedFeatureID === 0}
              onClick={handleAddFeature}
            >
              {Words.select}
            </Button>
          </Col>
          {record.Features?.length > 0 && (
            <>
              <Col xs={24}>
                <Text style={{ fontSize: 12 }}>{Words.features}</Text>
              </Col>
              <Col xs={24}>
                <DetailsTable
                  records={record.Features}
                  columns={getFeaturesColumns(access, handleDeleteFeature)}
                />
              </Col>
            </>
          )}

          {record.Features?.length === 0 && (
            <Col xs={24}>
              <Alert
                type="error"
                showIcon
                message={
                  <Text style={{ fontSize: 12 }}>
                    {Words.messages.no_feature_selected}
                  </Text>
                }
              />
            </Col>
          )}
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default UserBachPatternModal;
