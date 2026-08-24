import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface Parcel {
  id: string;
  customer: string;
  phone: string;
  address: string;
  district: string;
  area?: string;
  product: string;
  category?: string;
  weight?: string;
  courier: "Steadfast" | "Pathao" | "RedX" | "Paperfly";
  cod: number;
  charge: number;
  advance: number;
  risk: "Safe" | "Moderate" | "High Risk";
  status: "Pending Pickup" | "In Transit" | "Out for Delivery" | "Delivered" | "Returned" | "Cancelled";
  date: string;
  createdAt: string;
  notes?: string;
  agentName?: string;
  agentPhone?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  orders: number;
  delivered: number;
  returned: number;
  rate: string;
  risk: "Safe" | "Moderate" | "High Risk";
  last: string;
  isWatchlist: boolean;
  notes?: string;
}

export interface FraudCheckResult {
  phone: string;
  name: string;
  risk: "Safe" | "Moderate" | "High Risk";
  score: number;
  date: string;
  totalOrders: number;
  delivered: number;
  returned: number;
  cancelled: number;
  successRate: string;
  factors: string[];
  recommendation: string;
}

export interface CourierAccount {
  name: string;
  logo: string;
  color: string;
  connected: boolean;
  balance: number;
  sync: string;
  apiKey?: string;
  secretKey?: string;
  merchantId?: string;
  webhookEnabled?: boolean;
}

export interface Settlement {
  id: string;
  courier: string;
  period: string;
  expected: number;
  received: number;
  diff: number;
  status: "Paid" | "Pending" | "Partial" | "Disputed";
  parcelsCount: number;
  disputeReason?: string;
}

export interface AppNotification {
  id: number;
  type: "risk" | "payment" | "parcel" | "system";
  title: string;
  body: string;
  time: string;
  read: boolean;
  category: "Parcels" | "Payments" | "Risk Alerts" | "System";
}

export interface UserSettings {
  merchantName: string;
  phone: string;
  email: string;
  businessType: string;
  businessAddress: string;
  apiKey: string;
  webhookUrl: string;
  notifications: {
    parcelUpdates: boolean;
    paymentUpdates: boolean;
    highRiskAlerts: boolean;
    smsNotifications: boolean;
    emailNotifications: boolean;
  };
}

interface DataContextType {
  parcels: Parcel[];
  customers: Customer[];
  fraudChecks: FraudCheckResult[];
  courierAccounts: CourierAccount[];
  settlements: Settlement[];
  notifications: AppNotification[];
  settings: UserSettings;
  addParcel: (parcelData: Omit<Parcel, "id" | "date" | "createdAt">) => Parcel;
  updateParcelStatus: (id: string, status: Parcel["status"]) => void;
  bulkAddParcels: (parcelsData: Array<Omit<Parcel, "id" | "date" | "createdAt">>) => number;
  checkPhoneRisk: (phone: string, name?: string) => FraudCheckResult;
  toggleWatchlist: (phone: string) => void;
  addCustomerNote: (phone: string, note: string) => void;
  connectCourier: (name: string, apiKey: string, secretKey: string, merchantId: string, webhook: boolean) => void;
  syncCourier: (name: string) => Promise<void>;
  raiseDispute: (settlementId: string, reason: string, customAmount?: number) => void;
  markNotificationRead: (id: number) => void;
  markAllNotificationsRead: () => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  exportParcelsCSV: (items?: Parcel[]) => void;
  generateSampleCSV: () => void;
}

