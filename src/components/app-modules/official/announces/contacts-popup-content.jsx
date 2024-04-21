import { useState } from "react";
import { Row, Col, Tag, Input, TreeSelect, Checkbox, Button } from "antd";
import Words from "../../../../resources/words";
import Colors from "../../../../resources/colors";
import FolderNode from "../../../common/folder-node";

const { TreeNode } = TreeSelect;

const ContactsPopupContent = ({
  departments,
  contacts,
  selectedContacts,
  onClick,
  onSelectList,
}) => {
  const [searchText, setSearchText] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(0);
  const [calculateSubDepartments, setCalculateSubDepartments] = useState(false);

  const handleTextChange = (text) => {
    setSearchText(text);
  };

  const getSubDepartments = (depID) => {
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
                  departments.find(
                    (d) => d.DepartmentID === sub_dep.DepartmentID
                  )?.Title
                }
                color={Colors.blue[6]}
              />
            }
          >
            {getSubDepartments(sub_dep.DepartmentID)}
          </TreeNode>
        ))}
      </>
    );
  };

  const handleSelectedDepartmentChange = (newValue) => {
    setSelectedDepartment(newValue);

    if (newValue === 0) {
      setCalculateSubDepartments(false);
    }
  };

  const handleCalculateSubDepartmentsChange = (e) => {
    setCalculateSubDepartments(e.target.checked);
  };

  const getRootDepartment = () => departments.find((d) => d.ParentID === 0);

  const getNotSelectedContacts = () => {
    let employees = [];

    employees = contacts
      .filter(
        (contact) =>
          selectedContacts.filter((s) => s.MemberID === contact.MemberID)
            .length === 0
      )
      .filter((contact) => contact.FullName.includes(searchText));

    if (selectedDepartment > 0) {
      if (!calculateSubDepartments)
        employees = employees.filter(
          (contact) => contact.DepartmentID === selectedDepartment
        );
      else {
        let selected_deps = [{ DepartmentID: selectedDepartment }];

        selected_deps = [
          ...selected_deps,
          ...getChildDepartments(selectedDepartment),
        ];

        employees = employees.filter(
          (contact) =>
            selected_deps.findIndex(
              (d) => d.DepartmentID === contact.DepartmentID
            ) > -1
        );
      }
    }

    return employees;
  };

  const getChildDepartments = (depID) => {
    let deps = departments.filter((d) => d.ParentID === depID);

    deps.forEach(
      (d) => (deps = [...deps, ...getChildDepartments(d.DepartmentID)])
    );

    return deps;
  };

  const handleSelectContactList = () => {
    onSelectList(getNotSelectedContacts());
  };

  return (
    <div style={{ width: 300 }}>
      <section>
        <article
          id="contacts-list-content"
          className="scrollbar-normal"
          style={{ minHeight: "300px", maxHeight: "300px" }}
        >
          <Row gutter={[10, 5]}>
            <Col xs={24}>
              <Input
                allowClear
                autoFocus
                onChange={(e) => handleTextChange(e.target.value)}
              />
            </Col>
            <Col xs={24}>
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
                onChange={handleSelectedDepartmentChange}
                treeLine={{
                  showLeafIcon: false,
                }}
              >
                <TreeNode
                  key={0}
                  value={0}
                  title={
                    <FolderNode
                      title={Words.all_employees}
                      color={Colors.green[6]}
                    />
                  }
                />
                <TreeNode
                  key={getRootDepartment().DepartmentID}
                  value={getRootDepartment().DepartmentID}
                  title={
                    <FolderNode
                      title={getRootDepartment().Title}
                      color={Colors.blue[6]}
                    />
                  }
                >
                  {getSubDepartments(getRootDepartment().DepartmentID)}
                </TreeNode>
              </TreeSelect>
            </Col>
            <Col xs={24}>
              <Checkbox
                checked={calculateSubDepartments}
                disabled={selectedDepartment === 0}
                onChange={handleCalculateSubDepartmentsChange}
              >
                {Words.calculate_sub_departments}
              </Checkbox>
            </Col>

            <Col xs={24}>
              {getNotSelectedContacts().map((contact) => (
                <Tag
                  key={contact.MemberID}
                  color="blue"
                  onClick={() => onClick(contact)}
                  style={{ cursor: "pointer", margin: 5 }}
                >
                  {contact.FullName}
                </Tag>
              ))}
            </Col>
          </Row>
        </article>
        <footer>
          <Col xs={24}>
            <Button
              style={{
                backgroundColor: Colors.green[6],
                color: Colors.white,
                width: "100%",
              }}
              onClick={handleSelectContactList}
            >
              {Words.select_list}
            </Button>
          </Col>
        </footer>
      </section>
    </div>
  );
};

export default ContactsPopupContent;
