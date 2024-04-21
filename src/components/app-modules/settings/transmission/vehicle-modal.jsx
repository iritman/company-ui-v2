import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Tabs, Button, Popconfirm } from "antd";
import { QuestionCircleOutlined as QuestionIcon } from "@ant-design/icons";
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
  handleError,
} from "../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "./../../../contexts/modal-context";
import InputItem from "./../../../form-controls/input-item";
import TextItem from "./../../../form-controls/text-item";
import DropdownItem from "./../../../form-controls/dropdown-item";
import NumericInputItem from "./../../../form-controls/numeric-input-item";
import service from "../../../../services/settings/transmission/vehicles-service";
import tafsilAccountService from "../../../../services/financial/accounts/tafsil-accounts-service";
import TafsilInfoViewer from "../../../common/tafsil-info-viewer";

const schema = {
  VehicleID: Joi.number().required(),
  VehicleTypeID: Joi.number().min(1).required(),
  ModelID: Joi.number().min(1).required(),
  ProductYear: Joi.number()
    .min(1370)
    .max(1499)
    .required()
    .label(Words.product_year),
  Pelak: Joi.string()
    .min(8)
    .max(50)
    .required()
    .label(Words.pelak)
    .regex(utils.VALID_REGEX),
  DetailsText: Joi.string()
    .allow("")
    .max(512)
    .regex(utils.VALID_REGEX)
    .label(Words.descriptions),
};

const initRecord = {
  VehicleID: 0,
  VehicleTypeID: 0,
  ModelID: 0,
  ProductYear: 0,
  Pelak: "",
  DetailsText: "",
};

const formRef = React.createRef();

const VehicleModal = ({
  isOpen,
  selectedObject,
  onCancel,
  onOk,
  onCreateTafsilAccount,
}) => {
  const [hasCreateTafsilAccountAccess, setHasCreateTafsilAccountAccess] =
    useState(false);

  const {
    progress,
    setProgress,
    record,
    setRecord,
    types,
    setTypes,
    brands,
    setBrands,
    models,
    setModels,
    errors,
    setErrors,
  } = useModalContext();

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.VehicleTypeID = 0;
    record.ModelID = 0;
    record.ProductYear = 0;
    record.Pelak = "";
    record.DetailsText = "";

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

      const { Brands, Models, VehicleTypes } = data;

      setTypes(VehicleTypes);
      setBrands(Brands);
      setModels(Models);

      //------

      const access_data = await tafsilAccountService.getTafsilAccountAccesses(
        "Vehicles"
      );

      const { HasCreateTafsilAccountAccess } = access_data;

      setHasCreateTafsilAccountAccess(HasCreateTafsilAccountAccess);
    } catch (err) {
      handleError(err);
    }
    setProgress(false);
  });

  const handleSubmit = async () => {
    saveModalChanges(
      formConfig,
      selectedObject,
      setProgress,
      onOk,
      clearRecord
    );
  };

  const handleBrandChange = (value) => {
    const rec = { ...record };
    rec.BrandID = value;

    if (value === 0) {
      rec.ModelID = 0;
    }

    setRecord(rec);
  };

  const isEdit = selectedObject !== null;

  const filteredModels = models.filter((m) => m.BrandID === record.BrandID);

  const handleCreateTafsilAccount = async () => {
    if (selectedObject.TafsilInfo.length === 0) {
      setProgress(true);

      try {
        await onCreateTafsilAccount();
      } catch (ex) {
        handleError(ex);
      }

      setProgress(false);
    }
  };

  //------

  let items = [
    {
      label: Words.info,
      key: "info",
      children: (
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.vehicle_type}
              dataSource={types}
              keyColumn="VehicleTypeID"
              valueColumn="Title"
              formConfig={formConfig}
              required
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.brand}
              dataSource={brands}
              keyColumn="BrandID"
              valueColumn="Title"
              formConfig={formConfig}
              required
              autoFocus
              onChange={handleBrandChange}
            />
          </Col>
          <Col xs={24} md={12}>
            <DropdownItem
              title={Words.model}
              dataSource={filteredModels}
              keyColumn="ModelID"
              valueColumn="Title"
              formConfig={formConfig}
              required
              autoFocus
            />
          </Col>
          <Col xs={24} md={12}>
            <NumericInputItem
              horizontal
              required
              title={Words.product_year}
              fieldName="ProductYear"
              min={1370}
              max={1499}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24}>
            <InputItem
              title={Words.pelak}
              fieldName="Pelak"
              required
              autoFocus
              maxLength={50}
              formConfig={formConfig}
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
              formConfig={formConfig}
            />
          </Col>

          {isEdit && (
            <>
              <Col xs={24} ms={12}>
                <TextItem
                  title={Words.reg_member}
                  value={`${selectedObject.RegFirstName} ${selectedObject.RegLastName}`}
                  valueColor={Colors.magenta[6]}
                />
              </Col>
              <Col xs={24} md={12}>
                <TextItem
                  title={Words.reg_date_time}
                  value={utils.formattedDateTime(
                    selectedObject.RegDate,
                    selectedObject.RegTime
                  )}
                  valueColor={Colors.magenta[6]}
                />
              </Col>
            </>
          )}
        </Row>
      ),
    },
  ];

  if (selectedObject !== null) {
    const { TafsilInfo } = selectedObject;

    items = [
      ...items,
      {
        label: Words.tafsil_account,
        key: "tafsil-account",
        children: <TafsilInfoViewer tafsilInfo={TafsilInfo} />,
      },
    ];
  }

  const is_disabled = validateForm({ record, schema }) && true;

  const getFooterButtons = () => {
    let buttons = [
      <Button key="clear-button" onClick={clearRecord}>
        {Words.clear}
      </Button>,
      <Button
        key="submit-button"
        type="primary"
        onClick={handleSubmit}
        loading={progress}
        disabled={is_disabled}
      >
        {Words.submit}
      </Button>,
    ];

    if (
      selectedObject &&
      hasCreateTafsilAccountAccess &&
      selectedObject.TafsilInfo.length === 0
    ) {
      buttons = [
        <Popconfirm
          title={Words.questions.sure_to_create_tafsil_account}
          onConfirm={handleCreateTafsilAccount}
          okText={Words.yes}
          cancelText={Words.no}
          icon={<QuestionIcon style={{ color: "red" }} />}
          disabled={is_disabled}
        >
          <Button key="submit-button" type="primary" loading={progress}>
            {Words.create_tafsil_account}
          </Button>
        </Popconfirm>,
        ...buttons,
      ];
    }
    return buttons;
  };

  return (
    <ModalWindow
      isOpen={isOpen}
      isEdit={isEdit}
      disabled={is_disabled}
      footer={getFooterButtons()}
      onCancel={onCancel}
      width={750}
    >
      <Form ref={formRef} name="dataForm">
        <Tabs defaultActiveKey="1" type="card" items={items} />
      </Form>
    </ModalWindow>
  );
};

export default VehicleModal;