const initialParcels: Parcel[] = [
  { id: "PG-102845", customer: "Rahim Uddin", phone: "01711-234567", address: "Road 5, Mirpur-10", district: "Dhaka", area: "Mirpur-10", product: "Cotton Shirt", category: "Fashion", courier: "Steadfast", cod: 1250, charge: 110, advance: 0, risk: "Safe", status: "Delivered", date: "24 Aug 2026", createdAt: "2026-08-24T10:30:00Z", agentName: "Md. Hasan Ali", agentPhone: "01700-000000" },
  { id: "PG-102846", customer: "Karim Hasan", phone: "01812-345678", address: "Block C, Khilgaon", district: "Dhaka", area: "Khilgaon", product: "Wireless Earbuds", category: "Electronics", courier: "Pathao", cod: 2500, charge: 120, advance: 0, risk: "High Risk", status: "Returned", date: "24 Aug 2026", createdAt: "2026-08-24T09:15:00Z", notes: "Customer refused delivery" },
  { id: "PG-102847", customer: "Nasrin Akter", phone: "01913-456789", address: "Zindabazar, Sylhet Sadar", district: "Sylhet", area: "Sylhet Sadar", product: "Silk Saree", category: "Fashion", courier: "RedX", cod: 850, charge: 130, advance: 200, risk: "Safe", status: "In Transit", date: "23 Aug 2026", createdAt: "2026-08-23T14:20:00Z" },
  { id: "PG-102848", customer: "Farhan Hossain", phone: "01614-567890", address: "Station Road, Bogura", district: "Bogura", area: "Bogura Sadar", product: "Leather Wallet", category: "Accessories", courier: "Steadfast", cod: 3200, charge: 110, advance: 0, risk: "Moderate", status: "Pending Pickup", date: "23 Aug 2026", createdAt: "2026-08-23T16:45:00Z" },
  { id: "PG-102849", customer: "Sadia Islam", phone: "01515-678901", address: "GEC Circle, Chattogram", district: "Chattogram", area: "GEC", product: "Skincare Set", category: "Beauty", courier: "Pathao", cod: 1800, charge: 120, advance: 0, risk: "Safe", status: "Out for Delivery", date: "22 Aug 2026", createdAt: "2026-08-22T11:00:00Z", agentName: "Tanvir Rahman", agentPhone: "01800-111222" },
  { id: "PG-102850", customer: "Jahangir Alam", phone: "01716-789012", address: "Rajshahi University Area", district: "Rajshahi", area: "Motihar", product: "Smart Watch", category: "Electronics", courier: "RedX", cod: 4500, charge: 130, advance: 0, risk: "High Risk", status: "Returned", date: "22 Aug 2026", createdAt: "2026-08-22T08:30:00Z" },
  { id: "PG-102851", customer: "Tania Begum", phone: "01817-890123", address: "Uttara Sector 7, Dhaka", district: "Dhaka", area: "Uttara", product: "Handbag", category: "Fashion", courier: "Steadfast", cod: 960, charge: 110, advance: 0, risk: "Safe", status: "Delivered", date: "21 Aug 2026", createdAt: "2026-08-21T13:10:00Z" },
  { id: "PG-102852", customer: "Mostak Ahmed", phone: "01918-901234", address: "Shaheb Bazar, Rajshahi", district: "Rajshahi", area: "Boalia", product: "Denim Jeans", category: "Fashion", courier: "Pathao", cod: 2100, charge: 120, advance: 0, risk: "Moderate", status: "Cancelled", date: "21 Aug 2026", createdAt: "2026-08-21T15:00:00Z" },
];

const initialCustomers: Customer[] = [
  { id: "CUST-1", name: "Rahim Uddin", phone: "01711-234567", orders: 24, delivered: 22, returned: 2, rate: "91.7%", risk: "Safe", last: "24 Aug 2026", isWatchlist: false, notes: "Reliable customer, prompt recipient." },
  { id: "CUST-2", name: "Karim Hasan", phone: "01812-345678", orders: 24, delivered: 9, returned: 12, rate: "37.5%", risk: "High Risk", last: "24 Aug 2026", isWatchlist: true, notes: "Frequently cancels after parcel arrives at hub. Always ask for advance delivery fee." },
  { id: "CUST-3", name: "Nasrin Akter", phone: "01913-456789", orders: 11, delivered: 10, returned: 1, rate: "90.9%", risk: "Safe", last: "23 Aug 2026", isWatchlist: false },
  { id: "CUST-4", name: "Farhan Hossain", phone: "01614-567890", orders: 8, delivered: 5, returned: 2, rate: "62.5%", risk: "Moderate", last: "23 Aug 2026", isWatchlist: false, notes: "Slow to answer calls, delivery takes 2 attempts." },
  { id: "CUST-5", name: "Sadia Islam", phone: "01515-678901", orders: 15, delivered: 14, returned: 1, rate: "93.3%", risk: "Safe", last: "22 Aug 2026", isWatchlist: false },
  { id: "CUST-6", name: "Jahangir Alam", phone: "01716-789012", orders: 18, delivered: 6, returned: 10, rate: "33.3%", risk: "High Risk", last: "22 Aug 2026", isWatchlist: true, notes: "Multiple fake order reports across multiple FB pages." },
];

