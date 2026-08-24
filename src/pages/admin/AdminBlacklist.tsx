import { useState } from "react";
import { Search, Plus, Trash2 } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import AddBlacklistModal from "../../components/admin/AddBlacklistModal";

export default function AdminBlacklist() {
  const { blacklist, addBlacklistEntry, removeBlacklistEntry } = useAdmin();
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = blacklist.filter(
    b =>
      b.phone.includes(search) ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.reason.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-screen-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Central Fraud Intelligence & Global Blacklist</h1>
          <p className="text-xs text-slate-400 mt-1">Cross-merchant fraud intelligence database shared nationwide across Bangladesh.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black px-4 py-2 rounded-xl transition-colors shadow-lg shadow-red-600/20"
        >
          <Plus size={14} /> Add Phone to Blacklist
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs font-bold text-slate-400 uppercase">Confirmed Fraudulent</span>
          <p className="text-2xl font-black text-red-400 mt-1 font-mono">
            {blacklist.filter(b => b.status === "Confirmed Fraud").length} Numbers
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs font-bold text-slate-400 uppercase">Suspicious Under Monitoring</span>
          <p className="text-2xl font-black text-amber-400 mt-1 font-mono">
            {blacklist.filter(b => b.status === "Suspicious").length} Numbers
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs font-bold text-slate-400 uppercase">Merchants Protected</span>
          <p className="text-2xl font-black text-emerald-400 mt-1 font-mono">5,420 Stores</p>
        </div>
      </div>

      {/* Search toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search blacklist by phone number, customer name, or fraud pattern..."
            className="w-full pl-8 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Blacklist Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3.5">Phone Number</th>
                <th className="px-5 py-3.5">Customer Name</th>
                <th className="px-5 py-3.5">Fraud Score</th>
                <th className="px-5 py-3.5">Reports</th>
                <th className="px-5 py-3.5">Returns</th>
                <th className="px-5 py-3.5">Reason & Modus Operandi</th>
                <th className="px-5 py-3.5">Classification</th>
                <th className="px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {filtered.map(b => (
                <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-mono font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
                      {b.phone}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-200">{b.customerName}</td>
                  <td className="px-5 py-4 font-black text-red-400 font-mono text-sm">{b.riskScore}/100</td>
                  <td className="px-5 py-4 font-bold text-slate-300">{b.reportedByCount} Stores</td>
                  <td className="px-5 py-4 font-bold text-red-400">{b.totalReturns} Refusals</td>
                  <td className="px-5 py-4 text-slate-400 max-w-sm text-[11px] leading-relaxed">{b.reason}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`font-bold px-2.5 py-0.5 rounded-full border text-[11px] whitespace-nowrap ${
                        b.status === "Confirmed Fraud"
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : b.status === "Suspicious"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => removeBlacklistEntry(b.id)}
                      className="p-1.5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                      title="Remove from Blacklist"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <AddBlacklistModal onClose={() => setShowAddModal(false)} onAdd={addBlacklistEntry} />
      )}
    </div>
  );
}
