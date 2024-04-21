import React, { useState } from "react";
import { useMount } from "react-use";
import {
  Spin,
  Row,
  Col,
  Typography,
  Space,
  InputNumber,
  Popconfirm,
  Button,
  message,
} from "antd";
import { QuestionCircleOutlined as QuestionIcon } from "@ant-design/icons";
import utils from "./../../../../tools/utils";
import service from "./../../../../services/settings/timex/holidays-service";
import {
  checkAccess,
  GetSimplaDataPageMethods,
  handleError,
} from "../../../../tools/form-manager";
import { usePageContext } from "./../../../contexts/page-context";
import PersianCalendar from "../../../common/persian-calendar";
import Words from "../../../../resources/words";

const { Text } = Typography;

const currentYear = parseInt(
  utils.currentPersianDateWithoutSlash().substring(0, 4)
);

const recordID = "HolidayID";

const HolidaysPage = ({ pageName }) => {
  const [holidays, setHolidays] = useState([]);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const { progress, setProgress, access, setAccess } = usePageContext();

  const { handleResetContext } = GetSimplaDataPageMethods({
    service,
    recordID,
  });

  useMount(async () => {
    handleResetContext();
    await checkAccess(setAccess, pageName);

    await loadHolidays(currentYear);
  });

  const loadHolidays = async (year) => {
    setProgress(true);

    try {
      const holidays = await service.getHolidays(year);

      setHolidays(holidays);
    } catch (err) {
      handleError(err);
    }

    setProgress(false);
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);

    loadHolidays(value);
  };

  const handleClickDate = async (date) => {
    const { CanAdd, CanDelete } = access;

    if (CanAdd || CanDelete) {
      const date_text = utils.dateToText(date);

      setProgress(true);

      try {
        const data = await service.saveData({ HolidayDate: date_text });

        if (data.HolidayID) {
          setHolidays([...holidays, data]);
        } else {
          setHolidays(holidays.filter((h) => h.HolidayDate !== date_text));
        }
      } catch (err) {
        handleError(err);
      }

      setProgress(false);
    }
  };

  const handleRegJomeHolidays = async () => {
    const { CanAdd } = access;

    if (CanAdd) {
      setProgress(true);

      try {
        const holidays = await service.setJomeHolidays(selectedYear);

        setHolidays(holidays);

        message.success(Words.messages.jome_holidays_submitted);
      } catch (err) {
        handleError(err);
      }

      setProgress(false);
    }
  };

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
            {Words.holidays}
          </Text>
        </Col>

        <Col xs={24}>
          <Space>
            <Text>{Words.year}</Text>

            <InputNumber
              min={1400}
              max={1499}
              defaultValue={currentYear}
              onChange={handleYearChange}
            />

            {access?.CanAdd && (
              <Popconfirm
                title={Words.questions.sure_to_reg_jome_holidays}
                onConfirm={handleRegJomeHolidays}
                okText={Words.yes}
                cancelText={Words.no}
                icon={<QuestionIcon style={{ color: "red" }} />}
              >
                <Button type="primary" danger>
                  {Words.reg_jome_holidays}
                </Button>
              </Popconfirm>
            )}
          </Space>
        </Col>

        <Col xs={24}>
          <hr />
        </Col>

        {utils.getMonthList().map((month) => (
          <Col xs={24} md={8} key={month.monthID}>
            <PersianCalendar
              year={selectedYear}
              month={month.monthID}
              makeHolidaysRed={true}
              holidays={holidays}
              holidayField="HolidayDate"
              selectedDays={holidays}
              selectedDayField="HolidayDate"
              selectedDaysColor="#fadcd9"
              onClick={handleClickDate}
            />
          </Col>
        ))}
      </Row>
    </Spin>
  );
};

export default HolidaysPage;
