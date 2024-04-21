import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography, message } from "antd";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import service from "../../../../../services/financial/financial-docs/vouchers-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
  handleError,
} from "../../../../../tools/form-manager";
import VoucherModal from "./voucher-modal";
import SearchModal from "./vouchers-search-modal";
import DetailsModal from "./voucher-details-modal";
import { usePageContext } from "./../../../../contexts/page-context";
import DetailsButton from "./../../../../common/details-button";
import SimpleDataPageHeader from "./../../../../common/simple-data-page-header";
import SimpleDataTable from "./../../../../common/simple-data-table";
import { calculatePrice } from "./voucher-modal-code";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "Vouchers",
    data: records,
    columns: [
      { label: Words.voucher_id, value: "VoucherID" },
      { label: Words.voucher_no, value: "VoucherNo" },
      { label: Words.sub_no, value: "SubNo" },
      { label: Words.doc_type, value: "DocTypeTitle" },
      {
        label: Words.voucher_date,
        value: (record) => utils.slashDate(record.VoucherDate),
      },
      { label: Words.standard_details_text, value: "StandardDetailsText" },
      { label: Words.standard_description, value: "DetailsText" },
      { label: Words.price, value: "TotalAmount" },
      {
        label: Words.reg_date,
        value: (record) => utils.slashDate(record.RegDate),
      },
      {
        label: Words.reg_time,
        value: (record) => utils.colonTime(record.RegTime),
      },
      {
        label: Words.registerar,
        value: (record) => `${record.RegFirstName} ${record.RegLastName}`,
      },
      { label: Words.status, value: "StatusTitle" },
    ],
  },
];

const baseColumns = [
  {
    title: Words.voucher_id,
    width: 100,
    align: "center",
    dataIndex: "VoucherID",
    sorter: getSorter("VoucherID"),
    render: (VoucherID) => <Text>{utils.farsiNum(`${VoucherID}`)}</Text>,
  },
  {
    title: Words.voucher_no,
    width: 100,
    align: "center",
    dataIndex: "VoucherNo",
    sorter: getSorter("VoucherNo"),
    render: (VoucherNo) => (
      <Text style={{ color: Colors.red[5] }}>
        {utils.farsiNum(`${VoucherNo}`)}
      </Text>
    ),
  },
  {
    title: Words.doc_type,
    width: 250,
    align: "center",
    dataIndex: "DocTypeTitle",
    sorter: getSorter("DocTypeTitle"),
    render: (DocTypeTitle) => (
      <Text style={{ color: Colors.green[6] }}>{DocTypeTitle}</Text>
    ),
  },
  {
    title: Words.status,
    width: 200,
    align: "center",
    dataIndex: "StatusTitle",
    sorter: getSorter("StatusTitle"),
    render: (StatusTitle) => (
      <Text style={{ color: Colors.orange[6] }}>{StatusTitle}</Text>
    ),
  },
  {
    title: Words.price,
    width: 150,
    align: "center",
    dataIndex: "TotalAmount",
    sorter: getSorter("TotalAmount"),
    render: (TotalAmount) => (
      <Text style={{ color: Colors.red[6] }}>
        {utils.farsiNum(utils.moneyNumber(TotalAmount))}
      </Text>
    ),
  },
  {
    title: Words.registerar,
    width: 150,
    align: "center",
    // dataIndex: "StatusTitle",
    sorter: getSorter("RegLastName"),
    render: (record) => (
      <Text
        style={{
          color: Colors.cyan[6],
        }}
      >
        {`${record.RegFirstName} ${record.RegLastName}`}
      </Text>
    ),
  },
];

const recordID = "VoucherID";

