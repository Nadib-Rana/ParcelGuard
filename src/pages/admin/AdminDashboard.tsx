import { Activity, Megaphone } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import AdminDashboardKpis from "../../components/admin/AdminDashboardKpis";

const mrrGrowthData = [
  { month: "Jan", mrr: 580000 },
  { month: "Feb", mrr: 720000 },
  { month: "Mar", mrr: 890000 },
  { month: "Apr", mrr: 1040000 },
  { month: "May", mrr: 1190000 },
  { month: "Jun", mrr: 1320000 },
  { month: "Jul", mrr: 1480000 },
];

export default function AdminDashboard() {
  const { merchants, couriers, blacklist, transactions } = useAdmin();
  const navigate = useNavigate();

  const activeMerchantsCount = merchants.filter(m => m.status === "Active").length;
  const totalParcelsCount = merchants.reduce((acc, m) => acc + m.totalParcels, 248500);

  return (
    <div className="space-y-6 max-w-screen-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Super Admin Platform Overview</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time system telemetry, merchant usage metrics, and platform MRR.</p>
        </div>
        <button
          onClick={() => navigate("/admin/broadcasts")}
          className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black px-4 py-2 rounded-xl transition-colors shadow-lg shadow-amber-500/20"
        >
          <Megaphone size={14} /> Send Broadcast
        </button>
      </div>

      <AdminDashboardKpis
        activeMerchantsCount={activeMerchantsCount}
        totalParcelsCount={totalParcelsCount}
        blacklistCount={blacklist.length}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Platform Revenue Growth (BDT)</h2>
              <p className="text-xs text-slate-400 mt-0.5">Monthly Recurring Revenue trajectory</p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-lg">
              2026 Live
            </span>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={mrrGrowthData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={v => `৳${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", color: "#fff", fontSize: 12, borderRadius: 8 }} />
              <Area type="monotone" dataKey="mrr" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorMrr)" name="MRR" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity size={16} className="text-indigo-400" /> Courier Status
            </h2>
            <button onClick={() => navigate("/admin/couriers")} className="text-xs text-indigo-400 hover:underline">
              View All &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {couriers.slice(0, 4).map(c => (
              <div key={c.name} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-200">{c.name}</span>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">{c.latencyMs}ms · {c.errorRate}</p>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${c.status === "Operational" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-white">Top Active Merchants</h2>
            <button onClick={() => navigate("/admin/merchants")} className="text-xs text-indigo-400 hover:underline">
              All Merchants ({merchants.length})
            </button>
          </div>
          <div className="space-y-2">
            {merchants.slice(0, 3).map(m => (
              <div key={m.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white">{m.name}</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">👤 {m.ownerName} · 📞 {m.phone}</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">{m.monthlyOrders} orders/mo</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-white">Live Platform Billing Feed</h2>
            <button onClick={() => navigate("/admin/finance")} className="text-xs text-indigo-400 hover:underline">
              Finance Ledger
            </button>
          </div>
          <div className="space-y-2">
            {transactions.slice(0, 3).map(t => (
              <div key={t.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white">{t.merchantName}</span>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">{t.trxId} · {t.method}</p>
                </div>
                <span className="text-sm font-black text-emerald-400">+৳{t.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
