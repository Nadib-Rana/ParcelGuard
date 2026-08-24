import { useState } from "react";
import { Search, Plus, X, Clock, ShieldAlert, Check, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useData, type Customer } from "../context/DataContext";
import { Card, RiskBadge, Button, Badge } from "../components/ui";

const filters = ["All Customers", "Safe", "Moderate Risk", "High Risk", "Watchlist"];

export default function Customers() {
  const { customers, toggleWatchlist, addCustomerNote } = useData();
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState("All Customers");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [search, setSearch] = useState("");
  const [noteText, setNoteText] = useState("");

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    const matchFilter =
      activeFilter === "All Customers"
        ? true
        : activeFilter === "Watchlist"
        ? c.isWatchlist
        : activeFilter === "Moderate Risk"
        ? c.risk === "Moderate"
        : c.risk === activeFilter;
    return matchSearch && matchFilter;
  });

  const handleOpenDrawer = (c: Customer) => {
    setSelectedCustomer(c);
    setNoteText(c.notes || "");
  };

  const handleSaveNote = () => {
    if (!selectedCustomer) return;
    addCustomerNote(selectedCustomer.phone, noteText);
    setSelectedCustomer({ ...selectedCustomer, notes: noteText });
  };

  return (
    <div className="p-6 space-y-5 max-w-screen-xl relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Customer Directory & Risk Intelligence</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track customer delivery success rates, return history, and high-risk watchlists.</p>
        </div>
        <Button size="sm" onClick={() => navigate("/fraud-checker")}>
          <Search size={13} /> Check Customer Risk
        </Button>
      </div>

      <Card>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-slate-100">
          <div className="relative flex-1 min-w-48">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by customer name or phone number..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeFilter === f ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f} {f === "Watchlist" && `(${customers.filter(c => c.isWatchlist).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {["Customer", "Phone", "Orders", "Delivered", "Returned", "Success Rate", "Risk Level", "Watchlist", "Last Order", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr
                  key={c.phone}
                  className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => handleOpenDrawer(c)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {c.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className="text-sm font-semibold text-slate-900 whitespace-nowrap">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-600">{c.phone}</td>
                  <td className="px-4 py-3 text-xs font-bold text-slate-900">{c.orders}</td>
                  <td className="px-4 py-3 text-xs text-emerald-600 font-bold">{c.delivered}</td>
                  <td className="px-4 py-3 text-xs text-red-500 font-bold">{c.returned}</td>
                  <td className="px-4 py-3 text-xs font-black text-slate-900">{c.rate}</td>
                  <td className="px-4 py-3">
                    <RiskBadge level={c.risk} />
                  </td>
                  <td className="px-4 py-3">
                    {c.isWatchlist ? (
                      <Badge variant="danger">⚠ Watchlist</Badge>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{c.last}</td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" onClick={() => handleOpenDrawer(c)}>
                      View Profile
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-sm text-slate-400">
                    No customers found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Customer Detail Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs" onClick={() => setSelectedCustomer(null)} />
          <div className="relative z-10 w-full max-w-md bg-white border-l border-slate-200 flex flex-col overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white z-20">
              <h2 className="font-bold text-slate-900 text-base">Customer Intelligence Profile</h2>
              <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div className="text-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold mx-auto mb-2 shadow-sm">
                  {selectedCustomer.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <h3 className="font-bold text-slate-900 text-base">{selectedCustomer.name}</h3>
                <p className="text-xs font-mono text-slate-500 mt-0.5">📞 {selectedCustomer.phone}</p>
                <div className="mt-2.5 flex justify-center gap-2">
                  <RiskBadge level={selectedCustomer.risk} />
                  {selectedCustomer.isWatchlist && <Badge variant="danger">Watchlisted</Badge>}
                </div>
              </div>

              {/* Delivery Stats Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: "Total Orders", value: selectedCustomer.orders },
                  { label: "Delivery Rate", value: selectedCustomer.rate },
                  { label: "Delivered", value: selectedCustomer.delivered },
                  { label: "Returned/Refused", value: selectedCustomer.returned },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-xl p-3 text-center border border-slate-200">
                    <p className="text-xl font-black text-slate-900">{s.value}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Merchant Internal Notes</label>
                <textarea
                  rows={3}
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="Add notes (e.g. requires advance delivery fee, refuses calls)..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                />
                <div className="flex justify-end mt-1.5">
                  <Button size="sm" onClick={handleSaveNote}>
                    Save Notes
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <Button
                  variant={selectedCustomer.isWatchlist ? "danger" : "secondary"}
                  size="sm"
                  className="flex-1 justify-center"
                  onClick={() => {
                    toggleWatchlist(selectedCustomer.phone);
                    setSelectedCustomer({ ...selectedCustomer, isWatchlist: !selectedCustomer.isWatchlist });
                  }}
                >
                  {selectedCustomer.isWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                </Button>
                <Button
                  size="sm"
                  className="flex-1 justify-center"
                  onClick={() => {
                    navigate(`/parcels`);
                  }}
                >
                  View Orders
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
