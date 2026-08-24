import { useState, useEffect } from "react";
import { Check, ChevronRight, Star, AlertTriangle, CheckCircle2, Printer, MapPin, X, QrCode } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import { Card, Button, Input, Select, Badge } from "../components/ui";

const steps = ["Customer Details", "Parcel Details", "Courier Selection", "Review & Confirm"];

const couriers = [
  { name: "Steadfast" as const, days: "1–2 Days", charge: 110, codRate: 0.01, districts: 64, score: 5, recommended: true },
  { name: "Pathao" as const, days: "1–3 Days", charge: 120, codRate: 0.01, districts: 64, score: 4, recommended: false },
  { name: "RedX" as const, days: "2–4 Days", charge: 130, codRate: 0.012, districts: 60, score: 4, recommended: false },
];

export default function BookParcel() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addParcel, checkPhoneRisk, settings } = useData();

  const [step, setStep] = useState(0);
  const [selectedCourierIdx, setSelectedCourierIdx] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [bookedParcelId, setBookedParcelId] = useState<string | null>(null);
  const [showLabel, setShowLabel] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState("Rahim Uddin");
  const [phone, setPhone] = useState(searchParams.get("phone") || "01711234567");
  const [address, setAddress] = useState("House 12, Road 5, Mirpur-10");
  const [district, setDistrict] = useState("Dhaka");
  const [area, setArea] = useState("Mirpur-10");
  const [addressNotes, setAddressNotes] = useState("");

  const [productName, setProductName] = useState("Cotton Casual Shirt");
  const [category, setCategory] = useState("Fashion & Clothing");
  const [weight, setWeight] = useState("Up to 500g");
  const [parcelType, setParcelType] = useState("Standard");
  const [codAmount, setCodAmount] = useState<number>(1500);
  const [advancePayment, setAdvancePayment] = useState<number>(0);
  const [specialInstructions, setSpecialInstructions] = useState("Call customer before delivery");

  // Dynamic Risk evaluation
  const [customerRisk, setCustomerRisk] = useState<"Safe" | "Moderate" | "High Risk">("Safe");
  const [riskScore, setRiskScore] = useState(12);

  useEffect(() => {
    if (phone.length >= 10) {
      const res = checkPhoneRisk(phone, customerName);
      setCustomerRisk(res.risk);
      setRiskScore(res.score);
    }
  }, [phone]);

  const selectedCourier = couriers[selectedCourierIdx];
  const deliveryCharge = district === "Dhaka" ? selectedCourier.charge : selectedCourier.charge + 40;
  const codFee = Math.round(codAmount * selectedCourier.codRate);
  const merchantCollection = Math.max(0, codAmount - deliveryCharge - codFee + advancePayment);

  const handleConfirmBooking = () => {
    const newParcel = addParcel({
      customer: customerName || "Customer",
      phone: phone || "01700000000",
      address: address || "Dhaka",
      district: district || "Dhaka",
      area: area || "",
      product: productName || "General Item",
      category,
      weight,
      courier: selectedCourier.name,
      cod: codAmount || 0,
      charge: deliveryCharge,
      advance: advancePayment || 0,
      risk: customerRisk,
      status: "Pending Pickup",
      notes: specialInstructions,
      agentName: selectedCourier.name === "Steadfast" ? "Md. Hasan Ali" : "Tanvir Ahmed",
      agentPhone: "01700-123456",
    });

    setBookedParcelId(newParcel.id);
  };

  if (bookedParcelId) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[70vh]">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={40} className="text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Parcel Booked! 🎉</h1>
          <p className="text-slate-500 mb-1">Your parcel has been successfully registered with {selectedCourier.name}.</p>
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-2 mt-2 mb-6">
            <span className="text-xs text-slate-500">Tracking ID:</span>
            <span className="font-mono font-bold text-indigo-700 text-sm">{bookedParcelId}</span>
          </div>
          <div className="flex flex-col gap-2">
            <Button className="w-full justify-center" onClick={() => setShowLabel(true)}>
              <Printer size={14} /> Print Courier Label
            </Button>
            <Button variant="secondary" className="w-full justify-center" onClick={() => navigate(`/tracking?id=${bookedParcelId}`)}>
              <MapPin size={14} /> Track Parcel
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-center"
              onClick={() => {
                setBookedParcelId(null);
                setStep(0);
              }}
            >
              + Book Another Parcel
            </Button>
          </div>
        </div>

        {/* Print Label Modal */}
        {showLabel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60" onClick={() => setShowLabel(false)} />
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-900">Courier Shipping Label</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Printer size={12} /> Print Label
                  </button>
                  <button onClick={() => setShowLabel(false)} className="text-slate-400 hover:text-slate-600 p-1">
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Label preview */}
              <div className="p-5">
                <div className="border-2 border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
                  <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm tracking-widest uppercase">PARCELGUARD</div>
                      <div className="text-slate-400 text-[10px]">{settings.merchantName}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Courier</div>
                      <div className="font-bold text-sm text-emerald-400">{selectedCourier.name}</div>
                    </div>
                  </div>

                  <div className="px-4 py-3 border-b border-dashed border-slate-300 text-center bg-slate-50">
                    <div className="text-[10px] text-slate-500 mb-1">TRACKING NUMBER</div>
                    <div className="font-bold text-xl tracking-widest text-slate-900">{bookedParcelId}</div>
                    <div className="flex items-center justify-center gap-px mt-2 h-7">
                      {Array.from({ length: 40 }).map((_, i) => (
                        <div key={i} className="bg-slate-900" style={{ width: `${[1, 2, 1, 3, 1, 2, 1, 1, 2, 3][i % 10]}px`, height: "100%" }} />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 divide-x divide-dashed divide-slate-300 border-b border-dashed border-slate-300">
                    <div className="p-3">
                      <div className="text-[9px] text-slate-400 font-sans uppercase font-bold">Sender</div>
                      <div className="font-bold text-slate-900 text-[11px] font-sans mt-0.5">{settings.merchantName}</div>
                      <div className="text-[10px] text-slate-600 font-sans">{settings.businessAddress}</div>
                      <div className="text-[10px] text-slate-600 font-sans mt-0.5 font-bold">📞 {settings.phone}</div>
                    </div>
                    <div className="p-3">
                      <div className="text-[9px] text-indigo-600 font-sans uppercase font-bold">Recipient</div>
                      <div className="font-bold text-slate-900 text-[11px] font-sans mt-0.5">{customerName}</div>
                      <div className="text-[10px] text-slate-600 font-sans">{address}</div>
                      <div className="text-[10px] text-slate-900 font-sans font-bold mt-0.5">{district} · 📞 {phone}</div>
                    </div>
                  </div>

                  <div className="px-4 py-3 flex items-center justify-between bg-white">
                    <div>
                      <div className="text-[9px] text-slate-400 uppercase tracking-wide">COD Collection</div>
                      <div className="text-2xl font-bold text-slate-900">৳{codAmount.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Item: {productName}</div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <QrCode size={40} className="text-slate-800" />
                      <div className="text-[8px] text-slate-400">Scan to track</div>
                    </div>
                  </div>
                </div>
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
        <p className="text-sm text-slate-500 mt-0.5">Create and dispatch single orders with live courier rate comparison.</p>
      </div>

      {/* Stepper Header */}
      <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-0 flex-shrink-0">
            <button
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                i === step ? "text-indigo-700 font-bold" : i < step ? "text-emerald-600 cursor-pointer" : "text-slate-400 cursor-default"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  i < step ? "bg-emerald-500 text-white" : i === step ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "bg-slate-200 text-slate-500"
                }`}
              >
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
          <h2 className="font-semibold text-slate-900 mb-5">Step 1 — Customer & Destination Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="e.g. Rahim Uddin"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label>
              <div className="flex gap-2">
                <span className="flex items-center px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm text-slate-700 flex-shrink-0">🇧🇩 +880</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="01711234567"
                  className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
                />
              </div>
              {phone.length >= 10 && (
                <div
                  className={`mt-2 flex items-center gap-2 text-xs rounded-lg px-3 py-2 border ${
                    customerRisk === "High Risk"
                      ? "text-red-700 bg-red-50 border-red-200"
                      : customerRisk === "Moderate"
                      ? "text-amber-700 bg-amber-50 border-amber-200"
                      : "text-emerald-700 bg-emerald-50 border-emerald-200"
                  }`}
                >
                  <span className="font-bold">{customerRisk === "High Risk" ? "🔴 High Risk" : customerRisk === "Moderate" ? "🟡 Moderate Risk" : "🟢 Safe Customer"}</span>
                  <span>· Fraud Score: {riskScore}/100</span>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Delivery Address</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="House/Flat number, Road, Area"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">District</label>
              <select
                value={district}
                onChange={e => setDistrict(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {["Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna", "Barishal", "Rangpur", "Mymensingh", "Bogura", "Cumilla", "Gazipur", "Narayanganj"].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Area / Thana</label>
              <input
                type="text"
                value={area}
                onChange={e => setArea(e.target.value)}
                placeholder="e.g. Mirpur-10"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Address Notes & Landmark</label>
              <textarea
                rows={2}
                value={addressNotes}
                onChange={e => setAddressNotes(e.target.value)}
                placeholder="Landmark, gate color, floor, or special delivery instructions..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={() => setStep(1)}>
              Continue to Parcel Details <ChevronRight size={14} />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 1: Parcel Details */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="md:col-span-2 p-6">
            <h2 className="font-semibold text-slate-900 mb-5">Step 2 — Parcel & Pricing Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Product Name</label>
                <input
                  type="text"
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  placeholder="e.g. Cotton Shirt"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Product Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none"
                >
                  <option>Fashion & Clothing</option>
                  <option>Electronics & Gadgets</option>
                  <option>Footwear</option>
                  <option>Beauty & Cosmetics</option>
                  <option>Groceries & Food</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Parcel Weight</label>
                <select
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none"
                >
                  <option>Up to 500g</option>
                  <option>500g – 1kg</option>
                  <option>1kg – 2kg</option>
                  <option>2kg – 5kg</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Parcel Type</label>
                <select
                  value={parcelType}
                  onChange={e => setParcelType(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none"
                >
                  <option>Standard</option>
                  <option>Fragile</option>
                  <option>Liquid</option>
                  <option>Documents</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">COD Amount (৳ BDT)</label>
                <input
                  type="number"
                  value={codAmount}
                  onChange={e => setCodAmount(Number(e.target.value) || 0)}
                  placeholder="e.g. 1500"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Advance Payment Received (৳ BDT)</label>
                <input
                  type="number"
                  value={advancePayment}
                  onChange={e => setAdvancePayment(Number(e.target.value) || 0)}
                  placeholder="e.g. 0"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Special Instructions for Courier</label>
                <textarea
                  rows={2}
                  value={specialInstructions}
                  onChange={e => setSpecialInstructions(e.target.value)}
                  placeholder="Call before delivery, handle with care..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="secondary" onClick={() => setStep(0)}>Back</Button>
              <Button onClick={() => setStep(2)}>
                Continue to Courier Selection <ChevronRight size={14} />
              </Button>
            </div>
          </Card>

          {/* Dynamic Financial Summary Card */}
          <Card className="p-5 h-fit bg-slate-50/50 border-indigo-100">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Live Settlement Estimate</h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">COD Collection</span>
                <span className="font-bold text-slate-900">৳{codAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Est. Delivery Fee ({district})</span>
                <span className="font-medium text-slate-700">−৳{deliveryCharge}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">COD Charge ({selectedCourier.codRate * 100}%)</span>
                <span className="font-medium text-slate-700">−৳{codFee}</span>
              </div>
              {advancePayment > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Advance Deducted</span>
                  <span>+৳{advancePayment}</span>
                </div>
              )}
              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-900 uppercase">Estimated Payout</span>
                <span className="text-lg font-black text-emerald-600">৳{merchantCollection.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Step 2: Courier Selection */}
      {step === 2 && (
        <div className="space-y-4">
          <Card className="p-4 bg-indigo-50 border-indigo-200 flex items-center justify-between">
            <p className="text-xs font-semibold text-indigo-800">
              Comparing 3 couriers for {district} delivery · COD ৳{codAmount.toLocaleString()}
            </p>
            <Badge variant="indigo">Automatic Multi-Courier Rate</Badge>
          </Card>

          {couriers.map((c, i) => {
            const charge = district === "Dhaka" ? c.charge : c.charge + 40;
            return (
              <div
                key={c.name}
                onClick={() => setSelectedCourierIdx(i)}
                className={`cursor-pointer rounded-xl border-2 p-5 transition-all ${
                  selectedCourierIdx === i ? "border-indigo-600 bg-indigo-50/40 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0 ${
                        i === 0 ? "bg-emerald-600" : i === 1 ? "bg-indigo-600" : "bg-red-600"
                      }`}
                    >
                      {c.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900">{c.name}</h3>
                        {c.recommended && (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
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
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedCourierIdx === i ? "border-indigo-600 bg-indigo-600" : "border-slate-300"
                    }`}
                  >
                    {selectedCourierIdx === i && <Check size={11} className="text-white" />}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-4 pt-3 border-t border-slate-100">
                  <div>
                    <p className="text-[11px] text-slate-500">Delivery Time</p>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">{c.days}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500">Delivery Charge</p>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">৳{charge}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500">COD Fee</p>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">{c.codRate * 100}%</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500">Coverage</p>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">{c.districts} Districts</p>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex justify-between">
            <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => setStep(3)}>
              Review Order <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Confirm */}
      {step === 3 && (
        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="font-bold text-slate-900 mb-4">Step 4 — Final Booking Review</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2.5">Customer Details</h3>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-slate-500">Name</span><span className="font-semibold text-slate-900">{customerName}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Phone</span><span className="font-mono font-semibold text-slate-900">{phone}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Address</span><span className="font-medium text-slate-900">{address}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">District</span><span className="font-medium text-slate-900">{district} ({area})</span></div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2.5">Parcel Details</h3>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-slate-500">Product</span><span className="font-semibold text-slate-900">{productName}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Category</span><span className="font-medium text-slate-900">{category}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Weight</span><span className="font-medium text-slate-900">{weight}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Instructions</span><span className="font-medium text-slate-900">{specialInstructions || "None"}</span></div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2.5">Courier Selection</h3>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-slate-500">Provider</span><span className="font-bold text-indigo-700">{selectedCourier.name}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Est. Time</span><span className="font-medium text-slate-900">{selectedCourier.days}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Delivery Charge</span><span className="font-medium text-slate-900">৳{deliveryCharge}</span></div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2.5">Settlement Summary</h3>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-slate-500">COD Total</span><span className="font-bold text-slate-900">৳{codAmount.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Delivery Fee</span><span className="text-slate-700">−৳{deliveryCharge}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">COD Fee</span><span className="text-slate-700">−৳{codFee}</span></div>
                  <div className="border-t border-slate-200 pt-1.5 flex justify-between font-bold text-emerald-700">
                    <span>You Receive</span>
                    <span>৳{merchantCollection.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Badge */}
            <div
              className={`mt-4 rounded-xl p-3.5 border flex items-center gap-3 ${
                customerRisk === "High Risk"
                  ? "bg-red-50 border-red-200 text-red-800"
                  : customerRisk === "Moderate"
                  ? "bg-amber-50 border-amber-200 text-amber-800"
                  : "bg-emerald-50 border-emerald-200 text-emerald-800"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0">
                {riskScore}
              </div>
              <div className="text-xs">
                <p className="font-bold">{customerRisk} Customer Profile</p>
                <p className="opacity-90">{customerRisk === "High Risk" ? "Ensure advance delivery charge is verified before handing parcel to rider." : "Verified delivery history across merchant network."}</p>
              </div>
            </div>

            {/* Confirmation Checkbox */}
            <div className="mt-5 flex items-center gap-2">
              <input
                type="checkbox"
                id="agreeReview"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="accent-indigo-600 w-4 h-4"
              />
              <label htmlFor="agreeReview" className="text-xs text-slate-700 cursor-pointer font-medium">
                I have reviewed the parcel details, shipping address, and COD charges for dispatch.
              </label>
            </div>
          </Card>

          <div className="flex justify-between">
            <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
            <Button disabled={!agreed} onClick={handleConfirmBooking}>
              <Check size={14} /> Confirm & Book Parcel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
