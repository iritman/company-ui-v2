import React, { useState } from "react";
import { useMount } from "react-use";
import {
  Form,
  Row,
  Col,
  Button,
  Typography,
  Popconfirm,
  Alert,
  Space,
} from "antd";
import {
  PlusOutlined as AddIcon,
  DeleteOutlined as DeleteIcon,
  EditOutlined as EditIcon,
  QuestionCircleOutlined as QuestionIcon,
} from "@ant-design/icons";
import {
  AiFillLock as LockIcon,
  AiOutlineCheck as CheckIcon,
} from "react-icons/ai";
import Joi from "joi-browser";
import ModalWindow from "./../../../common/modal-window";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
  handleError,
} from "../../../../tools/form-manager";
import InputItem from "./../../../form-controls/input-item";
import SwitchItem from "./../../../form-controls/switch-item";
import { getSorter } from "./../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "./../../../contexts/modal-context";
import DetailsTable from "../../../common/details-table";
import FinancialYearModal from "./ledger-financial-year-modal";

const { Text } = Typography;

const schema = {
  LedgerID: Joi.number().required(),
  Title: Joi.string()
    .min(2)
    .max(50)
    .required()
    .label(Words.title)
    .regex(utils.VALID_REGEX),
  IsMainLedger: Joi.boolean(),
  IsDocable: Joi.boolean(),
  DetailsText: Joi.string()
    .min(5)
    .max(512)
    .allow("")
    .regex(utils.VALID_REGEX)
    .label(Words.descriptions),
  IsActive: Joi.boolean(),
  FinancialYears: Joi.array(),
};

const initRecord = {
  LedgerID: 0,
  Title: "",
  IsMainLedger: true,
  IsDocable: true,
  DetailsText: "",
  IsActive: true,
  FinancialYears: [],
};

const formRef = React.createRef();

const getFinancialYearsColumns = (access, onEdit, onDelete) => {
  let columns = [
    // {
    //   title: Words.id,
    //   width: 75,
    //   align: "center",
    //   dataIndex: "FeatureID",
    //   sorter: getSorter("FeatureID"),
    //   render: (FeatureID) => <Text>{utils.farsiNum(`${FeatureID}`)}</Text>,
    // },
    {
      title: Words.financial_year,
      width: 120,
      align: "center",
      dataIndex: "YearNo",
      sorter: getSorter("YearNo"),
      render: (YearNo) => (
        <Text
          style={{
            color: Colors.green[6],
          }}
        >
          {utils.farsiNum(`${YearNo}`)}
        </Text>
      ),
    },
    {
      title: Words.start_date,
      width: 100,
      align: "center",
      dataIndex: "StartDate",
      sorter: getSorter("StartDate"),
      render: (StartDate) => (
        <Text
          style={{
            color: Colors.orange[6],
          }}
        >
          {utils.farsiNum(utils.slashDate(StartDate))}
        </Text>
      ),
    },
    {
      title: Words.finish_date,
      width: 100,
      align: "center",
      dataIndex: "FinishDate",
      sorter: getSorter("FinishDate"),
      render: (FinishDate) => (
        <Text
          style={{
            color: Colors.orange[6],
          }}
        >
          {utils.farsiNum(utils.slashDate(FinishDate))}
        </Text>
      ),
    },
    {
      title: Words.status,
      width: 75,
      align: "center",
      sorter: getSorter("IsActive"),
      render: (record) =>
        record.IsActive ? (
          <CheckIcon style={{ color: Colors.green[6] }} />
        ) : (
          <LockIcon style={{ color: Colors.red[6] }} />
        ),
    },
  ];

  if ((access.CanDelete && onDelete) || (access.CanEdit && onEdit)) {
    columns = [
      ...columns,
      {
        title: "",
        fixed: "right",
        align: "center",
        width: 75,
        render: (record) => (
          <Space>
            {access.CanDelete && onDelete && (
              <Popconfirm
                title={Words.questions.sure_to_delete_financial_year}
                onConfirm={async () => await onDelete(record)}
                okText={Words.yes}
                cancelText={Words.no}
                icon={<QuestionIcon style={{ color: "red" }} />}
              >
                <Button type="link" icon={<DeleteIcon />} danger />
              </Popconfirm>
            )}

            {access.CanEdit && onEdit && (
              <Button
                type="link"
                icon={<EditIcon />}
                onClick={() => onEdit(record)}
              />
            )}
          </Space>
        ),
      },
    ];
  }

  return columns;
};

