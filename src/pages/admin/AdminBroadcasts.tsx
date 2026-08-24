import { useState } from "react";
import { Megaphone, AlertTriangle, Send, ShieldAlert, Check, Bell } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import type { SystemBroadcast } from "../../types/admin";

export default function AdminBroadcasts() {
  const { broadcasts, sendBroadcast, maintenanceMode, toggleMaintenanceMode } = useAdmin();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<SystemBroadcast["type"]>("info");
  const [target, setTarget] = useState<SystemBroadcast["target"]>("All Merchants");
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    sendBroadcast(title, message, type, target);
    setSentSuccess(true);
    setTitle("");
    setMessage("");
    setTimeout(() => setSentSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">System Broadcasts & Platform Controls</h1>
          <p className="text-xs text-slate-400 mt-1">Push global notification banners to all merchant dashboards and control system status.</p>
        </div>
      </div>

      {/* Maintenance Mode Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={22} className={maintenanceMode ? "text-amber-400 animate-pulse" : "text-slate-500"} />
          <div>
            <h3 className="font-bold text-white text-sm">Platform Maintenance Mode</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              When active, merchant parcel bookings are queued and a warning banner appears across all merchant portals.
            </p>
          </div>
        </div>
        <button
          onClick={toggleMaintenanceMode}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 ${
            maintenanceMode
              ? "bg-amber-500 text-slate-950 hover:bg-amber-400"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
          }`}
        >
          {maintenanceMode ? "Disable Maintenance Mode" : "Enable Maintenance Mode"}
        </button>
      </div>

      {/* Send Broadcast Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Megaphone size={18} className="text-amber-400" />
          <h2 className="font-bold text-white text-base">Dispatch Instant Global Notification</h2>
        </div>

        {sentSuccess && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-2">
            <Check size={14} /> Broadcast successfully pushed to {target}!
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-bold mb-1.5">Broadcast Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Scheduled System Upgrade at 02:00 AM"
                required
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-bold mb-1.5">Target Audience</label>
                <select
                  value={target}
                  onChange={e => setTarget(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none"
                >
                  <option value="All Merchants">All Merchants (5,420)</option>
                  <option value="Starter">Starter Plan Only</option>
                  <option value="Growth">Growth Plan Only</option>
                  <option value="Enterprise">Enterprise Plan Only</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1.5">Severity Level</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none"
                >
                  <option value="info">Info (Blue)</option>
                  <option value="warning">Warning (Amber)</option>
                  <option value="urgent">Urgent / Alert (Red)</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1.5">Announcement Message</label>
            <textarea
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Write the message that will pop up on merchant notifications..."
              required
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl transition-colors shadow-lg shadow-amber-500/20 text-xs"
            >
              <Send size={13} /> Dispatch to All Dashboards
            </button>
          </div>
        </form>
      </div>

      {/* Broadcast History */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="font-bold text-white text-base mb-4">Broadcast Dispatch History</h2>
        <div className="space-y-3">
          {broadcasts.map(b => (
            <div key={b.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    b.type === "urgent"
                      ? "bg-red-500/10 text-red-400"
                      : b.type === "warning"
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-blue-500/10 text-blue-400"
                  }`}
                >
                  <Bell size={15} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-xs">{b.title}</h3>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                      {b.target}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{b.message}</p>
                  <span className="text-[10px] text-slate-500 font-mono mt-1.5 block">
                    Sent: {b.sentAt} · Delivered to {b.deliveredCount.toLocaleString()} merchants
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
