import { ChevronRight } from "lucide-react";
import { Card, Button } from "../ui";

interface Props {
  productName: string;
  setProductName: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  weight: string;
  setWeight: (v: string) => void;
  parcelType: string;
  setParcelType: (v: string) => void;
  codAmount: number;
  setCodAmount: (v: number) => void;
  advancePayment: number;
  setAdvancePayment: (v: number) => void;
  specialInstructions: string;
  setSpecialInstructions: (v: string) => void;
  district: string;
  deliveryCharge: number;
  codFee: number;
  merchantCollection: number;
  onBack: () => void;
  onNext: () => void;
}

export default function ParcelStep({
  productName, setProductName,
  category, setCategory,
  weight, setWeight,
  parcelType, setParcelType,
  codAmount, setCodAmount,
  advancePayment, setAdvancePayment,
  specialInstructions, setSpecialInstructions,
  district, deliveryCharge, codFee, merchantCollection,
  onBack, onNext,
}: Props) {
  return (
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
          <Button variant="secondary" onClick={onBack}>Back</Button>
          <Button onClick={onNext}>
            Continue to Courier Selection <ChevronRight size={14} />
          </Button>
        </div>
      </Card>

      {/* Live Financial Summary */}
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
            <span className="text-slate-500">COD Fee</span>
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
  );
}
