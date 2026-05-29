const STORAGE_KEY = "car-maintenance-tracker-v2";
const STORAGE_SCHEMA_VERSION = 2;
const LEGACY_STORAGE_KEYS = [
  "car-maintenance-tracker-mvp",
  "car-maintenance-tracker-mvp-v2",
  "car-maintenance-tracker-v1",
];
const CARFAX_IMPORT_KEY = "car-maintenance-tracker-carfax-master-import-2026-04-17";
const TIRE_TRACKER_EXPANDED_KEY = "car-maintenance-tracker-tire-tracker-expanded";
const SERVICE_LIBRARY = [
  {
    title: "Engine & Fluids",
    services: [
      { name: "Oil change", category: "Engine & Fluids" },
      { name: "Engine air filter replacement", category: "Engine & Fluids" },
      { name: "Cabin air filter replacement", category: "Engine & Fluids" },
      { name: "Coolant flush", category: "Engine & Fluids" },
      { name: "Coolant top-off", category: "Engine & Fluids", aliases: ["Coolant level check"] },
      { name: "Transmission fluid change", category: "Engine & Fluids" },
      { name: "Brake fluid flush", category: "Engine & Fluids", aliases: ["Brake fluid service"] },
      { name: "Power steering fluid service", category: "Engine & Fluids", aliases: ["Power steering fluid change"] },
      { name: "Differential fluid service", category: "Engine & Fluids", aliases: ["Differential fluid change", "Transfer case fluid change"] },
      { name: "Fuel system service", category: "Engine & Fluids", aliases: ["Fuel injector service"] },
    ],
  },
  {
    title: "Tires & Wheels",
    services: [
      { name: "Tire rotation", category: "Tires & Wheels" },
      { name: "Tire replacement", category: "Tires & Wheels" },
      { name: "Tire balance", category: "Tires & Wheels", aliases: ["Wheel balancing"] },
      { name: "Wheel alignment", category: "Tires & Wheels", aliases: ["Wheel alignment check", "Alignment", "Alignment checked"] },
      { name: "Wheel bearing replacement", category: "Tires & Wheels", aliases: ["Wheel bearing"] },
      { name: "Tire pressure check", category: "Tires & Wheels" },
    ],
  },
  {
    title: "Brakes",
    services: [
      { name: "Brake inspection", category: "Brakes", aliases: ["Brake check", "Brakes checked"] },
      { name: "Brake pad replacement", category: "Brakes" },
      { name: "Brake rotor resurfacing", category: "Brakes" },
      { name: "Brake rotor replacement", category: "Brakes" },
      { name: "Brake fluid service", category: "Brakes", aliases: ["Brake fluid flush"] },
      { name: "ABS system service", category: "Brakes" },
    ],
  },
  {
    title: "Battery & Electrical",
    services: [
      { name: "Battery replacement", category: "Battery & Electrical" },
      { name: "Battery test", category: "Battery & Electrical", aliases: ["Battery check", "Battery test / inspection", "Charging system inspection"] },
      { name: "Alternator replacement", category: "Battery & Electrical" },
      { name: "Starter replacement", category: "Battery & Electrical" },
      { name: "Spark plug replacement", category: "Battery & Electrical" },
      { name: "Ignition coil replacement", category: "Battery & Electrical" },
    ],
  },
  {
    title: "Cooling System",
    services: [
      { name: "Radiator replacement", category: "Cooling System" },
      { name: "Radiator hose replacement", category: "Cooling System", aliases: ["Coolant hose replacement"] },
      { name: "Thermostat replacement", category: "Cooling System" },
      { name: "Water pump replacement", category: "Cooling System" },
    ],
  },
  {
    title: "Suspension & Steering",
    services: [
      { name: "Shock replacement", category: "Suspension & Steering" },
      { name: "Strut replacement", category: "Suspension & Steering" },
      { name: "Control arm replacement", category: "Suspension & Steering" },
      { name: "CV axle replacement", category: "Suspension & Steering" },
      { name: "Ball joint replacement", category: "Suspension & Steering" },
      { name: "Tie rod replacement", category: "Suspension & Steering" },
    ],
  },
  {
    title: "General Vehicle",
    services: [
      { name: "Safety inspection", category: "General Vehicle", aliases: ["State inspection"] },
      { name: "Emissions test", category: "General Vehicle", aliases: ["Inspection / emissions"] },
      { name: "Vehicle inspection", category: "General Vehicle", aliases: ["Vehicle serviced"] },
      { name: "Vehicle wash/detail", category: "General Vehicle" },
      { name: "Exterior light check", category: "General Vehicle", aliases: ["Lighting inspection"] },
      { name: "Interior light replacement", category: "General Vehicle", aliases: ["Headlight bulb replacement", "Taillight bulb replacement"] },
    ],
  },
];

const DEFAULT_SERVICE_TYPES = SERVICE_LIBRARY.flatMap((section) => section.services.map((service) => service.name));

const RECOMMENDATION_SECTIONS = [
  {
    title: "Engine",
    services: [
      { serviceType: "Oil change", repeatMiles: 7500, repeatMonths: 6 },
      { serviceType: "Oil filter replacement", repeatMiles: 7500, repeatMonths: 6 },
      { serviceType: "Engine air filter replacement", repeatMiles: 15000, repeatMonths: 12 },
      { serviceType: "Cabin air filter replacement", repeatMiles: 15000, repeatMonths: 12 },
      { serviceType: "Spark plug replacement", repeatMiles: 60000 },
      { serviceType: "Ignition coil replacement", repeatMiles: 60000 },
    ],
  },
  {
    title: "Fluids",
    services: [
      { serviceType: "Transmission fluid change", repeatMiles: 60000 },
      { serviceType: "Coolant flush", repeatMiles: 50000, repeatMonths: 24 },
      { serviceType: "Brake fluid flush", repeatMonths: 24 },
      { serviceType: "Power steering fluid change", repeatMiles: 50000 },
      { serviceType: "Differential fluid change", repeatMiles: 30000, meta: "Helpful for AWD vehicles" },
    ],
  },
  {
    title: "Tires & Wheels",
    services: [
      { serviceType: "Tire replacement" },
      { serviceType: "Tire rotation", repeatMiles: 6000, repeatMonths: 6 },
      { serviceType: "Wheel alignment", repeatMonths: 12 },
      { serviceType: "Wheel balancing", repeatMiles: 12000 },
    ],
  },
  {
    title: "Brakes",
    services: [
      { serviceType: "Brake pad replacement" },
      { serviceType: "Brake rotor replacement" },
      { serviceType: "Brake caliper replacement" },
    ],
  },
  {
    title: "Electrical",
    services: [
      { serviceType: "Battery replacement", repeatMonths: 36 },
      { serviceType: "Alternator replacement" },
      { serviceType: "Starter replacement" },
    ],
  },
  {
    title: "Belts / Engine Parts",
    services: [
      { serviceType: "Serpentine belt replacement", repeatMiles: 60000 },
      { serviceType: "Water pump replacement" },
    ],
  },
  {
    title: "Cooling",
    services: [
      { serviceType: "Radiator replacement" },
      { serviceType: "Thermostat replacement" },
    ],
  },
];

const RECURRING_SERVICE_TEMPLATES = [
  {
    key: "oil-change",
    serviceName: "Oil change",
    category: "Engine",
    intervalType: "mileage-based",
    defaultIntervalLabel: "Every 5,000 miles",
    defaultRepeatMiles: 5000,
    defaultRepeatMonths: null,
    description: "Refresh engine oil so moving parts stay lubricated and protected.",
    reminderLogic: "Mark due when current mileage reaches the next oil-change mileage.",
    aliases: [],
  },
  {
    key: "oil-filter-replacement",
    serviceName: "Oil filter replacement",
    category: "Engine",
    intervalType: "mileage-based",
    defaultIntervalLabel: "Every 5,000 miles",
    defaultRepeatMiles: 5000,
    defaultRepeatMonths: null,
    description: "Replace the oil filter to keep fresh oil circulating cleanly.",
    reminderLogic: "Mark due when mileage reaches the next oil-filter interval.",
    aliases: [],
  },
  {
    key: "engine-air-filter-replacement",
    serviceName: "Engine air filter replacement",
    category: "Engine",
    intervalType: "mileage-based",
    defaultIntervalLabel: "Every 15,000 miles",
    defaultRepeatMiles: 15000,
    defaultRepeatMonths: null,
    description: "Keep intake airflow clean so the engine can breathe efficiently.",
    reminderLogic: "Mark due when mileage reaches the next engine air filter interval.",
    aliases: [],
  },
  {
    key: "cabin-air-filter-replacement",
    serviceName: "Cabin air filter replacement",
    category: "Engine",
    intervalType: "mileage-based",
    defaultIntervalLabel: "Every 15,000 miles",
    defaultRepeatMiles: 15000,
    defaultRepeatMonths: null,
    description: "Improve cabin airflow and help keep dust and pollen out.",
    reminderLogic: "Mark due when mileage reaches the next cabin filter interval.",
    aliases: [],
  },
  {
    key: "tire-rotation",
    serviceName: "Tire rotation",
    category: "Tires & Wheels",
    intervalType: "mileage-based",
    defaultIntervalLabel: "Every 5,000 miles",
    defaultRepeatMiles: 5000,
    defaultRepeatMonths: null,
    description: "Rotate tires to promote even wear across all four positions.",
    reminderLogic: "Mark due when mileage reaches the next tire-rotation interval.",
    aliases: [],
  },
  {
    key: "tire-pressure-check",
    serviceName: "Tire pressure check",
    category: "Tires & Wheels",
    intervalType: "time-based",
    defaultIntervalLabel: "Monthly",
    defaultRepeatMiles: null,
    defaultRepeatMonths: 1,
    description: "Check inflation regularly for safety, wear, and fuel economy.",
    reminderLogic: "Mark due when one month has passed since the last pressure check.",
    aliases: [],
  },
  {
    key: "wheel-alignment-check",
    serviceName: "Wheel alignment",
    category: "Tires & Wheels",
    intervalType: "mileage-based",
    defaultIntervalLabel: "Every 15,000 miles or when symptoms appear",
    defaultRepeatMiles: 15000,
    defaultRepeatMonths: null,
    description: "Check alignment to prevent pulling, uneven tire wear, and steering issues.",
    reminderLogic: "Mark due at 15,000 miles after the last alignment check, or earlier if symptoms appear.",
    aliases: ["Wheel alignment check", "Alignment", "Alignment checked"],
  },
  {
    key: "wheel-balancing",
    serviceName: "Tire balance",
    category: "Tires & Wheels",
    intervalType: "mileage-based",
    defaultIntervalLabel: "Every 10,000-15,000 miles or when symptoms appear",
    defaultRepeatMiles: 12000,
    defaultRepeatMonths: null,
    description: "Balance wheels to reduce vibration and avoid uneven tire wear.",
    reminderLogic: "Mark due at the balancing interval, or earlier if vibration starts.",
    aliases: [],
  },
  {
    key: "brake-inspection",
    serviceName: "Brake inspection",
    category: "Brakes",
    intervalType: "mileage-based",
    defaultIntervalLabel: "Every 10,000 miles",
    defaultRepeatMiles: 10000,
    defaultRepeatMonths: null,
    description: "Inspect pads, rotors, and braking feel before wear becomes a safety issue.",
    reminderLogic: "Mark due when mileage reaches the next brake inspection interval.",
    aliases: [],
  },
  {
    key: "brake-pad-replacement",
    serviceName: "Brake pad replacement",
    category: "Brakes",
    intervalType: "mileage-based",
    defaultIntervalLabel: "Every 30,000-60,000 miles",
    defaultRepeatMiles: 45000,
    defaultRepeatMonths: null,
    description: "Replace worn pads before they damage rotors or reduce stopping performance.",
    reminderLogic: "Mark due when mileage reaches the chosen brake pad interval.",
    aliases: [],
  },
  {
    key: "brake-fluid-flush",
    serviceName: "Brake fluid flush",
    category: "Brakes",
    intervalType: "time-based",
    defaultIntervalLabel: "Every 2-3 years",
    defaultRepeatMiles: null,
    defaultRepeatMonths: 30,
    description: "Flush brake fluid to control moisture buildup and protect brake components.",
    reminderLogic: "Mark due when the brake-fluid time interval has elapsed.",
    aliases: [],
  },
  {
    key: "transmission-fluid-change",
    serviceName: "Transmission fluid change",
    category: "Engine & Fluids",
    intervalType: "mileage-based",
    defaultIntervalLabel: "Every 30,000-60,000 miles",
    defaultRepeatMiles: 45000,
    defaultRepeatMonths: null,
    description: "Refresh transmission fluid to help smooth shifting and reduce wear.",
    reminderLogic: "Mark due when mileage reaches the chosen transmission-fluid interval.",
    aliases: [],
  },
  {
    key: "coolant-flush",
    serviceName: "Coolant flush",
    category: "Engine & Fluids",
    intervalType: "mileage-based",
    defaultIntervalLabel: "Every 50,000 miles",
    defaultRepeatMiles: 50000,
    defaultRepeatMonths: null,
    description: "Flush coolant to maintain temperature control and corrosion protection.",
    reminderLogic: "Mark due when mileage reaches the next coolant-flush interval.",
    aliases: [],
  },
  {
    key: "power-steering-fluid-change",
    serviceName: "Power steering fluid service",
    category: "Engine & Fluids",
    intervalType: "mileage-based",
    defaultIntervalLabel: "Every 50,000 miles",
    defaultRepeatMiles: 50000,
    defaultRepeatMonths: null,
    description: "Replace aging steering fluid to help maintain smooth steering assist.",
    reminderLogic: "Mark due when mileage reaches the next power-steering fluid interval.",
    aliases: [],
  },
  {
    key: "washer-fluid-refill",
    serviceName: "Windshield washer fluid refill",
    category: "Engine & Fluids",
    intervalType: "time-based",
    defaultIntervalLabel: "As needed",
    defaultRepeatMiles: null,
    defaultRepeatMonths: null,
    defaultEnabled: false,
    description: "Top off washer fluid whenever visibility conditions or low fluid level call for it.",
    reminderLogic: "Keep reminders off by default and only schedule this if you want a custom interval.",
    aliases: [],
  },
  {
    key: "battery-test-inspection",
    serviceName: "Battery test",
    category: "Battery & Electrical",
    intervalType: "time-based",
    defaultIntervalLabel: "Yearly",
    defaultRepeatMiles: null,
    defaultRepeatMonths: 12,
    description: "Test battery health and terminals before cold weather or starting issues appear.",
    reminderLogic: "Mark due when one year has passed since the last battery inspection.",
    aliases: ["Battery check", "Battery test / inspection", "Charging system inspection"],
  },
  {
    key: "battery-replacement",
    serviceName: "Battery replacement",
    category: "Battery & Electrical",
    intervalType: "time-based",
    defaultIntervalLabel: "Every 4-5 years",
    defaultRepeatMiles: null,
    defaultRepeatMonths: 54,
    description: "Replace the battery before age causes weak starts or sudden failure.",
    reminderLogic: "Mark due when the battery replacement time interval has elapsed.",
    aliases: [],
  },
  {
    key: "coolant-level-check",
    serviceName: "Coolant top-off",
    category: "Cooling System",
    intervalType: "time-based",
    defaultIntervalLabel: "Monthly",
    defaultRepeatMiles: null,
    defaultRepeatMonths: 1,
    description: "Check reservoir levels to catch leaks or low coolant early.",
    reminderLogic: "Mark due when one month has passed since the last coolant level check.",
    aliases: ["Coolant level check", "Cooling system inspection"],
  },
  {
    key: "radiator-inspection",
    serviceName: "Radiator inspection",
    category: "Cooling System",
    intervalType: "time-based",
    defaultIntervalLabel: "Yearly",
    defaultRepeatMiles: null,
    defaultRepeatMonths: 12,
    description: "Inspect the radiator for leaks, damage, and cooling-system wear.",
    reminderLogic: "Mark due when one year has passed since the last radiator inspection.",
    aliases: [],
  },
  {
    key: "wiper-blade-replacement",
    serviceName: "Wiper blade replacement",
    category: "Visibility",
    intervalType: "time-based",
    defaultIntervalLabel: "Every 6-12 months",
    defaultRepeatMiles: null,
    defaultRepeatMonths: 9,
    description: "Replace worn blades to keep the windshield clear in rain and snow.",
    reminderLogic: "Mark due when the wiper-blade time interval has elapsed.",
    aliases: ["Wiper blades"],
  },
  {
    key: "exterior-light-check",
    serviceName: "Exterior light check",
    category: "Visibility",
    intervalType: "time-based",
    defaultIntervalLabel: "Monthly",
    defaultRepeatMiles: null,
    defaultRepeatMonths: 1,
    description: "Check headlights, brake lights, and turn signals so visibility stays legal and safe.",
    reminderLogic: "Mark due when one month has passed since the last exterior light check.",
    aliases: [],
  },
];

const TIRE_POSITIONS = [
  { key: "frontLeft", label: "Front left" },
  { key: "frontRight", label: "Front right" },
  { key: "rearLeft", label: "Rear left" },
  { key: "rearRight", label: "Rear right" },
];
const TREAD_RATING_MIN = 1;
const TREAD_RATING_MAX = 10;
const LEGACY_TREAD_32NDS_MIN = 2;
const LEGACY_TREAD_32NDS_MAX = 14;
const ROTATION_PRESETS = [
  { value: "front-to-back", label: "Front-to-back" },
  { value: "cross-rotation", label: "Cross rotation" },
  { value: "rearward-cross", label: "Rearward cross" },
  { value: "manual", label: "Manual move" },
];
let lastPersistedState = "";
let saveStatusTimer = null;
let isRestoringUiState = false;

const state = loadState();

const authStatus = document.querySelector("#authStatus");
const saveStatus = document.querySelector("#saveStatus");
const exportDataButton = document.querySelector("#exportDataButton");
const importDataInput = document.querySelector("#importDataInput");
const resetDataButton = document.querySelector("#resetDataButton");
const vehicleForm = document.querySelector("#vehicleForm");
const vehicleFormPanel = document.querySelector("#vehicleFormPanel");
const vehicleFormToggleButton = document.querySelector("#vehicleFormToggleButton");
const vehicleSubmitButton = document.querySelector("#vehicleSubmitButton");
const vehicleCancelEditButton = document.querySelector("#vehicleCancelEditButton");
const recordForm = document.querySelector("#recordForm");
const recordTireSection = document.querySelector("#recordTireSection");
const recordTireMultiplePositions = document.querySelector("#recordTireMultiplePositions");
const recordServiceChecklist = document.querySelector("#recordServiceChecklist");
const recordServiceSearchInput = document.querySelector("#recordServiceSearchInput");
const recordCustomServiceInput = document.querySelector("#recordCustomServiceInput");
const recordAddCustomServiceButton = document.querySelector("#recordAddCustomServiceButton");
const historyQuickServiceChecklist = document.querySelector("#historyQuickServiceChecklist");
const historyQuickServiceSearchInput = document.querySelector("#historyQuickServiceSearchInput");
const serviceChecklist = document.querySelector("#serviceChecklist");
const selectedServicesList = document.querySelector("#selectedServicesList");
const customServiceInput = document.querySelector("#customServiceInput");
const addCustomServiceButton = document.querySelector("#addCustomServiceButton");
const serviceNameManagerList = document.querySelector("#serviceNameManagerList");
const serviceNameManagerSearchInput = document.querySelector("#serviceNameManagerSearchInput");
const serviceNameManagerCategorySelect = document.querySelector("#serviceNameManagerCategorySelect");
const serviceNameManagerNotesInput = document.querySelector("#serviceNameManagerNotesInput");
const serviceNameManagerCancelButton = document.querySelector("#serviceNameManagerCancelButton");
const recordCategorySelect = document.querySelector("#recordCategorySelect");
const historySearchInput = document.querySelector("#historySearchInput");
const historyVehicleFilter = document.querySelector("#historyVehicleFilter");
const historyCategoryFilter = document.querySelector("#historyCategoryFilter");
const historyDateFrom = document.querySelector("#historyDateFrom");
const historyDateTo = document.querySelector("#historyDateTo");
const historySortSelect = document.querySelector("#historySortSelect");
const historyTopAddButton = document.querySelector("#historyTopAddButton");
const historyTopEditButton = document.querySelector("#historyTopEditButton");
const historyTopDeleteButton = document.querySelector("#historyTopDeleteButton");
const historyTopActionTarget = document.querySelector("#historyTopActionTarget");
const serviceTypeOptions = document.querySelector("#serviceTypeOptions");
const dashboardVehicleSelect = document.querySelector("#dashboardVehicleSelect");
const garageVehicleSelect = document.querySelector("#garageVehicleSelect");
const nextUpList = document.querySelector("#nextUpList");
const dashboardMaintenanceStats = document.querySelector("#dashboardMaintenanceStats");
const dashboardPredictiveInsights = document.querySelector("#dashboardPredictiveInsights");
const dashboardCostStats = document.querySelector("#dashboardCostStats");
const dashboardCostByCategory = document.querySelector("#dashboardCostByCategory");
const dashboardQuickStats = document.querySelector("#dashboardQuickStats");
const dashboardRecentUpdates = document.querySelector("#dashboardRecentUpdates");
const dashboardHealthByCategory = document.querySelector("#dashboardHealthByCategory");
const dashboardMaintenanceTimeline = document.querySelector("#dashboardMaintenanceTimeline");
const scheduleVehicleSelect = document.querySelector("#scheduleVehicleSelect");
const scheduleCategoryFilter = document.querySelector("#scheduleCategoryFilter");
const scheduleStatusFilter = document.querySelector("#scheduleStatusFilter");
const schedulePlanToggleButton = document.querySelector("#schedulePlanToggleButton");
const schedulePlanPanel = document.querySelector("#schedulePlanPanel");
const schedulePlanForm = document.querySelector("#schedulePlanForm");
const schedulePlanTitle = document.querySelector("#schedulePlanTitle");
const schedulePlanSubmitButton = document.querySelector("#schedulePlanSubmitButton");
const schedulePlanCancelButton = document.querySelector("#schedulePlanCancelButton");
const schedulePlanDeleteButton = document.querySelector("#schedulePlanDeleteButton");
const scheduleMileageList = document.querySelector("#scheduleMileageList");
const scheduleTimeList = document.querySelector("#scheduleTimeList");
const scheduleBothList = document.querySelector("#scheduleBothList");
const scheduleScreen = document.querySelector('[data-screen="schedule"]');
const dashboardVehicleList = document.querySelector("#dashboardVehicleList");
const vehicleList = document.querySelector("#vehicleList");
const tireEditPanel = document.querySelector("#tireEditPanel");
const tireEditForm = document.querySelector("#tireEditForm");
const tireEditTitle = document.querySelector("#tireEditTitle");
const tireEditCancelButton = document.querySelector("#tireEditCancelButton");
const historyList = document.querySelector("#historyList");
const historyTimeline = document.querySelector("#historyTimeline");
const historyViewToggle = document.querySelector("#historyViewToggle");
const historyQuickAddPanel = document.querySelector("#historyQuickAddPanel");
const historyQuickAddToggleButton = document.querySelector("#historyQuickAddToggleButton");
const historyLogSection = document.querySelector("#historyLogSection");
const recordVehicleSelect = document.querySelector("#recordVehicleSelect");
const recordFormPanel = document.querySelector("#recordFormPanel");
const recordFormToggleButton = document.querySelector("#recordFormToggleButton");
const recordFormTitle = document.querySelector("#recordFormTitle");
const recordEditNotice = document.querySelector("#recordEditNotice");
const recordSubmitButton = document.querySelector("#recordSubmitButton");
const recordCancelEditButton = document.querySelector("#recordCancelEditButton");
const screenButtons = [...document.querySelectorAll("[data-screen-target]")];
const screens = [...document.querySelectorAll("[data-screen]")];
let editingVisitRecordIds = [];
let isRecordFormExpanded = false;
let isHistoryQuickAddExpanded = false;
let editingCustomServiceName = null;
let editingServiceDefinitionKey = null;
let editingVehicleId = null;
let editingTireKey = null;
let isVehicleFormExpanded = false;
let editingSchedulePlanKey = null;
let isSchedulePlanExpanded = false;
let activeDashboardVehicleId = "";
let activeGarageVehicleId = "";
let activeGarageTirePosition = "frontLeft";
let activeHistoryView = state.ui?.historyView || "list";
let isTireTrackerExpanded =
  state.ui?.tireTrackerExpanded ?? localStorage.getItem(TIRE_TRACKER_EXPANDED_KEY) === "true";
let isTireRotationPanelOpen = false;

const DEFAULT_TIRE_ROTATION_MILES = 5000;

seedCarfaxData();
seedDemoData();
renderAllStaticOptions();
bindEvents();
render();
initializeLocalStorageMode();
registerServiceWorker();

function bindEvents() {
  vehicleForm.addEventListener("submit", handleVehicleSubmit);
  tireEditForm.addEventListener("submit", handleTireEditSubmit);
  recordForm.addEventListener("submit", handleRecordSubmit);
  vehicleList.addEventListener("click", handleVehicleListClick);
  vehicleList.addEventListener("change", handleVehicleListChange);
  vehicleList.addEventListener("submit", handleVehicleListSubmit);
  historyList.addEventListener("click", handleHistoryListClick);
  historyTimeline.addEventListener("click", handleHistoryListClick);
  historyViewToggle.addEventListener("click", handleHistoryViewToggleClick);
  recordCancelEditButton.addEventListener("click", resetRecordFormMode);
  historyTopAddButton.addEventListener("click", handleHistoryTopAdd);
  historyTopEditButton.addEventListener("click", handleHistoryTopEdit);
  historyTopDeleteButton.addEventListener("click", handleHistoryTopDelete);
  vehicleCancelEditButton.addEventListener("click", resetVehicleFormMode);
  vehicleFormToggleButton.addEventListener("click", () => setVehicleFormExpanded(!isVehicleFormExpanded));
  tireEditCancelButton.addEventListener("click", resetTireEditMode);
  recordFormToggleButton.addEventListener("click", () => setRecordFormExpanded(!isRecordFormExpanded));
  historyQuickAddToggleButton.addEventListener("click", () => setHistoryQuickAddExpanded(!isHistoryQuickAddExpanded));
  dashboardVehicleList.addEventListener("click", handleDashboardVehicleListClick);
  schedulePlanForm.addEventListener("submit", handleSchedulePlanSubmit);
  schedulePlanToggleButton.addEventListener("click", () => {
    if (isSchedulePlanExpanded && !editingSchedulePlanKey) {
      setSchedulePlanExpanded(false);
      return;
    }
    initializeCustomSchedulePlan();
  });
  schedulePlanCancelButton.addEventListener("click", resetSchedulePlanMode);
  schedulePlanDeleteButton.addEventListener("click", handleSchedulePlanDelete);
  scheduleVehicleSelect.addEventListener("change", handleScheduleVehicleChange);
  dashboardVehicleSelect.addEventListener("change", handleDashboardVehicleChange);
  garageVehicleSelect.addEventListener("change", handleGarageVehicleChange);
  scheduleCategoryFilter.addEventListener("change", () => {
    renderServiceSchedule();
    persistUiState();
  });
  scheduleStatusFilter.addEventListener("change", () => {
    renderServiceSchedule();
    persistUiState();
  });
  scheduleScreen.addEventListener("click", handleScheduleScreenClick);
  recordCustomServiceInput.addEventListener("input", handleRecordCustomServiceInput);
  recordAddCustomServiceButton.addEventListener("click", handleRecordAddCustomService);
  recordServiceSearchInput.addEventListener("input", renderRecordServiceChecklist);
  recordCategorySelect.addEventListener("change", handleRecordCategoryChange);
  recordForm.elements.recordTirePosition.addEventListener("change", syncRecordTirePositionMode);
  historySearchInput.addEventListener("input", () => {
    renderHistory();
    persistUiState();
  });
  if (historyVehicleFilter) {
    historyVehicleFilter.addEventListener("change", () => {
      handleHistoryVehicleChange();
      persistUiState();
    });
  }
  historyCategoryFilter.addEventListener("change", () => {
    renderHistory();
    persistUiState();
  });
  historyDateFrom.addEventListener("change", () => {
    renderHistory();
    persistUiState();
  });
  historyDateTo.addEventListener("change", () => {
    renderHistory();
    persistUiState();
  });
  historySortSelect.addEventListener("change", () => {
    renderHistory();
    persistUiState();
  });
  screenButtons.forEach((button) =>
    button.addEventListener("click", () => handleScreenButtonClick(button.dataset.screenTarget))
  );

  if (addCustomServiceButton) {
    addCustomServiceButton.addEventListener("click", handleAddCustomService);
  }
  if (serviceNameManagerCancelButton) {
    serviceNameManagerCancelButton.addEventListener("click", resetServiceNameManagerEditor);
  }
  if (serviceNameManagerSearchInput) {
    serviceNameManagerSearchInput.addEventListener("input", renderServiceNameManager);
  }
  if (serviceNameManagerList) {
    serviceNameManagerList.addEventListener("click", handleServiceNameManagerClick);
    serviceNameManagerList.addEventListener("change", handleServiceNameManagerChange);
  }
  if (serviceChecklist) {
    serviceChecklist.addEventListener("change", (event) => {
      if (event.target.name === "serviceTypes") {
        syncRecordTireSection();
        renderSelectedServices();
      }
    });
    serviceChecklist.addEventListener("click", handleServiceChecklistClick);
  }
  if (selectedServicesList) {
    selectedServicesList.addEventListener("click", handleSelectedServicesClick);
  }
  if (historyQuickServiceChecklist) {
    historyQuickServiceChecklist.addEventListener("click", handleHistoryQuickServicePick);
  }
  if (historyQuickServiceSearchInput) {
    historyQuickServiceSearchInput.addEventListener("input", renderHistoryQuickServiceChecklist);
    historyQuickServiceSearchInput.addEventListener("keydown", handleHistoryQuickServiceSearchKeydown);
  }
  if (recordServiceChecklist) {
    recordServiceChecklist.addEventListener("change", handleRecordServiceChecklistChange);
  }
  exportDataButton?.addEventListener("click", handleExportData);
  importDataInput?.addEventListener("change", handleImportData);
  resetDataButton?.addEventListener("click", handleResetData);
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(`/service-worker.js?v=${Date.now()}`)
      .then((registration) => registration.update())
      .catch(() => {
        // The app still works normally if install/offline support is unavailable.
      });
  });
}

function initializeLocalStorageMode() {
  updateAuthUi();
  setAuthStatus("Local autosave on");
  showSaveStatus("Saved locally", { hold: 900 });
}

function updateAuthUi() {
  setAuthStatus("Local autosave on");
}

function setAuthStatus(message) {
  if (authStatus) {
    authStatus.textContent = message;
  }
}

