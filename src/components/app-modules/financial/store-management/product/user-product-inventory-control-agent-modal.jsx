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
} from "../../../../../tools/form-manager";
import DropdownItem from "../../../../form-controls/dropdown-item";
import TextItem from "../../../../form-controls/text-item";
import DetailsTable from "./../../../../common/details-table";
import { getFieldValue } from "../user-group-feature-item-columns-code";

const { Text } = Typography;

const schema = {
  PAID: Joi.number().required(),
  ProductID: Joi.number().required(),
  AgentID: Joi.number().min(1).required(),
};

const initRecord = (productID) => {
  return {
    PAID: 0,
    ProductID: productID,
    AgentID: 0,
  };
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

const UserProductInventoryControlAgentModal = ({
  isOpen,
  product,
  selectedInventoryControlAgent,
  inventoryControlAgents,
  onOk,
  onCancel,
}) => {
  const [progress, setProgress] = useState(false);
  const [record, setRecord] = useState({});
  const [errors, setErrors] = useState({});

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.AgentID = 0;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    setRecord(initRecord(product ? product.ProductID : 0));
    initModal(formRef, selectedInventoryControlAgent, setRecord);

    // if (selectedInventoryControlAgent !== null) {
    //   setValueTypeID(selectedInventoryControlAgent.ValueTypeID);

    //   const completePropsFeature = { ...selectedInventoryControlAgent };
    //   completePropsFeature.ProductID = product.ProductID;
    //   completePropsFeature.FeatureIntValue =
    //     completePropsFeature.ValueTypeID === 1
    //       ? parseInt(completePropsFeature.FeatureValue)
    //       : 0;
    //   completePropsFeature.FeatureDecimalValue =
    //     completePropsFeature.ValueTypeID === 2
    //       ? parseFloat(completePropsFeature.FeatureValue)
    //       : 0;
    //   completePropsFeature.EffectiveInPricing =
    //     completePropsFeature.EffectiveInPricing =
    //       completePropsFeature.ValueTypeID === 4
    //         ? completePropsFeature.FeatureValue === "1"
    //         : false;

    //   initModal(formRef, completePropsFeature, setRecord);
    // }
  });

  const isEdit = selectedInventoryControlAgent !== null;

  const handleSubmit = async () => {
    await saveModalChanges(
      formConfig,
      selectedInventoryControlAgent,
      setProgress,
      onOk,
      clearRecord,
      false
    );

    onCancel();
  };

  const selected_agent = inventoryControlAgents.find(
    (ag) => ag.AgentID === record.AgentID
  );

  //-----------------

  return (
    <ModalWindow
      isOpen={isOpen}
      isEdit={isEdit}
      title={Words.inventory_control_agents}
      inProgress={progress}
      disabled={validateForm({ record, schema }) && true}
      onClear={clearRecord}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      width={750}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24}>
            <DropdownItem
              title={Words.inventory_control_agent}
              dataSource={inventoryControlAgents}
              keyColumn="AgentID"
              valueColumn="Title"
              formConfig={formConfig}
              required
              autoFocus
            />
          </Col>
          {record.AgentID > 0 && (
            <>
              <Col xs={24}>
                <Divider orientation="right" plain>
                  <Text>{Words.fixed_values}</Text>
                </Divider>
              </Col>
              {selected_agent && (
                <Col xs={24}>
                  <TextItem
                    title={Words.value_type}
                    value={`${selected_agent.FeatureTypeTitle}`}
                    valueColor={Colors.orange[6]}
                  />
                </Col>
              )}
              {selected_agent?.FeatureTypeID < 5 && selected_agent?.Items && (
                <Col xs={24}>
                  <DetailsTable
                    records={selected_agent?.Items}
                    columns={getItemColumns(selected_agent?.FeatureTypeID)}
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

export default UserProductInventoryControlAgentModal;
