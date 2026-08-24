import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Package, MapPin, CheckCircle2, Truck, Clock } from "lucide-react";
import { Card, Button, RiskBadge, StatusBadge } from "../components/ui";

const timeline = [
  { event: "Order Created", time: "Aug 24, 10:30 AM", loc: "Dhaka Warehouse", done: true, icon: Package },
  { event: "Picked Up by Courier", time: "Aug 24, 04:20 PM", loc: "Steadfast Hub, Mirpur", done: true, icon: Truck },
  { event: "Arrived at Dhaka Hub", time: "Aug 25, 09:15 AM", loc: "Steadfast Central Hub, Tejgaon", done: true, icon: MapPin },
  { event: "Out for Delivery", time: "Aug 26, 08:10 AM", loc: "Courier Agent: Md. Hasan (+880 1700-000000)", done: true, icon: Truck },
  { event: "Delivered", time: "Aug 26, 03:45 PM", loc: "Recipient confirmed delivery", done: true, icon: CheckCircle2 },
];

export default function Tracking() {
  const [searchParams] = useSearchParams();
  const [trackId, setTrackId] = useState(searchParams.get("id") ?? "");
  const [tracked, setTracked] = useState(!!searchParams.get("id"));

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) { setTrackId(id); setTracked(true); }
  }, [searchParams]);

  return (
    <div className="p-6 space-y-6 max-w-screen-xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Parcel Tracking</h1>
        <p className="text-sm text-slate-500 mt-0.5">Enter a tracking ID to see real-time delivery status.</p>
      </div>

      <Card className="p-5">
        <div className="flex gap-3">
          <input
            type="text"
            value={trackId}
            onChange={e => setTrackId(e.target.value)}
            placeholder="Enter Tracking ID (e.g. PG-102845)"
            className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 font-mono"
            onKeyDown={e => e.key === "Enter" && setTracked(true)}
          />
          <Button onClick={() => setTracked(true)}>
            <Search size={14} /> Track
          </Button>
        </div>
      </Card>

      {tracked && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Timeline */}
          <Card className="lg:col-span-2 p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-semibold text-slate-900">PG-102845</h2>
                <p className="text-xs text-slate-500 mt-0.5">Last updated: Aug 26, 03:45 PM</p>
              </div>
              <StatusBadge status="Delivered" />
            </div>

            <div className="relative">
              {timeline.map((t, i) => {
                const Icon = t.icon;
                const isLast = i === timeline.length - 1;
                return (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                        t.done ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"
                      }`}>
                        <Icon size={14} />
                      </div>
                      {!isLast && <div className={`w-0.5 flex-1 my-1 ${t.done ? "bg-emerald-200" : "bg-slate-200"}`} style={{ minHeight: "32px" }} />}
                    </div>
                    <div className={`pb-6 ${isLast ? "" : ""}`}>
                      <p className={`text-sm font-semibold ${t.done ? "text-slate-900" : "text-slate-400"}`}>{t.event}</p>
                      <p className="text-xs text-indigo-600 font-medium mt-0.5">{t.time}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{t.loc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Details */}
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Customer Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Name</span><span className="font-medium text-slate-900">Rahim Uddin</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Phone</span><span className="font-mono text-slate-900">01711-234567</span></div>
                <div className="flex justify-between"><span className="text-slate-500">District</span><span className="font-medium text-slate-900">Dhaka</span></div>
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Courier Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Provider</span><span className="font-medium text-slate-900">Steadfast</span></div>
                <div className="flex justify-between"><span className="text-slate-500">COD Amount</span><span className="font-semibold text-emerald-600">৳1,250</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Status</span><StatusBadge status="Delivered" /></div>
                <div className="flex justify-between"><span className="text-slate-500">Risk Level</span><RiskBadge level="Safe" /></div>
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Courier Agent</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Name</span><span className="font-medium text-slate-900">Md. Hasan Ali</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Phone</span><span className="font-mono text-slate-900">01700-000000</span></div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {!tracked && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MapPin size={28} className="text-slate-400" />
          </div>
          <h3 className="font-semibold text-slate-900">Enter a Tracking ID</h3>
          <p className="text-sm text-slate-500 mt-1">Track any parcel booked through ParcelGuard.</p>
        </Card>
      )}
    </div>
  );
}
