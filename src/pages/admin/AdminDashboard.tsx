import { Building2, CircleDollarSign, Package, Ban, Activity, ArrowUpRight, Megaphone, ShieldAlert } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";

const mrrGrowthData = [
  { month: "Jan", mrr: 580000, merchants: 3100 },
  { month: "Feb", mrr: 720000, merchants: 3650 },
  { month: "Mar", mrr: 890000, merchants: 4120 },
  { month: "Apr", mrr: 1040000, merchants: 4680 },
  { month: "May", mrr: 1190000, merchants: 4990 },
  { month: "Jun", mrr: 1320000, merchants: 5240 },
  { month: "Jul", mrr: 1480000, merchants: 5420 },
];

export default function AdminDashboard() {
  const { merchants, couriers, blacklist, transactions } = useAdmin();
  const navigate = useNavigate();

  const activeMerchantsCount = merchants.filter(m => m.status === "Active").length;
  const totalParcelsCount = merchants.reduce((acc, m) => acc + m.totalParcels, 248500);

  return (
    <div className="space-y-6 max-w-screen-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Super Admin Platform Overview</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time system telemetry, merchant usage metrics, and platform MRR.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/admin/broadcasts")}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black px-4 py-2 rounded-xl transition-colors shadow-lg shadow-amber-500/20"
          >
            <Megaphone size={14} /> Send Broadcast
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Merchants</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Building2 size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-2">5,420</div>
          <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold mt-2">
            <ArrowUpRight size={14} /> +12.4% vs last month ({activeMerchantsCount} active)
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Platform MRR</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CircleDollarSign size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400 mt-2">৳14,80,000</div>
          <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold mt-2">
            <ArrowUpRight size={14} /> +18.2% recurring revenue growth
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Parcels Handled</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Package size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-2">{totalParcelsCount.toLocaleString()}</div>
          <div className="text-xs text-slate-400 font-medium mt-2">Across 64 Bangladesh districts</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Central Fraud Database</span>
            <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
              <Ban size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-red-400 mt-2">42,100+</div>
          <div className="text-xs text-slate-400 font-medium mt-2">{blacklist.length} flagged in active review</div>
        </div>
      </div>

      {/* Charts & Courier Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* MRR Growth Chart */}
        <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Platform Revenue & Merchant Scaling</h2>
              <p className="text-xs text-slate-400 mt-0.5">Monthly Recurring Revenue (MRR) trajectory in BDT</p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-lg">
              2026 Live
            </span>
          </div>

          <ResponsiveContainer width="100%" height={260}>
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
              <Area type="monotone" dataKey="mrr" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorMrr)" name="MRR (BDT)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Courier Health Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Activity size={16} className="text-indigo-400" /> Courier API Health
              </h2>
              <button onClick={() => navigate("/admin/couriers")} className="text-xs text-indigo-400 hover:underline">
                View Details &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {couriers.map(c => (
                <div key={c.name} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-200">{c.name}</span>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">{c.latencyMs}ms latency · {c.errorRate} err</p>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      c.status === "Operational"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : c.status === "Degraded"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-500 font-medium">99.78% Overall Platform Gateway Uptime</span>
          </div>
        </div>
      </div>

      {/* Recent Transactions & Top Merchants */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top Active Merchants */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">Top Active Merchants</h2>
            <button onClick={() => navigate("/admin/merchants")} className="text-xs text-indigo-400 hover:underline">
              All Merchants ({merchants.length})
            </button>
          </div>
          <div className="space-y-2">
            {merchants.slice(0, 4).map(m => (
              <div key={m.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{m.name}</span>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                      {m.plan}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">👤 {m.ownerName} · 📞 {m.phone}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400">{m.monthlyOrders} orders/mo</span>
                  <p className="text-[10px] text-slate-500">{m.totalParcels} total parcels</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Billing Stream */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">Live Platform Billing Feed</h2>
            <button onClick={() => navigate("/admin/finance")} className="text-xs text-indigo-400 hover:underline">
              Finance Ledger
            </button>
          </div>
          <div className="space-y-2">
            {transactions.slice(0, 4).map(t => (
              <div key={t.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{t.merchantName}</span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      {t.method}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">{t.trxId} · {t.date}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-emerald-400">+৳{t.amount.toLocaleString()}</span>
                  <p className="text-[10px] text-slate-400 font-medium">{t.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
