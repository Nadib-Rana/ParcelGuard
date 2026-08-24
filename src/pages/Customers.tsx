import { useState } from "react";
import { Search, Plus, X, Clock } from "lucide-react";
import { Card, RiskBadge, Button } from "../components/ui";

const customers = [
  { name: "Rahim Uddin", phone: "01711-234567", orders: 24, delivered: 22, returned: 2, rate: "91.7%", risk: "Safe" as const, last: "24 Aug 2026" },
  { name: "Karim Hasan", phone: "01812-345678", orders: 24, delivered: 9, returned: 12, rate: "37.5%", risk: "High Risk" as const, last: "24 Aug 2026" },
  { name: "Nasrin Akter", phone: "01913-456789", orders: 11, delivered: 10, returned: 1, rate: "90.9%", risk: "Safe" as const, last: "23 Aug 2026" },
  { name: "Farhan Hossain", phone: "01614-567890", orders: 8, delivered: 5, returned: 2, rate: "62.5%", risk: "Moderate" as const, last: "23 Aug 2026" },
  { name: "Sadia Islam", phone: "01515-678901", orders: 15, delivered: 14, returned: 1, rate: "93.3%", risk: "Safe" as const, last: "22 Aug 2026" },
  { name: "Jahangir Alam", phone: "01716-789012", orders: 18, delivered: 6, returned: 10, rate: "33.3%", risk: "High Risk" as const, last: "22 Aug 2026" },
];

const filters = ["All Customers", "Safe", "Moderate Risk", "High Risk", "Watchlist"];

export default function Customers() {
  const [activeFilter, setActiveFilter] = useState("All Customers");
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null);
  const [search, setSearch] = useState("");

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    const matchFilter = activeFilter === "All Customers" || c.risk === activeFilter || (activeFilter === "Moderate Risk" && c.risk === "Moderate");
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-6 space-y-5 max-w-screen-xl relative">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Customer Database</h1>
          <p className="text-sm text-slate-500 mt-0.5">Customer intelligence and risk tracking.</p>
        </div>
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-slate-100">
          <div className="relative flex-1 min-w-48">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or phone..." className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" />
          </div>
          <div className="flex gap-1 flex-wrap">
            {filters.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${activeFilter === f ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{f}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {["Customer", "Phone", "Orders", "Delivered", "Returned", "Success Rate", "Risk Level", "Last Order", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.phone} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {c.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className="text-sm font-medium text-slate-900 whitespace-nowrap">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-500">{c.phone}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900">{c.orders}</td>
                  <td className="px-4 py-3 text-sm text-emerald-600 font-medium">{c.delivered}</td>
                  <td className="px-4 py-3 text-sm text-red-500 font-medium">{c.returned}</td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-900">{c.rate}</td>
                  <td className="px-4 py-3"><RiskBadge level={c.risk} /></td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{c.last}</td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(c)}>View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Customer detail drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/30" onClick={() => setSelectedCustomer(null)} />
          <div className="relative z-10 w-full max-w-sm bg-white border-l border-slate-200 flex flex-col overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white">
              <h2 className="font-semibold text-slate-900">Customer Profile</h2>
              <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-5">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-bold mx-auto mb-2">
                  {selectedCustomer.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <h3 className="font-semibold text-slate-900">{selectedCustomer.name}</h3>
                <p className="text-sm font-mono text-slate-500">{selectedCustomer.phone}</p>
                <div className="mt-2"><RiskBadge level={selectedCustomer.risk} /></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total Orders", value: selectedCustomer.orders },
                  { label: "Success Rate", value: selectedCustomer.rate },
                  { label: "Delivered", value: selectedCustomer.delivered },
                  { label: "Returned", value: selectedCustomer.returned },
                ].map(s => (
                  <div key={s.label} className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Order History</h4>
                <div className="space-y-2">
                  {["PG-102845", "PG-102834", "PG-102810"].map(id => (
                    <div key={id} className="flex items-center gap-2 py-2 border-b border-slate-100">
                      <Clock size={12} className="text-slate-400" />
                      <span className="text-xs font-mono text-indigo-600 flex-1">{id}</span>
                      <span className="text-xs text-slate-500">Aug 2026</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Notes</label>
                <textarea rows={3} placeholder="Add internal notes about this customer..." className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 resize-none" />
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1 justify-center">
                  <Plus size={12} /> Watchlist
                </Button>
                <Button size="sm" className="flex-1 justify-center">View Parcels</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
