import { Form } from "antd";

const AntdHidden = (props) => {
  const { title, fieldName, rules } = props;

  return (
    <Form.Item
      name={fieldName}
      label={title}
      rules={rules}
      style={{ display: "none" }}
    />
  );
};

export default AntdHidden;
