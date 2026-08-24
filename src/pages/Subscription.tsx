import { useState } from "react";
import { Check, Zap, X, ShieldCheck, CreditCard } from "lucide-react";
import { Card, Button, Badge } from "../components/ui";

const defaultPlans = [
  { name: "Starter", price: "৳999", priceNum: 999, checks: 500, bookings: 200, current: true },
  { name: "Growth", price: "৳2,499", priceNum: 2499, checks: 2000, bookings: 1000, current: false },
  { name: "Enterprise", price: "৳5,999", priceNum: 5999, checks: 10000, bookings: 5000, current: false },
];

export default function Subscription() {
  const [plans, setPlans] = useState(defaultPlans);
  const [fraudChecksRemaining, setFraudChecksRemaining] = useState(160);
  const [bookingsRemaining, setBookingsRemaining] = useState(122);
  const [selectedCheckoutItem, setSelectedCheckoutItem] = useState<{ title: string; price: string; amount: number } | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "nagad" | "card">("bkash");
  const [accountNumber, setAccountNumber] = useState("");
  const [pin, setPin] = useState("");
  const [processing, setProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const currentPlan = plans.find(p => p.current) || plans[0];

  const handleOpenUpgrade = (planName: string, price: string, priceNum: number) => {
    setSelectedCheckoutItem({
      title: `${planName} Plan Subscription`,
      price,
      amount: priceNum,
    });
  };

  const handleOpenBuyCredits = (creditLabel: string, price: string, priceNum: number) => {
    setSelectedCheckoutItem({
      title: creditLabel,
      price,
      amount: priceNum,
    });
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);

      if (selectedCheckoutItem?.title.includes("Plan")) {
        const targetPlan = selectedCheckoutItem.title.split(" ")[0];
        setPlans(prev =>
          prev.map(p => ({
            ...p,
            current: p.name === targetPlan,
          }))
        );
        setFraudChecksRemaining(prev => prev + 1000);
        setBookingsRemaining(prev => prev + 500);
        setSuccessMsg(`Successfully upgraded to ${targetPlan} Plan!`);
      } else {
        if (selectedCheckoutItem?.title.includes("Fraud Checks")) {
          const added = parseInt(selectedCheckoutItem.title) || 100;
          setFraudChecksRemaining(prev => prev + added);
        } else if (selectedCheckoutItem?.title.includes("Booking")) {
          const added = parseInt(selectedCheckoutItem.title) || 500;
          setBookingsRemaining(prev => prev + added);
        }
        setSuccessMsg(`Payment received! ${selectedCheckoutItem?.title} added to your account.`);
      }

      setSelectedCheckoutItem(null);
      setAccountNumber("");
      setPin("");
      setTimeout(() => setSuccessMsg(""), 3500);
    }, 1200);
  };

  return (
    <div className="p-6 space-y-6 max-w-screen-xl relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Subscription & Credits</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your monthly subscription tier, fraud check quota, and dispatch credits.</p>
        </div>
        {successMsg && (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-xl text-xs font-bold animate-fade-in">
            <ShieldCheck size={16} /> {successMsg}
          </div>
        )}
      </div>

      {/* Current plan */}
      <Card className="p-6 border-indigo-200 bg-indigo-50/30">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">Current Active Plan</span>
              <span className="bg-indigo-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">Active</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{currentPlan.name} Plan</h2>
            <p className="text-sm text-slate-500 mt-0.5">{currentPlan.price} / month · Renews Sep 1, 2026</p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => handleOpenBuyCredits("500 Fraud Checks", "৳799", 799)}>
            Add Extra Credits
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700">Fraud Checks Balance</span>
              <span className="text-xs font-bold text-slate-900">{currentPlan.checks - fraudChecksRemaining} / {currentPlan.checks}</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all"
                style={{ width: `${Math.min(100, ((currentPlan.checks - fraudChecksRemaining) / currentPlan.checks) * 100)}%` }}
              />
            </div>
            <p className="text-xs font-bold text-emerald-600 mt-1.5">{fraudChecksRemaining} checks remaining</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700">Parcel Bookings Balance</span>
              <span className="text-xs font-bold text-slate-900">{currentPlan.bookings - bookingsRemaining} / {currentPlan.bookings}</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, ((currentPlan.bookings - bookingsRemaining) / currentPlan.bookings) * 100)}%` }}
              />
            </div>
            <p className="text-xs font-bold text-emerald-600 mt-1.5">{bookingsRemaining} bookings remaining</p>
          </div>
        </div>
      </Card>

      {/* Plans */}
      <div>
        <h2 className="font-bold text-slate-900 text-base mb-4">Choose Merchant Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map(p => (
            <div
              key={p.name}
              className={`rounded-2xl border-2 p-6 transition-all flex flex-col justify-between ${
                p.current ? "border-indigo-600 bg-indigo-50/20 shadow-md ring-2 ring-indigo-500/20" : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div>
                {p.current ? (
                  <Badge variant="indigo">Current Active Plan</Badge>
                ) : (
                  <Badge variant="gray">Available Tier</Badge>
                )}
                <h3 className="font-bold text-slate-900 text-lg mt-2">{p.name}</h3>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {p.price} <span className="text-xs font-normal text-slate-500">/ month</span>
                </p>
                <div className="mt-5 space-y-2.5">
                  {[
                    `${p.checks.toLocaleString()} Fraud Checks`,
                    `${p.bookings.toLocaleString()} Parcel Bookings`,
                    "All Courier Integrations",
                    "Real-time Tracking",
                    p.bookings >= 1000 ? "Priority Support" : null,
                    p.bookings >= 5000 ? "Dedicated Account Manager" : null,
                  ].filter(Boolean).map(f => (
                    <div key={f!} className="flex items-center gap-2 text-xs text-slate-700">
                      <Check size={13} className="text-emerald-500 flex-shrink-0" /> {f}
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant={p.current ? "secondary" : "primary"}
                className="w-full justify-center mt-6"
                disabled={p.current}
                onClick={() => handleOpenUpgrade(p.name, p.price, p.priceNum)}
              >
                {p.current ? "Active Plan" : `Upgrade to ${p.name}`}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Buy credits */}
      <div>
        <h2 className="font-bold text-slate-900 text-base mb-4">Add-on Quota Top-up</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "100 Fraud Checks", price: "৳199", priceNum: 199, icon: <Zap size={14} /> },
            { label: "500 Fraud Checks", price: "৳799", priceNum: 799, icon: <Zap size={14} />, popular: true },
            { label: "500 Booking Credits", price: "৳499", priceNum: 499, icon: <Zap size={14} /> },
          ].map(c => (
            <Card key={c.label} className={`p-5 ${c.popular ? "border-indigo-300 bg-indigo-50/20 shadow-sm" : ""}`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-slate-900">{c.label}</p>
                {c.popular && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">Popular</span>}
              </div>
              <p className="text-2xl font-black text-slate-900 mb-4">{c.price}</p>
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-center"
                onClick={() => handleOpenBuyCredits(c.label, c.price, c.priceNum)}
              >
                {c.icon} Instant Top-up
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* bKash / Nagad Checkout Modal */}
      {selectedCheckoutItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setSelectedCheckoutItem(null)} />
          <Card className="relative z-10 w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-900 text-base">Checkout & Payment</h2>
                <p className="text-xs text-slate-500">{selectedCheckoutItem.title}</p>
              </div>
              <button onClick={() => setSelectedCheckoutItem(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl mb-4 border border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">Total Payable:</span>
              <span className="text-2xl font-black text-slate-900">{selectedCheckoutItem.price}</span>
            </div>

            <form onSubmit={handleConfirmPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "bkash", name: "bKash", color: "bg-pink-600 text-white" },
                    { id: "nagad", name: "Nagad", color: "bg-orange-600 text-white" },
                    { id: "card", name: "Card / Bank", color: "bg-indigo-600 text-white" },
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                        paymentMethod === m.id ? `${m.color} shadow-sm border-transparent` : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {paymentMethod === "card" ? "Card Number" : `${paymentMethod.toUpperCase()} Mobile Number`}
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={e => setAccountNumber(e.target.value)}
                  placeholder={paymentMethod === "card" ? "4111 2222 3333 4444" : "017XXXXXXXX"}
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {paymentMethod === "card" ? "CVV / Expiry" : `${paymentMethod.toUpperCase()} PIN`}
                </label>
                <input
                  type="password"
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  placeholder="••••"
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="secondary" size="sm" onClick={() => setSelectedCheckoutItem(null)}>Cancel</Button>
                <Button type="submit" size="sm" disabled={processing}>
                  {processing ? (
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...
                    </span>
                  ) : (
                    `Pay ${selectedCheckoutItem.price}`
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
