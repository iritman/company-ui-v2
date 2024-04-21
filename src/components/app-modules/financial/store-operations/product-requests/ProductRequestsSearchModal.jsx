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
import { renderFormUI } from "../../../../antd-form-components/AntdFormRenderer";
import {
  ControlType,
  AntdControl,
} from "../../../../antd-form-components/AntdControl";
// import useFormValidation from "../../../../antd-form-components/FormValidationHook";

const ProductRequestsSearchModal = ({ open, onOk, onCancel, filter }) => {
  const [form] = Form.useForm();

  const [progress, setProgress] = useState(false);
  const [formUI, setFormUI] = useState();

  const [memberSearchProgress, setMemberSearchProgress] = useState(false);
  const [members, setMembers] = useState([]);

  const [frontSideAccountSearchProgress, setFrontSideAccountSearchProgress] =
    useState(false);
  const [frontSideAccounts, setFrontSideAccounts] = useState([]);

  //   -------------------------------------------

  const configSearchFilter = async () => {
    if (filter) form.setFieldsValue(filter);

    //------

    if (filter) {
      if (filter.MemberID > 0) {
        const request_member = await service.searchMemberByID(filter.MemberID);

        setMembers(request_member);
      }

      if (filter.FrontSideTypeID > 0) {
        const front_side_accounts = await handleSearchFrontSideAccount(
          filter.FrontSideTypeID
        );

        setFrontSideAccounts(front_side_accounts);
      }
    }
  };

  useMount(async () => {
    setProgress(true);

    try {
      const form_ui = await getFormUI(
        forms.FINANCIAL_STORE_PRODUCT_REQUEST_SEARCH
      );
      setFormUI(form_ui);

      await configSearchFilter();
    } catch (err) {
      handleError(err);
    }

    setProgress(false);
  });

  //   -------------------------------------------

  const handleSearchMember = async (searchText) => {
    setMemberSearchProgress(true);

    try {
      const data = await service.searchMembers(searchText);

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
      fieldName: "MemberID",
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
    } catch {}
  };

  //   -------------------------------------------
  //   const submittable = useFormValidation(form);
  //   -------------------------------------------

  return (
    <AntdModal
      open={open}
      initialValues={filter}
      progress={progress}
      width={850}
      searchModal
      //   disabled={!submittable}
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

export default ProductRequestsSearchModal;
