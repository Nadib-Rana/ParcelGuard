import { useState } from "react";
import { Shield, Package, Wallet, Info, CheckCheck } from "lucide-react";
import { useData } from "../context/DataContext";
import { Card, Button } from "../components/ui";

const categories = ["All", "Parcels", "Payments", "Risk Alerts", "System"] as const;

export default function Notifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered = notifications.filter(n => activeCategory === "All" || n.category === activeCategory);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "risk": return { icon: Shield, color: "bg-red-50 text-red-600" };
      case "payment": return { icon: Wallet, color: "bg-emerald-50 text-emerald-600" };
      case "parcel": return { icon: Package, color: "bg-indigo-50 text-indigo-600" };
      default: return { icon: Info, color: "bg-slate-100 text-slate-600" };
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Notifications & Risk Alerts</h1>
          <p className="text-sm text-slate-500 mt-0.5">{unreadCount} unread merchant notifications</p>
        </div>
        <Button variant="secondary" size="sm" onClick={markAllNotificationsRead}>
          <CheckCheck size={13} /> Mark All as Read
        </Button>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
              activeCategory === c ? "bg-indigo-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-2.5">
        {filtered.map(n => {
          const { icon: Icon, color } = getIcon(n.type);
          return (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-sm ${
                n.read ? "bg-white border-slate-200" : "bg-indigo-50/60 border-indigo-200 ring-1 ring-indigo-400/20"
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-bold ${n.read ? "text-slate-700" : "text-slate-900"}`}>{n.title}</p>
                  {!n.read && <span className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0" />}
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.body}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-1">{n.time}</p>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <Card className="p-10 text-center text-sm text-slate-400">
            No notifications in this category.
          </Card>
        )}
      </div>
    </div>
  );
}
