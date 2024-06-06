import React, { useState } from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, message } from "antd";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import SimpleDataTable from "./../../../../common/simple-data-table";
import {
  getColumn,
  getSheetColumn,
  getPageColumns,
  getSheets,
  checkAccess,
  handleError,
} from "../../../../antd-general-components/FormManager";
import service from "../../../../../services/financial/store-operations/product-requests-service";
import DetailsButton from "./../../../../common/details-button";
import { LabelType } from "../../../../antd-general-components/Label";
import DataPageHeader from "../../../../antd-general-components/DataPageHeader";
import SearchModal from "./ProductRequestsSearchModal";
import ProductRequestModal from "./ProductRequestModal";
import DetailsModal from "./ProductRequestDetailsModal";

const sheetColumns = [
  getSheetColumn(Words.id, "RequestID"),
  getSheetColumn(Words.front_side_account, "FrontSideAccountTitle"),
  getSheetColumn(
    Words.request_member,
    "",
    (record) =>
      `${record.RequestMemberFirstName} ${record.RequestMemberLastName}`
  ),
  getSheetColumn(Words.request_type, "RequestTypeTitle"),
  getSheetColumn(Words.need_date, "", (record) =>
    utils.slashDate(record.NeededDate)
  ),
  getSheetColumn(Words.request_date, "", (record) =>
    utils.slashDate(record.RequestDate)
  ),
  getSheetColumn(Words.standard_description, "DetailsText"),
  getSheetColumn(Words.from_store, "FromStoreTitle"),
  getSheetColumn(Words.to_store, "ToStoreTitle"),
  getSheetColumn(Words.status, "StatusTitle"),
  getSheetColumn(Words.reg_date, "RegDate"),
  getSheetColumn(Words.reg_time, "RegTime"),
  getSheetColumn(
    Words.reg_member,
    "",
    (record) => `${record.RegFirstName} ${record.RegLastName}`
  ),
];

const baseColumns = [
  getColumn(Words.id, 75, "RequestID", { labelProps: { farsi: true } }),
  getColumn(Words.request_date, 150, "RequestDate", {
    labelProps: { farsi: true, type: LabelType.date, color: Colors.blue[6] },
  }),
  getColumn(Words.need_date, 150, "NeededDate", {
    labelProps: { farsi: true, type: LabelType.date, color: Colors.blue[6] },
  }),
  getColumn(Words.front_side_type, 150, "FrontSideTypeTitle"),
  getColumn(Words.front_side, 200, "FrontSideAccountTitle", {
    labelProps: { farsi: true, color: Colors.cyan[6] },
  }),
  getColumn(Words.request_type, 150, "RequestTypeTitle"),
  getColumn(Words.status, 150, "StatusTitle"),
];

const ProductRequestsPage = ({ pageName }) => {
  const [records, setRecords] = useState([]);
  const [progress, setProgress] = useState(false);
  const [searched, setSearched] = useState(false);
  const [filter, setFilter] = useState(null);
  const [access, setAccess] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useMount(async () => {
    await checkAccess(setAccess, pageName);
  });

  const getOperationalButtons = (record) => {
    return (
      <DetailsButton
        record={record}
        setSelectedObject={setSelectedObject}
        setShowDetails={setShowDetails}
      />
    );
  };

  const handleChangeSelectedObject = (data) => {
    setSelectedObject(data);
  };

  const handleAdd = () => {
    setShowModal(true);
  };

  const updatePageRecord = (updated_data) => {
    const record_index = records.findIndex(
      (r) => r.RequestID === updated_data.RequestID
    );
    records[record_index] = updated_data;
    setRecords(records);
  };

  const handleSave = async (row) => {
    const savedRow = await service.saveData(row);

    if (selectedObject) {
      setSelectedObject({ ...savedRow });

      // Update page records
      updatePageRecord(row);
      // const saved_record_index = records.findIndex(
      //   (r) => r.RequestID === row.RequestID
      // );
      // records[saved_record_index] = savedRow;
      // setRecords(records);
    }

    return savedRow;
  };

  const handleEdit = async (row) => {
    setSelectedObject(row);
    setShowModal(true);
  };

  const handleDelete = async (row) => {
    setProgress(true);

    try {
      let result = await service.deleteData(row.RequestID);

      if (result.Message) {
        message.success(result.Message);
      } else {
        message.error(result.Error);
      }

      let filteredRecords = records.filter(
        (obj) => obj.RequestID !== row.RequestID
      );

      setRecords(filteredRecords);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedObject();
  };

  const columns = access
    ? getPageColumns(
        baseColumns,
        getOperationalButtons,
        access,
        handleEdit,
        handleDelete,
        (row) => row.IsChangable, // can edit func
        (row) => row.IsChangable // can delete func
      )
    : [];

  const handleClear = () => {
    setRecords([]);
    setFilter(null);
    setSearched(false);
  };

  const handleSearch = async (filter) => {
    setFilter(filter);
    setShowSearchModal(false);

    setProgress(true);

    try {
      const data = await service.searchData(filter);

      setRecords(data);
      setSearched(true);
    } catch (err) {
      handleError(err);
    }

    setProgress(false);
  };

  const handleSubmitStepAction = async (feedback) => {
    const data = await service.regFeedback({
      ...feedback,
      Request: selectedObject,
    });

    setSelectedObject(data);
    updatePageRecord(data);

    return data;
  };

  // --------------------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <DataPageHeader
            title={Words.product_requests}
            sheets={getSheets(pageName, records, sheetColumns)}
            onSearch={() => setShowSearchModal(true)}
            onClear={handleClear}
            onAdd={access?.CanAdd && handleAdd}
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
          open={showSearchModal}
          onOk={handleSearch}
          onCancel={() => setShowSearchModal(false)}
          filter={filter}
        />
      )}

      {showModal && (
        <ProductRequestModal
          access={access}
          open={showModal}
          selectedObject={selectedObject}
          onOk={handleSave}
          onCancel={handleCloseModal}
        />
      )}

      {showDetails && (
        <DetailsModal
          open={showDetails}
          selectedObject={selectedObject}
          onCancel={() => {
            setShowDetails(false);
            setSelectedObject();
          }}
          onChange={handleChangeSelectedObject}
          onStepAction={handleSubmitStepAction}
        />
      )}
    </>
  );
};

export default ProductRequestsPage;
