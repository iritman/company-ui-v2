import React, { useState } from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Space, InputNumber } from "antd";
import Words from "../../../../resources/words";
import utils from "./../../../../tools/utils";
import service from "./../../../../services/official/timex/user-my-work-shifts-service";
import {
  checkAccess,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import { usePageContext } from "./../../../contexts/page-context";
import DetailsModal from "./user-my-work-shift-details-modal";
import { handleError } from "./../../../../tools/form-manager";
import PersianCalendar from "./../../../common/persian-calendar";

const { Text } = Typography;

const recordID = "ShiftID";

const currentYear = parseInt(
  utils.currentPersianDateWithoutSlash().substring(0, 4)
);

const UserMyWorkShiftsPage = ({ pageName }) => {
  const [holidays, setHolidays] = useState([]);
  const [workShifts, setWorkShifts] = useState([]);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const {
    progress,
    setProgress,
    setAccess,
    selectedObject,
    setSelectedObject,
    showModal,
    setShowModal,
  } = usePageContext();

  useMount(async () => {
    handleResetContext();
    await checkAccess(setAccess, pageName);

    await loadWorkShifts(currentYear);
  });

  const { handleCloseModal, handleResetContext } = GetSimplaDataPageMethods({
    service,
    recordID,
  });

  const loadWorkShifts = async (year) => {
    setProgress(true);

    try {
      const data = await service.searchData(year);

      const { Holidays, WorkShifts } = data;

      setHolidays(Holidays);
      setWorkShifts(WorkShifts);
    } catch (err) {
      handleError(err);
    }

    setProgress(false);
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);

    loadWorkShifts(value);
  };

  const handleClickDate = (date) => {
    const workShift = workShifts.find(
      (ws) => ws.ShiftDate === utils.dateToText(date)
    );

    if (workShift) {
      const data = { date };
      data.workShift = workShift;

      setSelectedObject(data);
      setShowModal(true);
    }
  };

  //------

  return (
    <>
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
              {Words.my_work_shifts}
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
                selectedDays={workShifts}
                selectedDayField="ShiftDate"
                onClick={handleClickDate}
              />
            </Col>
          ))}
        </Row>
      </Spin>

      {showModal && (
        <DetailsModal
          onOk={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
        />
      )}
    </>
  );
};

export default UserMyWorkShiftsPage;
