import { Form, Select } from "antd";
import Words from "../../resources/words";

const { Option } = Select;

const AntdSelect = (props) => {
  const {
    title,
    fieldName,
    keyColumn,
    valueColumn,
    rules,
    dataSource,
    ...rest
  } = props;

  return (
    <Form.Item name={fieldName} label={title} rules={rules}>
      <Select
        placeholder={Words.select_please}
        defaultActiveFirstOption={false}
        suffixIcon={null}
        filterOption={false}
        {...rest}
      >
        {dataSource &&
          dataSource.map((item) => (
            <Option
              key={`${keyColumn}_${item[keyColumn]}`}
              value={item[keyColumn]}
            >
              {item[valueColumn]}
            </Option>
          ))}
      </Select>
    </Form.Item>
  );
};

export default AntdSelect;
