import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Progress, Statistic } from "antd";
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
  handleError,
} from "../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "./../../../contexts/modal-context";
import service from "../../../../services/official/timex/user-official-check-extra-work-requests-service";
import InputItem from "../../../form-controls/input-item";
import SwitchItem from "../../../form-controls/switch-item";
import ExtraWorkRequestDetails from "./extra-work-request-details";

const schema = {
  RequestID: Joi.number().required(),
  IsAccepted: Joi.boolean(),
  ResponseDetailsText: Joi.string()
    .max(1024)
    .required()
    .label(Words.descriptions),
};

const initRecord = {
  RequestID: 0,
  IsAccepted: false,
  ResponseDetailsText: "",
};

const formRef = React.createRef();

const UserOfficialCheckExtraWorkRequestModal = ({
  isOpen,
  selectedObject,
  onOk,
  onCancel,
}) => {
  const [capacityInfo, setCapacityInfo] = useState({
    TotalCapacityInMin: 0,
    UsedCapacityInMin: 0,
    RemainCapacityInMin: 0,
    UsedCapacityInPercent: 0,
  });

  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const resetContext = useResetContext();

  const clearRecord = async () => {
    setProgress(true);
    try {
      record.IsAccepted = false;
      record.ResponseDetailsText = "";

      setRecord(record);
      setErrors({});
      loadFieldsValue(formRef, record);
    } catch (err) {
      handleError(err);
    }
    setProgress(false);
  };

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  useMount(async () => {
    resetContext();

    setRecord(initRecord);
    initModal(formRef, selectedObject, setRecord);

    setProgress(true);
    try {
      const data = await service.getExtraWorkCapacity(selectedObject.RequestID);

      const {
        TotalCapacityInMin,
        UsedCapacityInMin,
        RemainCapacityInMin,
        UsedCapacityInPercent,
      } = data;

      setCapacityInfo({
        TotalCapacityInMin,
        UsedCapacityInMin,
        RemainCapacityInMin,
        UsedCapacityInPercent,
      });
    } catch (err) {
      handleError(err);
    }
    setProgress(false);
  });

  const handleSubmit = async () => {
    saveModalChanges(
      formConfig,
      selectedObject,
      setProgress,
      onOk,
      clearRecord
    );
  };

  const isEdit = selectedObject !== null;

  return (
    <ModalWindow
      isOpen={isOpen}
      isEdit={isEdit}
      inProgress={progress}
      disabled={validateForm({ record, schema }) && true}
      onClear={clearRecord}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      width={750}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
          <Col xs={24}>
            <Form.Item label={Words.extra_work_capacity}>
              <Row>
                <Col xs={24}>
                  <Progress percent={capacityInfo.UsedCapacityInPercent} />
                </Col>
                <Col xs={24} md={8}>
                  <Statistic
                    title={Words.total}
                    value={utils.farsiNum(
                      utils.minToTime(capacityInfo.TotalCapacityInMin)
                    )}
                    valueStyle={{ color: Colors.blue[6] }}
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Statistic
                    title={Words.used}
                    value={utils.farsiNum(
                      utils.minToTime(capacityInfo.UsedCapacityInMin)
                    )}
                    valueStyle={{ color: Colors.red[6] }}
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Statistic
                    title={Words.remain}
                    value={utils.farsiNum(
                      utils.minToTime(capacityInfo.RemainCapacityInMin)
                    )}
                    valueStyle={{ color: Colors.green[6] }}
                  />
                </Col>
              </Row>
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item>
              <ExtraWorkRequestDetails extraWorkRequest={selectedObject} />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <SwitchItem
              title={Words.status}
              fieldName="IsAccepted"
              initialValue={false}
              checkedTitle={Words.accept_request}
              unCheckedTitle={Words.reject_request}
              formConfig={formConfig}
            />
          </Col>

          <Col xs={24}>
            <InputItem
              horizontal
              title={Words.descriptions}
              fieldName="ResponseDetailsText"
              formConfig={formConfig}
              multiline
              rows={7}
              maxLength={1024}
              showCount
              required
              autoFocus
            />
          </Col>
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default UserOfficialCheckExtraWorkRequestModal;
