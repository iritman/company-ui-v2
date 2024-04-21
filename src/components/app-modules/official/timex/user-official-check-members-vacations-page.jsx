import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col } from "antd";
import Words from "../../../../resources/words";
import service from "../../../../services/official/timex/user-official-check-members-vacations-service";
import {
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import { usePageContext } from "../../../contexts/page-context";
import SearchModal from "./user-official-check-members-vacations-search-modal";
import DetailsModal from "../../../common/vacation-details-modal";
import { getSheets, baseColumns } from "../../../common/vacations-page-items";
import DetailsButton from "../../../common/details-button";
import WorkTimeStatistics from "../../../common/work-time-statistics";

const handleCheckEditable = (row) => false;
const handleCheckDeletable = (row) => false;

const recordID = "VacationID";

const UserOfficialCheckMembersVacations = ({ pageName }) => {
  const {
    progress,
    searched,
    setSearched,
    records,
    setRecords,
    access,
    setAccess,
    selectedObject,
    setSelectedObject,
    showDetails,
    setShowDetails,
    showSearchModal,
    setShowSearchModal,
    filter,
    setFilter,
  } = usePageContext();

  useMount(async () => {
    handleResetContext();

    await checkAccess(setAccess, pageName);
  });

  const { handleResetContext, handleAdvancedSearch } = GetSimplaDataPageMethods(
    {
      service,
      recordID,
    }
  );

  const getOperationalButtons = (record) => {
    return (
      <DetailsButton
        record={record}
        setSelectedObject={setSelectedObject}
        setShowDetails={setShowDetails}
      />
    );
  };

  const columns = access
    ? getColumns(
        baseColumns,
        getOperationalButtons,
        access,
        null,
        null,
        handleCheckEditable,
        handleCheckDeletable
      )
    : [];

  const handleClear = () => {
    setRecords([]);
    setFilter(null);
    setSearched(false);
  };

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.members_vacations}
            sheets={getSheets(records, "MembersVacations")}
            fileName="MembersVacations"
            onSearch={() => setShowSearchModal(true)}
            onClear={handleClear}
            onGetAll={null}
            onAdd={null}
          />
          <Col xs={24}>
            {searched && (
              <SimpleDataTable records={records} columns={columns} />
            )}
          </Col>
          <WorkTimeStatistics type="vacation" data={records} />
        </Row>
      </Spin>

      {showSearchModal && (
        <SearchModal
          onOk={handleAdvancedSearch}
          onCancel={() => setShowSearchModal(false)}
          isOpen={showSearchModal}
          filter={filter}
        />
      )}

      {showDetails && (
        <DetailsModal
          onOk={() => {
            setShowDetails(false);
            setSelectedObject(null);
          }}
          isOpen={showDetails}
          vacation={selectedObject}
        />
      )}
    </>
  );
};

export default UserOfficialCheckMembersVacations;
