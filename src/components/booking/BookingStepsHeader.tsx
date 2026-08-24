import { Check, ChevronRight } from "lucide-react";

interface Props {
  steps: string[];
  step: number;
  setStep: (s: number) => void;
}

export default function BookingStepsHeader({ steps, step, setStep }: Props) {
  return (
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
  );
}
