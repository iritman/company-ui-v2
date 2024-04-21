import React from "react";
import { useMount } from "react-use";
import { Spin, Row, Col, Typography } from "antd";
import Words from "../../../../../resources/words";
import Colors from "../../../../../resources/colors";
import utils from "../../../../../tools/utils";
import service from "../../../../../services/financial/store-mgr/user-products-service";
import {
  getSorter,
  checkAccess,
  getColumns,
  GetSimplaDataPageMethods,
} from "../../../../../tools/form-manager";
import SimpleDataTable from "../../../../common/simple-data-table";
import SimpleDataPageHeader from "../../../../common/simple-data-page-header";
import ProductModal from "./user-product-modal";
import DetailsModal from "./user-product-details-modal";
import SearchModal from "./user-products-search-modal";
import { usePageContext } from "../../../../contexts/page-context";
import DetailsButton from "../../../../common/details-button";

const { Text } = Typography;

const getSheets = (records) => [
  {
    title: "Products",
    data: records,
    columns: [
      { label: Words.id, value: "ProductID" },
      { label: Words.title, value: "Title" },
      { label: Words.product_code, value: "ProductCode" },
      { label: Words.product_category, value: "CategoryTitle" },
      { label: Words.product_nature, value: "NatureTitle" },
      { label: Words.order_point, value: "OrderPoint" },
      {
        label: Words.is_buyable,
        value: (record) => (record.IsBuyable ? Words.yes : Words.no),
      },
      {
        label: Words.is_salable,
        value: (record) => (record.IsSalable ? Words.yes : Words.no),
      },
      {
        label: Words.is_buildable,
        value: (record) => (record.IsBuildable ? Words.yes : Words.no),
      },
      {
        label: Words.fix_property,
        value: (record) => (record.IsFixProperty ? Words.yes : Words.no),
      },
      {
        label: Words.spare_part,
        value: (record) => (record.IsSparePart ? Words.yes : Words.no),
      },
      { label: Words.descriptions, value: "DetailsText" },
    ],
  },
];

const baseColumns = [
  {
    title: Words.id,
    width: 75,
    align: "center",
    dataIndex: "ProductID",
    sorter: getSorter("ProductID"),
    render: (ProductID) => <Text>{utils.farsiNum(`${ProductID}`)}</Text>,
  },
  {
    title: Words.title,
    width: 200,
    align: "center",
    dataIndex: "Title",
    sorter: getSorter("Title"),
    render: (Title) => <Text style={{ color: Colors.blue[7] }}>{Title}</Text>,
  },
  {
    title: Words.product_code,
    width: 120,
    align: "center",
    dataIndex: "ProductCode",
    sorter: getSorter("ProductCode"),
    render: (ProductCode) => (
      <Text style={{ color: Colors.volcano[6] }}>
        {utils.farsiNum(ProductCode)}
      </Text>
    ),
  },
  {
    title: Words.product_category,
    width: 150,
    align: "center",
    dataIndex: "CategoryTitle",
    sorter: getSorter("CategoryTitle"),
    render: (CategoryTitle) => (
      <Text style={{ color: Colors.cyan[6] }}>{CategoryTitle}</Text>
    ),
  },
  {
    title: Words.product_nature,
    width: 150,
    align: "center",
    dataIndex: "NatureTitle",
    sorter: getSorter("NatureTitle"),
    render: (NatureTitle) => (
      <Text style={{ color: Colors.purple[6] }}>{NatureTitle}</Text>
    ),
  },
];

const handleCheckEditable = (row) => row.Editable;
const handleCheckDeletable = (row) => row.Deletable;

const recordID = "ProductID";

