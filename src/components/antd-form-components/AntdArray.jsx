import { Form } from "antd";

const AntdArray = (props) => {
  const { title, fieldName, rules } = props;

  return (
    // hidden={true}
    <Form.Item
      name={fieldName}
      label={title}
      rules={rules}
      style={{ display: "none" }}
    />
  );
};

export default AntdArray;
