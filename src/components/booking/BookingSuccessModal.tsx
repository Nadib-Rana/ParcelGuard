import { useState } from "react";
import { CheckCircle2, Printer, MapPin, X, QrCode } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui";
import type { UserSettings } from "../../types";

interface Props {
  bookedParcelId: string;
  customerName: string;
  phone: string;
  address: string;
  district: string;
  productName: string;
  codAmount: number;
  selectedCourierName: string;
  settings: UserSettings;
  onReset: () => void;
}

export default function BookingSuccessModal({
  bookedParcelId,
  customerName,
  phone,
  address,
  district,
  productName,
  codAmount,
  selectedCourierName,
  settings,
  onReset,
}: Props) {
  const navigate = useNavigate();
  const [showLabel, setShowLabel] = useState(false);

  return (
    <div className="p-6 flex items-center justify-center min-h-[70vh]">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={40} className="text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Parcel Booked! 🎉</h1>
        <p className="text-slate-500 mb-1">Your parcel has been successfully registered with {selectedCourierName}.</p>
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
          <Button variant="ghost" className="w-full justify-center" onClick={onReset}>
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
                    <div className="font-bold text-sm text-emerald-400">{selectedCourierName}</div>
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
