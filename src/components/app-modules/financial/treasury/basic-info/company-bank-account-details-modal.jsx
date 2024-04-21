import React, { useState } from "react";
import { useMount } from "react-use";
import {
  Button,
  Row,
  Col,
  Typography,
  Descriptions,
  Alert,
  Tabs,
  Popconfirm,
} from "antd";
import { QuestionCircleOutlined as QuestionIcon } from "@ant-design/icons";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import TafsilInfoViewer from "../../../../common/tafsil-info-viewer";
import service from "./../../../../../services/financial/accounts/tafsil-accounts-service";
import ModalWindow from "../../../../common/modal-window";
import { handleError } from "../../../../../tools/form-manager";

const { Text } = Typography;
const valueColor = Colors.blue[7];

const CompanyBankAccountDetailsModal = ({
  selectedObject,
  isOpen,
  onOk,
  onCreateTafsilAccount,
}) => {
  const [hasCreateTafsilAccountAccess, setHasCreateTafsilAccountAccess] =
    useState(false);
  const [progress, setProgress] = useState(false);

  const {
    BankTitle,
    AccountNo,
    BankBranchTitle,
    BranchCode,
    CityTitle,
    ShebaID,
    Credit,
    CurrencyTitle,
    BankAccountTypeTitle,
    DetailsText,
    // AccountID,
    // BranchID,
    // BankID,
    // CityID,
    // CurrencyID,
    // BankAccountTypeID,
    TafsilInfo,
  } = selectedObject;

  useMount(async () => {
    if (TafsilInfo.length === 0) {
      try {
        const data = await service.getTafsilAccountAccesses(
          "CompanyBankAccounts"
        );

        const { HasCreateTafsilAccountAccess } = data;

        setHasCreateTafsilAccountAccess(HasCreateTafsilAccountAccess);
      } catch (ex) {
        handleError(ex);
      }
    }
  });

  const items = [
    {
      label: Words.info,
      key: "info",
      children: (
        <Descriptions
          bordered
          column={{
            //   md: 2, sm: 2,
            lg: 2,
            md: 2,
            xs: 1,
          }}
          size="middle"
        >
          <Descriptions.Item label={Words.bank_account_type}>
            <Text style={{ color: valueColor }}>{BankAccountTypeTitle}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.bank}>
            <Text style={{ color: Colors.cyan[6] }}>{BankTitle}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.bank_branch}>
            <Text style={{ color: valueColor }}>
              {utils.farsiNum(`${BankBranchTitle} (${BranchCode})`)}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.city}>
            <Text style={{ color: Colors.purple[6] }}>{CityTitle}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.currency_type}>
            <Text style={{ color: valueColor }}>{CurrencyTitle}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.credit}>
            <Text style={{ color: valueColor }}>
              {Credit > 0 ? utils.farsiNum(utils.moneyNumber(Credit)) : ""}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.sheba_no} span={2}>
            <Text style={{ color: Colors.volcano[6] }}>
              {ShebaID.length > 0 ? ShebaID : ""}
            </Text>
          </Descriptions.Item>
          {DetailsText.length > 0 && (
            <Descriptions.Item label={Words.descriptions} span={2}>
              <Text
                style={{
                  color: Colors.purple[7],
                  whiteSpace: "pre-line",
                }}
              >
                {utils.farsiNum(DetailsText)}
              </Text>
            </Descriptions.Item>
          )}
        </Descriptions>
      ),
    },
    {
      label: Words.tafsil_account,
      key: "tafsil-account",
      children: <TafsilInfoViewer tafsilInfo={TafsilInfo} />,
    },
  ];

  const handleCreateTafsilAccount = async () => {
    if (TafsilInfo.length === 0) {
      setProgress(true);

      try {
        await onCreateTafsilAccount();
      } catch (ex) {
        handleError(ex);
      }

      setProgress(false);
    }
  };

  const getFooterButtons = () => {
    let buttons = [
      <Button key="close-button" onClick={onOk}>
        {Words.confirm}
      </Button>,
    ];

    if (hasCreateTafsilAccountAccess && TafsilInfo.length === 0) {
      buttons = [
        <Popconfirm
          title={Words.questions.sure_to_create_tafsil_account}
          onConfirm={handleCreateTafsilAccount}
          okText={Words.yes}
          cancelText={Words.no}
          icon={<QuestionIcon style={{ color: "red" }} />}
          disabled={progress}
        >
          <Button key="submit-button" type="primary" loading={progress}>
            {Words.create_tafsil_account}
          </Button>
        </Popconfirm>,
        ...buttons,
      ];
    }
    return buttons;
  };

  return (
    <ModalWindow
      isOpen={isOpen}
      title={Words.more_details}
      footer={getFooterButtons()}
      disabled={progress}
      onCancel={onOk}
      width={750}
    >
      <section>
        <article
          id="info-content"
          className="scrollbar-normal"
          style={{ maxHeight: "calc(100vh - 180px)" }}
        >
          <Row gutter={[10, 10]}>
            <Col xs={24}>
              <Alert
                message={
                  <Text style={{ fontSize: 14 }}>
                    {utils.farsiNum(`${Words.account_no}: ${AccountNo}`)}
                  </Text>
                }
                type="info"
              />
            </Col>
            <Col xs={24}>
              <Tabs defaultActiveKey="1" type="card" items={items} />
            </Col>
          </Row>
        </article>
      </section>
    </ModalWindow>
  );
};

export default CompanyBankAccountDetailsModal;
