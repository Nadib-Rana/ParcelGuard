import { QrCode } from "lucide-react";
import type { Parcel, UserSettings } from "../../types";

interface Props {
  parcel: Parcel;
  format: "4x6" | "100x150" | "a4";
  settings: UserSettings;
}

export default function ShippingLabel({ parcel, format, settings }: Props) {
  return (
    <div
      className={`bg-white border-2 border-slate-800 rounded-2xl overflow-hidden shadow-sm font-mono mx-auto print:shadow-none print:border-2 print:border-black print:page-break-after-always ${
        format === "4x6" ? "max-w-md" : format === "100x150" ? "max-w-sm" : "max-w-xl"
      }`}
    >
      {/* Label Header */}
      <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between print:bg-black print:text-white">
        <div>
          <div className="font-bold text-base tracking-widest uppercase">PARCELGUARD</div>
          <div className="text-[10px] text-slate-400 font-sans tracking-wide">Smart Courier Intelligence · Merchant Dispatch</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-400 uppercase font-sans">Courier Partner</div>
          <div className="font-bold text-sm text-emerald-400 uppercase">{parcel.courier}</div>
        </div>
      </div>

      {/* Tracking Barcode Area */}
      <div className="px-5 py-4 border-b-2 border-dashed border-slate-300 text-center bg-slate-50/50">
        <div className="text-[10px] font-sans font-semibold text-slate-500 uppercase tracking-wider mb-1">
          PARCEL TRACKING ID
        </div>
        <div className="font-bold text-2xl tracking-widest text-slate-900">{parcel.id}</div>

        {/* Barcode */}
        <div className="flex items-center justify-center gap-0.5 mt-2 h-10 px-4">
          {Array.from({ length: 48 }).map((_, i) => (
            <div
              key={i}
              className="bg-slate-900"
              style={{
                width: `${[2, 3, 1, 4, 1, 2, 3, 1, 1, 2, 4, 1][i % 12]}px`,
                height: "100%",
              }}
            />
          ))}
        </div>
      </div>

      {/* Merchant & Customer Address Row */}
      <div className="grid grid-cols-2 divide-x-2 divide-dashed divide-slate-300 border-b-2 border-dashed border-slate-300">
        {/* From Section */}
        <div className="p-4 bg-white">
          <div className="text-[10px] text-slate-400 font-sans uppercase font-bold tracking-wider mb-1.5">
            FROM (SENDER)
          </div>
          <div className="font-bold text-slate-900 text-xs font-sans">{settings.merchantName}</div>
          <div className="text-[11px] text-slate-600 font-sans mt-0.5">{settings.businessAddress}</div>
          <div className="text-[11px] text-slate-800 font-sans font-semibold mt-1">📞 {settings.phone}</div>
        </div>

        {/* To Section */}
        <div className="p-4 bg-white">
          <div className="text-[10px] text-indigo-600 font-sans uppercase font-bold tracking-wider mb-1.5">
            TO (RECIPIENT)
          </div>
          <div className="font-bold text-slate-900 text-xs font-sans">{parcel.customer}</div>
          <div className="text-[11px] text-slate-700 font-sans mt-0.5 font-medium">{parcel.address}</div>
          <div className="text-[11px] text-slate-900 font-sans font-bold mt-0.5">District: {parcel.district}</div>
          <div className="text-[11px] text-slate-900 font-sans font-bold mt-1">📞 {parcel.phone}</div>
        </div>
      </div>

      {/* Parcel Details */}
      <div className="px-5 py-3 border-b-2 border-dashed border-slate-300 bg-slate-50/50 flex items-center justify-between text-xs font-sans">
        <div>
          <span className="text-slate-500">Item: </span>
          <span className="font-semibold text-slate-900">{parcel.product}</span>
        </div>
        <div>
          <span className="text-slate-500">Weight: </span>
          <span className="font-semibold text-slate-900">{parcel.weight || "500g"}</span>
        </div>
        <div>
          <span className="text-slate-500">Date: </span>
          <span className="font-semibold text-slate-900">{parcel.date}</span>
        </div>
      </div>

      {/* COD & QR */}
      <div className="p-5 flex items-center justify-between bg-white">
        <div>
          <div className="text-[10px] text-slate-400 font-sans uppercase font-bold tracking-wide">
            CASH ON DELIVERY (COD)
          </div>
          <div className="text-3xl font-black text-slate-900 mt-0.5">
            ৳{parcel.cod.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-700 font-sans font-semibold bg-emerald-50 px-2 py-0.5 rounded mt-1 inline-block border border-emerald-200">
            {parcel.advance > 0 ? `Advance Paid: ৳${parcel.advance}` : "Collect full COD amount"}
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="p-2 border border-slate-300 rounded-xl bg-white">
            <QrCode size={52} className="text-slate-900" />
          </div>
          <span className="text-[9px] text-slate-400 font-sans">Scan for Live Status</span>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-100 px-5 py-2 text-center text-[10px] text-slate-500 font-sans border-t border-slate-200">
        If undelivered, return to {settings.merchantName} ({settings.phone}) · Powered by ParcelGuard
      </div>
    </div>
  );
}
