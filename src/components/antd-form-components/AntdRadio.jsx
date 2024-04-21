import { Form, Radio } from "antd";

const AntdRadio = (props) => {
  const { title, fieldName, rules, dataSource, ...rest } = props;

  return (
    <Form.Item
      name={fieldName}
      label={title}
      rules={rules}
      // className="collection-create-form_last-form-item"
    >
      {dataSource.length > 0 && (
        <Radio.Group {...rest}>
          {dataSource?.map(({ title, value }) => (
            <Radio key={value} value={value}>
              {title}
            </Radio>
          ))}
        </Radio.Group>
      )}
    </Form.Item>
  );
};

export default AntdRadio;
