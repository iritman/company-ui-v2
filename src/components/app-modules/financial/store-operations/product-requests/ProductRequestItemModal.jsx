import React, { useState } from "react";
import { useMount } from "react-use";
import { Form } from "antd";
import AntdModal from "../../../../antd-form-components/AntdModal";
import {
  forms,
  getFormUI,
} from "../../../../../services/app/form-manager-service";
import service from "../../../../../services/financial/store-operations/product-requests-service";
import {
  ControlTypes,
  renderFormUI,
} from "../../../../antd-form-components/AntdFormRenderer";
import {
  ControlType,
  AntdControl,
} from "../../../../antd-form-components/AntdControl";
import { handleError } from "../../../../antd-general-components/FormManager";
import utils from "../../../../../tools/utils";

const ProductRequestItemModal = ({ open, selectedObject, onOk, onCancel }) => {
  const [form] = Form.useForm();
  const form_data = Form.useWatch([], form) || {};

  const [progress, setProgress] = useState(false);
  const [formUI, setFormUI] = useState();

  const [productSearchProgress, setProductSearchProgress] = useState(false);
  const [products, setProducts] = useState([]);

  //   -------------------------------------------

  const configSelectedObject = async () => {
    if (selectedObject) form.setFieldsValue(selectedObject);

    //------

    if (selectedObject) {
      const request_product = await service.searchProductByID(
        selectedObject.ProductID
      );

      setProducts([request_product]);
    }
  };

  useMount(async () => {
    setProgress(true);

    try {
      const form_ui = await getFormUI(
        forms.FINANCIAL_STORE_PRODUCT_REQUEST_ITEM
      );
      setFormUI(form_ui);

      await configSelectedObject();
    } catch (err) {
      handleError(err);
    }

    setProgress(false);
  });

  //   -------------------------------------------

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
    if (value) {
      const measure_units = products?.find(
        (product) => product.ProductID === value
      )?.MeasureUnits;

      const default_measure_unit = measure_units?.find((mu) => mu.IsDefault);

      form.setFieldsValue({
        MeasureUnitID: default_measure_unit?.MeasureUnitID,
      });
    } else {
      setProducts([]);
      form.setFieldsValue({ MeasureUnitID: undefined });
    }
  };

  const getMeasureUnits = () => {
    return products?.find(
      (product) => product.ProductID === form_data.ProductID
    )?.MeasureUnits;
  };

  //   -------------------------------------------

  const formItemProperties = [
    {
      fieldName: "ItemID",
      controlTypeID: ControlTypes.Label,
      props: [
        {
          propName: "hidden",
          propValue: !selectedObject || !form_data.ItemID,
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
          propValue: !form_data.ProductID || form_data.ProductID === 0,
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
      controlTypeID: ControlTypes.Label,
      props: [
        {
          propName: "value",
          propValue: form_data.StatusID ? form_data.StatusTitle : "-",
        },
      ],
    },
  ];

  const handleClearForm = () => {
    form.resetFields();

    setProducts([]);
  };

  const handleSubmit = async () => {
    try {
      const form_values = await form.validateFields();

      onOk(form_values, {
        products,
        statuses: formUI.FormItems.find(
          (i) => i.FieldName === "StatusID" && i.DataSource.length > 0
        )?.DataSource,
      });
    } catch (ex) {
      handleError(ex);
    }
  };

  //   -------------------------------------------

  return (
    <AntdModal
      open={open}
      editMode={selectedObject}
      initialValues={selectedObject}
      progress={progress}
      width={950}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      onClear={handleClearForm}
    >
      <AntdControl control={ControlType.Form} form={form}>
        {formUI && <>{renderFormUI(formUI, formItemProperties)}</>}
      </AntdControl>
    </AntdModal>
  );
};

export default ProductRequestItemModal;
