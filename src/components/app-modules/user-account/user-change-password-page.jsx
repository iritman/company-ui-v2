import React from "react";
import { useMount } from "react-use";
import Joi from "joi-browser";
import {
  Spin,
  Form,
  Row,
  Col,
  Button,
  Typography,
  Alert,
  Space,
  message,
} from "antd";
import Words from "../../../resources/words";
import utils from "../../../tools/utils";
import service from "../../../services/user-account/user-account-services";
import { handleError } from "./../../../tools/form-manager";
import { validateForm, loadFieldsValue } from "../../../tools/form-manager";
import InputItem from "./../../form-controls/input-item";
import {
  useModalContext,
  useResetContext,
} from "./../../contexts/modal-context";

const { Text } = Typography;

const schema = {
  CurrentPassword: Joi.string()
    .min(8)
    .max(20)
    .required()
    .label(Words.current_password)
    .regex(utils.VALID_REGEX),
  NewPassword: Joi.string()
    .min(8)
    .max(20)
    .required()
    .label(Words.new_password)
    .regex(utils.VALID_REGEX),
  ConfirmNewPassword: Joi.string()
    .min(8)
    .max(20)
    .required()
    .label(Words.confirm_new_password)
    .regex(utils.VALID_REGEX),
};

const initRecord = {
  CurrentPassword: "",
  NewPassword: "",
  ConfirmNewPassword: "",
};

const formRef = React.createRef();

const UseerChangePasswordPage = ({ history }) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  useMount(() => {
    resetContext();
    setRecord(initRecord);
  });

  const handleChangePassword = async () => {
    setProgress(true);

    try {
      const { CurrentPassword, NewPassword } = record;

      const data = await service.changePassword({
        CurrentPassword,
        NewPassword,
      });

      message.success(data.Message);

      history.push("/logout");
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleClearForm = () => {
    record.CurrentPassword = "";
    record.NewPassword = "";
    record.ConfirmNewPassword = "";

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  const checkIsFormDisable = () => {
    let isDisable = validateForm({ record, schema }) && true;

    const { CurrentPassword, NewPassword, ConfirmNewPassword } = record;

    if (!isDisable) {
      if (NewPassword !== ConfirmNewPassword) isDisable = true;
    }

    if (!isDisable) {
      if (NewPassword === CurrentPassword) isDisable = true;
    }

    return isDisable;
  };

  //------

  return (
    <Spin spinning={progress}>
      <Form ref={formRef} name="dataForm">
        <Row gutter={[10, 15]}>
          <Col xs={24}>
            <Text
              style={{
                paddingBottom: 20,
                paddingRight: 5,
                fontSize: 18,
              }}
              strong
              type="success"
            >
              {Words.change_password}
            </Text>
          </Col>
          <Col xs={24}>
            <InputItem
              title={Words.current_password}
              fieldName="CurrentPassword"
              required
              password
              autoFocus
              maxLength={20}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24}>
            <InputItem
              title={Words.new_password}
              fieldName="NewPassword"
              required
              password
              maxLength={20}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={24}>
            <InputItem
              title={Words.confirm_new_password}
              fieldName="ConfirmNewPassword"
              required
              password
              maxLength={20}
              formConfig={formConfig}
            />
          </Col>
          {record?.NewPassword?.length > 0 &&
            record?.ConfirmNewPassword?.length > 0 &&
            record?.NewPassword !== record?.ConfirmNewPassword && (
              <Col xs={24}>
                <Alert
                  type="error"
                  showIcon
                  message={
                    <Text style={{ fontSize: 12 }}>
                      {
                        Words.messages
                          .difference_between_new_pass_and_its_confirm
                      }
                    </Text>
                  }
                />
              </Col>
            )}

          {record?.CurrentPassword?.length > 0 &&
            record?.NewPassword?.length > 0 &&
            record?.ConfirmNewPassword?.length > 0 &&
            record?.NewPassword === record?.ConfirmNewPassword &&
            record?.NewPassword === record?.CurrentPassword && (
              <Col xs={24}>
                <Alert
                  type="error"
                  showIcon
                  message={
                    <Text style={{ fontSize: 12 }}>
                      {Words.messages.new_password_is_same_as_current_password}
                    </Text>
                  }
                />
              </Col>
            )}
          <Col xs={24}>
            <Space>
              <Button
                type="primary"
                disabled={checkIsFormDisable()}
                onClick={handleChangePassword}
              >
                {Words.submit}
              </Button>

              <Button onClick={handleClearForm}>{Words.clear}</Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Spin>
  );
};

export default UseerChangePasswordPage;
