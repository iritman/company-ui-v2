import React, { useState } from "react";
import { useMount } from "react-use";
import {
  Button,
  Modal,
  Row,
  Col,
  Typography,
  Alert,
  Space,
  Collapse,
  Tabs,
  Checkbox,
  message,
} from "antd";
import { SaveOutlined as SaveIcon } from "@ant-design/icons";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import utils from "../../../../tools/utils";
import MemberProfileImage from "../../../common/member-profile-image";
import service from "../../../../services/settings/accesses/page-accesses-service";
import {
  useModalContext,
  useResetContext,
} from "../../../contexts/modal-context";
import { handleError } from "../../../../tools/form-manager";

const { Text } = Typography;
const { Panel } = Collapse;
const { TabPane } = Tabs;

const CheckAccess = ({ onChange, page, accessType, operation }) => {
  let title = "";
  let checked = false;

  switch (accessType) {
    case "view": {
      title = Words.can_view;
      checked = page.Access?.CanView === true;
      break;
    }
    case "add": {
      title = Words.can_add;
      checked = page.Access?.CanAdd === true;
      break;
    }
    case "edit": {
      title = Words.can_edit;
      checked = page.Access?.CanEdit === true;
      break;
    }
    case "delete": {
      title = Words.can_delete;
      checked = page.Access?.CanDelete === true;
      break;
    }
    case "operation": {
      title = operation.OperationTitle;
      checked = page.Access[operation.OperationName];
      break;
    }
    default: {
      title = Words.can_view;
      checked = page.Access?.CanView === true;
      break;
    }
  }

  const font_style = { fontSize: 13 };
  if (operation) font_style.color = Colors.green[6];
  return (
    <Checkbox
      checked={checked}
      onChange={(e) => onChange(e, page.PageID, accessType, operation)}
    >
      <Text style={font_style}>{title}</Text>
    </Checkbox>
  );
};

