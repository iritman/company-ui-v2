import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../../common/modal-window";
import Words from "../../../../../resources/words";
import service from "../../../../../services/logistic/purchase/inquiry-requests-service";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
  handleError,
} from "../../../../../tools/form-manager";
import DropdownItem from "../../../../form-controls/dropdown-item";

const schema = {
  RowID: Joi.number(),
  SupplierID: Joi.number().min(1).required(),
};

const initRecord = {
  RowID: 0,
  SupplierID: 0,
};

const formRef = React.createRef();

const InquiryRequestSupplierModal = ({
  isOpen,
  selectedObject,
  selectedSuppliers,
  onOk,
  onAddSupplier,
  onCancel,
}) => {
  const [progress, setProgress] = useState(false);
  const [errors, setErrors] = useState({});
  const [record, setRecord] = useState({});

  const [suppliers, setSuppliers] = useState([]);

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.SupplierID = 0;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    setRecord(initRecord);
    loadFieldsValue(formRef, initRecord);
    initModal(formRef, selectedObject, setRecord);

    setProgress(true);

    try {
      const params = await service.getSupplierParams();

      const { Suppliers } = params;

      setSuppliers(
        Suppliers.filter(
          (sp) =>
            !selectedSuppliers.find((sup) => sup.SupplierID === sp.SupplierID)
        )
      );
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  });

  const isEdit = selectedObject !== null;

  const handleSubmit = async () => {
    await saveModalChanges(
      formConfig,
      selectedObject,
      setProgress,
      onOk,
      clearRecord,
      false // showMessage
    );

    onCancel();
  };

  const handleChangeSupplier = (value) => {
    const rec = { ...record };
    rec.SupplierID = value || 0;

    if (value === 0) onAddSupplier(null);
    else {
      const selected_supplier = suppliers.find((sp) => sp.SupplierID === value);

      onAddSupplier(selected_supplier);
    }

    setRecord(rec);
  };

  //------

  return (
    <ModalWindow
      isOpen={isOpen}
      isEdit={isEdit}
      inProgress={progress}
      disabled={validateForm({ record: record, schema }) && true}
      onClear={clearRecord}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      width={750}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24}>
            <DropdownItem
              title={Words.supplier}
              dataSource={suppliers}
              keyColumn="SupplierID"
              valueColumn={"SupplierTitle"}
              formConfig={formConfig}
              onChange={handleChangeSupplier}
              required
              autoFocus
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default InquiryRequestSupplierModal;
