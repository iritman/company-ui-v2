import React, { useState } from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, Alert } from "antd";
import Words from "../../../../resources/words";
import utils from "./../../../../tools/utils";
import service from "./../../../../services/official/timex/user-members-work-shifts-service";
import {
  checkAccess,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import { usePageContext } from "./../../../contexts/page-context";
import DetailsModal from "./user-members-work-shift-details-modal";
import MemberWorkShiftSearchModal from "./user-members-work-shift-search-modal";
import { handleError } from "../../../../tools/form-manager";
import PersianCalendar from "../../../common/persian-calendar";

const { Text } = Typography;

const recordID = "ShiftID";

const EmployeeShiftsPage = ({ pageName }) => {
  const [holidays, setHolidays] = useState([]);
  const [workShifts, setWorkShifts] = useState([]);
  const [employee, setEmployee] = useState(null);

  const {
    progress,
    setProgress,
    setAccess,
    showSearchModal,
    setShowSearchModal,
    showModal,
    setShowModal,
    filter,
    setFilter,
    selectedObject,
    setSelectedObject,
  } = usePageContext();

  useMount(async () => {
    handleResetContext();
    await checkAccess(setAccess, pageName);
  });

  const { handleCloseModal, handleResetContext } = GetSimplaDataPageMethods({
    service,
    recordID,
  });

  const loadWorkShifts = async (filter) => {
    setFilter(filter);

    setProgress(true);
    try {
      setShowSearchModal(false);

      const data = await service.searchData(filter);

      const { Holidays, WorkShifts, FirstName, LastName, PicFileName } = data;

      setHolidays(Holidays);
      setWorkShifts(WorkShifts);
      setEmployee({ FirstName, LastName, PicFileName });
    } catch (err) {
      handleError(err);
    }
    setProgress(false);
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

  const handleClear = () => {
    setFilter(null);
    setEmployee(null);
  };

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.members_work_shifts}
            onSearch={() => setShowSearchModal(true)}
            onClear={handleClear}
          />

          {filter && employee && (
            <Col xs={24}>
              <Alert
                type="success"
                message={
                  <Text>
                    {utils.farsiNum(
                      `${employee.FirstName} ${employee.LastName} (${filter.YearNo})`
                    )}
                  </Text>
                }
                showIcon
              />
            </Col>
          )}

          {filter &&
            filter?.YearNo &&
            utils.getMonthList().map((month) => (
              <Col xs={24} md={8} key={month.monthID}>
                <PersianCalendar
                  year={filter.YearNo}
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

      {showSearchModal && (
        <MemberWorkShiftSearchModal
          onOk={loadWorkShifts}
          onCancel={() => setShowSearchModal(false)}
          isOpen={showSearchModal}
          filter={filter}
        />
      )}
    </>
  );
};

export default EmployeeShiftsPage;
