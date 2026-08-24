import { useState } from "react";
import { Search, Download, Eye, MapPin, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useData, type Parcel } from "../context/DataContext";
import { Card, RiskBadge, StatusBadge, Button, Badge } from "../components/ui";
import ParcelDrawer from "../components/parcels/ParcelDrawer";

const statusFilters = ["All", "Delivered", "In Transit", "Out for Delivery", "Pending Pickup", "Returned", "Cancelled"];

export default function Parcels() {
  const { parcels, updateParcelStatus, exportParcelsCSV } = useData();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [courierFilter, setCourierFilter] = useState("All");
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);

  const filtered = parcels.filter(p => {
    const matchSearch =
      p.customer.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search);
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    const matchCourier = courierFilter === "All" || p.courier === courierFilter;
    return matchSearch && matchStatus && matchCourier;
  });

  return (
    <div className="p-6 space-y-5 max-w-screen-xl relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Parcel Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage, track, and dispatch all your customer orders in real time.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => exportParcelsCSV(filtered)}>
            <Download size={13} /> Export CSV ({filtered.length})
          </Button>
          <Button size="sm" onClick={() => navigate("/book-parcel")}>
            + Book Parcel
          </Button>
        </div>
      </div>

      <Card>
        {/* Filters Toolbar */}
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-slate-100">
          <div className="relative flex-1 min-w-48">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by ID, customer name, phone..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex gap-1 overflow-x-auto">
            {statusFilters.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  statusFilter === s ? "bg-indigo-600 text-white shadow-sm font-semibold" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <select
            value={courierFilter}
            onChange={e => setCourierFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none"
          >
            <option value="All">All Couriers</option>
            <option value="Steadfast">Steadfast</option>
            <option value="Pathao">Pathao</option>
            <option value="RedX">RedX</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {["Tracking ID", "Customer", "Phone", "Courier", "COD Amount", "Risk Score", "Delivery Status", "Date", "Action"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr
                  key={p.id}
                  className={`border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${
                    i === filtered.length - 1 ? "border-none" : ""
                  }`}
                  onClick={() => setSelectedParcel(p)}
                >
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono font-bold text-indigo-600">{p.id}</span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 whitespace-nowrap">{p.customer}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 font-mono">{p.phone}</td>
                  <td className="px-4 py-3">
                    <Badge variant="indigo">{p.courier}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-900">৳{p.cod.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <RiskBadge level={p.risk} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{p.date}</td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedParcel(p)}
                        className="p-1.5 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => navigate(`/tracking?id=${p.id}`)}
                        className="p-1.5 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"
                        title="Live Tracking"
                      >
                        <MapPin size={14} />
                      </button>
                      <button
                        onClick={() => navigate(`/bulk-labels`)}
                        className="p-1.5 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"
                        title="Print Label"
                      >
                        <Printer size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-sm text-slate-400">
                    No parcels match your current search or filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
          <span className="text-xs text-slate-500">Showing {filtered.length} of {parcels.length} total parcels</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, "...", Math.ceil(parcels.length / 8) || 1].map((pg, i) => (
              <button
                key={i}
                className={`w-7 h-7 text-xs rounded-lg font-medium ${
                  pg === 1 ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {pg}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Parcel Drawer */}
      {selectedParcel && (
        <ParcelDrawer
          parcel={selectedParcel}
          onClose={() => setSelectedParcel(null)}
          onUpdateStatus={(id, status) => {
            updateParcelStatus(id, status);
            setSelectedParcel({ ...selectedParcel, status });
          }}
        />
      )}
    </div>
  );
}
