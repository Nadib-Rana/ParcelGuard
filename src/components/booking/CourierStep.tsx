import { Star, Check, ChevronRight } from "lucide-react";
import { Card, Button, Badge } from "../ui";

export interface CourierOption {
  name: "Steadfast" | "Pathao" | "RedX";
  days: string;
  charge: number;
  codRate: number;
  districts: number;
  score: number;
  recommended: boolean;
}

interface Props {
  couriers: CourierOption[];
  selectedCourierIdx: number;
  setSelectedCourierIdx: (i: number) => void;
  district: string;
  codAmount: number;
  onBack: () => void;
  onNext: () => void;
}

export default function CourierStep({
  couriers,
  selectedCourierIdx,
  setSelectedCourierIdx,
  district,
  codAmount,
  onBack,
  onNext,
}: Props) {
  return (
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
        <Button variant="secondary" onClick={onBack}>Back</Button>
        <Button onClick={onNext}>
          Review Order <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  );
}