const LedgerModal = ({
  access,
  isOpen,
  selectedObject,
  onOk,
  onCancel,
  onSaveFinancialYear,
  onDeleteFinancialYear,
}) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [selectedFinancialYear, setSelectedFinancialYear] = useState(null);
  const [showFinancialYearModal, setShowFinancialYearModal] = useState(false);

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
    record.IsMainLedger = true;
    record.IsDocable = true;
    record.DetailsText = "";
    record.IsActive = true;
    record.FinancialYears = [];

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
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

  const handleSaveFinancialYear = async (financialYear) => {
    if (selectedObject) {
      financialYear.LedgerID = selectedObject.LedgerID;

      const saved_financial_year = await onSaveFinancialYear(financialYear);

      const index = record.FinancialYears.findIndex(
        (y) => y.YearNo === financialYear.YearNo
      );

      if (index === -1) {
        record.FinancialYears = [
          ...record.FinancialYears,
          saved_financial_year,
        ];
      } else {
        record.FinancialYears[index] = saved_financial_year;
      }
    } else {
      if (financialYear.FinancialYearID === 0) {
        if (selectedFinancialYear !== null) {
          const index = record.FinancialYears.findIndex(
            (y) => y.YearNo === selectedFinancialYear.YearNo
          );

          record.FinancialYears[index] = financialYear;
        } else {
          if (
            record.FinancialYears.find((y) => y.YearNo === financialYear.YearNo)
          ) {
            const error = {
              response: {
                status: 400,
                data: {
                  Error: Words.messages.financial_year_no_already_exists,
                },
              },
            };

            throw error;
          } else
            record.FinancialYears = [...record.FinancialYears, financialYear];
        }
      }
    }

    //------

    if (financialYear.IsActive) {
      record.FinancialYears.forEach((y) => {
        if (y.YearNo !== financialYear.YearNo) {
          y.IsActive = false;
        }
      });
    }

    setRecord({ ...record });
    setSelectedFinancialYear(false);
  };

  const handleDeleteFinancialYear = async (financialYear) => {
    setProgress(true);

    try {
      if (financialYear.FinancialYearID > 0) {
        await onDeleteFinancialYear(financialYear.FinancialYearID);
      }

      record.FinancialYears = record.FinancialYears.filter(
        (f) => f.YearNo !== financialYear.YearNo
      );
      setRecord({ ...record });
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleCloseFinancialYearModal = () => {
    setSelectedFinancialYear(false);
    setShowFinancialYearModal(false);
  };

  const handleEditFinancialYear = (data) => {
    setSelectedFinancialYear(data);
    setShowFinancialYearModal(true);
  };

  const getNewFinancialYearButton = () => {
    return (
      <Button
        type="primary"
        onClick={() => {
          setSelectedFinancialYear(null);
          setShowFinancialYearModal(true);
        }}
        icon={<AddIcon />}
      >
        {Words.new}
      </Button>
    );
  };

  // ------

  return (
    <>
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
              <InputItem
                title={Words.title}
                fieldName="Title"
                required
                autoFocus
                maxLength={50}
                formConfig={formConfig}
              />
            </Col>
            <Col xs={24} md={12}>
              <SwitchItem
                title={Words.is_main_ledger}
                fieldName="IsMainLedger"
                initialValue={true}
                checkedTitle={Words.yes}
                unCheckedTitle={Words.no}
                formConfig={formConfig}
              />
            </Col>
            <Col xs={24} md={12}>
              <SwitchItem
                title={Words.is_docable_ledger}
                fieldName="IsDocable"
                initialValue={true}
                checkedTitle={Words.yes}
                unCheckedTitle={Words.no}
                formConfig={formConfig}
              />
            </Col>
            <Col xs={24}>
              <InputItem
                title={Words.descriptions}
                fieldName="DetailsText"
                multiline
                rows={7}
                showCount
                maxLength={512}
                formConfig={formConfig}
              />
            </Col>
            <Col xs={24}>
              <SwitchItem
                title={Words.status}
                fieldName="IsActive"
                initialValue={true}
                checkedTitle={Words.active}
                unCheckedTitle={Words.inactive}
                formConfig={formConfig}
              />
            </Col>

            {record.FinancialYears?.length > 0 && (
              <>
                <Col xs={24}>
                  <Text style={{ fontSize: 12 }}>{Words.financial_years}</Text>
                </Col>
                <Col xs={24}>
                  <DetailsTable
                    records={record.FinancialYears}
                    columns={getFinancialYearsColumns(
                      access,
                      handleEditFinancialYear,
                      handleDeleteFinancialYear
                    )}
                  />
                </Col>
                <Col xs={24}>{getNewFinancialYearButton()}</Col>
              </>
            )}

            {record.FinancialYears?.length === 0 && (
              <Col xs={24}>
                <Alert
                  type="error"
                  showIcon
                  message={
                    <Space>
                      <Text style={{ fontSize: 12 }}>
                        {Words.messages.no_financial_year_selected}
                      </Text>

                      {getNewFinancialYearButton()}
                    </Space>
                  }
                />
              </Col>
            )}
          </Row>
        </Form>
      </ModalWindow>

      {showFinancialYearModal && (
        <FinancialYearModal
          isOpen={showFinancialYearModal}
          selectedObject={selectedFinancialYear}
          // ledger={selectedObject}
          onOk={handleSaveFinancialYear}
          onCancel={handleCloseFinancialYearModal}
        />
      )}
    </>
  );
};

export default LedgerModal;
