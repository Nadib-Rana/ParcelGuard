import { useState } from "react";
import { Download, Calendar, TrendingUp, Package, AlertTriangle, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";
import { useData } from "../context/DataContext";
import { Card, Button } from "../components/ui";

const deliveryData = [
  { month: "Mar", delivered: 820, returned: 72, cancelled: 18 },
  { month: "Apr", delivered: 940, returned: 68, cancelled: 22 },
  { month: "May", delivered: 1050, returned: 91, cancelled: 30 },
  { month: "Jun", delivered: 880, returned: 78, cancelled: 25 },
  { month: "Jul", delivered: 1120, returned: 85, cancelled: 28 },
  { month: "Aug", delivered: 982, returned: 68, cancelled: 14 },
];

const codData = [
  { month: "Mar", amount: 820000 }, { month: "Apr", amount: 940000 },
  { month: "May", amount: 1050000 }, { month: "Jun", amount: 880000 },
  { month: "Jul", amount: 1120000 }, { month: "Aug", amount: 780000 },
];

const courierPie = [
  { name: "Steadfast", value: 52, color: "#10b981" },
  { name: "Pathao", value: 31, color: "#6366f1" },
  { name: "RedX", value: 17, color: "#ef4444" },
];

const districts = [
  { name: "Dhaka", orders: 421 }, { name: "Chattogram", orders: 218 },
  { name: "Sylhet", orders: 145 }, { name: "Rajshahi", orders: 98 },
  { name: "Khulna", orders: 76 },
];

const ranges = ["Today", "Last 7 Days", "Last 30 Days", "Custom Range"];

export default function Reports() {
  const { parcels, exportParcelsCSV } = useData();
  const [range, setRange] = useState("Last 30 Days");

  const totalDelivered = parcels.filter(p => p.status === "Delivered").length;
  const totalReturned = parcels.filter(p => p.status === "Returned").length;
  const deliverySuccessRate = ((totalDelivered / Math.max(1, parcels.length)) * 100).toFixed(1);
  const returnRate = ((totalReturned / Math.max(1, parcels.length)) * 100).toFixed(1);

  const handleExportReport = () => {
    exportParcelsCSV();
  };

  return (
    <div className="p-6 space-y-6 max-w-screen-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Reports & Delivery Analytics</h1>
          <p className="text-sm text-slate-500 mt-0.5">In-depth insights on your courier performance, return ratios, and COD volumes.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg">
            {ranges.map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  range === r ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <Button variant="secondary" size="sm" onClick={handleExportReport}>
            <Download size={13} /> Export Analytics CSV
          </Button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Delivery Success Rate", value: `${deliverySuccessRate}%`, trend: "↑ 2.1% vs last month", color: "text-emerald-600", icon: CheckCircle2 },
          { label: "Return Rate", value: `${returnRate}%`, trend: "↓ 0.5% vs last month", color: "text-emerald-600", icon: AlertTriangle },
          { label: "Avg Delivery Time", value: "2.4 Days", trend: "↑ 0.2 days vs last month", color: "text-amber-600", icon: Calendar },
          { label: "COD Collection Rate", value: "94.2%", trend: "↑ 1.3% vs last month", color: "text-emerald-600", icon: TrendingUp },
        ].map(k => (
          <Card key={k.label} className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-500">{k.label}</p>
              <k.icon size={16} className="text-slate-400" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-1">{k.value}</p>
            <p className={`text-xs font-bold mt-1 ${k.color}`}>{k.trend}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Delivery chart */}
        <Card className="p-5">
          <h2 className="font-bold text-slate-900 text-sm mb-4">Monthly Delivery vs Return Volume</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deliveryData} margin={{ left: -20, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="delivered" fill="#10b981" radius={[4, 4, 0, 0]} name="Delivered" />
              <Bar dataKey="returned" fill="#ef4444" radius={[4, 4, 0, 0]} name="Returned" />
              <Bar dataKey="cancelled" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Cancelled" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* COD trend */}
        <Card className="p-5">
          <h2 className="font-bold text-slate-900 text-sm mb-4">Monthly COD Collection Volume (BDT)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={codData} margin={{ left: -10, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={v => `৳${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [`৳${Number(v).toLocaleString()}`, "COD Amount"]} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Line type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={2.5} dot={{ fill: "#4f46e5", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Courier performance */}
        <Card className="p-5">
          <h2 className="font-bold text-slate-900 text-sm mb-4">Courier Distribution Share</h2>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={courierPie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {courierPie.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 flex-1">
              {courierPie.map(c => (
                <div key={c.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: c.color }} />
                    <span className="font-medium text-slate-700">{c.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Top districts */}
        <Card className="p-5">
          <h2 className="font-bold text-slate-900 text-sm mb-4">Top Delivery Districts</h2>
          <div className="space-y-3">
            {districts.map(d => (
              <div key={d.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-700">{d.name}</span>
                  <span className="text-xs font-bold text-slate-900">{d.orders} orders</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(d.orders / 421) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
