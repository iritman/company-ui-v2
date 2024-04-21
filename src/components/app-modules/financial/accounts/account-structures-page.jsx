import React, { useState } from "react";
import { useMount } from "react-use";
import {
  Spin,
  Row,
  Col,
  Typography,
  Tree,
  Button,
  Space,
  Popconfirm,
} from "antd";
import {
  PlusOutlined as PlusIcon,
  QuestionCircleOutlined as QuestionIcon,
  EditOutlined as EditIcon,
  DeleteOutlined as DeleteIcon,
} from "@ant-design/icons";
import Words from "../../../../resources/words";
import utils from "../../../../tools/utils";
import groupService from "../../../../services/financial/accounts/structure-groups-service";
import totalService from "../../../../services/financial/accounts/structure-totals-service";
import moeinService from "../../../../services/financial/accounts/structure-moeins-service";
import { checkAccess, handleError } from "../../../../tools/form-manager";
import {
  usePageContext,
  useResetContext,
} from "../../../contexts/page-context";
import GroupModal from "./structure-group-modal";
import TotalModal from "./structure-total-modal";
import MoeinModal from "./structure-moein-modal";
import StructureGroupDetails from "./structure-group-details";
import StructureTotalDetails from "./structure-total-details";
import StructureMoeinDetails from "./structure-moein-details";

const { Text } = Typography;

