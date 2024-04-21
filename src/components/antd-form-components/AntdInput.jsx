import { Form, Input } from "antd";

const AntdInput = (props) => {
  const { title, fieldName, rules, ...rest } = props;

  return (
    <Form.Item name={fieldName} label={title} rules={rules}>
      <Input {...rest} />
    </Form.Item>
  );
};

export default AntdInput;
