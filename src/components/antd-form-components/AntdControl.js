import React from "react";
import AntdForm from "./AntdForm";
import AntdInput from "./AntdInput";
import AntdInputNumber from "./AntdInputNumber";
import AntdTextArea from "./AntdTextArea";
import AntdSwitch from "./AntdSwitch";
import AntdRadio from "./AntdRadio";
import AntdSelect from "./AntdSelect";
import AntdCheckbox from "./AntdCheckbox";
import AntdDate from "./AntdDate";
import AntdTime from "./AntdTime";
import AntdArray from "./AntdArray";
import AntdHidden from "./AntdHidden";

export const ControlType = {
  Form: "form",
  Input: "input",
  InputNumber: "input-number",
  TextArea: "textarea",
  Dropdown: "select",
  Radio: "radio",
  Checkbox: "checkbox",
  Switch: "switch",
  Date: "date",
  Time: "time",
  Array: "array",
  HiddenField: "hidden-field",
};

export const AntdControl = (props) => {
  const { control, ...rest } = props;

  switch (control) {
    case ControlType.Form:
      return <AntdForm {...rest}>{props.children}</AntdForm>;
    case ControlType.Input:
      return <AntdInput {...rest} />;
    case ControlType.InputNumber:
      return <AntdInputNumber {...rest} />;
    case ControlType.TextArea:
      return <AntdTextArea {...rest} />;
    case ControlType.Dropdown:
      return <AntdSelect {...rest} />;
    case ControlType.Radio:
      return <AntdRadio {...rest} />;
    case ControlType.Checkbox:
      return <AntdCheckbox {...rest} />;
    case ControlType.Switch:
      return <AntdSwitch {...rest} />;
    case ControlType.Date:
      return <AntdDate {...rest} />;
    case ControlType.Time:
      return <AntdTime {...rest} />;
    case ControlType.Array:
      return <AntdArray {...rest} />;
    case ControlType.HiddenField:
      return <AntdHidden {...rest} />;
    default:
      return null;
  }
};
