import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Parcel, Customer, FraudCheckResult, CourierAccount, Settlement, AppNotification, UserSettings } from "../types";
import { exportParcelsToCSV, exportSettlementsToCSV, downloadSampleOrdersCSV } from "../utils/csv";
import { evaluatePhoneRisk } from "../utils/risk";
import {
  getSavedParcels, getSavedCustomers, getSavedFraudChecks,
  getSavedCouriers, getSavedSettlements, getSavedNotifications, getSavedSettings,
} from "./dataStorage";

export type { Parcel, Customer, FraudCheckResult, CourierAccount, Settlement, AppNotification, UserSettings };

interface DataContextType {
  parcels: Parcel[];
  customers: Customer[];
  fraudChecks: FraudCheckResult[];
  couriers: CourierAccount[];
  settlements: Settlement[];
  notifications: AppNotification[];
  settings: UserSettings;
  addParcel: (parcel: Omit<Parcel, "id" | "date">) => Parcel;
  bulkAddParcels: (parcelsData: Omit<Parcel, "id" | "date">[]) => void;
  updateParcelStatus: (id: string, status: Parcel["status"]) => void;
  checkPhoneRisk: (phone: string, name?: string) => FraudCheckResult;
  toggleWatchlist: (phone: string) => void;
  addCustomerNote: (phone: string, note: string) => void;
  toggleCourier: (name: string) => void;
  updateCourierKeys: (name: string, apiKey: string, secretKey?: string) => void;
  raiseDispute: (id: string, reason: string) => void;
  markNotificationRead: (id: number) => void;
  markAllNotificationsRead: () => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  exportParcelsCSV: (customList?: Parcel[]) => void;
  exportSettlementsCSV: () => void;
  generateSampleCSV: () => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [parcels, setParcels] = useState<Parcel[]>(getSavedParcels);
  const [customers, setCustomers] = useState<Customer[]>(getSavedCustomers);
  const [fraudChecks, setFraudChecks] = useState<FraudCheckResult[]>(getSavedFraudChecks);
  const [couriers, setCouriers] = useState<CourierAccount[]>(getSavedCouriers);
  const [settlements, setSettlements] = useState<Settlement[]>(getSavedSettlements);
  const [notifications, setNotifications] = useState<AppNotification[]>(getSavedNotifications);
  const [settings, setSettings] = useState<UserSettings>(getSavedSettings);

  useEffect(() => { localStorage.setItem("pg_parcels_v1", JSON.stringify(parcels)); }, [parcels]);
  useEffect(() => { localStorage.setItem("pg_customers_v1", JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem("pg_fraudchecks_v1", JSON.stringify(fraudChecks)); }, [fraudChecks]);
  useEffect(() => { localStorage.setItem("pg_couriers_v1", JSON.stringify(couriers)); }, [couriers]);
  useEffect(() => { localStorage.setItem("pg_settlements_v1", JSON.stringify(settlements)); }, [settlements]);
  useEffect(() => { localStorage.setItem("pg_notifs_v1", JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem("pg_settings_v1", JSON.stringify(settings)); }, [settings]);

  const addParcel = (p: Omit<Parcel, "id" | "date">): Parcel => {
    const newId = `PG-${Math.floor(1000 + Math.random() * 9000)}`;
    const newParcel: Parcel = {
      ...p,
      id: newId,
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    };
    setParcels(prev => [newParcel, ...prev]);
    return newParcel;
  };

  const bulkAddParcels = (items: Omit<Parcel, "id" | "date">[]) => {
    const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    const formatted = items.map((p, idx) => ({
      ...p,
      id: `PG-${Math.floor(1000 + idx + Math.random() * 9000)}`,
      date: today,
    }));
    setParcels(prev => [...formatted, ...prev]);
  };

  const updateParcelStatus = (id: string, status: Parcel["status"]) => {
    setParcels(prev => prev.map(p => (p.id === id ? { ...p, status } : p)));
  };

  const checkPhoneRisk = (phone: string, name?: string): FraudCheckResult => {
    const check = evaluatePhoneRisk(phone, name, customers);
    setFraudChecks(prev => [check, ...prev]);
    return check;
  };

  const toggleWatchlist = (phone: string) => {
    setCustomers(prev => prev.map(c => (c.phone === phone ? { ...c, isWatchlist: !c.isWatchlist } : c)));
  };

  const addCustomerNote = (phone: string, note: string) => {
    setCustomers(prev => prev.map(c => (c.phone === phone ? { ...c, notes: note } : c)));
  };

  const toggleCourier = (name: string) => {
    setCouriers(prev => prev.map(c => (c.name === name ? { ...c, connected: !c.connected } : c)));
  };

  const updateCourierKeys = (name: string, apiKey: string, secretKey?: string) => {
    setCouriers(prev => prev.map(c => (c.name === name ? { ...c, apiKey, secretKey, connected: true } : c)));
  };

  const raiseDispute = (id: string, reason: string) => {
    setSettlements(prev => prev.map(s => (s.id === id ? { ...s, status: "Disputed", disputeReason: reason } : s)));
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
        parcels, customers, fraudChecks, couriers, settlements, notifications, settings,
        addParcel, bulkAddParcels, updateParcelStatus, checkPhoneRisk, toggleWatchlist, addCustomerNote,
        toggleCourier, updateCourierKeys, raiseDispute, markNotificationRead, markAllNotificationsRead, updateSettings,
        exportParcelsCSV: (customList?: Parcel[]) => exportParcelsToCSV(customList ?? parcels),
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
