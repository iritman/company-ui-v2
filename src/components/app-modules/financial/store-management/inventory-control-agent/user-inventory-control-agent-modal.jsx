import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Divider, Typography } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../../common/modal-window";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
  getSorter,
  handleError,
} from "../../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "../../../../contexts/modal-context";
import service from "../../../../../services/financial/store-mgr/user-inventory-control-agents-service";
import DropdownItem from "./../../../../form-controls/dropdown-item";
import SwitchItem from "../../../../form-controls/switch-item";
import TextItem from "./../../../../form-controls/text-item";
import DetailsTable from "../../../../common/details-table";
import { getFieldValue } from "../user-group-feature-item-columns-code";

const { Text } = Typography;

const schema = {
  AgentID: Joi.number().required(),
  GroupFeatureID: Joi.number().min(1).required().label(Words.product_feature),
  IsActive: Joi.boolean(),
};

const initRecord = {
  AgentID: 0,
  GroupFeatureID: 0,
  IsActive: true,
};

const formRef = React.createRef();

const getItemColumns = (featureTypeID) => {
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

  return columns;
};

const UserInventoryControlAgentModal = ({
  isOpen,
  selectedObject,
  onOk,
  onCancel,
}) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [groupFeatures, setGroupFeatures] = useState([]);

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.GroupFeatureID = 0;
    record.IsActive = true;

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

      const { GroupFeatures } = data;

      setGroupFeatures(GroupFeatures);
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

  const selected_feature = groupFeatures.find(
    (gf) => gf.GroupFeatureID === record.GroupFeatureID
  );

  //------

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
            <DropdownItem
              title={Words.product_feature}
              dataSource={groupFeatures}
              keyColumn="GroupFeatureID"
              valueColumn="Title"
              formConfig={formConfig}
              required
            />
          </Col>
          <Col xs={24}>
            <SwitchItem
              title={Words.status}
              fieldName="IsActive"
              initialValue={true}
              checkedTitle={Words.active}
              unCheckedTitle={Words.inactive}
              formConfig={formConfig}
            />
          </Col>
          {record.GroupFeatureID > 0 && (
            <>
              <Col xs={24}>
                <Divider orientation="right" plain>
                  <Text>{Words.fixed_values}</Text>
                </Divider>
              </Col>
              {selected_feature && (
                <Col xs={24}>
                  <TextItem
                    title={Words.value_type}
                    value={`${selected_feature.FeatureTypeTitle}`}
                    valueColor={Colors.orange[6]}
                  />
                </Col>
              )}
              {selected_feature?.FeatureTypeID < 5 &&
                selected_feature?.Items && (
                  <Col xs={24}>
                    <DetailsTable
                      records={selected_feature?.Items}
                      columns={getItemColumns(selected_feature?.FeatureTypeID)}
                      emptyDataMessage={Words.no_feature_item_value}
                    />
                  </Col>
                )}
            </>
          )}
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default UserInventoryControlAgentModal;
