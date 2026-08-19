import {
  useState,
  useEffect,
  useCallback,
  useRef,
  createContext,
  useContext,
} from "react";

// ─── ICONS (inline subset of Lucide) ───────────────────────────────────────
const Icon = ({
  d,
  size = 18,
  stroke = "currentColor",
  fill = "none",
  strokeWidth = 1.75,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={stroke}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d={d} />
  </svg>
);
const Icons = {
  home: () => (
    <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" />
  ),
  map: () => <Icon d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z M9 3v15 M15 6v15" />,
  docs: () => (
    <Icon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" />
  ),
  people: () => (
    <Icon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
  ),
  continuity: () => <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  activity: () => <Icon d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  settings: () => (
    <Icon d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  ),
  plus: () => <Icon d="M12 5v14 M5 12h14" />,
  chevronRight: () => <Icon d="M9 18l6-6-6-6" />,
  chevronDown: () => <Icon d="M6 9l6 6 6-6" />,
  check: () => <Icon d="M20 6L9 17l-5-5" />,
  x: () => <Icon d="M18 6L6 18 M6 6l12 12" />,
  shield: () => <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  lock: () => (
    <Icon d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4" />
  ),
  bank: () => (
    <Icon d="M3 9l9-7 9 7H3z M4 9v11 M8 9v11 M12 9v11 M16 9v11 M20 9v11 M3 20h18" />
  ),
  trending: () => <Icon d="M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6" />,
  umbrella: () => (
    <Icon d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7" />
  ),
  building: () => (
    <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z M9 22V12h6v10" />
  ),
  dollar: () => (
    <Icon d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  ),
  file: () => (
    <Icon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6" />
  ),
  upload: () => (
    <Icon d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12" />
  ),
  search: () => <Icon d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" />,
  filter: () => <Icon d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />,
  bell: () => (
    <Icon d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0" />
  ),
  user: () => (
    <Icon d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
  ),
  eye: () => (
    <Icon d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
  ),
  eyeOff: () => (
    <Icon d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24 M1 1l22 22" />
  ),
  info: () => (
    <Icon d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 8h.01 M12 12v4" />
  ),
  alertTriangle: () => (
    <Icon d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01" />
  ),
  checkCircle: () => (
    <Icon d="M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3" />
  ),
  clock: () => (
    <Icon d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2" />
  ),
  arrowRight: () => <Icon d="M5 12h14 M12 5l7 7-7 7" />,
  edit: () => (
    <Icon d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  ),
  trash: () => <Icon d="M3 6h18 M8 6V4h8v2 M19 6l-1 14H6L5 6" />,
  download: () => (
    <Icon d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3" />
  ),
  refresh: () => (
    <Icon d="M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  ),
  link: () => (
    <Icon d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  ),
  menu: () => <Icon d="M3 12h18 M3 6h18 M3 18h18" />,
  logOut: () => (
    <Icon d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" />
  ),
  percent: () => (
    <Icon d="M19 5L5 19 M6.5 6.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm11 11a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
  ),
  calendar: () => <Icon d="M3 4h18v18H3V4z M16 2v4 M8 2v4 M3 10h18" />,
  smartphone: () => (
    <Icon d="M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z M12 18h.01" />
  ),
  key: () => (
    <Icon d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  ),
  layers: () => (
    <Icon d="M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5" />
  ),
  package: () => (
    <Icon d="M16.5 9.4l-9-5.18M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
  ),
};

// ─── STORAGE SERVICE ────────────────────────────────────────────────────────
const STORAGE_KEYS = {
  USER: "continuity_user",
  ASSETS: "continuity_assets",
  PEOPLE: "continuity_people",
  DOCUMENTS: "continuity_documents",
  PERMISSIONS: "continuity_permissions",
  CONTINUITY: "continuity_continuity",
  NOTIFICATIONS: "continuity_notifications",
  ACTIVITY: "continuity_activity",
  VIEW_MODE: "continuity_view_mode",
};

const storageService = {
  get: (key) => {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : null;
    } catch {
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
};

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const MOCK_DATA = {
  user: {
    id: "u1",
    name: "Harsh Dubey",
    email: "harshdubey.works@gmail.com",
    phone: "+91 9321521258",
    avatar: "HD",
    joinDate: "2026-08-18",
  },
  assets: [
    {
      id: "a1",
      type: "Banking",
      subtype: "Savings Account",
      institution: "HDFC Bank",
      name: "HDFC Savings",
      approxValue: 240000,
      currency: "INR",
      nominee: "Priya Mehta",
      nomineeVerified: true,
      status: "Active",
      documents: ["d1", "d2"],
      instructions:
        "This is our primary household account. Priya has joint access.",
      contacts: [{ name: "HDFC Customer Care", phone: "1800-227-227" }],
      createdAt: "2024-01-20",
      lastVerified: "2026-07-15",
      accountNumber: "****4521",
    },
    {
      id: "a2",
      type: "Investments",
      subtype: "Stocks",
      institution: "Zerodha",
      name: "Zerodha Portfolio",
      approxValue: 485000,
      currency: "INR",
      nominee: "Priya Mehta",
      nomineeVerified: true,
      status: "Active",
      documents: ["d3"],
      instructions:
        "Do not sell in panic. Review with Rahul before any major decisions.",
      contacts: [{ name: "Zerodha Support", phone: "080-40402020" }],
      createdAt: "2024-02-10",
      lastVerified: "2026-07-01",
      accountNumber: "ZD4892",
    },
    {
      id: "a3",
      type: "Investments",
      subtype: "Mutual Funds",
      institution: "MF Central / HDFC AMC",
      name: "Mutual Fund Portfolio",
      approxValue: 795000,
      currency: "INR",
      nominee: "Priya Mehta",
      nomineeVerified: false,
      status: "Active",
      documents: ["d4"],
      instructions: "",
      contacts: [{ name: "HDFC AMC", phone: "1800-300-19999" }],
      createdAt: "2024-03-05",
      lastVerified: "2026-06-15",
      folio: "HDFC12345",
    },
    {
      id: "a4",
      type: "Insurance",
      subtype: "Term Insurance",
      institution: "LIC of India",
      name: "LIC Term Plan",
      approxValue: 5000000,
      currency: "INR",
      nominee: "Priya Mehta",
      nomineeVerified: true,
      status: "Active",
      documents: [],
      instructions:
        "Premium due annually in March. Policy number to be provided at claim.",
      contacts: [{ name: "LIC Helpline", phone: "1800-33-4433" }],
      createdAt: "2023-11-01",
      lastVerified: "2026-03-10",
      policyNumber: "LIC-781234",
    },
    {
      id: "a5",
      type: "Retirement",
      subtype: "NPS",
      institution: "National Pension System",
      name: "NPS Account",
      approxValue: 320000,
      currency: "INR",
      nominee: "Priya Mehta",
      nomineeVerified: true,
      status: "Active",
      documents: ["d5"],
      instructions:
        "Tier 1 account. Do not withdraw before 60 without consulting Rahul.",
      contacts: [{ name: "NPS Trust", phone: "1800-110-708" }],
      createdAt: "2023-08-15",
      lastVerified: "2026-04-20",
      pran: "500123456789",
    },
    {
      id: "a6",
      type: "Banking",
      subtype: "Fixed Deposit",
      institution: "SBI Bank",
      name: "SBI Fixed Deposit",
      approxValue: 150000,
      currency: "INR",
      nominee: "",
      nomineeVerified: false,
      status: "Active",
      documents: [],
      instructions: "",
      contacts: [{ name: "SBI Customer Care", phone: "1800-11-2211" }],
      createdAt: "2024-06-01",
      lastVerified: "2024-06-01",
      maturityDate: "2027-06-01",
    },
    {
      id: "a7",
      type: "Property",
      subtype: "Residential",
      institution: "Thane Municipal Corporation",
      name: "Thane Apartment",
      approxValue: 8500000,
      currency: "INR",
      nominee: "",
      nomineeVerified: false,
      status: "Active",
      documents: ["d6"],
      instructions:
        "Joint property with Priya. Society name: Greenfield Heights. Flat 402.",
      contacts: [{ name: "Society Secretary", phone: "+91 90000 12345" }],
      createdAt: "2023-05-20",
      lastVerified: "2025-12-01",
      address: "Flat 402, Greenfield Heights, Thane West",
    },
    {
      id: "a8",
      type: "Loans",
      subtype: "Home Loan",
      institution: "HDFC Ltd",
      name: "Home Loan – Thane Apartment",
      approxValue: -2800000,
      currency: "INR",
      nominee: "",
      nomineeVerified: false,
      status: "Active",
      documents: [],
      instructions:
        "EMI of ₹28,000 auto-debits on 5th of every month from HDFC savings.",
      contacts: [{ name: "HDFC Loans", phone: "1800-227-227" }],
      createdAt: "2023-05-20",
      lastVerified: "2026-01-15",
      emiDate: "5th of every month",
    },
  ],
  people: [
    {
      id: "p1",
      name: "Priya Mehta",
      relationship: "Spouse",
      role: "Trusted Person",
      email: "priya@example.com",
      phone: "+91 98000 11111",
      avatar: "PM",
      status: "Verified",
      permissions: [
        "financial_inventory",
        "documents",
        "insurance",
        "investments",
        "instructions",
        "contacts",
        "continuity_alerts",
      ],
      joinedAt: "2024-02-01",
    },
    {
      id: "p2",
      name: "Rahul Mehta",
      relationship: "Financial Advisor",
      role: "Advisor",
      email: "rahul@advisors.com",
      phone: "+91 98000 22222",
      avatar: "RM",
      status: "Active",
      permissions: ["investments", "instructions"],
      joinedAt: "2024-03-15",
    },
  ],
  documents: [
    {
      id: "d1",
      title: "HDFC Account Statement Q1 2026",
      type: "Statement",
      category: "Banking",
      linkedAsset: "a1",
      uploadDate: "2026-04-05",
      size: "245 KB",
      verified: true,
      format: "PDF",
    },
    {
      id: "d2",
      title: "HDFC Passbook Copy",
      type: "Passbook",
      category: "Banking",
      linkedAsset: "a1",
      uploadDate: "2025-10-12",
      size: "180 KB",
      verified: false,
      format: "PDF",
    },
    {
      id: "d3",
      title: "Zerodha Holdings Report 2026",
      type: "Report",
      category: "Investments",
      linkedAsset: "a2",
      uploadDate: "2026-07-01",
      size: "320 KB",
      verified: true,
      format: "PDF",
    },
    {
      id: "d4",
      title: "Mutual Fund Portfolio Summary",
      type: "Summary",
      category: "Investments",
      linkedAsset: "a3",
      uploadDate: "2026-06-15",
      size: "198 KB",
      verified: false,
      format: "PDF",
    },
    {
      id: "d5",
      title: "NPS Statement FY2025-26",
      type: "Statement",
      category: "Retirement",
      linkedAsset: "a5",
      uploadDate: "2026-05-10",
      size: "156 KB",
      verified: true,
      format: "PDF",
    },
    {
      id: "d6",
      title: "Property Registration Document",
      type: "Legal",
      category: "Property",
      linkedAsset: "a7",
      uploadDate: "2023-05-25",
      size: "2.1 MB",
      verified: true,
      format: "PDF",
    },
    {
      id: "d7",
      title: "PAN Card",
      type: "Identity",
      category: "Legal",
      linkedAsset: null,
      uploadDate: "2024-01-15",
      size: "85 KB",
      verified: true,
      format: "JPG",
    },
    {
      id: "d8",
      title: "Will – Draft (Attorney Reviewed)",
      type: "Legal",
      category: "Legal",
      linkedAsset: null,
      uploadDate: "2025-09-01",
      size: "420 KB",
      verified: false,
      format: "PDF",
    },
  ],
  continuity: {
    active: true,
    lastCheckin: "2026-08-18",
    nextCheckin: "2026-09-17",
    frequency: 30,
    reminderDays: 3,
    gracePeriod: 15,
    notifyPerson: "p1",
    initialAccess: "limited",
  },
  activity: [
    {
      id: "act1",
      type: "checkin",
      title: "Safety check completed",
      detail: "",
      timestamp: "2026-08-18T08:42:00",
    },
    {
      id: "act2",
      type: "document",
      title: "Document added",
      detail: "NPS Statement FY2025-26",
      timestamp: "2026-08-17T18:12:00",
    },
    {
      id: "act3",
      type: "person",
      title: "Priya accepted trusted-person invitation",
      detail: "",
      timestamp: "2026-08-16T09:31:00",
    },
    {
      id: "act4",
      type: "asset",
      title: "Mutual Fund asset updated",
      detail: "Mutual Fund Portfolio",
      timestamp: "2026-08-12T14:21:00",
    },
    {
      id: "act5",
      type: "document",
      title: "Document added",
      detail: "Zerodha Holdings Report 2026",
      timestamp: "2026-07-01T11:00:00",
    },
    {
      id: "act6",
      type: "asset",
      title: "Asset added",
      detail: "HDFC Fixed Deposit",
      timestamp: "2024-06-01T09:00:00",
    },
  ],
};

function initMockData() {
  if (!storageService.get(STORAGE_KEYS.USER)) {
    storageService.set(STORAGE_KEYS.USER, MOCK_DATA.user);
    storageService.set(STORAGE_KEYS.ASSETS, MOCK_DATA.assets);
    storageService.set(STORAGE_KEYS.PEOPLE, MOCK_DATA.people);
    storageService.set(STORAGE_KEYS.DOCUMENTS, MOCK_DATA.documents);
    storageService.set(STORAGE_KEYS.CONTINUITY, MOCK_DATA.continuity);
    storageService.set(STORAGE_KEYS.ACTIVITY, MOCK_DATA.activity);
  }
}

function resetMockData() {
  Object.values(STORAGE_KEYS).forEach((k) => storageService.remove(k));
  storageService.set(STORAGE_KEYS.USER, MOCK_DATA.user);
  storageService.set(STORAGE_KEYS.ASSETS, MOCK_DATA.assets);
  storageService.set(STORAGE_KEYS.PEOPLE, MOCK_DATA.people);
  storageService.set(STORAGE_KEYS.DOCUMENTS, MOCK_DATA.documents);
  storageService.set(STORAGE_KEYS.CONTINUITY, MOCK_DATA.continuity);
  storageService.set(STORAGE_KEYS.ACTIVITY, MOCK_DATA.activity);
}

// ─── APP CONTEXT ─────────────────────────────────────────────────────────────
const AppContext = createContext(null);
function useApp() {
  return useContext(AppContext);
}

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [assets, setAssets] = useState([]);
  const [people, setPeople] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [continuity, setContinuity] = useState(null);
  const [activity, setActivity] = useState([]);
  const [viewMode, setViewMode] = useState("owner"); // owner | priya | emergency
  const [toast, setToast] = useState(null);

  useEffect(() => {
    initMockData();
    setUser(storageService.get(STORAGE_KEYS.USER));
    setAssets(storageService.get(STORAGE_KEYS.ASSETS) || []);
    setPeople(storageService.get(STORAGE_KEYS.PEOPLE) || []);
    setDocuments(storageService.get(STORAGE_KEYS.DOCUMENTS) || []);
    setContinuity(storageService.get(STORAGE_KEYS.CONTINUITY));
    setActivity(storageService.get(STORAGE_KEYS.ACTIVITY) || []);
    setViewMode(storageService.get(STORAGE_KEYS.VIEW_MODE) || "owner");
  }, []);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const saveAssets = (newAssets) => {
    setAssets(newAssets);
    storageService.set(STORAGE_KEYS.ASSETS, newAssets);
  };
  const savePeople = (newPeople) => {
    setPeople(newPeople);
    storageService.set(STORAGE_KEYS.PEOPLE, newPeople);
  };
  const saveDocuments = (newDocs) => {
    setDocuments(newDocs);
    storageService.set(STORAGE_KEYS.DOCUMENTS, newDocs);
  };
  const saveContinuity = (c) => {
    setContinuity(c);
    storageService.set(STORAGE_KEYS.CONTINUITY, c);
  };

  const addActivity = useCallback((entry) => {
    setActivity((prev) => {
      const updated = [
        {
          ...entry,
          id: `act${Date.now()}`,
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ];
      storageService.set(STORAGE_KEYS.ACTIVITY, updated);
      return updated;
    });
  }, []);

  const handleReset = () => {
    resetMockData();
    setUser(MOCK_DATA.user);
    setAssets(MOCK_DATA.assets);
    setPeople(MOCK_DATA.people);
    setDocuments(MOCK_DATA.documents);
    setContinuity(MOCK_DATA.continuity);
    setActivity(MOCK_DATA.activity);
    setViewMode("owner");
    showToast("Demo data has been reset.");
  };

  const changeViewMode = (mode) => {
    setViewMode(mode);
    storageService.set(STORAGE_KEYS.VIEW_MODE, mode);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        assets,
        people,
        documents,
        continuity,
        activity,
        viewMode,
        toast,
        showToast,
        saveAssets,
        savePeople,
        saveDocuments,
        saveContinuity,
        addActivity,
        handleReset,
        changeViewMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const styles = `
/* GLOBAL BOX SIZING */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body,
#root {
  width: 100%;
  min-width: 0;
  margin: 0;
  padding: 0;
}

body {
  overflow-x: hidden;
}
  :root {
    --bg: #F7F6F3;
    --surface: #FFFFFF;
    --surface-alt: #F2F1EE;
    --border: #E5E3DE;
    --border-light: #EEECE8;
    --text-primary: #1A1917;
    --text-secondary: #6B6860;
    --text-muted: #9C9A95;
    --accent: #2D6A4F;
    --accent-light: #EAF2EE;
    --accent-mid: #52B788;
    --warn: #B45309;
    --warn-light: #FEF3C7;
    --error: #B91C1C;
    --error-light: #FEE2E2;
    --success: #166534;
    --success-light: #DCFCE7;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md: 0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);
    --shadow-lg: 0 12px 32px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06);
    --radius: 12px;
    --radius-sm: 8px;
    --radius-lg: 16px;
    --sidebar-w: 232px;
    --font: 'Inter', system-ui, -apple-system, sans-serif;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-size: 15px; }
  body { font-family: var(--font); background: var(--bg); color: var(--text-primary); -webkit-font-smoothing: antialiased; }
.app {
  display: flex;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  height: 100vh;
  overflow: hidden;
}
  /* SIDEBAR */
  .sidebar { width: var(--sidebar-w); background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; flex-shrink: 0; z-index: 40; }@media (max-width: 768px) {
  .sidebar {
    display: none;
  }

  .main {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    overflow-x: hidden;
  }
}
  .sidebar-logo { padding: 20px 20px 16px; border-bottom: 1px solid var(--border-light); }
  .logo-mark { display: flex; align-items: center; gap: 10px; text-decoration: none; }
  .logo-icon { width: 32px; height: 32px; background: var(--accent); border-radius: 8px; display: flex; align-items: center; justify-content: center; }
  .logo-text { font-size: 1rem; font-weight: 700; letter-spacing: -0.02em; color: var(--text-primary); }
  .logo-sub { font-size: 0.7rem; color: var(--text-muted); letter-spacing: 0.02em; }
  .sidebar-nav { flex: 1; padding: 8px; overflow-y: auto; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: var(--radius-sm); cursor: pointer; color: var(--text-secondary); font-size: 0.875rem; font-weight: 500; transition: all 0.15s ease; margin-bottom: 1px; border: none; background: none; width: 100%; text-align: left; }
  .nav-item:hover { background: var(--surface-alt); color: var(--text-primary); }
  .nav-item.active { background: var(--accent-light); color: var(--accent); }
  .nav-item svg { flex-shrink: 0; opacity: 0.7; }
  .nav-item.active svg { opacity: 1; }
  .sidebar-footer { padding: 12px 8px; border-top: 1px solid var(--border-light); }
  .avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--accent-light); color: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; flex-shrink: 0; }
  .avatar-lg { width: 44px; height: 44px; font-size: 1rem; }
  .user-card { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: var(--radius-sm); cursor: pointer; }
  .user-card:hover { background: var(--surface-alt); }
  /* MAIN */
.main {
  flex: 1 1 auto;
  min-width: 0;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.topbar {
  width: 100%;
  max-width: 100%;
  padding: 16px 28px;
  border-bottom: 1px solid var(--border-light);
  background: var(--surface);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  min-width: 0;
}

.page-title {
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 1px;
}

.content {
  width: 100%;
  max-width: 1360px;
  margin: 0 auto;
  padding: 24px 32px;
}
  /* CARDS */
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow-sm); }
  .card-hover { transition: box-shadow 0.2s, transform 0.15s; cursor: pointer; }
  .card-hover:hover { box-shadow: var(--shadow-md); transform: translateY(-1px); }
  /* GRID */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .grid-auto { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
  /* BUTTONS */
  .btn { display: inline-flex; align-items: center; gap: 7px; padding: 9px 16px; border-radius: var(--radius-sm); font-size: 0.875rem; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s; text-decoration: none; }
  .btn-primary { background: var(--accent); color: white; }
  .btn-primary:hover { background: #245F45; }
  .btn-secondary { background: var(--surface-alt); color: var(--text-primary); border: 1px solid var(--border); }
  .btn-secondary:hover { background: var(--border-light); }
  .btn-ghost { background: none; color: var(--text-secondary); padding: 7px 12px; }
  .btn-ghost:hover { background: var(--surface-alt); color: var(--text-primary); }
  .btn-danger { background: var(--error-light); color: var(--error); }
  .btn-danger:hover { background: #fca5a5; }
  .btn-sm { padding: 6px 12px; font-size: 0.8rem; }
  .btn-icon { width: 36px; height: 36px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: var(--radius-sm); background: none; border: 1px solid var(--border); cursor: pointer; color: var(--text-secondary); transition: all 0.15s; }
  .btn-icon:hover { background: var(--surface-alt); color: var(--text-primary); }
  /* BADGES */
  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 100px; font-size: 0.75rem; font-weight: 600; }
  .badge-green { background: var(--success-light); color: var(--success); }
  .badge-amber { background: var(--warn-light); color: var(--warn); }
  .badge-red { background: var(--error-light); color: var(--error); }
  .badge-gray { background: var(--surface-alt); color: var(--text-secondary); }
  .badge-blue { background: #EFF6FF; color: #1D4ED8; }
  /* INPUTS */
  .input { width: 100%; padding: 9px 12px; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 0.875rem; background: var(--surface); color: var(--text-primary); font-family: var(--font); transition: border 0.15s; outline: none; }
  .input:focus { border-color: var(--accent-mid); box-shadow: 0 0 0 3px rgba(82,183,136,0.15); }
  .input-group { display: flex; flex-direction: column; gap: 6px; }
  .label { font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); letter-spacing: 0.01em; }
  select.input { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B6860' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; }
  textarea.input { resize: vertical; min-height: 80px; }
  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; animation: fadeIn 0.15s ease; }
  .modal { background: var(--surface); border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; animation: slideUp 0.2s ease; }
  .modal-lg { max-width: 720px; }
  .modal-header { padding: 24px 24px 0; display: flex; align-items: flex-start; justify-content: space-between; }
  .modal-body { padding: 20px 24px; }
  .modal-footer { padding: 0 24px 24px; display: flex; gap: 10px; justify-content: flex-end; border-top: 1px solid var(--border-light); padding-top: 16px; margin-top: 4px; }
  /* TOAST */
  .toast { position: fixed; bottom: 28px; right: 28px; background: var(--text-primary); color: white; padding: 12px 18px; border-radius: var(--radius); box-shadow: var(--shadow-lg); font-size: 0.875rem; font-weight: 500; z-index: 999; animation: slideUp 0.25s ease; display: flex; align-items: center; gap: 8px; }
  .toast-success { background: #166534; }
  .toast-error { background: var(--error); }
  /* TABS */
  .tabs { display: flex; border-bottom: 1px solid var(--border); gap: 0; margin-bottom: 20px; }
  .tab { padding: 10px 16px; font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.15s; margin-bottom: -1px; }
  .tab.active { color: var(--accent); border-bottom-color: var(--accent); }
  .tab:hover:not(.active) { color: var(--text-primary); }
  /* PROGRESS RING */
  .progress-ring { transform: rotate(-90deg); }
  .progress-ring-track { fill: none; stroke: var(--border); }
  .progress-ring-fill { fill: none; stroke: var(--accent); stroke-linecap: round; transition: stroke-dashoffset 0.6s ease; }
  /* TIMELINE */
  .timeline { display: flex; flex-direction: column; }
  .timeline-item { display: flex; gap: 14px; padding-bottom: 20px; position: relative; }
  .timeline-item:not(:last-child)::before { content: ''; position: absolute; left: 14px; top: 32px; bottom: 0; width: 1px; background: var(--border); }
  .timeline-dot { width: 28px; height: 28px; border-radius: 50%; background: var(--accent-light); color: var(--accent); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
  /* SECTION */
  .section-label { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 12px; }
  .divider { height: 1px; background: var(--border-light); margin: 20px 0; }
  /* VIEW MODE SWITCHER */
  .view-switcher { background: var(--surface-alt); border: 1px solid var(--border); border-radius: var(--radius); padding: 4px; display: flex; gap: 4px; }
  .view-option { padding: 5px 12px; border-radius: var(--radius-sm); font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: all 0.15s; color: var(--text-secondary); border: none; background: none; }
  .view-option.active { background: var(--surface); color: var(--accent); box-shadow: var(--shadow-sm); }
  /* SEARCH BAR */
  .search-bar { position: relative; }
  .search-bar input { padding-left: 36px; }
  .search-bar .search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; }
  /* PERMISSION TOGGLE */
  .perm-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--border-light); }
  .perm-row:last-child { border-bottom: none; }
  .switch { position: relative; width: 40px; height: 22px; }
  .switch input { opacity: 0; width: 0; height: 0; }
  .switch-slider { position: absolute; inset: 0; background: var(--border); border-radius: 100px; cursor: pointer; transition: 0.2s; }
  .switch-slider::before { content: ''; position: absolute; width: 16px; height: 16px; left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
  .switch input:checked + .switch-slider { background: var(--accent); }
  .switch input:checked + .switch-slider::before { transform: translateX(18px); }
  /* EMPTY STATE */
  .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; text-align: center; }
  .empty-state-icon { width: 56px; height: 56px; border-radius: 50%; background: var(--surface-alt); display: flex; align-items: center; justify-content: center; color: var(--text-muted); margin-bottom: 16px; }
  .empty-state h3 { font-size: 1rem; font-weight: 700; margin-bottom: 6px; }
  .empty-state p { color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 20px; max-width: 320px; }
  /* STEP PROGRESS */
  .step-progress { display: flex; gap: 4px; margin-bottom: 20px; }
  .step-pip { height: 4px; border-radius: 2px; background: var(--border); flex: 1; transition: background 0.2s; }
  .step-pip.done { background: var(--accent); }
  /* CATEGORY CHIPS */
  .chips { display: flex; gap: 8px; flex-wrap: wrap; }
  .chip { padding: 6px 14px; border-radius: 100px; font-size: 0.8rem; font-weight: 600; cursor: pointer; border: 1px solid var(--border); background: var(--surface); color: var(--text-secondary); transition: all 0.15s; }
  .chip.active { background: var(--accent-light); border-color: var(--accent-mid); color: var(--accent); }
  .chip:hover:not(.active) { background: var(--surface-alt); }
  /* STAT CARD */
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px 20px; }
  .stat-value { font-size: 1.4rem; font-weight: 800; letter-spacing: -0.03em; }
  .stat-label { font-size: 0.78rem; color: var(--text-secondary); font-weight: 500; margin-top: 2px; }
  .stat-sub { font-size: 0.7rem; color: var(--text-muted); margin-top: 4px; }
  /* ATTENTION ITEMS */
  .attention-item { display: flex; gap: 14px; padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-light); align-items: flex-start; transition: background 0.15s; }
  .attention-item:hover { background: var(--surface-alt); }
  .attention-icon { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  /* ANIMATIONS */
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
  @keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
  .fade-in { animation: fadeIn 0.25s ease; }
  /* RESPONSIVE */
  .mobile-nav { display: none; }
  .sidebar-overlay { display: none; }
  @media (max-width: 768px) {
    .sidebar { position: fixed; left: 0; top: 0; bottom: 0; transform: translateX(-100%); transition: transform 0.25s ease; z-index: 50; }
    .sidebar.open { transform: translateX(0); }
    .sidebar-overlay.open { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 45; }
    .main { width: 100%; }
    .topbar { padding: 12px 16px; }
    .content { padding: 16px; }
    .grid-2, .grid-3 { grid-template-columns: 1fr; }
    .grid-auto { grid-template-columns: 1fr; }
    .mobile-nav { display: flex; position: fixed; bottom: 0; left: 0; right: 0; background: var(--surface); border-top: 1px solid var(--border); z-index: 40; padding: 8px 0; }
    .mobile-nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 6px 4px; font-size: 0.65rem; font-weight: 500; color: var(--text-muted); cursor: pointer; border: none; background: none; transition: color 0.15s; }
    .mobile-nav-item.active { color: var(--accent); }
    .main { padding-bottom: 68px; }
    .dashboard-hero { flex-direction: column; align-items: flex-start; }
    .topbar-actions { gap: 8px; }
  }
  /* MOBILE NAVIGATION */

.mobile-nav {
  display: none;
}

@media (max-width: 768px) {
  .mobile-nav {
    display: flex;
    align-items: center;
    gap: 6px;
    overflow-x: auto;
    padding: 8px 12px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
  }

  .mobile-nav button {
    appearance: none;
    -webkit-appearance: none;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text-secondary);
    border-radius: var(--radius-sm);
    padding: 8px 12px;
    font-family: var(--font);
    font-size: 0.8rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    cursor: pointer;
  }

  .mobile-nav button.active {
    background: var(--accent-light);
    border-color: var(--accent-mid);
    color: var(--accent);
  }
    html,
body,
#root {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

body {
  margin: 0;
}

.app {
  width: 100%;
  max-width: 100vw;
  min-width: 0;
  display: flex;
  overflow: hidden;
}
}/* =========================================
   MOBILE TOPBAR
   ========================================= */

@media (max-width: 768px) {

  .topbar {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    overflow: hidden;
  }

  .page-title {
    font-size: 1.35rem;
    line-height: 1.2;
  }

  .page-subtitle {
    font-size: 0.78rem;
    line-height: 1.3;
    margin-top: 3px;
  }
}
@media (max-width: 768px) {
  .view-switcher {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    display: flex;
    flex-wrap: nowrap;
    gap: 4px;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
  }

  .view-switcher::-webkit-scrollbar {
    display: none;
  }

  .view-switcher > * {
    flex: 0 0 auto;
    white-space: nowrap;
  }
}
`;

// ─── UTILITIES ───────────────────────────────────────────────────────────────
const fmt = (n) =>
  n >= 10000000
    ? `₹${(n / 10000000).toFixed(2)}Cr`
    : n >= 100000
    ? `₹${(n / 100000).toFixed(1)}L`
    : n >= 1000
    ? `₹${(n / 1000).toFixed(0)}K`
    : `₹${Math.abs(n).toLocaleString("en-IN")}`;
const assetIcon = (type) =>
  ({
    Banking: Icons.bank,
    Investments: Icons.trending,
    Insurance: Icons.umbrella,
    Retirement: Icons.shield,
    Property: Icons.building,
    Loans: Icons.dollar,
    Other: Icons.package,
  }[type] || Icons.layers);
const catColor = (type) =>
  ({
    Banking: "#1D4ED8",
    Investments: "#6D28D9",
    Insurance: "#B45309",
    Retirement: "#0F766E",
    Property: "#BE185D",
    Loans: "#DC2626",
    Other: "#4B5563",
  }[type] || "#4B5563");
const catBg = (type) =>
  ({
    Banking: "#EFF6FF",
    Investments: "#F5F3FF",
    Insurance: "#FFFBEB",
    Retirement: "#F0FDFA",
    Property: "#FDF2F8",
    Loans: "#FEF2F2",
    Other: "#F9FAFB",
  }[type] || "#F9FAFB");
const fmtDate = (s) => {
  if (!s) return "—";
  const d = new Date(s);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
const timeAgo = (s) => {
  const sec = Math.floor((Date.now() - new Date(s)) / 1000);
  if (sec < 60) return "just now";
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  const d = new Date(s);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
function ProgressRing({ value, max = 100, size = 120, stroke = 9 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  const offset = circ * (1 - pct);
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="progress-ring"
    >
      <circle
        className="progress-ring-track"
        cx={size / 2}
        cy={size / 2}
        r={r}
        strokeWidth={stroke}
      />
      <circle
        className="progress-ring-fill"
        cx={size / 2}
        cy={size / 2}
        r={r}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

function Switch({ checked, onChange }) {
  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="switch-slider" />
    </label>
  );
}

function Modal({ title, subtitle, onClose, children, footer, size = "" }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);
  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`modal ${size}`} role="dialog" aria-modal="true">
        <div className="modal-header">
          <div>
            <h2
              style={{
                fontSize: "1.05rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </h2>
            {subtitle && (
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  marginTop: 3,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close">
            <Icons.x />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
  <div className="mobile-nav">
  <button
    className={activePage === "home" ? "active" : ""}
    onClick={() => setActivePage("home")}
  >
    <Home size={18} />
    <span>Home</span>
  </button>

  <button
    className={activePage === "map" ? "active" : ""}
    onClick={() => setActivePage("map")}
  >
    <Map size={18} />
    <span>Map</span>
  </button>

  <button
    className={activePage === "documents" ? "active" : ""}
    onClick={() => setActivePage("documents")}
  >
    <FileText size={18} />
    <span>Docs</span>
  </button>

  ...
</div>
}

function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div className={`toast toast-${type}`}>
      {type === "success" ? (
        <Icons.checkCircle size={16} />
      ) : (
        <Icons.alertTriangle size={16} />
      )}
      {msg}
    </div>
  );
}

function EmptyState({ icon: Ic, title, desc, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Ic />
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
      {action}
    </div>
  );
}

// ─── LOGO ────────────────────────────────────────────────────────────────────
function LogoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M17 6l5-3M17 6l-3 5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2" fill="white" />
    </svg>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
function Sidebar({ current, onNav, user, open }) {
  const nav = [
    { id: "dashboard", label: "Home", Icon: Icons.home },
    { id: "financial-map", label: "Financial Map", Icon: Icons.map },
    { id: "documents", label: "Documents", Icon: Icons.docs },
    { id: "people", label: "People", Icon: Icons.people },
    { id: "continuity", label: "Continuity", Icon: Icons.continuity },
    { id: "activity", label: "Activity", Icon: Icons.activity },
  ];
  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="sidebar-logo">
        <div className="logo-mark">
          <div className="logo-icon">
            <LogoIcon />
          </div>
          <div>
            <div className="logo-text">Continuity</div>
            <div className="logo-sub">Keep what matters, connected.</div>
          </div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {nav.map(({ id, label, Icon: Ic }) => (
          <button
            key={id}
            className={`nav-item ${current === id ? "active" : ""}`}
            onClick={() => onNav(id)}
          >
            <Ic /> {label}
          </button>
        ))}
        <div style={{ height: 8 }} />
        <button
          className={`nav-item ${current === "settings" ? "active" : ""}`}
          onClick={() => onNav("settings")}
        >
          <Icons.settings /> Settings
        </button>
      </nav>
      <div className="sidebar-footer">
        <div className="user-card" onClick={() => onNav("settings")}>
          <div className="avatar">{user?.avatar || "U"}</div>
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                fontSize: "0.82rem",
                fontWeight: 600,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.name}
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                color: "var(--text-muted)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.email}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ onNav }) {
  const { assets, people, continuity, activity, viewMode } = useApp();
  const isOwner = viewMode === "owner";

  const totalAssets = assets.filter((a) => a.approxValue > 0).length;
  const nomineeComplete =
    assets.filter((a) => a.nomineeVerified).length /
    Math.max(assets.filter((a) => a.approxValue > 0).length, 1);
  const docsComplete =
    assets.filter((a) => a.documents?.length > 0).length /
    Math.max(assets.length, 1);
  const instructionsComplete =
    assets.filter((a) => a.instructions).length / Math.max(assets.length, 1);
  const peopleScore = people.length > 0 ? 1 : 0;
  const continuityScore = Math.round(
    (0.25 * Math.min(docsComplete * 2, 1) +
      0.25 * nomineeComplete +
      0.2 * instructionsComplete +
      0.15 * peopleScore +
      0.15 * (continuity?.active ? 1 : 0)) *
      100 +
      45
  );
  const clampedScore = Math.min(100, continuityScore);

  const categories = [
    { label: "Banking", type: "Banking", sub: "accounts" },
    { label: "Investments", type: "Investments", sub: "portfolio" },
    { label: "Insurance", type: "Insurance", sub: "policies" },
    { label: "Retirement", type: "Retirement", sub: "funds" },
    { label: "Property", type: "Property", sub: "assets" },
    { label: "Loans", type: "Loans", sub: "active" },
  ];

  const attention = [
    !assets.find((a) => a.id === "a6")?.nominee && {
      icon: Icons.alertTriangle,
      color: "#B45309",
      bg: "#FFFBEB",
      title: "Nominee details incomplete",
      desc: "Your SBI Fixed Deposit has no nominee on record.",
      cta: "Review",
      action: () => onNav("financial-map"),
    },
    !assets.find((a) => a.id === "a4")?.documents?.length && {
      icon: Icons.file,
      color: "#1D4ED8",
      bg: "#EFF6FF",
      title: "Policy document missing",
      desc: "Your LIC Term Insurance has no uploaded policy copy.",
      cta: "Add document",
      action: () => onNav("documents"),
    },
    !assets.find((a) => a.id === "a3")?.instructions && {
      icon: Icons.info,
      color: "#6D28D9",
      bg: "#F5F3FF",
      title: "Continuity instruction missing",
      desc: "You haven't added instructions for your Mutual Fund portfolio.",
      cta: "Add now",
      action: () => onNav("financial-map"),
    },
    !continuity?.active && {
      icon: Icons.clock,
      color: "#B91C1C",
      bg: "#FEE2E2",
      title: "Safety check inactive",
      desc: "Your continuity check-in is not configured.",
      cta: "Set up",
      action: () => onNav("continuity"),
    },
  ].filter(Boolean);

  if (!isOwner && viewMode === "emergency") {
    return <EmergencyView />;
  }

  return (
    <div className="content fade-in">
      {/* Hero */}
      <div
        className="card"
        style={{
          marginBottom: 20,
          background: "linear-gradient(135deg, #F0F7F4 0%, #FFFFFF 60%)",
          border: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 20,
          }}
          className="dashboard-hero"
        >
          <div>
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: 6,
              }}
            >
              Financial Continuity
            </div>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                marginBottom: 8,
              }}
            >
              Your financial life is{" "}
              {clampedScore >= 75 ? "well organized" : "taking shape"}.
            </h1>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                lineHeight: 1.6,
              }}
            >
              You've organized <strong>{totalAssets}</strong> assets, connected{" "}
              <strong>{people.length}</strong> trusted{" "}
              {people.length === 1 ? "person" : "people"} and completed{" "}
              <strong>{clampedScore}%</strong> of your continuity setup.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              position: "relative",
            }}
          >
            <ProgressRing value={clampedScore} size={120} stroke={10} />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 120,
                height: 120,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  color: "var(--accent)",
                }}
              >
                {clampedScore}
              </div>
              <div
                style={{
                  fontSize: "0.65rem",
                  color: "var(--text-muted)",
                  fontWeight: 600,
                  textAlign: "center",
                  letterSpacing: "0.02em",
                }}
              >
                CONTINUITY
                <br />
                SCORE
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        {/* Score breakdown */}
        <div className="card">
          <div className="section-label">Score Breakdown</div>
          {[
            {
              label: "Asset Coverage",
              val: Math.round((totalAssets / 8) * 100),
            },
            { label: "Documents", val: Math.round(docsComplete * 100) },
            { label: "Nominees", val: Math.round(nomineeComplete * 100) },
            { label: "Trusted People", val: people.length > 0 ? 100 : 0 },
            {
              label: "Instructions",
              val: Math.round(instructionsComplete * 100),
            },
          ].map(({ label, val }) => (
            <div key={label} style={{ marginBottom: 12 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 5,
                }}
              >
                <span
                  style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color:
                      val >= 70
                        ? "var(--accent)"
                        : val >= 40
                        ? "var(--warn)"
                        : "var(--error)",
                  }}
                >
                  {val}%
                </span>
              </div>
              <div
                style={{
                  height: 5,
                  background: "var(--border)",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${val}%`,
                    background:
                      val >= 70
                        ? "var(--accent)"
                        : val >= 40
                        ? "#F59E0B"
                        : "var(--error)",
                    borderRadius: 3,
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Attention items */}
        {attention.length > 0 ? (
          <div className="card">
            <div className="section-label">Needs Attention</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {attention.slice(0, 3).map((item, i) => (
                <div key={i} className="attention-item">
                  <div
                    className="attention-icon"
                    style={{ background: item.bg, color: item.color }}
                  >
                    <item.icon size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        marginBottom: 2,
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        fontSize: "0.76rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.4,
                      }}
                    >
                      {item.desc}
                    </div>
                  </div>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={item.action}
                  >
                    {item.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            className="card"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "var(--success-light)",
                color: "var(--success)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <Icons.checkCircle />
            </div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>
              All items reviewed
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              Your continuity plan looks complete.
            </div>
          </div>
        )}
      </div>

      {/* Financial Overview */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <h2 style={{ fontSize: "0.95rem", fontWeight: 700 }}>
            Financial Overview
          </h2>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onNav("financial-map")}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            View map <Icons.arrowRight size={14} />
          </button>
        </div>
        <div className="grid-3">
          {categories.map(({ label, type, sub }) => {
            const catAssets = assets.filter((a) => a.type === type);
            const total = catAssets.reduce(
              (s, a) => s + (a.approxValue || 0),
              0
            );
            const CatIcon = assetIcon(type);
            return (
              <div
                key={type}
                className="stat-card card-hover"
                onClick={() => onNav("financial-map")}
                style={{ cursor: "pointer" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: catBg(type),
                      color: catColor(type),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CatIcon />
                  </div>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {label}
                  </div>
                </div>
                <div
                  className="stat-value"
                  style={{
                    color: total < 0 ? "var(--error)" : "var(--text-primary)",
                  }}
                >
                  {type === "Insurance"
                    ? `${catAssets.length} ${
                        catAssets.length === 1 ? "Policy" : "Policies"
                      }`
                    : total === 0
                    ? "—"
                    : fmt(Math.abs(total))}
                </div>
                <div className="stat-sub">
                  {catAssets.length} {sub} · Approx. value
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Continuity Status */}
      {continuity && (
        <div className="card" style={{ borderLeft: "3px solid var(--accent)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  boxShadow: "0 0 0 3px var(--accent-light)",
                }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                  Continuity Active
                </div>
                <div
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--text-secondary)",
                    marginTop: 2,
                  }}
                >
                  Last check-in: {fmtDate(continuity.lastCheckin)} · Next:{" "}
                  {fmtDate(continuity.nextCheckin)}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onNav("continuity")}
              >
                Manage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── FINANCIAL MAP ────────────────────────────────────────────────────────────
function FinancialMap() {
  const { assets, saveAssets, addActivity, showToast, viewMode } = useApp();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showDelete, setShowDelete] = useState(null);
  const isOwner = viewMode === "owner";
  const cats = [
    "All",
    "Banking",
    "Investments",
    "Insurance",
    "Retirement",
    "Property",
    "Loans",
    "Other",
  ];

  const filtered = assets.filter((a) => {
    const matchCat = filter === "All" || a.type === filter;
    const matchSearch =
      !search ||
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.institution?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleDelete = (id) => {
    const updated = assets.filter((a) => a.id !== id);
    saveAssets(updated);
    addActivity({
      type: "asset",
      title: "Asset removed",
      detail: assets.find((a) => a.id === id)?.name || "",
    });
    showToast("Asset removed.");
    setShowDelete(null);
    if (selectedAsset?.id === id) setSelectedAsset(null);
  };

  const handleSave = (asset) => {
    const isNew = !assets.find((a) => a.id === asset.id);
    const updated = isNew
      ? [...assets, asset]
      : assets.map((a) => (a.id === asset.id ? asset : a));
    saveAssets(updated);
    addActivity({
      type: "asset",
      title: isNew ? "Asset added" : "Asset updated",
      detail: asset.name,
    });
    showToast(isNew ? "Asset added." : "Asset updated.");
    setShowAdd(false);
    setSelectedAsset(asset);
  };

  if (selectedAsset) {
    const current =
      assets.find((a) => a.id === selectedAsset.id) || selectedAsset;
    return (
      <AssetDetail
        asset={current}
        onBack={() => setSelectedAsset(null)}
        onEdit={
          isOwner
            ? (a) => {
                setShowAdd(a);
                setSelectedAsset(null);
              }
            : null
        }
        onDelete={isOwner ? () => setShowDelete(current.id) : null}
      >
        {showDelete && (
          <ConfirmModal
            title="Remove asset"
            desc={`Remove "${current.name}"? This cannot be undone.`}
            onConfirm={() => handleDelete(showDelete)}
            onCancel={() => setShowDelete(null)}
          />
        )}
      </AssetDetail>
    );
  }

  return (
    <div className="content fade-in">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="search-bar" style={{ width: 240 }}>
              <span className="search-icon">
                <Icons.search size={15} />
              </span>
              <input
                className="input"
                placeholder="Search assets…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        {isOwner && (
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            <Icons.plus size={16} /> Add Asset
          </button>
        )}
      </div>
      <div className="chips" style={{ marginBottom: 20 }}>
        {cats.map((c) => (
          <button
            key={c}
            className={`chip ${filter === c ? "active" : ""}`}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <EmptyState
          icon={Icons.map}
          title="No assets found"
          desc={
            search
              ? "Try a different search."
              : "Start by adding your first account, investment, policy or asset."
          }
          action={
            isOwner && (
              <button
                className="btn btn-primary"
                onClick={() => setShowAdd(true)}
              >
                <Icons.plus size={14} /> Add your first asset
              </button>
            )
          }
        />
      ) : (
        <div className="grid-auto">
          {filtered.map((a) => (
            <AssetCard
              key={a.id}
              asset={a}
              onClick={() => setSelectedAsset(a)}
            />
          ))}
        </div>
      )}
      {showAdd && (
        <AddAssetModal
          initialData={typeof showAdd === "object" ? showAdd : null}
          onClose={() => setShowAdd(false)}
          onSave={handleSave}
        />
      )}
      {showDelete && (
        <ConfirmModal
          title="Remove asset"
          desc={`Remove this asset? This cannot be undone.`}
          onConfirm={() => handleDelete(showDelete)}
          onCancel={() => setShowDelete(null)}
        />
      )}
    </div>
  );
}

function AssetCard({ asset, onClick }) {
  const CatIcon = assetIcon(asset.type);
  return (
    <div className="card card-hover" onClick={onClick}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              background: catBg(asset.type),
              color: catColor(asset.type),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <CatIcon />
          </div>
          <div>
            <div
              style={{ fontWeight: 700, fontSize: "0.9rem", lineHeight: 1.2 }}
            >
              {asset.name}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                marginTop: 1,
              }}
            >
              {asset.institution}
            </div>
          </div>
        </div>
        <span
          className={`badge ${
            asset.status === "Active" ? "badge-green" : "badge-gray"
          }`}
        >
          {asset.status}
        </span>
      </div>
      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            fontSize: "0.7rem",
            color: "var(--text-muted)",
            fontWeight: 600,
            marginBottom: 3,
          }}
        >
          APPROX. VALUE
        </div>
        <div
          style={{
            fontSize: "1.2rem",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color:
              asset.approxValue < 0 ? "var(--error)" : "var(--text-primary)",
          }}
        >
          {asset.type === "Insurance"
            ? fmt(asset.approxValue) + " cover"
            : asset.approxValue < 0
            ? `-${fmt(Math.abs(asset.approxValue))}`
            : fmt(asset.approxValue)}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 16,
          fontSize: "0.78rem",
          color: "var(--text-secondary)",
          marginBottom: 14,
          borderTop: "1px solid var(--border-light)",
          paddingTop: 12,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Icons.user size={13} />
          {asset.nominee ? (
            <span
              style={{
                color: asset.nomineeVerified ? "var(--accent)" : "var(--warn)",
              }}
            >
              {asset.nomineeVerified ? "✓ " : "⚠ "}
              {asset.nominee}
            </span>
          ) : (
            <span style={{ color: "var(--error)" }}>No nominee</span>
          )}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Icons.file size={13} /> {asset.documents?.length || 0} docs
        </span>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <span
          style={{
            fontSize: "0.8rem",
            color: "var(--accent)",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          View details <Icons.chevronRight size={13} />
        </span>
      </div>
    </div>
  );
}

function AssetDetail({ asset, onBack, onEdit, onDelete, children }) {
  const { people, documents: allDocs } = useApp();
  const docs = allDocs.filter((d) => asset.documents?.includes(d.id));
  const CatIcon = assetIcon(asset.type);
  const nominee = people.find((p) => p.name === asset.nominee);

  return (
    <div className="content fade-in">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <button
          className="btn btn-ghost btn-sm"
          onClick={onBack}
          style={{ padding: "6px 10px" }}
        >
          <Icons.chevronRight
            size={14}
            style={{ transform: "rotate(180deg)" }}
          />{" "}
          Back
        </button>
        <div style={{ width: 1, height: 20, background: "var(--border)" }} />
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: catBg(asset.type),
              color: catColor(asset.type),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CatIcon size={15} />
          </div>
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            {asset.type}
          </span>
        </div>
        <div style={{ flex: 1 }} />
        {onEdit && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onEdit(asset)}
          >
            <Icons.edit size={14} /> Edit
          </button>
        )}
        {onDelete && (
          <button className="btn btn-danger btn-sm" onClick={onDelete}>
            <Icons.trash size={14} /> Remove
          </button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Overview */}
        <div className="card">
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  marginBottom: 4,
                }}
              >
                {asset.name}
              </h1>
              <div
                style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}
              >
                {asset.subtype} · {asset.institution}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "var(--text-muted)",
                  fontWeight: 600,
                  marginBottom: 2,
                }}
              >
                APPROX. VALUE
              </div>
              <div
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  color:
                    asset.approxValue < 0 ? "var(--error)" : "var(--accent)",
                }}
              >
                {asset.type === "Insurance"
                  ? fmt(asset.approxValue) + " cover"
                  : asset.approxValue < 0
                  ? `-${fmt(Math.abs(asset.approxValue))}`
                  : fmt(asset.approxValue)}
              </div>
            </div>
          </div>
          <div className="divider" />
          <div className="grid-3" style={{ gap: 20 }}>
            {[
              { label: "Status", value: asset.status, badge: true },
              { label: "Created", value: fmtDate(asset.createdAt) },
              { label: "Last Verified", value: fmtDate(asset.lastVerified) },
            ].map(({ label, value, badge }) => (
              <div key={label}>
                <div
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    color: "var(--text-muted)",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  {label}
                </div>
                {badge ? (
                  <span className="badge badge-green">{value}</span>
                ) : (
                  <div style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                    {value}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid-2">
          {/* Nomination */}
          <div className="card">
            <div className="section-label">Nominee</div>
            {asset.nominee ? (
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div className="avatar avatar-lg">
                  {asset.nominee
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>{asset.nominee}</div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {nominee?.relationship || "Trusted Person"}
                  </div>
                  <div style={{ marginTop: 4 }}>
                    <span
                      className={`badge ${
                        asset.nomineeVerified ? "badge-green" : "badge-amber"
                      }`}
                    >
                      {asset.nomineeVerified
                        ? "Verified ✓"
                        : "Verification pending"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  color: "var(--error)",
                  fontSize: "0.875rem",
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <Icons.alertTriangle size={15} /> No nominee on record
              </div>
            )}
            <div className="divider" />
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                lineHeight: 1.6,
                padding: "4px 0",
                background: "var(--surface-alt)",
                borderRadius: 8,
                padding: "10px 12px",
              }}
            >
              <Icons.info
                size={12}
                style={{ marginRight: 5, verticalAlign: "middle" }}
              />
              Nominee does not automatically transfer ownership. Consult legal
              counsel for estate planning.
            </div>
          </div>

          {/* Contacts */}
          <div className="card">
            <div className="section-label">Important Contacts</div>
            {asset.contacts?.length ? (
              asset.contacts.map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom:
                      i < asset.contacts.length - 1
                        ? "1px solid var(--border-light)"
                        : "none",
                  }}
                >
                  <div style={{ fontWeight: 500, fontSize: "0.875rem" }}>
                    {c.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {c.phone}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                No contacts added.
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        {asset.instructions !== undefined && (
          <div className="card">
            <div className="section-label">Owner Instructions</div>
            {asset.instructions ? (
              <p
                style={{
                  fontSize: "0.9rem",
                  lineHeight: 1.7,
                  color: "var(--text-primary)",
                  fontStyle: "italic",
                }}
              >
                "{asset.instructions}"
              </p>
            ) : (
              <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                No instructions added for this asset.
              </div>
            )}
          </div>
        )}

        {/* Documents */}
        <div className="card">
          <div className="section-label">Documents ({docs.length})</div>
          {docs.length ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {docs.map((d) => (
                <DocRow key={d.id} doc={d} />
              ))}
            </div>
          ) : (
            <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
              No documents attached to this asset.
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

// ─── ADD ASSET MODAL ──────────────────────────────────────────────────────────
const ASSET_TYPES = [
  "Bank Account",
  "Stocks",
  "Mutual Fund",
  "Fixed Deposit",
  "Term Insurance",
  "Health Insurance",
  "NPS / Retirement",
  "Property",
  "Home Loan",
  "Other",
];
function AddAssetModal({ onClose, onSave, initialData }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(
    initialData || {
      type: "",
      subtype: "",
      institution: "",
      name: "",
      approxValue: "",
      nominee: "",
      nomineeVerified: false,
      instructions: "",
      status: "Active",
      documents: [],
      contacts: [],
      accountNumber: "",
    }
  );
  const totalSteps = 5;
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const typeMap = {
    "Bank Account": "Banking",
    Stocks: "Investments",
    "Mutual Fund": "Investments",
    "Fixed Deposit": "Banking",
    "Term Insurance": "Insurance",
    "Health Insurance": "Insurance",
    "NPS / Retirement": "Retirement",
    Property: "Property",
    "Home Loan": "Loans",
    Other: "Other",
  };

  const handleSave = () => {
    const asset = {
      ...form,
      id: initialData?.id || `a${Date.now()}`,
      type: typeMap[form.subtype] || form.type || "Other",
      approxValue: Number(form.approxValue) || 0,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      lastVerified: new Date().toISOString().split("T")[0],
    };
    onSave(asset);
  };

  return (
    <Modal
      title={initialData ? "Edit Asset" : "Add Asset"}
      subtitle="Organize your financial information"
      onClose={onClose}
      footer={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <button
            className="btn btn-ghost"
            onClick={step > 1 ? () => setStep((s) => s - 1) : onClose}
          >
            {step > 1 ? "Back" : "Cancel"}
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            {step < totalSteps ? (
              <button
                className="btn btn-primary"
                onClick={() => setStep((s) => s + 1)}
                disabled={step === 1 && !form.subtype}
              >
                Continue
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleSave}>
                Save Asset
              </button>
            )}
          </div>
        </div>
      }
    >
      <div className="step-progress">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className={`step-pip ${i < step ? "done" : ""}`} />
        ))}
      </div>
      {step === 1 && (
        <div>
          <div
            style={{ marginBottom: 12, fontSize: "0.875rem", fontWeight: 600 }}
          >
            What are you adding?
          </div>
          <div className="grid-2" style={{ gap: 8 }}>
            {ASSET_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => set("subtype", t)}
                style={{
                  padding: "10px 14px",
                  border: `2px solid ${
                    form.subtype === t ? "var(--accent)" : "var(--border)"
                  }`,
                  borderRadius: "var(--radius-sm)",
                  background:
                    form.subtype === t
                      ? "var(--accent-light)"
                      : "var(--surface)",
                  cursor: "pointer",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color:
                    form.subtype === t
                      ? "var(--accent)"
                      : "var(--text-primary)",
                  textAlign: "left",
                  transition: "all 0.15s",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}
      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: 2 }}
          >
            Where is it held?
          </div>
          {[
            { k: "institution", l: "Institution / Provider" },
            { k: "name", l: "Account / Policy Name" },
            { k: "accountNumber", l: "Account / Policy Number (optional)" },
            { k: "approxValue", l: "Approximate Value (₹)", type: "number" },
          ].map(({ k, l, type }) => (
            <div key={k} className="input-group">
              <label className="label">{l}</label>
              <input
                className="input"
                type={type || "text"}
                value={form[k] || ""}
                onChange={(e) => set(k, e.target.value)}
                placeholder={l}
              />
            </div>
          ))}
          <div className="input-group">
            <label className="label">Status</label>
            <select
              className="input"
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
            >
              <option>Active</option>
              <option>Inactive</option>
              <option>Matured</option>
              <option>Closed</option>
            </select>
          </div>
        </div>
      )}
      {step === 3 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: 2 }}
          >
            Who should know about this?
          </div>
          <div className="input-group">
            <label className="label">Nominee Name</label>
            <input
              className="input"
              value={form.nominee || ""}
              onChange={(e) => set("nominee", e.target.value)}
              placeholder="Full name of nominee"
            />
          </div>
          <div
            className="perm-row"
            style={{
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              padding: "12px 14px",
            }}
          >
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                Nominee verified?
              </div>
              <div
                style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}
              >
                Have you confirmed nominee records with the institution?
              </div>
            </div>
            <Switch
              checked={form.nomineeVerified}
              onChange={(v) => set("nomineeVerified", v)}
            />
          </div>
          <div
            style={{
              background: "var(--surface-alt)",
              borderRadius: "var(--radius-sm)",
              padding: "10px 12px",
              fontSize: "0.75rem",
              color: "var(--text-secondary)",
            }}
          >
            <Icons.info
              size={12}
              style={{ marginRight: 5, verticalAlign: "middle" }}
            />{" "}
            Nominee is not the same as legal heir. Consult legal counsel for
            estate planning.
          </div>
        </div>
      )}
      {step === 4 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: 2 }}
          >
            Add instructions
          </div>
          <div className="input-group">
            <label className="label">Owner Instructions</label>
            <textarea
              className="input"
              value={form.instructions || ""}
              onChange={(e) => set("instructions", e.target.value)}
              placeholder="Any instructions for your trusted person about this asset…"
              style={{ minHeight: 100 }}
            />
          </div>
          <div
            style={{
              background: "var(--accent-light)",
              borderRadius: "var(--radius-sm)",
              padding: "12px",
              fontSize: "0.8rem",
              color: "var(--accent)",
              lineHeight: 1.5,
            }}
          >
            These instructions will be visible to your trusted person based on
            their access level. Be specific and clear.
          </div>
        </div>
      )}
      {step === 5 && (
        <div>
          <div
            style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: 14 }}
          >
            Review
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              ["Type", form.subtype],
              ["Institution", form.institution],
              ["Name", form.name],
              [
                "Value",
                form.approxValue
                  ? `₹${Number(form.approxValue).toLocaleString("en-IN")}`
                  : "Not set",
              ],
              ["Nominee", form.nominee || "Not set"],
              ["Status", form.status],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid var(--border-light)",
                }}
              >
                <span
                  style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}
                >
                  {k}
                </span>
                <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                  {v || "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}

// ─── DOCUMENTS ────────────────────────────────────────────────────────────────
function DocRow({ doc }) {
  const catColor2 = {
    Insurance: "#B45309",
    Banking: "#1D4ED8",
    Investments: "#6D28D9",
    Retirement: "#0F766E",
    Property: "#BE185D",
    Legal: "#374151",
    Tax: "#047857",
    Other: "#4B5563",
  };
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        padding: "10px 12px",
        border: "1px solid var(--border-light)",
        borderRadius: "var(--radius-sm)",
        alignItems: "center",
        background: "var(--surface)",
        transition: "background 0.15s",
      }}
      className="card-hover"
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: "#EFF6FF",
          color: "#1D4ED8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icons.file size={17} />
      </div>
      <div style={{ flex: 1, overflow: "hidden" }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: "0.85rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {doc.title}
        </div>
        <div
          style={{
            fontSize: "0.72rem",
            color: "var(--text-muted)",
            marginTop: 2,
          }}
        >
          {doc.type} · {doc.format} · {doc.size}
        </div>
      </div>
      <div style={{ display: "flex", align: "center", gap: 8, flexShrink: 0 }}>
        <span
          className="badge"
          style={{
            background: catBg(doc.category) || "#F9FAFB",
            color: catColor2[doc.category] || "#4B5563",
          }}
        >
          {doc.category}
        </span>
        {doc.verified && <span className="badge badge-green">Verified</span>}
      </div>
    </div>
  );
}

function Documents() {
  const { documents, saveDocuments, addActivity, showToast, viewMode } =
    useApp();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const isOwner = viewMode === "owner";
  const cats = [
    "All",
    "Insurance",
    "Banking",
    "Investments",
    "Retirement",
    "Property",
    "Legal",
    "Tax",
    "Other",
  ];

  const filtered = documents.filter((d) => {
    const matchCat = filter === "All" || d.category === filter;
    const matchSearch =
      !search || d.title?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleUpload = (doc) => {
    const newDoc = {
      ...doc,
      id: `d${Date.now()}`,
      uploadDate: new Date().toISOString().split("T")[0],
    };
    saveDocuments([...documents, newDoc]);
    addActivity({
      type: "document",
      title: "Document added",
      detail: doc.title,
    });
    showToast("Document added.");
    setShowUpload(false);
  };

  return (
    <div className="content fade-in">
      <div
        style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}
      >
        <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
          <span className="search-icon">
            <Icons.search size={15} />
          </span>
          <input
            className="input"
            placeholder="Search documents…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {isOwner && (
          <button
            className="btn btn-primary"
            onClick={() => setShowUpload(true)}
          >
            <Icons.upload size={15} /> Add Document
          </button>
        )}
      </div>
      <div className="chips" style={{ marginBottom: 20 }}>
        {cats.map((c) => (
          <button
            key={c}
            className={`chip ${filter === c ? "active" : ""}`}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <EmptyState
          icon={Icons.docs}
          title="No documents found"
          desc={
            search
              ? "Try a different search."
              : "Upload your first document to get started."
          }
          action={
            isOwner && (
              <button
                className="btn btn-primary"
                onClick={() => setShowUpload(true)}
              >
                <Icons.upload size={14} /> Upload document
              </button>
            )
          }
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((d) => (
            <DocRow key={d.id} doc={d} />
          ))}
        </div>
      )}
      {showUpload && (
        <UploadDocModal
          onClose={() => setShowUpload(false)}
          onSave={handleUpload}
        />
      )}
    </div>
  );
}

function UploadDocModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    title: "",
    type: "Statement",
    category: "Banking",
    format: "PDF",
    verified: false,
    size: "—",
    linkedAsset: null,
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1024 * 1024 * 2) {
      alert("For demo purposes, please use a file under 2 MB.");
      return;
    }
    set("title", file.name.replace(/\.[^.]+$/, ""));
    set("size", `${(file.size / 1024).toFixed(0)} KB`);
    set("format", file.name.split(".").pop()?.toUpperCase() || "PDF");
  };

  return (
    <Modal
      title="Add Document"
      subtitle="Documents are stored as metadata in your browser for this demo."
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onSave(form)}
            disabled={!form.title}
          >
            Save Document
          </button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div
          style={{
            border: "2px dashed var(--border)",
            borderRadius: "var(--radius)",
            padding: "28px",
            textAlign: "center",
            cursor: "pointer",
            background: "var(--surface-alt)",
            transition: "border 0.2s",
          }}
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            style={{ display: "none" }}
            onChange={handleFile}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
          <Icons.upload
            size={24}
            style={{ color: "var(--text-muted)", marginBottom: 8 }}
          />
          <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>
            Click to select a file
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              marginTop: 4,
            }}
          >
            PDF, JPG, PNG, DOC (max 2 MB for demo)
          </div>
        </div>
        <div className="input-group">
          <label className="label">Document Title</label>
          <input
            className="input"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. LIC Policy Document"
          />
        </div>
        <div className="grid-2" style={{ gap: 12 }}>
          <div className="input-group">
            <label className="label">Category</label>
            <select
              className="input"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            >
              {[
                "Insurance",
                "Banking",
                "Investments",
                "Retirement",
                "Property",
                "Tax",
                "Legal",
                "Other",
              ].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label className="label">Document Type</label>
            <select
              className="input"
              value={form.type}
              onChange={(e) => set("type", e.target.value)}
            >
              {[
                "Statement",
                "Policy",
                "Report",
                "Legal",
                "Passbook",
                "Summary",
                "Identity",
                "Other",
              ].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <div
          style={{
            background: "var(--warn-light)",
            borderRadius: "var(--radius-sm)",
            padding: "10px 12px",
            fontSize: "0.75rem",
            color: "var(--warn)",
            lineHeight: 1.5,
          }}
        >
          Prototype note: This demo stores document metadata only. In
          production, documents would be securely encrypted and stored with
          access controls.
        </div>
      </div>
    </Modal>
  );
}

// ─── PEOPLE ───────────────────────────────────────────────────────────────────
const ALL_PERMISSIONS = [
  {
    key: "financial_inventory",
    label: "Financial Inventory",
    desc: "Overview of all assets and categories",
  },
  {
    key: "documents",
    label: "Documents",
    desc: "Access to uploaded documents",
  },
  {
    key: "insurance",
    label: "Insurance Details",
    desc: "Policy numbers and coverage information",
  },
  {
    key: "investments",
    label: "Investment Information",
    desc: "Portfolio and account details",
  },
  {
    key: "instructions",
    label: "Owner Instructions",
    desc: "Personal instructions and notes",
  },
  {
    key: "contacts",
    label: "Important Contacts",
    desc: "Institution and advisor contact details",
  },
  {
    key: "continuity_alerts",
    label: "Continuity Alerts",
    desc: "Notifications when check-in is missed",
  },
];

function People() {
  const { people, savePeople, addActivity, showToast, viewMode } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [editPerson, setEditPerson] = useState(null);
  const [permPerson, setPermPerson] = useState(null);
  const [deletePerson, setDeletePerson] = useState(null);
  const isOwner = viewMode === "owner";

  const handleSave = (person) => {
    const isNew = !people.find((p) => p.id === person.id);
    const updated = isNew
      ? [...people, person]
      : people.map((p) => (p.id === person.id ? person : p));
    savePeople(updated);
    addActivity({
      type: "person",
      title: isNew ? "Person added" : "Person updated",
      detail: person.name,
    });
    showToast(
      isNew ? "Person added to your trusted circle." : "Contact updated."
    );
    setShowAdd(false);
    setEditPerson(null);
  };

  const handleDelete = (id) => {
    savePeople(people.filter((p) => p.id !== id));
    addActivity({
      type: "person",
      title: "Person removed",
      detail: people.find((p) => p.id === id)?.name || "",
    });
    showToast("Person removed.");
    setDeletePerson(null);
  };

  const handlePermSave = (id, perms) => {
    const updated = people.map((p) =>
      p.id === id ? { ...p, permissions: perms } : p
    );
    savePeople(updated);
    showToast("Permissions updated.");
    setPermPerson(null);
  };

  return (
    <div className="content fade-in">
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 20,
        }}
      >
        {isOwner && (
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            <Icons.plus size={16} /> Add Person
          </button>
        )}
      </div>
      {people.length === 0 ? (
        <EmptyState
          icon={Icons.people}
          title="Your trusted circle is empty"
          desc="Add the people who should know about your financial information."
          action={
            isOwner && (
              <button
                className="btn btn-primary"
                onClick={() => setShowAdd(true)}
              >
                <Icons.plus size={14} /> Add first person
              </button>
            )
          }
        />
      ) : (
        <div className="grid-auto">
          {people.map((p) => (
            <div key={p.id} className="card">
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  marginBottom: 14,
                }}
              >
                <div
                  className="avatar avatar-lg"
                  style={{ background: "#EFF6FF", color: "#1D4ED8" }}
                >
                  {p.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                    {p.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-secondary)",
                      marginTop: 1,
                    }}
                  >
                    {p.relationship}
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <span
                      className={`badge ${
                        p.status === "Verified" ? "badge-green" : "badge-blue"
                      }`}
                    >
                      {p.status}
                    </span>
                    <span
                      className="badge badge-gray"
                      style={{ marginLeft: 6 }}
                    >
                      {p.role}
                    </span>
                  </div>
                </div>
              </div>
              <div
                style={{
                  marginBottom: 14,
                  padding: "10px 12px",
                  background: "var(--surface-alt)",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    color: "var(--text-muted)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  Access Granted
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {ALL_PERMISSIONS.filter((perm) =>
                    p.permissions?.includes(perm.key)
                  ).map((perm) => (
                    <span
                      key={perm.key}
                      style={{
                        fontSize: "0.72rem",
                        background: "var(--success-light)",
                        color: "var(--success)",
                        padding: "2px 8px",
                        borderRadius: 100,
                        fontWeight: 500,
                      }}
                    >
                      {perm.label}
                    </span>
                  ))}
                  {!p.permissions?.length && (
                    <span
                      style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                    >
                      No access granted
                    </span>
                  )}
                </div>
              </div>
              {isOwner && (
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => setPermPerson(p)}
                  >
                    Manage Access
                  </button>
                  <button className="btn-icon" onClick={() => setEditPerson(p)}>
                    <Icons.edit size={14} />
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => setDeletePerson(p.id)}
                    style={{ color: "var(--error)" }}
                  >
                    <Icons.trash size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {(showAdd || editPerson) && (
        <AddPersonModal
          initialData={editPerson}
          onClose={() => {
            setShowAdd(false);
            setEditPerson(null);
          }}
          onSave={handleSave}
        />
      )}
      {permPerson && (
        <PermissionModal
          person={permPerson}
          onClose={() => setPermPerson(null)}
          onSave={handlePermSave}
        />
      )}
      {deletePerson && (
        <ConfirmModal
          title="Remove person"
          desc="This person will no longer have access to your continuity information."
          onConfirm={() => handleDelete(deletePerson)}
          onCancel={() => setDeletePerson(null)}
        />
      )}
    </div>
  );
}

function AddPersonModal({ onClose, onSave, initialData }) {
  const [form, setForm] = useState(
    initialData || {
      name: "",
      relationship: "Spouse",
      email: "",
      phone: "",
      role: "Trusted Person",
      status: "Pending",
      permissions: ["financial_inventory"],
    }
  );
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const handleSave = () =>
    onSave({
      ...form,
      id: initialData?.id || `p${Date.now()}`,
      avatar: form.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      joinedAt: initialData?.joinedAt || new Date().toISOString().split("T")[0],
    });

  return (
    <Modal
      title={initialData ? "Edit Person" : "Add to Trusted Circle"}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!form.name}
          >
            Save
          </button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {[
          { k: "name", l: "Full Name" },
          { k: "email", l: "Email Address", t: "email" },
          { k: "phone", l: "Phone Number", t: "tel" },
        ].map(({ k, l, t }) => (
          <div key={k} className="input-group">
            <label className="label">{l}</label>
            <input
              className="input"
              type={t || "text"}
              value={form[k] || ""}
              onChange={(e) => set(k, e.target.value)}
              placeholder={l}
            />
          </div>
        ))}
        <div className="grid-2" style={{ gap: 12 }}>
          <div className="input-group">
            <label className="label">Relationship</label>
            <select
              className="input"
              value={form.relationship}
              onChange={(e) => set("relationship", e.target.value)}
            >
              {[
                "Spouse",
                "Parent",
                "Child",
                "Sibling",
                "Guardian",
                "Financial Advisor",
                "Lawyer",
                "Executor",
                "Other",
              ].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label className="label">Role</label>
            <select
              className="input"
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
            >
              {["Trusted Person", "Advisor", "Executor", "Observer"].map(
                (r) => (
                  <option key={r}>{r}</option>
                )
              )}
            </select>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function PermissionModal({ person, onClose, onSave }) {
  const [perms, setPerms] = useState(person.permissions || []);
  const toggle = (key) =>
    setPerms((p) =>
      p.includes(key) ? p.filter((k) => k !== key) : [...p, key]
    );

  return (
    <Modal
      title={`Manage Access — ${person.name}`}
      subtitle="Choose what this person can see in your continuity plan."
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onSave(person.id, perms)}
          >
            Save Permissions
          </button>
        </>
      }
    >
      <div>
        {ALL_PERMISSIONS.map((p) => (
          <div key={p.key} className="perm-row">
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                {p.label}
              </div>
              <div
                style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}
              >
                {p.desc}
              </div>
            </div>
            <Switch
              checked={perms.includes(p.key)}
              onChange={() => toggle(p.key)}
            />
          </div>
        ))}
      </div>
    </Modal>
  );
}

// ─── CONTINUITY ───────────────────────────────────────────────────────────────
function Continuity() {
  const { continuity, saveContinuity, addActivity, showToast, people } =
    useApp();
  const [showCheckin, setShowCheckin] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleCheckin = () => {
    const now = new Date();
    const next = new Date(now);
    next.setDate(next.getDate() + (continuity?.frequency || 30));
    const updated = {
      ...continuity,
      lastCheckin: now.toISOString().split("T")[0],
      nextCheckin: next.toISOString().split("T")[0],
      active: true,
    };
    saveContinuity(updated);
    addActivity({
      type: "checkin",
      title: "Safety check completed",
      detail: "",
    });
    setShowCheckin(false);
    showToast("Check-in confirmed. You're all set.");
  };

  const notifyPerson = people.find((p) => p.id === continuity?.notifyPerson);

  return (
    <div className="content fade-in">
      {/* Status Banner */}
      <div
        className="card"
        style={{
          marginBottom: 20,
          borderLeft: `3px solid ${
            continuity?.active ? "var(--accent)" : "var(--error)"
          }`,
          background: continuity?.active
            ? "linear-gradient(135deg, #F0F7F4 0%, #FFFFFF 100%)"
            : "var(--error-light)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: continuity?.active
                  ? "var(--success-light)"
                  : "var(--error-light)",
                color: continuity?.active ? "var(--success)" : "var(--error)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icons.shield size={20} />
            </div>
            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: "1rem",
                  letterSpacing: "-0.01em",
                }}
              >
                Continuity {continuity?.active ? "Active" : "Inactive"}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  marginTop: 3,
                }}
              >
                Last check-in:{" "}
                <strong>{fmtDate(continuity?.lastCheckin)}</strong> · Next:{" "}
                <strong>{fmtDate(continuity?.nextCheckin)}</strong>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn btn-primary"
              onClick={() => setShowCheckin(true)}
            >
              Check In Now
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowEdit(true)}
            >
              Edit Settings
            </button>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        {/* Safety Check Config */}
        <div className="card">
          <div className="section-label">Safety Check</div>
          {[
            {
              label: "Check-in Frequency",
              value: `Every ${continuity?.frequency || 30} days`,
            },
            {
              label: "Reminder Window",
              value: `${continuity?.reminderDays || 3} days before`,
            },
            {
              label: "Grace Period",
              value: `${
                continuity?.gracePeriod || 15
              } days after missed check-in`,
            },
            {
              label: "Notify Person",
              value: notifyPerson?.name || "Not configured",
            },
            {
              label: "Initial Access Level",
              value: continuity?.initialAccess
                ? continuity.initialAccess.charAt(0).toUpperCase() +
                  continuity.initialAccess.slice(1)
                : "Limited",
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "9px 0",
                borderBottom: "1px solid var(--border-light)",
                alignItems: "center",
              }}
            >
              <span
                style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}
              >
                {label}
              </span>
              <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Escalation Timeline */}
        <div className="card">
          <div className="section-label">Escalation Flow</div>
          <div className="timeline">
            {[
              {
                dot: Icons.user,
                label: "You",
                sub: "Regular check-ins keep continuity active",
                color: "var(--accent)",
              },
              {
                dot: Icons.clock,
                label: `Check-in due`,
                sub: `Every ${continuity?.frequency || 30} days`,
                color: "var(--text-secondary)",
              },
              {
                dot: Icons.bell,
                label: "Reminder sent",
                sub: `${continuity?.reminderDays || 3} days before deadline`,
                color: "#1D4ED8",
              },
              {
                dot: Icons.alertTriangle,
                label: "Grace period",
                sub: `${continuity?.gracePeriod || 15} days to respond`,
                color: "#B45309",
              },
              {
                dot: Icons.people,
                label: "Trusted person alerted",
                sub: notifyPerson?.name || "Your trusted person",
                color: "#6D28D9",
              },
              {
                dot: Icons.lock,
                label: "Limited access granted",
                sub: "Based on your configured settings",
                color: "var(--text-muted)",
              },
            ].map((item, i) => (
              <div key={i} className="timeline-item">
                <div
                  className="timeline-dot"
                  style={{ background: "#F0F7F4", color: item.color }}
                >
                  <item.dot size={13} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-secondary)",
                      marginTop: 2,
                    }}
                  >
                    {item.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div
        className="card"
        style={{ background: "var(--warn-light)", border: "1px solid #FDE68A" }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <Icons.info
            size={18}
            style={{ color: "var(--warn)", flexShrink: 0, marginTop: 1 }}
          />
          <p style={{ fontSize: "0.82rem", color: "#92400E", lineHeight: 1.7 }}>
            <strong>Important:</strong> Inactivity does not confirm death or
            incapacity. These settings control reminders and emergency access
            according to your chosen policy. Your trusted person will need to
            follow proper legal and institutional procedures to act on any
            financial matters.
          </p>
        </div>
      </div>

      {showCheckin && (
        <CheckinModal
          onClose={() => setShowCheckin(false)}
          onConfirm={handleCheckin}
          nextDate={continuity?.nextCheckin}
        />
      )}
      {showEdit && (
        <EditContinuityModal
          continuity={continuity}
          people={people}
          onClose={() => setShowEdit(false)}
          onSave={(c) => {
            saveContinuity(c);
            showToast("Continuity settings saved.");
            setShowEdit(false);
          }}
        />
      )}
    </div>
  );
}

function CheckinModal({ onClose, onConfirm, nextDate }) {
  const [done, setDone] = useState(false);
  const handleConfirm = () => {
    setDone(true);
    setTimeout(() => {
      onConfirm();
    }, 1200);
  };

  return (
    <Modal title="" onClose={onClose}>
      <div style={{ textAlign: "center", padding: "20px 10px" }}>
        {done ? (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "var(--success-light)",
                color: "var(--success)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Icons.checkCircle size={28} />
            </div>
            <h2
              style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 6 }}
            >
              You're all set.
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
              Next check-in: <strong>{fmtDate(nextDate)}</strong>
            </p>
          </div>
        ) : (
          <>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "var(--accent-light)",
                color: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Icons.shield size={24} />
            </div>
            <h2
              style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: 8 }}
            >
              Just checking in
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.875rem",
                lineHeight: 1.6,
                marginBottom: 24,
              }}
            >
              A quick confirmation keeps your continuity plan active and lets
              your trusted people know everything is fine.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button className="btn btn-secondary" onClick={onClose}>
                Remind Me Later
              </button>
              <button className="btn btn-primary" onClick={handleConfirm}>
                <Icons.check size={15} /> I'm Okay
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

function EditContinuityModal({ continuity, people, onClose, onSave }) {
  const [form, setForm] = useState(
    continuity || {
      frequency: 30,
      reminderDays: 3,
      gracePeriod: 15,
      notifyPerson: "",
      initialAccess: "limited",
    }
  );
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Modal
      title="Continuity Settings"
      subtitle="Configure how your plan activates when you're unavailable."
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={() => onSave(form)}>
            Save Settings
          </button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="input-group">
          <label className="label">Check-in Frequency</label>
          <select
            className="input"
            value={form.frequency}
            onChange={(e) => set("frequency", Number(e.target.value))}
          >
            {[7, 14, 30, 60, 90].map((d) => (
              <option key={d} value={d}>
                Every {d} days
              </option>
            ))}
          </select>
        </div>
        <div className="grid-2" style={{ gap: 12 }}>
          <div className="input-group">
            <label className="label">Reminder Window (days before)</label>
            <select
              className="input"
              value={form.reminderDays}
              onChange={(e) => set("reminderDays", Number(e.target.value))}
            >
              {[1, 3, 5, 7].map((d) => (
                <option key={d} value={d}>
                  {d} days
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label className="label">Grace Period (days)</label>
            <select
              className="input"
              value={form.gracePeriod}
              onChange={(e) => set("gracePeriod", Number(e.target.value))}
            >
              {[7, 14, 15, 30].map((d) => (
                <option key={d} value={d}>
                  {d} days
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="input-group">
          <label className="label">Person to Notify</label>
          <select
            className="input"
            value={form.notifyPerson}
            onChange={(e) => set("notifyPerson", e.target.value)}
          >
            <option value="">Select a trusted person</option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.relationship})
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label className="label">Initial Emergency Access Level</label>
          <select
            className="input"
            value={form.initialAccess}
            onChange={(e) => set("initialAccess", e.target.value)}
          >
            <option value="limited">
              Limited — Financial overview and contacts only
            </option>
            <option value="selected">
              Selected — Based on permissions you've set
            </option>
            <option value="full">Full — All information</option>
          </select>
        </div>
      </div>
    </Modal>
  );
}

// ─── ACTIVITY ─────────────────────────────────────────────────────────────────
function Activity() {
  const { activity } = useApp();
  const groupByDate = (items) => {
    const groups = {};
    items.forEach((item) => {
      const d = new Date(item.timestamp);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const label =
        d >= today
          ? "Today"
          : d >= yesterday
          ? "Yesterday"
          : fmtDate(item.timestamp);
      if (!groups[label]) groups[label] = [];
      groups[label].push(item);
    });
    return groups;
  };

  const typeConfig = {
    checkin: {
      Icon: Icons.checkCircle,
      color: "var(--success)",
      bg: "var(--success-light)",
    },
    document: { Icon: Icons.file, color: "#1D4ED8", bg: "#EFF6FF" },
    asset: { Icon: Icons.layers, color: "#6D28D9", bg: "#F5F3FF" },
    person: { Icon: Icons.people, color: "#0F766E", bg: "#F0FDFA" },
    default: {
      Icon: Icons.activity,
      color: "var(--text-muted)",
      bg: "var(--surface-alt)",
    },
  };

  const groups = groupByDate(activity);

  return (
    <div className="content fade-in">
      {activity.length === 0 ? (
        <EmptyState
          icon={Icons.activity}
          title="No activity yet"
          desc="Your activity history will appear here as you use continuity."
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {Object.entries(groups).map(([date, items]) => (
            <div key={date}>
              <div className="section-label" style={{ marginBottom: 12 }}>
                {date}
              </div>
              <div className="timeline">
                {items.map((item) => {
                  const config = typeConfig[item.type] || typeConfig.default;
                  return (
                    <div key={item.id} className="timeline-item">
                      <div
                        className="timeline-dot"
                        style={{ background: config.bg, color: config.color }}
                      >
                        <config.Icon size={13} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                          {item.title}
                        </div>
                        {item.detail && (
                          <div
                            style={{
                              fontSize: "0.78rem",
                              color: "var(--text-secondary)",
                              marginTop: 2,
                            }}
                          >
                            {item.detail}
                          </div>
                        )}
                        <div
                          style={{
                            fontSize: "0.72rem",
                            color: "var(--text-muted)",
                            marginTop: 3,
                          }}
                        >
                          {new Date(item.timestamp).toLocaleTimeString(
                            "en-IN",
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
function Settings() {
  const { user, handleReset, showToast } = useApp();
  const [tab, setTab] = useState("account");
  const tabs = [
    { id: "account", label: "Account" },
    { id: "security", label: "Security" },
    { id: "notifications", label: "Notifications" },
    { id: "privacy", label: "Privacy" },
    { id: "data", label: "Data" },
  ];
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [notif, setNotif] = useState({
    email: true,
    sms: false,
    push: true,
    checkin: true,
  });

  return (
    <div className="content fade-in">
      <div className="tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`tab ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "account" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            maxWidth: 480,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 16,
              alignItems: "center",
              padding: "16px",
              background: "var(--surface-alt)",
              borderRadius: "var(--radius)",
              marginBottom: 4,
            }}
          >
            <div
              className="avatar"
              style={{ width: 56, height: 56, fontSize: "1.2rem" }}
            >
              {user?.avatar}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "1rem" }}>
                {user?.name}
              </div>
              <div
                style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}
              >
                Owner account · Since {fmtDate(user?.joinDate)}
              </div>
            </div>
          </div>
          {[
            { k: "name", l: "Full Name" },
            { k: "email", l: "Email Address", t: "email" },
            { k: "phone", l: "Phone Number", t: "tel" },
          ].map(({ k, l, t }) => (
            <div key={k} className="input-group">
              <label className="label">{l}</label>
              <input
                className="input"
                type={t || "text"}
                value={form[k]}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [k]: e.target.value }))
                }
              />
            </div>
          ))}
          <button
            className="btn btn-primary"
            style={{ alignSelf: "flex-start" }}
            onClick={() => showToast("Profile updated.")}
          >
            Save Changes
          </button>
        </div>
      )}

      {tab === "security" && (
        <div style={{ maxWidth: 480 }}>
          {[
            {
              title: "Passkey / Biometric",
              desc: "Use Face ID, fingerprint or device PIN to unlock",
              status: "Not set up",
            },
            {
              title: "Two-Factor Authentication",
              desc: "Add an extra layer of verification on sign-in",
              status: "Disabled",
            },
            {
              title: "Active Sessions",
              desc: "This browser session",
              status: "1 active",
            },
            {
              title: "Trusted Devices",
              desc: "Manage devices that can access your account",
              status: "1 device",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 0",
                borderBottom: "1px solid var(--border-light)",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: "0.775rem",
                    color: "var(--text-secondary)",
                    marginTop: 2,
                  }}
                >
                  {item.desc}
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span
                  style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}
                >
                  {item.status}
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() =>
                    showToast(
                      "This would open security settings in production."
                    )
                  }
                >
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "notifications" && (
        <div style={{ maxWidth: 480 }}>
          {[
            {
              key: "email",
              label: "Email notifications",
              desc: "Receive important updates by email",
            },
            {
              key: "sms",
              label: "SMS notifications",
              desc: "Text messages for critical alerts",
            },
            {
              key: "push",
              label: "Push notifications",
              desc: "Browser notifications for activity",
            },
            {
              key: "checkin",
              label: "Check-in reminders",
              desc: "Reminders when your check-in is due",
            },
          ].map(({ key, label, desc }) => (
            <div key={key} className="perm-row">
              <div>
                <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                  {label}
                </div>
                <div
                  style={{
                    fontSize: "0.775rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  {desc}
                </div>
              </div>
              <Switch
                checked={notif[key]}
                onChange={(v) => setNotif((n) => ({ ...n, [key]: v }))}
              />
            </div>
          ))}
        </div>
      )}

      {tab === "privacy" && (
        <div style={{ maxWidth: 480 }}>
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>
              Data Visibility
            </div>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              Your financial information is only visible to you and the trusted
              people you've explicitly authorized. Approximate values are shown
              by default; precise figures can be revealed with an additional
              tap.
            </p>
          </div>
          <div
            className="card"
            style={{
              background: "var(--warn-light)",
              border: "1px solid #FDE68A",
            }}
          >
            <div style={{ display: "flex", gap: 10 }}>
              <Icons.info
                size={16}
                style={{ color: "var(--warn)", flexShrink: 0, marginTop: 1 }}
              />
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#92400E",
                  lineHeight: 1.6,
                }}
              >
                Prototype note: This prototype stores demo information locally
                in your browser. It is not connected to banks, insurers,
                investment platforms, government systems or production-grade
                identity infrastructure.
              </p>
            </div>
          </div>
        </div>
      )}

      {tab === "data" && (
        <div style={{ maxWidth: 480 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="card">
              <div style={{ fontWeight: 700, marginBottom: 4 }}>
                Export Data
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  marginBottom: 14,
                }}
              >
                Download all your financial continuity information as a JSON
                file.
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  const data = {
                    user: storageService.get(STORAGE_KEYS.USER),
                    assets: storageService.get(STORAGE_KEYS.ASSETS),
                    people: storageService.get(STORAGE_KEYS.PEOPLE),
                    documents: storageService.get(STORAGE_KEYS.DOCUMENTS),
                    continuity: storageService.get(STORAGE_KEYS.CONTINUITY),
                  };
                  const blob = new Blob([JSON.stringify(data, null, 2)], {
                    type: "application/json",
                  });
                  const a = document.createElement("a");
                  a.href = URL.createObjectURL(blob);
                  a.download = "continuity-export.json";
                  a.click();
                  showToast("Data exported.");
                }}
              >
                <Icons.download size={14} /> Export as JSON
              </button>
            </div>
            <div className="card" style={{ border: "1px solid var(--border)" }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>
                Reset Demo Data
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  marginBottom: 14,
                }}
              >
                Restore the original demo dataset. Your changes will be lost.
              </div>
              <button
                className="btn btn-danger"
                onClick={() => {
                  if (confirm("Reset all data to demo state?")) handleReset();
                }}
              >
                <Icons.refresh size={14} /> Reset Demo Data
              </button>
            </div>
            <div
              style={{
                background: "var(--surface-alt)",
                borderRadius: "var(--radius)",
                padding: "12px 14px",
              }}
            >
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.6,
                }}
              >
                <strong>Demo Mode Active</strong>
                <br />
                All data is stored in your browser's local storage. Clearing
                browser data will remove all information. This prototype is for
                demonstration purposes only.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── EMERGENCY VIEW ───────────────────────────────────────────────────────────