function handleExportData() {
  persist({ silent: true });
  const exportPayload = {
    app: "car-maintenance-tracker",
    storageKey: STORAGE_KEY,
    exportedAt: new Date().toISOString(),
    state,
  };
  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStamp = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `car-maintenance-tracker-backup-${dateStamp}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showSaveStatus("Exported", { hold: 1600 });
}

async function handleImportData(event) {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  try {
    const text = await file.text();
    const parsedJson = JSON.parse(text);
    const importedState = parseStoredState(JSON.stringify(parsedJson.state ?? parsedJson));
    if (!importedState) {
      throw new Error("Backup file did not contain readable tracker data.");
    }

    const confirmed = window.confirm(
      "Import this backup and replace the current local data in this browser? This cannot be undone unless you export the current data first."
    );
    if (!confirmed) {
      return;
    }

    applyImportedState(importedState);
    persist();
    renderAllStaticOptions();
    render();
    showSaveStatus("Imported", { hold: 1800 });
  } catch (error) {
    console.error("Could not import car maintenance tracker backup", error);
    window.alert("That backup file could not be imported. Please choose a valid tracker JSON export.");
    showSaveStatus("Import failed", { isError: true, hold: 2400 });
  } finally {
    event.target.value = "";
  }
}

function handleResetData() {
  const confirmed = window.confirm(
    "Reset all local car maintenance tracker data in this browser? This removes vehicles, tires, service history, custom services, recurring plans, and saved UI state."
  );
  if (!confirmed) {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
  LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
  localStorage.removeItem(CARFAX_IMPORT_KEY);
  localStorage.removeItem(TIRE_TRACKER_EXPANDED_KEY);
  window.location.reload();
}

function applyImportedState(importedState) {
  const normalizedState = mergeStoredState(createEmptyState(), importedState);
  normalizedState.vehicles = normalizedState.vehicles.map(normalizeVehicleTireData);
  normalizedState.serviceDefinitions = normalizeServiceDefinitions(normalizedState.serviceDefinitions || []);
  normalizedState.customServiceTypes = mergeUniqueText(
    normalizedState.customServiceTypes || [],
    normalizedState.serviceDefinitions
      .filter((serviceDefinition) => !serviceDefinition.baseName)
      .map((serviceDefinition) => serviceDefinition.name)
  );
  normalizedState.ui = normalizeUiState(normalizedState.ui);

  state.schemaVersion = STORAGE_SCHEMA_VERSION;
  state.updatedAt = normalizedState.updatedAt ?? new Date().toISOString();
  state.vehicles = normalizedState.vehicles;
  state.records = normalizedState.records;
  state.customServiceTypes = normalizedState.customServiceTypes;
  state.recurringPlans = normalizedState.recurringPlans;
  state.hiddenServiceTypes = normalizedState.hiddenServiceTypes;
  state.serviceDefinitions = normalizedState.serviceDefinitions;
  state.ui = normalizedState.ui;
}

function renderAllStaticOptions() {
  renderServiceTypeOptions();
  renderRecordServiceChecklist();
  renderHistoryQuickServiceChecklist();
  renderHistoryCategoryOptions();
  renderScheduleCategoryOptions();
  restoreUiStateControls();
  updateRecordFormMode();
  updateVehicleFormMode();
  updateTireEditMode();
  updateSchedulePlanMode();
}

function handleVehicleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(vehicleForm);
  const vehiclePayload = {
    year: Number(formData.get("year")),
    make: cleanText(formData.get("make")),
    model: cleanText(formData.get("model")),
    trim: cleanText(formData.get("trim")),
    vin: cleanText(formData.get("vin")),
    purchaseMileage: numericOrNull(formData.get("purchaseMileage")),
    engineSpec: cleanText(formData.get("engineSpec")),
    drivetrain: cleanText(formData.get("drivetrain")),
    fuelType: cleanText(formData.get("fuelType")),
    oilCapacity: cleanText(formData.get("oilCapacity")),
    vehicleTireSize: cleanText(formData.get("vehicleTireSize")),
    vehicleRecommendedPsi: numericOrNull(formData.get("vehicleRecommendedPsi")),
    notes: cleanText(formData.get("notes")),
    currentMileage: Number(formData.get("currentMileage")),
  };

  if (editingVehicleId) {
    const vehicleIndex = state.vehicles.findIndex((vehicle) => vehicle.id === editingVehicleId);
    if (vehicleIndex >= 0) {
      state.vehicles[vehicleIndex] = {
        ...state.vehicles[vehicleIndex],
        ...vehiclePayload,
      };
    }
  } else {
    state.vehicles.unshift({
      id: crypto.randomUUID(),
      ...vehiclePayload,
      createdAt: new Date().toISOString(),
    });
  }

  persist();
  resetVehicleFormMode();
  render();
}

function handleDashboardVehicleListClick(event) {
  const editButton = event.target.closest("[data-edit-vehicle]");
  if (!editButton) {
    return;
  }

  const vehicleId = editButton.dataset.editVehicle;
  const vehicle = state.vehicles.find((item) => item.id === vehicleId);
  if (!vehicle) {
    return;
  }

  loadVehicleIntoForm(vehicle);
}

function handleScheduleVehicleChange() {
  syncActiveVehicle(scheduleVehicleSelect.value);
  if (!editingSchedulePlanKey) {
    schedulePlanForm.elements.vehicleId.value = getActiveScheduleVehicleId();
  }
  renderDashboard();
  renderVehicles();
  renderHistory();
  renderServiceSchedule();
}

function handleDashboardVehicleChange() {
  syncActiveVehicle(dashboardVehicleSelect.value);
  renderDashboard();
  renderVehicles();
  renderHistory();
  renderServiceSchedule();
}

function setRecordCategoryValue(category, { manual = false } = {}) {
  if (!recordCategorySelect) {
    return;
  }

  const nextCategory = cleanText(category) || "Custom";
  recordCategorySelect.value = nextCategory;
  recordForm.dataset.categoryManual = manual ? "true" : "false";
}

function handleRecordCategoryChange() {
  recordForm.dataset.categoryManual = "true";
}

function getAutoServiceCategory(serviceType) {
  const normalizedServiceType = cleanText(serviceType);
  if (!normalizedServiceType) {
    return "Custom";
  }

  const serviceDefinition = getServiceDefinition(normalizedServiceType);
  if (serviceDefinition?.category) {
    return serviceDefinition.category;
  }

  const template = getRecurringTemplateByName(normalizedServiceType);
  return template?.category || "Custom";
}

function getAutoCategoryForSelectedServices(serviceTypes) {
  const categories = [...new Set(serviceTypes.map((serviceType) => getAutoServiceCategory(serviceType)).filter(Boolean))];
  if (!categories.length) {
    return "Custom";
  }
  if (categories.length === 1) {
    return categories[0];
  }
  return "Custom";
}

function handleGarageVehicleChange() {
  syncActiveVehicle(garageVehicleSelect.value);
  renderDashboard();
  renderVehicles();
  renderHistory();
  renderServiceSchedule();
}

function handleHistoryViewToggleClick(event) {
  const button = event.target.closest("[data-history-view]");
  if (!button) {
    return;
  }

  activeHistoryView = button.dataset.historyView;
  updateHistoryViewMode();
}

function handleHistoryVehicleChange() {
  if (!historyVehicleFilter?.value) {
    return;
  }

  syncActiveVehicle(historyVehicleFilter.value);
  renderDashboard();
  renderVehicles();
  renderServiceSchedule();
  renderHistory();
}

function handleRecordServiceTypeChange() {
  const serviceTypes = getSelectedRecordServiceTypes();
  if (!serviceTypes.length) {
    recordForm.elements.serviceType.value = "";
    setRecordCategoryValue("Custom");
    renderRecordServiceChecklist();
    renderHistoryQuickServiceChecklist();
    syncRecordTireSection();
    return;
  }

  recordForm.elements.serviceType.value = serviceTypes[0];
  renderServiceTypeOptions();
  setRecordCategoryValue(getAutoCategoryForSelectedServices(serviceTypes));
  syncRecordTireSection();
  renderRecordServiceChecklist();
  renderHistoryQuickServiceChecklist();
}

function handleRecordServiceChecklistChange(event) {
  if (event.target.name !== "recordServiceType") {
    return;
  }
  handleRecordServiceTypeChange();
}

function handleRecordCustomServiceInput() {
  handleRecordServiceTypeChange();
}

function handleRecordAddCustomService() {
  const serviceType = cleanText(recordCustomServiceInput.value);
  if (!serviceType) {
    return;
  }

  registerCustomServiceType(serviceType);
  renderServiceTypeOptions();
  renderRecordServiceChecklist();
  handleRecordServiceTypeChange();
}

function handleHistoryQuickServicePick(event) {
  const pickButton = event.target.closest("[data-quick-service]");
  if (!pickButton) {
    return;
  }

  applyHistoryQuickService(pickButton.dataset.quickService);
}

function handleHistoryQuickServiceSearchKeydown(event) {
  if (event.key !== "Enter") {
    return;
  }

  event.preventDefault();
  applyHistoryQuickService(historyQuickServiceSearchInput.value);
}

function applyHistoryQuickService(serviceType) {
  const normalized = cleanText(serviceType);
  if (!normalized) {
    return;
  }

  const canonicalService = getCanonicalServiceType(normalized);
  registerCustomServiceType(canonicalService);
  renderServiceTypeOptions();
  renderHistoryCategoryOptions();
  renderScheduleCategoryOptions();
  recordCustomServiceInput.value = canonicalService;
  recordForm.elements.serviceType.value = canonicalService;
  setRecordCategoryValue(getAutoServiceCategory(canonicalService));
  renderRecordServiceChecklist();
  renderHistoryQuickServiceChecklist();
  setRecordFormExpanded(true);
  setHistoryQuickAddExpanded(false);
  syncRecordTireSection();
  if (historyQuickServiceSearchInput) {
    historyQuickServiceSearchInput.value = "";
  }
}

function syncRecordTirePositionMode() {
  const usesMultiple = recordForm.elements.recordTirePosition.value === "multiple";
  recordTireMultiplePositions.classList.toggle("is-hidden", !usesMultiple);
  if (!usesMultiple) {
    recordForm.querySelectorAll('input[name="recordTirePositions"]').forEach((input) => {
      input.checked = false;
    });
  }
}

function handleScheduleScreenClick(event) {
  const toggleButton = event.target.closest("[data-toggle-recurring-plan]");
  if (toggleButton) {
    const plan = getRecurringPlanByKey(toggleButton.dataset.toggleRecurringPlan);
    if (!plan) {
      return;
    }

    upsertRecurringPlan({
      ...plan,
      enabled: !plan.enabled,
    });
    render();
    return;
  }

  const editButton = event.target.closest("[data-edit-recurring-plan]");
  if (editButton) {
    const plan = getRecurringPlanByKey(editButton.dataset.editRecurringPlan);
    if (!plan) {
      return;
    }

    loadSchedulePlanIntoForm(plan);
    return;
  }

  const deleteButton = event.target.closest("[data-delete-recurring-plan]");
  if (deleteButton) {
    const plan = getRecurringPlanByKey(deleteButton.dataset.deleteRecurringPlan);
    if (!plan) {
      return;
    }

    if (!confirmDeleteRecurringPlan()) {
      return;
    }

    deleteRecurringPlan(plan);
    persist();
    if (editingSchedulePlanKey === plan.planKey) {
      resetSchedulePlanMode();
    }
    render();
  }
}

function confirmDeleteRecurringPlan() {
  return window.confirm("Delete this maintenance plan? This will not delete service history.");
}

function deleteRecurringPlan(plan) {
  if (!plan) {
    return;
  }

  if (plan.isCustom) {
    state.recurringPlans = state.recurringPlans.filter((item) => item.id !== plan.id);
    return;
  }

  state.recurringPlans = state.recurringPlans.filter(
    (item) => !(item.vehicleId === plan.vehicleId && !item.isCustom && item.serviceKey === plan.serviceKey)
  );
  state.recurringPlans.push({
    id: plan.id || `${plan.vehicleId}:${plan.serviceKey}`,
    vehicleId: plan.vehicleId,
    serviceKey: plan.serviceKey,
    serviceName: plan.serviceName,
    category: plan.category,
    isCustom: false,
    removed: true,
    enabled: false,
  });
}

function handleSchedulePlanDelete() {
  if (!editingSchedulePlanKey) {
    return;
  }

  const plan = getRecurringPlanByKey(editingSchedulePlanKey);
  if (!plan) {
    return;
  }

  if (!confirmDeleteRecurringPlan()) {
    return;
  }

  deleteRecurringPlan(plan);
  persist();
  resetSchedulePlanMode();
  render();
}

function handleSchedulePlanSubmit(event) {
  event.preventDefault();
  const formData = new FormData(schedulePlanForm);
  const planId = cleanText(formData.get("planId"));
  const rawServiceKey = cleanText(formData.get("serviceKey"));
  const serviceName = cleanText(formData.get("serviceName"));
  const category = cleanText(formData.get("category"));
  const intervalType = cleanText(formData.get("intervalType"));
  const vehicleId = cleanText(schedulePlanForm.elements.vehicleId.value) || getActiveScheduleVehicleId();

  if (!vehicleId || !serviceName || !category || !intervalType) {
    return;
  }

  const matchingTemplate = getRecurringTemplateByKey(rawServiceKey) ?? getRecurringTemplateByName(serviceName);
  const isCustom = formData.get("isCustom") === "true" || !matchingTemplate;
  const repeatMiles = numericOrNull(formData.get("repeatMiles"));
  const repeatMonths = numericOrNull(formData.get("repeatMonths"));
  const nextId = planId || crypto.randomUUID();
  const serviceKey = isCustom ? rawServiceKey || `custom:${nextId}` : matchingTemplate.key;

  const planPayload = {
    id: nextId,
    vehicleId,
    serviceKey,
    serviceName: matchingTemplate?.serviceName ?? serviceName,
    category: matchingTemplate?.category ?? category,
    intervalType,
    repeatMiles,
    repeatMonths,
    enabled: true,
    description: cleanText(formData.get("description")),
    reminderLogic: cleanText(formData.get("reminderLogic")),
    isCustom,
    aliases: matchingTemplate?.aliases ?? [],
  };

  upsertRecurringPlan(planPayload);
  persist();
  resetSchedulePlanMode();
  render();
}

function handleVehicleListChange(event) {
  if (!event.target.matches('[data-garage-rotation-form] [name="rotationType"]')) {
    return;
  }

  const form = event.target.closest("[data-garage-rotation-form]");
  const manualFields = form?.querySelector("[data-manual-move-fields]");
  manualFields?.classList.toggle("is-hidden", event.target.value !== "manual");
}

function handleVehicleListClick(event) {
  const openTireRotationButton = event.target.closest("[data-open-tire-rotation]");
  if (openTireRotationButton) {
    isTireRotationPanelOpen = !isTireRotationPanelOpen;
    renderVehicles();
    if (isTireRotationPanelOpen) {
      vehicleList.querySelector(".tire-rotation-panel")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

  const tireTrackerToggle = event.target.closest("[data-toggle-tire-tracker]");
  if (tireTrackerToggle) {
    isTireTrackerExpanded = !isTireTrackerExpanded;
    persistUiState();
    renderVehicles();
    return;
  }

  if (event.target.closest("[data-add-vehicle]")) {
    resetVehicleFormMode();
    setActiveScreen("dashboard");
    setVehicleFormExpanded(true);
    vehicleForm.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const editVehicleButton = event.target.closest("[data-edit-vehicle]");
  if (editVehicleButton) {
    const vehicleId = editVehicleButton.dataset.editVehicle;
    const vehicle = state.vehicles.find((item) => item.id === vehicleId);
    if (!vehicle) {
      return;
    }

    loadVehicleIntoForm(vehicle);
    return;
  }

  const editRecordButton = event.target.closest("[data-edit-record]");
  if (editRecordButton) {
    const recordId = editRecordButton.dataset.editRecord;
    const record = state.records.find((item) => item.id === recordId);
    if (!record) {
      return;
    }

    loadRecordIntoForm(record);
    return;
  }

  const deleteRecordButton = event.target.closest("[data-delete-record]");
  if (deleteRecordButton) {
    const recordId = deleteRecordButton.dataset.deleteRecord;
    const record = state.records.find((item) => item.id === recordId);
    if (!record) {
      return;
    }

    const confirmed = window.confirm(
      `Delete ${record.serviceType} from ${formatDate(record.serviceDate)} at ${formatNumber(
        record.mileageAtService
      )} miles?`
    );

    if (!confirmed) {
      return;
    }

    state.records = state.records.filter((item) => item.id !== recordId);
    if (editingVisitRecordIds.includes(recordId)) {
      resetRecordFormMode();
    }
    persist();
    render();
    return;
  }

  const editTireButton = event.target.closest("[data-edit-tire]");
  if (editTireButton) {
    const vehicleId = editTireButton.dataset.vehicleId;
    const position = editTireButton.dataset.editTire;
    loadTireIntoForm(vehicleId, position);
    return;
  }

  const selectTireButton = event.target.closest("[data-select-tire]");
  if (selectTireButton) {
    activeGarageTirePosition = selectTireButton.dataset.selectTire;
    renderVehicles();
    return;
  }

  const viewTireHistoryButton = event.target.closest("[data-view-tire-history]");
  if (viewTireHistoryButton) {
    activeGarageTirePosition = viewTireHistoryButton.dataset.viewTireHistory;
    renderVehicles();
    const panel = vehicleList.querySelector(".tire-history-panel");
    panel?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const logTreadButton = event.target.closest("[data-log-tread]");
  if (logTreadButton) {
    const form = vehicleList.querySelector(`[data-garage-tread-form="${logTreadButton.dataset.logTread}"]`);
    form?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const rotateTiresButton = event.target.closest("[data-rotate-tires]");
  if (rotateTiresButton) {
    const form = vehicleList.querySelector(`[data-garage-rotation-form="${rotateTiresButton.dataset.rotateTires}"]`);
    form?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const replaceTireButton = event.target.closest("[data-replace-tire]");
  if (replaceTireButton) {
    loadTireIntoForm(replaceTireButton.dataset.vehicleId, replaceTireButton.dataset.replaceTire);
    return;
  }

  const saveReminderButton = event.target.closest("[data-save-reminder]");
  if (saveReminderButton) {
    const recordId = saveReminderButton.dataset.saveReminder;
    const record = state.records.find((item) => item.id === recordId);
    if (!record) {
      return;
    }

    const milesInput = vehicleList.querySelector(`[data-reminder-miles="${recordId}"]`);
    const monthsInput = vehicleList.querySelector(`[data-reminder-months="${recordId}"]`);
    record.repeatMiles = numericOrNull(milesInput?.value);
    record.repeatMonths = numericOrNull(monthsInput?.value);
    persist();
    render();
    return;
  }

  const deleteButton = event.target.closest("[data-delete-vehicle]");
  if (!deleteButton) {
    return;
  }

  const vehicleId = deleteButton.dataset.deleteVehicle;
  const vehicle = state.vehicles.find((item) => item.id === vehicleId);
  if (!vehicle) {
    return;
  }

  const confirmed = window.confirm(
    `Remove ${vehicle.year} ${vehicle.make} ${vehicle.model} from the garage? This also deletes its service history and tire records.`
  );

  if (!confirmed) {
    return;
  }

  state.vehicles = state.vehicles.filter((item) => item.id !== vehicleId);
  state.records = state.records.filter((record) => record.vehicleId !== vehicleId);
  persist();
  render();
}

async function handleVehicleListSubmit(event) {
  const treadForm = event.target.closest("[data-garage-tread-form]");
  if (treadForm) {
    event.preventDefault();
    const vehicle = state.vehicles.find((item) => item.id === getActiveAppVehicleId());
    if (!vehicle) {
      return;
    }

    const formData = new FormData(treadForm);
    const position = cleanText(formData.get("position"));
    const nextRating = parseTreadRatingInput(formData.get("treadDepth"));
    const tire = vehicle.tires?.[position];
    if (!tire || typeof nextRating !== "number") {
      return;
    }

    logTreadDepthEntry(tire, {
      depth: nextRating,
      mileage: vehicle.currentMileage,
      date: new Date().toISOString().slice(0, 10),
      notes: "Logged from garage tread form",
    });
    tire.updatedAt = new Date().toISOString();
    persist();
    renderVehicles();
    return;
  }

  const rotationForm = event.target.closest("[data-garage-rotation-form]");
  if (rotationForm) {
    event.preventDefault();
    const vehicle = state.vehicles.find((item) => item.id === getActiveAppVehicleId());
    if (!vehicle) {
      return;
    }

    const formData = new FormData(rotationForm);
    const rotationType = cleanText(formData.get("rotationType")) || "front-to-back";
    const notes = cleanText(formData.get("notes"));
    const mileage = vehicle.currentMileage;
    const date = new Date().toISOString().slice(0, 10);

    if (rotationType === "manual") {
      const fromPosition = cleanText(formData.get("fromPosition"));
      const toPosition = cleanText(formData.get("toPosition"));
      if (!fromPosition || !toPosition) {
        alert("Choose both a from and to position for a manual tire move.");
        return;
      }
      if (fromPosition === toPosition) {
        alert("Choose different positions for a manual tire move.");
        return;
      }
      if (!vehicle.tires?.[fromPosition]) {
        alert("No tire is saved at the selected from position.");
        return;
      }
      applyManualTireMove(vehicle, fromPosition, toPosition, { notes, mileage, date });
    } else {
      applyTireRotation(vehicle, { rotationType, notes, mileage, date });
    }
    state.records.unshift({
      id: crypto.randomUUID(),
      vehicleId: vehicle.id,
      serviceType: "Tire rotation",
      category: "Tires",
      serviceDate: date,
      mileageAtService: mileage,
      repeatMiles: DEFAULT_TIRE_ROTATION_MILES,
      repeatMonths: 6,
      cost: null,
      shop: "",
      notes: notes || `Rotation logged from Garage (${rotationType})`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    persist();
    render();
    return;
  }

  const documentForm = event.target.closest("[data-garage-document-form]");
  if (documentForm) {
    event.preventDefault();
    const vehicle = state.vehicles.find((item) => item.id === getActiveAppVehicleId());
    if (!vehicle) {
      return;
    }

    const formData = new FormData(documentForm);
    const file = formData.get("documentFile");
    if (!(file instanceof File) || !file.size) {
      return;
    }

    vehicle.documents = vehicle.documents || [];
    vehicle.documents.unshift({
      id: crypto.randomUUID(),
      documentType: cleanText(formData.get("documentType")),
      receiptName: file.name,
      receiptData: await readFileAsDataUrl(file),
      serviceDate: new Date().toISOString().slice(0, 10),
    });
    persist();
    renderVehicles();
  }
}

function handleTireEditSubmit(event) {
  event.preventDefault();
  const formData = new FormData(tireEditForm);
  const vehicleId = cleanText(formData.get("vehicleId"));
  const position = cleanText(formData.get("position"));
  const mode = cleanText(formData.get("mode")) || "edit";
  if (!vehicleId || !position) {
    return;
  }

  const vehicle = state.vehicles.find((item) => item.id === vehicleId);
  if (!vehicle) {
    return;
  }

  if (!vehicle.tires) {
    vehicle.tires = {};
  }

  const existingTire = vehicle.tires[position] ?? {};
  const treadInput = formData.get("treadDepth");
  const nextTreadDepth =
    treadInput === "" || treadInput === null ? null : parseTreadRatingInput(treadInput);
  const installMileage = numericOrNull(formData.get("installMileage"));
  const installDate = cleanText(formData.get("installDate"));
  const basePayload = {
    ...existingTire,
    id: existingTire.id ?? crypto.randomUUID(),
    tireId: existingTire.tireId ?? existingTire.id ?? crypto.randomUUID(),
    vehicleId,
    position,
    brand: cleanText(formData.get("brand")),
    model: cleanText(formData.get("model")),
    type: cleanText(formData.get("type")),
    size: cleanText(formData.get("size")),
    treadDepth: nextTreadDepth,
    currentTreadDepth: nextTreadDepth,
    startingTreadDepth:
      nextTreadDepth ?? normalizeTreadRating(existingTire.startingTreadDepth) ?? null,
    warrantyMiles: numericOrNull(formData.get("warrantyMiles")),
    estimatedReplacementMileage: numericOrNull(formData.get("estimatedReplacementMileage")),
    recommendedPressure: numericOrNull(formData.get("recommendedPressure")),
    installDate,
    installMileage,
    installer: cleanText(formData.get("installer")),
    notes: cleanText(formData.get("notes")),
    updatedAt: new Date().toISOString(),
  };

  if (mode === "replace" && existingTire?.id) {
    archiveReplacedTire(vehicle, position, existingTire, {
      date: basePayload.installDate,
      mileage: basePayload.installMileage,
      reason: cleanText(formData.get("replacementReason")),
      shop: cleanText(formData.get("installer")),
      cost: numericOrNull(formData.get("replacementCost")),
      notes: basePayload.notes,
    });
    vehicle.tires[position] = createReplacementTireRecord(basePayload);
  } else {
    const nextTire = normalizeTireRecord(
      {
        ...basePayload,
        treadHistory: Array.isArray(existingTire.treadHistory) ? existingTire.treadHistory : [],
        positionHistory: Array.isArray(existingTire.positionHistory) ? existingTire.positionHistory : undefined,
        rotationHistory: Array.isArray(existingTire.rotationHistory) ? existingTire.rotationHistory : [],
        replacementHistory: Array.isArray(existingTire.replacementHistory) ? existingTire.replacementHistory : [],
        status: "active",
      },
      vehicleId,
      position
    );
    if (typeof nextTreadDepth === "number") {
      logTreadDepthEntry(nextTire, {
        depth: nextTreadDepth,
        mileage: basePayload.installMileage ?? vehicle.currentMileage,
        date: basePayload.installDate || new Date().toISOString().slice(0, 10),
        notes: "Saved from tire editor",
      });
    }
    vehicle.tires[position] = nextTire;
  }

  activeGarageTirePosition = position;
  if (typeof vehicle.tires[position]?.installMileage === "number") {
    syncVehicleMileage(vehicleId, vehicle.tires[position].installMileage);
  }
  persist();
  resetTireEditMode();
  render();
}

async function handleRecordSubmit(event) {
  event.preventDefault();
  const formData = new FormData(recordForm);
  const vehicleId = getActiveAppVehicleId();
  const serviceTypes = getSelectedRecordServiceTypes();
  const serviceDate = formData.get("serviceDate");
  const serviceMileage = Number(formData.get("serviceMileage"));
  const shop = cleanText(formData.get("shop"));
  const cost = numericOrNull(formData.get("cost"));
  const notes = cleanText(formData.get("notes"));
  const submittedCategory = cleanText(formData.get("category"));
  const useManualCategory = recordForm.dataset.categoryManual === "true";
  const existingVisitRecords = editingVisitRecordIds.length
    ? state.records.filter((record) => editingVisitRecordIds.includes(record.id))
    : [];

  if (!serviceTypes.length) {
    alert("Select at least one service before saving.");
    return;
  }
  serviceTypes.forEach((serviceType) => registerCustomServiceType(serviceType));

  const receiptFile = formData.get("receipt");
  const receiptData = receiptFile instanceof File && receiptFile.size ? await readFileAsDataUrl(receiptFile) : null;
  const selectedTirePosition = cleanText(formData.get("recordTirePosition"));
  const selectedMultipleTirePositions =
    selectedTirePosition === "multiple"
      ? [...recordForm.querySelectorAll('input[name="recordTirePositions"]:checked')].map((input) => input.value)
      : [];
  const sharedTireDetails = serviceTypes.some((serviceType) => isTireRelatedService(serviceType))
    ? {
        brand: cleanText(formData.get("recordTireBrand")),
        model: cleanText(formData.get("recordTireModel")),
        type: cleanText(formData.get("recordTireType")),
        size: cleanText(formData.get("recordTireSize")),
        treadDepth: parseTreadRatingInput(formData.get("recordTireTreadDepth")),
        warrantyMiles: numericOrNull(formData.get("recordTireWarrantyMiles")),
        estimatedReplacementMileage: numericOrNull(formData.get("recordTireEstimatedReplacementMileage")),
        recommendedPressure: numericOrNull(formData.get("recordTireRecommendedPressure")),
        position: selectedTirePosition,
        positions: selectedMultipleTirePositions,
        notes: cleanText(formData.get("recordTireNotes")),
      }
    : null;

  const previousRecord = existingVisitRecords[0] ?? null;
  const receiptName = receiptFile instanceof File && receiptFile.size ? receiptFile.name : previousRecord?.receiptName ?? "";
  const nextRecords = serviceTypes.map((serviceType, index) => ({
    id: existingVisitRecords[index]?.id ?? crypto.randomUUID(),
    vehicleId,
    serviceType,
    category: useManualCategory ? submittedCategory || getServiceCategory(serviceType) : getAutoServiceCategory(serviceType),
    serviceDate,
    mileageAtService: serviceMileage,
    repeatMiles: numericOrNull(formData.get("repeatMiles")) ?? getExistingReminderValue(serviceType, "repeatMiles"),
    repeatMonths: numericOrNull(formData.get("repeatMonths")) ?? getExistingReminderValue(serviceType, "repeatMonths"),
    cost,
    shop,
    notes,
    tireDetails: isTireRelatedService(serviceType) ? sharedTireDetails : null,
    receiptName,
    receiptData: receiptData ?? previousRecord?.receiptData ?? "",
    createdAt: existingVisitRecords[index]?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  if (existingVisitRecords.length) {
    const editingRecordIds = new Set(editingVisitRecordIds);
    state.records = state.records.filter((record) => !editingRecordIds.has(record.id));
  }
  state.records.unshift(...nextRecords);
  syncRecurringPlansFromLoggedServices(vehicleId, nextRecords);

  syncVehicleMileage(vehicleId, serviceMileage);
  persist();
  resetRecordFormMode();
  renderServiceTypeOptions();
  render();
}

function handleHistoryListClick(event) {
  const editVisitButton = event.target.closest("[data-edit-visit]");
  if (editVisitButton) {
    const visitKey = cleanText(editVisitButton.dataset.editVisit);
    const visitRecords = getVisitRecordsByKey(visitKey);
    if (!visitRecords.length) {
      return;
    }

    loadVisitIntoForm(visitRecords);
    return;
  }

  const addToVisitButton = event.target.closest("[data-add-to-visit]");
  if (addToVisitButton) {
    const visitKey = cleanText(addToVisitButton.dataset.addToVisit);
    const visitRecords = getVisitRecordsByKey(visitKey);
    if (!visitRecords.length) {
      return;
    }

    loadVisitIntoNewForm(visitRecords[0]);
    return;
  }

  const deleteVisitButton = event.target.closest("[data-delete-visit]");
  if (deleteVisitButton) {
    const visitKey = cleanText(deleteVisitButton.dataset.deleteVisit);
    const visitRecords = getVisitRecordsByKey(visitKey);
    if (!visitRecords.length) {
      return;
    }

    const leadRecord = visitRecords[0];
    const confirmed = window.confirm(
      `Delete this visit from ${formatDate(leadRecord.serviceDate)} at ${formatNumber(
        leadRecord.mileageAtService
      )} miles${leadRecord.shop ? ` (${leadRecord.shop})` : ""}? This removes ${visitRecords.length} service entr${
        visitRecords.length === 1 ? "y" : "ies"
      }.`
    );

    if (!confirmed) {
      return;
    }

    const visitRecordIds = new Set(visitRecords.map((record) => record.id));
    state.records = state.records.filter((record) => !visitRecordIds.has(record.id));
    if (editingVisitRecordIds.some((recordId) => visitRecordIds.has(recordId))) {
      resetRecordFormMode();
    }
    persist();
    render();
    return;
  }

  const editButton = event.target.closest("[data-edit-record]");
  if (editButton) {
    const recordId = editButton.dataset.editRecord;
    const record = state.records.find((item) => item.id === recordId);
    if (!record) {
      return;
    }

    loadRecordIntoForm(record);
    return;
  }

  const deleteButton = event.target.closest("[data-delete-record]");
  if (!deleteButton) {
    return;
  }

  const recordId = deleteButton.dataset.deleteRecord;
  const record = state.records.find((item) => item.id === recordId);
  if (!record) {
    return;
  }

  const confirmed = window.confirm(
    `Delete ${record.serviceType} from ${formatDate(record.serviceDate)} at ${formatNumber(
      record.mileageAtService
    )} miles?`
  );

  if (!confirmed) {
    return;
  }

  state.records = state.records.filter((item) => item.id !== recordId);
  if (editingVisitRecordIds.includes(recordId)) {
    resetRecordFormMode();
  }
  persist();
  render();
}

function handleRecommendationGridClick(event) {
  const button = event.target.closest("[data-log-recommendation]");
  if (!button) {
    return;
  }

  resetRecordFormMode();
  const serviceType = cleanText(button.dataset.serviceType);
  const activeVehicleId = getActiveAppVehicleId();
  recordForm.elements.serviceType.value = serviceType;
  setRecordCategoryValue(getAutoServiceCategory(serviceType));
  syncRecordTireSection();

  if (activeVehicleId) {
    recordForm.elements.vehicleId.value = activeVehicleId;
  }

  setRecordFormExpanded(true);
  setActiveScreen("history");
  recordForm.scrollIntoView({ behavior: "smooth", block: "start" });
  recordForm.elements.serviceDate.focus();
}

function handleAddCustomService() {
  if (!customServiceInput || !addCustomServiceButton || !serviceNameManagerCategorySelect || !serviceNameManagerNotesInput) {
    return;
  }

  const serviceType = cleanText(customServiceInput.value);
  if (!serviceType) {
    return;
  }

  const category = cleanText(serviceNameManagerCategorySelect.value) || "Custom";
  const notes = cleanText(serviceNameManagerNotesInput.value);

  if (editingServiceDefinitionKey) {
    saveServiceDefinition(editingServiceDefinitionKey, { name: serviceType, category, notes });
  } else {
    createCustomServiceDefinition({ name: serviceType, category, notes });
  }
  persist();
  renderServiceTypeOptions();
  renderHistoryCategoryOptions();
  renderScheduleCategoryOptions();
  renderServiceChecklist();
  renderServiceNameManager();
  renderServiceNameManagerCategoryOptions();
  checkServiceType(serviceType);
  resetServiceNameManagerEditor();
}

function handleServiceNameManagerClick(event) {
  const hideButton = event.target.closest("[data-hide-service]");
  if (hideButton) {
    const serviceType = cleanText(hideButton.dataset.hideService);
    if (!serviceType) {
      return;
    }

    const hiddenSet = new Set(state.hiddenServiceTypes || []);
    if (hiddenSet.has(serviceType)) {
      hiddenSet.delete(serviceType);
    } else {
      hiddenSet.add(serviceType);
    }
    state.hiddenServiceTypes = [...hiddenSet].sort((a, b) => a.localeCompare(b));
    persist();
    renderServiceTypeOptions();
    renderRecordServiceChecklist();
    renderServiceNameManager();
    return;
  }

  const editButton = event.target.closest("[data-edit-custom-service]");
  if (editButton) {
    loadServiceDefinitionIntoManager(editButton.dataset.editCustomService);
    return;
  }

  const editServiceButton = event.target.closest("[data-edit-service-definition]");
  if (editServiceButton) {
    loadServiceDefinitionIntoManager(editServiceButton.dataset.editServiceDefinition);
    return;
  }

  const deleteButton = event.target.closest("[data-delete-custom-service]");
  if (!deleteButton) {
    return;
  }

  deleteCustomService(deleteButton.dataset.deleteCustomService);
}

function handleServiceNameManagerChange(event) {
  if (event.target.name !== "serviceNameEnabled") {
    return;
  }

  const serviceType = cleanText(event.target.value);
  if (!serviceType) {
    return;
  }

  const hiddenSet = new Set(state.hiddenServiceTypes || []);
  if (event.target.checked) {
    hiddenSet.delete(serviceType);
  } else {
    hiddenSet.add(serviceType);
  }

  state.hiddenServiceTypes = [...hiddenSet].sort((a, b) => a.localeCompare(b));
  persist();
  renderServiceTypeOptions();
  renderRecordServiceChecklist();
  renderServiceNameManager();
}

function handleServiceChecklistClick(event) {
  const removeButton = event.target.closest("[data-remove-selected-service]");
  if (removeButton) {
    const serviceType = removeButton.dataset.removeSelectedService;
    const checkbox = [...serviceChecklist.querySelectorAll('input[name="serviceTypes"]')].find(
      (input) => input.value === serviceType
    );
    if (checkbox) {
      checkbox.checked = false;
    }
    syncRecordTireSection();
    renderSelectedServices();
    renderServiceChecklist();
    return;
  }

  const editButton = event.target.closest("[data-edit-custom-service]");
  if (editButton) {
    loadServiceDefinitionIntoManager(editButton.dataset.editCustomService);
    return;
  }

  const deleteButton = event.target.closest("[data-delete-custom-service]");
  if (!deleteButton) {
    return;
  }

  deleteCustomService(deleteButton.dataset.deleteCustomService);
}

function handleSelectedServicesClick(event) {
  const editButton = event.target.closest("[data-edit-custom-service]");
  if (editButton) {
    loadServiceDefinitionIntoManager(editButton.dataset.editCustomService);
    return;
  }

  const deleteButton = event.target.closest("[data-delete-custom-service]");
  if (deleteButton) {
    deleteCustomService(deleteButton.dataset.deleteCustomService);
    return;
  }

  const removeButton = event.target.closest("[data-remove-selected-service]");
  if (!removeButton) {
    return;
  }

  const serviceType = removeButton.dataset.removeSelectedService;
  const checkbox = [...serviceChecklist.querySelectorAll('input[name="serviceTypes"]')].find(
    (input) => input.value === serviceType
  );
  if (checkbox) {
    checkbox.checked = false;
  }
  syncRecordTireSection();
  renderSelectedServices();
}

function readSelectedServices() {
  if (!serviceChecklist) {
    return [];
  }

  return [...serviceChecklist.querySelectorAll('input[name="serviceTypes"]:checked')].map((input) => ({
    serviceType: input.value,
  }));
}

function renderServiceChecklist() {
  if (!serviceChecklist) {
    return;
  }

  const selectedValues = new Set(
    [...serviceChecklist.querySelectorAll('input[name="serviceTypes"]:checked')].map((input) => input.value)
  );
  const options = [...new Set([...DEFAULT_SERVICE_TYPES, ...state.customServiceTypes])]
    .filter((type) => type !== "Custom service")
    .sort((a, b) => a.localeCompare(b));

  serviceChecklist.innerHTML = options
    .map(
      (type) => `
        <label class="check-card">
          <input type="checkbox" name="serviceTypes" value="${type}" ${selectedValues.has(type) ? "checked" : ""} />
          <span>${type}</span>
          <span class="check-card-actions">
            ${
              selectedValues.has(type)
                ? `${
                    isCustomService(type)
                      ? `<button class="button-secondary" type="button" data-edit-custom-service="${type}">Edit</button>
                         <button class="button-ghost" type="button" data-delete-custom-service="${type}">Delete</button>`
                      : ""
                  }
                  <button class="button-ghost" type="button" data-remove-selected-service="${type}">Remove</button>`
                : ""
            }
          </span>
        </label>
      `
    )
    .join("");

  renderSelectedServices();
}

function clearServiceChecks() {
  if (!serviceChecklist) {
    return;
  }

  serviceChecklist.querySelectorAll('input[name="serviceTypes"]').forEach((input) => {
    input.checked = false;
  });
  renderSelectedServices();
}

function checkServiceType(serviceType) {
  const normalized = cleanText(serviceType);
  if (!normalized) {
    return;
  }

  registerCustomServiceType(normalized);
  renderServiceTypeOptions();
  renderServiceChecklist();
  if (!serviceChecklist) {
    recordCustomServiceInput.value = normalized;
    renderRecordServiceChecklist();
    handleRecordServiceTypeChange();
    return;
  }

  const checkbox = [...serviceChecklist.querySelectorAll('input[name="serviceTypes"]')].find(
    (input) => input.value.toLowerCase() === normalized.toLowerCase()
  );
  if (checkbox) {
    checkbox.checked = true;
  }
  syncRecordTireSection();
  renderSelectedServices();
}

function checkServiceTypes(serviceTypes) {
  const normalizedServices = mergeUniqueText(
    [],
    serviceTypes.map((serviceType) => getCanonicalServiceType(serviceType)).filter(Boolean)
  );

  if (!serviceChecklist) {
    normalizedServices.forEach((serviceType) => registerCustomServiceType(serviceType));
    renderServiceTypeOptions();
    recordCustomServiceInput.value = "";
    renderRecordServiceChecklist();
    const selectedKeys = new Set(normalizedServices.map((serviceType) => serviceType.toLowerCase()));
    recordServiceChecklist?.querySelectorAll('input[name="recordServiceType"]').forEach((input) => {
      input.checked = selectedKeys.has(input.value.toLowerCase());
    });
    recordForm.elements.serviceType.value = normalizedServices[0] ?? "";
    syncRecordTireSection();
    renderHistoryQuickServiceChecklist();
    return;
  }

  clearServiceChecks();
  normalizedServices.forEach((serviceType) => registerCustomServiceType(serviceType));
  renderServiceTypeOptions();
  renderServiceChecklist();
  const selectedKeys = new Set(normalizedServices.map((serviceType) => serviceType.toLowerCase()));
  serviceChecklist.querySelectorAll('input[name="serviceTypes"]').forEach((input) => {
    input.checked = selectedKeys.has(input.value.toLowerCase());
  });
  syncRecordTireSection();
  renderSelectedServices();
}

function getVisitRecords(targetRecord) {
  return state.records.filter(
    (record) =>
      record.vehicleId === targetRecord.vehicleId &&
      record.serviceDate === targetRecord.serviceDate &&
      record.mileageAtService === targetRecord.mileageAtService &&
      cleanText(record.shop) === cleanText(targetRecord.shop)
  );
}

function getExistingReminderValue(serviceType, field) {
  const existingRecord = getLatestMatchingServiceRecord(serviceType);
  return existingRecord?.[field] ?? null;
}

function getLatestMatchingServiceRecord(serviceType) {
  const matchKeys = getServiceMatchKeys(serviceType);
  if (!matchKeys.length) {
    return null;
  }

  return [...state.records]
    .filter((record) => matchKeys.includes(normalizeServiceLookupKey(record.serviceType)))
    .sort(
      (a, b) => new Date(b.serviceDate) - new Date(a.serviceDate) || b.mileageAtService - a.mileageAtService
    )[0] ?? null;
}

function getLatestTrackedRecords(records = state.records) {
  const latestByServiceKey = new Map();

  [...records]
    .sort((a, b) => new Date(b.serviceDate) - new Date(a.serviceDate) || b.mileageAtService - a.mileageAtService)
    .forEach((record) => {
      const serviceKey = `${record.vehicleId}::${normalizeServiceLookupKey(record.serviceType)}`;
      if (!latestByServiceKey.has(serviceKey)) {
        latestByServiceKey.set(serviceKey, record);
      }
    });

  return [...latestByServiceKey.values()];
}

function renderSelectedServices() {
  if (!selectedServicesList) {
    return;
  }

  const selectedServices = readSelectedServices().map((entry) => entry.serviceType);
  selectedServicesList.innerHTML = selectedServices.length
    ? selectedServices
        .map(
          (serviceType) => `
            <div class="selected-service-item">
              <strong>${serviceType}</strong>
              <div class="selected-service-actions">
                ${
                  isCustomService(serviceType)
                    ? `<button class="button-secondary" type="button" data-edit-custom-service="${serviceType}">Edit</button>
                       <button class="button-ghost" type="button" data-delete-custom-service="${serviceType}">Delete</button>`
                    : ""
                }
                <button class="button-ghost" type="button" data-remove-selected-service="${serviceType}">
                  Remove
                </button>
              </div>
            </div>
          `
        )
        .join("")
    : `<p>No services selected yet.</p>`;
}

function isCustomService(serviceType) {
  return Boolean(getServiceDefinition(serviceType)?.isCustom);
}

function renameCustomService(previousName, nextName) {
  const serviceDefinition = getServiceDefinition(previousName);
  if (!serviceDefinition) {
    return;
  }
  saveServiceDefinition(getServiceDefinitionKey(serviceDefinition), {
    name: nextName,
    category: serviceDefinition.category,
    notes: serviceDefinition.notes,
  });
}

function deleteCustomService(serviceType) {
  const normalized = cleanText(serviceType);
  if (!normalized) {
    return;
  }

  const serviceDefinition = getServiceDefinition(normalized);
  if (!serviceDefinition?.isCustom) {
    return;
  }

  state.serviceDefinitions = (state.serviceDefinitions || []).filter(
    (item) => item.id !== serviceDefinition.id
  );
  state.customServiceTypes = state.customServiceTypes.filter(
    (customType) => customType.toLowerCase() !== normalized.toLowerCase()
  );
  if (serviceChecklist) {
    const checkbox = [...serviceChecklist.querySelectorAll('input[name="serviceTypes"]')].find(
      (input) => input.value.toLowerCase() === normalized.toLowerCase()
    );
    if (checkbox) {
      checkbox.checked = false;
    }
  }
  if (editingCustomServiceName && editingCustomServiceName.toLowerCase() === normalized.toLowerCase()) {
    editingCustomServiceName = null;
  }
  if (editingServiceDefinitionKey === serviceDefinition.id) {
    resetServiceNameManagerEditor();
  }
  state.hiddenServiceTypes = (state.hiddenServiceTypes || []).filter(
    (serviceType) => cleanText(serviceType).toLowerCase() !== normalized.toLowerCase()
  );
  persist();
  renderServiceTypeOptions();
  renderHistoryCategoryOptions();
  renderScheduleCategoryOptions();
  renderServiceChecklist();
  renderServiceNameManager();
  renderServiceNameManagerCategoryOptions();
  syncRecordTireSection();
}

function render() {
  repairOrphanedVehicleLinks();
  repairCanonicalServiceNames();
  renderVehicleSelects();
  renderHistoryCategoryOptions();
  renderScheduleCategoryOptions();
  renderServiceNameManager();
  renderServiceNameManagerCategoryOptions();
  renderDashboard();
  renderServiceSchedule();
  renderVehicles();
  renderHistory();
}

function getServiceMatchKeys(serviceType) {
  const canonicalName = getCanonicalServiceType(serviceType);
  if (!canonicalName) {
    return [];
  }

  const template = getRecurringTemplateByName(canonicalName);
  return [canonicalName]
    .concat(template?.serviceName ? [template.serviceName] : [])
    .concat(template?.aliases ?? [])
    .map((value) => normalizeServiceLookupKey(value))
    .filter(Boolean);
}

function renderVehicleSelects() {
  const currentRecordVehicleId = recordVehicleSelect.value;
  const currentDashboardVehicleId = activeDashboardVehicleId || dashboardVehicleSelect.value;
  const currentGarageVehicleId = activeGarageVehicleId || garageVehicleSelect.value;
  const currentScheduleVehicleId = scheduleVehicleSelect.value;
  const currentScheduleFormVehicleId = schedulePlanForm.elements.vehicleId.value;
  const fallbackVehicleId = state.vehicles[0]?.id ?? "";
  const options = state.vehicles.length
    ? state.vehicles
        .map(
          (vehicle) =>
            `<option value="${vehicle.id}">${vehicle.year} ${vehicle.make} ${vehicle.model}${
              vehicle.trim ? ` ${vehicle.trim}` : ""
            }</option>`
        )
        .join("")
    : `<option value="">Add a vehicle first</option>`;

  recordVehicleSelect.innerHTML = options;
  dashboardVehicleSelect.innerHTML = options;
  garageVehicleSelect.innerHTML = options;
  scheduleVehicleSelect.innerHTML = options;
  schedulePlanForm.elements.vehicleId.innerHTML = options;
  if (historyVehicleFilter) {
    historyVehicleFilter.innerHTML = options;
  }

  const disabled = !state.vehicles.length;
  const sharedVehicleId = state.vehicles.some((vehicle) => vehicle.id === currentDashboardVehicleId)
    ? currentDashboardVehicleId
    : state.vehicles.some((vehicle) => vehicle.id === currentGarageVehicleId)
      ? currentGarageVehicleId
      : state.vehicles.some((vehicle) => vehicle.id === currentScheduleVehicleId)
        ? currentScheduleVehicleId
        : fallbackVehicleId;
  recordVehicleSelect.disabled = disabled;
  dashboardVehicleSelect.disabled = disabled;
  garageVehicleSelect.disabled = true;
  scheduleVehicleSelect.disabled = true;
  schedulePlanForm.elements.vehicleId.disabled = true;
  recordForm.querySelector('button[type="submit"]').disabled = disabled;

  recordVehicleSelect.value = state.vehicles.some((vehicle) => vehicle.id === currentRecordVehicleId)
    ? currentRecordVehicleId
    : sharedVehicleId;
  dashboardVehicleSelect.value = sharedVehicleId;
  garageVehicleSelect.value = sharedVehicleId;
  scheduleVehicleSelect.value = sharedVehicleId;
  schedulePlanForm.elements.vehicleId.value = state.vehicles.some((vehicle) => vehicle.id === currentScheduleFormVehicleId)
    ? currentScheduleFormVehicleId
    : sharedVehicleId;
  syncActiveVehicle(sharedVehicleId);
}

function syncActiveVehicle(vehicleId) {
  const nextVehicleId = state.vehicles.some((vehicle) => vehicle.id === vehicleId) ? vehicleId : state.vehicles[0]?.id ?? "";
  activeDashboardVehicleId = nextVehicleId;
  activeGarageVehicleId = nextVehicleId;

  if (dashboardVehicleSelect) {
    dashboardVehicleSelect.value = nextVehicleId;
  }
  if (garageVehicleSelect) {
    garageVehicleSelect.value = nextVehicleId;
  }
  if (scheduleVehicleSelect) {
    scheduleVehicleSelect.value = nextVehicleId;
  }
  if (historyVehicleFilter) {
    historyVehicleFilter.value = nextVehicleId;
  }

  syncHistoryToActiveVehicle();
}

function renderScheduleCategoryOptions() {
  const selectedValue = scheduleCategoryFilter.value || "all";
  const categories = [...new Set(getAllServiceDefinitions().map((serviceDefinition) => serviceDefinition.category).concat("Custom"))];
  scheduleCategoryFilter.innerHTML = [`<option value="all">All categories</option>`]
    .concat(categories.map((category) => `<option value="${category}">${category}</option>`))
    .join("");
  schedulePlanForm.elements.category.innerHTML = categories
    .map((category) => `<option value="${category}">${category}</option>`)
    .join("");
  scheduleCategoryFilter.value = categories.includes(selectedValue) || selectedValue === "all" ? selectedValue : "all";
}

function renderHistoryCategoryOptions() {
  const categories = [...new Set(getAllServiceDefinitions().map((serviceDefinition) => serviceDefinition.category).concat("Custom"))];
  if (recordCategorySelect) {
    recordCategorySelect.innerHTML = categories.map((category) => `<option value="${category}">${category}</option>`).join("");
  }
  if (historyCategoryFilter) {
    const selectedValue = historyCategoryFilter.value || "all";
    historyCategoryFilter.innerHTML = [`<option value="all">All categories</option>`]
      .concat(categories.map((category) => `<option value="${category}">${category}</option>`))
      .join("");
    historyCategoryFilter.value = categories.includes(selectedValue) || selectedValue === "all" ? selectedValue : "all";
  }
}

function getHistoryQuickPreferredServices() {
  return [
    "Oil change",
    "Tire rotation",
    "Brake inspection",
    "Vehicle inspection",
    "Tire pressure check",
    "Air filter replacement",
    "Cabin air filter replacement",
    "Brake pads",
    "Battery replacement",
    "Alignment",
    "Coolant flush",
    "Transmission fluid",
    "Spark plugs",
    "Wiper blades",
    "Engine diagnostic",
  ];
}

function getHistoryQuickServiceSuggestions() {
  return mergeUniqueText(getHistoryQuickPreferredServices(), getAvailableServiceTypes());
}

function getHistoryQuickServiceMatches(query) {
  const normalizedQuery = cleanText(query).toLowerCase();
  const suggestions = getHistoryQuickServiceSuggestions();
  if (!normalizedQuery) {
    const preferredSet = new Set(getHistoryQuickPreferredServices().map((serviceType) => serviceType.toLowerCase()));
    return suggestions.filter((serviceType) => preferredSet.has(serviceType.toLowerCase())).slice(0, 15);
  }

  return suggestions
    .filter((serviceType) => serviceType.toLowerCase().includes(normalizedQuery))
    .sort((a, b) => a.localeCompare(b))
    .slice(0, 12);
}

function renderHistoryQuickServiceChecklist() {
  if (!historyQuickServiceChecklist) {
    return;
  }

  const query = cleanText(historyQuickServiceSearchInput?.value);
  const selectedService = cleanText(recordForm?.elements?.serviceType?.value);
  const matches = getHistoryQuickServiceMatches(query);
  const hasExactMatch = matches.some((serviceType) => serviceType.toLowerCase() === query.toLowerCase());
  const options = mergeUniqueText(matches, query && !hasExactMatch ? [query] : []);

  historyQuickServiceChecklist.innerHTML = options.length
    ? options
        .map((serviceType) => {
          const isCustom = query && serviceType.toLowerCase() === query.toLowerCase() && !hasExactMatch;
          const isSelected = selectedService.toLowerCase() === serviceType.toLowerCase();
          return `
            <button class="quick-service-option ${isSelected ? "is-active" : ""}" type="button" data-quick-service="${serviceType}">
              <strong>${isCustom ? `Use "${serviceType}"` : serviceType}</strong>
              <span class="meta">${isCustom ? "Custom service" : getAutoServiceCategory(serviceType)}</span>
            </button>
          `;
        })
        .join("")
    : `<p class="muted">No matches. Type a service name and press Enter to use it.</p>`;
}

function renderRecordServiceChecklist() {
  if (!recordServiceChecklist) {
    return;
  }

  const searchValue = cleanText(recordServiceSearchInput?.value).toLowerCase();
  const selectedServices = new Set(getSelectedRecordServiceTypes().map((serviceType) => serviceType.toLowerCase()));
  const commonServices = getAvailableServiceTypes()
    .filter((serviceType) => {
      if (!searchValue) {
        return true;
      }
      const normalized = serviceType.toLowerCase();
      return normalized.includes(searchValue) || selectedServices.has(normalized);
    })
    .sort((a, b) => a.localeCompare(b));

  recordServiceChecklist.innerHTML = commonServices
    .map(
      (serviceType) => `
        <label class="check-card">
          <input
            type="checkbox"
            name="recordServiceType"
            value="${serviceType}"
            ${selectedServices.has(serviceType.toLowerCase()) ? "checked" : ""}
          />
          <span>${serviceType}</span>
        </label>
      `
    )
    .join("");
}

function getSelectedRecordServiceTypes() {
  const checklistServices = recordServiceChecklist
    ? [...recordServiceChecklist.querySelectorAll('input[name="recordServiceType"]:checked')].map((input) => cleanText(input.value))
    : [];
  const customService = cleanText(recordCustomServiceInput?.value);
  return mergeUniqueText(checklistServices, customService ? [customService] : []).map((serviceType) => getCanonicalServiceType(serviceType));
}

function renderServiceNameManager() {
  if (!serviceNameManagerList) {
    return;
  }

  const searchValue = cleanText(serviceNameManagerSearchInput?.value).toLowerCase();
  const allServices = getAllServiceDefinitions()
    .filter((serviceDefinition) => !searchValue || serviceDefinition.name.toLowerCase().includes(searchValue))
    .sort((a, b) => a.name.localeCompare(b.name));

  serviceNameManagerList.innerHTML = allServices.length
    ? allServices
        .map(
          (serviceDefinition) => {
            const isHidden = (state.hiddenServiceTypes || []).includes(serviceDefinition.name);
            return `
            <div class="check-card service-name-card ${isHidden ? "is-removed" : ""}">
              <input
                type="checkbox"
                name="serviceNameEnabled"
                value="${serviceDefinition.name}"
                ${!isHidden ? "checked" : ""}
              />
              <span>
                ${serviceDefinition.name}
                <span class="meta">${serviceDefinition.category} • ${serviceDefinition.isCustom ? "Custom service" : "Built-in service"}</span>
                <span class="meta">${isHidden ? "Removed from the Maintenance Log picker" : "Available in the Maintenance Log picker"}</span>
                <span class="meta">${serviceDefinition.notes || "No notes saved"}</span>
              </span>
              <span class="check-card-actions">
                <button class="button-secondary" type="button" data-edit-service-definition="${getServiceDefinitionKey(serviceDefinition)}">Edit</button>
                ${
                  serviceDefinition.isCustom
                    ? `<button class="button-ghost" type="button" data-delete-custom-service="${serviceDefinition.name}">Delete</button>`
                    : ""
                }
                <button class="button-ghost button-ghost-neutral" type="button" data-hide-service="${serviceDefinition.name}">${isHidden ? "Restore" : "Remove"}</button>
              </span>
            </div>
          `;
          }
        )
        .join("")
    : `<p class="muted">No services match the current search.</p>`;
}

function getAllServiceTypes() {
  return getAllServiceDefinitions().map((serviceDefinition) => serviceDefinition.name);
}

function getAvailableServiceTypes() {
  const hiddenSet = new Set(state.hiddenServiceTypes || []);
  return getAllServiceDefinitions()
    .map((serviceDefinition) => serviceDefinition.name)
    .filter((serviceType) => !hiddenSet.has(serviceType));
}

function getDefaultServiceDefinitions() {
  return SERVICE_LIBRARY.flatMap((section) =>
    section.services.map((service) => {
      const template = findRecurringTemplateByRawName(service.name);
      return {
        id: `builtin:${normalizeServiceLookupKey(service.name)}`,
        name: service.name,
        baseName: service.name,
        category: service.category,
        notes: template?.description || "",
        aliases: service.aliases ?? [],
        isCustom: false,
      };
    })
  );
}

function getAllServiceDefinitions() {
  const definitions = Array.isArray(state.serviceDefinitions) ? state.serviceDefinitions : [];
  const defaults = getDefaultServiceDefinitions().map((defaultDefinition) => {
    const override = definitions.find(
      (serviceDefinition) =>
        serviceDefinition.baseName &&
        normalizeServiceLookupKey(serviceDefinition.baseName) === normalizeServiceLookupKey(defaultDefinition.baseName)
    );
    return override
      ? {
          ...defaultDefinition,
          ...override,
          id: override.id || defaultDefinition.id,
          baseName: defaultDefinition.baseName,
          isCustom: false,
          aliases: mergeUniqueText(
            [defaultDefinition.baseName, ...(defaultDefinition.aliases || [])],
            [override.name, ...(override.aliases || [])]
          ),
        }
      : defaultDefinition;
  });

  const customs = definitions
    .filter((serviceDefinition) => !serviceDefinition.baseName)
    .map((serviceDefinition) => ({
      id: serviceDefinition.id || `custom:${normalizeServiceLookupKey(serviceDefinition.name)}`,
      name: cleanText(serviceDefinition.name),
      baseName: "",
      category: cleanText(serviceDefinition.category) || "Custom",
      notes: cleanText(serviceDefinition.notes),
      aliases: Array.isArray(serviceDefinition.aliases) ? serviceDefinition.aliases : [],
      isCustom: true,
    }))
    .filter((serviceDefinition) => serviceDefinition.name);

  const legacyCustoms = (state.customServiceTypes || [])
    .filter(
      (serviceType) =>
        !customs.some((serviceDefinition) => normalizeServiceLookupKey(serviceDefinition.name) === normalizeServiceLookupKey(serviceType))
    )
    .map((serviceType) => ({
      id: `legacy-custom:${normalizeServiceLookupKey(serviceType)}`,
      name: cleanText(serviceType),
      baseName: "",
      category: "Custom",
      notes: "",
      aliases: [],
      isCustom: true,
    }))
    .filter((serviceDefinition) => serviceDefinition.name);

  return [...defaults, ...customs, ...legacyCustoms];
}

function getServiceDefinition(serviceName) {
  const normalizedName = normalizeServiceLookupKey(serviceName);
  if (!normalizedName) {
    return null;
  }

  return (
    getAllServiceDefinitions().find((serviceDefinition) =>
      [serviceDefinition.name, serviceDefinition.baseName, ...(serviceDefinition.aliases || [])]
        .filter(Boolean)
        .some((value) => normalizeServiceLookupKey(value) === normalizedName)
    ) ?? null
  );
}

function getServiceDefinitionKey(serviceDefinition) {
  return serviceDefinition.isCustom ? serviceDefinition.id : serviceDefinition.baseName;
}

function getServiceCategories() {
  return [...new Set(RECURRING_SERVICE_TEMPLATES.map((template) => template.category).concat("Custom"))];
}

function renderServiceNameManagerCategoryOptions() {
  if (!serviceNameManagerCategorySelect) {
    return;
  }

  const selectedValue = serviceNameManagerCategorySelect.value || "Custom";
  const categories = getServiceCategories();
  serviceNameManagerCategorySelect.innerHTML = categories
    .map((category) => `<option value="${category}">${category}</option>`)
    .join("");
  serviceNameManagerCategorySelect.value = categories.includes(selectedValue) ? selectedValue : "Custom";
}

function loadServiceDefinitionIntoManager(serviceDefinitionKey) {
  const serviceDefinition = getAllServiceDefinitions().find(
    (item) => getServiceDefinitionKey(item) === cleanText(serviceDefinitionKey)
  );
  if (!serviceDefinition || !customServiceInput || !serviceNameManagerCategorySelect || !serviceNameManagerNotesInput) {
    return;
  }

  editingServiceDefinitionKey = getServiceDefinitionKey(serviceDefinition);
  customServiceInput.value = serviceDefinition.name;
  serviceNameManagerCategorySelect.value = serviceDefinition.category || "Custom";
  serviceNameManagerNotesInput.value = serviceDefinition.notes || "";
  addCustomServiceButton.textContent = "Save service";
  serviceNameManagerCancelButton?.classList.remove("is-hidden");
  customServiceInput.focus();
}

function resetServiceNameManagerEditor() {
  editingServiceDefinitionKey = null;
  editingCustomServiceName = null;
  if (customServiceInput) {
    customServiceInput.value = "";
  }
  if (serviceNameManagerCategorySelect) {
    serviceNameManagerCategorySelect.value = "Custom";
  }
  if (serviceNameManagerNotesInput) {
    serviceNameManagerNotesInput.value = "";
  }
  if (addCustomServiceButton) {
    addCustomServiceButton.textContent = "Add service";
  }
  serviceNameManagerCancelButton?.classList.add("is-hidden");
}

function createCustomServiceDefinition({ name, category, notes }) {
  const canonicalName = cleanText(name);
  if (!canonicalName) {
    return;
  }

  const existingDefinition = getServiceDefinition(canonicalName);
  if (existingDefinition) {
    saveServiceDefinition(getServiceDefinitionKey(existingDefinition), { name: canonicalName, category, notes });
    return;
  }

  const nextDefinition = {
    id: crypto.randomUUID(),
    name: canonicalName,
    baseName: "",
    category: cleanText(category) || "Custom",
    notes: cleanText(notes),
    aliases: [],
  };
  state.serviceDefinitions = [...(state.serviceDefinitions || []), nextDefinition];
  state.customServiceTypes = mergeUniqueText(state.customServiceTypes, [canonicalName]);
}

function saveServiceDefinition(serviceDefinitionKey, updates) {
  const serviceDefinition = getAllServiceDefinitions().find(
    (item) => getServiceDefinitionKey(item) === cleanText(serviceDefinitionKey)
  );
  if (!serviceDefinition) {
    return;
  }

  const nextName = cleanText(updates.name);
  if (!nextName) {
    return;
  }

  const nextCategory = cleanText(updates.category) || serviceDefinition.category || "Custom";
  const nextNotes = cleanText(updates.notes);
  const previousNames = mergeUniqueText(
    [serviceDefinition.name, serviceDefinition.baseName, ...(serviceDefinition.aliases || [])].filter(Boolean),
    []
  );

  if (serviceDefinition.isCustom) {
    state.serviceDefinitions = (state.serviceDefinitions || []).map((item) =>
      item.id === serviceDefinition.id
        ? {
            ...item,
            name: nextName,
            category: nextCategory,
            notes: nextNotes,
            aliases: mergeUniqueText(item.aliases || [], previousNames),
          }
        : item
    );
    state.customServiceTypes = state.customServiceTypes.map((serviceType) =>
      cleanText(serviceType).toLowerCase() === cleanText(serviceDefinition.name).toLowerCase() ? nextName : serviceType
    );
  } else {
    const overrideIndex = (state.serviceDefinitions || []).findIndex(
      (item) => item.baseName && normalizeServiceLookupKey(item.baseName) === normalizeServiceLookupKey(serviceDefinition.baseName)
    );
    const nextOverride = {
      id: overrideIndex >= 0 ? state.serviceDefinitions[overrideIndex].id : crypto.randomUUID(),
      baseName: serviceDefinition.baseName,
      name: nextName,
      category: nextCategory,
      notes: nextNotes,
      aliases: mergeUniqueText(
        state.serviceDefinitions[overrideIndex]?.aliases || [],
        previousNames
      ),
    };
    if (overrideIndex >= 0) {
      state.serviceDefinitions[overrideIndex] = nextOverride;
    } else {
      state.serviceDefinitions = [...(state.serviceDefinitions || []), nextOverride];
    }
  }

  state.records = state.records.map((record) => {
    if (normalizeServiceLookupKey(record.serviceType) === normalizeServiceLookupKey(serviceDefinition.name)) {
      return { ...record, serviceType: nextName, category: nextCategory };
    }
    const serviceKeys = getServiceMatchKeys(record.serviceType);
    if (serviceKeys.includes(normalizeServiceLookupKey(serviceDefinition.name))) {
      return { ...record, serviceType: nextName, category: nextCategory };
    }
    return record;
  });

  state.hiddenServiceTypes = (state.hiddenServiceTypes || []).map((serviceType) =>
    cleanText(serviceType).toLowerCase() === cleanText(serviceDefinition.name).toLowerCase() ? nextName : serviceType
  );
}

function renderDashboard() {
  const vehicle = state.vehicles.find((item) => item.id === activeDashboardVehicleId) ?? state.vehicles[0] ?? null;
  activeDashboardVehicleId = vehicle?.id ?? "";

  if (!vehicle) {
    dashboardVehicleList.innerHTML = `<p>Add a vehicle to start using the dashboard.</p>`;
    dashboardMaintenanceStats.innerHTML = `<p>No overdue or due soon services.</p>`;
    dashboardCostStats.innerHTML = `<p>No cost data yet.</p>`;
    dashboardRecentUpdates.innerHTML = `<p>No recent services yet.</p>`;
    dashboardHealthByCategory.innerHTML = "";
    dashboardMaintenanceTimeline.innerHTML = `<p>No mileage data yet.</p>`;
    return;
  }

  const vehicleRecords = state.records
    .filter((record) => record.vehicleId === vehicle.id)
    .sort((a, b) => new Date(b.serviceDate) - new Date(a.serviceDate) || b.mileageAtService - a.mileageAtService);
  const recurringSummaries = getDisplayRecurringPlans(vehicle.id)
    .map((plan) => buildRecurringPlanSummary(plan, vehicle))
    .filter(Boolean)
    .sort(sortRecurringPlanSummaries);
  const costMetrics = buildDashboardCostMetrics(vehicle, vehicleRecords);
  const healthMetrics = buildDashboardHealthMetrics(recurringSummaries);
  const batteryScore = buildGarageBatteryScore(vehicleRecords);
  const recentServices = vehicleRecords.slice(0, 5);
  const statusItems = recurringSummaries
    .filter((item) => item.status === "due" || item.status === "upcoming")
    .sort(sortByUrgency);

  dashboardVehicleList.innerHTML = `
    <article class="vehicle-card">
      <div class="vehicle-header">
        <div>
          <h3>${vehicle.trim ? `${vehicle.make} ${vehicle.model} ${vehicle.trim}` : `${vehicle.make} ${vehicle.model}`}</h3>
          <span class="meta">${vehicle.year} / ${vehicle.make} / ${vehicle.model}</span>
        </div>
        <button class="button-secondary" type="button" data-edit-vehicle="${vehicle.id}">
          Edit vehicle
        </button>
      </div>
      <div class="schedule-meta-grid">
        <span class="meta">Current mileage: ${formatNumber(vehicle.currentMileage)} miles</span>
        <span class="meta">Vehicle name: ${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ""}</span>
        <span class="meta">VIN: ${vehicle.vin || "Not saved"}</span>
        <span class="meta">Vehicle notes: ${vehicle.notes || "No notes yet"}</span>
      </div>
    </article>
  `;

  dashboardMaintenanceTimeline.innerHTML = metricCardMarkup("Current Mileage", `${formatNumber(vehicle.currentMileage)} miles`);

  dashboardMaintenanceStats.innerHTML = statusItems.length
    ? statusItems
        .slice(0, 6)
        .map(
          (item) => `
            <div class="timeline-item">
              <div class="vehicle-summary">
                <strong>${item.serviceName || item.serviceType}</strong>
                ${statusPill(item.status, item.status === "due" ? "Overdue" : "Due Soon")}
              </div>
              <span class="meta">${formatNextServiceDueLine(item)}</span>
            </div>
          `
        )
        .join("")
    : `<p>No overdue or due soon services.</p>`;

  dashboardRecentUpdates.innerHTML = recentServices.length
    ? recentServices
        .map(
          (record) => `
            <div class="timeline-item">
              <strong>${record.serviceType}</strong>
              <span class="meta">${formatDate(record.serviceDate)}</span>
              <span class="meta">${record.shop ? `Shop: ${record.shop}` : "No shop saved"}</span>
            </div>
          `
        )
        .join("")
    : `<p>No recent services yet.</p>`;

  dashboardCostStats.innerHTML = [
    metricCardMarkup("Total Maintenance Spent", formatCurrency(costMetrics.total)),
    metricCardMarkup("Monthly Spending", formatCurrency(costMetrics.monthly)),
    metricCardMarkup("Cost Per Mile", costMetrics.costPerMile > 0 ? formatCurrency(costMetrics.costPerMile) : "$0.00"),
  ].join("");

  dashboardHealthByCategory.innerHTML = Object.entries({ ...healthMetrics.byCategory, Battery: batteryScore })
    .map(
      ([category, score]) => `
        <div class="timeline-item">
          <div class="vehicle-summary">
            <strong>${category}</strong>
            ${statusPill(score >= 85 ? "ok" : score >= 60 ? "upcoming" : "due", `${score}%`)}
          </div>
          <div class="progress-track" aria-hidden="true">
            <div class="progress-fill" style="width: ${score}%"></div>
          </div>
        </div>
      `
    )
    .join("");
}

function metricCardMarkup(label, value) {
  return `
    <article class="widget">
      <span>${label}</span>
      <strong>${value}</strong>
    </article>
  `;
}

function nextServiceDueWidgetMarkup(item) {
  if (!item) {
    return metricCardMarkup("Next Service Due", "None");
  }

  return `
    <article class="widget">
      <span>Next Service Due</span>
      <strong>${item.serviceName}</strong>
      <span>${formatNextServiceDueLine(item)}</span>
    </article>
  `;
}

function formatNextServiceDueLine(item) {
  if (item.status === "due") {
    if (typeof item.milesRemaining === "number" && item.milesRemaining <= 0) {
      return `Overdue by ${formatNumber(Math.abs(item.milesRemaining))} miles`;
    }
    if (typeof item.daysRemaining === "number" && item.daysRemaining <= 0) {
      return `Overdue by ${Math.abs(item.daysRemaining)} days`;
    }
    return "Overdue now";
  }

  if (typeof item.milesRemaining === "number") {
    return `Due in ${formatNumber(Math.max(item.milesRemaining, 0))} miles`;
  }

  if (typeof item.daysRemaining === "number") {
    return `Due in ${Math.max(item.daysRemaining, 0)} days`;
  }

  if (item.nextDueDate) {
    return `Due on ${formatDate(item.nextDueDate)}`;
  }

  if (item.nextDueMileage) {
    return `Due at ${formatNumber(item.nextDueMileage)} miles`;
  }

  return "No due target set";
}

function buildDashboardCostMetrics(vehicle, records) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const total = roundCurrency(records.reduce((sum, record) => sum + (record.cost || 0), 0));
  const monthly = roundCurrency(
    records.reduce((sum, record) => {
      const serviceDate = new Date(record.serviceDate);
      if (serviceDate.getFullYear() === currentYear && serviceDate.getMonth() === currentMonth) {
        return sum + (record.cost || 0);
      }
      return sum;
    }, 0)
  );
  const yearly = roundCurrency(
    records.reduce((sum, record) => {
      const serviceDate = new Date(record.serviceDate);
      return serviceDate.getFullYear() === currentYear ? sum + (record.cost || 0) : sum;
    }, 0)
  );
  const earliestMileage = records.length ? Math.min(...records.map((record) => record.mileageAtService)) : vehicle.currentMileage;
  const trackedMiles = Math.max(vehicle.currentMileage - earliestMileage, 0);
  const costByCategoryMap = new Map();

  records.forEach((record) => {
    const category = getServiceCategory(record.serviceType);
    costByCategoryMap.set(category, roundCurrency((costByCategoryMap.get(category) || 0) + (record.cost || 0)));
  });

  return {
    total,
    monthly,
    yearly,
    costPerMile: trackedMiles > 0 ? roundCurrency(total / trackedMiles) : 0,
    costByCategory: [...costByCategoryMap.entries()]
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount),
  };
}

function buildDashboardRecentUpdates(vehicle, records) {
  const tireUpdates = TIRE_POSITIONS.map((position) => vehicle.tires?.[position.key])
    .filter(Boolean)
    .map((tire) => ({
      dateValue: new Date(tire.updatedAt || tire.installDate || 0).getTime(),
      dateLabel: tire.updatedAt ? formatDate(tire.updatedAt) : formatDate(tire.installDate),
      title: `${TIRE_POSITIONS.find((position) => position.key === tire.position)?.label || tire.position} tire updated`,
      detail: `${tire.brand} ${tire.model} • ${tire.size || "Size not saved"}`,
    }));
  const serviceUpdates = records.slice(0, 6).map((record) => ({
    dateValue: new Date(record.serviceDate).getTime(),
    dateLabel: formatDate(record.serviceDate),
    title: record.serviceType,
    detail: `${formatNumber(record.mileageAtService)} miles${record.shop ? ` • ${record.shop}` : ""}`,
  }));

  return [...serviceUpdates, ...tireUpdates].sort((a, b) => b.dateValue - a.dateValue).slice(0, 6);
}

function buildDashboardMaintenanceTimeline(records) {
  return records
    .slice(0, 6)
    .map((record) => ({
      ...record,
      category: record.category || getServiceCategory(record.serviceType),
      dateLabel: formatDate(record.serviceDate),
    }));
}

function buildDashboardMiniTireStatusMarkup(vehicle, records) {
  const tireMap = Object.fromEntries(
    TIRE_POSITIONS.map((position) => [position.key, vehicle.tires?.[position.key] ?? null])
  );
  const latestRotationRecord = [...records]
    .filter((record) => getServiceMatchKeys(record.serviceType).includes("tire rotation"))
    .sort((a, b) => new Date(b.serviceDate) - new Date(a.serviceDate) || b.mileageAtService - a.mileageAtService)[0] ?? null;
  const nextRotationMileage =
    latestRotationRecord && typeof latestRotationRecord.repeatMiles === "number"
      ? latestRotationRecord.mileageAtService + latestRotationRecord.repeatMiles
      : latestRotationRecord
        ? latestRotationRecord.mileageAtService + 5000
        : null;
  const nextRotationLine =
    typeof nextRotationMileage === "number"
      ? `Next rotation: ${formatNumber(Math.max(nextRotationMileage - vehicle.currentMileage, 0))} miles`
      : "Next rotation: not set";

  return `
    <div class="timeline-item">
      <strong>Tires</strong>
      <div class="schedule-meta-grid">
        <span class="meta">FL ${formatTireDepthLabel(tireMap.frontLeft)}</span>
        <span class="meta">FR ${formatTireDepthLabel(tireMap.frontRight)}</span>
        <span class="meta">RL ${formatTireDepthLabel(tireMap.rearLeft)}</span>
        <span class="meta">RR ${formatTireDepthLabel(tireMap.rearRight)}</span>
      </div>
      <span class="meta">${nextRotationLine}</span>
    </div>
  `;
}

function normalizeTreadRating(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  const rounded = Math.round(value);
  if (rounded >= TREAD_RATING_MIN && rounded <= TREAD_RATING_MAX) {
    return rounded;
  }

  if (rounded > TREAD_RATING_MAX) {
    const clamped32 = Math.max(LEGACY_TREAD_32NDS_MIN, Math.min(LEGACY_TREAD_32NDS_MAX, rounded));
    const normalized =
      ((clamped32 - LEGACY_TREAD_32NDS_MIN) / (LEGACY_TREAD_32NDS_MAX - LEGACY_TREAD_32NDS_MIN)) *
        (TREAD_RATING_MAX - TREAD_RATING_MIN) +
      TREAD_RATING_MIN;
    return Math.max(TREAD_RATING_MIN, Math.min(TREAD_RATING_MAX, Math.round(normalized)));
  }

  return Math.max(TREAD_RATING_MIN, Math.min(TREAD_RATING_MAX, rounded));
}

function parseTreadRatingInput(value) {
  return normalizeTreadRating(numericOrNull(value));
}

function getTireTreadRating(tire) {
  if (!tire) {
    return null;
  }

  const current =
    typeof tire.currentTreadDepth === "number"
      ? tire.currentTreadDepth
      : typeof tire.treadDepth === "number"
        ? tire.treadDepth
        : tire.treadHistory?.[0]?.depth ?? null;
  return normalizeTreadRating(current);
}

function formatTireTreadLabel(tire) {
  const rating = getTireTreadRating(tire);
  return typeof rating === "number" ? `Tread: ${rating}/10` : "Tread: --";
}

function formatTireDepthLabel(tire) {
  return formatTireTreadLabel(tire);
}

function getTreadRatingBadgeMeta(rating) {
  if (typeof rating !== "number") {
    return { status: "setup", label: "No rating" };
  }
  if (rating >= 8) {
    return { status: "ok", label: "Good" };
  }
  if (rating >= 4) {
    return { status: "upcoming", label: "Monitor" };
  }
  return { status: "due", label: "Replace soon" };
}

function formatTreadRatingValue(value) {
  const rating = normalizeTreadRating(value);
  return typeof rating === "number" ? `Tread: ${rating}/10` : "Not saved";
}

function getTireDisplayName(tire) {
  const label = [tire?.brand, tire?.model].filter(Boolean).join(" ").trim();
  return label || `Tire ${(tire?.tireId || tire?.id || "").slice(0, 8) || "unknown"}`;
}

function getTirePositionLabel(positionKey) {
  return TIRE_POSITIONS.find((position) => position.key === positionKey)?.label || positionKey;
}

function buildDashboardHealthMetrics(recurringSummaries) {
  const categories = ["Engine", "Tires", "Brakes", "Fluids"];
  const byCategory = Object.fromEntries(
    categories.map((category) => {
      const categoryItems = recurringSummaries.filter(
        (item) => getDashboardHealthCategory(item.category) === category && item.enabled
      );
      if (!categoryItems.length) {
        return [category, 100];
      }

      const score = Math.round(
        categoryItems.reduce((sum, item) => sum + getDashboardHealthWeight(item.status), 0) / categoryItems.length
      );
      return [category, score];
    })
  );
  const score = Math.round(Object.values(byCategory).reduce((sum, value) => sum + value, 0) / categories.length);
  return { score, byCategory };
}

function getDashboardHealthCategory(category) {
  if (category === "Tires & Wheels") {
    return "Tires";
  }
  if (category === "Engine & Fluids" || category === "Cooling System") {
    return "Fluids";
  }
  if (category === "Battery & Electrical" || category === "General Vehicle" || category === "Suspension & Steering") {
    return "Engine";
  }
  return category;
}

function buildPredictiveMaintenanceInsights(vehicle, records, recurringSummaries) {
  const milesPerDay = estimateVehicleMilesPerDay(vehicle, records);
  if (!(milesPerDay > 0)) {
    return [];
  }

  return recurringSummaries
    .filter(
      (item) =>
        item.enabled &&
        typeof item.milesRemaining === "number" &&
        item.milesRemaining > 0 &&
        !item.nextDueDate
    )
    .map((item) => {
      const predictedDate = addDays(new Date(), Math.ceil(item.milesRemaining / milesPerDay));
      return {
        ...item,
        predictedDueDateFromMileage: predictedDate,
        predictionLabel: `Predicted due around ${formatDate(predictedDate)} at current driving pace`,
        paceLabel: `Based on about ${formatNumber(Math.round(milesPerDay))} miles/day`,
      };
    })
    .sort((a, b) => new Date(a.predictedDueDateFromMileage) - new Date(b.predictedDueDateFromMileage))
    .slice(0, 4);
}

function estimateVehicleMilesPerDay(vehicle, records) {
  const datedMileagePoints = records
    .map((record) => ({
      mileage: record.mileageAtService,
      date: stripTime(record.serviceDate),
    }))
    .filter((point) => Number.isFinite(point.mileage))
    .sort((a, b) => a.date - b.date || a.mileage - b.mileage);

  if (!datedMileagePoints.length) {
    return 0;
  }

  const firstPoint = datedMileagePoints[0];
  const lastPoint = datedMileagePoints[datedMileagePoints.length - 1];
  const latestDays = Math.max(diffInDays(lastPoint.date, new Date()), 0);
  const latestMiles = Math.max(vehicle.currentMileage - lastPoint.mileage, 0);

  if (latestDays > 0 && latestMiles > 0) {
    return latestMiles / latestDays;
  }

  const totalDays = Math.max(diffInDays(firstPoint.date, lastPoint.date), 0);
  const totalMiles = Math.max(lastPoint.mileage - firstPoint.mileage, 0);
  if (totalDays > 0 && totalMiles > 0) {
    return totalMiles / totalDays;
  }

  return 0;
}

function getDashboardHealthWeight(status) {
  if (status === "due") {
    return 30;
  }
  if (status === "upcoming") {
    return 65;
  }
  if (status === "setup") {
    return 55;
  }
  if (status === "off") {
    return 70;
  }
  return 100;
}

function getServiceCategory(serviceType) {
  const serviceDefinition = getServiceDefinition(serviceType);
  if (serviceDefinition?.category) {
    return serviceDefinition.category;
  }
  const template = getRecurringTemplateByName(serviceType);
  return template?.category || "Custom";
}

function renderServiceSchedule() {
  const vehicleId = getActiveScheduleVehicleId();
  const vehicle = state.vehicles.find((item) => item.id === vehicleId);

  if (!vehicle) {
    scheduleMileageList.innerHTML = `<p>Add a vehicle first to build a recurring maintenance plan.</p>`;
    scheduleTimeList.innerHTML = "";
    scheduleBothList.innerHTML = "";
    return;
  }

  const categoryFilter = scheduleCategoryFilter.value || "all";
  const statusFilter = scheduleStatusFilter.value || "all";
  const summaries = getDisplayRecurringPlans(vehicle.id)
    .map((plan) => buildRecurringPlanSummary(plan, vehicle))
    .filter(Boolean)
    .filter((item) => categoryFilter === "all" || item.category === categoryFilter)
    .filter((item) => statusFilter === "all" || item.status === statusFilter)
    .sort(sortByUrgency);

  const dueSoonSummaries = summaries.filter((item) => item.status === "upcoming");
  const overdueSummaries = summaries.filter((item) => item.status === "due");
  const activeSummaries = summaries.filter((item) => !["upcoming", "due"].includes(item.status));
  const emptyText = "No services match the current filters.";

  scheduleMileageList.innerHTML = dueSoonSummaries.length
    ? dueSoonSummaries.map((item) => serviceScheduleMarkup(item)).join("")
    : `<p>${emptyText}</p>`;
  scheduleTimeList.innerHTML = overdueSummaries.length
    ? overdueSummaries.map((item) => serviceScheduleMarkup(item)).join("")
    : `<p>${emptyText}</p>`;
  scheduleBothList.innerHTML = activeSummaries.length
    ? activeSummaries.map((item) => serviceScheduleMarkup(item)).join("")
    : `<p>${emptyText}</p>`;
}

function renderScheduleStatusGroups(items) {
  const statusGroups = [
    { key: "due", label: "Overdue", open: true },
    { key: "upcoming", label: "Due soon", open: true },
    { key: "ok", label: "Good", open: false },
    { key: "setup", label: "Needs setup", open: false },
  ];

  return statusGroups
    .map((group) => {
      const groupItems = items.filter((item) => item.status === group.key);
      if (!groupItems.length) {
        return "";
      }

      return `
        <details class="schedule-status-group" ${group.open ? "open" : ""}>
          <summary class="schedule-status-summary">
            <span>${group.label}</span>
            <span class="meta">${groupItems.length}</span>
          </summary>
          <div class="list-stack">
            ${groupItems.map((item) => serviceScheduleMarkup(item)).join("")}
          </div>
        </details>
      `;
    })
    .join("");
}

function renderVehicles() {
  try {
    const vehicle = state.vehicles.find((item) => item.id === activeDashboardVehicleId) ?? state.vehicles[0] ?? null;
    syncActiveVehicle(vehicle?.id ?? "");

    if (!vehicle) {
      vehicleList.innerHTML = `<p>Add your first vehicle to start tracking maintenance.</p>`;
      return;
    }

    const records = state.records
      .filter((record) => record.vehicleId === vehicle.id)
      .sort((a, b) => new Date(b.serviceDate) - new Date(a.serviceDate) || b.mileageAtService - a.mileageAtService);
    const recordSummaries = getLatestTrackedRecords(records).map((record) => buildServiceSummary(record)).filter(Boolean);
    const recurringSummaries = getDisplayRecurringPlans(vehicle.id)
      .map((plan) => buildRecurringPlanSummary(plan, vehicle))
      .filter(Boolean)
      .sort(sortRecurringPlanSummaries);
    const nextDue = [...recordSummaries, ...recurringSummaries].filter(Boolean).sort(sortByUrgency)[0] ?? null;
    const tires = TIRE_POSITIONS.map((position) => vehicle.tires?.[position.key] ?? null);
    const trackedTireCount = tires.filter(Boolean).length;
    const costMetrics = buildDashboardCostMetrics(vehicle, records);
    const lifetimeStats = buildGarageLifetimeStats(vehicle, records, tires, costMetrics);
    const garageDocuments = buildGarageDocuments(records);
    const tirePosition = TIRE_POSITIONS.find((position) => position.key === activeGarageTirePosition) ?? TIRE_POSITIONS[0];
    const selectedTire = vehicle.tires?.[tirePosition.key]
      ? normalizeTireRecord(vehicle.tires[tirePosition.key], vehicle.id, tirePosition.key)
      : null;
    const tireRotationHistory = records
      .filter((record) => getServiceMatchKeys(record.serviceType).includes("tire rotation"))
      .slice(0, 5);

    vehicleList.innerHTML = `
    <article class="vehicle-card garage-vehicle-card">
      <div class="garage-section garage-header-block">
        <div class="vehicle-header">
          <div>
            <p class="eyebrow">Vehicle Header</p>
            <h3>${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ""}</h3>
            <span class="meta">Current mileage: ${formatNumber(vehicle.currentMileage)} miles</span>
            
          </div>
          <div class="inline-row">
            ${nextDue ? statusPill(nextDue.status, nextDue.badgeText) : statusPill("ok", "No due services")}
            <button class="button-primary" type="button" data-add-vehicle>
              Add vehicle
            </button>
            <button class="button-secondary" type="button" data-edit-vehicle="${vehicle.id}">
              Edit vehicle
            </button>
            <button class="button-ghost" type="button" data-delete-vehicle="${vehicle.id}">
              Remove vehicle
            </button>
          </div>
        </div>
        <div class="schedule-meta-grid">
          <span class="meta">VIN: ${vehicle.vin || "Not saved"}</span>
          <span class="meta">Mileage: ${formatNumber(vehicle.currentMileage)}</span>
          <span class="meta">${
            nextDue ? `Next due: ${nextDue.serviceType || nextDue.serviceName}` : "Next due: Nothing urgent"
          }</span>
          <span class="meta">Added to garage: ${vehicle.createdAt ? formatDate(vehicle.createdAt) : "Not saved"}</span>
          <span class="meta">${vehicle.notes || "No vehicle notes yet"}</span>
        </div>
      </div>

      <div class="garage-grid">
        <section class="garage-section tire-tracker-section ${isTireTrackerExpanded ? "is-expanded" : "is-collapsed"}">
          <div class="tire-tracker-summary">
            <div>
              <strong>Tire Tracker</strong>
              <span class="meta">${trackedTireCount} tires tracked • Front/rear layout</span>
            </div>
            <div class="tire-tracker-actions">
              <button class="button-secondary" type="button" data-open-tire-rotation>
                Rotate / Move Tires
              </button>
              <button class="button-secondary tire-tracker-toggle" type="button" data-toggle-tire-tracker aria-expanded="${isTireTrackerExpanded}">
                <span>${isTireTrackerExpanded ? "Collapse" : "Expand"}</span>
                <span aria-hidden="true">${isTireTrackerExpanded ? "⌃" : "⌄"}</span>
              </button>
            </div>
          </div>
          ${buildTireRotationPanelMarkup(vehicle)}
          ${
            isTireTrackerExpanded
              ? `
                <div class="tire-grid garage-tire-grid">
                  ${tireCardMarkup(vehicle, vehicle.tires?.frontLeft, TIRE_POSITIONS[0])}
                  ${tireCardMarkup(vehicle, vehicle.tires?.frontRight, TIRE_POSITIONS[1])}
                  ${tireCardMarkup(vehicle, vehicle.tires?.rearLeft, TIRE_POSITIONS[2])}
                  ${tireCardMarkup(vehicle, vehicle.tires?.rearRight, TIRE_POSITIONS[3])}
                </div>
                <div class="timeline-item tire-history-panel">
                  <div class="vehicle-summary">
                    <div>
                      <strong>Tire History</strong>
                      <span class="meta">${tirePosition.label}</span>
                    </div>
                    <div class="inline-row">
                      <button class="button-secondary" type="button" data-view-tire-history="${tirePosition.key}">
                        View tire history
                      </button>
                    </div>
                  </div>
                  <span class="meta">Tire ID: ${selectedTire?.tireId || "Not saved"}</span>
                  <span class="meta">Position history: ${buildTirePositionHistoryLabel(selectedTire)}</span>
                  <span class="meta">Tread history: ${buildTireTreadHistoryLabel(selectedTire)}</span>
                  <span class="meta">Rotation history: ${buildTireRotationHistoryLabel(selectedTire, tireRotationHistory)}</span>
                  <span class="meta">Replacement history: ${buildTireReplacementHistoryLabel(vehicle, selectedTire)}</span>
                </div>
              `
              : ""
          }
        </section>

      

        <section class="garage-section">
          <div class="vehicle-summary">
            <strong>Documents</strong>
            <span class="meta">Insurance, registration, purchase documents, service receipts, and warranty</span>
          </div>
          <form class="garage-inline-form" data-garage-document-form="${vehicle.id}">
            <input type="hidden" name="vehicleId" value="${vehicle.id}" />
            <label>
              Document type
              <select name="documentType">
                <option value="Insurance">Insurance</option>
                <option value="Registration">Registration</option>
                <option value="Purchase document">Purchase document</option>
                <option value="Service receipt">Service receipt</option>
                <option value="Warranty">Warranty</option>
              </select>
            </label>
            <label>
              Upload file
              <input type="file" name="documentFile" accept="image/*,.pdf" required />
            </label>
            <button class="button-primary" type="submit">Upload document</button>
          </form>
          <div class="list-stack">
            ${
              garageDocuments.length
                ? garageDocuments
                    .map(
                      (item) => `
                        <div class="timeline-item">
                          <strong>${item.documentType || item.serviceType}</strong>
                          <span class="meta">${formatDate(item.serviceDate)} • ${item.receiptName || "Receipt/photo"}</span>
                          <a class="button-secondary receipt-link" href="${item.receiptData}" download="${item.receiptName || "receipt"}">
                            Open document
                          </a>
                        </div>
                      `
                    )
                    .join("")
                : `<p class="muted">No documents uploaded yet.</p>`
            }
          </div>
        </section>

        <section class="garage-section garage-section-full">
          <div class="vehicle-summary">
            <strong>Lifetime Stats</strong>
            <span class="meta">Long-view totals for this vehicle</span>
          </div>
          <div class="widget-grid dashboard-grid">
            ${metricCardMarkup("Total Services", lifetimeStats.totalServices)}
            ${metricCardMarkup("Lifetime Cost", formatCurrency(lifetimeStats.totalCost))}
            ${metricCardMarkup("Tires Logged", lifetimeStats.tiresLogged)}
            ${metricCardMarkup("Miles Since Purchase", formatNumber(lifetimeStats.milesSincePurchase))}
            ${metricCardMarkup("Cost Per Mile", lifetimeStats.costPerMile > 0 ? formatCurrency(lifetimeStats.costPerMile) : "$0.00")}
            ${metricCardMarkup("Most Recent Service", lifetimeStats.lastServiceMetric)}
          </div>
          <div class="schedule-meta-grid">
            <span class="meta">First service: ${lifetimeStats.firstServiceLabel}</span>
            <span class="meta">Most recent service: ${lifetimeStats.lastServiceLabel}</span>
            <span class="meta">Shops used: ${lifetimeStats.shopCount}</span>
            <span class="meta">Categories tracked: ${lifetimeStats.categoryCount}</span>
          </div>
          <div class="list-stack">
            ${
              records.length
                ? records
                    .slice(0, 4)
                    .map(
                      (record) => `
                        <div class="timeline-item">
                          <div class="vehicle-summary">
                            <strong>${record.serviceType}</strong>
                            <div class="inline-row">
                              <button class="button-secondary" type="button" data-edit-record="${record.id}">
                                Edit
                              </button>
                              <button class="button-ghost" type="button" data-delete-record="${record.id}">
                                Delete
                              </button>
                            </div>
                          </div>
                          <span class="meta">${formatDate(record.serviceDate)} at ${formatNumber(record.mileageAtService)} miles</span>
                          <span class="meta">${record.shop ? `Shop: ${record.shop}` : "No shop saved"}</span>
                          <div class="reminder-editor">
                            <label>
                              Repeat miles
                              <input type="number" min="0" step="1" value="${record.repeatMiles ?? ""}" data-reminder-miles="${record.id}" />
                            </label>
                            <label>
                              Repeat months
                              <input type="number" min="0" step="1" value="${record.repeatMonths ?? ""}" data-reminder-months="${record.id}" />
                            </label>
                            <button class="button-secondary" type="button" data-save-reminder="${record.id}">
                              Save reminder
                            </button>
                          </div>
                        </div>
                      `
                    )
                    .join("")
                : `<p class="muted">No service records yet.</p>`
            }
          </div>
        </section>
      </div>
    </article>
    `;
  } catch (error) {
    vehicleList.innerHTML = `<p>Garage data is available, but this screen hit a display issue. Refresh once and try again.</p>`;
    console.error("Garage render failed", error);
  }
}

function buildGarageDocuments(records) {
  const vehicle = state.vehicles.find((item) => item.id === getActiveAppVehicleId());
  return [...(vehicle?.documents || []), ...records.filter((record) => record.receiptData)].slice(0, 8);
}

function buildGarageLifetimeStats(vehicle, records, tires, costMetrics) {
  const firstRecord = records[records.length - 1] ?? null;
  const lastRecord = records[0] ?? null;
  const earliestMileage = records.length ? Math.min(...records.map((record) => record.mileageAtService)) : vehicle.currentMileage;
  const trackedMiles = Math.max(vehicle.currentMileage - earliestMileage, 0);
  const shops = new Set(records.map((record) => cleanText(record.shop)).filter(Boolean));
  const categories = new Set(records.map((record) => record.category || getServiceCategory(record.serviceType)).filter(Boolean));

  return {
    totalServices: records.length,
    totalCost: costMetrics.total,
    tiresLogged: tires.filter(Boolean).length,
    milesSincePurchase:
      typeof vehicle.purchaseMileage === "number" ? Math.max(vehicle.currentMileage - vehicle.purchaseMileage, 0) : 0,
    costPerMile: trackedMiles > 0 ? roundCurrency(costMetrics.total / trackedMiles) : 0,
    firstServiceLabel: firstRecord ? `${firstRecord.serviceType} on ${formatDate(firstRecord.serviceDate)}` : "No services yet",
    lastServiceLabel: lastRecord ? `${lastRecord.serviceType} on ${formatDate(lastRecord.serviceDate)}` : "No services yet",
    lastServiceMetric: lastRecord ? `${lastRecord.serviceType} • ${formatDate(lastRecord.serviceDate)}` : "No services yet",
    shopCount: shops.size,
    categoryCount: categories.size,
  };
}

function buildGarageBatteryScore(records) {
  const batteryRecord = [...records]
    .filter((record) => /battery/i.test(record.serviceType))
    .sort((a, b) => new Date(b.serviceDate) - new Date(a.serviceDate))[0];
  if (!batteryRecord) {
    return 80;
  }

  const monthsSince = Math.max(diffInDays(new Date(batteryRecord.serviceDate), new Date()) / 30, 0);
  return Math.max(25, Math.round(100 - monthsSince * 2));
}

function getTireHealthMeta(tire, vehicle) {
  if (!tire) {
    return {
      status: "setup",
      label: "No tire",
      milesDriven: 0,
      totalWear: 0,
      estimatedMilesRemaining: null,
    };
  }

  const currentDepth = getTireTreadRating(tire);
  const startingDepth = normalizeTreadRating(
    typeof tire.startingTreadDepth === "number" ? tire.startingTreadDepth : currentDepth
  );
  const milesDriven = Math.max(vehicle.currentMileage - (tire.installMileage ?? vehicle.currentMileage), 0);
  const totalWear =
    typeof startingDepth === "number" && typeof currentDepth === "number" ? Math.max(startingDepth - currentDepth, 0) : 0;
  const wearRate = totalWear > 0 && milesDriven > 0 ? milesDriven / totalWear : null;
  const estimatedMilesRemaining =
    wearRate && typeof currentDepth === "number"
      ? Math.max((currentDepth - TREAD_RATING_MIN) * wearRate, 0)
      : null;
  const treadBadge = getTreadRatingBadgeMeta(currentDepth);

  return {
    status: treadBadge.status,
    label: treadBadge.label,
    milesDriven,
    totalWear,
    estimatedMilesRemaining,
  };
}

function logTreadDepthEntry(tire, entry) {
  const nextRating = normalizeTreadRating(entry.depth);
  if (typeof nextRating !== "number") {
    return;
  }

  tire.treadHistory = Array.isArray(tire.treadHistory) ? tire.treadHistory : [];
  const alreadyLogged = tire.treadHistory[0];
  if (
    alreadyLogged &&
    normalizeTreadRating(alreadyLogged.depth ?? alreadyLogged.treadDepth) === nextRating &&
    alreadyLogged.mileage === entry.mileage &&
    alreadyLogged.date === entry.date
  ) {
    tire.currentTreadDepth = nextRating;
    tire.treadDepth = nextRating;
    return;
  }

  tire.treadHistory.unshift({
    tireId: tire.tireId,
    date: entry.date,
    mileage: entry.mileage,
    treadDepth: nextRating,
    depth: nextRating,
    unit: "rating",
    notes: entry.notes || "",
  });
  tire.currentTreadDepth = nextRating;
  tire.treadDepth = nextRating;
}

function appendPositionHistory(tire, nextPosition, date, mileage) {
  tire.positionHistory = Array.isArray(tire.positionHistory) ? tire.positionHistory : [];
  const currentEntry = tire.positionHistory[0];
  if (currentEntry && currentEntry.position === nextPosition && !currentEntry.toDate) {
    return;
  }

  if (currentEntry && !currentEntry.toDate) {
    currentEntry.toDate = date;
    currentEntry.toMileage = mileage;
  }

  tire.positionHistory.unshift({
    position: nextPosition,
    fromDate: date,
    fromMileage: mileage,
    toDate: null,
    toMileage: null,
  });
  tire.position = nextPosition;
}

function getTireRotationMapping(rotationType, current) {
  const normalizedType =
    rotationType === "front-to-rear" || rotationType === "rear-to-front" ? "front-to-back" : rotationType;

  if (normalizedType === "cross-rotation" || normalizedType === "cross") {
    return {
      frontLeft: current.rearRight,
      frontRight: current.rearLeft,
      rearLeft: current.frontRight,
      rearRight: current.frontLeft,
    };
  }

  if (normalizedType === "rearward-cross") {
    return {
      rearLeft: current.frontLeft,
      rearRight: current.frontRight,
      frontLeft: current.rearRight,
      frontRight: current.rearLeft,
    };
  }

  return {
    rearLeft: current.frontLeft,
    rearRight: current.frontRight,
    frontLeft: current.rearLeft,
    frontRight: current.rearRight,
  };
}

function logTireMovement(vehicle, { tire, tireName, fromPosition, toPosition, date, mileage, notes, rotationType }) {
  vehicle.tireMovementHistory = Array.isArray(vehicle.tireMovementHistory) ? vehicle.tireMovementHistory : [];
  vehicle.tireMovementHistory.unshift({
    id: crypto.randomUUID(),
    vehicleId: vehicle.id,
    date,
    mileage,
    tireId: tire?.tireId || tire?.id || null,
    tireName: tireName || getTireDisplayName(tire),
    fromPosition,
    toPosition,
    notes: notes || "",
    rotationType: rotationType || "manual",
  });
}

function findTireSourcePosition(previousByPosition, tire) {
  if (!tire) {
    return null;
  }

  const tireKey = tire.tireId || tire.id;
  return (
    TIRE_POSITIONS.find((candidate) => {
      const previousTire = previousByPosition[candidate.key];
      if (!previousTire) {
        return false;
      }
      return (previousTire.tireId || previousTire.id) === tireKey;
    })?.key ||
    tire.position ||
    null
  );
}

function applyTirePositionMapping(vehicle, mapping, { rotationType, notes, mileage, date }) {
  const previousByPosition = { ...(vehicle.tires || {}) };
  const nextTires = { ...(vehicle.tires || {}) };

  TIRE_POSITIONS.forEach((position) => {
    const tire = mapping[position.key] ?? null;
    if (!tire) {
      delete nextTires[position.key];
      return;
    }

    const fromPosition = findTireSourcePosition(previousByPosition, tire) || position.key;
    const nextTire = normalizeTireRecord({ ...tire }, vehicle.id, position.key);
    nextTire.rotationHistory = Array.isArray(nextTire.rotationHistory) ? nextTire.rotationHistory : [];
    nextTire.rotationHistory.unshift({
      vehicleId: vehicle.id,
      date,
      mileage,
      rotationType,
      notes,
      fromPosition,
      toPosition: position.key,
    });
    nextTire.status = "rotated";
    appendPositionHistory(nextTire, position.key, date, mileage);
    nextTire.updatedAt = new Date().toISOString();
    nextTires[position.key] = nextTire;

    if (fromPosition !== position.key) {
      logTireMovement(vehicle, {
        tire: nextTire,
        fromPosition,
        toPosition: position.key,
        date,
        mileage,
        notes,
        rotationType,
      });
    }
  });

  vehicle.tires = nextTires;
}

function applyTireRotation(vehicle, { rotationType, notes, mileage, date }) {
  if (!vehicle.tires) {
    vehicle.tires = {};
  }

  const current = { ...vehicle.tires };
  const mapping = getTireRotationMapping(rotationType, current);
  applyTirePositionMapping(vehicle, mapping, { rotationType, notes, mileage, date });

  vehicle.tireRotationHistory = Array.isArray(vehicle.tireRotationHistory) ? vehicle.tireRotationHistory : [];
  vehicle.tireRotationHistory.unshift({
    vehicleId: vehicle.id,
    date,
    mileage,
    rotationType,
    notes,
  });
}

function applyManualTireMove(vehicle, fromPosition, toPosition, { notes, mileage, date }) {
  if (!vehicle.tires) {
    vehicle.tires = {};
  }

  const fromTire = vehicle.tires[fromPosition] ?? null;
  const toTire = vehicle.tires[toPosition] ?? null;
  if (!fromTire) {
    return;
  }

  const mapping = { ...vehicle.tires };
  mapping[toPosition] = fromTire;
  mapping[fromPosition] = toTire;

  applyTirePositionMapping(vehicle, mapping, {
    rotationType: "manual",
    notes,
    mileage,
    date,
  });

  vehicle.tireRotationHistory = Array.isArray(vehicle.tireRotationHistory) ? vehicle.tireRotationHistory : [];
  vehicle.tireRotationHistory.unshift({
    vehicleId: vehicle.id,
    date,
    mileage,
    rotationType: "manual",
    notes: notes || `Manual move: ${getTirePositionLabel(fromPosition)} to ${getTirePositionLabel(toPosition)}`,
  });
}

function archiveReplacedTire(vehicle, position, tire, replacement) {
  vehicle.archivedTires = Array.isArray(vehicle.archivedTires) ? vehicle.archivedTires : [];
  const archived = {
    ...normalizeTireRecord(tire, vehicle.id, position),
    status: "archived",
    archivedAt: replacement.date,
    replacementHistory: [
      ...(Array.isArray(tire.replacementHistory) ? tire.replacementHistory : []),
      {
        oldTireId: tire.tireId || tire.id,
        newTireId: null,
        vehicleId: vehicle.id,
        date: replacement.date,
        mileage: replacement.mileage,
        replacedPosition: position,
        replacementReason: replacement.reason,
        shop: replacement.shop,
        cost: replacement.cost,
        notes: replacement.notes,
      },
    ],
  };
  const currentPosition = archived.positionHistory?.[0];
  if (currentPosition && !currentPosition.toDate) {
    currentPosition.toDate = replacement.date;
    currentPosition.toMileage = replacement.mileage;
  }
  vehicle.archivedTires.unshift(archived);
}

function createReplacementTireRecord(payload) {
  const nextId = crypto.randomUUID();
  const installDate = payload.installDate || new Date().toISOString().slice(0, 10);
  const installMileage = typeof payload.installMileage === "number" ? payload.installMileage : null;
  const nextTire = normalizeTireRecord(
    {
      ...payload,
      id: nextId,
      tireId: nextId,
      status: "active",
      startingTreadDepth: payload.currentTreadDepth,
      currentTreadDepth: payload.currentTreadDepth,
      treadHistory: [],
      positionHistory: [
        {
          position: payload.position,
          fromDate: installDate,
          fromMileage: installMileage,
          toDate: null,
          toMileage: null,
        },
      ],
      rotationHistory: [],
      replacementHistory: [],
    },
    payload.vehicleId,
    payload.position
  );
  if (typeof payload.currentTreadDepth === "number") {
    logTreadDepthEntry(nextTire, {
      depth: payload.currentTreadDepth,
      mileage: installMileage ?? 0,
      date: installDate,
      notes: "Installed replacement tire",
    });
  }
  return nextTire;
}

function garageTireNodeMarkup(vehicle, tire, position, activePosition) {
  const shortLabelMap = {
    frontLeft: "FL",
    frontRight: "FR",
    rearLeft: "RL",
    rearRight: "RR",
  };
  return `
    <button class="garage-tire-node ${activePosition === position.key ? "is-active" : ""}" type="button" data-select-tire="${position.key}">
      <span>${shortLabelMap[position.key] || position.label}</span>
      <strong>${formatTireTreadLabel(tire)}</strong>
    </button>
  `;
}

function buildTireTreadHistoryLabel(tire) {
  const currentRating = getTireTreadRating(tire);
  if (!tire?.treadHistory?.length) {
    return typeof currentRating === "number" ? `${formatTreadRatingValue(currentRating)} current reading` : "No tread history yet";
  }

  return tire.treadHistory
    .slice(0, 3)
    .map((entry) => {
      const rating = normalizeTreadRating(entry.depth ?? entry.treadDepth);
      return `${formatTreadRatingValue(rating)} on ${safeFormatDate(entry.date)} at ${formatNumber(entry.mileage)} mi`;
    })
    .join(" • ");
}

function buildTireMovementHistoryMarkup(vehicle) {
  const history = Array.isArray(vehicle.tireMovementHistory) ? vehicle.tireMovementHistory : [];
  if (!history.length) {
    return `<p class="muted">No tire movements logged yet.</p>`;
  }

  return history
    .slice(0, 12)
    .map((entry) => {
      const preset = ROTATION_PRESETS.find((item) => item.value === entry.rotationType);
      const moveLabel = `${getTirePositionLabel(entry.fromPosition)} → ${getTirePositionLabel(entry.toPosition)}`;
      return `
        <div class="tire-movement-entry">
          <strong>${safeFormatDate(entry.date)} • ${entry.tireName || "Tire"}</strong>
          <span class="meta">${moveLabel}</span>
          <span class="meta">${preset?.label || entry.rotationType || "Move"} • ${formatNumber(entry.mileage)} miles</span>
          ${entry.notes ? `<span class="meta">${entry.notes}</span>` : ""}
        </div>
      `;
    })
    .join("");
}

function buildTireRotationPanelMarkup(vehicle) {
  const rotationOptions = ROTATION_PRESETS.map(
    (preset) => `<option value="${preset.value}">${preset.label}</option>`
  ).join("");
  const positionOptions = TIRE_POSITIONS.map((position) => `<option value="${position.key}">${position.label}</option>`).join(
    ""
  );

  return `
    <div class="tire-rotation-panel ${isTireRotationPanelOpen ? "" : "is-hidden"}">
      <div class="vehicle-summary">
        <div>
          <strong>Rotate / Move Tires</strong>
          <span class="meta">Tread rating, pressure, notes, install date, and mileage stay with each tire.</span>
        </div>
      </div>
      <form class="form-grid" data-garage-rotation-form="${vehicle.id}">
        <input type="hidden" name="vehicleId" value="${vehicle.id}" />
        <label>
          Rotation preset
          <select name="rotationType" data-rotation-type-select>
            ${rotationOptions}
          </select>
        </label>
        <label>
          Notes
          <input type="text" name="notes" placeholder="Optional rotation notes" />
        </label>
        <div class="full-span form-grid is-hidden" data-manual-move-fields>
          <label>
            Move from
            <select name="fromPosition">
              <option value="">Select position</option>
              ${positionOptions}
            </select>
          </label>
          <label>
            Move to
            <select name="toPosition">
              <option value="">Select position</option>
              ${positionOptions}
            </select>
          </label>
        </div>
        <div class="full-span inline-row">
          <button class="button-primary" type="submit">Apply tire move</button>
        </div>
      </form>
      <div class="tire-movement-history">
        <strong>Tire Movement History</strong>
        ${buildTireMovementHistoryMarkup(vehicle)}
      </div>
    </div>
  `;
}

function buildTirePositionHistoryLabel(tire) {
  if (!tire?.positionHistory?.length) {
    return "No position history yet";
  }

  return tire.positionHistory
    .slice(0, 3)
    .map((entry) => {
      const label = TIRE_POSITIONS.find((position) => position.key === entry.position)?.label || entry.position;
      const endLabel = entry.toDate ? `to ${safeFormatDate(entry.toDate)}` : "to present";
      return `${label} from ${safeFormatDate(entry.fromDate)} ${endLabel}`;
    })
    .join(" • ");
}

function buildTireRotationHistoryLabel(tire, fallbackRotationHistory) {
  const history = tire?.rotationHistory?.length ? tire.rotationHistory : fallbackRotationHistory;
  if (!history?.length) {
    return "No rotations logged yet";
  }

  return history
    .slice(0, 3)
    .map((entry) => `${safeFormatDate(entry.date)} (${entry.rotationType || "rotation"})`)
    .join(" • ");
}

function buildTireReplacementHistoryLabel(vehicle, tire) {
  const archivedMatches = (vehicle.archivedTires || []).filter(
    (archivedTire) => archivedTire.tireId === tire?.tireId || archivedTire.replacementHistory?.some((entry) => entry.newTireId === tire?.tireId)
  );
  if (!archivedMatches.length) {
    return tire ? "Recently replaced" : "No replacement history yet";
  }

  return archivedMatches
    .flatMap((archivedTire) => archivedTire.replacementHistory || [])
    .slice(-3)
    .map((entry) => `${safeFormatDate(entry.date)} • ${entry.replacementReason || "Replacement logged"}`)
    .join(" • ");
}

function safeFormatDate(value) {
  if (!value) {
    return "Date not saved";
  }

  const nextDate = new Date(value);
  return Number.isNaN(nextDate.getTime()) ? "Date not saved" : formatDate(value);
}

function renderHistory() {
  const records = getFilteredHistoryRecords();
  const topRecord = records[0] ?? null;

  if (historyTopActionTarget) {
    historyTopActionTarget.textContent = topRecord
      ? `${topRecord.serviceType} • ${formatDate(topRecord.serviceDate)} • ${formatNumber(topRecord.mileageAtService)} miles`
      : "No matching services yet.";
  }
  if (historyTopEditButton) {
    historyTopEditButton.disabled = !topRecord;
  }
  if (historyTopDeleteButton) {
    historyTopDeleteButton.disabled = !topRecord;
  }

  const visitGroups = buildHistoryVisitGroups(records);

  historyList.innerHTML = visitGroups.length
    ? visitGroups.map((visitGroup) => buildHistoryVisitMarkup(visitGroup)).join("")
    : `<p>No maintenance history matches the current filters.</p>`;

  historyTimeline.innerHTML = visitGroups.length
    ? renderHistoryTimeline(visitGroups)
    : `<p>No maintenance history matches the current filters.</p>`;
  updateHistoryViewMode();
}

function getFilteredHistoryRecords() {
  const query = cleanText(historySearchInput.value).toLowerCase();
  const vehicleFilter = getActiveAppVehicleId();
  const categoryFilter = historyCategoryFilter.value || "all";
  const dateFrom = historyDateFrom.value;
  const dateTo = historyDateTo.value;
  const sortOption = historySortSelect.value || "newest";

  return [...state.records]
    .filter((record) => !vehicleFilter || record.vehicleId === vehicleFilter)
    .filter((record) => categoryFilter === "all" || (record.category || getServiceCategory(record.serviceType)) === categoryFilter)
    .filter((record) => !dateFrom || record.serviceDate >= dateFrom)
    .filter((record) => !dateTo || record.serviceDate <= dateTo)
    .filter((record) => {
      if (!query) {
        return true;
      }
      return [record.serviceType, record.category, record.shop, record.notes, record.tireDetails?.brand, record.tireDetails?.model]
        .join(" ")
        .toLowerCase()
        .includes(query);
    })
    .sort((a, b) => sortHistoryRecords(a, b, sortOption));
}

function handleHistoryTopAdd() {
  resetRecordFormMode();
  setRecordFormExpanded(true);
  setActiveScreen("history");
  recordForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function handleHistoryTopEdit() {
  const topRecord = getFilteredHistoryRecords()[0];
  if (!topRecord) {
    return;
  }
  loadRecordIntoForm(topRecord);
}

function handleHistoryTopDelete() {
  const topRecord = getFilteredHistoryRecords()[0];
  if (!topRecord) {
    return;
  }

  const confirmed = window.confirm(
    `Delete ${topRecord.serviceType} from ${formatDate(topRecord.serviceDate)} at ${formatNumber(
      topRecord.mileageAtService
    )} miles?`
  );

  if (!confirmed) {
    return;
  }

  state.records = state.records.filter((record) => record.id !== topRecord.id);
  if (editingVisitRecordIds.includes(topRecord.id)) {
    resetRecordFormMode();
  }
  persist();
  renderHistory();
}

function syncHistoryToActiveVehicle() {
  const activeVehicleId = getActiveAppVehicleId();
  if (recordVehicleSelect && activeVehicleId) {
    recordVehicleSelect.value = activeVehicleId;
    recordVehicleSelect.disabled = false;
  }
}

function getActiveAppVehicleId() {
  return activeDashboardVehicleId || dashboardVehicleSelect.value || state.vehicles[0]?.id || "";
}

function repairOrphanedVehicleLinks() {
  if (state.vehicles.length !== 1) {
    return;
  }

  const onlyVehicleId = state.vehicles[0].id;
  let didRepair = false;
  state.records = state.records.map((record) => {
    if (cleanText(record.vehicleId)) {
      return record;
    }

    didRepair = true;
    return {
      ...record,
      vehicleId: onlyVehicleId,
    };
  });

  if (didRepair) {
    persist();
  }
}

function sortHistoryRecords(a, b, sortOption) {
  if (sortOption === "oldest") {
    return new Date(a.serviceDate) - new Date(b.serviceDate) || a.mileageAtService - b.mileageAtService;
  }
  if (sortOption === "mileage-high") {
    return b.mileageAtService - a.mileageAtService || new Date(b.serviceDate) - new Date(a.serviceDate);
  }
  if (sortOption === "mileage-low") {
    return a.mileageAtService - b.mileageAtService || new Date(b.serviceDate) - new Date(a.serviceDate);
  }
  if (sortOption === "cost-high") {
    return (b.cost || 0) - (a.cost || 0) || new Date(b.serviceDate) - new Date(a.serviceDate);
  }
  if (sortOption === "cost-low") {
    return (a.cost || 0) - (b.cost || 0) || new Date(b.serviceDate) - new Date(a.serviceDate);
  }
  return new Date(b.serviceDate) - new Date(a.serviceDate) || b.mileageAtService - a.mileageAtService;
}

function buildHistoryTireDetailsMarkup(record) {
  if (!record.tireDetails) {
    return "";
  }

  const positions =
    record.tireDetails.position === "multiple"
      ? (record.tireDetails.positions || [])
          .map((positionKey) => TIRE_POSITIONS.find((position) => position.key === positionKey)?.label || positionKey)
          .join(", ")
      : TIRE_POSITIONS.find((position) => position.key === record.tireDetails.position)?.label || record.tireDetails.position;

  return [
    record.tireDetails.warrantyMiles && `Warranty miles: ${formatNumber(record.tireDetails.warrantyMiles)}`,
    record.tireDetails.brand && `Tire brand: ${record.tireDetails.brand}`,
    record.tireDetails.model && `Tire model: ${record.tireDetails.model}`,
    record.tireDetails.size && `Tire size: ${record.tireDetails.size}`,
    record.tireDetails.treadDepth && formatTreadRatingValue(normalizeTreadRating(record.tireDetails.treadDepth)),
    record.tireDetails.recommendedPressure && `Recommended pressure (PSI): ${record.tireDetails.recommendedPressure}`,
    positions && `Tire position replaced: ${positions}`,
  ]
    .filter(Boolean)
    .map((line) => `<span class="meta">${line}</span>`)
    .join("");
}

function buildHistoryVisitGroups(records) {
  const groupedVisits = new Map();

  records.forEach((record) => {
    const visitKey = [
      record.vehicleId,
      record.serviceDate,
      record.mileageAtService,
      cleanText(record.shop).toLowerCase(),
    ].join("::");

    if (!groupedVisits.has(visitKey)) {
      groupedVisits.set(visitKey, []);
    }
    groupedVisits.get(visitKey).push(record);
  });

  return [...groupedVisits.values()];
}

function buildHistoryVisitMarkup(records) {
  const leadRecord = records[0];
  const isMultiServiceVisit = records.length > 1;
  const totalCost = records.reduce((sum, record) => sum + (record.cost || 0), 0);
  const summary = buildServiceSummary(leadRecord);
  const visitKey = buildHistoryVisitKey(leadRecord);

  return `
    <article class="timeline-item history-service-card">
      <div class="vehicle-summary">
        <div>
          <strong>${isMultiServiceVisit ? `${records.length} services logged` : leadRecord.serviceType}</strong>
          <span class="meta">${formatDate(leadRecord.serviceDate)} • ${formatNumber(leadRecord.mileageAtService)} miles</span>
          <span class="meta">${leadRecord.shop ? `Shop / mechanic: ${leadRecord.shop}` : "Shop / mechanic not saved"}</span>
        </div>
        <div class="inline-row">
          <button class="button-secondary" type="button" data-edit-visit="${visitKey}">
            Edit visit
          </button>
          <button class="button-secondary" type="button" data-add-to-visit="${visitKey}">
            Add service to visit
          </button>
          ${summary ? statusPill(summary.status, summary.badgeText) : ""}
          <button class="button-ghost button-ghost-neutral" type="button" data-delete-visit="${visitKey}">
            Delete visit
          </button>
        </div>
      </div>
      <span class="meta">${totalCost ? `Total cost: ${formatCurrency(totalCost)}` : "Cost not saved"}</span>
      ${
        isMultiServiceVisit
          ? `<span class="meta">Services: ${records.map((record) => record.serviceType).join(", ")}</span>`
          : `<span class="meta">Category: ${leadRecord.category || getServiceCategory(leadRecord.serviceType)}</span>`
      }
      <details class="history-card-details">
        <summary>${isMultiServiceVisit ? "View visit details" : "View details"}</summary>
        <div class="list-stack">
          ${records.map((record) => buildHistoryRecordDetailsMarkup(record)).join("")}
        </div>
      </details>
    </article>
  `;
}

function buildHistoryRecordDetailsMarkup(record) {
  const category = record.category || getServiceCategory(record.serviceType);
  const tireDetailsMarkup = buildHistoryTireDetailsMarkup(record);

  return `
    <div class="timeline-item">
      <div class="vehicle-summary">
        <div>
          <strong>${record.serviceType}</strong>
          <span class="meta">${category}</span>
        </div>
        <div class="inline-row">
          <button class="button-secondary" type="button" data-edit-record="${record.id}">
            Edit
          </button>
          <button class="button-ghost" type="button" data-delete-record="${record.id}">
            Delete
          </button>
        </div>
      </div>
      <span class="meta">${record.cost ? `Cost: ${formatCurrency(record.cost)}` : "Cost not saved"}</span>
      <span class="meta">${record.notes || "No notes saved"}</span>
      ${
        record.receiptData
          ? `<a class="button-secondary receipt-link" href="${record.receiptData}" download="${record.receiptName || "receipt"}">View receipt image</a>`
          : `<span class="meta">No receipt uploaded</span>`
      }
      <span class="meta">Repeat every X miles: ${record.repeatMiles ? formatNumber(record.repeatMiles) : "Not set"}</span>
      <span class="meta">Repeat every X months: ${record.repeatMonths ?? "Not set"}</span>
      ${tireDetailsMarkup}
    </div>
  `;
}

function renderHistoryTimeline(visitGroups) {
  const groups = new Map();

  visitGroups.forEach((records) => {
    const leadRecord = records[0];
    const groupLabel = formatMonthYear(leadRecord.serviceDate);
    if (!groups.has(groupLabel)) {
      groups.set(groupLabel, []);
    }
    groups.get(groupLabel).push(records);
  });

  return [...groups.entries()]
    .map(
      ([groupLabel, groupedVisits]) => `
        <section class="timeline-group">
          <h3>${groupLabel}</h3>
          <div class="timeline-vertical">
            ${groupedVisits
              .map((records) => {
                const leadRecord = records[0];
                const vehicle = state.vehicles.find((item) => item.id === leadRecord.vehicleId);
                const isMultiServiceVisit = records.length > 1;
                const visitKey = buildHistoryVisitKey(leadRecord);
                return `
                  <article class="timeline-event">
                    <div class="timeline-event-marker"></div>
                    <div class="timeline-event-card">
                      <div class="vehicle-summary">
                        <strong>${isMultiServiceVisit ? `${records.length} services logged` : leadRecord.serviceType}</strong>
                        <div class="inline-row">
                          <button class="button-secondary" type="button" data-edit-visit="${visitKey}">
                            Edit visit
                          </button>
                          <button class="button-secondary" type="button" data-add-to-visit="${visitKey}">
                            Add service to visit
                          </button>
                          <button class="button-ghost button-ghost-neutral" type="button" data-delete-visit="${visitKey}">
                            Delete visit
                          </button>
                        </div>
                      </div>
                      <span class="meta">${formatDate(leadRecord.serviceDate)} • ${formatNumber(leadRecord.mileageAtService)} miles</span>
                      <span class="meta">${
                        vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : "Vehicle removed"
                      }</span>
                      <span class="meta">${leadRecord.shop ? `Shop: ${leadRecord.shop}` : "No shop saved"}</span>
                      <details class="history-card-details">
                        <summary>${isMultiServiceVisit ? "View visit details" : "View details"}</summary>
                        <div class="list-stack">
                          ${records.map((record) => buildHistoryRecordDetailsMarkup(record)).join("")}
                        </div>
                      </details>
                    </div>
                  </article>
                `;
              })
              .join("")}
          </div>
        </section>
      `
    )
    .join("");
}

function buildHistoryVisitKey(record) {
  return [record.vehicleId, record.serviceDate, record.mileageAtService, cleanText(record.shop).toLowerCase()].join("::");
}

function getVisitRecordsByKey(visitKey) {
  return state.records.filter((record) => buildHistoryVisitKey(record) === visitKey);
}

function loadVisitIntoNewForm(record) {
  resetRecordFormMode();
  recordForm.elements.vehicleId.value = record.vehicleId;
  recordForm.elements.serviceDate.value = record.serviceDate;
  recordForm.elements.serviceMileage.value = record.mileageAtService;
  recordForm.elements.shop.value = record.shop ?? "";
  if (record.cost) {
    recordForm.elements.cost.value = record.cost;
  }
  setActiveScreen("history");
  setRecordFormExpanded(true);
  recordForm.scrollIntoView({ behavior: "smooth", block: "start" });
  recordServiceSearchInput?.focus();
}

function loadVisitIntoForm(records) {
  const visitRecords = [...records];
  const leadRecord = visitRecords[0];
  if (!leadRecord) {
    return;
  }

  editingVisitRecordIds = visitRecords.map((record) => record.id);
  recordForm.reset();
  recordForm.elements.vehicleId.value = leadRecord.vehicleId;
  recordForm.elements.serviceDate.value = leadRecord.serviceDate;
  recordForm.elements.serviceMileage.value = leadRecord.mileageAtService;
  recordForm.elements.cost.value = leadRecord.cost ?? "";
  recordForm.elements.shop.value = leadRecord.shop ?? "";
  recordForm.elements.notes.value = leadRecord.notes ?? "";
  recordForm.elements.repeatMiles.value = leadRecord.repeatMiles ?? "";
  recordForm.elements.repeatMonths.value = leadRecord.repeatMonths ?? "";
  recordForm.elements.serviceType.value = leadRecord.serviceType;
  recordCustomServiceInput.value = visitRecords.map((record) => record.serviceType).join(", ");
  setRecordCategoryValue(getAutoCategoryForSelectedServices(visitRecords.map((record) => record.serviceType)));

  const leadTireDetails = visitRecords.find((record) => record.tireDetails)?.tireDetails;
  if (leadTireDetails) {
    recordForm.elements.recordTireBrand.value = leadTireDetails.brand ?? "";
    recordForm.elements.recordTireModel.value = leadTireDetails.model ?? "";
    recordForm.elements.recordTireType.value = leadTireDetails.type ?? "";
    recordForm.elements.recordTireSize.value = leadTireDetails.size ?? "";
    recordForm.elements.recordTireTreadDepth.value = normalizeTreadRating(leadTireDetails.treadDepth) ?? "";
    recordForm.elements.recordTireWarrantyMiles.value = leadTireDetails.warrantyMiles ?? "";
    recordForm.elements.recordTireEstimatedReplacementMileage.value = leadTireDetails.estimatedReplacementMileage ?? "";
    recordForm.elements.recordTireRecommendedPressure.value = leadTireDetails.recommendedPressure ?? "";
    recordForm.elements.recordTirePosition.value = leadTireDetails.position ?? "";
    recordForm.querySelectorAll('input[name="recordTirePositions"]').forEach((input) => {
      input.checked = (leadTireDetails.positions || []).includes(input.value);
    });
    recordForm.elements.recordTireNotes.value = leadTireDetails.notes ?? "";
  }

  renderRecordServiceChecklist();
  checkServiceTypes(visitRecords.map((record) => record.serviceType));
  syncRecordTireSection();
  syncRecordTirePositionMode();
  renderHistoryQuickServiceChecklist();
  updateRecordFormMode();
  setActiveScreen("history");
  setRecordFormExpanded(true);
  recordForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function updateHistoryViewMode() {
  const showingTimeline = activeHistoryView === "timeline";
  historyList.classList.toggle("is-hidden", showingTimeline);
  historyTimeline.classList.toggle("is-hidden", !showingTimeline);
  historyViewToggle.querySelectorAll("[data-history-view]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.historyView === activeHistoryView);
  });
}

function handleScreenButtonClick(screenName) {
  setActiveScreen(screenName);

  if (screenName === "garage") {
    renderVehicles();
    return;
  }

  if (screenName === "schedule") {
    renderServiceSchedule();
    return;
  }

  if (screenName !== "history") {
    return;
  }

  if (!editingVisitRecordIds.length) {
    setRecordFormExpanded(false);
  }
  setHistoryQuickAddExpanded(false);
  requestAnimationFrame(() => {
    historyLogSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function setActiveScreen(screenName) {
  screens.forEach((screen) => {
    screen.classList.toggle("is-active", screen.dataset.screen === screenName);
  });

  screenButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.screenTarget === screenName);
  });

  persistUiState();
}

function loadRecordIntoForm(record) {
  editingVisitRecordIds = [record.id];
  recordForm.reset();
  recordForm.elements.vehicleId.value = record.vehicleId;
  recordForm.elements.serviceType.value = record.serviceType;
  recordCustomServiceInput.value = record.serviceType;
  setRecordCategoryValue(record.category || getServiceCategory(record.serviceType), { manual: true });
  recordForm.elements.serviceDate.value = record.serviceDate;
  recordForm.elements.serviceMileage.value = record.mileageAtService;
  recordForm.elements.cost.value = record.cost ?? "";
  recordForm.elements.shop.value = record.shop ?? "";
  recordForm.elements.notes.value = record.notes ?? "";
  recordForm.elements.repeatMiles.value = record.repeatMiles ?? "";
  recordForm.elements.repeatMonths.value = record.repeatMonths ?? "";
  if (record.tireDetails) {
    recordForm.elements.recordTireBrand.value = record.tireDetails.brand ?? "";
    recordForm.elements.recordTireModel.value = record.tireDetails.model ?? "";
    recordForm.elements.recordTireType.value = record.tireDetails.type ?? "";
    recordForm.elements.recordTireSize.value = record.tireDetails.size ?? "";
    recordForm.elements.recordTireTreadDepth.value = normalizeTreadRating(record.tireDetails.treadDepth) ?? "";
    recordForm.elements.recordTireWarrantyMiles.value = record.tireDetails.warrantyMiles ?? "";
    recordForm.elements.recordTireEstimatedReplacementMileage.value =
      record.tireDetails.estimatedReplacementMileage ?? "";
    recordForm.elements.recordTireRecommendedPressure.value = record.tireDetails.recommendedPressure ?? "";
    recordForm.elements.recordTirePosition.value = record.tireDetails.position ?? "";
    recordForm.querySelectorAll('input[name="recordTirePositions"]').forEach((input) => {
      input.checked = (record.tireDetails.positions || []).includes(input.value);
    });
    recordForm.elements.recordTireNotes.value = record.tireDetails.notes ?? "";
  }
  syncRecordTireSection();
  syncRecordTirePositionMode();
  renderRecordServiceChecklist();
  renderHistoryQuickServiceChecklist();
  updateRecordFormMode();
  setActiveScreen("history");
  recordForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function updateRecordFormMode() {
  const isEditing = Boolean(editingVisitRecordIds.length);
  const isVisitEditing = editingVisitRecordIds.length > 1;
  recordFormTitle.textContent = isEditing ? (isVisitEditing ? "Edit Visit" : "Edit Service") : "Maintenance Log";
  recordSubmitButton.textContent = isEditing ? (isVisitEditing ? "Update Visit" : "Update Service") : "Save Service";
  recordEditNotice.classList.toggle("is-hidden", !isEditing);
  recordCancelEditButton.textContent = isEditing ? "Cancel Edit" : "Cancel";
  recordFormToggleButton.textContent = isEditing ? (isVisitEditing ? "Edit Visit" : "Edit Service") : "+ Add Service";
  if (isEditing) {
    setRecordFormExpanded(true);
  }
}

function resetRecordFormMode() {
  editingVisitRecordIds = [];
  recordForm.reset();
  hideRecordTireSection();
  syncRecordTirePositionMode();
  setRecordCategoryValue("Custom");
  recordCustomServiceInput.value = "";
  renderRecordServiceChecklist();
  renderHistoryQuickServiceChecklist();
  updateRecordFormMode();
  setRecordFormExpanded(false);
}

function setHistoryQuickAddExpanded(expanded) {
  isHistoryQuickAddExpanded = expanded;
  historyQuickAddPanel.classList.toggle("is-hidden", !expanded);
  historyQuickAddToggleButton.setAttribute("aria-expanded", String(expanded));
  persistUiState();
}

function loadVehicleIntoForm(vehicle) {
  editingVehicleId = vehicle.id;
  vehicleForm.elements.year.value = vehicle.year ?? "";
  vehicleForm.elements.make.value = vehicle.make ?? "";
  vehicleForm.elements.model.value = vehicle.model ?? "";
  vehicleForm.elements.currentMileage.value = vehicle.currentMileage ?? "";
  vehicleForm.elements.trim.value = vehicle.trim ?? "";
  vehicleForm.elements.vin.value = vehicle.vin ?? "";
  vehicleForm.elements.purchaseMileage.value = vehicle.purchaseMileage ?? "";
  vehicleForm.elements.engineSpec.value = vehicle.engineSpec ?? "";
  vehicleForm.elements.drivetrain.value = vehicle.drivetrain ?? "";
  vehicleForm.elements.fuelType.value = vehicle.fuelType ?? "";
  vehicleForm.elements.oilCapacity.value = vehicle.oilCapacity ?? "";
  vehicleForm.elements.vehicleTireSize.value = vehicle.vehicleTireSize ?? "";
  vehicleForm.elements.vehicleRecommendedPsi.value = vehicle.vehicleRecommendedPsi ?? "";
  vehicleForm.elements.notes.value = vehicle.notes ?? "";
  updateVehicleFormMode();
  setVehicleFormExpanded(true);
  setActiveScreen("dashboard");
  vehicleForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function updateVehicleFormMode() {
  const isEditing = Boolean(editingVehicleId);
  vehicleSubmitButton.textContent = isEditing ? "Update Vehicle" : "Save Vehicle";
  vehicleCancelEditButton.classList.toggle("is-hidden", !isEditing);
  vehicleFormToggleButton.textContent = isEditing ? "Edit Vehicle" : "Add Vehicle";
  if (isEditing) {
    setVehicleFormExpanded(true);
  }
}

function resetVehicleFormMode() {
  editingVehicleId = null;
  vehicleForm.reset();
  updateVehicleFormMode();
  setVehicleFormExpanded(false);
}

function setVehicleFormExpanded(expanded) {
  isVehicleFormExpanded = expanded;
  vehicleFormPanel.classList.toggle("is-hidden", !expanded);
  vehicleFormToggleButton.setAttribute("aria-expanded", String(expanded));
  persistUiState();
}

function loadTireIntoForm(vehicleId, position) {
  const vehicle = state.vehicles.find((item) => item.id === vehicleId);
  if (!vehicle) {
    return;
  }

  const tire = vehicle.tires?.[position] ?? null;
  editingTireKey = `${vehicleId}:${position}`;
  tireEditForm.reset();
  tireEditForm.elements.mode.value = "edit";
  tireEditForm.elements.vehicleId.value = vehicleId;
  tireEditForm.elements.position.value = position;
  tireEditForm.elements.vehicleLabel.value = `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ""}`;
  tireEditForm.elements.positionLabel.value = TIRE_POSITIONS.find((item) => item.key === position)?.label ?? position;

  if (tire) {
    tireEditForm.elements.installDate.value = tire.installDate ?? "";
    tireEditForm.elements.installMileage.value =
      typeof tire.installMileage === "number" ? tire.installMileage : "";
    tireEditForm.elements.installer.value = tire.installer ?? "";
    tireEditForm.elements.brand.value = tire.brand ?? "";
    tireEditForm.elements.model.value = tire.model ?? "";
    tireEditForm.elements.type.value = tire.type ?? "";
    tireEditForm.elements.size.value = tire.size ?? "";
    tireEditForm.elements.treadDepth.value = getTireTreadRating(tire) ?? "";
    tireEditForm.elements.warrantyMiles.value =
      typeof tire.warrantyMiles === "number" ? tire.warrantyMiles : "";
    tireEditForm.elements.estimatedReplacementMileage.value =
      typeof tire.estimatedReplacementMileage === "number" ? tire.estimatedReplacementMileage : "";
    tireEditForm.elements.recommendedPressure.value =
      typeof tire.recommendedPressure === "number" ? tire.recommendedPressure : "";
    tireEditForm.elements.notes.value = tire.notes ?? "";
  }

  updateTireEditMode();
  setActiveScreen("garage");
  tireEditPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function updateTireEditMode() {
  const isEditing = Boolean(editingTireKey);
  tireEditPanel.classList.toggle("is-hidden", !isEditing);
  if (isEditing) {
    tireEditTitle.textContent = "Edit Tire Position";
  }
}

function resetTireEditMode() {
  editingTireKey = null;
  tireEditForm.reset();
  updateTireEditMode();
}

function setRecordFormExpanded(expanded) {
  isRecordFormExpanded = expanded;
  recordFormPanel.classList.toggle("is-hidden", !expanded);
  recordFormToggleButton.setAttribute("aria-expanded", String(expanded));
  persistUiState();
}

function buildServiceSummary(record) {
  const vehicle = state.vehicles.find((item) => item.id === record.vehicleId);
  if (!vehicle) {
    return null;
  }

  const totalMilesInterval = typeof record.repeatMiles === "number" ? record.repeatMiles : null;
  const milesDrivenSinceService =
    typeof totalMilesInterval === "number" ? Math.max(vehicle.currentMileage - record.mileageAtService, 0) : null;
  const nextDueMileage =
    typeof record.repeatMiles === "number" ? record.mileageAtService + record.repeatMiles : null;
  const nextDueDate =
    typeof record.repeatMonths === "number" ? addMonths(record.serviceDate, record.repeatMonths) : null;
  const dueByMileage = typeof nextDueMileage === "number" && vehicle.currentMileage >= nextDueMileage;
  const dueByDate = nextDueDate ? new Date(stripTime(nextDueDate)) <= new Date(stripTime(new Date())) : false;
  const milesRemaining = typeof nextDueMileage === "number" ? nextDueMileage - vehicle.currentMileage : null;
  const totalDaysInterval = typeof record.repeatMonths === "number" ? diffInDays(new Date(record.serviceDate), new Date(nextDueDate)) : null;
  const daysRemaining = nextDueDate ? diffInDays(new Date(), new Date(nextDueDate)) : null;
  const daysElapsed =
    typeof totalDaysInterval === "number" ? Math.max(totalDaysInterval - (daysRemaining ?? totalDaysInterval), 0) : null;

  if (!nextDueMileage && !nextDueDate) {
    return null;
  }

  let status = "ok";
  if (dueByMileage || dueByDate) {
    status = "due";
  } else if (
    (typeof milesRemaining === "number" && milesRemaining <= 500) ||
    (typeof daysRemaining === "number" && daysRemaining <= 30)
  ) {
    status = "upcoming";
  }

  let dueReason = "No due rule";
  if (status === "due") {
    dueReason = dueByMileage && dueByDate ? "Due by mileage and date" : dueByMileage ? "Due by mileage" : "Due by date";
  } else if (status === "upcoming") {
    dueReason =
      typeof milesRemaining === "number" && milesRemaining <= 500
        ? `${formatNumber(Math.max(milesRemaining, 0))} miles remaining`
        : `${Math.max(daysRemaining, 0)} days remaining`;
  } else {
    dueReason = nextDueDate
      ? `Next due ${formatDate(nextDueDate)}`
      : `Next due at ${formatNumber(nextDueMileage)} miles`;
  }

  return {
    ...record,
    vehicleLabel: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    currentMileage: vehicle.currentMileage,
    nextDueMileage,
    nextDueDate,
    totalMilesInterval,
    milesDrivenSinceService,
    milesRemaining,
    totalDaysInterval,
    daysElapsed,
    daysRemaining,
    status,
    badgeText: status === "due" ? "Needs attention" : status === "upcoming" ? "Upcoming" : "On track",
    dueReason,
  };
}

function tireCardMarkup(vehicle, tire, position) {
  if (!tire) {
    return `
      <details class="tire-dropdown tire-card">
        <summary class="tire-dropdown-summary">
          <span>
            <strong>${position.label}</strong>
            <span class="meta">No tire saved</span>
          </span>
          <span class="status-pill status-setup">Setup</span>
        </summary>
        <div class="tire-dropdown-content">
          <span class="meta">No tire saved for this position.</span>
          <div class="tire-card-actions">
            <button class="button-secondary" type="button" data-replace-tire="${position.key}" data-vehicle-id="${vehicle.id}">
              Replace tire
            </button>
            <button class="button-secondary" type="button" data-edit-tire="${position.key}" data-vehicle-id="${vehicle.id}">
              Edit tire
            </button>
          </div>
        </div>
      </details>
    `;
  }

  const milesOnTire = Math.max(vehicle.currentMileage - (tire.installMileage ?? vehicle.currentMileage), 0);
  const warrantyRemaining =
    typeof tire.warrantyMiles === "number" ? Math.max(tire.warrantyMiles - milesOnTire, 0) : null;
  const replacementRemaining =
    typeof tire.estimatedReplacementMileage === "number"
      ? Math.max(tire.estimatedReplacementMileage - vehicle.currentMileage, 0)
      : null;
  const totalEstimatedLife =
    typeof tire.estimatedReplacementMileage === "number" && typeof tire.installMileage === "number"
      ? Math.max(tire.estimatedReplacementMileage - tire.installMileage, 0)
      : null;
  const tireLifeProgress = buildProgressMeta(milesOnTire, totalEstimatedLife);
  const tireName = [tire.brand, tire.model].filter(Boolean).join(" ") || "Brand/model not saved";
  const treadRating = getTireTreadRating(tire);
  const treadBadge = getTreadRatingBadgeMeta(treadRating);
  const treadLabel = formatTreadRatingValue(treadRating);
  const summaryMeta = [
    tire.size || "Size not saved",
    typeof tire.recommendedPressure === "number" ? `${tire.recommendedPressure} PSI` : "PSI not saved",
    treadLabel,
  ].join(" • ");

  return `
    <details class="tire-dropdown tire-card">
      <summary class="tire-dropdown-summary">
        <span>
          <strong>${position.label}</strong>
          <span class="meta">${tireName}</span>
          <span class="meta">${summaryMeta}</span>
        </span>
        <span class="tire-summary-mileage">${formatNumber(milesOnTire)} mi</span>
        ${typeof treadRating === "number" ? statusPill(treadBadge.status, treadBadge.label) : ""}
      </summary>
      <div class="tire-dropdown-content">
        <div class="tire-tread-badge-row">
          <span class="meta">${treadLabel}</span>
          ${typeof treadRating === "number" ? statusPill(treadBadge.status, treadBadge.label) : ""}
        </div>
        <span class="meta field-helper">Higher number = more tread left. Tread rating goes down as the tire wears.</span>
        <span class="meta">Tire ID: ${tire.tireId || "Not saved"}</span>
        <span class="meta">Brand / model: ${tireName}</span>
        <span class="meta">Size: ${tire.size || "Not saved"}</span>
        <span class="meta">Starting tread rating: ${formatTreadRatingValue(normalizeTreadRating(tire.startingTreadDepth ?? treadRating))}</span>
        <span class="meta">Install date: ${safeFormatDate(tire.installDate)}</span>
        <span class="meta">Install mileage: ${
          typeof tire.installMileage === "number" ? `${formatNumber(tire.installMileage)} miles` : "Not saved"
        }</span>
        <span class="meta">Warranty miles: ${
          typeof tire.warrantyMiles === "number" ? formatNumber(tire.warrantyMiles) : "Not saved"
        }</span>
        <span class="meta">${
          warrantyRemaining !== null
            ? `Miles left on warranty: ${formatNumber(warrantyRemaining)}`
            : "Miles left on warranty: Not saved"
        }</span>
        <span class="meta">${
          typeof tire.estimatedReplacementMileage === "number"
            ? `Estimated replacement mileage: ${formatNumber(tire.estimatedReplacementMileage)}`
            : "Estimated replacement mileage not saved"
        }</span>
        <span class="meta">${
          replacementRemaining !== null
            ? `Miles left until estimated replacement: ${formatNumber(replacementRemaining)}`
            : "Miles left until estimated replacement: Not saved"
        }</span>
        ${
          tireLifeProgress
            ? progressBarMarkup(
                "Tire Life",
                tireLifeProgress.percent,
                `${formatNumber(milesOnTire)} driven`,
                `${formatNumber(replacementRemaining ?? 0)} remaining`
              )
            : ""
        }
        <span class="meta">${
          typeof tire.recommendedPressure === "number"
            ? `Recommended pressure: ${tire.recommendedPressure} PSI`
            : "Recommended pressure not saved"
        }</span>
        <span class="meta">Miles driven on current tire: ${formatNumber(milesOnTire)}</span>
        <div class="tire-card-actions">
          <button class="button-secondary" type="button" data-open-tire-rotation>Rotate / Move Tires</button>
          <button class="button-secondary" type="button" data-replace-tire="${position.key}" data-vehicle-id="${vehicle.id}">
            Replace tire
          </button>
          <button class="button-secondary" type="button" data-edit-tire="${position.key}" data-vehicle-id="${vehicle.id}">
            Edit tire
          </button>
          <button class="button-secondary" type="button" data-view-tire-history="${position.key}">
            View tire history
          </button>
        </div>
      </div>
    </details>
  `;
}

function formatTreadDepthValue(value) {
  return formatTreadRatingValue(value);
}

function nextUpLogMarkup(item, order) {
  const mileageProgress = buildProgressMeta(item.milesDrivenSinceService, item.totalMilesInterval);
  const timeProgress = buildProgressMeta(item.daysElapsed, item.totalDaysInterval);

  return `
    <div class="timeline-item">
      <div class="vehicle-summary">
        <strong>${order}. ${item.serviceType}</strong>
        ${statusPill(item.status, item.badgeText)}
      </div>
      <span class="meta">${item.vehicleLabel}</span>
      <span class="meta">
        Last service: ${formatDate(item.serviceDate)} at ${formatNumber(item.mileageAtService)} miles
      </span>
      <span class="meta">${item.dueReason}</span>
      <span class="meta">
        ${
          item.nextDueMileage
            ? `Target mileage: ${formatNumber(item.nextDueMileage)} miles`
            : "No mileage target saved"
        }
      </span>
      <span class="meta">
        ${item.nextDueDate ? `Target date: ${formatDate(item.nextDueDate)}` : "No date target saved"}
      </span>
      ${
        mileageProgress
          ? progressBarMarkup(
              "Miles",
              mileageProgress.percent,
              `${formatNumber(item.milesDrivenSinceService)} driven`,
              `${formatNumber(Math.max(item.milesRemaining, 0))} left`
            )
          : ""
      }
      ${
        timeProgress
          ? progressBarMarkup(
              "Time",
              timeProgress.percent,
              `${item.daysElapsed} days used`,
              `${Math.max(item.daysRemaining, 0)} days left`
            )
          : ""
      }
    </div>
  `;
}

function serviceScheduleMarkup(item) {
  const mileageProgress = buildProgressMeta(item.milesDrivenSinceService, item.totalMilesInterval);
  const timeProgress = buildProgressMeta(item.daysElapsed, item.totalDaysInterval);

  return `
    <article class="timeline-item schedule-card">
      <div class="vehicle-summary">
        <div>
          <strong>${item.serviceType}</strong>
          <span class="meta">${item.category}</span>
        </div>
        ${statusPill(item.displayStatus, item.displayBadgeText)}
      </div>
      <div class="schedule-meta-grid">
        <span class="meta">Interval: ${item.activeIntervalLabel}</span>
        <span class="meta">Next due: ${item.nextDueMileage ? `${formatNumber(item.nextDueMileage)} miles` : item.nextDueDate ? formatDate(item.nextDueDate) : "Not set"}</span>
        <span class="meta">Last service: ${item.lastServiceLabel}</span>
        <span class="meta">Status: ${item.displayBadgeText}</span>
      </div>
      <span class="meta">${item.dueReason}</span>
      ${
        mileageProgress
          ? progressBarMarkup(
              "Linear Progress Bar toward limit",
              mileageProgress.percent,
              `${formatNumber(item.milesDrivenSinceService)} driven`,
              `${formatNumber(Math.max(item.milesRemaining, 0))} left`
            )
          : ""
      }
      ${
        timeProgress
          ? progressBarMarkup(
              "Linear Progress Bar toward limit",
              timeProgress.percent,
              `${item.daysElapsed} days used`,
              `${Math.max(item.daysRemaining, 0)} days left`
            )
          : ""
      }
      <div class="schedule-meta-grid">
        <span class="meta">${item.description || "Custom recurring service plan"}</span>
        <span class="meta">${item.reminderLogic || "Shows due based on the saved mileage and/or month interval."}</span>
      </div>
      <div class="schedule-card-actions">
        <button class="button-secondary" type="button" data-edit-recurring-plan="${item.planKey}">
          Edit plan
        </button>
        ${
          item.isCustom
            ? `<button class="button-ghost button-ghost-neutral" type="button" data-delete-recurring-plan="${item.planKey}">
                 Delete custom
               </button>`
            : ""
        }
      </div>
    </article>
  `;
}

function getActiveScheduleVehicleId() {
  return activeDashboardVehicleId || dashboardVehicleSelect.value || state.vehicles[0]?.id || "";
}

function initializeCustomSchedulePlan() {
  editingSchedulePlanKey = null;
  schedulePlanForm.reset();
  schedulePlanForm.elements.planId.value = "";
  schedulePlanForm.elements.serviceKey.value = "";
  schedulePlanForm.elements.isCustom.value = "true";
  schedulePlanForm.elements.vehicleId.value = getActiveScheduleVehicleId();
  schedulePlanForm.elements.serviceName.readOnly = false;
  schedulePlanTitle.textContent = "Add Recurring Plan";
  updateSchedulePlanMode();
  setSchedulePlanExpanded(true);
}

function loadSchedulePlanIntoForm(plan) {
  editingSchedulePlanKey = plan.planKey;
  schedulePlanForm.reset();
  schedulePlanForm.elements.planId.value = plan.id ?? "";
  schedulePlanForm.elements.serviceKey.value = plan.serviceKey ?? "";
  schedulePlanForm.elements.isCustom.value = String(plan.isCustom);
  schedulePlanForm.elements.vehicleId.value = plan.vehicleId;
  schedulePlanForm.elements.serviceName.value = plan.serviceName;
  schedulePlanForm.elements.category.value = plan.category;
  schedulePlanForm.elements.intervalType.value = plan.intervalType;
  schedulePlanForm.elements.repeatMiles.value = plan.repeatMiles ?? "";
  schedulePlanForm.elements.repeatMonths.value = plan.repeatMonths ?? "";
  schedulePlanForm.elements.description.value = plan.description ?? "";
  schedulePlanForm.elements.reminderLogic.value = plan.reminderLogic ?? "";
  schedulePlanForm.elements.serviceName.readOnly = !plan.isCustom;
  schedulePlanTitle.textContent = `Edit ${plan.serviceName}`;
  updateSchedulePlanMode();
  setSchedulePlanExpanded(true);
  schedulePlanPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function updateSchedulePlanMode() {
  schedulePlanSubmitButton.textContent = editingSchedulePlanKey ? "Update Plan" : "Save Plan";
  schedulePlanToggleButton.textContent = editingSchedulePlanKey ? "Edit recurring plan" : "Add custom plan";
  schedulePlanToggleButton.setAttribute("aria-expanded", String(isSchedulePlanExpanded));
  schedulePlanDeleteButton?.classList.toggle("is-hidden", !editingSchedulePlanKey);
}

function resetSchedulePlanMode() {
  editingSchedulePlanKey = null;
  schedulePlanForm.reset();
  schedulePlanForm.elements.planId.value = "";
  schedulePlanForm.elements.serviceKey.value = "";
  schedulePlanForm.elements.isCustom.value = "";
  schedulePlanForm.elements.vehicleId.value = getActiveScheduleVehicleId();
  schedulePlanForm.elements.serviceName.readOnly = false;
  schedulePlanTitle.textContent = "Add Recurring Plan";
  setSchedulePlanExpanded(false);
  updateSchedulePlanMode();
}

function setSchedulePlanExpanded(expanded) {
  isSchedulePlanExpanded = expanded;
  schedulePlanPanel.classList.toggle("is-hidden", !expanded);
  schedulePlanToggleButton.setAttribute("aria-expanded", String(expanded));
  persistUiState();
}

function getRecurringTemplateByKey(serviceKey) {
  return RECURRING_SERVICE_TEMPLATES.find((template) => template.key === cleanText(serviceKey)) ?? null;
}

function findRecurringTemplateByRawName(serviceName) {
  const normalizedName = normalizeServiceLookupKey(serviceName);
  return (
    RECURRING_SERVICE_TEMPLATES.find(
      (template) =>
        normalizeServiceLookupKey(template.serviceName) === normalizedName ||
        template.aliases.some((alias) => normalizeServiceLookupKey(alias) === normalizedName)
    ) ?? null
  );
}

function getRecurringTemplateByName(serviceName) {
  const serviceDefinition = getServiceDefinition(serviceName);
  const candidateNames = [
    serviceDefinition?.baseName,
    serviceDefinition?.name,
    ...(serviceDefinition?.aliases || []),
    serviceName,
  ].filter(Boolean);

  for (const candidateName of candidateNames) {
    const template = findRecurringTemplateByRawName(candidateName);
    if (template) {
      return template;
    }
  }

  return null;
}

function getCanonicalServiceType(serviceName) {
  return getServiceDefinition(serviceName)?.name || cleanText(serviceName);
}

function createDefaultRecurringPlan(vehicleId, template) {
  return {
    id: `${vehicleId}:${template.key}`,
    vehicleId,
    serviceKey: template.key,
    serviceName: template.serviceName,
    category: template.category,
    intervalType: template.intervalType,
    repeatMiles: template.defaultRepeatMiles ?? null,
    repeatMonths: template.defaultRepeatMonths ?? null,
    defaultIntervalLabel: template.defaultIntervalLabel,
    description: template.description,
    reminderLogic: template.reminderLogic,
    reminderMilesBeforeDue: 500,
    reminderDaysBeforeDue: 7,
    enabled: template.defaultEnabled ?? true,
    isCustom: false,
    aliases: template.aliases ?? [],
  };
}

function getDisplayRecurringPlans(vehicleId) {
  const overrides = state.recurringPlans.filter((plan) => plan.vehicleId === vehicleId);
  const templatePlans = RECURRING_SERVICE_TEMPLATES.map((template) => {
    const override = overrides.find((plan) => !plan.isCustom && plan.serviceKey === template.key);
    if (override?.removed) {
      return null;
    }

    return {
      ...createDefaultRecurringPlan(vehicleId, template),
      ...override,
      planKey: template.key,
    };
  }).filter(Boolean);
  const customPlans = overrides
    .filter((plan) => plan.isCustom)
    .map((plan) => ({
      ...plan,
      planKey: plan.id,
      defaultIntervalLabel: plan.defaultIntervalLabel || describePlanInterval(plan),
    }));

  return [...templatePlans, ...customPlans];
}

function getRecurringPlanByKey(planKey) {
  const vehicleId = getActiveScheduleVehicleId();
  return getDisplayRecurringPlans(vehicleId).find((plan) => plan.planKey === cleanText(planKey)) ?? null;
}

function getExistingRecurringPlanForService(vehicleId, serviceType) {
  const normalizedServiceType = normalizeServiceLookupKey(serviceType);
  if (!normalizedServiceType) {
    return null;
  }

  return (
    state.recurringPlans.find((plan) => {
      if (plan.vehicleId !== vehicleId) {
        return false;
      }

      const planNames = [plan.serviceName].concat(plan.aliases ?? []);
      return planNames.some((name) => normalizeServiceLookupKey(name) === normalizedServiceType);
    }) ?? null
  );
}

function getIntervalTypeFromRepeats(repeatMiles, repeatMonths) {
  if (typeof repeatMiles === "number" && typeof repeatMonths === "number") {
    return "both";
  }
  if (typeof repeatMiles === "number") {
    return "mileage-based";
  }
  if (typeof repeatMonths === "number") {
    return "time-based";
  }
  return "both";
}

function syncRecurringPlansFromLoggedServices(vehicleId, records) {
  records.forEach((record) => {
    const repeatMiles = typeof record.repeatMiles === "number" ? record.repeatMiles : null;
    const repeatMonths = typeof record.repeatMonths === "number" ? record.repeatMonths : null;
    if (repeatMiles === null && repeatMonths === null) {
      return;
    }

    const matchingTemplate = getRecurringTemplateByName(record.serviceType);
    const existingPlan = getExistingRecurringPlanForService(vehicleId, record.serviceType);
    const intervalType = getIntervalTypeFromRepeats(repeatMiles, repeatMonths);
    const canonicalServiceType = getCanonicalServiceType(record.serviceType);

    const planPayload = matchingTemplate
      ? {
          ...createDefaultRecurringPlan(vehicleId, matchingTemplate),
          ...existingPlan,
          vehicleId,
          serviceKey: matchingTemplate.key,
          serviceName: matchingTemplate.serviceName,
          category: getServiceCategory(canonicalServiceType),
          intervalType,
          repeatMiles,
          repeatMonths,
          enabled: existingPlan?.enabled ?? true,
          reminderMilesBeforeDue: existingPlan?.reminderMilesBeforeDue ?? 500,
          reminderDaysBeforeDue: existingPlan?.reminderDaysBeforeDue ?? 7,
          aliases: matchingTemplate.aliases ?? [],
          isCustom: false,
        }
      : {
          id: existingPlan?.id ?? crypto.randomUUID(),
          vehicleId,
          serviceKey: existingPlan?.serviceKey || `custom:${normalizeServiceLookupKey(canonicalServiceType)}`,
          serviceName: canonicalServiceType,
          category: record.category || getServiceCategory(canonicalServiceType),
          intervalType,
          repeatMiles,
          repeatMonths,
          defaultIntervalLabel: describePlanInterval({ intervalType, repeatMiles, repeatMonths }),
          description: existingPlan?.description ?? "",
          reminderLogic: existingPlan?.reminderLogic ?? "",
          reminderMilesBeforeDue: existingPlan?.reminderMilesBeforeDue ?? 500,
          reminderDaysBeforeDue: existingPlan?.reminderDaysBeforeDue ?? 7,
          enabled: existingPlan?.enabled ?? true,
          isCustom: true,
          aliases: existingPlan?.aliases ?? [],
        };

    upsertRecurringPlan(planPayload);
  });
}

function upsertRecurringPlan(planPayload) {
  const existingIndex = state.recurringPlans.findIndex((plan) =>
    plan.isCustom
      ? plan.id === planPayload.id
      : !plan.isCustom && plan.vehicleId === planPayload.vehicleId && plan.serviceKey === planPayload.serviceKey
  );

  if (existingIndex >= 0) {
    state.recurringPlans[existingIndex] = {
      ...state.recurringPlans[existingIndex],
      ...planPayload,
    };
  } else {
    state.recurringPlans.unshift(planPayload);
  }
}

function getLatestRecordForRecurringPlan(vehicleId, plan) {
  const matchNames = [plan.serviceName].concat(plan.aliases ?? []).map((name) => normalizeServiceLookupKey(name));
  return [...state.records]
    .filter(
      (record) => record.vehicleId === vehicleId && matchNames.includes(normalizeServiceLookupKey(record.serviceType))
    )
    .sort((a, b) => new Date(b.serviceDate) - new Date(a.serviceDate) || b.mileageAtService - a.mileageAtService)[0] ?? null;
}

function buildRecurringPlanSummary(plan, vehicle) {
  const lastRecord = getLatestRecordForRecurringPlan(vehicle.id, plan);
  const repeatMiles = typeof plan.repeatMiles === "number" ? plan.repeatMiles : null;
  const repeatMonths = typeof plan.repeatMonths === "number" ? plan.repeatMonths : null;
  const nextDueMileage = lastRecord && repeatMiles ? lastRecord.mileageAtService + repeatMiles : null;
  const nextDueDate = lastRecord && repeatMonths ? addMonths(lastRecord.serviceDate, repeatMonths) : null;
  const milesDrivenSinceService =
    lastRecord && repeatMiles ? Math.max(vehicle.currentMileage - lastRecord.mileageAtService, 0) : null;
  const milesRemaining = typeof nextDueMileage === "number" ? nextDueMileage - vehicle.currentMileage : null;
  const totalDaysInterval =
    lastRecord && repeatMonths ? diffInDays(new Date(lastRecord.serviceDate), new Date(nextDueDate)) : null;
  const daysRemaining = nextDueDate ? diffInDays(new Date(), new Date(nextDueDate)) : null;
  const daysElapsed =
    typeof totalDaysInterval === "number" ? Math.max(totalDaysInterval - (daysRemaining ?? totalDaysInterval), 0) : null;
  const dueSoonMiles = 500;
  const dueSoonDays = 30;

  let status = "ok";
  let badgeText = "Good";
  let dueReason = "Service plan is on track.";

  if (!repeatMiles && !repeatMonths) {
    status = "setup";
    badgeText = "Needs setup";
    dueReason = "Add a mileage or month interval to start scheduling this plan.";
  } else if (!lastRecord) {
    status = "setup";
    badgeText = "Needs setup";
    dueReason = "Log the first service visit to calculate the next due service.";
  } else {
    const dueByMileage = typeof nextDueMileage === "number" && vehicle.currentMileage >= nextDueMileage;
    const dueByDate = nextDueDate ? new Date(stripTime(nextDueDate)) <= new Date(stripTime(new Date())) : false;

    if (dueByMileage || dueByDate) {
      status = "due";
      badgeText = "Overdue";
      dueReason = dueByMileage && dueByDate ? "Overdue by mileage and date." : dueByMileage ? "Overdue by mileage." : "Overdue by date.";
    } else if (
      (typeof milesRemaining === "number" && milesRemaining <= dueSoonMiles) ||
      (typeof daysRemaining === "number" && daysRemaining <= dueSoonDays)
    ) {
      status = "upcoming";
      badgeText = "Due soon";
      dueReason =
        typeof milesRemaining === "number" && milesRemaining <= dueSoonMiles
          ? `${formatNumber(Math.max(milesRemaining, 0))} miles left before this is due.`
          : `${Math.max(daysRemaining, 0)} days left before this is due.`;
    }
  }

  return {
    ...plan,
    planKey: plan.planKey ?? (plan.isCustom ? plan.id : plan.serviceKey),
    vehicleLabel: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    currentMileage: vehicle.currentMileage,
    lastRecord,
    serviceType: plan.serviceName,
    nextDueMileage,
    nextDueDate,
    totalMilesInterval: repeatMiles,
    totalDaysInterval,
    milesDrivenSinceService,
    milesRemaining,
    daysElapsed,
    daysRemaining,
    status,
    badgeText,
    displayStatus: status === "due" ? "due" : status === "upcoming" ? "upcoming" : "ok",
    displayBadgeText: status === "due" ? "Overdue" : status === "upcoming" ? "Due soon" : "Good",
    dueReason,
    intervalTypeLabel:
      plan.intervalType === "mileage-based"
        ? "Mileage"
        : plan.intervalType === "time-based"
          ? "Time"
          : "Mileage + Time",
    defaultIntervalLabel: plan.defaultIntervalLabel || describePlanInterval(plan),
    activeIntervalLabel: describePlanInterval(plan),
    lastServiceLabel: lastRecord
      ? `Last service: ${formatDate(lastRecord.serviceDate)} at ${formatNumber(lastRecord.mileageAtService)} miles`
      : "Last service: not logged yet",
    nextDueLabel: buildNextDueLabel(nextDueMileage, nextDueDate, Boolean(lastRecord)),
  };
}

function buildNextDueLabel(nextDueMileage, nextDueDate, hasLastRecord) {
  if (!hasLastRecord) {
    return "Next due: waiting for first service log";
  }
  if (nextDueMileage && nextDueDate) {
    return `Next due: ${formatNumber(nextDueMileage)} miles or ${formatDate(nextDueDate)}`;
  }
  if (nextDueMileage) {
    return `Next due: ${formatNumber(nextDueMileage)} miles`;
  }
  if (nextDueDate) {
    return `Next due: ${formatDate(nextDueDate)}`;
  }
  return "Next due: add an interval to schedule this reminder";
}

function describePlanInterval(plan) {
  if (plan.intervalType === "both") {
    const parts = [];
    if (typeof plan.repeatMiles === "number") {
      parts.push(`${formatNumber(plan.repeatMiles)} miles`);
    }
    if (typeof plan.repeatMonths === "number") {
      parts.push(`${plan.repeatMonths} month${plan.repeatMonths === 1 ? "" : "s"}`);
    }
    return parts.length ? `Every ${parts.join(" or ")}` : "Custom interval not set";
  }
  if (plan.intervalType === "mileage-based") {
    return typeof plan.repeatMiles === "number" ? `Every ${formatNumber(plan.repeatMiles)} miles` : "Mileage interval not set";
  }
  if (plan.intervalType === "time-based") {
    return typeof plan.repeatMonths === "number" ? `Every ${plan.repeatMonths} month${plan.repeatMonths === 1 ? "" : "s"}` : "Time interval not set";
  }
  return "Custom interval not set";
}

function sortRecurringPlanSummaries(a, b) {
  const weight = { due: 0, upcoming: 1, ok: 2, setup: 3, off: 4 };
  if (weight[a.status] !== weight[b.status]) {
    return weight[a.status] - weight[b.status];
  }

  const aUrgency = getUrgencySortValue(a);
  const bUrgency = getUrgencySortValue(b);
  return aUrgency - bUrgency || a.category.localeCompare(b.category) || a.serviceName.localeCompare(b.serviceName);
}

function progressBarMarkup(label, percent, leadingText, trailingText) {
  return `
    <div class="progress-block">
      <div class="vehicle-summary">
        <span class="meta">${label}</span>
        <span class="meta">${Math.round(percent)}%</span>
      </div>
      <div class="progress-track" aria-hidden="true">
        <div class="progress-fill" style="width: ${percent}%"></div>
      </div>
      <div class="vehicle-summary">
        <span class="meta">${leadingText}</span>
        <span class="meta">${trailingText}</span>
      </div>
    </div>
  `;
}

function buildProgressMeta(elapsed, total) {
  if (typeof elapsed !== "number" || typeof total !== "number" || total <= 0) {
    return null;
  }

  return {
    percent: Math.max(0, Math.min((elapsed / total) * 100, 100)),
  };
}

function statusPill(status, text) {
  const className =
    status === "due"
      ? "status-pill status-due"
      : status === "upcoming"
        ? "status-pill status-upcoming"
        : status === "off"
          ? "status-pill status-off"
          : status === "setup"
            ? "status-pill status-setup"
            : "status-pill status-ok";
  return `<span class="${className}">${text}</span>`;
}

function renderServiceTypeOptions() {
  serviceTypeOptions.innerHTML = getAvailableServiceTypes()
    .sort((a, b) => a.localeCompare(b))
    .map((type) => `<option value="${type}"></option>`)
    .join("");
}

function seedCarfaxData() {
  const vehicleId = "vehicle-2015-honda-crv-3czrm3h50fg710298";
  const carfaxAlreadyImported =
    state.vehicles.some((vehicle) => vehicle.id === vehicleId || cleanText(vehicle.vin).toUpperCase() === "3CZRM3H50FG710298") &&
    state.records.some((record) => record.vehicleId === vehicleId && record.id.startsWith("carfax-dashboard-2026-03-12"));

  if (localStorage.getItem(CARFAX_IMPORT_KEY) && carfaxAlreadyImported) {
    return;
  }

  const now = new Date().toISOString();
  const vehiclePayload = {
    id: vehicleId,
    year: 2015,
    make: "Honda",
    model: "CR-V",
    trim: "EX",
    vin: "3CZRM3H50FG710298",
    purchaseMileage: 5,
    engineSpec: "2.4L I4",
    drivetrain: "FWD",
    fuelType: "Gas",
    oilCapacity: "4.4 qt",
    vehicleTireSize: "225/65 R17",
    vehicleRecommendedPsi: 32,
    notes:
      "SUV. 1 owner. Minor damage reported 02/01/2024. Recently serviced before sale in Nov 2025. Current owner added 2026 maintenance records.",
    currentMileage: 137404,
    createdAt: now,
    documents: [],
    archivedTires: [],
    tireRotationHistory: [],
    tires: {
      frontLeft: carfaxTire("frontLeft", vehicleId, {
        id: "tire-2026-front-left-placeholder",
        installDate: "2026-03-12",
        installMileage: 137404,
        startingTreadDepth: 10,
        warrantyMiles: 50000,
        estimatedReplacementMileage: 187500,
        recommendedPressure: 32,
        installer: "Discount Tire",
        notes:
          "Two tires replaced on 03/12/2026. Exact replaced positions were not listed in CARFAX, so this is a placeholder position to edit later if needed.",
      }),
      frontRight: carfaxTire("frontRight", vehicleId, {
        id: "tire-2026-front-right-placeholder",
        installDate: "2026-03-12",
        installMileage: 137404,
        startingTreadDepth: 10,
        warrantyMiles: 50000,
        estimatedReplacementMileage: 187500,
        recommendedPressure: 32,
        installer: "Discount Tire",
        notes:
          "Two tires replaced on 03/12/2026. Exact replaced positions were not listed in CARFAX, so this is a placeholder position to edit later if needed.",
      }),
      rearLeft: carfaxTire("rearLeft", vehicleId, {
        id: "tire-unknown-rear-left-placeholder",
        installDate: "",
        installMileage: null,
        warrantyMiles: null,
        estimatedReplacementMileage: null,
        recommendedPressure: 32,
        installer: "",
        notes: "Tire details not available in the latest CARFAX dashboard data.",
      }),
      rearRight: carfaxTire("rearRight", vehicleId, {
        id: "tire-unknown-rear-right-placeholder",
        installDate: "",
        installMileage: null,
        warrantyMiles: null,
        estimatedReplacementMileage: null,
        recommendedPressure: 32,
        installer: "",
        notes: "Tire details not available in the latest CARFAX dashboard data.",
      }),
    },
  };

  const existingVehicleIndex = state.vehicles.findIndex(
    (vehicle) => vehicle.id === vehicleId || cleanText(vehicle.vin).toUpperCase() === vehiclePayload.vin
  );
  if (existingVehicleIndex >= 0) {
    state.vehicles[existingVehicleIndex] = normalizeVehicleTireData({
      ...state.vehicles[existingVehicleIndex],
      ...vehiclePayload,
      documents: state.vehicles[existingVehicleIndex].documents || [],
      createdAt: state.vehicles[existingVehicleIndex].createdAt || vehiclePayload.createdAt,
    });
  } else {
    state.vehicles.unshift(normalizeVehicleTireData(vehiclePayload));
  }

  const carfaxRecords = buildCarfaxServiceRecords(vehicleId);
  state.records = state.records.filter((record) => record.vehicleId !== vehicleId || !record.id.startsWith("carfax-"));
  state.records.unshift(...carfaxRecords);
  syncRecurringPlansFromLoggedServices(vehicleId, carfaxRecords);
  syncActiveVehicle(vehicleId);
  persist();
  localStorage.setItem(CARFAX_IMPORT_KEY, "complete");
}

function carfaxTire(position, vehicleId, overrides) {
  const startingTreadDepth = typeof overrides.startingTreadDepth === "number" ? overrides.startingTreadDepth : null;
  const installMileage = overrides.installMileage ?? 0;
  const installDate = overrides.installDate || "";

  return {
    id: overrides.id,
    tireId: overrides.id,
    vehicleId,
    position,
    brand: "",
    model: "",
    type: "All-season",
    size: "",
    startingTreadDepth,
    currentTreadDepth: startingTreadDepth,
    treadDepth: startingTreadDepth,
    treadHistory:
      typeof startingTreadDepth === "number"
        ? [
            {
              tireId: overrides.id,
              depth: startingTreadDepth,
              mileage: installMileage,
              date: installDate,
              unit: "rating",
              notes: "Estimated new tire tread rating from CARFAX-derived entry.",
            },
          ]
        : [],
    warrantyMiles: overrides.warrantyMiles ?? null,
    estimatedReplacementMileage: overrides.estimatedReplacementMileage ?? null,
    recommendedPressure: overrides.recommendedPressure ?? null,
    installDate,
    installMileage,
    installer: overrides.installer || "",
    notes: overrides.notes || "",
    status: "active",
    positionHistory: [
      {
        position,
        fromDate: installDate,
        fromMileage: installMileage,
        toDate: null,
        toMileage: null,
      },
    ],
    rotationHistory: [],
    replacementHistory: [],
    updatedAt: new Date().toISOString(),
  };
}

function buildCarfaxServiceRecords(vehicleId) {
  const visitRecords = [];
  const addVisit = ({ date, mileage, shop, services }) => {
    services.forEach((service, index) => {
      const serviceType = getCanonicalServiceType(service.serviceType);
      visitRecords.push({
        id: `carfax-dashboard-${date}-${mileage}-${index}-${normalizeServiceLookupKey(serviceType).replace(/\s+/g, "-")}`,
        vehicleId,
        serviceType,
        category: service.category || getServiceCategory(serviceType),
        serviceDate: date,
        mileageAtService: mileage,
        repeatMiles: service.repeatMiles ?? null,
        repeatMonths: service.repeatMonths ?? null,
        cost: null,
        shop,
        notes: service.notes || "",
        tireDetails: service.tireDetails || null,
        receiptName: "",
        receiptData: "",
        createdAt: `${date}T12:00:00.000Z`,
        updatedAt: new Date().toISOString(),
      });
    });
  };

  addVisit({
    date: "2026-03-12",
    mileage: 137404,
    shop: "Discount Tire",
    services: [
      {
        serviceType: "Tire replacement",
        repeatMiles: 50000,
        repeatMonths: 48,
        notes: "Two tires replaced, mounted, balanced, and dismounted.",
        tireDetails: {
          brand: "",
          model: "",
          type: "",
          size: "",
          treadDepth: 10,
          warrantyMiles: 50000,
          estimatedReplacementMileage: 187500,
          recommendedPressure: 32,
          position: "multiple",
          positions: [],
          notes: "Unknown position. Two tires replaced; exact positions were not specified in the CARFAX dashboard data.",
        },
      },
      { serviceType: "Tire balance", repeatMiles: 10000, notes: "Tires mounted, balanced, and dismounted." },
    ],
  });
  addVisit({
    date: "2026-03-08",
    mileage: 137131,
    shop: "Take 5 Oil Change",
    services: [
      { serviceType: "Oil change", repeatMiles: 5000, repeatMonths: 6, notes: "Routine oil change." },
      { serviceType: "Oil filter replacement", repeatMiles: 5000, repeatMonths: 6, notes: "Routine oil change." },
    ],
  });
  addVisit({
    date: "2026-01-27",
    mileage: 130242,
    shop: "Texas Motor Vehicle Dept.",
    services: [{ serviceType: "Safety inspection", repeatMonths: 12, notes: "State inspection performed." }],
  });
  addVisit({
    date: "2026-01-16",
    mileage: 134049,
    shop: "Texas",
    services: [{ serviceType: "Vehicle inspection", notes: "Registration / state record entry." }],
  });
  addVisit({
    date: "2025-11-23",
    mileage: 130200,
    shop: "Howdy Honda",
    services: [
      { serviceType: "Wheel alignment", repeatMiles: 15000, repeatMonths: 12, notes: "Alignment checked. Vehicle washed/detailed." },
      { serviceType: "Brake inspection", repeatMiles: 10000, repeatMonths: 12, notes: "Brakes checked." },
      { serviceType: "Oil change", repeatMiles: 5000, repeatMonths: 6, notes: "Oil and filter changed." },
      { serviceType: "Oil filter replacement", repeatMiles: 5000, repeatMonths: 6, notes: "Oil and filter changed." },
      { serviceType: "Transmission fluid change", repeatMiles: 60000, repeatMonths: 48, notes: "Transmission fluid changed." },
      { serviceType: "Vehicle wash/detail", notes: "Vehicle washed/detailed." },
    ],
  });
  addVisit({
    date: "2025-11-21",
    mileage: 130214,
    shop: "Texas Inspection Station",
    services: [{ serviceType: "Emissions test", repeatMonths: 12, notes: "Passed emissions inspection." }],
  });
  addVisit({
    date: "2025-05-16",
    mileage: 126597,
    shop: "First Texas Honda",
    services: [
      { serviceType: "Oil change", repeatMiles: 5000, repeatMonths: 6, notes: "Oil and filter changed." },
      { serviceType: "Oil filter replacement", repeatMiles: 5000, repeatMonths: 6, notes: "Oil and filter changed." },
      { serviceType: "Tire replacement", repeatMiles: 50000, repeatMonths: 48, notes: "Tires mounted." },
      { serviceType: "Tire balance", repeatMiles: 10000, notes: "Tires balanced." },
      { serviceType: "Tire rotation", repeatMiles: 5000, repeatMonths: 6, notes: "Tires rotated." },
    ],
  });
  addVisit({
    date: "2025-02-01",
    mileage: 124830,
    shop: "Texas Motor Vehicle Dept.",
    services: [{ serviceType: "Vehicle inspection", repeatMonths: 12, notes: "Registration issued/renewed." }],
  });
  addVisit({
    date: "2025-01-31",
    mileage: 124821,
    shop: "Texas Inspection Station",
    services: [{ serviceType: "Emissions test", repeatMonths: 12, notes: "Passed emissions inspection." }],
  });
  addVisit({
    date: "2024-11-25",
    mileage: 124101,
    shop: "First Texas Honda",
    services: [
      { serviceType: "Vehicle inspection", notes: "Maintenance inspection completed." },
      { serviceType: "Coolant flush", repeatMiles: 50000, repeatMonths: 36, notes: "Antifreeze/coolant flushed/changed." },
      { serviceType: "Fuel system service", notes: "Fuel system cleaned/serviced." },
      { serviceType: "Oil change", repeatMiles: 5000, repeatMonths: 6, notes: "Oil and filter changed." },
      { serviceType: "Oil filter replacement", repeatMiles: 5000, repeatMonths: 6, notes: "Oil and filter changed." },
      { serviceType: "Tire rotation", repeatMiles: 5000, repeatMonths: 6, notes: "Tires rotated." },
      { serviceType: "Transmission fluid change", repeatMiles: 60000, repeatMonths: 48, notes: "Transmission fluid changed. Transmission serviced." },
    ],
  });
  addVisit({
    date: "2024-03-07",
    mileage: 119265,
    shop: "Oil Works Inc",
    services: [
      { serviceType: "Vehicle inspection", notes: "Maintenance inspection completed." },
      { serviceType: "Oil change", repeatMiles: 5000, repeatMonths: 6, notes: "Routine oil and filter change." },
      { serviceType: "Oil filter replacement", repeatMiles: 5000, repeatMonths: 6, notes: "Routine oil and filter change." },
    ],
  });
  addVisit({
    date: "2024-01-31",
    mileage: 118964,
    shop: "Oil Works Inc",
    services: [
      { serviceType: "Emissions test", repeatMonths: 12, notes: "Emissions inspection." },
      { serviceType: "Safety inspection", repeatMonths: 12, notes: "Safety inspection." },
    ],
  });
  addVisit({
    date: "2023-08-25",
    mileage: 115642,
    shop: "Walpole Tire",
    services: [{ serviceType: "Tire repair", notes: "Tire repaired." }],
  });
  addVisit({
    date: "2023-03-30",
    mileage: 111002,
    shop: "First Texas Honda",
    services: [
      { serviceType: "Vehicle inspection", notes: "Maintenance inspection completed." },
      { serviceType: "Brake fluid service", repeatMonths: 24, notes: "Brake fluid flushed/changed." },
      { serviceType: "Brake rotor resurfacing", repeatMiles: 30000, repeatMonths: 36, notes: "Front and rear brake rotors resurfaced." },
      { serviceType: "Brake pad replacement", repeatMiles: 30000, repeatMonths: 36, notes: "Front and rear brake pads replaced." },
      { serviceType: "Exterior light check", notes: "Front license plate bracket installed/replaced." },
    ],
  });
  addVisit({
    date: "2023-02-22",
    mileage: 110203,
    shop: "First Texas Honda",
    services: [
      { serviceType: "Cabin air filter replacement", repeatMiles: 15000, repeatMonths: 12, notes: "Cabin air filter replaced/cleaned." },
      { serviceType: "Tire pressure check", repeatMonths: 1, notes: "Tire condition and pressure checked." },
      { serviceType: "Tire balance", repeatMiles: 10000, notes: "Tires balanced." },
      { serviceType: "Tire replacement", repeatMiles: 50000, repeatMonths: 48, notes: "Tires mounted." },
      { serviceType: "Tire rotation", repeatMiles: 5000, repeatMonths: 6, notes: "Tires rotated." },
    ],
  });
  addVisit({
    date: "2022-06-14",
    mileage: 102765,
    shop: "Honda of Covington",
    services: [
      { serviceType: "Vehicle inspection", notes: "Maintenance inspection completed." },
      { serviceType: "Coolant flush", repeatMiles: 50000, repeatMonths: 60, notes: "Antifreeze/coolant flushed/changed." },
      { serviceType: "Serpentine belt replacement", repeatMiles: 90000, repeatMonths: 60, notes: "Drive belts and serpentine belt replaced." },
      { serviceType: "Oil change", repeatMiles: 5000, repeatMonths: 6, notes: "Oil and filter changed." },
      { serviceType: "Oil filter replacement", repeatMiles: 5000, repeatMonths: 6, notes: "Oil and filter changed." },
      { serviceType: "Spark plug replacement", repeatMiles: 100000, repeatMonths: 60, notes: "Spark plugs replaced." },
      { serviceType: "Tire rotation", repeatMiles: 5000, repeatMonths: 6, notes: "Tires rotated." },
    ],
  });
  addVisit({
    date: "2021-11-10",
    mileage: 93895,
    shop: "Honda of Covington",
    services: [
      {
        serviceType: "Tire replacement",
        repeatMiles: 50000,
        repeatMonths: 48,
        notes: "Four tires replaced.",
        tireDetails: {
          brand: "",
          model: "",
          type: "",
          size: "",
          treadDepth: null,
          warrantyMiles: 50000,
          estimatedReplacementMileage: 143895,
          recommendedPressure: 32,
          position: "multiple",
          positions: ["frontLeft", "frontRight", "rearLeft", "rearRight"],
          notes: "Four tires replaced from screenshot shop visit.",
        },
      },
      { serviceType: "Wheel alignment", repeatMiles: 15000, repeatMonths: 12, notes: "Four wheel alignment performed." },
    ],
  });
  addVisit({
    date: "2021-01-13",
    mileage: 82404,
    shop: "Honda of Covington",
    services: [
      { serviceType: "Vehicle inspection", notes: "Maintenance inspection completed." },
      { serviceType: "Engine air filter replacement", repeatMiles: 15000, repeatMonths: 12, notes: "Air filter replaced." },
      { serviceType: "Brake fluid service", repeatMonths: 24, notes: "Brake fluid flushed/changed." },
      { serviceType: "Oil change", repeatMiles: 5000, repeatMonths: 6, notes: "Oil and filter changed." },
      { serviceType: "Oil filter replacement", repeatMiles: 5000, repeatMonths: 6, notes: "Oil and filter changed." },
      { serviceType: "Wiper blade replacement", repeatMonths: 12, notes: "Rear wiper blade replaced. Wipers replaced." },
      { serviceType: "Tire pressure check", repeatMonths: 1, notes: "Tire condition and pressure checked." },
      { serviceType: "Tire rotation", repeatMiles: 5000, repeatMonths: 6, notes: "Tires rotated." },
    ],
  });
  addVisit({
    date: "2020-07-02",
    mileage: 74927,
    shop: "Honda of Covington",
    services: [
      { serviceType: "Brake rotor resurfacing", repeatMiles: 30000, repeatMonths: 36, notes: "Brake rotors resurfaced." },
      { serviceType: "Brake pad replacement", repeatMiles: 30000, repeatMonths: 36, notes: "Front brake pads replaced." },
      { serviceType: "Oil change", repeatMiles: 5000, repeatMonths: 6, notes: "Oil and filter changed." },
      { serviceType: "Oil filter replacement", repeatMiles: 5000, repeatMonths: 6, notes: "Oil and filter changed." },
      { serviceType: "Tire pressure check", repeatMonths: 1, notes: "Tires checked." },
      { serviceType: "Tire rotation", repeatMiles: 5000, repeatMonths: 6, notes: "Tires rotated." },
      { serviceType: "Transmission fluid change", repeatMiles: 60000, repeatMonths: 48, notes: "Transmission fluid changed and flushed." },
    ],
  });
  addVisit({
    date: "2019-11-18",
    mileage: 68165,
    shop: "Honda of Covington",
    services: [
      { serviceType: "Tire pressure check", repeatMonths: 1, notes: "Tire condition and pressure checked." },
      { serviceType: "Tire rotation", repeatMiles: 5000, repeatMonths: 6, notes: "Tires rotated." },
    ],
  });
  addVisit({
    date: "2018-12-12",
    mileage: 59643,
    shop: "Honda of Covington",
    services: [
      { serviceType: "Engine air filter replacement", repeatMiles: 15000, repeatMonths: 12, notes: "Air filter replaced." },
      { serviceType: "Brake fluid service", repeatMonths: 24, notes: "Brake fluid flushed/changed." },
      { serviceType: "Cabin air filter replacement", repeatMiles: 15000, repeatMonths: 12, notes: "Cabin air filter replaced/cleaned." },
      { serviceType: "Oil change", repeatMiles: 5000, repeatMonths: 6, notes: "Oil and filter changed." },
      { serviceType: "Oil filter replacement", repeatMiles: 5000, repeatMonths: 6, notes: "Oil and filter changed." },
      { serviceType: "Tire pressure check", repeatMonths: 1, notes: "Tire condition and pressure checked." },
      { serviceType: "Tire rotation", repeatMiles: 5000, repeatMonths: 6, notes: "Tires rotated." },
    ],
  });
  addVisit({
    date: "2017-12-05",
    mileage: 42131,
    shop: "Honda of Covington",
    services: [
      {
        serviceType: "Tire replacement",
        repeatMiles: 50000,
        repeatMonths: 48,
        notes: "Four tires replaced.",
        tireDetails: {
          brand: "",
          model: "",
          type: "",
          size: "",
          treadDepth: null,
          warrantyMiles: 50000,
          estimatedReplacementMileage: 92131,
          recommendedPressure: 32,
          position: "multiple",
          positions: ["frontLeft", "frontRight", "rearLeft", "rearRight"],
          notes: "Four tires replaced from screenshot shop visit.",
        },
      },
      { serviceType: "Wiper blade replacement", repeatMonths: 12, notes: "Front wiper blades replaced." },
      { serviceType: "Oil change", repeatMiles: 5000, repeatMonths: 6, notes: "Oil and filter changed." },
      { serviceType: "Oil filter replacement", repeatMiles: 5000, repeatMonths: 6, notes: "Oil and filter changed." },
    ],
  });
  addVisit({
    date: "2017-09-05",
    mileage: 35448,
    shop: "Honda of Covington",
    services: [
      { serviceType: "Wheel alignment", repeatMiles: 15000, repeatMonths: 12, notes: "Alignment performed. Vibration checked." },
      { serviceType: "Wheel bearing replacement", notes: "Front wheel bearings/hubs replaced." },
      { serviceType: "Transmission fluid change", repeatMiles: 60000, repeatMonths: 48, notes: "Transmission fluid changed." },
    ],
  });
  addVisit({
    date: "2017-08-02",
    mileage: 33503,
    shop: "Honda of Covington",
    services: [
      { serviceType: "Oil change", repeatMiles: 5000, repeatMonths: 6, notes: "Oil and filter changed." },
      { serviceType: "Oil filter replacement", repeatMiles: 5000, repeatMonths: 6, notes: "Oil and filter changed." },
      { serviceType: "Tire pressure check", repeatMonths: 1, notes: "Tire condition and pressure checked." },
      { serviceType: "Tire rotation", repeatMiles: 5000, repeatMonths: 6, notes: "Tires rotated." },
    ],
  });
  addVisit({
    date: "2017-01-10",
    mileage: 23751,
    shop: "Honda of Covington",
    services: [
      { serviceType: "Vehicle inspection", notes: "Maintenance inspection completed. Computer reprogrammed." },
      { serviceType: "Oil change", repeatMiles: 5000, repeatMonths: 6, notes: "Oil and filter changed." },
      { serviceType: "Oil filter replacement", repeatMiles: 5000, repeatMonths: 6, notes: "Oil and filter changed." },
    ],
  });
  addVisit({
    date: "2016-03-22",
    mileage: 6363,
    shop: "Take 5 Oil Change",
    services: [
      { serviceType: "Battery test", notes: "Battery/charging system checked." },
      { serviceType: "Oil change", repeatMiles: 5000, repeatMonths: 6, notes: "Oil and filter changed." },
      { serviceType: "Oil filter replacement", repeatMiles: 5000, repeatMonths: 6, notes: "Oil and filter changed." },
    ],
  });
  addVisit({
    date: "2015-10-08",
    mileage: 5,
    shop: "Honda of Covington",
    services: [{ serviceType: "Vehicle inspection", notes: "Pre-delivery inspection completed." }],
  });

  return visitRecords;
}

function seedDemoData() {
  if (state.vehicles.length || state.records.length) {
    return;
  }

  const vehicleId = crypto.randomUUID();
  state.vehicles.push({
    id: vehicleId,
    year: 2020,
    make: "Honda",
    model: "CR-V",
    trim: "EX",
    vin: "",
    purchaseMileage: 12000,
    engineSpec: "1.5L Turbo I4",
    drivetrain: "AWD",
    fuelType: "Gas",
    oilCapacity: "3.7 qt",
    vehicleTireSize: "235/60 R18",
    vehicleRecommendedPsi: 35,
    notes: "Demo vehicle. Replace with your own data.",
    currentMileage: 48250,
    createdAt: new Date().toISOString(),
    documents: [],
    tires: {
      frontLeft: sampleTire("frontLeft", 42000),
      frontRight: sampleTire("frontRight", 42000),
      rearLeft: sampleTire("rearLeft", 39000),
      rearRight: sampleTire("rearRight", 39000),
    },
  });

  state.records.push(
    {
      id: crypto.randomUUID(),
      vehicleId,
      serviceType: "Oil change",
      serviceDate: daysAgo(170),
      mileageAtService: 43800,
      repeatMiles: 5000,
      repeatMonths: 6,
      cost: 64.99,
      shop: "Neighborhood Auto",
      notes: "Synthetic oil and filter",
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      vehicleId,
      serviceType: "Tire rotation",
      serviceDate: daysAgo(95),
      mileageAtService: 45500,
      repeatMiles: 6000,
      repeatMonths: 6,
      cost: 30,
      shop: "Neighborhood Auto",
      notes: "Rotation and pressure check",
      createdAt: new Date().toISOString(),
    }
  );

  persist();
}

function sampleTire(position, installMileage) {
  return {
    id: crypto.randomUUID(),
    position,
    brand: "Michelin",
    model: "Defender 2",
    type: "All-season",
    size: "235/60R18",
    treadDepth: 10,
    treadHistory: [
      {
        depth: 10,
        mileage: installMileage,
        date: daysAgo(240),
      },
    ],
    warrantyMiles: 70000,
    estimatedReplacementMileage: installMileage + 70000,
    recommendedPressure: 35,
    installDate: daysAgo(240),
    installMileage,
    installer: "Neighborhood Auto",
    notes: "",
    updatedAt: new Date().toISOString(),
  };
}

function syncVehicleMileage(vehicleId, mileage) {
  const vehicle = state.vehicles.find((item) => item.id === vehicleId);
  if (vehicle && mileage > vehicle.currentMileage) {
    vehicle.currentMileage = mileage;
  }
}

function createDefaultUiState() {
  return {
    activeScreen: "dashboard",
    historyView: "list",
    tireTrackerExpanded: false,
    expandedPanels: {
      vehicleForm: false,
      recordForm: false,
      historyQuickAdd: false,
      schedulePlan: false,
    },
    filters: {
      history: {
        search: "",
        vehicleId: "",
        category: "",
        dateFrom: "",
        dateTo: "",
        sort: "newest",
      },
      schedule: {
        category: "",
        status: "all",
      },
    },
  };
}

function createEmptyState() {
  return {
    schemaVersion: STORAGE_SCHEMA_VERSION,
    updatedAt: null,
    vehicles: [],
    records: [],
    customServiceTypes: [],
    recurringPlans: [],
    hiddenServiceTypes: [],
    serviceDefinitions: [],
    ui: createDefaultUiState(),
  };
}

function loadState() {
  const emptyState = createEmptyState();
  const mergedState = [STORAGE_KEY, ...LEGACY_STORAGE_KEYS].reduce((nextState, key) => {
    const parsed = parseStoredState(localStorage.getItem(key));
    if (!parsed) {
      return nextState;
    }

    return mergeStoredState(nextState, parsed);
  }, emptyState);

  const hadLegacyState = LEGACY_STORAGE_KEYS.some((key) => localStorage.getItem(key));
  if (hadLegacyState) {
    writeStoredState(mergedState, { silent: true });
    LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
  }

  mergedState.vehicles = mergedState.vehicles.map(normalizeVehicleTireData);
  mergedState.serviceDefinitions = normalizeServiceDefinitions(mergedState.serviceDefinitions || []);
  mergedState.customServiceTypes = mergeUniqueText(
    mergedState.customServiceTypes || [],
    mergedState.serviceDefinitions.filter((serviceDefinition) => !serviceDefinition.baseName).map((serviceDefinition) => serviceDefinition.name)
  );
  mergedState.ui = normalizeUiState(mergedState.ui);
  mergedState.schemaVersion = STORAGE_SCHEMA_VERSION;
  lastPersistedState = JSON.stringify(mergedState);
  return mergedState;
}

function persist({ silent = false } = {}) {
  syncUiStateToState();
  state.vehicles = state.vehicles.map(normalizeVehicleTireData);
  state.serviceDefinitions = normalizeServiceDefinitions(state.serviceDefinitions || []);
  state.schemaVersion = STORAGE_SCHEMA_VERSION;
  state.updatedAt = new Date().toISOString();
  writeStoredState(state, { silent });
}

function persistUiState() {
  if (isRestoringUiState) {
    return;
  }

  persist({ silent: true });
}

function writeStoredState(nextState, { silent = false } = {}) {
  const serializedState = JSON.stringify(nextState);
  if (serializedState === lastPersistedState) {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, serializedState);
    lastPersistedState = serializedState;
    localStorage.removeItem(TIRE_TRACKER_EXPANDED_KEY);
    if (!silent) {
      showSaveStatus("Saved");
    }
  } catch (error) {
    console.error("Could not save car maintenance tracker state", error);
    showSaveStatus("Save failed", { isError: true, hold: 2400 });
  }
}

function showSaveStatus(message = "Saved", { isError = false, hold = 1300 } = {}) {
  if (!saveStatus) {
    return;
  }

  saveStatus.textContent = message;
  saveStatus.classList.toggle("is-error", isError);
  saveStatus.classList.add("is-visible");
  clearTimeout(saveStatusTimer);
  saveStatusTimer = setTimeout(() => {
    saveStatus.classList.remove("is-visible");
    saveStatus.classList.remove("is-error");
  }, hold);
}

function normalizeUiState(uiState) {
  const defaults = createDefaultUiState();
  const nextUi = uiState && typeof uiState === "object" ? uiState : {};
  const expandedPanels = nextUi.expandedPanels && typeof nextUi.expandedPanels === "object" ? nextUi.expandedPanels : {};
  const filters = nextUi.filters && typeof nextUi.filters === "object" ? nextUi.filters : {};
  const historyFilters = filters.history && typeof filters.history === "object" ? filters.history : {};
  const scheduleFilters = filters.schedule && typeof filters.schedule === "object" ? filters.schedule : {};

  return {
    ...defaults,
    activeScreen: cleanText(nextUi.activeScreen) || defaults.activeScreen,
    historyView: ["list", "timeline"].includes(nextUi.historyView) ? nextUi.historyView : defaults.historyView,
    tireTrackerExpanded: Boolean(nextUi.tireTrackerExpanded),
    expandedPanels: {
      ...defaults.expandedPanels,
      vehicleForm: Boolean(expandedPanels.vehicleForm),
      recordForm: Boolean(expandedPanels.recordForm),
      historyQuickAdd: Boolean(expandedPanels.historyQuickAdd),
      schedulePlan: Boolean(expandedPanels.schedulePlan),
    },
    filters: {
      history: {
        ...defaults.filters.history,
        search: cleanText(historyFilters.search),
        vehicleId: cleanText(historyFilters.vehicleId),
        category: cleanText(historyFilters.category),
        dateFrom: cleanText(historyFilters.dateFrom),
        dateTo: cleanText(historyFilters.dateTo),
        sort: cleanText(historyFilters.sort) || defaults.filters.history.sort,
      },
      schedule: {
        ...defaults.filters.schedule,
        category: cleanText(scheduleFilters.category),
        status: cleanText(scheduleFilters.status) || defaults.filters.schedule.status,
      },
    },
  };
}

function syncUiStateToState() {
  state.ui = normalizeUiState(state.ui);
  const activeScreen = screens.find((screen) => screen.classList.contains("is-active"))?.dataset.screen;
  state.ui.activeScreen = activeScreen || state.ui.activeScreen || "dashboard";
  state.ui.historyView = activeHistoryView;
  state.ui.tireTrackerExpanded = Boolean(isTireTrackerExpanded);
  state.ui.expandedPanels = {
    vehicleForm: Boolean(isVehicleFormExpanded),
    recordForm: Boolean(isRecordFormExpanded),
    historyQuickAdd: Boolean(isHistoryQuickAddExpanded),
    schedulePlan: Boolean(isSchedulePlanExpanded),
  };
  state.ui.filters = {
    history: {
      search: cleanText(historySearchInput?.value),
      vehicleId: cleanText(historyVehicleFilter?.value),
      category: cleanText(historyCategoryFilter?.value),
      dateFrom: cleanText(historyDateFrom?.value),
      dateTo: cleanText(historyDateTo?.value),
      sort: cleanText(historySortSelect?.value) || "newest",
    },
    schedule: {
      category: cleanText(scheduleCategoryFilter?.value),
      status: cleanText(scheduleStatusFilter?.value) || "all",
    },
  };
}

function setSelectValueIfOptionExists(select, value) {
  if (!select || !value) {
    return;
  }

  const hasOption = [...select.options].some((option) => option.value === value);
  if (hasOption) {
    select.value = value;
  }
}

function restoreUiStateControls() {
  const uiState = normalizeUiState(state.ui);
  isRestoringUiState = true;
  activeHistoryView = uiState.historyView;
  isTireTrackerExpanded = uiState.tireTrackerExpanded;
  isVehicleFormExpanded = uiState.expandedPanels.vehicleForm;
  isRecordFormExpanded = uiState.expandedPanels.recordForm;
  isHistoryQuickAddExpanded = uiState.expandedPanels.historyQuickAdd;
  isSchedulePlanExpanded = uiState.expandedPanels.schedulePlan;

  if (historySearchInput) {
    historySearchInput.value = uiState.filters.history.search;
  }
  setSelectValueIfOptionExists(historyVehicleFilter, uiState.filters.history.vehicleId);
  setSelectValueIfOptionExists(historyCategoryFilter, uiState.filters.history.category);
  if (historyDateFrom) {
    historyDateFrom.value = uiState.filters.history.dateFrom;
  }
  if (historyDateTo) {
    historyDateTo.value = uiState.filters.history.dateTo;
  }
  setSelectValueIfOptionExists(historySortSelect, uiState.filters.history.sort);
  setSelectValueIfOptionExists(scheduleCategoryFilter, uiState.filters.schedule.category);
  setSelectValueIfOptionExists(scheduleStatusFilter, uiState.filters.schedule.status);
  screens.forEach((screen) => {
    screen.classList.toggle("is-active", screen.dataset.screen === uiState.activeScreen);
  });
  screenButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.screenTarget === uiState.activeScreen);
  });
  vehicleFormPanel?.classList.toggle("is-hidden", !isVehicleFormExpanded);
  vehicleFormToggleButton?.setAttribute("aria-expanded", String(isVehicleFormExpanded));
  recordFormPanel?.classList.toggle("is-hidden", !isRecordFormExpanded);
  recordFormToggleButton?.setAttribute("aria-expanded", String(isRecordFormExpanded));
  historyQuickAddPanel?.classList.toggle("is-hidden", !isHistoryQuickAddExpanded);
  historyQuickAddToggleButton?.setAttribute("aria-expanded", String(isHistoryQuickAddExpanded));
  schedulePlanPanel?.classList.toggle("is-hidden", !isSchedulePlanExpanded);
  schedulePlanToggleButton?.setAttribute("aria-expanded", String(isSchedulePlanExpanded));
  isRestoringUiState = false;
}

function normalizeVehicleTireData(vehicle) {
  if (!vehicle) {
    return vehicle;
  }

  const nextVehicle = {
    ...vehicle,
    archivedTires: Array.isArray(vehicle.archivedTires) ? vehicle.archivedTires : [],
    tireRotationHistory: Array.isArray(vehicle.tireRotationHistory) ? vehicle.tireRotationHistory : [],
    tireMovementHistory: Array.isArray(vehicle.tireMovementHistory) ? vehicle.tireMovementHistory : [],
    documents: Array.isArray(vehicle.documents) ? vehicle.documents : [],
    tires: { ...(vehicle.tires || {}) },
  };

  TIRE_POSITIONS.forEach((position) => {
    const tire = nextVehicle.tires[position.key];
    if (!tire) {
      return;
    }

    nextVehicle.tires[position.key] = normalizeTireRecord(tire, nextVehicle.id, position.key);
  });

  return nextVehicle;
}

function normalizeTireRecord(tire, vehicleId, positionKey) {
  const startingTreadDepth = normalizeTreadRating(
    typeof tire.startingTreadDepth === "number"
      ? tire.startingTreadDepth
      : typeof tire.treadDepth === "number"
        ? tire.treadDepth
        : tire.treadHistory?.[tire.treadHistory.length - 1]?.depth ?? null
  );
  const currentTreadDepth = normalizeTreadRating(
    typeof tire.currentTreadDepth === "number"
      ? tire.currentTreadDepth
      : typeof tire.treadDepth === "number"
        ? tire.treadDepth
        : tire.treadHistory?.[0]?.depth ?? null
  );

  return {
    ...tire,
    id: tire.id ?? crypto.randomUUID(),
    tireId: tire.tireId ?? tire.id ?? crypto.randomUUID(),
    vehicleId: tire.vehicleId ?? vehicleId,
    position: positionKey,
    startingTreadDepth,
    currentTreadDepth,
    treadDepth: currentTreadDepth,
    status: tire.status || "active",
    treadHistory: Array.isArray(tire.treadHistory)
      ? tire.treadHistory.map((entry) => {
          const rating = normalizeTreadRating(entry.depth ?? entry.treadDepth);
          return {
            ...entry,
            depth: rating,
            treadDepth: rating,
            unit: "rating",
          };
        })
      : [],
    positionHistory: Array.isArray(tire.positionHistory)
      ? tire.positionHistory
      : [
          {
            position: positionKey,
            fromDate: tire.installDate || new Date().toISOString().slice(0, 10),
            fromMileage: tire.installMileage ?? 0,
            toDate: null,
            toMileage: null,
          },
        ],
    rotationHistory: Array.isArray(tire.rotationHistory) ? tire.rotationHistory : [],
    replacementHistory: Array.isArray(tire.replacementHistory) ? tire.replacementHistory : [],
  };
}

function parseStoredState(saved) {
  if (!saved) {
    return null;
  }

  try {
    const parsed = JSON.parse(saved);
    return {
      schemaVersion: Number(parsed.schemaVersion) || 1,
      updatedAt: parsed.updatedAt ?? null,
      vehicles: Array.isArray(parsed.vehicles) ? parsed.vehicles : [],
      records: Array.isArray(parsed.records) ? parsed.records : [],
      customServiceTypes: Array.isArray(parsed.customServiceTypes) ? parsed.customServiceTypes : [],
      recurringPlans: Array.isArray(parsed.recurringPlans) ? parsed.recurringPlans : [],
      hiddenServiceTypes: Array.isArray(parsed.hiddenServiceTypes) ? parsed.hiddenServiceTypes : [],
      serviceDefinitions: Array.isArray(parsed.serviceDefinitions) ? parsed.serviceDefinitions : [],
      ui: normalizeUiState(parsed.ui),
    };
  } catch {
    return null;
  }
}

function mergeStoredState(baseState, incomingState) {
  const baseUi = normalizeUiState(baseState.ui);
  const incomingUi = normalizeUiState(incomingState.ui);
  return {
    schemaVersion: STORAGE_SCHEMA_VERSION,
    updatedAt: incomingState.updatedAt || baseState.updatedAt || null,
    vehicles: mergeById(baseState.vehicles, incomingState.vehicles),
    records: mergeById(baseState.records, incomingState.records),
    customServiceTypes: mergeUniqueText(baseState.customServiceTypes, incomingState.customServiceTypes),
    recurringPlans: mergeById(baseState.recurringPlans, incomingState.recurringPlans),
    hiddenServiceTypes: mergeUniqueText(baseState.hiddenServiceTypes || [], incomingState.hiddenServiceTypes || []),
    serviceDefinitions: mergeById(baseState.serviceDefinitions || [], incomingState.serviceDefinitions || []),
    ui: {
      ...baseUi,
      ...incomingUi,
      expandedPanels: {
        ...baseUi.expandedPanels,
        ...incomingUi.expandedPanels,
      },
      filters: {
        history: {
          ...baseUi.filters.history,
          ...incomingUi.filters.history,
        },
        schedule: {
          ...baseUi.filters.schedule,
          ...incomingUi.filters.schedule,
        },
      },
    },
  };
}

function mergeById(baseItems, incomingItems) {
  const merged = new Map();
  [...baseItems, ...incomingItems].forEach((item) => {
    if (!item || !item.id) {
      return;
    }

    merged.set(item.id, item);
  });
  return Array.from(merged.values());
}

function normalizeServiceDefinitions(serviceDefinitions) {
  return (serviceDefinitions || [])
    .filter(Boolean)
    .map((serviceDefinition) => ({
      id: serviceDefinition.id || crypto.randomUUID(),
      name: cleanText(serviceDefinition.name),
      baseName: cleanText(serviceDefinition.baseName),
      category: cleanText(serviceDefinition.category) || "Custom",
      notes: cleanText(serviceDefinition.notes),
      aliases: mergeUniqueText([], serviceDefinition.aliases || []),
    }))
    .filter((serviceDefinition) => serviceDefinition.name);
}

function mergeUniqueText(baseItems, incomingItems) {
  const merged = new Map();
  [...baseItems, ...incomingItems].forEach((value) => {
    const normalized = cleanText(value);
    if (!normalized) {
      return;
    }

    const existingKey = normalized.toLowerCase();
    if (!merged.has(existingKey)) {
      merged.set(existingKey, normalized);
    }
  });
  return Array.from(merged.values());
}

function cleanText(value) {
  return String(value ?? "").trim();
}

function registerCustomServiceType(serviceType) {
  const normalizedType = getCanonicalServiceType(serviceType);
  if (!normalizedType) {
    return;
  }

  const serviceDefinition = getServiceDefinition(normalizedType);
  if (!serviceDefinition && !findRecurringTemplateByRawName(normalizedType)) {
    createCustomServiceDefinition({ name: normalizedType, category: "Custom", notes: "" });
  }
}

function normalizeServiceLookupKey(serviceName) {
  return cleanText(serviceName)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[\/(),.-]/g, " ")
    .replace(/\brepl\b/g, "replacement")
    .replace(/\bchg\b/g, "change")
    .replace(/\s+/g, " ")
    .trim();
}

function repairCanonicalServiceNames() {
  let didRepair = false;

  state.records = state.records.map((record) => {
    const canonicalServiceType = getCanonicalServiceType(record.serviceType);
    const canonicalCategory = record.category || getServiceCategory(canonicalServiceType);
    if (canonicalServiceType !== record.serviceType || canonicalCategory !== record.category) {
      didRepair = true;
      return {
        ...record,
        serviceType: canonicalServiceType,
        category: canonicalCategory,
      };
    }
    return record;
  });

  const nextCustomServiceTypes = state.customServiceTypes.filter(
    (serviceType) => getCanonicalServiceType(serviceType) === cleanText(serviceType)
  );
  if (nextCustomServiceTypes.length !== state.customServiceTypes.length) {
    state.customServiceTypes = mergeUniqueText([], nextCustomServiceTypes);
    didRepair = true;
  }

  if (didRepair) {
    persist();
  }
}

function syncRecordTireSection() {
  const shouldShow = getSelectedRecordServiceTypes().some((serviceType) => isTireRelatedService(serviceType));
  recordTireSection.classList.toggle("is-hidden", !shouldShow);
  if (shouldShow) {
    syncRecordTirePositionMode();
  }
}

function hideRecordTireSection() {
  recordTireSection.classList.add("is-hidden");
  if (recordTireMultiplePositions) {
    recordTireMultiplePositions.classList.add("is-hidden");
  }
}

function isTireRelatedService(serviceType) {
  return /(tire|wheel|alignment)/i.test(cleanText(serviceType));
}

function buildVisitTireUpdate({ vehicleId, installDate, installMileage, shop, notes }) {
  const positions = [...recordForm.querySelectorAll('input[name="recordTirePositions"]:checked')].map(
    (input) => input.value
  );

  if (!positions.length) {
    return null;
  }

  const brand = cleanText(recordForm.elements.recordTireBrand.value);
  const model = cleanText(recordForm.elements.recordTireModel.value);
  const type = cleanText(recordForm.elements.recordTireType.value);

  if (!brand || !model || !type) {
    alert("Add tire brand, model, and type when replacing tires from the service form.");
    return false;
  }

  return {
    vehicleId,
    positions,
    brand,
    model,
    type,
    size: cleanText(recordForm.elements.recordTireSize.value),
    treadDepth: parseTreadRatingInput(recordForm.elements.recordTireTreadDepth.value),
    warrantyMiles: numericOrNull(recordForm.elements.recordTireWarrantyMiles.value),
    estimatedReplacementMileage: numericOrNull(
      recordForm.elements.recordTireEstimatedReplacementMileage.value
    ),
    recommendedPressure: numericOrNull(recordForm.elements.recordTireRecommendedPressure.value),
    installDate,
    installMileage,
    installer: cleanText(recordForm.elements.recordTireInstaller.value) || shop,
    notes: mergeNotes(notes, cleanText(recordForm.elements.recordTireNotes.value)),
  };
}

function saveVisitTireUpdate(tireUpdate) {
  const vehicle = state.vehicles.find((item) => item.id === tireUpdate.vehicleId);
  if (!vehicle) {
    return;
  }

  if (!vehicle.tires) {
    vehicle.tires = {};
  }

  tireUpdate.positions.forEach((position) => {
    vehicle.tires[position] = {
      id: crypto.randomUUID(),
      position,
      ...tireUpdate,
      updatedAt: new Date().toISOString(),
    };
  });
}

function numericOrNull(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parseAppDate(value));
}

function formatMonthYear(value) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(parseAppDate(value));
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function addMonths(dateString, months) {
  const date = parseAppDate(dateString);
  date.setMonth(date.getMonth() + months);
  return formatDateInputValue(date);
}

function addDays(dateValue, days) {
  const date = parseAppDate(dateValue);
  date.setDate(date.getDate() + days);
  return date instanceof Date && typeof dateValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)
    ? formatDateInputValue(date)
    : date.toISOString();
}

function diffInDays(startDate, endDate) {
  const milliseconds = stripTime(endDate) - stripTime(startDate);
  return Math.ceil(milliseconds / (1000 * 60 * 60 * 24));
}

function stripTime(value) {
  const date = parseAppDate(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function parseAppDate(value) {
  if (value instanceof Date) {
    return new Date(value);
  }

  const dateText = cleanText(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateText)) {
    const [year, month, day] = dateText.split("-").map(Number);
    return new Date(year, month - 1, day, 12, 0, 0, 0);
  }

  return new Date(value);
}

function formatDateInputValue(value) {
  const date = parseAppDate(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function mergeNotes(shared, itemSpecific) {
  return [shared, itemSpecific].filter(Boolean).join(" | ");
}

function sortByUrgency(a, b) {
  const aStatusWeight = getUrgencyStatusWeight(a.status);
  const bStatusWeight = getUrgencyStatusWeight(b.status);
  if (aStatusWeight !== bStatusWeight) {
    return aStatusWeight - bStatusWeight;
  }

  const aUrgency = getUrgencySortValue(a);
  const bUrgency = getUrgencySortValue(b);
  if (aUrgency !== bUrgency) {
    return aUrgency - bUrgency;
  }

  const aDate = getComparableDueDateValue(a);
  const bDate = getComparableDueDateValue(b);
  if (aDate !== bDate) {
    return aDate - bDate;
  }

  const aMileage = getComparableDueMileageValue(a);
  const bMileage = getComparableDueMileageValue(b);
  return aMileage - bMileage || (a.serviceType || a.serviceName).localeCompare(b.serviceType || b.serviceName);
}

function getUrgencyStatusWeight(status) {
  return { due: 0, upcoming: 1, ok: 2, setup: 3, off: 4 }[status] ?? 5;
}

function getUrgencySortValue(item) {
  if (item.status === "setup") {
    return Number.MAX_SAFE_INTEGER - 1;
  }

  if (item.status === "off") {
    return Number.MAX_SAFE_INTEGER;
  }

  if (item.status === "due") {
    const overdueMiles = typeof item.milesRemaining === "number" ? Math.min(item.milesRemaining, 0) : 0;
    const overdueDays = typeof item.daysRemaining === "number" ? Math.min(item.daysRemaining, 0) : 0;
    return Math.min(overdueMiles, overdueDays);
  }

  const milesValue = typeof item.milesRemaining === "number" ? item.milesRemaining : Number.MAX_SAFE_INTEGER;
  const daysValue = typeof item.daysRemaining === "number" ? item.daysRemaining : Number.MAX_SAFE_INTEGER;
  return Math.min(milesValue, daysValue);
}

function getComparableDueDateValue(item) {
  if (!item.nextDueDate) {
    return Number.MAX_SAFE_INTEGER;
  }

  return parseAppDate(item.nextDueDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
}

function getComparableDueMileageValue(item) {
  return typeof item.nextDueMileage === "number" ? item.nextDueMileage : Number.MAX_SAFE_INTEGER;
}

function roundCurrency(value) {
  return Math.round(value * 100) / 100;
}

function daysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}
