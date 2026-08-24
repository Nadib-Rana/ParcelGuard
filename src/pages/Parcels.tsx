import { useState } from "react";
import { Search, Filter, Download, Eye, MapPin, MoreHorizontal } from "lucide-react";
import { Card, RiskBadge, StatusBadge, Button, Badge } from "../components/ui";

const all = [
  { id: "PG-102845", customer: "Rahim Uddin", phone: "01711-234567", courier: "Steadfast", cod: "৳1,250", risk: "Safe" as const, status: "Delivered", date: "24 Aug" },
  { id: "PG-102846", customer: "Karim Hasan", phone: "01812-345678", courier: "Pathao", cod: "৳2,500", risk: "High Risk" as const, status: "Returned", date: "24 Aug" },
  { id: "PG-102847", customer: "Nasrin Akter", phone: "01913-456789", courier: "RedX", cod: "৳850", risk: "Safe" as const, status: "In Transit", date: "23 Aug" },
  { id: "PG-102848", customer: "Farhan Hossain", phone: "01614-567890", courier: "Steadfast", cod: "৳3,200", risk: "Moderate" as const, status: "Pending Pickup", date: "23 Aug" },
  { id: "PG-102849", customer: "Sadia Islam", phone: "01515-678901", courier: "Pathao", cod: "৳1,800", risk: "Safe" as const, status: "Out for Delivery", date: "22 Aug" },
  { id: "PG-102850", customer: "Jahangir Alam", phone: "01716-789012", courier: "RedX", cod: "৳4,500", risk: "High Risk" as const, status: "Returned", date: "22 Aug" },
  { id: "PG-102851", customer: "Tania Begum", phone: "01817-890123", courier: "Steadfast", cod: "৳960", risk: "Safe" as const, status: "Delivered", date: "21 Aug" },
  { id: "PG-102852", customer: "Mostak Ahmed", phone: "01918-901234", courier: "Pathao", cod: "৳2,100", risk: "Moderate" as const, status: "Cancelled", date: "21 Aug" },
];

const statusFilters = ["All", "Delivered", "In Transit", "Returned", "Pending Pickup", "Cancelled"];

export default function Parcels() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = all.filter(p => {
    const matchSearch = p.customer.toLowerCase().includes(search.toLowerCase()) || p.id.includes(search);
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 space-y-5 max-w-screen-xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Parcels</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage and track all your parcel orders.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm"><Download size={13} /> Export</Button>
        </div>
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-slate-100">
          <div className="relative flex-1 min-w-48">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by ID or customer..."
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            />
          </div>
          <div className="flex gap-1">
            {statusFilters.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  statusFilter === s ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <Button variant="secondary" size="sm"><Filter size={13} /> More Filters</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {["Tracking ID", "Customer", "Phone", "Courier", "COD", "Risk", "Status", "Date", "Action"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${i === filtered.length - 1 ? "border-none" : ""}`}>
                  <td className="px-4 py-3"><span className="text-xs font-mono font-semibold text-indigo-600">{p.id}</span></td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 whitespace-nowrap">{p.customer}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 font-mono">{p.phone}</td>
                  <td className="px-4 py-3"><Badge variant="indigo">{p.courier}</Badge></td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900">{p.cod}</td>
                  <td className="px-4 py-3"><RiskBadge level={p.risk} /></td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3 text-xs text-slate-500">{p.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"><Eye size={13} /></button>
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"><MapPin size={13} /></button>
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"><MoreHorizontal size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-sm text-slate-400">No parcels match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
          <span className="text-xs text-slate-500">Showing {filtered.length} of 1,248 parcels</span>
          <div className="flex gap-1">
            {[1, 2, 3, "...", 156].map((p, i) => (
              <button key={i} className={`w-7 h-7 text-xs rounded-lg font-medium ${p === 1 ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>{p}</button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
