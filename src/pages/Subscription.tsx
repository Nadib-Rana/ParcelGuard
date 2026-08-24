import { Check, Zap } from "lucide-react";
import { Card, Button } from "../components/ui";

const plans = [
  { name: "Starter", price: "৳999", checks: 500, bookings: 200, current: true },
  { name: "Growth", price: "৳2,499", checks: 2000, bookings: 1000, current: false },
  { name: "Enterprise", price: "৳5,999", checks: 10000, bookings: 5000, current: false },
];

export default function Subscription() {
  return (
    <div className="p-6 space-y-6 max-w-screen-xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Subscription & Credits</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your plan and purchase additional credits.</p>
      </div>

      {/* Current plan */}
      <Card className="p-5 border-indigo-200 bg-indigo-50/30">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">Current Plan</span>
              <span className="bg-indigo-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">Active</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Starter Plan</h2>
            <p className="text-sm text-slate-500 mt-0.5">৳999 / month · Renews Sep 1, 2026</p>
          </div>
          <Button variant="secondary">Manage Billing</Button>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-slate-700">Fraud Checks</span>
              <span className="text-sm font-bold text-slate-900">340 / 500</span>
            </div>
            <div className="h-2.5 bg-white border border-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: "68%" }} />
            </div>
            <p className="text-xs text-slate-500 mt-1">160 checks remaining</p>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-slate-700">Parcel Bookings</span>
              <span className="text-sm font-bold text-slate-900">78 / 200</span>
            </div>
            <div className="h-2.5 bg-white border border-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "39%" }} />
            </div>
            <p className="text-xs text-slate-500 mt-1">122 bookings remaining</p>
          </div>
        </div>
      </Card>

      {/* Plans */}
      <div>
        <h2 className="font-semibold text-slate-900 mb-4">Upgrade Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map(p => (
            <div key={p.name} className={`rounded-xl border-2 p-5 ${p.current ? "border-indigo-500 bg-indigo-50/30" : "border-slate-200 bg-white"}`}>
              {p.current && <span className="inline-block bg-indigo-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full mb-3">Current Plan</span>}
              <h3 className="font-bold text-slate-900 text-lg">{p.name}</h3>
              <p className="text-2xl font-bold text-slate-900 mt-1">{p.price} <span className="text-sm font-normal text-slate-500">/ month</span></p>
              <div className="mt-4 space-y-2">
                {[
                  `${p.checks.toLocaleString()} Fraud Checks`,
                  `${p.bookings.toLocaleString()} Parcel Bookings`,
                  "All Courier Integrations",
                  "Real-time Tracking",
                  p.bookings >= 1000 ? "Priority Support" : null,
                  p.bookings >= 5000 ? "Dedicated Account Manager" : null,
                ].filter(Boolean).map(f => (
                  <div key={f!} className="flex items-center gap-2 text-sm text-slate-700">
                    <Check size={13} className="text-emerald-500 flex-shrink-0" /> {f}
                  </div>
                ))}
              </div>
              <Button variant={p.current ? "secondary" : "primary"} className="w-full justify-center mt-5" disabled={p.current}>
                {p.current ? "Current Plan" : "Upgrade"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Buy credits */}
      <div>
        <h2 className="font-semibold text-slate-900 mb-4">Buy Additional Credits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "100 Fraud Checks", price: "৳199", icon: <Zap size={14} /> },
            { label: "500 Fraud Checks", price: "৳799", icon: <Zap size={14} />, popular: true },
            { label: "500 Booking Credits", price: "৳499", icon: <Zap size={14} /> },
          ].map(c => (
            <Card key={c.label} className={`p-4 ${c.popular ? "border-indigo-300 bg-indigo-50/20" : ""}`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-slate-900">{c.label}</p>
                {c.popular && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">Popular</span>}
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-3">{c.price}</p>
              <Button variant="secondary" size="sm" className="w-full justify-center">{c.icon} Buy Now</Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
