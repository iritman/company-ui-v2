import React, { useState } from "react";
import { useMount } from "react-use";
import Joi from "joi-browser";
import {
  Spin,
  Form,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Popconfirm,
  message,
} from "antd";
import {
  QuestionCircleOutlined as QuestionIcon,
  DeleteOutlined as DeleteIcon,
} from "@ant-design/icons";
import Words from "../../../../../resources/words";
import utils from "../../../../../tools/utils";
import service from "../../../../../services/financial/financial-docs/voucher-descriptions-service";
import {
  //   getSorter,
  checkAccess,
  //   getColumns,
  //   GetSimplaDataPageMethods,
  handleError,
  loadFieldsValue,
  validateForm,
} from "../../../../../tools/form-manager";
import DropdownItem from "../../../../form-controls/dropdown-item";
import InputItem from "./../../../../form-controls/input-item";

const { Text } = Typography;
const formRef = React.createRef();

const schema = {
  DescriptionID: Joi.number().label(Words.id),
  GroupID: Joi.number().min(1).required().label(Words.operation_group),
  OperationTypeID: Joi.number().min(1).required().label(Words.operation),
  ItemID: Joi.number().min(1).required().label(Words.item_type),
  BedehkarText: Joi.string()
    .max(512)
    .allow("")
    .regex(utils.VALID_REGEX)
    .label(Words.bedehkar),
  BestankarText: Joi.string()
    .max(512)
    .allow("")
    .regex(utils.VALID_REGEX)
    .label(Words.bestankar),
};

const initRecord = {
  DescriptionID: 0,
  GroupID: 0,
  OperationTypeID: 0,
  ItemID: 0,
  BedehkarText: "",
  BestankarText: "",
};

const VoucherDescriptionsPage = ({ pageName }) => {
  const [progress, setProgress] = useState(false);
  const [record, setRecord] = useState({});
  const [errors, setErrors] = useState({});
  const [access, setAccess] = useState(null);

  const [operationGroups, setOperationGroups] = useState([]);
  const [operationItems, setOperationItems] = useState([]);
  const [operationTypes, setOperationTypes] = useState([]);

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  useMount(async () => {
    setProgress(true);

    try {
      await checkAccess(setAccess, pageName);

      setRecord({ ...initRecord });
      loadFieldsValue(formRef, { ...initRecord });

      const data = await service.getParams();

      const { OperationGroups, OperationItems, OperationTypes } = data;

      setOperationGroups(OperationGroups);
      setOperationItems(OperationItems);
      setOperationTypes(OperationTypes);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  });

  const handleChangeOperationGroup = (value) => {
    const rec = { ...record };
    rec.GroupID = value;
    rec.OperationTypeID = 0;
    rec.ItemID = 0;
    rec.DescriptionID = 0;
    rec.BedehkarText = "";
    rec.BestankarText = "";
    setRecord(rec);

    loadFieldsValue(formRef, rec);
  };

  const handleChangeOperationType = (value) => {
    const rec = { ...record };
    rec.OperationTypeID = value;
    rec.ItemID = 0;
    rec.DescriptionID = 0;
    rec.BedehkarText = "";
    rec.BestankarText = "";
    setRecord(rec);

    loadFieldsValue(formRef, rec);
  };

  const handleChangeItem = async (value) => {
    const rec = { ...record };
    rec.ItemID = value;

    //------ Load bed/bes text

    if (value > 0) {
      setProgress(true);

      try {
        const { GroupID, OperationTypeID } = record;
        const filter = { GroupID, OperationTypeID, ItemID: value };

        const data = await service.searchData(filter);

        const { DescriptionID, BedehkarText, BestankarText } = data;

        rec.DescriptionID = DescriptionID;
        rec.BedehkarText = BedehkarText;
        rec.BestankarText = BestankarText;
      } catch (ex) {
        handleError(ex);
      }

      setProgress(false);
    } else {
      rec.DescriptionID = 0;
      rec.BedehkarText = "";
      rec.BestankarText = "";
    }

    setRecord(rec);
    loadFieldsValue(formRef, rec);
  };

  const getOperations = () =>
    operationTypes?.filter((o) => o.GroupID === record.GroupID);

  const getItems = () =>
    operationItems?.filter((i) => i.OperationTypeID === record.OperationTypeID);

  const handleSave = async () => {
    setProgress(true);

    try {
      const data = await service.saveData(record);

      const { DescriptionID } = data;

      if (record.DescriptionID === 0) {
        const rec = { ...record };
        rec.DescriptionID = DescriptionID;
        setRecord(rec);
        loadFieldsValue(formRef, rec);
      }
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleClear = () => {
    const rec = { ...initRecord };
    setRecord(rec);
    loadFieldsValue(formRef, rec);
  };

  const handleDelete = async () => {
    setProgress(true);

    try {
      const data = await service.deleteData(record.DescriptionID);
      message.success(data.Message);

      const rec = { ...initRecord };
      setRecord(rec);
      loadFieldsValue(formRef, rec);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  // ------

  return (
    <>
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
                {Words.voucher_descriptions}
              </Text>
            </Col>
            <Col xs={24} md={8}>
              <DropdownItem
                title={Words.operation_group}
                dataSource={operationGroups}
                keyColumn="GroupID"
                valueColumn="Title"
                formConfig={formConfig}
                onChange={handleChangeOperationGroup}
              />
            </Col>
            <Col xs={24} md={8}>
              <DropdownItem
                title={Words.operation}
                dataSource={getOperations()}
                keyColumn="OperationTypeID"
                valueColumn="Title"
                formConfig={formConfig}
                onChange={handleChangeOperationType}
              />
            </Col>
            <Col xs={24} md={8}>
              <DropdownItem
                title={Words.item_type}
                dataSource={getItems()}
                keyColumn="ItemID"
                valueColumn="Title"
                formConfig={formConfig}
                onChange={handleChangeItem}
              />
            </Col>
            <Col xs={24} md={12}>
              <InputItem
                title={Words.bedehkar}
                fieldName="BedehkarText"
                multiline
                rows={5}
                showCount
                maxLength={512}
                formConfig={formConfig}
              />
            </Col>
            <Col xs={24} md={12}>
              <InputItem
                title={Words.bestankar}
                fieldName="BestankarText"
                multiline
                rows={5}
                showCount
                maxLength={512}
                formConfig={formConfig}
              />
            </Col>
            {access !== null && (access.CanAdd || access.CanEdit) && (
              <Col xs={24}>
                <Space>
                  <Button
                    type="primary"
                    onClick={handleSave}
                    disabled={
                      (record.BedehkarText?.length === 0 &&
                        record.BestankarText?.length === 0) ||
                      validateForm({ record, schema })
                    }
                  >
                    {Words.submit}
                  </Button>

                  <Button type="default" onClick={handleClear}>
                    {Words.clear}
                  </Button>

                  {access.CanDelete && record.DescriptionID > 0 && (
                    <Popconfirm
                      title={Words.questions.sure_to_delete_selected_item}
                      onConfirm={handleDelete}
                      okText={Words.yes}
                      cancelText={Words.no}
                      icon={<QuestionIcon style={{ color: "red" }} />}
                    >
                      <Button type="primary" danger icon={<DeleteIcon />}>
                        {Words.delete}
                      </Button>
                    </Popconfirm>
                  )}
                </Space>
              </Col>
            )}
          </Row>
        </Form>
      </Spin>
    </>
  );
};

export default VoucherDescriptionsPage;
