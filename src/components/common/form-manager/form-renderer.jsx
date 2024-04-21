import React from "react";
import Joi from "joi-browser";
import { Col, Divider, Typography } from "antd";
import DropdownItem from "../../form-controls/dropdown-item";
import DateItem from "../../form-controls/date-item";
import InputItem from "../../form-controls/input-item";
import NumericInputItem from "../../form-controls/numeric-input-item";
import SwitchItem from "./../../form-controls/switch-item";
import TextItem from "../../form-controls/text-item";
import utils from "../../../tools/utils";
import Colors from "../../../resources/colors";

const { Text } = Typography;

export const controlTypes = {
  Dropdown_List: 1,
  Date: 2,
  Single_Line_Text: 3,
  Multi_Line_Text: 4,
  Numeric_Integer_Value: 5,
  Numeric_Decimal_Value: 6,
  Label: 7,
  Typing_List: 8,
  Array: 9,
  Switch: 10,
  Hidden_Field: 11,
};

export const getSchema = (form_ui) => {
  let schema = {};

  form_ui?.FormItems?.filter(
    (i) => i.ControlTypeID !== controlTypes.Label
  ).forEach((i) => {
    switch (i.DataTypeID) {
      case 1: // Integer
        let int_schema = Joi.number();
        if (i.IsMandatory) int_schema = int_schema.required();
        if (i.MinValue > 0) int_schema = int_schema.min(i.MinValue);
        if (i.MaxValue > 0) int_schema = int_schema.max(i.MaxValue);
        int_schema = int_schema.label(i.Title);
        schema[i.FieldName] = int_schema;
        break;

      case 2: // Decimal
        let decimal_schema = Joi.number();
        if (i.IsMandatory) decimal_schema = decimal_schema.required();
        if (i.MinValue > 0) decimal_schema = decimal_schema.min(i.MinValue);
        if (i.MaxValue > 0) decimal_schema = decimal_schema.max(i.MaxValue);
        if (i.DecimalCount > 0)
          decimal_schema = decimal_schema.precision(i.DecimalCount);
        decimal_schema = decimal_schema.label(i.Title);
        schema[i.FieldName] = decimal_schema;
        break;

      case 3: // String
        let string_schema = Joi.string().regex(utils.VALID_REGEX);
        string_schema = i.IsMandatory
          ? string_schema.required()
          : string_schema.allow("");
        if (i.MinValue > 0) string_schema = string_schema.min(i.MinValue);
        if (i.MaxValue > 0) string_schema = string_schema.max(i.MaxValue);
        string_schema = string_schema.label(i.Title);
        schema[i.FieldName] = string_schema;
        break;

      case 4: // Boolean
        let boolean_schema = Joi.boolean();
        schema[i.FieldName] = boolean_schema;
        break;

      case 5: // Array
        let array_schema = Joi.array();
        schema[i.FieldName] = array_schema;
        break;

      default:
    }
  });

  return schema;
};

const manageValueType = (i, current_date) => {
  const { ControlTypeID, DataTypeID, DefaultValue } = i;

  let converted_value = "";

  switch (DataTypeID) {
    case 1: // Integer
      converted_value = parseInt(DefaultValue);
      break;

    case 2: // Decimal
      converted_value = parseFloat(DefaultValue);
      break;

    case 3: // String
      converted_value =
        ControlTypeID === 2 && DefaultValue === "CurrentDate"
          ? current_date
          : DefaultValue;
      break;

    case 4: // Boolean
      converted_value = DefaultValue.toLowerCase() === "true";
      break;

    case 5: // Array
      converted_value = JSON.parse(
        DefaultValue.length > 0 ? DefaultValue : "[]"
      );
      break;

    default:
      converted_value = DefaultValue;
      break;
  }

  return converted_value;
};

export const getInitRecord = (form_ui) => {
  const result = {};

  form_ui.FormItems.filter(
    (i) => i.ControlTypeID !== controlTypes.Label
  ).forEach(
    (i) => (result[i.FieldName] = manageValueType(i, form_ui.CurrentDate))
  );

  return result;
};

