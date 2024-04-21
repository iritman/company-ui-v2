import { Form, Switch } from "antd";

const AntdSwitch = (props) => {
  const { title, fieldName, rules, ...rest } = props;

  return (
    <Form.Item
      name={fieldName}
      valuePropName="checked"
      label={title}
      rules={rules}
    >
      <Switch {...rest} />
    </Form.Item>
  );
};

export default AntdSwitch;
