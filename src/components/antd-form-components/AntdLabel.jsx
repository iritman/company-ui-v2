import { Form } from "antd";
import TitleValueText from "../common/title-value-text";

const AntdLabel = ({ ...rest }) => {
  return (
    <Form.Item>
      <TitleValueText {...rest} />
    </Form.Item>
  );
};

export default AntdLabel;
