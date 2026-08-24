import { Activity, ShieldCheck, AlertTriangle, XCircle, RefreshCw, Zap } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";

export default function AdminCouriers() {
  const { couriers, toggleCourierStatus } = useAdmin();

  return (
    <div className="space-y-6 max-w-screen-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Courier API Health & Failover Gateway</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time webhook and booking API monitoring across all integrated Bangladesh couriers.</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="text-xs font-bold text-slate-400 uppercase">Average Gateway Latency</div>
          <div className="text-2xl font-black text-white mt-1 font-mono">185 ms</div>
          <p className="text-xs text-emerald-400 font-semibold mt-1">⚡ Fast booking response</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="text-xs font-bold text-slate-400 uppercase">Daily API Requests</div>
          <div className="text-2xl font-black text-white mt-1 font-mono">316,900</div>
          <p className="text-xs text-slate-400 mt-1">Booking & webhook sync calls</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="text-xs font-bold text-slate-400 uppercase">Automated Failover</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">ENABLED</div>
          <p className="text-xs text-slate-400 mt-1">Auto-reroute if latency &gt; 800ms</p>
        </div>
      </div>

      {/* Couriers Detail Cards */}
      <div className="space-y-4">
        <h2 className="font-bold text-white text-base">Integrated Provider Endpoints</h2>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {couriers.map(c => (
            <div key={c.name} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-white font-black flex items-center justify-center text-sm">
                    {c.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{c.name} Courier API</h3>
                    <p className="text-xs text-slate-500 font-mono">https://api.{c.name.toLowerCase()}.com/v1</p>
                  </div>
                </div>

                <span
                  className={`font-bold px-3 py-1 rounded-full border text-xs flex items-center gap-1.5 ${
                    c.status === "Operational"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : c.status === "Degraded"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}
                >
                  {c.status === "Operational" ? (
                    <ShieldCheck size={13} />
                  ) : c.status === "Degraded" ? (
                    <AlertTriangle size={13} />
                  ) : (
                    <XCircle size={13} />
                  )}
                  {c.status}
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 my-5 p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-center">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Uptime (30d)</span>
                  <p className="text-sm font-bold text-slate-200 mt-0.5">{c.uptime}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">API Latency</span>
                  <p className={`text-sm font-bold mt-0.5 font-mono ${c.latencyMs > 300 ? "text-amber-400" : "text-emerald-400"}`}>
                    {c.latencyMs} ms
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Error Rate</span>
                  <p className="text-sm font-bold text-slate-200 mt-0.5">{c.errorRate}</p>
                </div>
              </div>

              {/* Incidents & Action */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                <span className="text-slate-400">
                  Last Incident: <span className="text-slate-300 font-medium">{c.lastIncident}</span>
                </span>
                <button
                  onClick={() => toggleCourierStatus(c.name)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold transition-colors border border-slate-700"
                >
                  Simulate Status Cycle
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
