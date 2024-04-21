import React, { useState } from "react";
import { Form } from "antd";
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

const ProductRequestModal = ({
  access,
  open,
  selectedObject,
  onOk,
  onCancel,
}) => {
  const [form] = Form.useForm();

  const [progress, setProgress] = useState(false);
  const [formUI, setFormUI] = useState();

  const [frontSideAccountSearchProgress, setFrontSideAccountSearchProgress] =
    useState(false);
  const [frontSideAccounts, setFrontSideAccounts] = useState([]);

  const [memberSearchProgress, setMemberSearchProgress] = useState(false);
  const [members, setMembers] = useState([]);

  const [hasSaveApproveAccess, setHasSaveApproveAccess] = useState(false);
  const [hasRejectAccess, setHasRejectAccess] = useState(false);

  //   const [products, setProducts] = useState([]);
  //   const [statuses, setStatuses] = useState([]);

  //   const [selectedProductRequestItem, setSelectedProductRequestItem] =
  //     useState(null);
  //   const [showProductRequestItemModal, setShowProductRequestItemModal] =
  //     useState(false);

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
    if (!value) {
      setFrontSideAccounts([]);
      form.setFieldsValue({ FrontSideAccountID: undefined });
    } else {
      const data = await handleSearchFrontSideAccount(value);
      setFrontSideAccounts(data);
    }
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
          propValue: !form.getFieldValue("FrontSideTypeID"),
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
  ];

  const handleClearForm = () => {
    form.resetFields();

    setMembers([]);
    setFrontSideAccounts([]);
  };

  const handleSubmitForm = async () => {
    try {
      const form_values = await form.validateFields();

      onOk(form_values);
    } catch (ex) {
      handleError(ex);
    }
  };

  //   -------------------------------------------

  console.log("UI", formUI);
  console.log(form.getFieldsValue());

  return (
    <AntdModal
      open={open}
      editMode={selectedObject}
      initialValues={selectedObject}
      progress={progress}
      width={1250}
      //   searchModal
      // disabled={}
      // footer={<ModalFooter/>}
      onSubmit={handleSubmitForm}
      onCancel={onCancel}
      onClear={handleClearForm}
    >
      <AntdControl control={ControlType.Form} form={form}>
        {formUI && <>{renderFormUI(formUI, formItemProperties)}</>}
      </AntdControl>
    </AntdModal>
  );
};

export default ProductRequestModal;
