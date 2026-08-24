import { useState } from "react";
import { Shield, Package, Wallet, AlertTriangle, Info, CheckCheck } from "lucide-react";
import { Card, Button } from "../components/ui";

const allNotifs = [
  { id: 1, type: "risk", icon: Shield, color: "bg-red-50 text-red-600", title: "High-risk customer detected", body: "Order PG-102846 customer has a 28% delivery success rate.", time: "2 hours ago", read: false, category: "Risk Alerts" },
  { id: 2, type: "payment", icon: Wallet, color: "bg-emerald-50 text-emerald-600", title: "COD payment received", body: "৳12,500 has been added to your settlement from Steadfast.", time: "4 hours ago", read: false, category: "Payments" },
  { id: 3, type: "parcel", icon: Package, color: "bg-amber-50 text-amber-600", title: "Parcel delayed", body: "Tracking ID PG-102721 has been stuck at Dhaka Hub for 48 hours.", time: "6 hours ago", read: false, category: "Parcels" },
  { id: 4, type: "risk", icon: Shield, color: "bg-red-50 text-red-600", title: "Watchlist customer ordered", body: "Phone 01812-345678 placed a new order via Facebook.", time: "8 hours ago", read: true, category: "Risk Alerts" },
  { id: 5, type: "payment", icon: Wallet, color: "bg-emerald-50 text-emerald-600", title: "Settlement processed", body: "Pathao settlement STL-2408-001 of ৳78,500 has been confirmed.", time: "Yesterday", read: true, category: "Payments" },
  { id: 6, type: "system", icon: Info, color: "bg-indigo-50 text-indigo-600", title: "System maintenance scheduled", body: "ParcelGuard will undergo maintenance on Sep 1, 02:00–04:00 AM BDT.", time: "2 days ago", read: true, category: "System" },
  { id: 7, type: "parcel", icon: Package, color: "bg-emerald-50 text-emerald-600", title: "Bulk upload complete", body: "472 out of 500 orders from your last upload have been booked.", time: "2 days ago", read: true, category: "Parcels" },
];

const categories = ["All", "Parcels", "Payments", "Risk Alerts", "System"];

export default function Notifications() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [notifs, setNotifs] = useState(allNotifs);

  const filtered = notifs.filter(n => activeCategory === "All" || n.category === activeCategory);
  const unread = notifs.filter(n => !n.read).length;

  return (
    <div className="p-6 space-y-5 max-w-2xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500 mt-0.5">{unread} unread notifications</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setNotifs(n => n.map(x => ({ ...x, read: true })))}>
          <CheckCheck size={13} /> Mark All Read
        </Button>
      </div>

      <div className="flex gap-1">
        {categories.map(c => (
          <button key={c} onClick={() => setActiveCategory(c)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${activeCategory === c ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{c}</button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map(n => {
          const Icon = n.icon;
          return (
            <div
              key={n.id}
              onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
              className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all hover:shadow-sm ${
                n.read ? "bg-white border-slate-200" : "bg-indigo-50/60 border-indigo-200"
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${n.color}`}>
                <Icon size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-semibold ${n.read ? "text-slate-700" : "text-slate-900"}`}>{n.title}</p>
                  {!n.read && <span className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0" />}
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.body}</p>
                <p className="text-xs text-slate-400 mt-1">{n.time}</p>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <Card className="p-10 text-center">
            <p className="text-sm text-slate-400">No notifications in this category.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
