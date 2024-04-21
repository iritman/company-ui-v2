import React from "react";
import { TreeSelect } from "antd";
import FolderNode from "../../../common/folder-node";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";

const { TreeNode } = TreeSelect;

const getSubDepartments = (departments, depID) => {
  const subDepartments = departments.filter((d) => d.ParentID === depID);

  return (
    <>
      {subDepartments.map((sub_dep) => (
        <TreeNode
          key={sub_dep.DepartmentID}
          value={sub_dep.DepartmentID}
          title={
            <FolderNode
              title={
                departments.find((d) => d.DepartmentID === sub_dep.DepartmentID)
                  ?.Title
              }
              color={Colors.blue[6]}
            />
          }
        >
          {getSubDepartments(departments, sub_dep.DepartmentID)}
        </TreeNode>
      ))}
    </>
  );
};

const DepartmentsTree = ({
  departments,
  departmentID,
  selectedDepartment,
  onChange,
}) => {
  return (
    <TreeSelect
      showSearch
      style={{
        width: "100%",
      }}
      value={selectedDepartment}
      dropdownStyle={{
        maxHeight: 400,
        overflow: "auto",
      }}
      placeholder={Words.select_department}
      allowClear
      treeDefaultExpandAll
      onChange={onChange}
      treeLine={{
        showLeafIcon: false,
      }}
    >
      <TreeNode
        key={0}
        value={0}
        title={
          <FolderNode
            title={Words.my_personal_statistics}
            color={Colors.green[6]}
          />
        }
      />
      <TreeNode
        key={departmentID}
        value={departmentID}
        title={
          <FolderNode
            title={
              departments.find((d) => d.DepartmentID === departmentID)?.Title
            }
            color={Colors.blue[6]}
          />
        }
      >
        {getSubDepartments(departments, departmentID)}
      </TreeNode>
    </TreeSelect>
  );
};

export default DepartmentsTree;
