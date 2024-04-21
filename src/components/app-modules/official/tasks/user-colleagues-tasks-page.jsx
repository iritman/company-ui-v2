import React from "react";
import { useMount } from "react-use";
import {
  Spin,
  Row,
  Col,
  Button,
  Typography,
  Space,
  Badge,
  Alert,
  Tooltip,
} from "antd";
import {
  SearchOutlined as SearchIcon,
  ReloadOutlined as ReloadIcon,
} from "@ant-design/icons";
import Words from "../../../../resources/words";
import service from "../../../../services/official/tasks/colleagues-tasks-service";
import {
  checkAccess,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import ColleaguesTaskModal from "./user-colleagues-task-modal";
import SearchModal from "./user-colleagues-tasks-search-modal";
import { usePageContext } from "../../../contexts/page-context";
import Colors from "./../../../../resources/colors";
import { handleError } from "./../../../../tools/form-manager";
import TaskRowItem from "./task-row-item";

const { Text } = Typography;

const recordID = "TaskID";

const UserColleaguesTasksPage = ({ pageName }) => {
  const {
    progress,
    setProgress,
    searched,
    setSearched,
    records,
    setRecords,
    // access,
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
  });

  const handleSearch = async (filter) => {
    setFilter(filter);
    setShowSearchModal(false);

    setProgress(true);

    try {
      const data = await service.searchData(filter);

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
      case "has_delay":
        result = "red";
        break;
      case "future":
        result = "magenta";
        break;
      default:
        result = "blue";
        break;
    }

    return result;
  };

  const handleSelectTask = (task) => {
    setSelectedObject(task);

    setShowModal(true);
  };

  const task_categories = [
    { categoryID: 1, title: Words.today_tasks, key: "today" },
    { categoryID: 2, title: Words.tomorrow_tasks, key: "tomorrow" },
    { categoryID: 3, title: Words.this_month_tasks, key: "this_month" },
    { categoryID: 4, title: Words.has_delay_tasks, key: "has_delay" },
    { categoryID: 5, title: Words.future_tasks, key: "future" },
  ];

  task_categories.forEach((category) => {
    category.tasks = records.filter(
      (task) => task.TaskCategory === category.key
    );
  });

  const filtered_task_categories = task_categories.filter(
    (category) => category.tasks.length > 0
  );

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
              {Words.colleagues_tasks}
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
                        onClick={() => handleSelectTask(task)}
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
        <ColleaguesTaskModal
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
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

export default UserColleaguesTasksPage;
