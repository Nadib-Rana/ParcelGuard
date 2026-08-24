import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import FraudChecker from "./pages/FraudChecker";
import Parcels from "./pages/Parcels";
import BookParcel from "./pages/BookParcel";
import BulkLabels from "./pages/BulkLabels";
import BulkUpload from "./pages/BulkUpload";
import Tracking from "./pages/Tracking";
import Payments from "./pages/Payments";
import CourierAccounts from "./pages/CourierAccounts";
import Customers from "./pages/Customers";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import Subscription from "./pages/Subscription";
import Settings from "./pages/Settings";
import Help from "./pages/Help";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Authentication routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Merchant Application routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="fraud-checker" element={<FraudChecker />} />
            <Route path="parcels" element={<Parcels />} />
            <Route path="book-parcel" element={<BookParcel />} />
            <Route path="bulk-labels" element={<BulkLabels />} />
            <Route path="bulk-upload" element={<BulkUpload />} />
            <Route path="tracking" element={<Tracking />} />
            <Route path="payments" element={<Payments />} />
            <Route path="courier-accounts" element={<CourierAccounts />} />
            <Route path="customers" element={<Customers />} />
            <Route path="reports" element={<Reports />} />
            <Route path="subscription" element={<Subscription />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<Help />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