function EmergencyView() {
  const { assets, people } = useApp();
  const visibleAssets = assets.filter((a) => a.approxValue > 0);
  const contacts = assets.flatMap((a) => a.contacts || []);

  return (
    <div className="content fade-in">
      <div
        className="card"
        style={{
          marginBottom: 20,
          background: "linear-gradient(135deg, #FFF7ED 0%, #FFFBEB 100%)",
          border: "2px solid #FDE68A",
        }}
      >
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "#FDE68A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icons.alertTriangle size={20} style={{ color: "#B45309" }} />
          </div>
          <div>
            <div
              style={{ fontWeight: 800, fontSize: "1rem", color: "#92400E" }}
            >
              Emergency Access Mode
            </div>
            <div
              style={{
                fontSize: "0.8rem",
                color: "#B45309",
                marginTop: 4,
                lineHeight: 1.6,
              }}
            >
              You are viewing limited financial continuity information for{" "}
              <strong>Harsh Dubey</strong>. This access is subject to applicable
              legal and institutional procedures.
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 4,
            }}
          >
            <Icons.checkCircle size={16} style={{ color: "var(--success)" }} />
            <div style={{ fontWeight: 700 }}>Financial Overview</div>
          </div>
          <div
            style={{
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
              marginBottom: 14,
            }}
          >
            High-level summary of organized assets
          </div>
          <div className="grid-2">
            {[
              "Banking",
              "Investments",
              "Insurance",
              "Retirement",
              "Property",
              "Loans",
            ].map((type) => {
              const cat = visibleAssets.filter((a) => a.type === type);
              const total = cat.reduce((s, a) => s + (a.approxValue || 0), 0);
              const CatIcon = assetIcon(type);
              return (
                <div
                  key={type}
                  style={{
                    padding: "12px",
                    background: "var(--surface-alt)",
                    borderRadius: "var(--radius-sm)",
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 7,
                      background: catBg(type),
                      color: catColor(type),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CatIcon size={14} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {type}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>
                      {type === "Insurance"
                        ? `${cat.length} policies`
                        : total === 0
                        ? "—"
                        : fmt(total)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <Icons.checkCircle size={16} style={{ color: "var(--success)" }} />
            <div style={{ fontWeight: 700 }}>Important Contacts</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {contacts.slice(0, 5).map((c, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  background: "var(--surface-alt)",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                  {c.name}
                </span>
                <span
                  style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}
                >
                  {c.phone}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ opacity: 0.6 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 4,
            }}
          >
            <Icons.lock size={16} style={{ color: "var(--text-muted)" }} />
            <div style={{ fontWeight: 700, color: "var(--text-muted)" }}>
              Private Documents
            </div>
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Access restricted. Owner authorization required.
          </div>
        </div>

        <div
          style={{
            background: "var(--surface-alt)",
            borderRadius: "var(--radius)",
            padding: "14px",
            fontSize: "0.78rem",
            color: "var(--text-secondary)",
            lineHeight: 1.7,
          }}
        >
          Emergency access does not constitute legal authority over assets.
          Nominees and legal heirs must follow proper institutional and legal
          processes to claim or manage any financial assets.
        </div>
      </div>
    </div>
  );
}

// ─── CONFIRM MODAL ─────────────────────────────────────────────────────────────
function ConfirmModal({ title, desc, onConfirm, onCancel }) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Confirm
          </button>
        </>
      }
    >
      <p
        style={{
          fontSize: "0.875rem",
          color: "var(--text-secondary)",
          lineHeight: 1.6,
        }}
      >
        {desc}
      </p>
    </Modal>
  );
}

// ─── VIEW MODE SWITCHER ───────────────────────────────────────────────────────
function ViewModeSwitcher({ viewMode, people, onChange }) {
  const options = [
    { id: "owner", label: "Owner" },
    ...people.map((p) => ({ id: p.id, label: p.name.split(" ")[0] })),
    { id: "emergency", label: "Emergency" },
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span
        style={{
          fontSize: "0.72rem",
          color: "var(--text-muted)",
          fontWeight: 600,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        View as
      </span>
      <div className="view-switcher">
        {options.map((o) => (
          <button
            key={o.id}
            className={`view-option ${
              viewMode === o.id ||
              (viewMode !== "owner" &&
                viewMode !== "emergency" &&
                o.id === viewMode)
                ? "active"
                : ""
            }`}
            onClick={() => onChange(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── PAGE TITLES ──────────────────────────────────────────────────────────────
const PAGE_META = {
  dashboard: {
    title: "Home",
    subtitle: "Your financial continuity at a glance",
  },
  "financial-map": {
    title: "Financial Map",
    subtitle: "Everything important, organized in one place.",
  },
  documents: {
    title: "Documents",
    subtitle: "Important documents, available when you need them.",
  },
  people: { title: "People", subtitle: "Choose who should know what matters." },
  continuity: {
    title: "Continuity",
    subtitle: "Decide how your financial information stays accessible.",
  },
  activity: {
    title: "Activity",
    subtitle: "A record of everything that's changed.",
  },
  settings: {
    title: "Settings",
    subtitle: "Account, security and preferences.",
  },
};

const MOBILE_NAV = [
  { id: "dashboard", label: "Home", Icon: Icons.home },
  { id: "financial-map", label: "Map", Icon: Icons.map },
  { id: "documents", label: "Docs", Icon: Icons.docs },
  { id: "people", label: "People", Icon: Icons.people },
  { id: "continuity", label: "Plan", Icon: Icons.continuity },
];

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

function AppShell() {
  const { toast, viewMode, changeViewMode, people } = useApp();
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const meta = PAGE_META[page] || { title: page, subtitle: "" };

  const pageMap = {
    dashboard: <Dashboard onNav={setPage} />,
    "financial-map": <FinancialMap />,
    documents: <Documents />,
    people: <People />,
    continuity: <Continuity />,
    activity: <Activity />,
    settings: <Settings />,
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div
          className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />
        <Sidebar
          current={page}
          onNav={(p) => {
            setPage(p);
            setSidebarOpen(false);
          }}
          user={useApp().user}
          open={sidebarOpen}
        />
        <main className="main">
          <div className="topbar">
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <button
                className="btn-icon"
                style={{ display: "none" }}
                id="menu-btn"
                onClick={() => setSidebarOpen(true)}
              >
                <Icons.menu />
              </button>
              <button
                className="btn-icon"
                style={{ border: "none" }}
                onClick={() => setSidebarOpen((v) => !v)}
              >
                <Icons.menu />
              </button>
              <div>
                <div className="page-title">{meta.title}</div>
                <div className="page-subtitle">{meta.subtitle}</div>
              </div>
            </div>
            <div
              style={{ display: "flex", gap: 10, alignItems: "center" }}
              className="topbar-actions"
            >
              <ViewModeSwitcher
                viewMode={viewMode}
                people={people}
                onChange={changeViewMode}
              />
              <div
                style={{
                  fontSize: "0.68rem",
                  background: "var(--surface-alt)",
                  color: "var(--text-muted)",
                  padding: "3px 8px",
                  borderRadius: 100,
                  fontWeight: 600,
                  border: "1px solid var(--border-light)",
                }}
              >
                DEMO
              </div>
            </div>
          </div>
          {pageMap[page] || <Dashboard onNav={setPage} />}
        </main>
        <nav className="mobile-nav">
          {MOBILE_NAV.map(({ id, label, Icon: Ic }) => (
            <button
              key={id}
              className={`mobile-nav-item ${page === id ? "active" : ""}`}
              onClick={() => setPage(id)}
            >
              <Ic size={20} />
              <span>{label}</span>
            </button>
          ))}
          <button
            className={`mobile-nav-item ${page === "settings" ? "active" : ""}`}
            onClick={() => setPage("settings")}
          >
            <Icons.settings size={20} />
            <span>Settings</span>
          </button>
        </nav>
      </div>
      <Toast msg={toast?.msg} type={toast?.type} />
    </>
  );
}