const initialFraudChecks: FraudCheckResult[] = [
  { phone: "01711-234567", name: "Rahim Uddin", risk: "Safe", score: 12, date: "2 hours ago", totalOrders: 24, delivered: 22, returned: 2, cancelled: 0, successRate: "91.7%", factors: ["Consistent delivery address", "Verified mobile subscriber"], recommendation: "Safe to ship with standard Cash on Delivery." },
  { phone: "01812-345678", name: "Karim Hasan", risk: "High Risk", score: 82, date: "5 hours ago", totalOrders: 24, delivered: 9, returned: 12, cancelled: 3, successRate: "37.5%", factors: ["Frequent parcel refusal", "Multiple orders across multiple shops", "High return ratio (50%+)"], recommendation: "Request full advance delivery charge (৳150) before dispatch." },
  { phone: "01913-456789", name: "Nasrin Akter", risk: "Moderate", score: 48, date: "Yesterday", totalOrders: 11, delivered: 7, returned: 3, cancelled: 1, successRate: "63.6%", factors: ["Occasional delivery delays", "Different delivery districts reported"], recommendation: "Call customer to re-confirm order before booking." },
  { phone: "01614-567890", name: "Farhan Hossain", risk: "Safe", score: 8, date: "Yesterday", totalOrders: 8, delivered: 7, returned: 1, cancelled: 0, successRate: "87.5%", factors: ["Low cancellation history"], recommendation: "Safe to proceed with normal shipping." },
];

const initialCouriers: CourierAccount[] = [
  { name: "Steadfast Courier", logo: "SC", color: "bg-emerald-600", connected: true, balance: 12500, sync: "2 minutes ago", apiKey: "sf_live_a89bc34e09f8", webhookEnabled: true },
  { name: "Pathao Courier", logo: "PC", color: "bg-indigo-600", connected: true, balance: 8320, sync: "5 minutes ago", apiKey: "pt_live_99d12fae43", webhookEnabled: true },
  { name: "RedX", logo: "RX", color: "bg-red-600", connected: false, balance: 0, sync: "—" },
  { name: "Paperfly", logo: "PF", color: "bg-amber-600", connected: false, balance: 0, sync: "—" },
];

const initialSettlements: Settlement[] = [
  { id: "STL-2408-001", courier: "Steadfast", period: "Aug 1–15", expected: 78500, received: 78500, diff: 0, status: "Paid", parcelsCount: 62 },
  { id: "STL-2408-002", courier: "Pathao", period: "Aug 1–15", expected: 45200, received: 42700, diff: -2500, status: "Disputed", parcelsCount: 34, disputeReason: "COD deduction of ৳2,500 on 2 delivered parcels marked incorrectly as returned." },
  { id: "STL-2408-003", courier: "RedX", period: "Aug 1–15", expected: 32000, received: 28400, diff: -3600, status: "Partial", parcelsCount: 22 },
  { id: "STL-2408-004", courier: "Steadfast", period: "Aug 16–24", expected: 64000, received: 0, diff: 0, status: "Pending", parcelsCount: 48 },
  { id: "STL-2408-005", courier: "Pathao", period: "Aug 16–24", expected: 38500, received: 0, diff: 0, status: "Pending", parcelsCount: 29 },
];

const initialNotifications: AppNotification[] = [
  { id: 1, type: "risk", category: "Risk Alerts", title: "High-risk customer detected", body: "Order PG-102846 customer Karim Hasan has a 37.5% delivery success rate.", time: "2 hours ago", read: false },
  { id: 2, type: "payment", category: "Payments", title: "COD payment received", body: "৳12,500 has been added to your settlement from Steadfast.", time: "4 hours ago", read: false },
  { id: 3, type: "parcel", category: "Parcels", title: "Parcel delayed", body: "Tracking ID PG-102847 has been in transit for over 36 hours.", time: "6 hours ago", read: false },
  { id: 4, type: "risk", category: "Risk Alerts", title: "Watchlist customer ordered", body: "Customer Karim Hasan placed a new order via Facebook Messenger.", time: "8 hours ago", read: true },
  { id: 5, type: "payment", category: "Payments", title: "Settlement processed", body: "Steadfast settlement STL-2408-001 of ৳78,500 has been confirmed.", time: "Yesterday", read: true },
  { id: 6, type: "system", category: "System", title: "System maintenance scheduled", body: "ParcelGuard will undergo routine maintenance on Sep 1, 02:00–04:00 AM BDT.", time: "2 days ago", read: true },
];

