import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Typography } from "antd";
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
  handleError,
} from "../../../../tools/form-manager";
import service from "../../../../services/financial/accounts/tafsil-accounts-service";
import InputItem from "./../../../form-controls/input-item";
import DropdownItem from "./../../../form-controls/dropdown-item";
import SwitchItem from "./../../../form-controls/switch-item";
import {
  useModalContext,
  useResetContext,
} from "./../../../contexts/modal-context";

const { Text } = Typography;

const default_schema = {
  TafsilAccountID: Joi.number().required(),
  TafsilTypeID: Joi.number().min(1).required().label(Words.tafsil_type),
  TafsilCode: Joi.number().min(1).required().label(Words.tafsil_code),
  CurrencyID: Joi.number().required(),
  DetailsText: Joi.string()
    .min(5)
    .max(512)
    .allow("")
    .regex(utils.VALID_REGEX)
    .label(Words.descriptions),
  IsActive: Joi.boolean(),
};

const initRecord = {
  TafsilAccountID: 0,
  TafsilTypeID: 0,
  Title: "",
  TafsilCode: 0,
  CurrencyID: 0,
  BaseTableItemID: 0,
  DetailsText: "",
  IsActive: true,
};

const formRef = React.createRef();

const TafsilAccountModal = ({ isOpen, selectedObject, onOk, onCancel }) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [tafsilTypes, setTafsilTypes] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [moduleItems, setModuleItems] = useState([]);

  const resetContext = useResetContext();

  const formConfig = () => {
    return {
      schema: getSchema(),
      record,
      setRecord,
      errors,
      setErrors,
    };
  };

  const clearRecord = () => {
    record.TafsilTypeID = 0;
    record.Title = "";
    record.TafsilCode = 0;
    record.CurrencyID = 0;
    record.BaseTableItemID = 0;
    record.DetailsText = "";
    record.IsActive = true;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();

    //------

    setProgress(true);

    try {
      const data = await service.getParams();

      let { TafsilTypes, Currencies } = data;

      if (selectedObject) {
        const { TafsilTypeBaseTableID } = selectedObject;

        if (TafsilTypeBaseTableID > 0) {
          const data_items = await service.getModuleItems(
            TafsilTypeBaseTableID
          );

          const { ModuleItems } = data_items;

          ModuleItems.forEach((item) => {
            item.BaseTableItemID = item.ItemID;
          });

          setModuleItems(ModuleItems);
        }

        initModal(formRef, selectedObject, setRecord);
      } else {
        utils.setDefaultCurrency(
          setRecord,
          initRecord,
          loadFieldsValue,
          formRef,
          Currencies
        );
      }

      setTafsilTypes(TafsilTypes);
      setCurrencies(Currencies);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  });

  const handleChangeTafsilType = async (value) => {
    const rec = { ...record };
    rec.TafsilTypeID = value || 0;
    rec.BaseTableItemID = 0;
    rec.Title = "";

    setProgress(true);

    try {
      if (value > 0) {
        const data = await service.getNewTafsilCode(value);
        rec.TafsilCode = data.TafsilCode;

        //------

        const base_table_id = tafsilTypes.find(
          (t) => t.TafsilTypeID === value
        ).BaseTableID;
        const data_items = await service.getModuleItems(base_table_id);
        const { ModuleItems } = data_items;

        ModuleItems.forEach((item) => {
          item.BaseTableItemID = item.ItemID;
        });

        setModuleItems(ModuleItems);
      } else {
        rec.TafsilCode = 0;
        rec.TafsilTypeBaseTableID = 0;

        setModuleItems([]);
      }

      //------
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);

    setRecord(rec);
    loadFieldsValue(formRef, rec);
  };

  const isEdit = selectedObject !== null;

  const handleSubmit = async () => {
    saveModalChanges(
      formConfig(),
      selectedObject,
      setProgress,
      onOk,
      clearRecord
    );
  };

  const getSchema = () => {
    let schema = { ...default_schema };

    const { TafsilTypeID } = record;

    if (
      TafsilTypeID > 0 &&
      tafsilTypes.find((tt) => tt.TafsilTypeID === TafsilTypeID)?.BaseTableID >
        0
    ) {
      schema = {
        ...schema,
        Title: Joi.string()
          .min(2)
          .max(50)
          .allow("")
          .label(Words.title)
          .regex(utils.VALID_REGEX),
        BaseTableItemID: Joi.number().min(1).required(),
      };
    } else {
      schema = {
        ...schema,
        Title: Joi.string()
          .min(2)
          .max(50)
          .required()
          .label(Words.title)
          .regex(utils.VALID_REGEX),
        BaseTableItemID: Joi.number().required(),
      };
    }

    return schema;
  };

  //------

  return (
    <ModalWindow
      isOpen={isOpen}
      isEdit={isEdit}
      inProgress={progress}
      disabled={validateForm({ record, schema: getSchema() }) && true}
      onClear={clearRecord}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      width={850}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[10, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.tafsil_type}
              dataSource={tafsilTypes}
              keyColumn="TafsilTypeID"
              valueColumn="Title"
              formConfig={formConfig()}
              onChange={handleChangeTafsilType}
            />
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label={Words.tafsil_code}>
              <Text style={{ color: Colors.cyan[6] }}>
                {utils.farsiNum(`${record.TafsilCode}`)}
              </Text>
            </Form.Item>
          </Col>
          {record.TafsilTypeID > 0 &&
          tafsilTypes.find((tt) => tt.TafsilTypeID === record.TafsilTypeID)
            ?.BaseTableID > 0 ? (
            <Col xs={24} md={12}>
              <DropdownItem
                title={Words.title}
                dataSource={moduleItems}
                keyColumn="BaseTableItemID"
                valueColumn="Title"
                required
                formConfig={formConfig()}
              />
            </Col>
          ) : (
            <Col xs={24} md={12}>
              <InputItem
                title={Words.title}
                fieldName="Title"
                required
                maxLength={50}
                formConfig={formConfig()}
              />
            </Col>
          )}

          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.default_currency}
              dataSource={currencies}
              keyColumn="CurrencyID"
              valueColumn="Title"
              formConfig={formConfig()}
            />
          </Col>
          <Col xs={24} md={12}>
            <SwitchItem
              title={Words.status}
              fieldName="IsActive"
              initialValue={true}
              checkedTitle={Words.active}
              unCheckedTitle={Words.inactive}
              formConfig={formConfig()}
            />
          </Col>
          <Col xs={24}>
            <InputItem
              title={Words.descriptions}
              fieldName="DetailsText"
              multiline
              rows={7}
              showCount
              maxLength={512}
              formConfig={formConfig()}
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default TafsilAccountModal;
