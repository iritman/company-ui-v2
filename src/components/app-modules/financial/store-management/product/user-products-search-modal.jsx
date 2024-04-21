import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../../common/modal-window";
import Words from "../../../../../resources/words";
import utils from "../../../../../tools/utils";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  handleError,
} from "../../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "../../../../contexts/modal-context";
import service from "../../../../../services/financial/store-mgr/user-products-service";
import InputItem from "../../../../form-controls/input-item";
import DropdownItem from "../../../../form-controls/dropdown-item";

const schema = {
  SearchText: Joi.string()
    .min(2)
    .max(50)
    .allow("")
    .label(Words.search_text)
    .regex(utils.VALID_REGEX),
  CategoryID: Joi.number(),
  NatureID: Joi.number(),
};

const initRecord = {
  SearchText: "",
  CategoryID: 0,
  NatureID: 0,
};

const formRef = React.createRef();

const UserProductsSearchModal = ({ isOpen, filter, onOk, onCancel }) => {
  const [categories, setCategories] = useState([]);
  const [natures, setNatures] = useState([]);

  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.SearchText = "";
    record.CategoryID = 0;
    record.NatureID = 0;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();

    setRecord(initRecord);
    initModal(formRef, filter, setRecord);

    setProgress(true);
    try {
      const data = await service.getParams();

      const { Categories, Natures } = data;

      setCategories(Categories);
      setNatures(Natures);
    } catch (err) {
      handleError(err);
    }
    setProgress(false);
  });

  return (
    <ModalWindow
      isOpen={isOpen}
      inProgress={progress}
      disabled={validateForm({ record, schema }) && true}
      searchModal
      onClear={clearRecord}
      onSubmit={async () => await onOk(record)}
      onCancel={onCancel}
      width={650}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[10, 5]} style={{ marginLeft: 1 }}>
          <Col xs={24}>
            <InputItem
              title={Words.search_text}
              fieldName="SearchText"
              maxLength={50}
              formConfig={formConfig}
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.product_category}
              dataSource={categories}
              keyColumn="CategoryID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.product_nature}
              dataSource={natures}
              keyColumn="NatureID"
              valueColumn="Title"
              formConfig={formConfig}
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default UserProductsSearchModal;
