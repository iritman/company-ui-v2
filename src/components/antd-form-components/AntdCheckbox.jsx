import { Form, Checkbox } from "antd";

const AntdCheckbox = (props) => {
  const { title, itemTitle, fieldName, rules, ...rest } = props;

  return (
    <Form.Item label={title} name={fieldName} valuePropName="checked">
      <Checkbox {...rest}>{itemTitle}</Checkbox>
    </Form.Item>
  );
};

export default AntdCheckbox;
