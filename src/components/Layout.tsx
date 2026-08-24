import { useState } from "react";
import { NavLink, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Shield, Package, PackagePlus, Upload,
  MapPin, Wallet, Truck, Users, BarChart3, CreditCard,
  Bell, Settings, HelpCircle, ChevronLeft, ChevronRight,
  Search, Plus, Menu, X, ChevronDown, LogOut, User
} from "lucide-react";

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Overview" },
  { path: "/fraud-checker", icon: Shield, label: "Fraud Checker" },
  { path: "/parcels", icon: Package, label: "Parcels" },
  { path: "/book-parcel", icon: PackagePlus, label: "Book Parcel" },
  { path: "/bulk-upload", icon: Upload, label: "Bulk Upload" },
  { path: "/tracking", icon: MapPin, label: "Tracking" },
  { path: "/payments", icon: Wallet, label: "Payments" },
  { path: "/courier-accounts", icon: Truck, label: "Courier Accounts" },
  { path: "/customers", icon: Users, label: "Customers" },
  { path: "/reports", icon: BarChart3, label: "Reports" },
];

const bottomNavItems = [
  { path: "/subscription", icon: CreditCard, label: "Subscription & Credits" },
  { path: "/notifications", icon: Bell, label: "Notifications", badge: 4 },
  { path: "/settings", icon: Settings, label: "Settings" },
  { path: "/help", icon: HelpCircle, label: "Help Center" },
];

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const pageTitle = [...navItems, ...bottomNavItems].find(i => i.path === location.pathname)?.label ?? "Overview";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-100 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
          <Shield size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="font-bold text-slate-900 text-sm leading-tight">ParcelGuard</div>
            <div className="text-[10px] text-slate-400 font-medium tracking-wide">Smart Courier Intelligence</div>
          </div>
        )}
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              } ${collapsed ? "justify-center" : ""}`
            }
            onClick={() => setMobileOpen(false)}
            title={collapsed ? label : undefined}
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? "text-indigo-600" : "text-slate-400"} />
                {!collapsed && <span>{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="px-2 py-3 border-t border-slate-100 space-y-0.5">
        {bottomNavItems.map(({ path, icon: Icon, label, badge }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              } ${collapsed ? "justify-center" : ""}`
            }
            onClick={() => setMobileOpen(false)}
            title={collapsed ? label : undefined}
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon size={16} className={isActive ? "text-indigo-600" : "text-slate-400"} />
                  {badge && (
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
                      {badge}
                    </span>
                  )}
                </div>
                {!collapsed && <span>{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Collapse toggle (desktop) */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex items-center justify-center w-full py-3 border-t border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col border-r border-slate-200 bg-white transition-all duration-300 flex-shrink-0 ${
          collapsed ? "w-14" : "w-56"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-50 w-64 bg-white border-r border-slate-200 flex flex-col">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-slate-400">
              <X size={16} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 lg:px-6 h-14 flex items-center gap-4 flex-shrink-0">
          <button
            className="lg:hidden text-slate-500 hover:text-slate-700"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={18} />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400 hidden sm:block">ParcelGuard</span>
            <span className="text-sm text-slate-300 hidden sm:block">/</span>
            <span className="text-sm font-semibold text-slate-900">{pageTitle}</span>
          </div>

          <div className="flex-1" />

          {/* Search */}
          <div className="relative hidden md:block">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search parcels, customers..."
              className="pl-8 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 w-56"
            />
          </div>

          {/* Book Parcel CTA */}
          <NavLink
            to="/book-parcel"
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus size={14} />
            <span className="hidden sm:block">Book Parcel</span>
          </NavLink>

          {/* Notification bell */}
          <NavLink to="/notifications" className="relative text-slate-500 hover:text-slate-700 p-1">
            <Bell size={18} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
          </NavLink>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 pl-2 hover:bg-slate-50 rounded-lg py-1 pr-1 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                MR
              </div>
              <span className="text-sm font-medium text-slate-700 hidden sm:block">Merchant</span>
              <ChevronDown size={12} className="text-slate-400 hidden sm:block" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="text-xs font-semibold text-slate-900">Rahman Store</div>
                  <div className="text-xs text-slate-500">rahman@store.bd</div>
                </div>
                <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  <User size={14} /> Profile
                </button>
                <NavLink to="/settings" className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setUserMenuOpen(false)}>
                  <Settings size={14} /> Settings
                </NavLink>
                <button
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  onClick={() => { logout(); navigate("/login"); }}
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