const PageAccessModal = ({ employee, isOpen, onOk }) => {
  const [pages, setPages] = useState([]);
  const [savedAccesses, setSavedAccesses] = useState([]);
  const [updatedAccesses, setUpdatedAccesses] = useState([]);

  const { progress, setProgress } = useModalContext();

  const resetContext = useResetContext();

  useMount(async () => {
    resetContext();

    await loadAccesses();
  });

  const loadAccesses = async () => {
    const data = await service.getMemberPageAccesses(employee.MemberID);

    const activeCategories = data.Pages.filter((p) => p.Modules.length > 0);

    let accessPage = null;
    activeCategories.forEach((category) => {
      category.Modules.forEach((module) => {
        module.Pages.forEach((page) => {
          accessPage = data.Accesses.find((acc) => acc.PageID === page.PageID);

          if (accessPage) {
            const {
              AccessID,
              PageID,
              IsActive,
              CanView,
              CanAdd,
              CanEdit,
              CanDelete,
              Operations,
            } = accessPage;

            page.Access = {
              AccessID,
              PageID,
              IsActive,
              CanView,
              CanAdd,
              CanEdit,
              CanDelete,
              Operations: [...Operations],
            };

            Operations.forEach((o) => {
              page.Access[o.OperationName] = o.HasAccess;
            });
          } else {
            page.Access = {
              AccessID: 0,
              PageID: page.PageID,
              CanView: false,
              CanAdd: false,
              CanEdit: false,
              CanDelete: false,
              Operations: [],
            };
          }
        });
      });
    });

    //--- copy accesses
    //--- with spread operator sub levels like Operations field is not copied as a new object
    //--- and their reference persist!
    //--- to create a different copy with no any reference values, we should do copy process manually

    let saved_accesses = [];
    let updated_accesses = [];

    data.Accesses.forEach((access) => {
      const new_access = { ...access };

      access.Operations.forEach((o) => {
        new_access[o.OperationName] = o.HasAccess;
      });

      saved_accesses = [...saved_accesses, { ...new_access }];
      updated_accesses = [...updated_accesses, { ...new_access }];
    });

    setSavedAccesses(saved_accesses);
    setUpdatedAccesses(updated_accesses);

    //------

    setPages(activeCategories);
  };

  const onCheckChange = (e, pageID, accessType, operation) => {
    const newCheckValue = e.target.checked;

    const rec = [...pages];

    let updatedAccess = {
      ...updatedAccesses.find((acc) => acc.PageID === pageID),
    };

    if (Object.keys(updatedAccess).length === 0) {
      // new access
      updatedAccess = {
        AccessID: 0,
        PageID: pageID,
        CanView: false,
        CanAdd: false,
        CanEdit: false,
        CanDelete: false,
        Operations: [],
      };
    }

    rec.forEach((category) => {
      category.Modules.forEach((module) => {
        module.Pages.forEach((page) => {
          if (page.PageID === pageID) {
            switch (accessType) {
              case "view": {
                page.Access.CanView = newCheckValue;
                updatedAccess.CanView = newCheckValue;

                if (!newCheckValue) {
                  page.Access.CanAdd = false;
                  page.Access.CanEdit = false;
                  page.Access.CanDelete = false;

                  page.Access.Operations.forEach((opr) => {
                    opr.HasAccess = false;
                    if (page.Access[opr.OperationName] !== undefined)
                      page.Access[opr.OperationName] = false;
                  });

                  //------

                  updatedAccess.CanAdd = false;
                  updatedAccess.CanEdit = false;
                  updatedAccess.CanDelete = false;

                  updatedAccess.Operations.forEach((opr) => {
                    opr.HasAccess = false;
                    if (updatedAccess[opr.OperationName] !== undefined)
                      updatedAccess[opr.OperationName] = false;
                  });
                }

                break;
              }
              case "add": {
                page.Access.CanAdd = newCheckValue;
                updatedAccess.CanAdd = newCheckValue;

                if (newCheckValue) {
                  page.Access.CanView = newCheckValue;
                  updatedAccess.CanView = newCheckValue;
                }

                break;
              }
              case "edit": {
                page.Access.CanEdit = newCheckValue;
                updatedAccess.CanEdit = newCheckValue;

                if (newCheckValue) {
                  page.Access.CanView = newCheckValue;
                  updatedAccess.CanView = newCheckValue;
                }

                break;
              }
              case "delete": {
                page.Access.CanDelete = newCheckValue;
                updatedAccess.CanDelete = newCheckValue;

                if (newCheckValue) {
                  page.Access.CanView = newCheckValue;
                  updatedAccess.CanView = newCheckValue;
                }

                break;
              }
              case "operation": {
                page.Access[operation.OperationName] = newCheckValue;
                updatedAccess[operation.OperationName] = newCheckValue;

                updatedAccess.Operations.find(
                  (o) => o.OperationID === operation.OperationID
                ).HasAccess = newCheckValue;

                if (newCheckValue) {
                  page.Access.CanView = newCheckValue;
                  updatedAccess.CanView = newCheckValue;
                }

                break;
              }
              default: {
                break;
              }
            }
          }
        });
      });
    });

    const updatedIndex = updatedAccesses.findIndex(
      (acc) => acc.PageID === pageID
    );

    if (updatedIndex === -1 && updatedAccess.CanView) {
      setUpdatedAccesses([...updatedAccesses, updatedAccess]);
    } else {
      if (updatedAccess.AccessID === 0 && !updatedAccess.CanView) {
        setUpdatedAccesses([
          ...updatedAccesses.filter(
            (acc) => acc.PageID !== updatedAccess.PageID
          ),
        ]);
      } else {
        updatedAccesses[updatedIndex] = updatedAccess;

        setUpdatedAccesses([...updatedAccesses]);
      }
    }
    setPages(rec);
  };

  const hasChangedAccess = () => {
    let result = false;

    if (
      updatedAccesses.filter((acc) => acc.AccessID === 0 && acc.CanView)
        .length > 0
    ) {
      result = true;
    } else {
      let savedAccess = null;

      updatedAccesses.forEach((uacc) => {
        savedAccess = savedAccesses.find((acc) => acc.PageID === uacc.PageID);

        for (const accessField in uacc) {
          if (
            accessField !== "Operations" &&
            uacc[accessField] !== savedAccess[accessField]
          ) {
            result = true;
            break;
          }
        }
      });
    }

    return result;
  };

  const getChangedAccesses = () => {
    let result = [...updatedAccesses.filter((acc) => acc.AccessID === 0)];

    let savedAccess = null;

    updatedAccesses.forEach((uacc) => {
      savedAccess = savedAccesses.find((acc) => acc.PageID === uacc.PageID);

      if (savedAccess) {
        for (const accessField in uacc) {
          if (
            accessField !== "Operations" &&
            uacc[accessField] !== savedAccess[accessField]
          ) {
            result = [...result, uacc];
            break;
          }
        }
      }
    });

    return result;
  };

  const handleSaveChanges = async () => {
    if (hasChangedAccess()) {
      setProgress(true);
      try {
        const data = await service.saveChangedAccesses(
          employee.MemberID,
          getChangedAccesses()
        );

        await loadAccesses();

        message.success(data.Message);
      } catch (err) {
        handleError(err);
      }
      setProgress(false);
    }
  };

  const getTimexPageTitle = (page) => {
    let result = "";

    switch (page.PageName) {
      case "user-MyRegedCards": {
        result = `${page.PageTitle} - [ ${Words.my_cartable} ]`;
        break;
      }
      case "user-MyWorkShifts": {
        result = `${page.PageTitle} - [ ${Words.my_cartable} ]`;
        break;
      }
      case "user-MyVacations": {
        result = `${page.PageTitle} - [ ${Words.my_cartable} ]`;
        break;
      }
      case "user-MyMissions": {
        result = `${page.PageTitle} - [ ${Words.my_cartable} ]`;
        break;
      }
      case "user-VacationReplaceWorkRequests": {
        result = `${page.PageTitle} - [ ${Words.my_cartable} ]`;
        break;
      }
      case "user-MissionReplaceWorkRequests": {
        result = `${page.PageTitle} - [ ${Words.my_cartable} ]`;
        break;
      }
      case "user-MyWorkReport": {
        result = `${page.PageTitle} - [ ${Words.my_cartable} ]`;
        break;
      }
      case "user-MyCardsWorkReport": {
        result = `${page.PageTitle} - [ ${Words.my_cartable} ]`;
        break;
      }
      //---
      case "user-SecurityGuardRegedCards": {
        result = `${page.PageTitle} - [ ${Words.security_cartable} ]`;
        break;
      }
      case "user-ApprovedVacations": {
        result = `${page.PageTitle} - [ ${Words.security_cartable} ]`;
        break;
      }
      case "user-ApprovedMissions": {
        result = `${page.PageTitle} - [ ${Words.security_cartable} ]`;
        break;
      }
      //---
      case "user-MembersRegedCards": {
        result = `${page.PageTitle} - [ ${Words.department_cartable} ]`;
        break;
      }
      case "user-MembersWorkShifts": {
        result = `${page.PageTitle} - [ ${Words.department_cartable} ]`;
        break;
      }
      case "user-MembersNewVacationsCheckManager": {
        result = `${page.PageTitle} - [ ${Words.department_cartable} ]`;
        break;
      }
      case "user-MembersVacations": {
        result = `${page.PageTitle} - [ ${Words.department_cartable} ]`;
        break;
      }
      case "user-MembersNewMissionsCheckManager": {
        result = `${page.PageTitle} - [ ${Words.department_cartable} ]`;
        break;
      }
      case "user-MembersMissions": {
        result = `${page.PageTitle} - [ ${Words.department_cartable} ]`;
        break;
      }
      case "user-MembersNewMissionReports": {
        result = `${page.PageTitle} - [ ${Words.department_cartable} ]`;
        break;
      }
      case "user-MembersExtraWorkRequests": {
        result = `${page.PageTitle} - [ ${Words.department_cartable} ]`;
        break;
      }
      case "user-MembersWorkReport": {
        result = `${page.PageTitle} - [ ${Words.department_cartable} ]`;
        break;
      }
      //---

      case "user-OfficialCheckRegedCards": {
        result = `${page.PageTitle} - [ ${Words.official_cartable} ]`;
        break;
      }
      case "user-OfficialCheckExtraWorkRequests": {
        result = `${page.PageTitle} - [ ${Words.official_cartable} ]`;
        break;
      }
      case "user-OfficialCheckNoAlternativeEmployees": {
        result = `${page.PageTitle} - [ ${Words.official_cartable} ]`;
        break;
      }
      case "user-MembersNewVacationsCheckOfficial": {
        result = `${page.PageTitle} - [ ${Words.official_cartable} ]`;
        break;
      }
      case "user-OfficialCheckMembersVacations": {
        result = `${page.PageTitle} - [ ${Words.official_cartable} ]`;
        break;
      }
      case "user-OfficialCheckVacationCardexes": {
        result = `${page.PageTitle} - [ ${Words.official_cartable} ]`;
        break;
      }
      case "user-MembersNewMissionsCheckOfficial": {
        result = `${page.PageTitle} - [ ${Words.official_cartable} ]`;
        break;
      }
      case "user-OfficialCheckMembersMissions": {
        result = `${page.PageTitle} - [ ${Words.official_cartable} ]`;
        break;
      }
      //---
      case "user-MyCardsReport": {
        result = `${page.PageTitle} - [ ${Words.my_cards_report} ]`;
        break;
      }
      case "user-ReportMyInOutCards": {
        result = `${page.PageTitle} - [ ${Words.my_reports_cartable} ]`;
        break;
      }
      //---
      default:
        break;
    }

    return result;
  };

  return (
    <Modal
      open={isOpen}
      maskClosable={false}
      centered={true}
      title={Words.accesses}
      footer={[
        <Button
          key="save-button"
          type="primary"
          icon={<SaveIcon />}
          danger
          disabled={progress || !hasChangedAccess()}
          onClick={handleSaveChanges}
          loading={progress}
        >
          {Words.save_settings}
        </Button>,
        <Button key="submit-button" type="primary" onClick={onOk}>
          {Words.close}
        </Button>,
      ]}
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
                    <MemberProfileImage fileName={employee.PicFileName} />
                    <Text>
                      {utils.farsiNum(
                        `#${employee.EmployeeID} - ${employee.FirstName} ${employee.LastName}`
                      )}
                    </Text>
                  </Space>
                }
                type="info"
              />
            </Col>

            {pages.length > 0 && (
              <Col xs={24}>
                <Collapse accordion>
                  {pages.map((category) => (
                    <Panel
                      header={category.CategoryTitle}
                      key={category.CategoryID}
                    >
                      {category.Modules.length > 0 && (
                        <Tabs defaultActiveKey="1" onChange={null}>
                          {category.Modules.map((module) => (
                            <TabPane
                              tab={module.ModuleTitle}
                              key={module.ModuleID}
                            >
                              {module.Pages.map((page) => (
                                <Row key={page.PageID}>
                                  <Col xs={24}>
                                    <Text style={{ color: Colors.red[6] }}>
                                      {/* -- Timex -- */}
                                      {module.ModuleID === 6
                                        ? getTimexPageTitle(page)
                                        : page.PageTitle}
                                    </Text>
                                  </Col>
                                  <Col xs={24}>
                                    <Space
                                      direction="vertical"
                                      style={{
                                        width: "100%",
                                      }}
                                    >
                                      <Row>
                                        <Col xs={12} md={6}>
                                          <CheckAccess
                                            onChange={onCheckChange}
                                            page={page}
                                            accessType="view"
                                          />
                                        </Col>
                                        <Col xs={12} md={6}>
                                          <CheckAccess
                                            onChange={onCheckChange}
                                            page={page}
                                            accessType="add"
                                          />
                                        </Col>
                                        <Col xs={12} md={6}>
                                          <CheckAccess
                                            onChange={onCheckChange}
                                            page={page}
                                            accessType="edit"
                                          />
                                        </Col>
                                        <Col xs={12} md={6}>
                                          <CheckAccess
                                            onChange={onCheckChange}
                                            page={page}
                                            accessType="delete"
                                          />
                                        </Col>

                                        {page.Access.Operations.length > 0 && (
                                          <>
                                            {page.Access.Operations.map(
                                              (opr) => (
                                                <Col
                                                  xs={12}
                                                  md={6}
                                                  key={opr.OperationID}
                                                >
                                                  <CheckAccess
                                                    onChange={onCheckChange}
                                                    page={page}
                                                    accessType="operation"
                                                    operation={opr}
                                                  />
                                                </Col>
                                              )
                                            )}
                                          </>
                                        )}
                                      </Row>

                                      <div
                                        style={{
                                          width: "100%",
                                          height: "1px",
                                          borderBottom: "1px dashed grey",
                                          marginBottom: 10,
                                        }}
                                      />
                                    </Space>
                                  </Col>
                                </Row>
                              ))}
                            </TabPane>
                          ))}
                        </Tabs>
                      )}
                    </Panel>
                  ))}
                </Collapse>
              </Col>
            )}
          </Row>
        </article>
      </section>
    </Modal>
  );
};

export default PageAccessModal;
