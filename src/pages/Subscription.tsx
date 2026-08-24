import { useState } from "react";
import { Zap, ShieldCheck } from "lucide-react";
import { Card, Button } from "../components/ui";
import PlanCard, { type PlanItem } from "../components/subscription/PlanCard";
import CheckoutModal from "../components/subscription/CheckoutModal";

const defaultPlans: PlanItem[] = [
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
    setSelectedCheckoutItem({ title: `${planName} Plan Subscription`, price, amount: priceNum });
  };

  const handleOpenBuyCredits = (creditLabel: string, price: string, priceNum: number) => {
    setSelectedCheckoutItem({ title: creditLabel, price, amount: priceNum });
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      if (selectedCheckoutItem?.title.includes("Plan")) {
        const targetPlan = selectedCheckoutItem.title.split(" ")[0];
        setPlans(prev => prev.map(p => ({ ...p, current: p.name === targetPlan })));
        setFraudChecksRemaining(prev => prev + 1000);
        setBookingsRemaining(prev => prev + 500);
        setSuccessMsg(`Successfully upgraded to ${targetPlan} Plan!`);
      } else {
        const added = parseInt(selectedCheckoutItem?.title || "100") || 100;
        if (selectedCheckoutItem?.title.includes("Fraud")) setFraudChecksRemaining(prev => prev + added);
        else setBookingsRemaining(prev => prev + added);
        setSuccessMsg(`Payment received! ${selectedCheckoutItem?.title} added.`);
      }
      setSelectedCheckoutItem(null);
      setAccountNumber("");
      setPin("");
      setTimeout(() => setSuccessMsg(""), 3500);
    }, 1000);
  };

  return (
    <div className="p-6 space-y-6 max-w-screen-xl relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Subscription & Credits</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your monthly subscription tier, fraud check quota, and dispatch credits.</p>
        </div>
        {successMsg && (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-xl text-xs font-bold">
            <ShieldCheck size={16} /> {successMsg}
          </div>
        )}
      </div>

      {/* Current plan card */}
      <Card className="p-6 border-indigo-200 bg-indigo-50/30">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">Current Active Plan</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">{currentPlan.name} Plan</h2>
            <p className="text-sm text-slate-500 mt-0.5">{currentPlan.price} / month · Renews Sep 1, 2026</p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => handleOpenBuyCredits("500 Fraud Checks", "৳799", 799)}>
            Add Extra Credits
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between text-xs mb-2">
              <span className="font-semibold text-slate-700">Fraud Checks Balance</span>
              <span className="font-bold text-slate-900">{currentPlan.checks - fraudChecksRemaining} / {currentPlan.checks}</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${Math.min(100, ((currentPlan.checks - fraudChecksRemaining) / currentPlan.checks) * 100)}%` }} />
            </div>
            <p className="text-xs font-bold text-emerald-600 mt-1.5">{fraudChecksRemaining} checks remaining</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between text-xs mb-2">
              <span className="font-semibold text-slate-700">Parcel Bookings Balance</span>
              <span className="font-bold text-slate-900">{currentPlan.bookings - bookingsRemaining} / {currentPlan.bookings}</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, ((currentPlan.bookings - bookingsRemaining) / currentPlan.bookings) * 100)}%` }} />
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
            <PlanCard key={p.name} plan={p} onUpgrade={handleOpenUpgrade} />
          ))}
        </div>
      </div>

      {/* Buy credits */}
      <div>
        <h2 className="font-bold text-slate-900 text-base mb-4">Add-on Quota Top-up</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "100 Fraud Checks", price: "৳199", priceNum: 199 },
            { label: "500 Fraud Checks", price: "৳799", priceNum: 799, popular: true },
            { label: "500 Booking Credits", price: "৳499", priceNum: 499 },
          ].map(c => (
            <Card key={c.label} className="p-5">
              <p className="text-sm font-bold text-slate-900">{c.label}</p>
              <p className="text-2xl font-black text-slate-900 my-2">{c.price}</p>
              <Button variant="secondary" size="sm" className="w-full justify-center" onClick={() => handleOpenBuyCredits(c.label, c.price, c.priceNum)}>
                <Zap size={14} /> Instant Top-up
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {selectedCheckoutItem && (
        <CheckoutModal
          selectedCheckoutItem={selectedCheckoutItem}
          onClose={() => setSelectedCheckoutItem(null)}
          onConfirmPayment={handleConfirmPayment}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          accountNumber={accountNumber}
          setAccountNumber={setAccountNumber}
          pin={pin}
          setPin={setPin}
          processing={processing}
        />
      )}
    </div>
  );
}