const AccountStructuesPage = ({ pageName }) => {
  const {
    progress,
    setProgress,
    access,
    setAccess,
    selectedObject,
    setSelectedObject,
  } = usePageContext();

  const resetContext = useResetContext();

  const [groups, setGroups] = useState([]);
  const [groupsTree, setGroupsTree] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showTotalModal, setShowTotalModal] = useState(false);
  const [showMoeinModal, setShowMoeinModal] = useState(false);

  useMount(async () => {
    resetContext();
    await checkAccess(setAccess, pageName);

    //------

    await getAllAccountStructures();
  });

  const refreshContent = async () => {
    const group_data = await groupService.getAllData();
    setGroups(group_data);
    setGroupsTree(arrangeStructure(group_data));
  };

  const getAllAccountStructures = async () => {
    setProgress(true);

    try {
      await refreshContent();
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  //------

  const arrangeMoeins = (moeins) => {
    let moeinsList = [];

    moeins.forEach((moein) => {
      moeinsList = [
        ...moeinsList,
        {
          title: utils.farsiNum(`${moein.GeneralMoeinCode} - ${moein.Title}`),
          key: `m${moein.MoeinID}`,
        },
      ];
    });

    return moeinsList;
  };

  const arrangeTotals = (totals) => {
    let totalsList = [];

    totals.forEach((total) => {
      totalsList = [
        ...totalsList,
        {
          title: utils.farsiNum(
            `${total.GroupCode}${total.TotalCode} - ${total.Title}`
          ),
          key: `t${total.TotalID}`,
          children: arrangeMoeins(total.Moeins),
        },
      ];
    });

    return totalsList;
  };

  const arrangeStructure = (groups) => {
    let groupsList = [];

    groups.forEach((group) => {
      groupsList = [
        ...groupsList,
        {
          title: utils.farsiNum(`${group.GroupCode} - ${group.Title}`),
          key: `g${group.GroupID}`,
          children: arrangeTotals(group.Totals),
        },
      ];
    });

    return groupsList;
  };

  //------

  const onSelect = (selectedKeys, info) => {
    const { selectedNodes } = info;

    let node = null;

    if (selectedNodes.length === 0) setSelectedNode(node);
    else {
      node = selectedNodes[0];

      const id = parseInt(node.key.substring(1));
      node.id = id;

      switch (node.key[0]) {
        case "g":
          node.type = "group";
          node = { ...node, ...groups.find((g) => g.GroupID === id) };
          break;
        case "t":
          node.type = "total";
          node = {
            ...node,
            ...groups
              .find((g) => g.Totals.find((t) => t.TotalID === id))
              .Totals.find((t) => t.TotalID === id),
          };
          break;
        case "m":
          node.type = "moein";
          node = {
            ...node,
            ...groups
              .find((g) =>
                g.Totals.find((t) => t.Moeins.find((m) => m.MoeinID === id))
              )
              .Totals.find((t) => t.Moeins.find((m) => m.MoeinID === id))
              .Moeins.find((m) => m.MoeinID === id),
          };
          break;
        default:
          break;
      }

      setSelectedNode(node);
    }
  };

  const renderDetails = () => {
    let result = <></>;

    switch (selectedNode.type) {
      case "group":
        result = <StructureGroupDetails group={selectedNode} />;
        break;
      case "total":
        result = <StructureTotalDetails total={selectedNode} />;
        break;
      case "moein":
        result = <StructureMoeinDetails moein={selectedNode} />;
        break;
      default:
        result = <></>;
        break;
    }

    return result;
  };

  const getNewButtonTitle = () => {
    let result = Words.new_group;

    if (selectedNode) {
      const { key } = selectedNode;

      switch (key[0]) {
        case "g":
          result = Words.new_total;
          break;
        case "t":
          result = Words.new_moein;
          break;
        case "m":
          result = Words.new;
          break;
        default:
          result = Words.new_group;
          break;
      }
    }

    return result;
  };

  const handleNewButtonClick = async () => {
    if (selectedNode) {
      switch (selectedNode.type) {
        case "group":
          setShowTotalModal(true);
          break;
        case "total":
          setShowMoeinModal(true);
          break;
        default:
          break;
      }
    } else {
      setShowGroupModal(true);
    }
  };

  const handleSaveGroup = async (group) => {
    const saved_data = await groupService.saveData(group);

    if (selectedNode) {
      const { id, key, type } = selectedNode;
      setSelectedNode({ ...saved_data, id, key, type });
      setSelectedObject({ ...saved_data, id, key, type });
    }

    await refreshContent();
  };

  const handleSaveTotal = async (total) => {
    const saved_data = await totalService.saveData(total);

    if (selectedNode) {
      const { id, key, type } = selectedNode;
      setSelectedNode({ ...saved_data, id, key, type });
      setSelectedObject({ ...saved_data, id, key, type });
    }

    await refreshContent();
  };

  const handleSaveMoein = async (moein) => {
    const saved_data = await moeinService.saveData(moein);

    if (selectedNode) {
      const { id, key, type } = selectedNode;
      setSelectedNode({ ...saved_data, id, key, type });
      setSelectedObject({ ...saved_data, id, key, type });
    }

    await refreshContent();
  };

  const handleEdit = () => {
    setSelectedObject(selectedNode);

    switch (selectedNode.type) {
      case "group":
        setShowGroupModal(true);
        break;
      case "total":
        setShowTotalModal(true);
        break;
      case "moein":
        setShowMoeinModal(true);
        break;
      default:
        break;
    }
  };

  const handleDelete = async () => {
    if (selectedNode) {
      setProgress(true);

      try {
        switch (selectedNode.type) {
          case "group":
            await groupService.deleteData(selectedNode.GroupID);
            break;
          case "total":
            await totalService.deleteData(selectedNode.TotalID);
            break;
          case "moein":
            await moeinService.deleteData(selectedNode.MoeinID);
            break;
          default:
            break;
        }

        //------

        await refreshContent();

        //------

        setSelectedNode(null);
        setSelectedObject(null);
      } catch (ex) {
        handleError(ex);
      }

      setProgress(false);
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
              {Words.account_structures}
            </Text>
          </Col>
          <Col xs={24}>
            <Button
              type="primary"
              icon={<PlusIcon />}
              disabled={selectedNode?.type === "moein"}
              onClick={handleNewButtonClick}
            >
              {!selectedNode ? Words.new_group : getNewButtonTitle()}
            </Button>
          </Col>
          <Col xs={24} md={8}>
            <Tree
              showLine={{ showLeafIcon: false }}
              showIcon={false}
              onSelect={onSelect}
              treeData={groupsTree}
              height={350}
              defaultExpandAll
            />
          </Col>
          <Col xs={24} md={16}>
            {selectedNode && (
              <Row gutter={[5, 10]}>
                <Col xs={24}>{renderDetails()}</Col>
                {selectedNode && (access?.CanEdit || access?.CanDelete) && (
                  <Col xs={24} md={12}>
                    <Space>
                      {access.CanEdit && (
                        <Button
                          type="primary"
                          icon={<EditIcon />}
                          onClick={handleEdit}
                        >
                          {Words.edit}
                        </Button>
                      )}

                      {access.CanDelete &&
                        ((selectedNode.type === "group" &&
                          selectedNode.Totals.length === 0) ||
                          (selectedNode.type === "total" &&
                            selectedNode.Moeins.length === 0) ||
                          selectedNode.type === "moein") && (
                          <Popconfirm
                            title={Words.questions.sure_to_delete_selected_item}
                            onConfirm={handleDelete}
                            okText={Words.yes}
                            cancelText={Words.no}
                            icon={<QuestionIcon style={{ color: "red" }} />}
                          >
                            <Button type="primary" danger icon={<DeleteIcon />}>
                              {Words.delete}
                            </Button>
                          </Popconfirm>
                        )}
                    </Space>
                  </Col>
                )}
              </Row>
            )}
          </Col>
        </Row>
      </Spin>

      {showGroupModal && (
        <GroupModal
          selectedObject={selectedObject}
          isOpen={showGroupModal}
          onOk={handleSaveGroup}
          onCancel={() => {
            setShowGroupModal(false);
            setSelectedObject(null);
          }}
        />
      )}

      {showTotalModal && (
        <TotalModal
          selectedObject={selectedObject}
          group={selectedNode}
          isOpen={showTotalModal}
          onOk={handleSaveTotal}
          onCancel={() => {
            setShowTotalModal(false);
            setSelectedObject(null);
          }}
        />
      )}

      {showMoeinModal && (
        <MoeinModal
          selectedObject={selectedObject}
          total={selectedNode}
          isOpen={showMoeinModal}
          onOk={handleSaveMoein}
          onCancel={() => {
            setShowMoeinModal(false);
            setSelectedObject(null);
          }}
        />
      )}
    </>
  );
};

export default AccountStructuesPage;
