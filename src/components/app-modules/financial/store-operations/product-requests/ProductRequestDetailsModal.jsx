import React, { useState } from "react";
import { useMount } from "react-use";
import {
  Col,
  Descriptions,
  Row,
  Tabs,
  Button,
  Space,
  Popover,
  Popconfirm,
} from "antd";
import {
  QuestionCircleOutlined as QuestionIcon,
  SettingOutlined as SettingIcon,
} from "@ant-design/icons";
import AntdModal from "../../../../antd-form-components/AntdModal";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import {
  getItem,
  getDescriptionsItem,
  LabelType,
} from "../../../../antd-general-components/Label";
import DetailsTable from "../../../../common/details-table";
import { getItemsColumns, getActionsColumns } from "./ProductRequestModalCode";
import service from "../../../../../services/financial/store-operations/product-requests-service";
import { handleError } from "../../../../antd-general-components/FormManager";
import ProductRequestForm from "./ProductRequestForm";
import StepFeedbackModal from "../../../../antd-common-components/StepFeedbackModal";

const valueColor = Colors.blue[7];

const ProductRequestDetailsModal = ({
  open,
  selectedObject,
  onCancel,
  onChange,
  onStepAction,
}) => {
  const [progress, setProgress] = useState(false);
  const [nextAction, setNextAction] = useState();
  const [showOperations, setShowOperations] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [stepModalType, setStepModalType] = useState("");
  const [history, setHistory] = useState([]);

  const {
    RequestID,
    //   StorageCenterID,
    // StorageCenterTitle,
    // FrontSideTypeID,
    FrontSideTypeTitle,
    // FrontSideAccountID,
    FrontSideAccountTitle,
    // RegMemberID,
    RegFirstName,
    RegLastName,
    RequestDate,
    NeededDate,
    // RequestMemberID,
    RequestMemberFirstName,
    RequestMemberLastName,
    // RequestTypeID,
    RequestTypeTitle,
    // FromStoreID,
    FromStoreTitle,
    // ToStoreID,
    ToStoreTitle,
    // StatusID,
    StatusTitle,
    // TafsilCode,
    // TafsilTypeID,
    // TafsilTypeTitle,
    RegDate,
    RegTime,
    DetailsText,
    Items,
    Actions,
  } = selectedObject;

  const details_items = [
    getItem(Words.id, valueColor, RequestID),
    getItem(Words.request_date, valueColor, RequestDate, {
      type: LabelType.date,
    }),
    getItem(Words.need_date, valueColor, NeededDate, {
      type: LabelType.date,
    }),
    getItem(Words.front_side_type, valueColor, FrontSideTypeTitle),
    getItem(Words.front_side, valueColor, FrontSideAccountTitle),
    getItem(Words.request_type, valueColor, RequestTypeTitle),
    getItem(
      Words.request_member,
      valueColor,
      `${RequestMemberFirstName} ${RequestMemberLastName}`
    ),
    getItem(Words.from_store, valueColor, FromStoreTitle),
    getItem(Words.to_store, valueColor, ToStoreTitle),
    getItem(Words.status, valueColor, StatusTitle),
    getItem(Words.reg_member, valueColor, `${RegFirstName} ${RegLastName}`),
    getItem(Words.reg_date_time, valueColor, null, {
      type: LabelType.date_time,
      date: RegDate,
      time: RegTime,
    }),
    getDescriptionsItem(Words.descriptions, valueColor, DetailsText),
  ];

  const handleChangeSelectedObject = (data) => {
    onChange(data);
  };

  const modal_tabs = [
    {
      label: Words.main_info,
      key: "main-info",
      children: (
        <>
          {!nextAction?.CanMakeAction ? (
            <Row gutter={[0, 15]}>
              <Col xs={24}>
                <Descriptions
                  bordered
                  column={{
                    lg: 3,
                    md: 2,
                    xs: 1,
                  }}
                  size="middle"
                  items={details_items}
                />
              </Col>
              <Col xs={24}>
                <DetailsTable records={Items} columns={getItemsColumns()} />
              </Col>
            </Row>
          ) : (
            <ProductRequestForm
              selectedObject={selectedObject}
              nextAction={nextAction}
              onChange={handleChangeSelectedObject}
            />
          )}
        </>
      ),
    },
    {
      label: Words.history,
      key: "history",
      children: (
        <Row gutter={[0, 15]}>
          <Col xs={24}>
            <DetailsTable records={history} columns={getActionsColumns()} />
          </Col>
        </Row>
      ),
    },
  ];

  // --------------------

  useMount(async () => {
    try {
      setHistory(Actions);

      // ---

      const data = await service.getNextStep(RequestID);

      setNextAction(data);
    } catch (err) {
      handleError(err);
    }
  });

  // --------------------

  const openFeedbackModal = (operation) => {
    setStepModalType(operation);
    setShowFeedback(true);
    setShowOperations(false);
  };

  const handleSubmitFeedback = async (response) => {
    setShowFeedback(false);

    // ----------

    setProgress(true);

    try {
      const data = await onStepAction(response);

      if (data.Actions) setHistory(data.Actions);

      setNextAction(undefined);
    } catch (err) {
      handleError(err);
    }

    setProgress(false);
  };

  const handleApprove = async () => {
    setProgress(true);
    setShowOperations(false);

    try {
      const data = await onStepAction({ IsPassed: true, DetailsText: "" });

      if (data.Actions) setHistory(data.Actions);

      setNextAction(undefined);
    } catch (err) {
      handleError(err);
    }

    setProgress(false);
  };

  const getFooterButtons = () => {
    const is_all_items_rejected =
      selectedObject?.Items?.filter((i) => i.StatusID === 1 || i.StatusID === 2)
        .length === 0;

    let result = !nextAction?.CanMakeAction ? (
      <Button key="close-button" onClick={onCancel}>
        {Words.close}
      </Button>
    ) : (
      <Space>
        {(nextAction?.NextStep?.FormPermissions?.CanApprove ||
          nextAction?.NextStep?.FormPermissions?.CanReject) && (
          <Popover
            style={{ backgroundColor: "GrayText" }}
            content={
              <Space direction="vertical">
                {!is_all_items_rejected &&
                  nextAction?.NextStep?.FormPermissions?.CanApprove && (
                    <>
                      <Popconfirm
                        title={Words.questions.sure_to_accept_request}
                        onConfirm={handleApprove}
                        okText={Words.yes}
                        cancelText={Words.no}
                        icon={<QuestionIcon style={{ color: "red" }} />}
                      >
                        <Button type="primary" block>
                          {Words.accept_request}
                        </Button>
                      </Popconfirm>

                      <Button
                        type="primary"
                        block
                        onClick={() => openFeedbackModal("approve")}
                      >
                        {Words.accept_request_with_note}
                      </Button>
                    </>
                  )}

                {nextAction?.NextStep?.FormPermissions?.CanReject && (
                  <Button
                    type="primary"
                    danger
                    block
                    onClick={() => openFeedbackModal("reject")}
                  >
                    {Words.cancel_request}
                  </Button>
                )}
              </Space>
            }
            // title="Title"
            trigger="click"
            open={showOperations}
            onOpenChange={(newOpen) => setShowOperations(newOpen)}
          >
            <Button icon={<SettingIcon />}>{Words.operation}</Button>
          </Popover>
        )}

        <Button key="close-button" onClick={onCancel}>
          {Words.close}
        </Button>
      </Space>
    );

    return result;
  };

  // --------------------

  return (
    <>
      <AntdModal
        open={open}
        initialValues={selectedObject}
        title={Words.more_details}
        progress={progress}
        width={1300}
        footer={getFooterButtons}
        onCancel={onCancel}
      >
        <Row gutter={[10, 10]}>
          <Col xs={24}>
            <Tabs type="card" defaultActiveKey="0" items={modal_tabs} />
          </Col>
        </Row>
      </AntdModal>

      {showFeedback && (
        <StepFeedbackModal
          open={showFeedback}
          modalType={stepModalType}
          onSubmit={handleSubmitFeedback}
          onCancel={() => setShowFeedback(false)}
        />
      )}
    </>
  );
};

export default ProductRequestDetailsModal;
