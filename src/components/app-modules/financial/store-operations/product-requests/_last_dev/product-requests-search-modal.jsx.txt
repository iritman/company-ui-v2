import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row } from "antd";
import ModalWindow from "../../../../common/modal-window";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  handleError,
} from "../../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "../../../../contexts/modal-context";
import service from "../../../../../services/financial/store-operations/product-requests-service";
import {
  forms,
  getFormUI,
} from "../../../../../services/app/form-manager-service";
import {
  // controlTypes,
  getSchema,
  getInitRecord,
  renderFormUI,
} from "../../../../common/form-manager/form-renderer";

const formRef = React.createRef();

const ProductRequestsSearchModal = ({ isOpen, filter, onOk, onCancel }) => {
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

  const resetContext = useResetContext();

  // ------

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

  const handleChangeMember = (value) => {
    const rec = { ...record };
    rec.MemberID = value || 0;
    setRecord(rec);
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

  // ------

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
        {
          eventName: "onChange",
          eventMethod: handleChangeMember,
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

    setMembers([]);
    setFrontSideAccounts([]);
    setErrors({});
    setRecord(rec);
    loadFieldsValue(formRef, rec);
  };

  useMount(async () => {
    resetContext();

    setProgress(true);

    try {
      const form_ui = await getFormUI(
        forms.FINANCIAL_STORE_PRODUCT_REQUEST_SEARCH
      );
      setFormUI(form_ui);

      const init_record = getInitRecord(form_ui);
      setInitRecord(init_record);

      const schema = getSchema(form_ui);
      setSchema(schema);

      setRecord(init_record);
      initModal(formRef, filter, setRecord);

      //------

      if (filter) {
        if (filter.MemberID > 0) {
          const request_member = await service.searchMemberByID(
            filter.MemberID
          );

          setMembers(request_member);
        }

        if (filter.FrontSideTypeID > 0) {
          const front_side_accounts = await handleSearchFrontSideAccount(
            filter.FrontSideTypeID
          );

          setFrontSideAccounts(front_side_accounts);
        }
      }
    } catch (err) {
      handleError(err);
    }
    setProgress(false);
  });

  // ------

  return (
    <ModalWindow
      isOpen={isOpen}
      inProgress={progress}
      disabled={validateForm({ record, schema }) && true}
      searchModal
      onClear={clearRecord}
      onSubmit={() => onOk(record)}
      onCancel={onCancel}
      width={850}
    >
      <Form ref={formRef} name="dataForm">
        <Row gutter={[10, 5]} style={{ marginLeft: 1 }}>
          {formUI && <>{renderFormUI(formUI, formConfig)}</>}
        </Row>
      </Form>
    </ModalWindow>
  );
};

export default ProductRequestsSearchModal;
