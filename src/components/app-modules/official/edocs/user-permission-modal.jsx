import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Space, Typography } from "antd";
import Joi from "joi-browser";
import ModalWindow from "../../../common/modal-window";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
} from "../../../../tools/form-manager";
import DropdownItem from "../../../form-controls/dropdown-item";
import SwitchItem from "../../../form-controls/switch-item";
import {
  useModalContext,
  useResetContext,
} from "../../../contexts/modal-context";
import service from "../../../../services/official/edocs/user-permissions-service";
import { handleError } from "../../../../tools/form-manager";

const { Text } = Typography;

const schema = {
  PermissionID: Joi.number().required(),
  LevelTypeID: Joi.number().required(),
  LevelID: Joi.number().required(),
  MemberID: Joi.number().min(1).required(),
  CanView: Joi.boolean(),
  CanAdd: Joi.boolean(),
  CanEdit: Joi.boolean(),
  CanDelete: Joi.boolean(),
};

const initRecord = (levelInfo) => {
  const { LevelTypeID, LevelID } = levelInfo;

  return {
    PermissionID: 0,
    LevelTypeID,
    LevelID,
    MemberID: 0,
    CanView: true,
    CanAdd: true,
    CanEdit: true,
    CanDelete: true,
  };
};

const formRef = React.createRef();

const UserPermissionModal = ({
  isOpen,
  levelInfo,
  selectedPermission,
  folderPath,
  onOk,
  onCancel,
}) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [employees, setEmployees] = useState([]);

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.MemberID =
      selectedPermission === null ? 0 : selectedPermission.MemberID;
    record.CanView = true;
    record.CanAdd = true;
    record.CanEdit = true;
    record.CanDelete = true;

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();
    setRecord(initRecord(levelInfo));
    initModal(formRef, selectedPermission, setRecord);

    setProgress(true);
    try {
      const { LevelTypeID, LevelID } = levelInfo;
      const data = await service.getParams(LevelTypeID, LevelID);

      const { Employees } = data;

      setEmployees(Employees);
    } catch (ex) {
      handleError(ex);
    }
    setProgress(false);
  });

  const isEdit = selectedPermission !== null;

  const handleSubmit = async () => {
    saveModalChanges(
      formConfig,
      selectedPermission,
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
      width={700}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 10]} style={{ marginLeft: 1 }}>
          <Col xs={24}>{folderPath}</Col>
          <Col xs={24}>
            {selectedPermission === null ? (
              <DropdownItem
                title={Words.employee}
                dataSource={employees}
                keyColumn="MemberID"
                valueColumn="FullName"
                formConfig={formConfig}
                required
              />
            ) : (
              <Space>
                <Text>{`${Words.employee}:`}</Text>

                <Text style={{ color: Colors.magenta[6] }}>
                  {`${selectedPermission.FirstName} ${selectedPermission.LastName}`}
                </Text>
              </Space>
            )}
          </Col>
          <Col xs={12} md={6}>
            <SwitchItem
              title={Words.can_view}
              fieldName="CanView"
              initialValue={true}
              checkedTitle={Words.yes}
              unCheckedTitle={Words.no}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={12} md={6}>
            <SwitchItem
              title={Words.can_add}
              fieldName="CanAdd"
              initialValue={true}
              checkedTitle={Words.yes}
              unCheckedTitle={Words.no}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={12} md={6}>
            <SwitchItem
              title={Words.can_edit}
              fieldName="CanEdit"
              initialValue={true}
              checkedTitle={Words.yes}
              unCheckedTitle={Words.no}
              formConfig={formConfig}
            />
          </Col>
          <Col xs={12} md={6}>
            <SwitchItem
              title={Words.can_delete}
              fieldName="CanDelete"
              initialValue={true}
              checkedTitle={Words.yes}
              unCheckedTitle={Words.no}
              formConfig={formConfig}
            />
          </Col>

          {selectedPermission !== null && (
            <>
              <Col xs={24}>
                <Space>
                  <Text>{`${Words.registerar}:`}</Text>

                  <Text style={{ color: Colors.magenta[6] }}>
                    {`${selectedPermission.RegFirstName} ${selectedPermission.RegLastName}`}
                  </Text>
                </Space>
              </Col>
              <Col xs={24}>
                <Space>
                  <Text>{`${Words.reg_date_time}:`}</Text>

                  <Text style={{ color: Colors.magenta[6] }}>
                    {utils.farsiNum(
                      `${utils.slashDate(
                        selectedPermission.RegDate
                      )} - ${utils.colonTime(selectedPermission.RegTime)}`
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

export default UserPermissionModal;
