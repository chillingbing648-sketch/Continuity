import { createContext, useContext, useState, useEffect } from "react";
import { storageService, STORAGE_KEYS } from "../services/storage.service";

const AppContext = createContext(null);

export function useApp() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [assets, setAssets] = useState([]);
  const [people, setPeople] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [continuity, setContinuity] = useState(null);
  const [activity, setActivity] = useState([]);
  const [viewMode, setViewMode] = useState("owner");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const initMockData = () => {
      if (!storageService.get(STORAGE_KEYS.USER)) {
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

        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(MOCK_DATA.user));
        localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(MOCK_DATA.assets));
        localStorage.setItem(STORAGE_KEYS.PEOPLE, JSON.stringify(MOCK_DATA.people));
        localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(MOCK_DATA.documents));
        localStorage.setItem(STORAGE_KEYS.CONTINUITY, JSON.stringify(MOCK_DATA.continuity));
        localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(MOCK_DATA.activity));
      }
    };

    initMockData();

    setUser(storageService.get(STORAGE_KEYS.USER));
    setAssets(storageService.get(STORAGE_KEYS.ASSETS) || []);
    setPeople(storageService.get(STORAGE_KEYS.PEOPLE) || []);
    setDocuments(storageService.get(STORAGE_KEYS.DOCUMENTS) || []);
    setContinuity(storageService.get(STORAGE_KEYS.CONTINUITY));
    setActivity(storageService.get(STORAGE_KEYS.ACTIVITY) || []);
    setViewMode(storageService.get(STORAGE_KEYS.VIEW_MODE) || "owner");
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

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

  const addActivity = (entry) => {
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
  };

  const handleReset = () => {
    Object.values(STORAGE_KEYS).forEach((k) => storageService.remove(k));
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

    Object.values(STORAGE_KEYS).forEach((k) => storageService.remove(k));
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(MOCK_DATA.user));
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(MOCK_DATA.assets));
    localStorage.setItem(STORAGE_KEYS.PEOPLE, JSON.stringify(MOCK_DATA.people));
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(MOCK_DATA.documents));
    localStorage.setItem(STORAGE_KEYS.CONTINUITY, JSON.stringify(MOCK_DATA.continuity));
    localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(MOCK_DATA.activity));

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