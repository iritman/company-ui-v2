import { useState, createContext, useContext } from "react";

const ModalContext = createContext();

const useModalContext = () => useContext(ModalContext);

const ModalContextProvider = ({ children }) => {
  const [progress, setProgress] = useState(false);
  const [record, setRecord] = useState({});
  const [errors, setErrors] = useState({});
  const [memberSearchProgress, setMemberSearchProgress] = useState(false);
  const [employeeSearchProgress, setEmployeeSearchProgress] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [members, setMembers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [securityGuards, setSecurityGuards] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [selectedProvinceID, setSelectedProvinceID] = useState(0);
  const [cities, setCities] = useState([]);
  const [companySearchProgress, setCompanySearchProgress] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [dutyLevels, setDutyLevels] = useState([]);
  const [workShifts, setWorkShifts] = useState([]);
  const [monthes, setMonthes] = useState([]);
  const [years, setYears] = useState([]);
  const [eduLevels, setEduLevels] = useState([]);
  const [eduFields, setEduFields] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [employmentTypes, setEmploymentTypes] = useState([]);
  const [employmentStatuses, setEmploymentStatuses] = useState([]);
  const [workPlaces, setWorkPlaces] = useState([]);
  const [workGroups, setWorkGroups] = useState([]);
  const [regTypes, setRegTypes] = useState([]);
  const [vacationTypes, setVacationTypes] = useState([]);
  const [missionTypes, setMissionTypes] = useState([]);
  const [missionTargets, setMissionTargets] = useState([]);
  const [swapMembers, setSwapMembers] = useState([]);
  const [searchTypes, setSearchTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [types, setTypes] = useState([]);
  const [transferTypes, setTransferTypes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [targets, setTargets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commandSources, setCommandSources] = useState([]);
  const [tags, setTags] = useState([]);
  const [banks, setBanks] = useState([]);
  const [fileList, setFileList] = useState({});

  const contextValue = {
    progress,
    setProgress,
    record,
    setRecord,
    errors,
    setErrors,
    memberSearchProgress,
    setMemberSearchProgress,
    employeeSearchProgress,
    setEmployeeSearchProgress,
    departments,
    setDepartments,
    roles,
    setRoles,
    members,
    setMembers,
    employees,
    setEmployees,
    securityGuards,
    setSecurityGuards,
    provinces,
    setProvinces,
    selectedProvinceID,
    setSelectedProvinceID,
    cities,
    setCities,
    companySearchProgress,
    setCompanySearchProgress,
    companies,
    setCompanies,
    dutyLevels,
    setDutyLevels,
    workShifts,
    setWorkShifts,
    monthes,
    setMonthes,
    years,
    setYears,
    eduLevels,
    setEduLevels,
    eduFields,
    setEduFields,
    universities,
    setUniversities,
    employmentTypes,
    setEmploymentTypes,
    employmentStatuses,
    setEmploymentStatuses,
    workPlaces,
    setWorkPlaces,
    workGroups,
    setWorkGroups,
    regTypes,
    setRegTypes,
    vacationTypes,
    setVacationTypes,
    missionTypes,
    setMissionTypes,
    missionTargets,
    setMissionTargets,
    swapMembers,
    setSwapMembers,
    searchTypes,
    setSearchTypes,
    statuses,
    setStatuses,
    brands,
    setBrands,
    models,
    setModels,
    types,
    setTypes,
    transferTypes,
    setTransferTypes,
    vehicles,
    setVehicles,
    targets,
    setTargets,
    showModal,
    setShowModal,
    commandSources,
    setCommandSources,
    tags,
    setTags,
    banks,
    setBanks,
    fileList,
    setFileList,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
};

const useResetContext = () => {
  const { setProgress, setRecord, setErrors } = useModalContext();

  const resetContext = () => {
    setProgress(false);
    setRecord({});
    setErrors({});
  };

  return resetContext;
};

export { ModalContextProvider, useModalContext, useResetContext };
