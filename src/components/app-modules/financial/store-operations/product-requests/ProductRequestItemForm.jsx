import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Button, Space } from "antd";
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
import Words from "../../../../../resources/words";

const ProductRequestItemForm = ({
  open,
  selectedObject,
  readonlyFields,
  onOk,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const form_data = Form.useWatch([], form) || {};
  const [readonlyForm, setReadonlyForm] = useState(true);

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

  const configDisabledProps = (form_item_properties) => {
    let items_base_props = [...form_item_properties];

    const disable_prop = (fieldName) => {
      return {
        propName: "disabled",
        propValue: isReadonlyField(fieldName),
      };
    };

    if (readonlyFields && !readonlyFields.AllFields && readonlyFields.Fields) {
      readonlyFields.Fields.forEach((field_name) => {
        const index = items_base_props.findIndex(
          (item) => item.fieldName === field_name
        );

        if (index > -1) {
          const base_field = items_base_props[index];

          if (base_field.props) {
            const item_disable_prop_index = base_field.props.findIndex(
              (p) => p.propName === "disabled"
            );

            if (item_disable_prop_index > -1) {
              items_base_props[index].props[item_disable_prop_index].propValue =
                items_base_props[index].props[item_disable_prop_index]
                  .propValue || disable_prop(field_name).propValue;
            } else {
              items_base_props[index].props = [
                ...base_field.props,
                disable_prop(field_name),
              ];
            }
          } else {
            items_base_props[index].props = [disable_prop(field_name)];
          }
        } else {
          items_base_props = [
            ...items_base_props,
            { fieldName: field_name, props: [disable_prop(field_name)] },
          ];
        }
      });
    } else if (readonlyFields && readonlyFields.AllFields) {
      // If form is disable but we manually set diabled property for field(s)
      // so, we need to set disabled to true
      // for example: FrontSideAccountID field
      let field_index = items_base_props.findIndex((f) =>
        f.props?.find((p) => p.propName === "disabled")
      );
      if (field_index > -1) {
        let prop_index = items_base_props[field_index].props.findIndex(
          (p) => p.propName === "disabled"
        );

        if (prop_index > -1) {
          items_base_props[field_index].props[prop_index].propValue = true;
        }
      }
    }

    return items_base_props;
  };

  const isReadonlyForm = () => {
    return readonlyFields.AllFields === true;
  };

  const isReadonlyField = (field_name) => {
    let result = true;

    if (!readonlyFields.Fields?.find((f) => f === field_name)) result = false;

    return result;
  };

  useMount(async () => {
    setProgress(true);

    try {
      const form_ui = await getFormUI(
        forms.FINANCIAL_STORE_PRODUCT_REQUEST_ITEM
      );

      //---------- Conver StatusID from Label to Dropdown List

      const status_id_index = form_ui?.FormItems?.findIndex(
        (i) => i.FieldName === "StatusID" && i.ControlTypeTitle === "Label"
      );

      const status_item = form_ui.FormItems[status_id_index];

      if (status_item) {
        status_item.ControlTypeID = 1;
        status_item.ControlTypeTitle = "Dropdown List";
        status_item.DataSource = [
          { StatusID: 1, StatusTitle: Words.product_request_status_1 },
          { StatusID: 2, StatusTitle: Words.approve },
          { StatusID: 3, StatusTitle: Words.reject },
        ];

        form_ui.FormItems[status_id_index] = status_item;
      }

      //----------

      setFormUI(form_ui);

      await configSelectedObject();

      setReadonlyForm(isReadonlyForm());
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
      controlTypeID: ControlTypes.Dropdown_List,
      props: [
        {
          propName: "keyColumn",
          propValue: "StatusID",
        },
        {
          propName: "valueColumn",
          propValue: "StatusTitle",
        },
      ],
    },
  ];

  //   const handleClearForm = () => {
  //     form.resetFields();

  //     setProducts([]);
  //   };

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

  const getFooterButtons = () => {
    return (
      <Space>
        <Button type="primary" onClick={handleSubmit}>
          {Words.just_add}
        </Button>
        <Button onClick={onCancel}>{Words.close}</Button>
      </Space>
    );
  };

  //   -------------------------------------------

  return (
    <AntdModal
      open={open}
      title={Words.request_item}
      initialValues={selectedObject}
      progress={progress}
      width={950}
      onCancel={onCancel}
      footer={getFooterButtons()}
    >
      <AntdControl
        control={ControlType.Form}
        form={form}
        disabled={readonlyForm}
      >
        {formUI && (
          <>{renderFormUI(formUI, configDisabledProps(formItemProperties))}</>
        )}
      </AntdControl>
    </AntdModal>
  );
};

export default ProductRequestItemForm;
