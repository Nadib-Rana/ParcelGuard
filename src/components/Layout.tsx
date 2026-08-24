import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import {
  LayoutDashboard, Shield, Package, PackagePlus, Upload,
  MapPin, Wallet, Truck, Users, BarChart3, CreditCard,
  Bell, Settings, HelpCircle, ChevronLeft, ChevronRight,
  Search, Plus, Menu, X, ChevronDown, LogOut, User, Printer
} from "lucide-react";

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Overview" },
  { path: "/fraud-checker", icon: Shield, label: "Fraud Checker" },
  { path: "/parcels", icon: Package, label: "Parcels" },
  { path: "/book-parcel", icon: PackagePlus, label: "Book Parcel" },
  { path: "/bulk-labels", icon: Printer, label: "Bulk Labels" },
  { path: "/bulk-upload", icon: Upload, label: "Bulk Upload" },
  { path: "/tracking", icon: MapPin, label: "Tracking" },
  { path: "/payments", icon: Wallet, label: "Payments" },
  { path: "/courier-accounts", icon: Truck, label: "Courier Accounts" },
  { path: "/customers", icon: Users, label: "Customers" },
  { path: "/reports", icon: BarChart3, label: "Reports" },
];

const bottomNavItems = [
  { path: "/subscription", icon: CreditCard, label: "Subscription & Credits" },
  { path: "/notifications", icon: Bell, label: "Notifications" },
  { path: "/settings", icon: Settings, label: "Settings" },
  { path: "/help", icon: HelpCircle, label: "Help Center" },
];

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Global search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { parcels, customers, notifications, settings } = useData();

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const pageTitle =
    [...navItems, ...bottomNavItems].find(i => i.path === location.pathname)?.label ?? "Overview";

  // Search results
  const searchParcels = searchQuery.trim().length >= 2
    ? parcels.filter(
        p =>
          p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.phone.includes(searchQuery)
      ).slice(0, 4)
    : [];

  const searchCustomers = searchQuery.trim().length >= 2
    ? customers.filter(
        c =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.phone.includes(searchQuery)
      ).slice(0, 3)
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-4 border-b border-slate-100 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
          <Shield size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="font-bold text-slate-900 text-sm leading-tight">ParcelGuard</div>
            <div className="text-[10px] text-indigo-600 font-bold tracking-wide">Smart Courier Intelligence</div>
          </div>
        )}
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 shadow-xs font-bold"
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

      {/* Bottom Nav */}
      <div className="px-2.5 py-3 border-t border-slate-100 space-y-1">
        {bottomNavItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 shadow-xs font-bold"
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
                  {path === "/notifications" && unreadNotifs > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
                      {unreadNotifs}
                    </span>
                  )}
                </div>
                {!collapsed && <span>{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Collapse Toggle */}
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
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col border-r border-slate-200 bg-white transition-all duration-200 flex-shrink-0 ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-50 w-64 bg-white border-r border-slate-200 flex flex-col shadow-2xl">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1">
              <X size={18} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col overflow-hidden pb-14 lg:pb-0">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-4 lg:px-6 h-14 flex items-center gap-4 flex-shrink-0 z-30">
          <button
            className="lg:hidden text-slate-500 hover:text-slate-700 p-1"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 hidden sm:block">ParcelGuard</span>
            <span className="text-xs text-slate-300 hidden sm:block">/</span>
            <span className="text-xs font-bold text-slate-900">{pageTitle}</span>
          </div>

          <div className="flex-1" />

          {/* Global Interactive Search */}
          <div className="relative hidden md:block" ref={searchRef}>
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search parcels, phones, customers..."
              className="pl-8 pr-4 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 w-64 transition-all"
            />

            {/* Dropdown Results */}
            {searchOpen && searchQuery.trim().length >= 2 && (
              <div className="absolute right-0 top-full mt-1.5 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 space-y-2">
                {searchParcels.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase px-2 mb-1">Parcels</p>
                    {searchParcels.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          navigate(`/tracking?id=${p.id}`);
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 flex items-center justify-between text-xs transition-colors"
                      >
                        <div>
                          <span className="font-mono font-bold text-indigo-600">{p.id}</span>
                          <span className="text-slate-700 ml-2 font-medium">{p.customer}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{p.courier}</span>
                      </button>
                    ))}
                  </div>
                )}

                {searchCustomers.length > 0 && (
                  <div className="border-t border-slate-100 pt-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase px-2 mb-1">Customers</p>
                    {searchCustomers.map(c => (
                      <button
                        key={c.phone}
                        onClick={() => {
                          navigate(`/customers`);
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 flex items-center justify-between text-xs transition-colors"
                      >
                        <span className="text-slate-800 font-medium">{c.name}</span>
                        <span className="font-mono text-[10px] text-slate-500">{c.phone}</span>
                      </button>
                    ))}
                  </div>
                )}

                {searchParcels.length === 0 && searchCustomers.length === 0 && (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No results for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick CTA */}
          <NavLink
            to="/book-parcel"
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl shadow-xs transition-colors"
          >
            <Plus size={14} />
            <span className="hidden sm:block">Book Parcel</span>
          </NavLink>

          {/* Notifications */}
          <NavLink to="/notifications" className="relative text-slate-500 hover:text-slate-700 p-1.5">
            <Bell size={18} />
            {unreadNotifs > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </NavLink>

          {/* Merchant Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 pl-2 hover:bg-slate-50 rounded-xl py-1 pr-1 transition-colors"
            >
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
                <NavLink
                  to="/settings"
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <Settings size={14} /> Settings & Profile
                </NavLink>
                <NavLink
                  to="/help"
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <HelpCircle size={14} /> Help Center
                </NavLink>
                <NavLink
                  to="/admin"
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-amber-600 hover:bg-amber-50"
                  onClick={() => setUserMenuOpen(false)}
                >
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

        {/* Page View */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        {/* Mobile Fixed Bottom Navigation Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-slate-200 flex items-center justify-around z-40 px-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
                isActive ? "text-indigo-600 font-bold" : "text-slate-500"
              }`
            }
          >
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </NavLink>

          <NavLink
            to="/fraud-checker"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
                isActive ? "text-indigo-600 font-bold" : "text-slate-500"
              }`
            }
          >
            <Shield size={18} />
            <span>Fraud Check</span>
          </NavLink>

          <NavLink
            to="/book-parcel"
            className="flex flex-col items-center justify-center -mt-5 w-11 h-11 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-300"
          >
            <Plus size={20} />
          </NavLink>

          <NavLink
            to="/parcels"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
                isActive ? "text-indigo-600 font-bold" : "text-slate-500"
              }`
            }
          >
            <Package size={18} />
            <span>Parcels</span>
          </NavLink>

          <button
            onClick={() => setMobileOpen(true)}
            className="flex flex-col items-center gap-0.5 text-[10px] font-semibold text-slate-500"
          >
            <Menu size={18} />
            <span>Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
}