const initialSettings: UserSettings = {
  merchantName: "Rahman Fashion House",
  phone: "+880 1711-234567",
  email: "rahman@store.bd",
  businessType: "F-Commerce (Facebook)",
  businessAddress: "House 12, Road 4, Sector 3, Uttara, Dhaka",
  apiKey: "pg_live_89f02bca481e39a03cd711e9a22f",
  webhookUrl: "https://rahmanstore.com/api/webhooks/parcelguard",
  notifications: {
    parcelUpdates: true,
    paymentUpdates: true,
    highRiskAlerts: true,
    smsNotifications: false,
    emailNotifications: true,
  },
};

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [parcels, setParcels] = useState<Parcel[]>(() => {
    const saved = localStorage.getItem("pg_parcels_v1");
    return saved ? JSON.parse(saved) : initialParcels;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem("pg_customers_v1");
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [fraudChecks, setFraudChecks] = useState<FraudCheckResult[]>(() => {
    const saved = localStorage.getItem("pg_fraudchecks_v1");
    return saved ? JSON.parse(saved) : initialFraudChecks;
  });

  const [courierAccounts, setCourierAccounts] = useState<CourierAccount[]>(() => {
    const saved = localStorage.getItem("pg_couriers_v1");
    return saved ? JSON.parse(saved) : initialCouriers;
  });

  const [settlements, setSettlements] = useState<Settlement[]>(() => {
    const saved = localStorage.getItem("pg_settlements_v1");
    return saved ? JSON.parse(saved) : initialSettlements;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem("pg_notifs_v1");
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem("pg_settings_v1");
    return saved ? JSON.parse(saved) : initialSettings;
  });

  // Sync to localStorage
  useEffect(() => { localStorage.setItem("pg_parcels_v1", JSON.stringify(parcels)); }, [parcels]);
  useEffect(() => { localStorage.setItem("pg_customers_v1", JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem("pg_fraudchecks_v1", JSON.stringify(fraudChecks)); }, [fraudChecks]);
  useEffect(() => { localStorage.setItem("pg_couriers_v1", JSON.stringify(courierAccounts)); }, [courierAccounts]);
  useEffect(() => { localStorage.setItem("pg_settlements_v1", JSON.stringify(settlements)); }, [settlements]);
  useEffect(() => { localStorage.setItem("pg_notifs_v1", JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem("pg_settings_v1", JSON.stringify(settings)); }, [settings]);

  const addParcel = (parcelData: Omit<Parcel, "id" | "date" | "createdAt">): Parcel => {
    const nextNum = parcels.length + 102845;
    const newId = `PG-${nextNum}`;
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

    const newParcel: Parcel = {
      ...parcelData,
      id: newId,
      date: dateStr,
      createdAt: now.toISOString(),
    };

    setParcels(prev => [newParcel, ...prev]);

    // Update or add customer record
    setCustomers(prev => {
      const idx = prev.findIndex(c => c.phone.replace(/\D/g, "") === parcelData.phone.replace(/\D/g, ""));
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          orders: updated[idx].orders + 1,
          last: dateStr,
        };
        return updated;
      } else {
        const newCust: Customer = {
          id: `CUST-${prev.length + 1}`,
          name: parcelData.customer,
          phone: parcelData.phone,
          orders: 1,
          delivered: 0,
          returned: 0,
          rate: "100%",
          risk: parcelData.risk,
          last: dateStr,
          isWatchlist: parcelData.risk === "High Risk",
        };
        return [newCust, ...prev];
      }
    });

    // Add notification
    const newNotif: AppNotification = {
      id: Date.now(),
      type: "parcel",
      category: "Parcels",
      title: "New parcel booked",
      body: `Parcel ${newId} for ${parcelData.customer} booked with ${parcelData.courier}.`,
      time: "Just now",
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newParcel;
  };

  const updateParcelStatus = (id: string, status: Parcel["status"]) => {
    setParcels(prev => prev.map(p => (p.id === id ? { ...p, status } : p)));
  };

  const bulkAddParcels = (parcelsData: Array<Omit<Parcel, "id" | "date" | "createdAt">>): number => {
    let baseNum = parcels.length + 102845;
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

    const newItems: Parcel[] = parcelsData.map((d, i) => ({
      ...d,
      id: `PG-${baseNum + i}`,
      date: dateStr,
      createdAt: now.toISOString(),
    }));

    setParcels(prev => [...newItems, ...prev]);

    const notif: AppNotification = {
      id: Date.now(),
      type: "parcel",
      category: "Parcels",
      title: "Bulk upload booked",
      body: `Successfully booked ${newItems.length} parcels across couriers.`,
      time: "Just now",
      read: false,
    };
    setNotifications(prev => [notif, ...prev]);

    return newItems.length;
  };

  const checkPhoneRisk = (inputPhone: string, name?: string): FraudCheckResult => {
    const cleanPhone = inputPhone.trim();
    const existing = customers.find(c => c.phone.replace(/\D/g, "") === cleanPhone.replace(/\D/g, ""));

    let result: FraudCheckResult;

    if (existing) {
      let score = 15;
      const parsedRate = parseFloat(existing.rate) || 50;
      if (parsedRate < 40) score = 84;
      else if (parsedRate < 70) score = 52;
      else score = 12;

      result = {
        phone: existing.phone,
        name: existing.name,
        risk: existing.risk,
        score,
        date: "Just now",
        totalOrders: existing.orders,
        delivered: existing.delivered,
        returned: existing.returned,
        cancelled: Math.max(0, existing.orders - existing.delivered - existing.returned),
        successRate: existing.rate,
        factors:
          score > 70
            ? ["Frequent parcel refusal", "High return ratio (>50%)", "Multiple delivery address changes"]
            : score > 40
            ? ["Moderate order history", "1-2 returned parcels in last 3 months"]
            : ["Reliable delivery history", "Verified recipient phone"],
        recommendation:
          score > 70
            ? "Request advance delivery payment (৳150-200) before dispatch."
            : score > 40
            ? "Re-confirm parcel address via phone call before dispatch."
            : "Safe for standard Cash on Delivery shipping.",
      };
    } else {
      // Dynamic computation for unknown number based on pattern
      const digits = cleanPhone.replace(/\D/g, "");
      const isRiskyPattern = digits.endsWith("78") || digits.endsWith("12") || digits.endsWith("00");
      const isModeratePattern = digits.endsWith("55") || digits.endsWith("33");

      if (isRiskyPattern) {
        result = {
          phone: cleanPhone,
          name: name || "Customer",
          risk: "High Risk",
          score: 79,
          date: "Just now",
          totalOrders: 16,
          delivered: 5,
          returned: 9,
          cancelled: 2,
          successRate: "31.2%",
          factors: ["Known refusal history in merchant database", "Unresponsive to delivery agent calls"],
          recommendation: "Collect advance shipping fee before booking parcel.",
        };
      } else if (isModeratePattern) {
        result = {
          phone: cleanPhone,
          name: name || "Customer",
          risk: "Moderate",
          score: 46,
          date: "Just now",
          totalOrders: 6,
          delivered: 4,
          returned: 2,
          cancelled: 0,
          successRate: "66.7%",
          factors: ["New customer with limited history", "Inter-district delivery"],
          recommendation: "Confirm delivery address before shipping.",
        };
      } else {
        result = {
          phone: cleanPhone,
          name: name || "Customer",
          risk: "Safe",
          score: 14,
          date: "Just now",
          totalOrders: 8,
          delivered: 7,
          returned: 1,
          cancelled: 0,
          successRate: "87.5%",
          factors: ["Clean delivery track record", "Active mobile number"],
          recommendation: "Safe to ship with Cash on Delivery.",
        };
      }
    }

    setFraudChecks(prev => [result, ...prev.filter(f => f.phone.replace(/\D/g, "") !== cleanPhone.replace(/\D/g, "")).slice(0, 8)]);
    return result;
  };

  const toggleWatchlist = (phone: string) => {
    const clean = phone.replace(/\D/g, "");
    setCustomers(prev =>
      prev.map(c => {
        if (c.phone.replace(/\D/g, "") === clean) {
          const next = !c.isWatchlist;
          return { ...c, isWatchlist: next };
        }
        return c;
      })
    );
  };

  const addCustomerNote = (phone: string, note: string) => {
    const clean = phone.replace(/\D/g, "");
    setCustomers(prev =>
      prev.map(c => (c.phone.replace(/\D/g, "") === clean ? { ...c, notes: note } : c))
    );
  };

  const connectCourier = (name: string, apiKey: string, secretKey: string, merchantId: string, webhook: boolean) => {
    setCourierAccounts(prev =>
      prev.map(c => {
        if (c.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(c.name.toLowerCase())) {
          return {
            ...c,
            connected: true,
            apiKey,
            secretKey,
            merchantId,
            webhookEnabled: webhook,
            balance: c.balance > 0 ? c.balance : 5000,
            sync: "Just now",
          };
        }
        return c;
      })
    );
  };

  const syncCourier = async (name: string) => {
    await new Promise(r => setTimeout(r, 1200));
    setCourierAccounts(prev =>
      prev.map(c => {
        if (c.name === name) {
          return {
            ...c,
            sync: "Just now",
            balance: c.balance + Math.floor(Math.random() * 2000),
          };
        }
        return c;
      })
    );
  };

  const raiseDispute = (settlementId: string, reason: string, customAmount?: number) => {
    setSettlements(prev =>
      prev.map(s => {
        if (s.id === settlementId) {
          return {
            ...s,
            status: "Disputed",
            disputeReason: reason,
            diff: customAmount ? -Math.abs(customAmount) : s.diff !== 0 ? s.diff : -2500,
          };
        }
        return s;
      })
    );

    const notif: AppNotification = {
      id: Date.now(),
      type: "payment",
      category: "Payments",
      title: `Dispute opened for ${settlementId}`,
      body: `Dispute logged with courier for ${settlementId}. Support ticket #DS-${Math.floor(Math.random() * 9000 + 1000)} created.`,
      time: "Just now",
      read: false,
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const markNotificationRead = (id: number) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const exportParcelsCSV = (items?: Parcel[]) => {
    const list = items || parcels;
    const headers = ["Tracking ID", "Customer Name", "Phone", "Full Address", "District", "Product", "Courier", "COD (BDT)", "Charge (BDT)", "Risk", "Status", "Date"];
    const rows = list.map(p => [
      p.id,
      `"${p.customer.replace(/"/g, '""')}"`,
      p.phone,
      `"${p.address.replace(/"/g, '""')}"`,
      p.district,
      `"${p.product.replace(/"/g, '""')}"`,
      p.courier,
      p.cod,
      p.charge,
      p.risk,
      p.status,
      p.date,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `parcelguard_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateSampleCSV = () => {
    const sampleHeaders = ["Customer Name", "Phone Number", "Full Address", "District", "COD Amount", "Product Name", "Weight", "Courier Preference", "Special Notes"];
    const sampleRows = [
      ["Rahim Uddin", "01711234567", "House 14, Road 5, Mirpur-10", "Dhaka", "1250", "Cotton Shirt", "500g", "Steadfast", "Call before delivery"],
      ["Nasrin Akter", "01913456789", "Zindabazar Point", "Sylhet", "850", "Silk Scarf", "250g", "RedX", "Deliver during business hours"],
      ["Farhan Hossain", "01614567890", "Station Road, Bogura Sadar", "Bogura", "3200", "Leather Shoes", "1kg", "Pathao", "Fragile item handle with care"],
      ["Sadia Islam", "01515678901", "GEC Circle, Nasirabad", "Chattogram", "1800", "Skincare Box", "500g", "Steadfast", "Call recipient"],
    ];

    const csvContent = "data:text/csv;charset=utf-8," + [sampleHeaders.join(","), ...sampleRows.map(r => r.map(x => `"${x}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "parcelguard_sample_orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DataContext.Provider
      value={{
        parcels,
        customers,
        fraudChecks,
        courierAccounts,
        settlements,
        notifications,
        settings,
        addParcel,
        updateParcelStatus,
        bulkAddParcels,
        checkPhoneRisk,
        toggleWatchlist,
        addCustomerNote,
        connectCourier,
        syncCourier,
        raiseDispute,
        markNotificationRead,
        markAllNotificationsRead,
        updateSettings,
        exportParcelsCSV,
        generateSampleCSV,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
