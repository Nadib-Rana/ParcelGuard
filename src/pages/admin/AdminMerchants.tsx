import { useState } from "react";
import { Search } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import type { PlatformMerchant } from "../../types/admin";
import MerchantManageModal from "../../components/admin/MerchantManageModal";

export default function AdminMerchants() {
  const { merchants, updateMerchantStatus, updateMerchantPlan } = useAdmin();

  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedMerchant, setSelectedMerchant] = useState<PlatformMerchant | null>(null);

  const filtered = merchants.filter(m => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search) ||
      m.id.toLowerCase().includes(search.toLowerCase());
    const matchPlan = planFilter === "All" || m.plan === planFilter;
    const matchStatus = statusFilter === "All" || m.status === statusFilter;
    return matchSearch && matchPlan && matchStatus;
  });

  return (
    <div className="space-y-6 max-w-screen-2xl">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Merchant Tenant Directory</h1>
        <p className="text-xs text-slate-400 mt-1">Manage merchant store subscriptions, status permissions, and usage limits.</p>
      </div>

      {/* Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-56">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by store name, ID, phone..."
            className="w-full pl-8 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <select
          value={planFilter}
          onChange={e => setPlanFilter(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none"
        >
          <option value="All">All Plans</option>
          <option value="Starter">Starter</option>
          <option value="Growth">Growth</option>
          <option value="Enterprise">Enterprise</option>
        </select>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Trial">Trial</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      {/* Merchants Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3.5">Merchant Store</th>
                <th className="px-5 py-3.5">Contact</th>
                <th className="px-5 py-3.5">Plan Tier</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Monthly Volume</th>
                <th className="px-5 py-3.5">Fraud Checks Quota</th>
                <th className="px-5 py-3.5">Joined Date</th>
                <th className="px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {filtered.map(m => (
                <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center flex-shrink-0">
                        {m.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{m.name}</div>
                        <div className="font-mono text-[10px] text-slate-500">{m.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-slate-300 font-medium">{m.ownerName}</div>
                    <div className="text-slate-500 font-mono text-[11px]">📞 {m.phone}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`font-bold px-2.5 py-0.5 rounded-full border text-[11px] ${m.plan === "Enterprise" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : m.plan === "Growth" ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "bg-slate-800 text-slate-400 border-slate-700"}`}>
                      {m.plan}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`font-bold px-2.5 py-0.5 rounded-full border text-[11px] flex items-center gap-1 w-fit ${m.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : m.status === "Trial" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${m.status === "Active" ? "bg-emerald-400" : m.status === "Trial" ? "bg-blue-400" : "bg-red-400"}`} />
                      {m.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-slate-200">
                    {m.monthlyOrders.toLocaleString()} <span className="text-[10px] text-slate-500 font-normal">orders/mo</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-mono text-slate-300">{m.fraudChecksUsed} / {m.fraudChecksLimit}</div>
                    <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(100, (m.fraudChecksUsed / m.fraudChecksLimit) * 100)}%` }} />
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">{m.joinedDate}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => setSelectedMerchant(m)} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedMerchant && (
        <MerchantManageModal
          selectedMerchant={selectedMerchant}
          onClose={() => setSelectedMerchant(null)}
          onUpdatePlan={updateMerchantPlan}
          onUpdateStatus={updateMerchantStatus}
          setSelectedMerchant={setSelectedMerchant}
        />
      )}
    </div>
  );
}
