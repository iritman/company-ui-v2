import { useState } from "react";
import { Row, Col, Tag, Input } from "antd";

const SupervisorsPopupContent = ({
  supervisors,
  selectedSupervisors,
  favoriteSupervisors,
  onClick,
}) => {
  const [searchText, setSearchText] = useState("");

  const handleTextChange = (text) => {
    setSearchText(text);
  };

  return (
    <div style={{ width: 300 }}>
      <section>
        <article
          id="supervisors-list-content"
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
              {favoriteSupervisors
                .filter(
                  (supervisor) =>
                    selectedSupervisors.filter(
                      (s) => s.MemberID === supervisor.SupervisorMemberID
                    ).length === 0
                )
                .filter(
                  (supervisors) =>
                    supervisors.FirstName.includes(searchText) ||
                    supervisors.LastName.includes(searchText)
                )
                .map((supervisor) => (
                  <Tag
                    key={supervisor.SupervisorMemberID}
                    color="error"
                    onClick={() =>
                      onClick({
                        MemberID: supervisor.SupervisorMemberID,
                        FullName: `${supervisor.FirstName} ${supervisor.LastName}`,
                      })
                    }
                    style={{ cursor: "pointer", margin: 5 }}
                  >
                    {`${supervisor.FirstName} ${supervisor.LastName}`}
                  </Tag>
                ))}
            </Col>
            <Col xs={24}>
              {supervisors
                .filter(
                  (supervisor) =>
                    selectedSupervisors.filter(
                      (s) => s.MemberID === supervisor.MemberID
                    ).length === 0
                )
                .filter(
                  (supervisor) =>
                    favoriteSupervisors.filter(
                      (s) => s.SupervisorMemberID === supervisor.MemberID
                    ).length === 0
                )
                .filter((supervisors) =>
                  supervisors.FullName.includes(searchText)
                )
                .map((supervisor) => (
                  <Tag
                    key={supervisor.MemberID}
                    color="blue"
                    onClick={() => onClick(supervisor)}
                    style={{ cursor: "pointer", margin: 5 }}
                  >
                    {supervisor.FullName}
                  </Tag>
                ))}
            </Col>
          </Row>
        </article>
      </section>
    </div>
  );
};

export default SupervisorsPopupContent;
