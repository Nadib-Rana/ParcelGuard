import type { Parcel, Customer, FraudCheckResult, CourierAccount, Settlement, AppNotification, UserSettings } from "../types";
import { initialParcels, initialCustomers, initialFraudChecks, initialCouriers, initialSettlements, initialNotifications, initialSettings } from "../data/mockData";

export const getSavedParcels = (): Parcel[] => {
  const saved = localStorage.getItem("pg_parcels_v1");
  return saved ? JSON.parse(saved) : initialParcels;
};

export const getSavedCustomers = (): Customer[] => {
  const saved = localStorage.getItem("pg_customers_v1");
  return saved ? JSON.parse(saved) : initialCustomers;
};

export const getSavedFraudChecks = (): FraudCheckResult[] => {
  const saved = localStorage.getItem("pg_fraudchecks_v1");
  return saved ? JSON.parse(saved) : initialFraudChecks;
};

export const getSavedCouriers = (): CourierAccount[] => {
  const saved = localStorage.getItem("pg_couriers_v1");
  return saved ? JSON.parse(saved) : initialCouriers;
};

export const getSavedSettlements = (): Settlement[] => {
  const saved = localStorage.getItem("pg_settlements_v1");
  return saved ? JSON.parse(saved) : initialSettlements;
};

export const getSavedNotifications = (): AppNotification[] => {
  const saved = localStorage.getItem("pg_notifs_v1");
  return saved ? JSON.parse(saved) : initialNotifications;
};

export const getSavedSettings = (): UserSettings => {
  const saved = localStorage.getItem("pg_settings_v1");
  return saved ? JSON.parse(saved) : initialSettings;
};
