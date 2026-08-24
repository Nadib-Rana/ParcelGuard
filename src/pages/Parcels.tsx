import { useState } from "react";
import { Search, Filter, Download, Eye, MapPin, MoreHorizontal, X, Printer, Phone, Truck, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useData, type Parcel } from "../context/DataContext";
import { Card, RiskBadge, StatusBadge, Button, Badge } from "../components/ui";

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

      {/* Parcel Details Slide-Over Drawer */}
      {selectedParcel && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs" onClick={() => setSelectedParcel(null)} />
          <div className="relative z-10 w-full max-w-md bg-white border-l border-slate-200 flex flex-col overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white z-20">
              <div>
                <span className="text-xs font-mono font-bold text-indigo-600">{selectedParcel.id}</span>
                <h2 className="font-bold text-slate-900 text-base">Parcel Order Breakdown</h2>
              </div>
              <button onClick={() => setSelectedParcel(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Status Control */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Current Status</span>
                  <StatusBadge status={selectedParcel.status} />
                </div>
                <div className="mt-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Update Status Manually:</label>
                  <select
                    value={selectedParcel.status}
                    onChange={e => {
                      const next = e.target.value as Parcel["status"];
                      updateParcelStatus(selectedParcel.id, next);
                      setSelectedParcel({ ...selectedParcel, status: next });
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none"
                  >
                    <option value="Pending Pickup">Pending Pickup</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Returned">Returned</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Customer Details</h3>
                <div className="bg-white rounded-xl p-3.5 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-slate-500">Name:</span><span className="font-semibold text-slate-900">{selectedParcel.customer}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Phone:</span><span className="font-mono font-semibold text-slate-900">📞 {selectedParcel.phone}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Address:</span><span className="font-medium text-slate-800 text-right max-w-[200px]">{selectedParcel.address}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">District:</span><span className="font-bold text-slate-900">{selectedParcel.district}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Risk Assessment:</span><RiskBadge level={selectedParcel.risk} /></div>
                </div>
              </div>

              {/* Courier Info */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Courier & Shipment</h3>
                <div className="bg-white rounded-xl p-3.5 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-slate-500">Courier Partner:</span><Badge variant="indigo">{selectedParcel.courier}</Badge></div>
                  <div className="flex justify-between"><span className="text-slate-500">Item Product:</span><span className="font-semibold text-slate-900">{selectedParcel.product}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Weight:</span><span className="font-medium text-slate-800">{selectedParcel.weight || "500g"}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">COD Total:</span><span className="font-bold text-slate-900">৳{selectedParcel.cod.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Delivery Fee:</span><span className="font-medium text-slate-700">৳{selectedParcel.charge}</span></div>
                </div>
              </div>

              {/* Rider / Agent */}
              {selectedParcel.agentName && (
                <div className="bg-indigo-50/60 rounded-xl p-3.5 border border-indigo-100 text-xs">
                  <p className="font-bold text-indigo-900 mb-1 flex items-center gap-1.5"><Truck size={14} /> Assigned Courier Rider</p>
                  <p className="text-slate-700">{selectedParcel.agentName} ({selectedParcel.agentPhone})</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1 justify-center"
                  onClick={() => {
                    navigate(`/tracking?id=${selectedParcel.id}`);
                  }}
                >
                  <MapPin size={13} /> Live Tracking
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1 justify-center"
                  onClick={() => {
                    navigate(`/bulk-labels`);
                  }}
                >
                  <Printer size={13} /> Print Label
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
