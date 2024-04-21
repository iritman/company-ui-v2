import { Form } from "antd";

const AntdHidden = (props) => {
  const { title, fieldName, rules } = props;

  return <Form.Item name={fieldName} label={title} rules={rules} noStyle />;
};

export default AntdHidden;
