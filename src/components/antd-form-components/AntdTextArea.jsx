import { Form, Input } from "antd";

const AntdTextArea = (props) => {
  const { title, fieldName, rules, ...rest } = props;

  return (
    <Form.Item name={fieldName} label={title} rules={rules}>
      <Input.TextArea {...rest} />
    </Form.Item>
  );
};

export default AntdTextArea;
