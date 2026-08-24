import { useState } from "react";
import { NavLink, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { Plus, Menu, X, ChevronDown, LogOut, Settings, HelpCircle, Shield } from "lucide-react";
import SidebarNav, { mainNavItems, bottomNavItems } from "./layout/SidebarNav";
import GlobalTopSearch from "./layout/GlobalTopSearch";
import MobileBottomNav from "./layout/MobileBottomNav";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { parcels, customers, notifications, settings } = useData();

  const unreadNotifs = notifications.filter(n => !n.read).length;
  const pageTitle = [...mainNavItems, ...bottomNavItems].find(i => i.path === location.pathname)?.label ?? "Overview";

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col border-r border-slate-200 bg-white transition-all duration-200 flex-shrink-0 ${collapsed ? "w-16" : "w-60"}`}>
        <SidebarNav collapsed={collapsed} setCollapsed={setCollapsed} unreadNotifs={unreadNotifs} />
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-50 w-64 bg-white border-r border-slate-200 flex flex-col shadow-2xl">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1">
              <X size={18} />
            </button>
            <SidebarNav collapsed={false} unreadNotifs={unreadNotifs} onItemClick={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col overflow-hidden pb-14 lg:pb-0">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-4 lg:px-6 h-14 flex items-center gap-4 flex-shrink-0 z-30">
          <button className="lg:hidden text-slate-500 hover:text-slate-700 p-1" onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 hidden sm:block">ParcelGuard</span>
            <span className="text-xs text-slate-300 hidden sm:block">/</span>
            <span className="text-xs font-bold text-slate-900">{pageTitle}</span>
          </div>

          <div className="flex-1" />

          <GlobalTopSearch parcels={parcels} customers={customers} />

          <NavLink to="/book-parcel" className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl shadow-xs transition-colors">
            <Plus size={14} />
            <span className="hidden sm:block">Book Parcel</span>
          </NavLink>

          <div className="relative">
            <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 pl-2 hover:bg-slate-50 rounded-xl py-1 pr-1 transition-colors">
              <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white text-xs font-black flex items-center justify-center shadow-xs">
                {settings.merchantName.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-xs font-bold text-slate-800 hidden sm:block">{settings.merchantName}</span>
              <ChevronDown size={12} className="text-slate-400 hidden sm:block" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50">
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="text-xs font-bold text-slate-900 truncate">{settings.merchantName}</div>
                  <div className="text-[11px] text-slate-500 truncate font-mono">{settings.phone}</div>
                </div>
                <NavLink to="/settings" className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50" onClick={() => setUserMenuOpen(false)}>
                  <Settings size={14} /> Settings & Profile
                </NavLink>
                <NavLink to="/help" className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50" onClick={() => setUserMenuOpen(false)}>
                  <HelpCircle size={14} /> Help Center
                </NavLink>
                <NavLink to="/admin" className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-amber-600 hover:bg-amber-50" onClick={() => setUserMenuOpen(false)}>
                  <Shield size={14} className="text-amber-500" /> Super Admin Console
                </NavLink>
                <button
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        <MobileBottomNav onOpenMobileMenu={() => setMobileOpen(true)} />
      </div>
    </div>
  );
}
