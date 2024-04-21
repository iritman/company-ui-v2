import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../../common/modal-window";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
} from "../../../../../tools/form-manager";
import DropdownItem from "../../../../form-controls/dropdown-item";
import SwitchItem from "../../../../form-controls/switch-item";
import TextItem from "./../../../../form-controls/text-item";

const schema = {
  PSID: Joi.number().required(),
  ProductID: Joi.number().required(),
  StoreID: Joi.number().min(1).required(),
  IsActive: Joi.boolean(),
};

const initRecord = (productID) => {
  return {
    PSID: 0,
    ProductID: productID,
    StoreID: 0,
    IsActive: true,
  };
};

const formRef = React.createRef();

const UserProductStoreModal = ({
  isOpen,
  product,
  selectedStore,
  stores,
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
    record.StoreID = 0;
    record.IsActive = true;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    setRecord(initRecord(product ? product.ProductID : 0));

    initModal(formRef, selectedStore, setRecord);
  });

  const isEdit = selectedStore !== null;

  const handleSubmit = async () => {
    await saveModalChanges(
      formConfig,
      selectedStore,
      setProgress,
      onOk,
      clearRecord,
      false
    );

    onCancel();
  };

  //-----------------

  return (
    <ModalWindow
      isOpen={isOpen}
      isEdit={isEdit}
      title={Words.store}
      inProgress={progress}
      disabled={validateForm({ record, schema }) && true}
      onClear={clearRecord}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      width={600}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          {selectedStore === null && (
            <Col xs={24}>
              <DropdownItem
                title={Words.title}
                dataSource={stores}
                keyColumn="StoreID"
                valueColumn="Title"
                formConfig={formConfig}
                required
                autoFocus
              />
            </Col>
          )}

          {selectedStore !== null && (
            <>
              <Col xs={24}>
                <TextItem
                  title={Words.store}
                  value={`${selectedStore.Title}`}
                  valueColor={Colors.magenta[6]}
                />
              </Col>
              <Col xs={24}>
                <TextItem
                  title={Words.storage_center}
                  value={`${selectedStore.StorageCenterTitle}`}
                  valueColor={Colors.orange[6]}
                />
              </Col>
            </>
          )}

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
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default UserProductStoreModal;
