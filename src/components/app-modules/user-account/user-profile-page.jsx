import React, { useState } from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Descriptions } from "antd";
import Words from "../../../resources/words";
import Colors from "../../../resources/colors";
import utils from "../../../tools/utils";
import service from "../../../services/user-account/user-account-services";
import { usePageContext } from "../../contexts/page-context";
import { handleError } from "./../../../tools/form-manager";

const { Text } = Typography;

const UserProfilePage = () => {
  const { progress, setProgress } = usePageContext();

  const [memberInfo, setMemberInfo] = useState(null);

  const valueColor = Colors.blue[7];

  useMount(async () => {
    setProgress(true);

    try {
      const data = await service.getMemberProfile();

      setMemberInfo(data);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  });

  //------

  return (
    <Spin spinning={progress}>
      <Row gutter={[10, 15]}>
        <Col xs={24}>
          <Text
            style={{
              paddingBottom: 20,
              paddingRight: 5,
              fontSize: 18,
            }}
            strong
            type="success"
          >
            {Words.profile}
          </Text>
        </Col>
        {memberInfo !== null && (
          <Col xs={24}>
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
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(`${memberInfo.MemberID}`)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.national_code}>
                <Text style={{ color: Colors.red[7] }}>
                  {utils.farsiNum(`${memberInfo.NationalCode}`)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.full_name}>
                <Text
                  style={{ color: Colors.green[6] }}
                >{`${memberInfo.FirstName} ${memberInfo.LastName}`}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.username}>
                <Text style={{ color: Colors.orange[6] }}>
                  {utils.farsiNum(`${memberInfo.Username}`)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.mobile}>
                <Text style={{ color: Colors.purple[6] }}>
                  {utils.farsiNum(`${memberInfo.Mobile}`)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.fix_tel}>
                <Text style={{ color: Colors.purple[6] }}>
                  {utils.farsiNum(`${memberInfo.FixTel}`)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.province}>
                <Text style={{ color: valueColor }}>
                  {memberInfo.ProvinceTitle}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.city}>
                <Text style={{ color: valueColor }}>
                  {memberInfo.CityTitle}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.address}>
                <Text style={{ color: valueColor }}>{memberInfo.Address}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.postal_code}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(`${memberInfo.PostalCode}`)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.reg_date}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(
                    `${utils.dayNameFromText(memberInfo.RegDate)}`
                  )}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={Words.reg_time}>
                <Text style={{ color: valueColor }}>
                  {utils.farsiNum(`${utils.colonTime(memberInfo.RegTime)}`)}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        )}
      </Row>
    </Spin>
  );
};

export default UserProfilePage;
