import React, { useState } from "react";
import { useMount } from "react-use";
import { Form, Row, Col, Tabs, Alert } from "antd";
import ModalWindow from "../../../../common/modal-window";
import utils from "../../../../../tools/utils";
import service from "../../../../../services/financial/store-mgr/user-products-service";
import {
  validateForm,
  loadFieldsValue,
  initModal,
  saveModalChanges,
} from "../../../../../tools/form-manager";
import { handleError } from "../../../../../tools/form-manager";
import {
  useModalContext,
  useResetContext,
} from "../../../../contexts/modal-context";
import { schema, initRecord, getTabItems } from "./user-product-modal-code";
import StoreModal from "./user-product-store-modal";
import MeasureUnitModal from "./user-product-measure-unit-modal";
import MeasureConvertModal from "./user-product-measure-convert-modal";
import FeatureModal from "./user-product-feature-modal";
import InventoryControlAgentModal from "./user-product-inventory-control-agent-modal";
import { v4 as uuid } from "uuid";
import Words from "./../../../../../resources/words";

const formRef = React.createRef();

const UserProductModal = ({
  access,
  isOpen,
  selectedObject,
  onOk,
  onCancel,
  onSaveStore,
  onDeleteStore,
  onSaveMeasureUnit,
  onDeleteMeasureUnit,
  onSaveMeasureConvert,
  onDeleteMeasureConvert,
  onSaveFeature,
  onDeleteFeature,
  onSaveInventoryControlAgent,
  onDeleteInventoryControlAgent,
}) => {
  const { progress, setProgress, record, setRecord, errors, setErrors } =
    useModalContext();

  const [categories, setCategories] = useState([]);
  const [natures, setNatures] = useState([]);
  const [stores, setStores] = useState([]);
  const [measureUnits, setMeasureUnits] = useState([]);
  const [features, setFeatures] = useState([]);
  const [inventoryControlAgents, setInventoryControlAgents] = useState([]);
  const [bachPatterns, setBachPatterns] = useState([]);
  //---
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  //---
  const [showMeasureUnitModal, setShowMeasureUnitModal] = useState(false);
  const [selectedMeasureUnit, setSelectedMeasureUnit] = useState(null);
  //---
  const [showMeasureConvertModal, setShowMeasureConvertModal] = useState(false);
  const [selectedMeasureConvert, setSelectedMeasureConvert] = useState(null);
  //---
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  //---
  const [showInventoryControlAgentModal, setShowInventoryControlAgentModal] =
    useState(false);
  const [selectedInventoryControlAgent, setSelectedInventoryControlAgent] =
    useState(null);
  //---

  const resetContext = useResetContext();

  const formConfig = {
    schema,
    record,
    setRecord,
    errors,
    setErrors,
  };

  const clearRecord = () => {
    record.CategoryID = 0;
    record.NatureID = 0;
    record.ProductCode = "";
    record.Title = "";
    record.BachPatternID = 0;
    record.OrderPoint = 0;
    record.IsBuyable = false;
    record.IsSalable = false;
    record.IsBuildable = false;
    record.DetailsText = "";
    record.Stores = [];
    record.MeasureUnits = [];
    record.MeasureConverts = [];
    record.InventoryControlAgents = [];

    setRecord(record);
    setErrors({});
    loadFieldsValue(formRef, record);
  };

  useMount(async () => {
    resetContext();
    setRecord({ ...initRecord });
    initModal(formRef, selectedObject, setRecord);

    setProgress(true);
    try {
      const data = await service.getParams();

      const {
        Categories,
        Natures,
        Stores,
        MeasureUnits,
        Features,
        InventoryControlAgents,
        BachPatterns,
      } = data;

      setCategories(Categories);
      setNatures(Natures);
      setStores(Stores);
      setMeasureUnits(MeasureUnits);
      setFeatures(Features);
      setInventoryControlAgents(InventoryControlAgents);
      setBachPatterns(BachPatterns);
    } catch (ex) {
      handleError(ex);
    }
    setProgress(false);
  });

  const isEdit = selectedObject !== null;

  const handleSubmit = async () => {
    await saveModalChanges(
      formConfig,
      selectedObject,
      setProgress,
      onOk,
      clearRecord
    );
  };

  //   const handleTabChange = (key) => {
  //     console.log(key);
  //   };

  //-----------------

  const handleShowStoreModal = () => {
    setSelectedStore(null);
    setShowStoreModal(true);
  };

  const handleHideStoreModal = () => {
    setSelectedStore(null);
    setShowStoreModal(false);
  };

  const handleEditStore = (store) => {
    setSelectedStore(store);
    setShowStoreModal(true);
  };

  const handleSaveStore = async (store) => {
    if (store.ProductID === 0) {
      const main_store_info = stores.find((s) => s.StoreID === store.StoreID);
      const { Title, StorageCenterTitle } = main_store_info;
      store.Title = Title;
      store.StorageCenterTitle = StorageCenterTitle;

      //--- managing unique id (UID) for new items
      if (store.PSID === 0 && selectedStore === null) {
        store.UID = uuid();
        record.Stores = [...record.Stores, store];
      } else if (store.PSID === 0 && selectedStore !== null) {
        const index = record.Stores.findIndex(
          (s) => s.UID === selectedStore.UID
        );
        record.Stores[index] = store;
      }
    } else {
      const saved_store = await onSaveStore(store);
      const index = record.Stores.findIndex((s) => s.PSID === store.PSID);

      if (index === -1) {
        record.Stores = [...record.Stores, saved_store];
      } else {
        record.Stores[index] = saved_store;
      }
    }

    setRecord({ ...record });
    setSelectedStore(null);
  };

  const handleDeleteStore = async (store) => {
    setProgress(true);

    try {
      if (store.PSID > 0) {
        await onDeleteStore(store.PSID);

        record.Stores = record.Stores.filter((s) => s.PSID !== store.PSID);
      } else {
        record.Stores = record.Stores.filter((s) => s.UID !== store.UID);
      }

      setRecord({ ...record });
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  //-----------------

  const handleShowMeasureUnitModal = () => {
    setSelectedMeasureUnit(null);
    setShowMeasureUnitModal(true);
  };

  const handleHideMeasureUnitModal = () => {
    setSelectedMeasureUnit(null);
    setShowMeasureUnitModal(false);
  };

  const handleEditMeasureUnit = (measure_unit) => {
    setSelectedMeasureUnit(measure_unit);
    setShowMeasureUnitModal(true);
  };

  const handleSaveMeasureUnit = async (measure_unit) => {
    //--- Set IsDefault property and check previous reged measure units
    //--- This process is independent of temporary or saved (in db) measure units

    if (!measure_unit.IsDefault) {
      if (record.MeasureUnits.length === 0) measure_unit.IsDefault = true;
      else if (record.MeasureUnits.length > 1) {
        // if uncheck default measure unit, first remain measure unit should be default
        const next_measure_unit_id = record.MeasureUnits.filter(
          (mu) => mu.MeasureUnitID !== measure_unit.MeasureUnitID
        )[0].MeasureUnitID;

        const index = record.MeasureUnits.findIndex(
          (mu) => mu.MeasureUnitID === next_measure_unit_id
        );

        record.MeasureUnits[index].IsDefault = true;
      }
    } else {
      if (record.MeasureUnits.length > 0) {
        record.MeasureUnits.forEach((mu) => {
          mu.IsDefault = false;
        });
      }
    }

    //---

    if (measure_unit.ProductID === 0) {
      const main_measure_unit_info = measureUnits.find(
        (mu) => mu.MeasureUnitID === measure_unit.MeasureUnitID
      );
      const { Title, MeasureTypeTitle } = main_measure_unit_info;
      measure_unit.MeasureUnitTitle = Title;
      measure_unit.MeasureTypeTitle = MeasureTypeTitle;

      //--- managing unique id (UID) for new items
      if (measure_unit.PMID === 0 && selectedMeasureUnit === null) {
        measure_unit.UID = uuid();
        record.MeasureUnits = [...record.MeasureUnits, measure_unit];
      } else if (measure_unit.PMID === 0 && selectedMeasureUnit !== null) {
        const index = record.MeasureUnits.findIndex(
          (s) => s.UID === selectedMeasureUnit.UID
        );
        record.MeasureUnits[index] = measure_unit;
      }
    } else {
      const saved_measure_unit = await onSaveMeasureUnit(measure_unit);

      const index = record.MeasureUnits.findIndex(
        (mu) => mu.PMID === measure_unit.PMID
      );

      if (index === -1) {
        record.MeasureUnits = [...record.MeasureUnits, saved_measure_unit];
      } else {
        record.MeasureUnits[index] = saved_measure_unit;
      }
    }

    setRecord({ ...record });
    setSelectedMeasureUnit(null);
  };

  const handleDeleteMeasureUnit = async (measure_unit) => {
    setProgress(true);

    try {
      if (measure_unit.PMID > 0) {
        await onDeleteMeasureUnit(measure_unit.PMID);

        record.MeasureUnits = record.MeasureUnits.filter(
          (mu) => mu.PMID !== measure_unit.PMID
        );
      } else {
        record.MeasureUnits = record.MeasureUnits.filter(
          (mu) => mu.UID !== measure_unit.UID
        );
      }

      //--- Checking default measure unit
      if (
        measure_unit.IsDefault &&
        record.MeasureUnits.filter(
          (mu) => mu.MeasureUnitID !== measure_unit.MeasureUnitID
        ).length > 0
      ) {
        record.MeasureUnits[0].IsDefault = true;
      }

      setRecord({ ...record });
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  //-----------------

  const handleShowMeasureConvertModal = () => {
    setSelectedMeasureConvert(null);
    setShowMeasureConvertModal(true);
  };

  const handleHideMeasureConvertModal = () => {
    setSelectedMeasureConvert(null);
    setShowMeasureConvertModal(false);
  };

  const handleEditMeasureConvert = (measure_convert) => {
    setSelectedMeasureConvert(measure_convert);
    setShowMeasureConvertModal(true);
  };

  const handleSaveMeasureConvert = async (convert) => {
    // prevent adding duplicate converts
    if (
      record.MeasureConverts.find(
        (mc) =>
          ((mc.FromUnitID === convert.FromUnitID &&
            mc.ToUnitID === convert.ToUnitID) ||
            (mc.FromUnitID === convert.ToUnitID &&
              mc.ToUnitID === convert.FromUnitID)) &&
          selectedMeasureConvert === null
      )
    ) {
      const error = {
        response: {
          status: 400,
          data: {
            Error: Words.messages.measure_convert_already_exists,
          },
        },
      };

      throw error;
    }

    //------

    if (convert.ProductID === 0) {
      convert.FromUnitTitle = measureUnits.find(
        (mu) => mu.MeasureUnitID === convert.FromUnitID
      )?.Title;

      convert.ToUnitTitle = measureUnits.find(
        (mu) => mu.MeasureUnitID === convert.ToUnitID
      )?.Title;

      //--- managing unique id (UID) for new items
      if (convert.ConvertID === 0 && selectedMeasureConvert === null) {
        convert.UID = uuid();
        record.MeasureConverts = [...record.MeasureConverts, convert];
      } else if (convert.ConvertID === 0 && selectedMeasureConvert !== null) {
        const index = record.MeasureConverts.findIndex(
          (mc) => mc.UID === selectedMeasureConvert.UID
        );
        record.MeasureConverts[index] = convert;
      }
    } else {
      const saved_convert = await onSaveMeasureConvert(convert);

      const index = record.MeasureConverts.findIndex(
        (mc) => mc.ConvertID === convert.ConvertID
      );

      if (index === -1) {
        record.MeasureConverts = [...record.MeasureConverts, saved_convert];
      } else {
        record.MeasureConverts[index] = saved_convert;
      }
    }

    setRecord({ ...record });
    setSelectedMeasureConvert(null);
  };

  const handleDeleteMeasureConvert = async (convert) => {
    setProgress(true);

    try {
      if (convert.ConvertID > 0) {
        await onDeleteMeasureConvert(convert.ConvertID);

        record.MeasureConverts = record.MeasureConverts.filter(
          (mc) => mc.ConvertID !== convert.ConvertID
        );
      } else {
        record.MeasureConverts = record.MeasureConverts.filter(
          (mc) => mc.UID !== convert.UID
        );
      }

      setRecord({ ...record });
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  //-----------------

  const handleShowFeatureModal = () => {
    setSelectedFeature(null);
    setShowFeatureModal(true);
  };

  const handleHideFeatureModal = () => {
    setSelectedFeature(null);
    setShowFeatureModal(false);
  };

  const handleEditFeature = (feature) => {
    setSelectedFeature(feature);
    setShowFeatureModal(true);
  };

  const handleSaveFeature = async (feature) => {
    // prevent adding duplicate features
    if (
      selectedFeature === null &&
      record.Features.find((f) => f.FeatureGroupID === feature.FeatureGroupID)
    ) {
      const error = {
        response: {
          status: 400,
          data: {
            Error: Words.messages.product_feature_already_exists,
          },
        },
      };

      throw error;
    }

    if (feature.ProductID === 0) {
      const group_feature = features.find(
        (f) => f.GroupFeatureID === feature.GroupFeatureID
      );
      const { Title, FeatureTypeID } = group_feature;
      feature.GroupFeatureTitle = Title;
      feature.FeatureTypeID = FeatureTypeID;

      if (FeatureTypeID < 5) {
        feature.ItemCode = group_feature.Items.find(
          (i) => i.ItemID === feature.ValueItemID
        )?.ItemCode;
      }

      if (feature.PFID === 0 && selectedFeature === null) {
        //--- managing unique id (UID) for new items
        feature.UID = uuid();
        record.Features = [...record.Features, feature];
      } else if (feature.PFID === 0 && selectedFeature !== null) {
        const index = record.Features.findIndex(
          (f) => f.UID === selectedFeature.UID
        );
        record.Features[index] = feature;
      }
    } else {
      const saved_feature = await onSaveFeature(feature);

      const index = record.Features.findIndex((f) => f.PFID === feature.PFID);

      if (index === -1) {
        record.Features = [...record.Features, saved_feature];
      } else {
        record.Features[index] = saved_feature;
      }
    }

    setRecord({ ...record });
    setSelectedFeature(null);
  };

  const handleDeleteFeature = async (feature) => {
    setProgress(true);

    try {
      if (feature.PFID > 0) {
        await onDeleteFeature(feature.PFID);

        record.Features = record.Features.filter(
          (f) => f.PFID !== feature.PFID
        );
      } else {
        record.Features = record.Features.filter((f) => f.UID !== feature.UID);
      }

      setRecord({ ...record });
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  //-----------------

  const handleShowInventoryControlAgentModal = () => {
    setSelectedInventoryControlAgent(null);
    setShowInventoryControlAgentModal(true);
  };

  const handleHideInventoryControlAgentModal = () => {
    setSelectedInventoryControlAgent(null);
    setShowInventoryControlAgentModal(false);
  };

  const handleEditInventoryControlAgent = (agent) => {
    setSelectedInventoryControlAgent(agent);
    setShowInventoryControlAgentModal(true);
  };

  const handleSaveInventoryControlAgent = async (agent) => {
    // prevent adding duplicate inventory control agent
    if (
      selectedInventoryControlAgent === null &&
      record.InventoryControlAgents.find((ag) => ag.AgentID === agent.AgentID)
    ) {
      const error = {
        response: {
          status: 400,
          data: {
            Error:
              Words.messages.product_inventory_control_agent_already_exists,
          },
        },
      };

      throw error;
    }

    if (agent.ProductID === 0) {
      const group_feature = inventoryControlAgents.find(
        (ag) => ag.AgentID === agent.AgentID
      );
      const { Title, FeatureTypeID, FeatureTypeTitle } = group_feature;
      agent.Title = Title;
      agent.FeatureTypeID = FeatureTypeID;
      agent.FeatureTypeTitle = FeatureTypeTitle;

      // if (FeatureTypeID < 5) {
      //   feature.ItemCode = group_feature.Items.find(
      //     (i) => i.ItemID === feature.ValueItemID
      //   )?.ItemCode;
      // }

      if (agent.PAID === 0 && selectedInventoryControlAgent === null) {
        //--- managing unique id (UID) for new items
        agent.UID = uuid();
        record.InventoryControlAgents = [
          ...record.InventoryControlAgents,
          agent,
        ];
      } else if (agent.PAID === 0 && selectedInventoryControlAgent !== null) {
        const index = record.InventoryControlAgents.findIndex(
          (f) => f.UID === selectedInventoryControlAgent.UID
        );
        record.InventoryControlAgents[index] = agent;
      }
    } else {
      const saved_agent = await onSaveInventoryControlAgent(agent);

      const index = record.InventoryControlAgents.findIndex(
        (ag) => ag.PAID === agent.PAID
      );

      if (index === -1) {
        record.InventoryControlAgents = [
          ...record.InventoryControlAgents,
          saved_agent,
        ];
      } else {
        record.InventoryControlAgents[index] = saved_agent;
      }
    }

    setRecord({ ...record });
    setSelectedFeature(null);
  };

  const handleDeleteInventoryControlAgent = async (agent) => {
    setProgress(true);

    try {
      if (agent.PAID > 0) {
        await onDeleteInventoryControlAgent(agent.PAID);

        record.InventoryControlAgents = record.InventoryControlAgents.filter(
          (ag) => ag.PAID !== agent.PAID
        );
      } else {
        record.InventoryControlAgents = record.InventoryControlAgents.filter(
          (ag) => ag.UID !== agent.UID
        );
      }

      setRecord({ ...record });
    } catch (ex) {
      handleError(ex);
    }

    setProgress(false);
  };

  //-----------------

  const tab_props = {
    categories,
    natures,
    bachPatterns,
    record,
    access,
  };

  const tab_events = {
    handleShowStoreModal,
    handleEditStore,
    handleDeleteStore,
    handleShowMeasureUnitModal,
    handleEditMeasureUnit,
    handleDeleteMeasureUnit,
    handleShowMeasureConvertModal,
    handleEditMeasureConvert,
    handleDeleteMeasureConvert,
    handleShowFeatureModal,
    handleEditFeature,
    handleDeleteFeature,
    handleShowInventoryControlAgentModal,
    handleEditInventoryControlAgent,
    handleDeleteInventoryControlAgent,
  };

  //------

  return (
    <>
      <ModalWindow
        isOpen={isOpen}
        isEdit={isEdit}
        inProgress={progress}
        disabled={validateForm({ record, schema }) && true}
        onClear={clearRecord}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        width={1050}
      >
        <Row gutter={[2, 5]}>
          {selectedObject && (
            <Col xs={24}>
              <Alert
                type="info"
                showIcon
                message={utils.farsiNum(
                  `#${selectedObject.ProductID} - ${selectedObject.Title} (${selectedObject.ProductCode})`
                )}
              />
            </Col>
          )}
          <Col xs={24}>
            <Form ref={formRef} name="dataForm">
              <Tabs
                defaultActiveKey="1"
                type="card"
                items={getTabItems(formConfig, tab_props, tab_events)}
              />
            </Form>
          </Col>
        </Row>
      </ModalWindow>

      {showStoreModal && (
        <StoreModal
          isOpen={showStoreModal}
          product={selectedObject}
          selectedStore={selectedStore}
          stores={stores.filter(
            (s) => !record.Stores?.find((ps) => ps.StoreID === s.StoreID)
          )}
          onOk={handleSaveStore}
          onCancel={handleHideStoreModal}
        />
      )}

      {showMeasureUnitModal && (
        <MeasureUnitModal
          isOpen={showMeasureUnitModal}
          product={selectedObject}
          selectedMeasureUnit={selectedMeasureUnit}
          currentMeasureUnits={record.MeasureUnits}
          measureUnits={measureUnits.filter(
            (mu) =>
              !record.MeasureUnits?.find(
                (pmu) => pmu.MeasureUnitID === mu.MeasureUnitID
              )
          )}
          onOk={handleSaveMeasureUnit}
          onCancel={handleHideMeasureUnitModal}
        />
      )}

      {showMeasureConvertModal && (
        <MeasureConvertModal
          isOpen={showMeasureConvertModal}
          product={selectedObject}
          selectedMeasureConvert={selectedMeasureConvert}
          measureUnits={measureUnits}
          onOk={handleSaveMeasureConvert}
          onCancel={handleHideMeasureConvertModal}
        />
      )}

      {showFeatureModal && (
        <FeatureModal
          isOpen={showFeatureModal}
          product={selectedObject}
          selectedFeature={selectedFeature}
          features={features}
          onOk={handleSaveFeature}
          onCancel={handleHideFeatureModal}
        />
      )}

      {showInventoryControlAgentModal && (
        <InventoryControlAgentModal
          isOpen={showInventoryControlAgentModal}
          product={selectedObject}
          selectedInventoryControlAgent={selectedInventoryControlAgent}
          inventoryControlAgents={inventoryControlAgents}
          onOk={handleSaveInventoryControlAgent}
          onCancel={handleHideInventoryControlAgentModal}
        />
      )}
    </>
  );
};

export default UserProductModal;
