import { useState } from "react";
import { Package, TrendingUp, AlertTriangle, Wallet, Eye, MapPin, Download, Import, Plus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useNavigate, NavLink } from "react-router-dom";
import { useData } from "../context/DataContext";
import { Card, StatCard, RiskBadge, StatusBadge, Button, Badge } from "../components/ui";

const chartData = [
  { day: "Mon", created: 42, transit: 35, delivered: 28, returned: 5 },
  { day: "Tue", created: 58, transit: 48, delivered: 41, returned: 7 },
  { day: "Wed", created: 51, transit: 44, delivered: 38, returned: 4 },
  { day: "Thu", created: 67, transit: 55, delivered: 49, returned: 8 },
  { day: "Fri", created: 73, transit: 60, delivered: 52, returned: 6 },
  { day: "Sat", created: 89, transit: 74, delivered: 67, returned: 9 },
  { day: "Sun", created: 64, transit: 53, delivered: 46, returned: 5 },
];

export default function Dashboard() {
  const { parcels, settlements, exportParcelsCSV, settings } = useData();
  const navigate = useNavigate();
  const [tab, setTab] = useState("7 Days");
  const tabs = ["7 Days", "30 Days", "3 Months"];

  const totalParcelsCount = 1248 + parcels.length - 8;
  const deliveredCount = parcels.filter(p => p.status === "Delivered").length;
  const returnedCount = parcels.filter(p => p.status === "Returned").length;
  const deliveredPct = ((deliveredCount / Math.max(1, parcels.length)) * 100).toFixed(1);

  const pendingCod = settlements.filter(s => s.status === "Pending").reduce((acc, s) => acc + s.expected, 245600);

  const statuses = [
    { label: "Delivered", count: 982 + (deliveredCount - 2), color: "bg-emerald-500" },
    { label: "In Transit", count: 124 + parcels.filter(p => p.status === "In Transit").length - 1, color: "bg-blue-500" },
    { label: "Out for Delivery", count: 38 + parcels.filter(p => p.status === "Out for Delivery").length - 1, color: "bg-indigo-500" },
    { label: "Pending Pickup", count: 18 + parcels.filter(p => p.status === "Pending Pickup").length - 1, color: "bg-amber-500" },
    { label: "Returned", count: 68 + (returnedCount - 2), color: "bg-red-500" },
    { label: "Cancelled", count: 18, color: "bg-slate-300" },
  ];

  const totalStatusCount = statuses.reduce((acc, s) => acc + s.count, 0);

  return (
    <div className="p-6 space-y-6 max-w-screen-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Good morning, {settings.merchantName} 👋</h1>
          <p className="text-sm text-slate-500 mt-0.5">Here's what's happening with your parcels today across all couriers.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => navigate("/bulk-upload")}>
            <Import size={13} /> Import CSV Orders
          </Button>
          <NavLink to="/book-parcel">
            <Button size="sm">
              <Plus size={13} /> Book Parcel
            </Button>
          </NavLink>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={<Package size={18} />}
          label="Total Parcels"
          value={totalParcelsCount.toLocaleString()}
          trend="↑ 14.2% vs last month"
        />
        <StatCard
          icon={<TrendingUp size={18} />}
          label="Delivered Successfully"
          value={`${(982 + deliveredCount - 2).toLocaleString()}`}
          sub={`${deliveredPct}% delivery success rate`}
          subColor="text-emerald-600 font-semibold"
        />
        <StatCard
          icon={<AlertTriangle size={18} />}
          label="At Risk / Returned"
          value={`${86 + returnedCount - 2}`}
          sub="Potential loss: ৳18,450"
          subColor="text-red-500 font-semibold"
        />
        <StatCard
          icon={<Wallet size={18} />}
          label="Pending COD Settlements"
          value={`৳${pendingCod.toLocaleString()}`}
          sub="Expected payout this week"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Line chart */}
        <Card className="xl:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Parcel Delivery Performance</h2>
              <p className="text-xs text-slate-500 mt-0.5">Live shipping volume and delivery conversion trends</p>
            </div>
            <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg">
              {tabs.map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="created" stroke="#6366f1" strokeWidth={2} dot={false} name="Created" />
              <Line type="monotone" dataKey="transit" stroke="#3b82f6" strokeWidth={2} dot={false} name="In Transit" />
              <Line type="monotone" dataKey="delivered" stroke="#10b981" strokeWidth={2} dot={false} name="Delivered" />
              <Line type="monotone" dataKey="returned" stroke="#ef4444" strokeWidth={2} dot={false} name="Returned" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Status distribution */}
        <Card className="p-5">
          <h2 className="font-bold text-slate-900 text-sm mb-4">Delivery Status Breakdown</h2>
          <div className="space-y-3">
            {statuses.map(s => {
              const pct = ((s.count / totalStatusCount) * 100).toFixed(1);
              return (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-700">{s.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">{s.count}</span>
                      <span className="text-xs font-bold text-slate-700 w-10 text-right">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recent Parcels */}
      <Card>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-900 text-sm">Recent Parcels & Orders</h2>
            <p className="text-xs text-slate-500 mt-0.5">Showing latest booked parcels with real-time status</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => exportParcelsCSV()}>
              <Download size={13} /> Export CSV
            </Button>
            <NavLink to="/parcels">
              <Button variant="secondary" size="sm">View All ({parcels.length})</Button>
            </NavLink>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {["Tracking ID", "Customer", "Phone", "Courier", "COD Amount", "Risk Assessment", "Status", "Date", "Action"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {parcels.slice(0, 6).map((p, i) => (
                <tr key={p.id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${i === 5 ? "border-none" : ""}`}>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono font-bold text-indigo-600">{p.id}</span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">{p.customer}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 font-mono">{p.phone}</td>
                  <td className="px-4 py-3">
                    <Badge variant="indigo">{p.courier}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-900">৳{p.cod.toLocaleString()}</td>
                  <td className="px-4 py-3"><RiskBadge level={p.risk} /></td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{p.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/parcels`)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-indigo-600"
                        title="View Details"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        onClick={() => navigate(`/tracking?id=${p.id}`)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-indigo-600"
                        title="Live Tracking"
                      >
                        <MapPin size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
