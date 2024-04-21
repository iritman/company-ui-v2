import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row } from "antd";
import ModalWindow from "../../../../common/modal-window";
import utils from "../../../../../tools/utils";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
  handleError,
} from "../../../../../tools/form-manager";
import service from "../../../../../services/financial/store-operations/product-requests-service";

import {
  forms,
  getFormUI,
} from "../../../../../services/app/form-manager-service";
import {
  controlTypes,
  getSchema,
  getInitRecord,
  renderFormUI,
} from "../../../../common/form-manager/form-renderer";
import Words from "../../../../../resources/words";

const formRef = React.createRef();

const ProductRequestItemModal = ({
  isOpen,
  selectedObject,
  onOk,
  onCancel,
  // setParams,
}) => {
  const [progress, setProgress] = useState(false);
  const [errors, setErrors] = useState({});
  const [record, setRecord] = useState({});

  const [initRecord, setInitRecord] = useState({});
  const [schema, setSchema] = useState({});
  const [formUI, setFormUI] = useState(null);

  const [productSearchProgress, setProductSearchProgress] = useState(false);
  const [products, setProducts] = useState([]);

  // ------

  const handleSearchProduct = async (searchText) => {
    setProductSearchProgress(true);

    try {
      const data = await service.searchProducts(searchText);

      setProducts(data);
    } catch (ex) {
      handleError(ex);
    }

    setProductSearchProgress(false);
  };

  const handleChangeProduct = (value) => {
    const rec = { ...record };
    rec.ProductID = value || 0;

    const measure_units = products?.find(
      (product) => product.ProductID === value
    )?.MeasureUnits;

    const default_measure_unit = measure_units?.find((mu) => mu.IsDefault);

    rec.MeasureUnitID = default_measure_unit
      ? default_measure_unit.MeasureUnitID
      : 0;

    setRecord(rec);
    loadFieldsValue(formRef, rec);
  };

  const getMeasureUnits = () => {
    return products?.find((product) => product.ProductID === record.ProductID)
      ?.MeasureUnits;
  };

  const formItemProperties = [
    {
      fieldName: "ItemID",
      controlTypeID: controlTypes.Label,
      props: [
        {
          propName: "hidden",
          propValue: selectedObject === null,
        },
        {
          propName: "value",
          propValue: selectedObject
            ? utils.farsiNum(selectedObject.ItemID)
            : "-",
        },
        // {
        //   propName: "valueColor",
        //   propValue: Colors.cyan[5],
        // },
      ],
    },
    {
      fieldName: "ProductID",
      dataSource: products,
      props: [
        {
          propName: "loading",
          propValue: productSearchProgress,
        },
      ],
      events: [
        {
          eventName: "onSearch",
          eventMethod: handleSearchProduct,
        },
        {
          eventName: "onChange",
          eventMethod: handleChangeProduct,
        },
      ],
    },
    {
      fieldName: "MeasureUnitID",
      dataSource: getMeasureUnits(),
      props: [
        {
          propName: "keyColumn",
          propValue: "MeasureUnitID",
        },
        {
          propName: "valueColumn",
          propValue: "MeasureUnitTitle",
        },
        {
          propName: "disabled",
          propValue: record.ProductID === 0,
        },
      ],
    },
    {
      fieldName: "RequestCount",
      props: [
        {
          propName: "maxLength",
          propValue: 7,
        },
        {
          propName: "step",
          propValue: "0.01",
        },
      ],
    },
    {
      fieldName: "StatusID",
      controlTypeID: controlTypes.Label,
      props: [
        {
          propName: "value",
          propValue: selectedObject
            ? selectedObject.StatusTitle
            : Words.product_request_status_1,
        },
      ],
    },
  ];

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
    formItemProperties,
  };

  const clearRecord = () => {
    const rec = { ...initRecord };

    setProducts([]);
    // setFrontSideAccounts([]);
    setErrors({});
    setRecord(rec);
    loadFieldsValue(formRef, rec);
  };

  useMount(async () => {
    setProgress(true);

    try {
      const form_ui = await getFormUI(
        forms.FINANCIAL_STORE_PRODUCT_REQUEST_ITEM
      );
      setFormUI(form_ui);

      const init_record = getInitRecord(form_ui);
      setInitRecord(init_record);

      const schema = getSchema(form_ui);
      setSchema(schema);

      //------

      if (!selectedObject) {
        setRecord(init_record);
        loadFieldsValue(formRef, init_record);
      } else {
        const request_product = await service.searchProductByID(
          selectedObject.ProductID
        );

        request_product.forEach((p) => {
          p.ProductID = p.ProductID;
        });

        setProducts(request_product);

        initModal(formRef, selectedObject, setRecord);
      }
    } catch (err) {
      handleError(err);
    }
    setProgress(false);
  });

  const isEdit = selectedObject !== null;

  const handleSubmit = async () => {
    //...

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
      width={950}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          {formUI && <>{renderFormUI(formUI, formConfig)}</>}
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default ProductRequestItemModal;
