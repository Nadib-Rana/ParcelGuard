import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Parcel, Customer, FraudCheckResult, CourierAccount, Settlement, AppNotification, UserSettings } from "../types";
import { initialParcels, initialCustomers, initialFraudChecks, initialCouriers, initialSettlements, initialNotifications, initialSettings } from "../data/mockData";
import { exportParcelsToCSV, exportSettlementsToCSV, downloadSampleOrdersCSV } from "../utils/csv";
import { evaluatePhoneRisk } from "../utils/risk";

export * from "../types";

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
  exportSettlementsCSV: () => void;
  generateSampleCSV: () => void;
}

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

  // Sync state to localStorage
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

    // Update customer history
    setCustomers(prev => {
      const idx = prev.findIndex(c => c.phone.replace(/\D/g, "") === parcelData.phone.replace(/\D/g, ""));
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], orders: updated[idx].orders + 1, last: dateStr };
        return updated;
      }
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
    });

    // Send notification
    setNotifications(prev => [
      {
        id: Date.now(),
        type: "parcel",
        category: "Parcels",
        title: "New parcel booked",
        body: `Parcel ${newId} for ${parcelData.customer} booked with ${parcelData.courier}.`,
        time: "Just now",
        read: false,
      },
      ...prev,
    ]);

    return newParcel;
  };

  const updateParcelStatus = (id: string, status: Parcel["status"]) => {
    setParcels(prev => prev.map(p => (p.id === id ? { ...p, status } : p)));
  };

  const bulkAddParcels = (parcelsData: Array<Omit<Parcel, "id" | "date" | "createdAt">>): number => {
    const baseNum = parcels.length + 102845;
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

    const newItems: Parcel[] = parcelsData.map((d, i) => ({
      ...d,
      id: `PG-${baseNum + i}`,
      date: dateStr,
      createdAt: now.toISOString(),
    }));

    setParcels(prev => [...newItems, ...prev]);

    setNotifications(prev => [
      {
        id: Date.now(),
        type: "parcel",
        category: "Parcels",
        title: "Bulk upload booked",
        body: `Successfully booked ${newItems.length} parcels across couriers.`,
        time: "Just now",
        read: false,
      },
      ...prev,
    ]);

    return newItems.length;
  };

  const checkPhoneRisk = (inputPhone: string, name?: string): FraudCheckResult => {
    const result = evaluatePhoneRisk(inputPhone, name, customers);
    setFraudChecks(prev => [result, ...prev.filter(f => f.phone.replace(/\D/g, "") !== inputPhone.replace(/\D/g, "")).slice(0, 8)]);
    return result;
  };

  const toggleWatchlist = (phone: string) => {
    const clean = phone.replace(/\D/g, "");
    setCustomers(prev =>
      prev.map(c => (c.phone.replace(/\D/g, "") === clean ? { ...c, isWatchlist: !c.isWatchlist } : c))
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
    await new Promise(r => setTimeout(r, 1000));
    setCourierAccounts(prev =>
      prev.map(c => (c.name === name ? { ...c, sync: "Just now", balance: c.balance + Math.floor(Math.random() * 2000) } : c))
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

    setNotifications(prev => [
      {
        id: Date.now(),
        type: "payment",
        category: "Payments",
        title: `Dispute opened for ${settlementId}`,
        body: `Dispute logged with courier for ${settlementId}.`,
        time: "Just now",
        read: false,
      },
      ...prev,
    ]);
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
        exportParcelsCSV: (items) => exportParcelsToCSV(items || parcels),
        exportSettlementsCSV: () => exportSettlementsToCSV(settlements),
        generateSampleCSV: downloadSampleOrdersCSV,
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
