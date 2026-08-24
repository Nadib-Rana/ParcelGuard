import { useState } from "react";
import { Search, Ban, Plus, Trash2, ShieldAlert, X, AlertTriangle, Check } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import type { GlobalBlacklistEntry } from "../../types/admin";

export default function AdminBlacklist() {
  const { blacklist, addBlacklistEntry, removeBlacklistEntry } = useAdmin();

  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [phone, setPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [riskScore, setRiskScore] = useState(90);
  const [reportedCount, setReportedCount] = useState(5);
  const [totalReturns, setTotalReturns] = useState(12);
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<GlobalBlacklistEntry["status"]>("Confirmed Fraud");

  const filtered = blacklist.filter(
    b =>
      b.phone.includes(search) ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.reason.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addBlacklistEntry({
      phone,
      customerName: customerName || "Customer",
      riskScore: Number(riskScore) || 85,
      reportedByCount: Number(reportedCount) || 1,
      totalReturns: Number(totalReturns) || 5,
      reason,
      status,
    });
    setShowAddModal(false);
    setPhone("");
    setCustomerName("");
    setReason("");
  };

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

      {/* Stats summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs font-bold text-slate-400 uppercase">Confirmed Fraudulent Numbers</span>
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
                  <td className="px-5 py-4 text-slate-400 max-w-sm text-[11px] leading-relaxed">
                    {b.reason}
                  </td>
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

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setShowAddModal(false)} />
          <div className="relative z-10 bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h2 className="font-bold text-white text-base">Add Phone to Global Blacklist</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Phone Number (11 Digits)</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Customer Name (Optional)</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="e.g. Rahim Uddin"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Risk Score (0-100)</label>
                  <input
                    type="number"
                    value={riskScore}
                    onChange={e => setRiskScore(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  >
                    <option value="Confirmed Fraud">Confirmed Fraud</option>
                    <option value="Suspicious">Suspicious</option>
                    <option value="Under Review">Under Review</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Reason / Fraud Signal</label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Detailed explanation of fraudulent behavior or delivery refusal pattern..."
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg">
                  Confirm Blacklist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
