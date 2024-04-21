import { Form, InputNumber } from "antd";

const AntdInputNumber = (props) => {
  const { title, fieldName, rules, ...rest } = props;

  return (
    <Form.Item name={fieldName} label={title} rules={rules}>
      <InputNumber style={{ width: "100%" }} {...rest} />
    </Form.Item>
  );
};

export default AntdInputNumber;
