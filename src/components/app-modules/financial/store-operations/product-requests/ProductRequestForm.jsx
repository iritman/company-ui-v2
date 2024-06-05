import React, { useState, useEffect } from "react";
import { useMount } from "react-use";
import { Col, Form, Row } from "antd";
import {
  forms,
  getFormUI,
} from "../../../../../services/app/form-manager-service";
import service from "../../../../../services/financial/store-operations/product-requests-service";
import { handleError } from "../../../../antd-general-components/FormManager";
import {
  AntdControl,
  ControlType,
} from "../../../../antd-form-components/AntdControl";
import {
  ControlTypes,
  renderFormUI,
} from "../../../../antd-form-components/AntdFormRenderer";
import DetailsTable from "../../../../common/details-table";
import Words from "../../../../../resources/words";
import utils from "../../../../../tools/utils";
import { getItemsColumns } from "./ProductRequestModalCode";
import ProductRequestItemForm from "./ProductRequestItemForm";
import { v4 as uuid } from "uuid";

const ProductRequestForm = ({ selectedObject, nextAction, onChange }) => {
  const [form] = Form.useForm();
  const form_data = Form.useWatch([], form) || {};
  const [readonlyForm, setReadonlyForm] = useState(true);

  const [progress, setProgress] = useState(false);
  const [formUI, setFormUI] = useState();

  const [frontSideAccountSearchProgress, setFrontSideAccountSearchProgress] =
    useState(false);
  const [frontSideAccounts, setFrontSideAccounts] = useState([]);

  const [memberSearchProgress, setMemberSearchProgress] = useState(false);
  const [members, setMembers] = useState([]);

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

  const configDisabledProps = (form_item_properties) => {
    const items_base_props = [...form_item_properties];

    const disable_prop = (fieldName) => {
      return {
        propName: "disabled",
        propValue: isReadonlyField(fieldName),
      };
    };

    let main_readonly_fields = nextAction?.NextStep?.ReadonlyMainFields;

    if (
      main_readonly_fields &&
      !main_readonly_fields.AllFields &&
      main_readonly_fields.Fields
    ) {
      main_readonly_fields.Fields.forEach((field_name) => {
        const index = items_base_props.findIndex(
          (item) => item.fieldName === field_name
        );

        if (index > -1) {
          const base_field = items_base_props[index];

          if (base_field.props) {
            const item_disable_prop_index = base_field.props.findIndex(
              (p) => p.propName === "disabled"
            );

            if (item_disable_prop_index > -1) {
              items_base_props[index].props[item_disable_prop_index].propValue =
                items_base_props[index].props[item_disable_prop_index]
                  .propValue || disable_prop(field_name).propValue;
            } else {
              items_base_props[index].props = [
                ...base_field.props,
                disable_prop(field_name),
              ];
            }
          } else {
            items_base_props[index].props = [disable_prop(field_name)];
          }
        } else {
          items_base_props = [
            ...items_base_props,
            { fieldName: field_name, props: [disable_prop(field_name)] },
          ];
        }
      });
    } else if (main_readonly_fields && main_readonly_fields.AllFields) {
      // If form is disable but we manually set diabled property for field(s)
      // so, we need to set disabled to true
      // for example: FrontSideAccountID field
      let field_index = items_base_props.findIndex((f) =>
        f.props?.find((p) => p.propName === "disabled")
      );
      if (field_index > -1) {
        let prop_index = items_base_props[field_index].props.findIndex(
          (p) => p.propName === "disabled"
        );

        if (prop_index > -1) {
          items_base_props[field_index].props[prop_index].propValue = true;
        }
      }
    }

    return items_base_props;
  };

  useMount(async () => {
    setProgress(true);

    try {
      const form_ui = await getFormUI(forms.FINANCIAL_STORE_PRODUCT_REQUEST);
      setFormUI(form_ui);

      await configSelectedObject();

      setReadonlyForm(isReadonlyForm());
    } catch (err) {
      handleError(err);
    }

    setProgress(false);
  });

  useEffect(() => {
    onChange(form_data);
  }, [form_data]);
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

  const isReadonlyForm = () => {
    return (
      !nextAction?.NextStep.FormPermissions?.CanEdit ||
      nextAction?.NextStep.ReadonlyMainFields?.AllFields === true
    );
  };

  //   const isReadonlyFormItems = () => {
  //     return (
  //       !nextAction?.NextStep.FormPermissions?.CanEdit ||
  //       nextAction?.NextStep.ReadonlyItemFields?.AllFields === true
  //     );
  //   };

  const isReadonlyField = (field_name) => {
    let result = true;

    if (!readonlyForm && nextAction) {
      const { ReadonlyMainFields } = nextAction.NextStep;

      if (!ReadonlyMainFields.Fields?.find((f) => f === field_name))
        result = false;
    }

    return result;
  };

  let formItemProperties = [
    {
      fieldName: "RequestID",
      controlTypeID: ControlTypes.Label,
      props: [
        {
          propName: "value",
          propValue: selectedObject
            ? utils.farsiNum(selectedObject.RequestID)
            : "-",
        },
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

  const getFormStatusCode = () => {
    let status_id = form_data.StatusID || 1;

    return status_id;
  };

  const handleEditItem = (data) => {
    setSelectedItem(data);
    setShowItemModal(true);
  };

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

  const handleCloseItemModal = () => {
    setSelectedItem();
    setShowItemModal(false);
  };

  //   -------------------------------------------

  return (
    <>
      <AntdControl
        control={ControlType.Form}
        form={form}
        disabled={readonlyForm}
      >
        {formUI && (
          <>{renderFormUI(formUI, configDisabledProps(formItemProperties))}</>
        )}
      </AntdControl>

      {form_data.Items && (
        <>
          <Col xs={24}>
            <Form.Item>
              <Row gutter={[0, 15]}>
                <Col xs={24}>
                  <DetailsTable
                    records={form_data.Items}
                    columns={getItemsColumns(
                      { CanEdit: true, CanDelete: false },
                      getFormStatusCode(),
                      handleEditItem,
                      null
                    )}
                    emptyDataMessage={Words.no_product_item}
                  />
                </Col>
              </Row>
            </Form.Item>
          </Col>
        </>
      )}

      {showItemModal && (
        <ProductRequestItemForm
          open={showItemModal}
          selectedObject={selectedItem}
          readonlyFields={nextAction?.NextStep?.ReadonlyItemFields}
          onOk={handleSaveItem}
          onCancel={handleCloseItemModal}
        />
      )}
    </>
  );
};

export default ProductRequestForm;