const UserProductsPage = ({ pageName }) => {
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
    // handleGetAll,
    handleResetContext,
    handleAdvancedSearch,
  } = GetSimplaDataPageMethods({
    service,
    recordID,
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

  const columns = access
    ? getColumns(
        baseColumns,
        getOperationalButtons,
        access,
        handleEdit,
        handleDelete,
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

  const handleSaveStore = async (store) => {
    const saved_store = await service.saveStore(store);

    const rec = { ...selectedObject };
    if (store.PSID === 0) {
      rec.Stores = [...rec.Stores, saved_store];
    } else {
      const index = rec.Stores.findIndex((s) => s.PSID === store.PSID);
      rec.Stores[index] = saved_store;
    }
    setSelectedObject(rec);

    //------

    const index = records.findIndex(
      (product) => product.ProductID === store.ProductID
    );

    records[index] = rec;

    //------

    setRecords([...records]);

    return saved_store;
  };

  const handleDeleteStore = async (id) => {
    await service.deleteStore(id);

    if (selectedObject) {
      const rec = { ...selectedObject };
      rec.Stores = rec.Stores.filter((s) => s.PSID !== id);
      setSelectedObject(rec);

      //------

      const index = records.findIndex(
        (product) => product.ProductID === rec.ProductID
      );

      records[index] = rec;

      setRecords([...records]);
    }
  };

  //------

  const handleSaveMeasureUnit = async (measure_unit) => {
    const saved_measure_unit = await service.saveMeasureUnit(measure_unit);

    const rec = { ...selectedObject };
    if (measure_unit.PMID === 0) {
      rec.MeasureUnits = [...rec.MeasureUnits, saved_measure_unit];
    } else {
      const index = rec.MeasureUnits.findIndex(
        (mu) => mu.PMID === measure_unit.PMID
      );
      rec.MeasureUnits[index] = saved_measure_unit;
    }
    setSelectedObject(rec);

    //------

    const index = records.findIndex(
      (product) => product.ProductID === measure_unit.ProductID
    );

    records[index] = rec;

    //------

    setRecords([...records]);

    return saved_measure_unit;
  };

  const handleDeleteMeasureUnit = async (id) => {
    await service.deleteMeasureUnit(id);

    if (selectedObject) {
      const rec = { ...selectedObject };
      rec.MeasureUnits = rec.MeasureUnits.filter((mu) => mu.PMID !== id);
      setSelectedObject(rec);

      //------

      const index = records.findIndex(
        (product) => product.ProductID === rec.ProductID
      );

      records[index] = rec;

      setRecords([...records]);
    }
  };

  //------

  const handleSaveMeasureConvert = async (convert) => {
    const saved_convert = await service.saveMeasureConvert(convert);

    const rec = { ...selectedObject };
    if (convert.ConvertID === 0) {
      rec.MeasureConverts = [...rec.MeasureConverts, saved_convert];
    } else {
      const index = rec.MeasureConverts.findIndex(
        (mc) => mc.ConvertID === convert.ConvertID
      );
      rec.MeasureConverts[index] = saved_convert;
    }
    setSelectedObject(rec);

    //------

    const index = records.findIndex(
      (product) => product.ProductID === convert.ProductID
    );

    records[index] = rec;

    //------

    setRecords([...records]);

    return saved_convert;
  };

  const handleDeleteMeasureConvert = async (id) => {
    await service.deleteMeasureConvert(id);

    if (selectedObject) {
      const rec = { ...selectedObject };
      rec.MeasureConverts = rec.MeasureConverts.filter(
        (mc) => mc.ConvertID !== id
      );
      setSelectedObject(rec);

      //------

      const index = records.findIndex(
        (product) => product.ProductID === rec.ProductID
      );

      records[index] = rec;

      setRecords([...records]);
    }
  };

  //------

  const handleSaveFeature = async (feature) => {
    const saved_feature = await service.saveFeature(feature);

    const rec = { ...selectedObject };
    if (feature.PFID === 0) {
      rec.Features = [...rec.Features, saved_feature];
    } else {
      const index = rec.Features.findIndex((f) => f.PFID === feature.PFID);
      rec.Features[index] = saved_feature;
    }
    setSelectedObject(rec);

    //------

    const index = records.findIndex(
      (product) => product.ProductID === feature.ProductID
    );

    records[index] = rec;

    //------

    setRecords([...records]);

    return saved_feature;
  };

  const handleDeleteFeature = async (id) => {
    await service.deleteFeature(id);

    if (selectedObject) {
      const rec = { ...selectedObject };
      rec.Features = rec.Features.filter((f) => f.PFID !== id);
      setSelectedObject(rec);

      //------

      const index = records.findIndex(
        (product) => product.ProductID === rec.ProductID
      );

      records[index] = rec;

      setRecords([...records]);
    }
  };

  //------

  const handleSaveInventoryControlAgent = async (agent) => {
    const saved_agent = await service.saveInventoryControlAgent(agent);

    const rec = { ...selectedObject };
    if (agent.PAID === 0) {
      rec.InventoryControlAgents = [...rec.InventoryControlAgents, saved_agent];
    } else {
      const index = rec.InventoryControlAgents.findIndex(
        (f) => f.PAID === agent.PAID
      );
      rec.InventoryControlAgents[index] = saved_agent;
    }
    setSelectedObject(rec);

    //------

    const index = records.findIndex(
      (product) => product.ProductID === agent.ProductID
    );

    records[index] = rec;

    //------

    setRecords([...records]);

    return saved_agent;
  };

  const handleDeleteInventoryControlAgent = async (id) => {
    await service.deleteInventoryControlAgent(id);

    if (selectedObject) {
      const rec = { ...selectedObject };
      rec.InventoryControlAgents = rec.InventoryControlAgents.filter(
        (ag) => ag.PAID !== id
      );
      setSelectedObject(rec);

      //------

      const index = records.findIndex(
        (product) => product.ProductID === rec.ProductID
      );

      records[index] = rec;

      setRecords([...records]);
    }
  };

  //------

  return (
    <>
      <Spin spinning={progress}>
        <Row gutter={[10, 15]}>
          <SimpleDataPageHeader
            title={Words.products}
            sheets={getSheets(records)}
            fileName="Products"
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

      {showModal && (
        <ProductModal
          access={access}
          isOpen={showModal}
          selectedObject={selectedObject}
          onOk={handleSave}
          onCancel={handleCloseModal}
          onSaveStore={handleSaveStore}
          onDeleteStore={handleDeleteStore}
          onSaveMeasureUnit={handleSaveMeasureUnit}
          onDeleteMeasureUnit={handleDeleteMeasureUnit}
          onSaveMeasureConvert={handleSaveMeasureConvert}
          onDeleteMeasureConvert={handleDeleteMeasureConvert}
          onSaveFeature={handleSaveFeature}
          onDeleteFeature={handleDeleteFeature}
          onSaveInventoryControlAgent={handleSaveInventoryControlAgent}
          onDeleteInventoryControlAgent={handleDeleteInventoryControlAgent}
        />
      )}

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
          isOpen={showDetails}
          product={selectedObject}
          onOk={() => {
            setShowDetails(false);
            setSelectedObject(null);
          }}
        />
      )}
    </>
  );
};

export default UserProductsPage;
