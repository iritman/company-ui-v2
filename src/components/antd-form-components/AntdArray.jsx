import { Form } from "antd";

const AntdArray = (props) => {
  const { title, fieldName, rules } = props;

  return (
    <Form.Item name={fieldName} label={title} rules={rules} noStyle>
      <span></span>
    </Form.Item>
  );
};

export default AntdArray;
