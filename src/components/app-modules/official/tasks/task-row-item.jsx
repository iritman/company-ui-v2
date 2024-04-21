import { Row, Col, Card, Space, Typography, Tag } from "antd";
import {
  PaperClipOutlined as AttachedFileIcon,
  PushpinOutlined as PinIcon,
  FileTextOutlined as FileIcon,
  EyeInvisibleOutlined as UnseenIcon,
} from "@ant-design/icons";
import MemberProfileImage from "./../../../common/member-profile-image";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";

const { Text } = Typography;

const TaskRowItem = ({ task, onClick }) => {
  const {
    TaskID,
    Title,
    SeenDate,
    ResponsePicFileName,
    ReminderInfo,
    Tags,
    Files,
    Reports,
    NewReportsCount,
  } = task;

  const getDelayText = (delayInfo) => {
    let result = "";

    const { Days, Hours, Minutes } = delayInfo;

    if (Days > 0)
      result = utils.farsiNum(`${Days} ${Words.day} ${Words.delay}`);
    else if (Hours > 0)
      result = utils.farsiNum(`${Hours} ${Words.hour} ${Words.delay}`);
    else if (Minutes > 0)
      result = utils.farsiNum(`${Minutes} ${Words.minute} ${Words.delay}`);

    return result;
  };

  return (
    <Card key={TaskID} size="small" hoverable onClick={onClick}>
      <Row gutter={[10]}>
        <Col xs={24} md={12}>
          <Space>
            {Files.length > 0 && (
              <AttachedFileIcon
                style={{
                  color: Colors.orange[6],
                  fontSize: 18,
                }}
              />
            )}

            {Reports.length > 0 && (
              <FileIcon
                style={{
                  color: NewReportsCount > 0 ? Colors.red[6] : Colors.blue[5],
                  fontSize: 18,
                }}
              />
            )}

            <Text>{Title}</Text>
          </Space>
        </Col>
        <Col xs={24} md={12} style={{ direction: "ltr" }}>
          <Space>
            <Col xs={24}>
              {Tags.map((tag) => (
                <Tag
                  color={tag.Color}
                  style={{ margin: 3 }}
                  icon={<PinIcon />}
                  key={tag.TagID}
                >
                  {tag.Title}
                </Tag>
              ))}
            </Col>

            {SeenDate.length === 0 && (
              <UnseenIcon
                style={{
                  color: Colors.blue[6],
                  fontSize: 16,
                }}
              />
            )}

            <MemberProfileImage fileName={ResponsePicFileName} size="small" />

            {ReminderInfo.HasDelay && (
              <Text style={{ color: Colors.red[6] }}>
                {getDelayText(ReminderInfo)}
              </Text>
            )}
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default TaskRowItem;
