import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import { Plus, Upload, Download, MapPin, Eye } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Card, Button, StatusBadge, RiskBadge } from "../components/ui";
import DashboardKpis from "../components/dashboard/DashboardKpis";
import ParcelDrawer from "../components/parcels/ParcelDrawer";
import type { Parcel } from "../types";

const weeklyDeliveryData = [
  { day: "Sat", delivered: 45, returned: 4 },
  { day: "Sun", delivered: 52, returned: 3 },
  { day: "Mon", delivered: 68, returned: 7 },
  { day: "Tue", delivered: 61, returned: 5 },
  { day: "Wed", delivered: 75, returned: 6 },
  { day: "Thu", delivered: 82, returned: 4 },
  { day: "Fri", delivered: 58, returned: 2 },
];

export default function Dashboard() {
  const { parcels, updateParcelStatus, exportParcelsCSV } = useData();
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const navigate = useNavigate();

  const statuses = [
    { label: "Pending Pickup", count: parcels.filter(p => p.status === "Pending Pickup").length, color: "bg-amber-400" },
    { label: "In Transit", count: parcels.filter(p => p.status === "In Transit").length, color: "bg-blue-500" },
    { label: "Delivered", count: parcels.filter(p => p.status === "Delivered").length, color: "bg-emerald-500" },
    { label: "Returned", count: parcels.filter(p => p.status === "Returned").length, color: "bg-red-500" },
  ];

  return (
    <div className="p-6 space-y-6 max-w-screen-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Dashboard & Operations</h1>
          <p className="text-sm text-slate-500 mt-0.5">Real-time overview of your parcel dispatches, deliveries, and COD returns.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm" onClick={exportParcelsCSV}>
            <Download size={13} /> Export CSV
          </Button>
          <Link to="/bulk-upload">
            <Button variant="secondary" size="sm"><Upload size={13} /> Bulk Upload</Button>
          </Link>
          <Link to="/book-parcel">
            <Button size="sm"><Plus size={13} /> Book Parcel</Button>
          </Link>
        </div>
      </div>

      <DashboardKpis parcels={parcels} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Weekly Delivery Performance</h2>
              <p className="text-xs text-slate-500">Delivered vs Returned volume this week</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyDeliveryData} margin={{ left: -20, right: 8 }}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Bar dataKey="delivered" fill="#10b981" radius={[4, 4, 0, 0]} name="Delivered" />
              <Bar dataKey="returned" fill="#ef4444" radius={[4, 4, 0, 0]} name="Returned" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5 flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-slate-900 text-sm mb-1">Parcel Pipeline Status</h2>
            <p className="text-xs text-slate-500 mb-4">Current stage of all active dispatches</p>
            <div className="space-y-3">
              {statuses.map(s => (
                <div key={s.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">{s.label}</span>
                    <span className="font-bold text-slate-900">{s.count}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color} rounded-full`} style={{ width: `${Math.min(100, (s.count / Math.max(1, parcels.length)) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 mt-4 flex justify-between text-xs">
            <span className="text-slate-500">Fast Auto-Routing:</span>
            <span className="font-bold text-emerald-600">Active</span>
          </div>
        </Card>
      </div>

      {/* Recent Parcels */}
      <Card>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-900 text-sm">Recent Parcels</h2>
          <Link to="/parcels" className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold">View All &rarr;</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-semibold">
                <th className="px-5 py-3 text-left">Tracking ID</th>
                <th className="px-5 py-3 text-left">Customer</th>
                <th className="px-5 py-3 text-left">Courier</th>
                <th className="px-5 py-3 text-left">COD Amount</th>
                <th className="px-5 py-3 text-left">Fraud Risk</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {parcels.slice(0, 5).map(p => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-mono font-bold text-indigo-600">{p.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-900">{p.customer}</div>
                    <div className="text-slate-400 text-[11px] font-mono">{p.phone}</div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-700 font-medium">{p.courier}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">৳{p.cod.toLocaleString()}</td>
                  <td className="px-5 py-3.5"><RiskBadge level={p.risk} /></td>
                  <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-3.5 flex items-center gap-1.5">
                    <button onClick={() => setSelectedParcel(p)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500">
                      <Eye size={14} />
                    </button>
                    <button onClick={() => navigate(`/tracking?id=${p.id}`)} className="p-1.5 hover:bg-slate-100 rounded-lg text-indigo-600">
                      <MapPin size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedParcel && (
        <ParcelDrawer parcel={selectedParcel} onClose={() => setSelectedParcel(null)} onUpdateStatus={updateParcelStatus} />
      )}
    </div>
  );
}
