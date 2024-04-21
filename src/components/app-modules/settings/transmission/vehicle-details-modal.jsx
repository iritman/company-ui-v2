import React, { useState } from "react";
import { useMount } from "react-use";
import {
  Button,
  Row,
  Col,
  Typography,
  Alert,
  Descriptions,
  Tabs,
  Popconfirm,
} from "antd";
import { QuestionCircleOutlined as QuestionIcon } from "@ant-design/icons";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import TafsilInfoViewer from "./../../../common/tafsil-info-viewer";
import ModalWindow from "../../../common/modal-window";
import { handleError } from "../../../../tools/form-manager";
import service from "../../../../services/financial/accounts/tafsil-accounts-service";

const { Text } = Typography;

const VehicleDetailsModal = ({
  vehicle,
  isOpen,
  onOk,
  onCreateTafsilAccount,
}) => {
  const valueColor = Colors.blue[7];

  const [hasCreateTafsilAccountAccess, setHasCreateTafsilAccountAccess] =
    useState(false);
  const [progress, setProgress] = useState(false);

  const {
    VehicleTypeTitle,
    BrandTitle,
    ModelTitle,
    ProductYear,
    Pelak,
    DetailsText,
    RegFirstName,
    RegLastName,
    RegDate,
    RegTime,
    TafsilInfo,
  } = vehicle;

  useMount(async () => {
    if (TafsilInfo.length === 0) {
      try {
        const data = await service.getTafsilAccountAccesses("Vehicles");

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
          <Descriptions.Item label={Words.pelak}>
            <Text style={{ color: Colors.red[7] }}>
              {utils.farsiNum(Pelak)}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.product_year}>
            <Text style={{ color: Colors.green[7] }}>
              {utils.farsiNum(ProductYear)}
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
          <Descriptions.Item label={Words.reg_member}>
            <Text style={{ color: valueColor }}>
              {`${RegFirstName} ${RegLastName}`}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.reg_date_time}>
            <Text style={{ color: valueColor }}>
              {utils.farsiNum(
                `${utils.slashDate(RegDate)} - ${utils.colonTime(RegTime)}`
              )}
            </Text>
          </Descriptions.Item>
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
                message={utils.farsiNum(
                  `${VehicleTypeTitle} ${BrandTitle} ${ModelTitle}`
                )}
                type="info"
                showIcon
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

export default VehicleDetailsModal;
