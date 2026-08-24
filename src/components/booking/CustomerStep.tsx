import { ChevronRight } from "lucide-react";
import { Card, Button } from "../ui";

interface Props {
  customerName: string;
  setCustomerName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  district: string;
  setDistrict: (v: string) => void;
  area: string;
  setArea: (v: string) => void;
  addressNotes: string;
  setAddressNotes: (v: string) => void;
  customerRisk: "Safe" | "Moderate" | "High Risk";
  riskScore: number;
  onNext: () => void;
}

export default function CustomerStep({
  customerName, setCustomerName,
  phone, setPhone,
  address, setAddress,
  district, setDistrict,
  area, setArea,
  addressNotes, setAddressNotes,
  customerRisk, riskScore,
  onNext,
}: Props) {
  return (
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
        <Button onClick={onNext}>
          Continue to Parcel Details <ChevronRight size={14} />
        </Button>
      </div>
    </Card>
  );
}