const renderFormItem = (form_item, formConfig) => {
  const {
    ItemID,
    Title,
    ControlTypeID,
    KeyFieldName,
    ValueFieldName,
    FieldName,
    DefaultValue,
    MinValue,
    MaxValue,
    DecimalCount,
    IsMandatory,
    DataSource,
    Size_xs,
    Size_sm,
    Size_md,
    Size_lg,
  } = form_item;

  let result = <></>;

  let col_sizes = {};
  if (Size_xs > 0) col_sizes.xs = Size_xs;
  if (Size_sm > 0) col_sizes.sm = Size_sm;
  if (Size_md > 0) col_sizes.md = Size_md;
  if (Size_lg > 0) col_sizes.lg = Size_lg;

  //   Manage Fields Info

  const additionalProps = {};
  let data_field = null;
  let is_hidden = false;

  if (formConfig.formItemProperties) {
    const { formItemProperties } = formConfig;

    data_field = formItemProperties.find(
      (f) =>
        f.fieldName === FieldName &&
        (!f.controlTypeID || f.controlTypeID === ControlTypeID)
    );

    //   Item Events
    let item_events = data_field?.events || [];

    if (item_events.length > 0) {
      item_events.forEach((e) => {
        additionalProps[e.eventName] = e.eventMethod;
      });
    }

    //   Item Properties

    let item_props = data_field?.props || [];

    if (item_props.length > 0) {
      item_props.forEach((p) => {
        additionalProps[p.propName] = p.propValue;
      });
    }

    if (additionalProps.hidden) {
      is_hidden = additionalProps.hidden;
      delete additionalProps.hidden;
    }
  }

  //   ------

  switch (ControlTypeID) {
    case 1:
      result = (
        <>
          {!is_hidden && (
            <Col {...col_sizes} key={ItemID}>
              <DropdownItem
                title={Title}
                dataSource={data_field?.dataSource || DataSource}
                keyColumn={
                  KeyFieldName === FieldName ? KeyFieldName : FieldName
                }
                valueColumn={ValueFieldName}
                formConfig={formConfig}
                required={IsMandatory}
                {...additionalProps}
              />
            </Col>
          )}
        </>
      );
      break;

    case 2:
      result = (
        <>
          {!is_hidden && (
            <Col {...col_sizes} key={ItemID}>
              <DateItem
                horizontal
                required={IsMandatory}
                title={Title}
                fieldName={FieldName}
                formConfig={formConfig}
                {...additionalProps}
              />
            </Col>
          )}
        </>
      );
      break;

    case 4:
      result = (
        <>
          {!is_hidden && (
            <Col {...col_sizes} key={ItemID}>
              <InputItem
                title={Title}
                fieldName={FieldName}
                multiline
                showCount
                maxLength={MaxValue}
                required={IsMandatory}
                formConfig={formConfig}
                {...additionalProps}
              />
            </Col>
          )}
        </>
      );
      break;

    case 5:
      result = (
        <>
          {!is_hidden && (
            <Col {...col_sizes} key={ItemID}>
              <NumericInputItem
                horizontal
                title={Title}
                fieldName={FieldName}
                min={MinValue}
                max={MaxValue}
                required={IsMandatory}
                formConfig={formConfig}
                {...additionalProps}
              />
            </Col>
          )}
        </>
      );
      break;

    case 6:
      result = (
        <>
          {!is_hidden && (
            <Col {...col_sizes} key={ItemID}>
              <NumericInputItem
                horizontal
                title={Title}
                fieldName={FieldName}
                min={MinValue}
                max={MaxValue}
                precision={DecimalCount}
                stringMode
                decimalText
                required={IsMandatory}
                formConfig={formConfig}
                {...additionalProps}
              />
            </Col>
          )}
        </>
      );
      break;

    case 7:
      const filtered_additional_props = { ...additionalProps };
      if (filtered_additional_props.value)
        delete filtered_additional_props.value;
      if (filtered_additional_props.valueColor)
        delete filtered_additional_props.valueColor;

      result = (
        <>
          {!is_hidden && (
            <Col {...col_sizes} key={ItemID}>
              <TextItem
                title={Title}
                value={additionalProps.value || DefaultValue}
                valueColor={additionalProps.valueColor || Colors.magenta[6]}
                {...filtered_additional_props}
              />
            </Col>
          )}
        </>
      );
      break;

    case 8:
      result = (
        <>
          {!is_hidden && (
            <Col {...col_sizes} key={ItemID}>
              <DropdownItem
                title={Title}
                dataSource={data_field?.dataSource || []}
                keyColumn={
                  KeyFieldName === FieldName ? KeyFieldName : FieldName
                }
                valueColumn={ValueFieldName}
                formConfig={formConfig}
                required={IsMandatory}
                {...additionalProps}
              />
            </Col>
          )}
        </>
      );
      break;

    case 9:
      result = (
        <>
          {!is_hidden && (
            <Col {...col_sizes} key={ItemID}>
              <Divider orientation="right">
                <Text style={{ fontSize: 14, color: Colors.green[6] }}>
                  {Title}
                </Text>
              </Divider>
            </Col>
          )}
        </>
      );
      break;

    case 10:
      result = (
        <>
          {!is_hidden && (
            <Col {...col_sizes} key={ItemID}>
              <SwitchItem
                title={Title}
                fieldName={FieldName}
                initialValue={DefaultValue}
                required={IsMandatory}
                formConfig={formConfig}
                {...additionalProps}
              />
            </Col>
          )}
        </>
      );
      break;

    default:
      result = <></>;
      break;
  }

  return result;
};

export const renderFormUI = (form_ui, formConfig) => {
  return (
    <>
      {form_ui?.FormItems.filter(
        (i) => i.ControlTypeID !== controlTypes.Hidden_Field
      ).map((form_item) => (
        <React.Fragment key={form_item?.ItemID}>
          {renderFormItem(form_item, formConfig)}
        </React.Fragment>
      ))}
    </>
  );
};

// const methods = {
//   controlTypes,
//   getSchema,
//   getInitRecord,
//   renderFormUI,
// };

// export default methods;
