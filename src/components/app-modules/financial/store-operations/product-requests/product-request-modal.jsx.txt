import React, { useState } from "react";
import { useMount } from "react-use";
import Joi from "joi-browser";
import { Form, Row, Col } from "antd";
import ModalWindow from "../../../../common/modal-window";
import Words from "../../../../../resources/words";
import utils from "./../../../../../tools/utils";

import { v4 as uuid } from "uuid";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
  handleError,
} from "../../../../../tools/form-manager";
import service from "../../../../../services/financial/store-operations/product-requests-service";
import {
  forms,
  getFormUI,
} from "../../../../../services/app/form-manager-service";
import {
  controlTypes,
  getSchema,
  getInitRecord,
  renderFormUI,
} from "../../../../common/form-manager/form-renderer";
import {
  useModalContext,
  useResetContext,
} from "../../../../contexts/modal-context";
import DetailsTable from "../../../../common/details-table";
import ProductRequestItemModal from "./product-request-item-modal";
import {
  getProductRequestItemsColumns,
  getNewProductRequestItemButton,
  getFooterButtons,
} from "./product-request-modal-code";

const formRef = React.createRef();

const ProductRequestModal = ({
  access,
  isOpen,
  selectedObject,
  onOk,
  onCancel,
  onSaveProductRequestItem,
  onDeleteProductRequestItem,
  onReject,
  onApprove,
}) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [initRecord, setInitRecord] = useState({});
  const [schema, setSchema] = useState({});
  const [formUI, setFormUI] = useState(null);

  const [frontSideAccountSearchProgress, setFrontSideAccountSearchProgress] =
    useState(false);
  const [frontSideAccounts, setFrontSideAccounts] = useState([]);

  const [memberSearchProgress, setMemberSearchProgress] = useState(false);
  const [members, setMembers] = useState([]);

  const [hasSaveApproveAccess, setHasSaveApproveAccess] = useState(false);
  const [hasRejectAccess, setHasRejectAccess] = useState(false);

  const [products, setProducts] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [selectedProductRequestItem, setSelectedProductRequestItem] =
    useState(null);
  const [showProductRequestItemModal, setShowProductRequestItemModal] =
    useState(false);

  const resetContext = useResetContext();

  //------

  const handleChangeRequestType = async (value) => {
    const rec = { ...record };
    rec.RequestTypeID = value || 0;
    rec.FromStoreID = 0;
    rec.ToStoreID = 0;

    const field_name = "ToStoreID";

    if (value === 5) {
      schema.ToStoreID = Joi.number().min(1);

      formUI.FormItems.find(
        (i) => i.FieldName === field_name
      ).IsMandatory = true;
    } else {
      schema.ToStoreID = Joi.number();

      formUI.FormItems.find(
        (i) => i.FieldName === field_name
      ).IsMandatory = false;
    }

    setSchema({ ...schema });
    setFormUI({ ...formUI });
    setRecord(rec);
    loadFieldsValue(formRef, rec);
  };

  const handleSearchMember = async (searchText) => {
    setMemberSearchProgress(true);

    try {
      const data = await service.searchMembers(searchText);

      data.forEach((m) => {
        m.RequestMemberID = m.MemberID;
      });

      setMembers(data);
    } catch (ex) {
      handleError(ex);
    }

    setMemberSearchProgress(false);
  };

  const handleChangeFrontSideType = async (value) => {
    const rec = { ...record };
    rec.FrontSideTypeID = value || 0;
    rec.FrontSideAccountID = 0;

    setRecord(rec);

    if (value === 0) {
      setFrontSideAccounts([]);
    } else {
      const data = await handleSearchFrontSideAccount(value);
      setFrontSideAccounts(data);
    }
    loadFieldsValue(formRef, rec);
  };

  const handleSearchFrontSideAccount = async (typeID) => {
    let data = [];

    setFrontSideAccountSearchProgress(true);

    try {
      data = await service.searchFrontSideAccounts(typeID);

      setFrontSideAccounts(data);
    } catch (ex) {
      handleError(ex);
    }

    setFrontSideAccountSearchProgress(false);

    return data;
  };

  //------

  const formItemProperties = [
    {
      fieldName: "RequestID",
      controlTypeID: controlTypes.Label,
      props: [
        {
          propName: "hidden",
          propValue: selectedObject === null,
        },
        {
          propName: "value",
          propValue: selectedObject
            ? utils.farsiNum(selectedObject.RequestID)
            : "-",
        },
        // {
        //   propName: "valueColor",
        //   propValue: Colors.cyan[5],
        // },
      ],
    },
    {
      fieldName: "RequestTypeID",
      events: [
        {
          eventName: "onChange",
          eventMethod: handleChangeRequestType,
        },
      ],
    },
    {
      fieldName: "RequestMemberID",
      dataSource: members,
      props: [
        {
          propName: "loading",
          propValue: memberSearchProgress,
        },
      ],
      events: [
        {
          eventName: "onSearch",
          eventMethod: handleSearchMember,
        },
      ],
    },
    {
      fieldName: "FrontSideTypeID",
      // dataSource: -,
      events: [
        {
          eventName: "onChange",
          eventMethod: handleChangeFrontSideType,
        },
      ],
    },
    {
      fieldName: "FrontSideAccountID",
      dataSource: frontSideAccounts,
      events: [
        {
          eventName: "onSearch",
          eventMethod: handleSearchFrontSideAccount,
        },
      ],
      props: [
        {
          propName: "disabled",
          propValue: record.FrontSideTypeID === 0,
        },
        {
          propName: "loading",
          propValue: frontSideAccountSearchProgress,
        },
      ],
    },
    {
      fieldName: "DetailsText",
      props: [
        {
          propName: "rows",
          propValue: 2,
        },
      ],
    },
    // {
    //   fieldName: "IsPresentational",
    //   props: [
    //     {
    //       propName: "checkedTitle",
    //       propValue: Words.active,
    //     },
    //     {
    //       propName: "unCheckedTitle",
    //       propValue: Words.inactive,
    //     },
    //   ],
    // },
  ];

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
    formItemProperties,
  };

  const clearRecord = () => {
    const rec = { ...initRecord };
    delete rec.RequestID;

    setMembers([]);
    setFrontSideAccounts([]);
    setErrors({});
    setRecord(rec);
    loadFieldsValue(formRef, rec);
  };

  useMount(async () => {
    resetContext();

    //------

    setProgress(true);

    try {
      const form_ui = await getFormUI(forms.FINANCIAL_STORE_PRODUCT_REQUEST);
      setFormUI(form_ui);

      const init_record = getInitRecord(form_ui);
      setInitRecord(init_record);

      const schema = getSchema(form_ui);
      setSchema(schema);

      const data = await service.getParams();

      let { HasSaveApproveAccess, HasRejectAccess } = data;

      setHasSaveApproveAccess(HasSaveApproveAccess);
      setHasRejectAccess(HasRejectAccess);

      //------

      if (!selectedObject) {
        setRecord(init_record);
        loadFieldsValue(formRef, init_record);
      } else {
        const request_member = await service.searchMemberByID(
          selectedObject.RequestMemberID
        );

        request_member.forEach((m) => {
          m.RequestMemberID = m.MemberID;
        });

        setMembers(request_member);

        //---

        const front_side_account = await service.searchFrontSideAccountByID(
          selectedObject.FrontSideAccountID
        );

        setFrontSideAccounts(front_side_account);
        initModal(formRef, selectedObject, setRecord);
      }
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
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

  const handleSubmitAndApprove = async () => {
    const rec = { ...record };
    rec.Items.forEach((item) => {
      if (item.StatusID === 1) {
        item.StatusID = 2;
        item.StatusTitle = Words.product_request_status_2;
      }
    });
    rec.StatusID = 2;
    setRecord(rec);

    const updated_config = { ...formConfig };
    updated_config.record = rec;

    saveModalChanges(
      updated_config,
      selectedObject,
      setProgress,
      onOk,
      clearRecord
    );
  };

  //------

  const handleGetItemParams = (params) => {
    const { Products, Statuses } = params;

    setProducts(Products);
    setStatuses(Statuses);
  };

  const handleSaveProductRequestItem = async (product_item) => {
    if (selectedObject !== null) {
      product_item.RequestID = selectedObject.RequestID;

      const saved_product_request_item = await onSaveProductRequestItem(
        product_item
      );

      const index = record.Items.findIndex(
        (item) => item.ItemID === product_item.ItemID
      );

      if (index === -1) {
        record.Items = [...record.Items, saved_product_request_item];
      } else {
        record.Items[index] = saved_product_request_item;
      }
    } else {
      //While adding items temporarily, we have no join operation in database
      //So, we need to select titles manually

      const product = products.find(
        (r) => r.ProductID === product_item.ProductID
      );

      if (product) {
        product_item.ProductCode = product.ProductCode;
        product_item.Title = product.Title;
        product_item.MeasureUnitTitle = product.MeasureUnits.find(
          (mu) => mu.MeasureUnitID === product_item.MeasureUnitID
        )?.MeasureUnitTitle;
      }

      product_item.StatusTitle = statuses.find(
        (sts) => sts.StatusID === product_item.StatusID
      )?.Title;

      //--- managing unique id (UID) for new items
      if (product_item.ItemID === 0 && selectedProductRequestItem === null) {
        product_item.UID = uuid();
        record.Items = [...record.Items, product_item];
      } else if (
        product_item.ItemID === 0 &&
        selectedProductRequestItem !== null
      ) {
        const index = record.Items.findIndex(
          (item) => item.UID === selectedProductRequestItem.UID
        );
        record.Items[index] = product_item;
      }
    }

    //------

    setRecord({ ...record });
    setSelectedProductRequestItem(null);
  };

  const handleDeleteProductRequestItem = async (item) => {
    setProgress(true);

    try {
      if (item.ItemID > 0) {
        await onDeleteProductRequestItem(item.ItemID);

        record.Items = record.Items.filter((i) => i.ItemID !== item.ItemID);
      } else {
        record.Items = record.Items.filter((i) => i.UID !== item.UID);
      }

      setRecord({ ...record });
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleCloseProductRequestItemModal = () => {
    setSelectedProductRequestItem(null);
    setShowProductRequestItemModal(false);
  };

  const handleEditProductRequestItem = (data) => {
    setSelectedProductRequestItem(data);
    setShowProductRequestItemModal(true);
  };

  const handleNewItemClick = () => {
    setSelectedProductRequestItem(null);
    setShowProductRequestItemModal(true);
  };

  //------

  const is_disable =
    record?.Items?.length === 0 || (validateForm({ record, schema }) && true);

  const status_id =
    selectedObject === null ? record.StatusID : selectedObject.StatusID;

  const footer_config = {
    is_disable,
    progress,
    hasSaveApproveAccess,
    selectedObject,
    handleSubmit,
    handleSubmitAndApprove,
    hasRejectAccess,
    clearRecord,
    onApprove,
    onReject,
    onCancel,
  };

  //------

  return (
    <>
      <ModalWindow
        isOpen={isOpen}
        isEdit={isEdit}
        inProgress={progress}
        disabled={is_disable}
        width={1250}
        footer={getFooterButtons(footer_config)}
        onCancel={onCancel}
      >
        <Form ref={formRef} name="dataForm">
          <Row gutter={[5, 1]} style={{ marginLeft: 1 }}>
            {formUI && <>{renderFormUI(formUI, formConfig)}</>}

            {record.Items && (
              <>
                <Col xs={24}>
                  <Form.Item>
                    <Row gutter={[0, 15]}>
                      <Col xs={24}>
                        <DetailsTable
                          records={record.Items}
                          columns={getProductRequestItemsColumns(
                            access,
                            status_id,
                            handleEditProductRequestItem,
                            handleDeleteProductRequestItem
                          )}
                          emptyDataMessage={Words.no_product_item}
                        />
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
              </>
            )}

            {status_id === 1 && (
              <Col xs={24}>
                <Form.Item>
                  {getNewProductRequestItemButton(
                    record?.FrontSideAccountID === 0,
                    handleNewItemClick
                  )}
                </Form.Item>
              </Col>
            )}
          </Row>
        </Form>
      </ModalWindow>

      {showProductRequestItemModal && (
        <ProductRequestItemModal
          isOpen={showProductRequestItemModal}
          selectedObject={selectedProductRequestItem}
          setParams={handleGetItemParams}
          onOk={handleSaveProductRequestItem}
          onCancel={handleCloseProductRequestItemModal}
        />
      )}
    </>
  );
};

export default ProductRequestModal;
