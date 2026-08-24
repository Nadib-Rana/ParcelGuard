import { useState } from "react";
import { Check, ChevronRight, Star, AlertTriangle, CheckCircle2, Printer, MapPin, X, QrCode } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Input, Select, Badge } from "../components/ui";

const steps = ["Customer Details", "Parcel Details", "Courier Selection", "Review & Confirm"];

const couriers = [
  { name: "Steadfast", days: "1–2 Days", charge: "৳110", cod: "1%", districts: 64, score: 5, recommended: true },
  { name: "Pathao Courier", days: "1–3 Days", charge: "৳120", cod: "1%", districts: 64, score: 4, recommended: false },
  { name: "RedX", days: "2–4 Days", charge: "৳130", cod: "1.2%", districts: 60, score: 4, recommended: false },
];

export default function BookParcel() {
  const [step, setStep] = useState(0);
  const [selectedCourier, setSelectedCourier] = useState(0);
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const navigate = useNavigate();

  const TRACKING_ID = "PG-102851";
  const riskShown = phone.length >= 11;

  if (success) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[70vh]">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={40} className="text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Parcel Booked! 🎉</h1>
          <p className="text-slate-500 mb-1">Your parcel has been successfully booked.</p>
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2 mt-2 mb-6">
            <span className="text-xs text-slate-500">Tracking ID:</span>
            <span className="font-mono font-bold text-indigo-700 text-sm">{TRACKING_ID}</span>
          </div>
          <div className="flex flex-col gap-2">
            <Button className="w-full justify-center" onClick={() => setShowLabel(true)}>
              <Printer size={14} /> Print Label
            </Button>
            <Button variant="secondary" className="w-full justify-center" onClick={() => navigate(`/tracking?id=${TRACKING_ID}`)}>
              <MapPin size={14} /> Track Parcel
            </Button>
            <Button variant="ghost" className="w-full justify-center" onClick={() => { setSuccess(false); setStep(0); }}>
              + Book Another Parcel
            </Button>
          </div>
        </div>

        {/* Print Label Modal */}
        {showLabel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60" onClick={() => setShowLabel(false)} />
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
              {/* Modal header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-900">Courier Label</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Printer size={12} /> Print
                  </button>
                  <button onClick={() => setShowLabel(false)} className="text-slate-400 hover:text-slate-600 p-1">
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Label preview */}
              <div className="p-5">
                <div className="border-2 border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
                  {/* Label header */}
                  <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm tracking-widest">PARCELGUARD</div>
                      <div className="text-slate-400 text-[10px]">Smart Courier Intelligence</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Courier</div>
                      <div className="font-bold text-sm">{couriers[selectedCourier].name}</div>
                    </div>
                  </div>

                  {/* Tracking ID barcode area */}
                  <div className="px-4 py-3 border-b border-dashed border-slate-300 text-center">
                    <div className="text-[10px] text-slate-500 mb-1">TRACKING ID</div>
                    <div className="font-bold text-xl tracking-widest text-slate-900">{TRACKING_ID}</div>
                    {/* Simulated barcode */}
                    <div className="flex items-center justify-center gap-px mt-2 h-8">
                      {Array.from({ length: 40 }).map((_, i) => (
                        <div key={i} className="bg-slate-900" style={{ width: `${[1,2,1,3,1,2,1,1,2,3][i % 10]}px`, height: "100%" }} />
                      ))}
                    </div>
                  </div>

                  {/* Addresses */}
                  <div className="grid grid-cols-2 divide-x divide-dashed divide-slate-300 border-b border-dashed border-slate-300">
                    <div className="px-3 py-3">
                      <div className="text-[9px] text-slate-400 font-sans uppercase tracking-wide mb-1">From</div>
                      <div className="font-bold text-slate-900 text-[11px] font-sans">Rahman Store</div>
                      <div className="text-[10px] text-slate-600 font-sans mt-0.5">Mirpur-10, Dhaka</div>
                      <div className="text-[10px] text-slate-600 font-sans">01711-234567</div>
                    </div>
                    <div className="px-3 py-3">
                      <div className="text-[9px] text-slate-400 font-sans uppercase tracking-wide mb-1">To</div>
                      <div className="font-bold text-slate-900 text-[11px] font-sans">Rahim Uddin</div>
                      <div className="text-[10px] text-slate-600 font-sans mt-0.5">Road 5, Mirpur-10</div>
                      <div className="text-[10px] text-slate-600 font-sans">Dhaka · 01711-234567</div>
                    </div>
                  </div>

                  {/* COD + QR */}
                  <div className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <div className="text-[9px] text-slate-400 uppercase tracking-wide">COD Amount</div>
                      <div className="text-2xl font-bold text-slate-900">৳1,500</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Collect on delivery</div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <QrCode size={44} className="text-slate-800" />
                      <div className="text-[9px] text-slate-400">Scan to track</div>
                    </div>
                  </div>
                </div>

                <p className="text-center text-xs text-slate-400 mt-3">
                  4×6 inch · Use a thermal printer for best results
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Book New Parcel</h1>
        <p className="text-sm text-slate-500 mt-0.5">Fill in the details below to book a new parcel.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-0 flex-shrink-0">
            <button
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                i === step ? "text-indigo-700" : i < step ? "text-emerald-600 cursor-pointer" : "text-slate-400 cursor-default"
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                i < step ? "bg-emerald-500 text-white" : i === step ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"
              }`}>
                {i < step ? <Check size={12} /> : i + 1}
              </span>
              <span className="hidden sm:block">{s}</span>
            </button>
            {i < steps.length - 1 && <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />}
          </div>
        ))}
      </div>

      {/* Step 0: Customer Details */}
      {step === 0 && (
        <Card className="p-6">
          <h2 className="font-semibold text-slate-900 mb-5">Customer Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Customer Name" placeholder="e.g. Rahim Uddin" />
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label>
              <div className="flex gap-2">
                <span className="flex items-center px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm text-slate-700 flex-shrink-0">🇧🇩 +880</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="01711-234567"
                  className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                />
              </div>
              {riskShown && (
                <div className="mt-2 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                  <CheckCircle2 size={12} className="text-emerald-500" />
                  <span className="font-medium">Safe Customer</span>
                  <span className="text-emerald-600">· Delivery success rate: 92%</span>
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <Input label="Full Address" placeholder="House/Flat number, Road, Area" />
            </div>
            <Select label="District">
              <option>Select District</option>
              <option>Dhaka</option>
              <option>Chattogram</option>
              <option>Sylhet</option>
              <option>Rajshahi</option>
              <option>Khulna</option>
            </Select>
            <Input label="Area / Thana" placeholder="e.g. Mirpur-10" />
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Address Notes</label>
              <textarea
                rows={2}
                placeholder="Landmark, gate color, floor, etc."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={() => setStep(1)}>Continue <ChevronRight size={14} /></Button>
          </div>
        </Card>
      )}

      {/* Step 1: Parcel Details */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="md:col-span-2 p-6">
            <h2 className="font-semibold text-slate-900 mb-5">Parcel Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Product Name" placeholder="e.g. Cotton Shirt" />
              <Select label="Product Category">
                <option>Fashion & Clothing</option>
                <option>Electronics</option>
                <option>Footwear</option>
                <option>Beauty & Personal Care</option>
                <option>Food & Grocery</option>
              </Select>
              <Select label="Parcel Weight">
                <option>Up to 500g</option>
                <option>500g – 1kg</option>
                <option>1kg – 2kg</option>
                <option>2kg – 5kg</option>
              </Select>
              <Select label="Parcel Type">
                <option>Standard</option>
                <option>Fragile</option>
                <option>Liquid</option>
                <option>Documents</option>
              </Select>
              <Input label="COD Amount (৳)" placeholder="e.g. 1500" />
              <Input label="Advance Payment (৳)" placeholder="e.g. 0" />
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Special Instructions</label>
                <textarea rows={2} placeholder="Handle with care, call before delivery, etc." className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 resize-none" />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <Button variant="secondary" onClick={() => setStep(0)}>Back</Button>
              <Button onClick={() => setStep(2)}>Continue <ChevronRight size={14} /></Button>
            </div>
          </Card>

          {/* Live summary */}
          <Card className="p-5 h-fit">
            <h3 className="font-semibold text-slate-900 mb-4">Order Summary</h3>
            <div className="space-y-3">
              {[
                { label: "COD Amount", value: "৳1,500" },
                { label: "Delivery Charge", value: "৳120" },
                { label: "COD Fee (1%)", value: "−৳15" },
              ].map(r => (
                <div key={r.label} className="flex justify-between text-sm">
                  <span className="text-slate-500">{r.label}</span>
                  <span className="font-medium text-slate-900">{r.value}</span>
                </div>
              ))}
              <div className="border-t border-slate-200 pt-3 flex justify-between">
                <span className="text-sm font-semibold text-slate-900">You Collect</span>
                <span className="text-base font-bold text-emerald-600">৳1,365</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Step 2: Courier Selection */}
      {step === 2 && (
        <div className="space-y-4">
          <Card className="p-4 bg-indigo-50 border-indigo-200">
            <p className="text-xs font-semibold text-indigo-700">Couriers available for Dhaka → Dhaka delivery · COD ৳1,500</p>
          </Card>
          {couriers.map((c, i) => (
            <div
              key={c.name}
              onClick={() => setSelectedCourier(i)}
              className={`cursor-pointer rounded-xl border-2 p-5 transition-all ${selectedCourier === i ? "border-indigo-500 bg-indigo-50/50" : "border-slate-200 bg-white hover:border-slate-300"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0 ${
                    i === 0 ? "bg-emerald-600" : i === 1 ? "bg-indigo-600" : "bg-red-600"
                  }`}>
                    {c.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{c.name}</h3>
                      {c.recommended && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                          <Star size={10} fill="currentColor" /> Best Choice
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Star key={si} size={11} className={si < c.score ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedCourier === i ? "border-indigo-600 bg-indigo-600" : "border-slate-300"}`}>
                  {selectedCourier === i && <Check size={11} className="text-white" />}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-4">
                {[
                  { label: "Delivery Time", value: c.days },
                  { label: "Delivery Charge", value: c.charge },
                  { label: "COD Charge", value: c.cod },
                  { label: "Coverage", value: `${c.districts} Districts` },
                ].map(d => (
                  <div key={d.label}>
                    <p className="text-xs text-slate-500">{d.label}</p>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">{d.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="flex justify-between">
            <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => setStep(3)}>Continue <ChevronRight size={14} /></Button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Confirm */}
      {step === 3 && (
        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="font-semibold text-slate-900 mb-4">Order Review</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { title: "Customer Information", rows: [["Name", "Rahim Uddin"], ["Phone", "+880 1711-234567"], ["Address", "Road 5, Mirpur-10, Dhaka"], ["District", "Dhaka"]] },
                { title: "Parcel Information", rows: [["Product", "Cotton Shirt"], ["Weight", "500g – 1kg"], ["Type", "Standard"], ["COD", "৳1,500"]] },
                { title: "Courier", rows: [["Provider", couriers[selectedCourier].name], ["Delivery Time", couriers[selectedCourier].days], ["Charge", couriers[selectedCourier].charge], ["Coverage", "64 Districts"]] },
                { title: "Payment Summary", rows: [["COD Amount", "৳1,500"], ["Delivery Charge", couriers[selectedCourier].charge], ["COD Fee", "−৳15"], ["You Collect", "৳1,365"]] },
              ].map(s => (
                <div key={s.title} className="bg-slate-50 rounded-xl p-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">{s.title}</h3>
                  <div className="space-y-2">
                    {s.rows.map(([l, v]) => (
                      <div key={l} className="flex justify-between text-sm">
                        <span className="text-slate-500">{l}</span>
                        <span className="font-medium text-slate-900">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* Risk section */}
            <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2">Risk Assessment</h3>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">12</div>
                <div>
                  <p className="text-sm font-semibold text-emerald-700">✅ Safe Customer</p>
                  <p className="text-xs text-emerald-600">92% delivery success rate · 24 orders history</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <input type="checkbox" id="agree" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="accent-indigo-600" />
              <label htmlFor="agree" className="text-sm text-slate-700 cursor-pointer">I have reviewed the parcel information and confirm everything is correct.</label>
            </div>
          </Card>
          <div className="flex justify-between">
            <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
            <Button disabled={!agreed} onClick={() => setSuccess(true)}>
              <Check size={14} /> Confirm & Book Parcel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
