import React from "react";
import { Col, Typography, Divider } from "antd";
import { ControlType, AntdControl } from "./AntdControl";
import Colors from "../../resources/colors";

const { Text } = Typography;

export const ControlTypes = {
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

export const DataTypes = {
  Integer: 1,
  Decimal: 2,
  String: 3,
  Boolean: 4,
  Array: 5,
};

export const getItemRules = (form_item) => {
  const {
    // ItemID,
    // Title,
    DataTypeID,
    ControlTypeID,
    // KeyFieldName,
    // ValueFieldName,
    // FieldName,
    // DefaultValue,
    MinValue,
    MaxValue,
    // DecimalCount,
    IsMandatory,
    // DataSource,
    // Size_xs,
    // Size_sm,
    // Size_md,
    // Size_lg,
  } = form_item;

  let schema = {};

  if (ControlTypeID !== ControlTypes.Label) {
    if (IsMandatory) schema.required = true;
    if (MinValue > 0) schema.min = MinValue;
    if (MaxValue > 0) schema.max = MaxValue;

    switch (DataTypeID) {
      case 1: // Integer
        schema.type = "integer";
        break;

      case 2: // Decimal
        schema.type = "float";
        break;

      case 3: // String
        schema.type = "string";
        break;

      case 4: // Boolean
        schema.type = "boolean";
        break;

      case 5: // Array
        schema.type = "array";
        break;

      default:
        break;
    }
  }

  return schema;

  /*
  form_ui?.FormItems?.filter(
    (i) => i.ControlTypeID !== controlTypes.Label
  ).forEach((i) => {
    switch (i.DataTypeID) {
      case 1: // Integer
        schema.type = "integer";
        if (i.IsMandatory) schema.required = true;
        if (i.MinValue > 0) schema.min = i.MinValue;
        if (i.MaxValue > 0) schema.max = i.MaxValue;
        // let int_schema = Joi.number();
        // if (i.IsMandatory) int_schema = int_schema.required();
        // if (i.MinValue > 0) int_schema = int_schema.min(i.MinValue);
        // if (i.MaxValue > 0) int_schema = int_schema.max(i.MaxValue);
        // int_schema = int_schema.label(i.Title);
        // schema[i.FieldName] = int_schema;
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
        
    }
  });
*/
};

// const manageValueType = (i, current_date) => {
//   const { ControlTypeID, DataTypeID, DefaultValue } = i;

//   let converted_value = "";

//   switch (DataTypeID) {
//     case 1: // Integer
//       converted_value = parseInt(DefaultValue);
//       break;

//     case 2: // Decimal
//       converted_value = parseFloat(DefaultValue);
//       break;

//     case 3: // String
//       converted_value =
//         ControlTypeID === 2 && DefaultValue === "CurrentDate"
//           ? current_date
//           : DefaultValue;
//       break;

//     case 4: // Boolean
//       converted_value = DefaultValue.toLowerCase() === "true";
//       break;

//     case 5: // Array
//       converted_value = JSON.parse(
//         DefaultValue.length > 0 ? DefaultValue : "[]"
//       );
//       break;

//     default:
//       converted_value = DefaultValue;
//       break;
//   }

//   return converted_value;
// };

// export const getInitRecord = (form_ui) => {
//   const result = {};

//   form_ui.FormItems.filter(
//     (i) => i.ControlTypeID !== controlTypes.Label
//   ).forEach(
//     (i) => (result[i.FieldName] = manageValueType(i, form_ui.CurrentDate))
//   );

//   return result;
// };

const renderFormItem = (form_item, formItemProperties) => {
  const {
    ItemID,
    Title,
    ControlTypeID,
    KeyFieldName,
    ValueFieldName,
    FieldName,
    // DefaultValue,
    // MinValue,
    MaxValue,
    // DecimalCount,
    // IsMandatory,
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

  if (formItemProperties) {
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
    case ControlTypes.Numeric_Integer_Value:
      result = (
        <>
          {!is_hidden && (
            <Col {...col_sizes} key={ItemID}>
              <AntdControl
                control={ControlType.InputNumber}
                fieldName={FieldName}
                title={Title}
                rules={[getItemRules(form_item)]}
                // autoFocus={true}
              />
            </Col>
          )}
        </>
      );
      break;

    case ControlTypes.Typing_List:
      result = (
        <>
          {!is_hidden && (
            <Col {...col_sizes} key={ItemID}>
              <AntdControl
                control={ControlType.Dropdown}
                allowClear
                fieldName={FieldName}
                title={Title}
                rules={[getItemRules(form_item)]}
                dataSource={data_field?.dataSource || []}
                keyColumn={
                  KeyFieldName === FieldName ? KeyFieldName : FieldName
                }
                valueColumn={ValueFieldName}
                showSearch
                filterOption={(input, option) =>
                  option?.children
                    ?.toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                {...additionalProps}
              />
            </Col>
          )}
        </>
      );
      break;

    case ControlTypes.Dropdown_List:
      result = (
        <>
          {!is_hidden && (
            <Col {...col_sizes} key={ItemID}>
              <AntdControl
                control={ControlType.Dropdown}
                allowClear
                fieldName={FieldName}
                title={Title}
                rules={[getItemRules(form_item)]}
                dataSource={data_field?.dataSource || DataSource}
                keyColumn={
                  KeyFieldName === FieldName ? KeyFieldName : FieldName
                }
                valueColumn={ValueFieldName}
                {...additionalProps}
              />
            </Col>
          )}
        </>
      );
      break;

    case ControlTypes.Multi_Line_Text:
      result = (
        <>
          {!is_hidden && (
            <Col {...col_sizes} key={ItemID}>
              <AntdControl
                control={ControlType.TextArea}
                fieldName={FieldName}
                title={Title}
                rules={[getItemRules(form_item)]}
                showCount
                maxLength={MaxValue}
              />
            </Col>
          )}
        </>
      );
      break;

    case ControlTypes.Array:
      result = (
        <>
          {!is_hidden && (
            <Col {...col_sizes} key={ItemID}>
              <Divider
                orientation="left"
                style={{ borderColor: Colors.red[6] }}
              >
                <Text style={{ fontSize: 14, color: Colors.green[6] }}>
                  {Title}
                </Text>
              </Divider>
            </Col>
          )}
        </>
      );
      break;

    case ControlTypes.Date:
      result = (
        <>
          {!is_hidden && (
            <Col {...col_sizes} key={ItemID}>
              <AntdControl
                control={ControlType.Date}
                fieldName={FieldName}
                title={Title}
                rules={[getItemRules(form_item)]}
              />
            </Col>
          )}
        </>
      );
      break;

    case ControlTypes.Time:
      result = (
        <>
          {!is_hidden && (
            <Col {...col_sizes} key={ItemID}>
              <AntdControl
                control={ControlType.Time}
                fieldName={FieldName}
                title={Title}
                rules={[getItemRules(form_item)]}
              />
            </Col>
          )}
        </>
      );
      break;

    // case controlTypes.Label:
    //   const filtered_additional_props = { ...additionalProps };
    //   if (filtered_additional_props.value)
    //     delete filtered_additional_props.value;
    //   if (filtered_additional_props.valueColor)
    //     delete filtered_additional_props.valueColor;

    //   result = (
    //     <>
    //       {!is_hidden && (
    //         <Col {...col_sizes} key={ItemID}>
    //           <TextItem
    //             title={Title}
    //             value={additionalProps.value || DefaultValue}
    //             valueColor={additionalProps.valueColor || Colors.magenta[6]}
    //             {...filtered_additional_props}
    //           />
    //         </Col>
    //       )}
    //     </>
    //   );
    //   break;

    // case controlTypes.Numeric_Decimal_Value:
    //   result = (
    //     <>
    //       {!is_hidden && (
    //         <Col {...col_sizes} key={ItemID}>
    //           <NumericInputItem
    //             horizontal
    //             title={Title}
    //             fieldName={FieldName}
    //             min={MinValue}
    //             max={MaxValue}
    //             precision={DecimalCount}
    //             stringMode
    //             decimalText
    //             required={IsMandatory}
    //             formConfig={formConfig}
    //             {...additionalProps}
    //           />
    //         </Col>
    //       )}
    //     </>
    //   );
    //   break;

    // case controlTypes.Switch:
    //   result = (
    //     <>
    //       {!is_hidden && (
    //         <Col {...col_sizes} key={ItemID}>
    //           <SwitchItem
    //             title={Title}
    //             fieldName={FieldName}
    //             initialValue={DefaultValue}
    //             required={IsMandatory}
    //             formConfig={formConfig}
    //             {...additionalProps}
    //           />
    //         </Col>
    //       )}
    //     </>
    //   );
    //   break;

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
        (i) => i.ControlTypeID !== ControlTypes.Hidden_Field
      ).map((form_item) => (
        <React.Fragment key={form_item?.ItemID}>
          {renderFormItem(form_item, formConfig)}
        </React.Fragment>
      ))}
    </>
  );
};

const manageValueType = (i, current_date) => {
  const { ControlTypeID, DataTypeID, DefaultValue } = i;

  let converted_value = "";

  switch (DataTypeID) {
    case DataTypes.Integer:
      converted_value = parseInt(DefaultValue);
      break;

    case DataTypes.Decimal:
      converted_value = parseFloat(DefaultValue);
      break;

    case DataTypes.String:
      converted_value =
        ControlTypeID === 2 && DefaultValue === "CurrentDate"
          ? current_date
          : DefaultValue;
      break;

    case DataTypes.Boolean:
      converted_value = DefaultValue.toLowerCase() === "true";
      break;

    case DataTypes.Array:
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
    (i) => i.ControlTypeID !== ControlTypes.Label
  ).forEach(
    (i) => (result[i.FieldName] = manageValueType(i, form_ui.CurrentDate))
  );

  return result;
};
