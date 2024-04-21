import React from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Space, Typography } from "antd";
import Joi from "joi-browser";
import ModalWindow from "./../../../common/modal-window";
import Words from "../../../../resources/words";
import Colors from "./../../../../resources/colors";
import utils from "../../../../tools/utils";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
} from "../../../../tools/form-manager";
import InputItem from "./../../../form-controls/input-item";
import {
  useModalContext,
  useResetContext,
} from "./../../../contexts/modal-context";

const { Text } = Typography;

const schema = {
  GroupID: Joi.number().required(),
  Title: Joi.string()
    .min(2)
    .max(50)
    .required()
    .label(Words.title)
    .regex(utils.VALID_REGEX),
};

const initRecord = {
  GroupID: 0,
  Title: "",
};

const formRef = React.createRef();

const UserFolderGroupModal = ({ isOpen, selectedObject, onOk, onCancel }) => {
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

  const clearRecord = () => {
    record.Title = "";

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(() => {
    resetContext();
    setRecord(initRecord);
    initModal(formRef, selectedObject, setRecord);
  });

  const isEdit = selectedObject !== null;

  const handleSubmit = async () => {
    saveModalChanges(
      formConfig,
      selectedObject,
      setProgress,
      onOk,
      clearRecord
    );
  };

  return (
    <ModalWindow
      isOpen={isOpen}
      isEdit={isEdit}
      inProgress={progress}
      disabled={validateForm({ record, schema }) && true}
      onClear={clearRecord}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 10]} style={{ marginLeft: 1 }}>
          <Col xs={24}>
            <InputItem
              title={Words.title}
              fieldName="Title"
              required
              autoFocus
              maxLength={50}
              formConfig={formConfig}
            />
          </Col>

          {selectedObject !== null && (
            <>
              <Col xs={24}>
                <Space>
                  <Text>{`${Words.registerar}:`}</Text>

                  <Text style={{ color: Colors.magenta[6] }}>
                    {`${selectedObject.FirstName} ${selectedObject.LastName}`}
                  </Text>
                </Space>
              </Col>
              <Col xs={24}>
                <Space>
                  <Text>{`${Words.reg_date_time}:`}</Text>

                  <Text style={{ color: Colors.magenta[6] }}>
                    {utils.farsiNum(
                      `${utils.slashDate(
                        selectedObject.RegDate
                      )} - ${utils.colonTime(selectedObject.RegTime)}`
                    )}
                  </Text>
                </Space>
              </Col>
            </>
          )}
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default UserFolderGroupModal;
