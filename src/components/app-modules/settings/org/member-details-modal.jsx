import React, { useState } from "react";
import { useMount } from "react-use";
import {
  Button,
  Row,
  Col,
  Typography,
  Alert,
  Descriptions,
  Space,
  Tabs,
  Popconfirm,
} from "antd";
import { QuestionCircleOutlined as QuestionIcon } from "@ant-design/icons";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import { getGenderTitle } from "../../../../tools/general";
import MemberProfileImage from "../../../common/member-profile-image";
import TafsilInfoViewer from "./../../../common/tafsil-info-viewer";
import { handleError } from "../../../../tools/form-manager";
import service from "../../../../services/financial/accounts/tafsil-accounts-service";
import ModalWindow from "../../../common/modal-window";

const { Text } = Typography;

const MemberDetailsModal = ({
  member,
  isOpen,
  onOk,
  onCreateTafsilAccount,
}) => {
  const valueColor = Colors.blue[7];

  const [hasCreateTafsilAccountAccess, setHasCreateTafsilAccountAccess] =
    useState(false);
  const [progress, setProgress] = useState(false);

  const {
    MemberID,
    FirstName,
    LastName,
    GenderID,
    NationalCode,
    BirthDate,
    Mobile,
    FixTel,
    // CityID,
    CityTitle,
    // ProvinceID,
    ProvinceTitle,
    Address,
    PostalCode,
    PicFileName,
    Username,
    RegDate,
    RegTime,
    // RegMemberID,
    RegFirstName,
    RegLastName,
    IsActive,
    TafsilInfo,
  } = member;

  useMount(async () => {
    if (TafsilInfo.length === 0) {
      try {
        const data = await service.getTafsilAccountAccesses("Members");

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
          <Descriptions.Item label={Words.national_code}>
            <Text style={{ color: Colors.orange[6] }}>
              {utils.farsiNum(`${NationalCode}`)}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.gender}>
            <Text style={{ color: valueColor }}>
              {getGenderTitle(GenderID)}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.birth_date}>
            <Text style={{ color: valueColor }}>
              {BirthDate.length > 0 &&
                utils.farsiNum(utils.slashDate(`${BirthDate}`))}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.mobile}>
            <Text style={{ color: valueColor }}>
              {utils.farsiNum(`${Mobile}`)}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.fix_tel}>
            <Text style={{ color: valueColor }}>
              {utils.farsiNum(`${FixTel}`)}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.postal_code}>
            <Text style={{ color: valueColor }}>
              {utils.farsiNum(`${PostalCode}`)}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.province}>
            <Text style={{ color: valueColor }}>
              {utils.farsiNum(`${ProvinceTitle}`)}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.city}>
            <Text style={{ color: valueColor }}>
              {utils.farsiNum(`${CityTitle}`)}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.address} span={2}>
            <Text style={{ color: valueColor, whiteSpace: "pre" }}>
              {utils.farsiNum(`${Address}`)}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.username}>
            <Text style={{ color: Colors.cyan[6] }}>
              {utils.farsiNum(`${Username}`)}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.reg_date}>
            <Text style={{ color: valueColor }}>
              {utils.farsiNum(utils.slashDate(`${RegDate}`))}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.reg_time}>
            <Text style={{ color: valueColor }}>
              {utils.farsiNum(utils.colonTime(`${RegTime}`))}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.reg_member}>
            <Text style={{ color: valueColor }}>
              {`${RegFirstName} ${RegLastName}`}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label={Words.status} span={2}>
            <Text style={{ color: IsActive ? Colors.green[6] : Colors.red[6] }}>
              {IsActive ? Words.active : Words.inactive}
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
                message={
                  <Space>
                    <MemberProfileImage fileName={PicFileName} />
                    <Text>
                      {utils.farsiNum(
                        `#${MemberID} - ${FirstName} ${LastName}`
                      )}
                    </Text>
                  </Space>
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

export default MemberDetailsModal;
