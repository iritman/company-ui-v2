import React, { useState } from "react";
import { useMount } from "react-use";
import {
  Spin,
  Row,
  Col,
  Button,
  Typography,
  Badge,
  message,
  Space,
  Tooltip,
  Alert,
} from "antd";
import {
  SearchOutlined as SearchIcon,
  ReloadOutlined as ReloadIcon,
} from "@ant-design/icons";
import Words from "../../../../resources/words";
import service from "../../../../services/official/tasks/my-tasks-service";
import {
  checkAccess,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SearchModal from "./user-under-supervisions-tasks-search-modal";
import DetailsModal from "./user-under-supervision-task-details-modal";
import { usePageContext } from "../../../contexts/page-context";
import Colors from "../../../../resources/colors";
import { handleError } from "../../../../tools/form-manager";
import TaskRowItem from "./task-row-item";

const { Text } = Typography;

const recordID = "TaskID";

const UserUnderSupervisionsTasksPage = ({ pageName }) => {
  const [inModalProgress, setInModalProgress] = useState(false);

  const {
    progress,
    setProgress,
    searched,
    setSearched,
    records,
    setRecords,
    setAccess,
    selectedObject,
    setSelectedObject,
    showModal,
    setShowModal,
    showSearchModal,
    setShowSearchModal,
    filter,
    setFilter,
  } = usePageContext();

  const { handleCloseModal, handleResetContext } = GetSimplaDataPageMethods({
    service,
    recordID,
  });

  useMount(async () => {
    handleResetContext();
    await checkAccess(setAccess, pageName);

    const init_filter = {
      MemberID: 0,
      DepartmentID: 0,
      HasNewReport: false,
      UnfinishedTasks: true,
      FromDoneDate: "",
      ToDoneDate: "",
      FromReminderDate: "",
      ToReminderDate: "",
      SearchText: "",
    };

    setFilter(init_filter);

    setProgress(true);

    try {
      await handleSearch(init_filter);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  });

  //------

  const task_categories = [
    { categoryID: 1, title: Words.today_tasks, key: "today" },
    { categoryID: 2, title: Words.tomorrow_tasks, key: "tomorrow" },
    { categoryID: 3, title: Words.this_month_tasks, key: "this_month" },
    { categoryID: 5, title: Words.other_than_this_month, key: "other" },
  ];

  task_categories.forEach((category) => {
    category.tasks = records.filter(
      (task) => task.TaskCategory === category.key
    );
  });

  const filtered_task_categories = task_categories.filter(
    (category) => category.tasks.length > 0
  );

  const getRibonColor = (key) => {
    let result = "blue";

    switch (key) {
      case "today":
        result = "green";
        break;
      case "tomorrow":
        result = "cyan";
        break;
      case "this_month":
        result = "purple";
        break;
      case "other":
        result = "blue";
        break;
      default:
        result = "blue";
        break;
    }

    return result;
  };

  const handleSelectTask = async (task) => {
    try {
      setSelectedObject(task);
      setShowModal(true);
    } catch (ex) {
      handleError(ex);
    }
  };

  const handleSearch = async (filter) => {
    setFilter(filter);
    setShowSearchModal(false);

    setProgress(true);

    try {
      const data = await service.searchUnderSupervisionTasks(filter);

      setRecords(data);
      setSearched(true);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleClear = () => {
    setRecords([]);
    setFilter(null);
    setSearched(false);
  };

  const handleSaveReport = async (report) => {
    setInModalProgress(true);

    try {
      const result = await service.saveReport(report);

      const index = records.findIndex((task) => task.TaskID === report.TaskID);
      records[index].Reports = result;

      setSelectedObject({ ...records[index] });
      setRecords([...records]);
    } catch (ex) {
      handleError(ex);
    }

    setInModalProgress(false);
  };

  const handleDeleteReport = async (report) => {
    setInModalProgress(true);

    try {
      const result = await service.deleteReport(report.ReportID);

      const index = records.findIndex((task) => task.TaskID === report.TaskID);
      records[index].Reports = records[index].Reports.filter(
        (r) => r.ReportID !== report.ReportID
      );

      setSelectedObject({ ...records[index] });
      setRecords([...records]);

      message.success(result.Message);
    } catch (ex) {
      handleError(ex);
    }

    setInModalProgress(false);
  };

  const handleSeenReports = async () => {
    try {
      await service.makeReportsSeen(selectedObject.TaskID);

      const index = records.findIndex(
        (task) => task.TaskID === selectedObject.TaskID
      );
      records[index].NewReportsCount = 0;

      setSelectedObject({ ...records[index] });
      setRecords([...records]);
    } catch (ex) {
      handleError(ex);
    }
  };

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
              {Words.task_supervisions}
            </Text>
          </Col>

          <Col xs={24}>
            <Space>
              <Button
                type="primary"
                icon={<SearchIcon />}
                onClick={() => setShowSearchModal(true)}
              >
                {Words.search}
              </Button>

              <Tooltip title={Words.clear}>
                <Button
                  type="primary"
                  icon={<ReloadIcon />}
                  onClick={handleClear}
                />
              </Tooltip>
            </Space>
          </Col>

          {records.length > 0 ? (
            <>
              {filtered_task_categories.map((category) => (
                <React.Fragment key={category.key}>
                  <Col xs={24}>
                    <Badge.Ribbon
                      placement="start"
                      color={getRibonColor(category.key)}
                      text={
                        <Text style={{ color: Colors.white, fontSize: 14 }}>
                          {category.title}
                        </Text>
                      }
                    >
                      <div style={{ height: 30 }} />
                    </Badge.Ribbon>
                  </Col>
                  <Col xs={24}>
                    {category.tasks.map((task) => (
                      <TaskRowItem
                        key={task.TaskID}
                        task={task}
                        onClick={async () => await handleSelectTask(task)}
                      />
                    ))}
                  </Col>
                </React.Fragment>
              ))}
            </>
          ) : (
            <>
              {searched && (
                <Col xs={24}>
                  <Alert
                    type="warning"
                    showIcon
                    message={Words.messages.not_any_tasks_founded}
                  />
                </Col>
              )}
            </>
          )}
        </Row>
      </Spin>

      {showModal && (
        <DetailsModal
          onCancel={handleCloseModal}
          onSubmitReport={handleSaveReport}
          onDeleteReport={handleDeleteReport}
          onSeenReports={handleSeenReports}
          isOpen={showModal}
          selectedObject={selectedObject}
          inProgress={inModalProgress}
        />
      )}

      {showSearchModal && (
        <SearchModal
          onOk={handleSearch}
          onCancel={() => setShowSearchModal(false)}
          isOpen={showSearchModal}
          filter={filter}
        />
      )}
    </>
  );
};

export default UserUnderSupervisionsTasksPage;
