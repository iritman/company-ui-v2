import React, { useState } from "react";
import { useMount } from "react-use";
import {
  Spin,
  Row,
  Col,
  Typography,
  message,
  InputNumber,
  Space,
  Button,
  Tooltip,
  Select,
} from "antd";
import {
  SearchOutlined as SearchIcon,
  SettingOutlined as SettingIcon,
  DeleteOutlined as DeleteIcon,
} from "@ant-design/icons";
import Words from "../../../../resources/words";
import utils from "../../../../tools/utils";
import service from "../../../../services/settings/timex/work-shifts-service";
import {
  checkAccess,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import WorkShiftModal from "./work-shift-modal";
import RepeatModal from "./work-shift-repeat-modal";
import DeleteModal from "./work-shift-delete-modal";
import { usePageContext } from "../../../contexts/page-context";
import PersianCalendar from "../../../common/persian-calendar";
import { handleError } from "./../../../../tools/form-manager";

const { Text } = Typography;
const { Option } = Select;

const recordID = "ShiftID";

const currentYear = parseInt(
  utils.currentPersianDateWithoutSlash().substring(0, 4)
);

const WorkShiftsPage = ({ pageName }) => {
  const [workShifts, setWorkShifts] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [workGroups, setWorkGroups] = useState([]);
  const [workHours, setWorkHours] = useState([]);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedWorkGroupID, setSelectedWorkGroupID] = useState(0);
  const [filter, setFilter] = useState({
    ShiftYear: currentYear,
    WorkGroupID: 0,
  });
  const [showRepeatModal, setShowRepeatModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    progress,
    setProgress,
    access,
    setAccess,
    selectedObject,
    setSelectedObject,
    showModal,
    setShowModal,
  } = usePageContext();

  const { handleCloseModal, handleResetContext } = GetSimplaDataPageMethods({
    service,
    recordID,
  });

  useMount(async () => {
    handleResetContext();
    await checkAccess(setAccess, pageName);

    setProgress(true);
    try {
      const data = await service.getParams();

      const { WorkGroups, WorkHours } = data;

      setWorkGroups(WorkGroups);
      setWorkHours(WorkHours);
    } catch (ex) {
      handleError(ex);
    }
    setProgress(false);
  });

  //------

  const handleYearChange = (value) => {
    setSelectedYear(value);
  };

  const handleWorkGroupChange = (value) => {
    setSelectedWorkGroupID(value);
  };

  const handleClickDate = (date) => {
    const workShift = workShifts.find(
      (ws) => ws.ShiftDate === utils.dateToText(date)
    );

    const data = { date };

    if (workShift) data.workShift = workShift;

    setSelectedObject(data);
    setShowModal(true);
  };

  //------

  const handleSearchWorkShifts = async () => {
    const search_params = {
      ShiftYear: selectedYear,
      WorkGroupID: selectedWorkGroupID,
    };

    if (selectedWorkGroupID > 0) {
      setFilter(search_params);

      setProgress(true);
      try {
        const data = await service.searchData(search_params);

        const { WorkShifts, Holidays } = data;

        setWorkShifts(WorkShifts);
        setHolidays(Holidays);
      } catch (ex) {
        handleError(ex);
      }
      setProgress(false);
    }
  };

  const handleSaveWorkShift = async (hourID) => {
    const { date, workShift } = selectedObject;

    const save_object = {
      ShiftID: 0,
      WorkGroupID: filter.WorkGroupID,
      HourID: hourID,
      ShiftDate: utils.dateToText(date),
    };

    if (workShift) save_object.ShiftID = workShift.ShiftID;

    const data = await service.saveData(save_object);

    if (!workShift) {
      setWorkShifts([...workShifts, data]);
    } else {
      const copy_workShifts = [...workShifts];
      const index = copy_workShifts.findIndex(
        (ws) => ws.ShiftID === workShift.ShiftID
      );

      if (index !== -1) {
        copy_workShifts[index] = data;
      }

      setWorkShifts(copy_workShifts);
    }

    setSelectedObject({ date: selectedObject.date, workShift: data });
  };

  const handleDeleteWorkShift = async () => {
    const { workShift } = selectedObject;

    await service.deleteData(workShift.ShiftID);

    setWorkShifts(workShifts.filter((ws) => ws.ShiftID !== workShift.ShiftID));
    handleCloseModal();
    setSelectedObject(null);

    message.success(Words.messages.work_shift_deleted);
  };

  //------

  const handleRepeatWorkShifts = async (repeat_data) => {
    const config = { ...repeat_data, ...filter };

    const workShifts = await service.repeatWorkShift(config);

    setWorkShifts(workShifts);

    message.success(Words.messages.work_shift_repeated);
  };

  const handleDeleteWorkShifts = async (delete_data) => {
    const config = { ...delete_data, ...filter };

    const workShifts = await service.deleteWorkShifts(config);

    setWorkShifts(workShifts);

    message.success(Words.messages.work_shifts_deleted);
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
              {Words.work_shifts}
            </Text>
          </Col>

          <Col xs={24}>
            <Row gutter={[10, 5]}>
              <Col xs={24} md={12}>
                <Space>
                  <Text>{Words.year}</Text>
                  <InputNumber
                    min={1400}
                    max={1499}
                    defaultValue={currentYear}
                    onChange={handleYearChange}
                  />

                  <Select
                    allowClear
                    showSearch
                    style={{ width: "100%" }}
                    placeholder={Words.work_group}
                    optionFilterProp="children"
                    onChange={(selectedValue) =>
                      handleWorkGroupChange(selectedValue)
                    }
                    filterOption={(input, option) =>
                      option?.children
                        ?.toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option key={`group_id_0`} value={0}>
                      {Words.select_please}
                    </Option>
                    {workGroups.map((group) => (
                      <Option
                        key={`group_id_${group.GroupID}`}
                        value={group.GroupID}
                      >
                        {group.Title}
                      </Option>
                    ))}
                  </Select>

                  <Tooltip title={Words.search}>
                    <Button
                      disabled={selectedWorkGroupID === 0}
                      type="primary"
                      icon={<SearchIcon />}
                      onClick={handleSearchWorkShifts}
                    />
                  </Tooltip>
                </Space>
              </Col>
              <Col xs={24} md={12} className="rowFlex flexEnd">
                <Space>
                  <Tooltip title={Words.repeat_work_shifts}>
                    <Button
                      disabled={filter.WorkGroupID === 0}
                      type="primary"
                      icon={<SettingIcon />}
                      onClick={() => setShowRepeatModal(true)}
                    />
                  </Tooltip>

                  <Tooltip title={Words.delete_work_shifts}>
                    <Button
                      disabled={filter.WorkGroupID === 0}
                      type="primary"
                      danger
                      icon={<DeleteIcon />}
                      onClick={() => setShowDeleteModal(true)}
                    />
                  </Tooltip>
                </Space>
              </Col>
            </Row>
          </Col>

          <Col xs={24}>
            <hr />
          </Col>

          {filter.WorkGroupID > 0 &&
            utils.getMonthList().map((month) => (
              <Col xs={24} md={8} key={month.monthID}>
                <PersianCalendar
                  year={filter.ShiftYear}
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

          <Col xs={24}></Col>
        </Row>
      </Spin>

      {showModal && (
        <WorkShiftModal
          access={access}
          isOpen={showModal}
          selectedObject={selectedObject}
          filter={filter}
          workHours={workHours}
          onOk={handleCloseModal}
          onDelete={handleDeleteWorkShift}
          onSave={handleSaveWorkShift}
        />
      )}

      {showRepeatModal && (
        <RepeatModal
          access={access}
          isOpen={showRepeatModal}
          onCancel={() => setShowRepeatModal(false)}
          onSave={handleRepeatWorkShifts}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          access={access}
          isOpen={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onSave={handleDeleteWorkShifts}
        />
      )}
    </>
  );
};

export default WorkShiftsPage;
