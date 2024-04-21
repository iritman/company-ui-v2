import React from "react";
import { Form, Row } from "antd";
import faIR from "antd/es/locale/fa_IR";

const AntdForm = (props) => {
  const { form, ...rest } = props;

  return (
    <Form
      validateMessages={faIR.Form.defaultValidateMessages}
      layout="horizontal"
      form={form}
      {...rest}
    >
      <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
        {props.children}
      </Row>
    </Form>
  );
};

export default AntdForm;
