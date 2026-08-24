import { Check } from "lucide-react";
import { Card, Button } from "../ui";
import type { CourierOption } from "./CourierStep";

interface Props {
  customerName: string;
  phone: string;
  address: string;
  district: string;
  area: string;
  productName: string;
  category: string;
  weight: string;
  specialInstructions: string;
  selectedCourier: CourierOption;
  deliveryCharge: number;
  codFee: number;
  codAmount: number;
  merchantCollection: number;
  customerRisk: "Safe" | "Moderate" | "High Risk";
  riskScore: number;
  agreed: boolean;
  setAgreed: (v: boolean) => void;
  onBack: () => void;
  onConfirm: () => void;
}

export default function ReviewStep({
  customerName, phone, address, district, area,
  productName, category, weight, specialInstructions,
  selectedCourier, deliveryCharge, codFee, codAmount, merchantCollection,
  customerRisk, riskScore, agreed, setAgreed,
  onBack, onConfirm,
}: Props) {
  return (
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

        {/* Checkbox */}
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
        <Button variant="secondary" onClick={onBack}>Back</Button>
        <Button disabled={!agreed} onClick={onConfirm}>
          <Check size={14} /> Confirm & Book Parcel
        </Button>
      </div>
    </div>
  );
}
