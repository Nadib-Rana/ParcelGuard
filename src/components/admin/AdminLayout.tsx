import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  ShieldAlert, LayoutDashboard, Building2, Activity,
  Ban, CircleDollarSign, Megaphone, ArrowLeftRight,
  Menu, X, ShieldCheck, AlertTriangle
} from "lucide-react";
import { useAdmin } from "../../context/AdminContext";

const adminNavItems = [
  { path: "/admin", icon: LayoutDashboard, label: "Platform Overview" },
  { path: "/admin/merchants", icon: Building2, label: "Merchant Directory" },
  { path: "/admin/couriers", icon: Activity, label: "Courier API Health" },
  { path: "/admin/blacklist", icon: Ban, label: "Global Fraud Database" },
  { path: "/admin/finance", icon: CircleDollarSign, label: "Revenue & Billing" },
  { path: "/admin/broadcasts", icon: Megaphone, label: "System Broadcasts" },
];

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { maintenanceMode } = useAdmin();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Super Admin Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0">
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <ShieldAlert size={18} className="text-white" />
          </div>
          <div>
            <div className="font-black text-sm tracking-wide text-white uppercase flex items-center gap-1.5">
              ParcelGuard
              <span className="text-[9px] bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.2 rounded font-mono font-bold">ADMIN</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Platform Management Console</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {adminNavItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500/20 to-red-500/20 text-amber-400 border border-amber-500/30 shadow-xs"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`
              }
            >
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Portal Switcher Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/80">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2.5 rounded-xl border border-slate-700 transition-colors"
          >
            <ArrowLeftRight size={14} className="text-indigo-400" />
            Switch to Merchant Portal
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-slate-400 p-1">
              <X size={18} />
            </button>
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center">
                <ShieldAlert size={16} className="text-white" />
              </div>
              <div>
                <div className="font-bold text-white text-sm">Super Admin</div>
                <div className="text-[10px] text-slate-400">ParcelGuard Console</div>
              </div>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {adminNavItems.map(({ path, icon: Icon, label }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === "/admin"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold ${
                      isActive ? "bg-amber-500/20 text-amber-400" : "text-slate-400"
                    }`
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>
            <div className="p-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/");
                }}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 text-slate-200 text-xs font-bold py-2 rounded-xl"
              >
                <ArrowLeftRight size={14} /> Merchant Portal
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-900/60">
        {/* Admin Top Header */}
        <header className="bg-slate-900 border-b border-slate-800 px-5 h-14 flex items-center justify-between flex-shrink-0 z-30">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-slate-400 p-1" onClick={() => setMobileOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest hidden sm:inline">SUPER ADMIN</span>
              <span className="text-xs text-slate-700 hidden sm:inline">/</span>
              <span className="text-xs font-bold text-amber-400">Console Hub</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {maintenanceMode && (
              <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-2.5 py-1 rounded-lg text-xs font-bold animate-pulse">
                <AlertTriangle size={13} /> Maintenance Mode ACTIVE
              </div>
            )}
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span className="text-xs font-bold text-slate-300">System Healthy</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-amber-500 flex items-center justify-center text-white font-black text-xs shadow-sm">
              SA
            </div>
          </div>
        </header>

        {/* View content */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
