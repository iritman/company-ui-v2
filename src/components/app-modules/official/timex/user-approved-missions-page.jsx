import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col } from "antd";
import Words from "../../../../resources/words";
import service from "../../../../services/official/timex/user-approved-missions-service";
import {
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
  handleError,
} from "../../../../tools/form-manager";
import SimpleDataTable from "../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../common/simple-data-page-header";
import { usePageContext } from "../../../contexts/page-context";
import SearchModal from "./user-approved-missions-search-modal";
import DetailsModal from "./user-approved-mission-details-modal";
import { getSheets, baseColumns } from "../../../common/missions-page-items";
import DetailsButton from "../../../common/details-button";

const handleCheckEditable = (row) => false;
const handleCheckDeletable = (row) => false;

const recordID = "MissionID";

const UserApprovedMissions = ({ pageName }) => {
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

    try {
      const data = await service.getCurrentDate();

      const default_filter = {
        MissionTypeID: 0,
        TargetID: 0,
        MemberID: 0,
        FromDate: data.CurrentDate,
        ToDate: data.CurrentDate,
      };

      setFilter(default_filter);

      await handleAdvancedSearch(default_filter);
    } catch (ex) {
      handleError(ex);
    }
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
            title={Words.approved_missions}
            sheets={getSheets(records, "ApprovedMissions")}
            fileName="ApprovedMissions"
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
          mission={selectedObject}
        />
      )}
    </>
  );
};

export default UserApprovedMissions;
