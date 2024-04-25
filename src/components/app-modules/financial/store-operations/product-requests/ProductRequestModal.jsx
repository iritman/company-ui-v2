import React, { useState } from "react";
import { Form, Col, Row, message } from "antd";
import { useMount } from "react-use";
import AntdModal from "../../../../antd-form-components/AntdModal";
import {
  forms,
  getFormUI,
} from "../../../../../services/app/form-manager-service";
import service from "../../../../../services/financial/store-operations/product-requests-service";
import { handleError } from "../../../../antd-general-components/FormManager";
import {
  ControlTypes,
  renderFormUI,
} from "../../../../antd-form-components/AntdFormRenderer";
import {
  ControlType,
  AntdControl,
} from "../../../../antd-form-components/AntdControl";
import utils from "../../../../../tools/utils";
import { getItemsColumns, getNewButton } from "./ProductRequestModalCode";
import ProductRequestItemModal from "./ProductRequestItemModal";
import DetailsTable from "./../../../../common/details-table";
import Words from "../../../../../resources/words";
import { v4 as uuid } from "uuid";

const ProductRequestModal = ({
  access,
  open,
  selectedObject,
  onOk,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const form_data = Form.useWatch([], form) || {};

  const [progress, setProgress] = useState(false);
  const [formUI, setFormUI] = useState();

  const [frontSideAccountSearchProgress, setFrontSideAccountSearchProgress] =
    useState(false);
  const [frontSideAccounts, setFrontSideAccounts] = useState([]);

  const [memberSearchProgress, setMemberSearchProgress] = useState(false);
  const [members, setMembers] = useState([]);

  const [hasSaveApproveAccess, setHasSaveApproveAccess] = useState(false);
  const [hasRejectAccess, setHasRejectAccess] = useState(false);

  const [selectedItem, setSelectedItem] = useState();
  const [showItemModal, setShowItemModal] = useState(false);

  //   -------------------------------------------

  const configSelectedObject = async () => {
    if (selectedObject) form.setFieldsValue(selectedObject);

    //------

    if (selectedObject) {
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
    }
  };

  useMount(async () => {
    setProgress(true);

    try {
      const form_ui = await getFormUI(forms.FINANCIAL_STORE_PRODUCT_REQUEST);
      setFormUI(form_ui);

      const data = await service.getParams();

      let { HasSaveApproveAccess, HasRejectAccess } = data;

      setHasSaveApproveAccess(HasSaveApproveAccess);
      setHasRejectAccess(HasRejectAccess);

      await configSelectedObject();
    } catch (err) {
      handleError(err);
    }

    setProgress(false);
  });

  //   -------------------------------------------

  const handleChangeRequestType = async (value) => {
    form.setFieldsValue({ FromStoreID: undefined, ToStoreID: undefined });

    const field_name = "ToStoreID";

    if (value === 5) {
      formUI.FormItems.find(
        (i) => i.FieldName === field_name
      ).IsMandatory = true;
    } else {
      formUI.FormItems.find(
        (i) => i.FieldName === field_name
      ).IsMandatory = false;
    }

    setFormUI({ ...formUI });
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

  const handleChangeFrontSideType = async (value) => {
    if (value) {
      const data = await handleSearchFrontSideAccount(value);
      setFrontSideAccounts(data);
    } else {
      setFrontSideAccounts([]);
      form.setFieldsValue({ FrontSideAccountID: undefined });
    }
  };

  const handleChangeFrontSideAccount = async (value) => {
    form.setFieldsValue({ FrontSideAccountID: value });
  };

  //   -------------------------------------------

  const formItemProperties = [
    {
      fieldName: "RequestID",
      controlTypeID: ControlTypes.Label,
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
      props: [
        {
          propName: "disabled",
          propValue: !form_data.FrontSideTypeID,
        },
        {
          propName: "loading",
          propValue: frontSideAccountSearchProgress,
        },
        {
          propName: "onChange",
          propValue: handleChangeFrontSideAccount,
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
  ];

  const handleClearForm = () => {
    form.resetFields();

    setMembers([]);
    setFrontSideAccounts([]);
  };

  const handleSubmitForm = async () => {
    setProgress(true);

    try {
      const form_values = await form.validateFields();

      form_values.Items.forEach((i) => {
        delete i.Title;
        delete i.ProductCode;
        delete i.MeasureUnitTitle;
        delete i.StatusTitle;
        delete i.UID;
        delete i.key;
      });

      const saved_row = await onOk(form_values);

      if (!selectedObject) handleClearForm();
      else form.setFieldsValue(saved_row);

      message.success(Words.messages.success_submit);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  //   -------------------------------------------

  const getFormStatusCode = () => {
    let status_id = form_data.StatusID || 1;

    return status_id;
  };

  //   -------------------------------------------

  const handleSaveItem = async (item, extra_data) => {
    const { products, statuses } = extra_data;

    const product = products.find((r) => r.ProductID === item.ProductID);

    if (product) {
      const { ProductCode, Title, MeasureUnits } = product;

      item.ProductCode = ProductCode;
      item.Title = Title;
      item.MeasureUnitTitle = MeasureUnits.find(
        (mu) => mu.MeasureUnitID === item.MeasureUnitID
      )?.MeasureUnitTitle;
    }

    item.StatusTitle = statuses.find(
      (s) => s.StatusID === (item.StatusID || 1)
    )?.Title;

    //----------------

    let items = form_data.Items ? [...form_data.Items] : [];

    if (item.ItemID) {
      const index = items.findIndex((i) => i.ItemID === item.ItemID);
      items[index] = item;
    } else {
      // --- managing unique id (UID) for new items
      if (!item.ItemID && !selectedItem) {
        item.UID = uuid();

        items = [...items, item];
      } else if (!item.ItemID && selectedItem) {
        const index = items.findIndex((i) => i.UID === selectedItem.UID);
        items[index] = item;
      }
    }

    form.setFieldsValue({ Items: items });

    handleCloseItemModal();
  };

  const handleDeleteItem = async (item) => {
    let items = form_data.Items ? [...form_data.Items] : [];

    if (item.ItemID) {
      items = items.filter((i) => i.ItemID !== item.ItemID);
    } else {
      items = items.filter((i) => i.UID !== item.UID);
    }

    form.setFieldsValue({ Items: items });
  };

  const handleCloseItemModal = () => {
    setSelectedItem();
    setShowItemModal(false);
  };

  const handleEditItem = (data) => {
    setSelectedItem(data);
    setShowItemModal(true);
  };

  const handleNewItemClick = () => {
    setSelectedItem();
    setShowItemModal(true);
  };

  //   -------------------------------------------

  return (
    <>
      <AntdModal
        open={open}
        editMode={selectedObject}
        initialValues={selectedObject}
        progress={progress}
        width={1250}
        // disabled={}
        // footer={<ModalFooter/>}
        onSubmit={handleSubmitForm}
        onCancel={onCancel}
        onClear={handleClearForm}
      >
        <AntdControl control={ControlType.Form} form={form}>
          {formUI && <>{renderFormUI(formUI, formItemProperties)}</>}

          {form_data.Items && (
            <>
              <Col xs={24}>
                <Form.Item>
                  <Row gutter={[0, 15]}>
                    <Col xs={24}>
                      <DetailsTable
                        records={form_data.Items}
                        columns={getItemsColumns(
                          access,
                          getFormStatusCode(),
                          handleEditItem,
                          handleDeleteItem
                        )}
                        emptyDataMessage={Words.no_product_item}
                      />
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
            </>
          )}

          {getFormStatusCode() === 1 && (
            <Col xs={24}>
              <Form.Item>
                {getNewButton(
                  !form_data.FrontSideAccountID ||
                    form_data.FrontSideAccountID === 0,
                  handleNewItemClick
                )}
              </Form.Item>
            </Col>
          )}
        </AntdControl>
      </AntdModal>

      {showItemModal && (
        <ProductRequestItemModal
          open={showItemModal}
          selectedObject={selectedItem}
          onOk={handleSaveItem}
          onCancel={handleCloseItemModal}
        />
      )}
    </>
  );
};

export default ProductRequestModal;
