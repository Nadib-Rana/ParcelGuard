import { useState } from "react";
import { Package, TrendingUp, AlertTriangle, Wallet, MoreHorizontal, Eye, MapPin, Download, Import } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, StatCard, RiskBadge, StatusBadge, Button, Badge } from "../components/ui";
import { NavLink } from "react-router-dom";

const chartData = [
  { day: "Mon", created: 42, transit: 35, delivered: 28, returned: 5 },
  { day: "Tue", created: 58, transit: 48, delivered: 41, returned: 7 },
  { day: "Wed", created: 51, transit: 44, delivered: 38, returned: 4 },
  { day: "Thu", created: 67, transit: 55, delivered: 49, returned: 8 },
  { day: "Fri", created: 73, transit: 60, delivered: 52, returned: 6 },
  { day: "Sat", created: 89, transit: 74, delivered: 67, returned: 9 },
  { day: "Sun", created: 64, transit: 53, delivered: 46, returned: 5 },
];

const parcels = [
  { id: "PG-102845", customer: "Rahim Uddin", phone: "01711-234567", courier: "Steadfast", cod: "৳1,250", risk: "Safe" as const, status: "Delivered", date: "24 Aug 2026" },
  { id: "PG-102846", customer: "Karim Hasan", phone: "01812-345678", courier: "Pathao", cod: "৳2,500", risk: "High Risk" as const, status: "Returned", date: "24 Aug 2026" },
  { id: "PG-102847", customer: "Nasrin Akter", phone: "01913-456789", courier: "RedX", cod: "৳850", risk: "Safe" as const, status: "In Transit", date: "23 Aug 2026" },
  { id: "PG-102848", customer: "Farhan Hossain", phone: "01614-567890", courier: "Steadfast", cod: "৳3,200", risk: "Moderate" as const, status: "Pending Pickup", date: "23 Aug 2026" },
  { id: "PG-102849", customer: "Sadia Islam", phone: "01515-678901", courier: "Pathao", cod: "৳1,800", risk: "Safe" as const, status: "Out for Delivery", date: "22 Aug 2026" },
  { id: "PG-102850", customer: "Jahangir Alam", phone: "01716-789012", courier: "RedX", cod: "৳4,500", risk: "High Risk" as const, status: "Returned", date: "22 Aug 2026" },
];

const statusDistribution = [
  { label: "Delivered", count: 982, pct: 78.7, color: "bg-emerald-500" },
  { label: "In Transit", count: 124, pct: 9.9, color: "bg-blue-500" },
  { label: "Out for Delivery", count: 38, pct: 3.0, color: "bg-indigo-500" },
  { label: "Pending Pickup", count: 18, pct: 1.4, color: "bg-amber-500" },
  { label: "Returned", count: 68, pct: 5.4, color: "bg-red-500" },
  { label: "Cancelled", count: 18, pct: 1.6, color: "bg-slate-300" },
];

export default function Dashboard() {
  const [tab, setTab] = useState("7 Days");
  const tabs = ["7 Days", "30 Days", "3 Months"];

  return (
    <div className="p-6 space-y-6 max-w-screen-2xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Good morning, Merchant 👋</h1>
          <p className="text-sm text-slate-500 mt-0.5">Here's what's happening with your parcels today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <Import size={13} /> Import Orders
          </Button>
          <NavLink to="/book-parcel">
            <Button size="sm">
              <span>+ Book Parcel</span>
            </Button>
          </NavLink>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={<Package size={18} />}
          label="Total Parcels"
          value="1,248"
          trend="↑ 12.5% vs last month"
        />
        <StatCard
          icon={<TrendingUp size={18} />}
          label="Delivered Successfully"
          value="982"
          sub="78.7% success rate"
          subColor="text-emerald-600"
        />
        <StatCard
          icon={<AlertTriangle size={18} />}
          label="At Risk / Returned"
          value="86"
          sub="Potential loss: ৳18,450"
          subColor="text-red-500"
        />
        <StatCard
          icon={<Wallet size={18} />}
          label="Pending COD"
          value="৳2,45,600"
          sub="Expected settlement this week"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Line chart */}
        <Card className="xl:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-slate-900">Parcel Performance</h2>
              <p className="text-xs text-slate-500 mt-0.5">Delivery trends over time</p>
            </div>
            <div className="flex gap-1">
              {tabs.map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${tab === t ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
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
          <h2 className="font-semibold text-slate-900 mb-4">Delivery Status</h2>
          <div className="space-y-3">
            {statusDistribution.map(s => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-slate-700">{s.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{s.count}</span>
                    <span className="text-xs font-semibold text-slate-700 w-8 text-right">{s.pct}%</span>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Parcels */}
      <Card>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Recent Parcels</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Download size={13} /> Export
            </Button>
            <NavLink to="/parcels">
              <Button variant="secondary" size="sm">View All</Button>
            </NavLink>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {["Tracking ID", "Customer", "Phone", "Courier", "COD", "Risk", "Status", "Date", "Action"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {parcels.map((p, i) => (
                <tr key={p.id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${i === parcels.length - 1 ? "border-none" : ""}`}>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono font-semibold text-indigo-600">{p.id}</span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 whitespace-nowrap">{p.customer}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 font-mono">{p.phone}</td>
                  <td className="px-4 py-3">
                    <Badge variant="indigo">{p.courier}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900">{p.cod}</td>
                  <td className="px-4 py-3"><RiskBadge level={p.risk} /></td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{p.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
                        <Eye size={13} />
                      </button>
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
                        <MapPin size={13} />
                      </button>
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
                        <MoreHorizontal size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
          <span className="text-xs text-slate-500">Showing 6 of 1,248 parcels</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, "...", 208].map((p, i) => (
              <button key={i} className={`w-7 h-7 text-xs rounded-lg font-medium transition-colors ${p === 1 ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
