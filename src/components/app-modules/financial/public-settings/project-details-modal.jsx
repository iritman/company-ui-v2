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
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import TafsilInfoViewer from "../../../common/tafsil-info-viewer";
import ModalWindow from "../../../common/modal-window";
import { handleError } from "../../../../tools/form-manager";
import service from "../../../../services/financial/accounts/tafsil-accounts-service";

const { Text } = Typography;
const valueColor = Colors.blue[7];

const ProjectDetailsModal = ({
  selectedObject,
  isOpen,
  onOk,
  onCreateTafsilAccount,
}) => {
  const [hasCreateTafsilAccountAccess, setHasCreateTafsilAccountAccess] =
    useState(false);
  const [progress, setProgress] = useState(false);

  const { ProjectID, Title, IsActive, TafsilInfo } = selectedObject;

  useMount(async () => {
    if (TafsilInfo.length === 0) {
      try {
        const data = await service.getTafsilAccountAccesses("Projects");

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
          <Descriptions.Item label={Words.id}>
            <Text style={{ color: Colors.red[6] }}>
              {utils.farsiNum(`${ProjectID}`)}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.status}>
            <Text style={{ color: IsActive ? Colors.green[6] : Colors.red[6] }}>
              {IsActive ? Words.active : Words.inactive}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.title} span={2}>
            <Text style={{ color: valueColor }}>{Title}</Text>
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
                message={
                  <Text style={{ fontSize: 14 }}>{utils.farsiNum(Title)}</Text>
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

export default ProjectDetailsModal;