const VouchersPage = ({ pageName }) => {
  const {
    progress,
    setProgress,
    searched,
    setSearched,
    records,
    setRecords,
    access,
    setAccess,
    selectedObject,
    setSelectedObject,
    showModal,
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

  const {
    handleCloseModal,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSave,
    handleResetContext,
  } = GetSimplaDataPageMethods({
    service,
    recordID,
  });

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
        handleEdit,
        handleDelete,
        (row) => row.StatusID === 1, // can edit func
        (row) => row.StatusID === 1 // can delete func
      )
    : [];

  const handleClear = () => {
    setRecords([]);
    setFilter(null);
    setSearched(false);
  };

  const handleSaveVoucherItem = async (voucher_item) => {
    const saved_voucher_item = await service.saveItem(voucher_item);

    const rec = { ...selectedObject };

    // ------

    if (voucher_item.ItemID === 0)
      rec.Items = [...rec.Items, saved_voucher_item];
    else {
      const index = rec.Items.findIndex(
        (i) => i.ItemID === voucher_item.ItemID
      );

      rec.Items[index] = saved_voucher_item;
    }

    const { Bedehkar, Bestankar } = calculatePrice(rec);

    if (Bedehkar === Bestankar) rec.TotalAmount = Bedehkar;
    else rec.TotalAmount = 0;

    setSelectedObject(rec);

    // ------

    const voucher_index = records.findIndex(
      (voucher) => voucher.VoucherID === voucher_item.VoucherID
    );

    records[voucher_index] = rec;

    // ------

    setRecords([...records]);

    return saved_voucher_item;
  };

  const handleDeleteVoucherItem = async (item_id) => {
    await service.deleteItem(item_id);

    if (selectedObject) {
      const rec = { ...selectedObject };

      const selected_item = rec.Items.find((i) => i.ItemID === item_id);
      const { BedehkarAmount, BestankarAmount } = selected_item;
      const item_price = BedehkarAmount > 0 ? BedehkarAmount : BestankarAmount;
      rec.TotalAmount -= item_price;
      rec.Items = rec.Items.filter((i) => i.ItemID !== item_id);
      setSelectedObject(rec);

      //------

      const voucher_index = records.findIndex(
        (voucher) => voucher.VoucherID === rec.VoucherID
      );

      records[voucher_index] = rec;
      setRecords([...records]);
    }
  };

  const handleApproveVoucher = async () => {
    setProgress(true);

    try {
      const data = await service.approveOrder(selectedObject.VoucherID);

      // Update selected object
      selectedObject.StatusID = 2; // Approve
      selectedObject.StatusTitle = Words.voucher_status_2;
      setSelectedObject({ ...selectedObject });

      // Update records
      const receipt_index = records.findIndex(
        (r) => r.VoucherID === selectedObject.VoucherID
      );
      records[receipt_index] = { ...selectedObject };
      setRecords([...records]);

      //---
      message.success(data.Message);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  const handleRejectVoucher = async () => {
    setProgress(true);

    try {
      const data = await service.rejectOrder(selectedObject.VoucherID);

      // Update selected object
      selectedObject.StatusID = 3; // Reject
      selectedObject.StatusTitle = Words.voucher_status_3;
      setSelectedObject({ ...selectedObject });

      // Update records
      const receipt_index = records.findIndex(
        (r) => r.VoucherID === selectedObject.VoucherID
      );
      records[receipt_index] = { ...selectedObject };
      setRecords([...records]);

      //---
      message.success(data.Message);
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.financial_voucher}
            sheets={getSheets(records)}
            fileName="Vouchers"
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
          onOk={handleSearch}
          onCancel={() => setShowSearchModal(false)}
          isOpen={showSearchModal}
          filter={filter}
        />
      )}

      {showModal && (
        <VoucherModal
          access={access}
          onOk={handleSave}
          onCancel={handleCloseModal}
          isOpen={showModal}
          selectedObject={selectedObject}
          onSaveVoucherItem={handleSaveVoucherItem}
          onDeleteVoucherItem={handleDeleteVoucherItem}
          onReject={handleRejectVoucher}
          onApprove={handleApproveVoucher}
        />
      )}

      {showDetails && (
        <DetailsModal
          isOpen={showDetails}
          selectedObject={selectedObject}
          onOk={() => {
            setShowDetails(false);
            setSelectedObject(null);
          }}
        />
      )}
    </>
  );
};

export default VouchersPage;
