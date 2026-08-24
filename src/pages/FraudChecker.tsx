import { useState } from "react";
import { Shield, Search, AlertTriangle, CheckCircle, Clock, FileText, Plus } from "lucide-react";
import { Card, Button, Badge } from "../components/ui";

const recentChecks = [
  { phone: "01711-234567", name: "Rahim Uddin", risk: "Safe" as const, score: 12, date: "2 hours ago" },
  { phone: "01812-345678", name: "Karim Hasan", risk: "High Risk" as const, score: 82, date: "5 hours ago" },
  { phone: "01913-456789", name: "Nasrin Akter", risk: "Moderate" as const, score: 48, date: "Yesterday" },
  { phone: "01614-567890", name: "Farhan Hossain", risk: "Safe" as const, score: 8, date: "Yesterday" },
];

type RiskLevel = "Safe" | "Moderate" | "High Risk";

export default function FraudChecker() {
  const [phone, setPhone] = useState("");
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheck = () => {
    if (!phone) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setChecked(true); }, 1200);
  };

  const riskLevel: RiskLevel = "High Risk";
  const score = 82;

  const scoreColor = score >= 70 ? "text-red-600" : score >= 40 ? "text-amber-600" : "text-emerald-600";
  const scoreBg = score >= 70 ? "bg-red-50 border-red-200" : score >= 40 ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200";

  return (
    <div className="p-6 space-y-6 max-w-screen-xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Fraud Checker</h1>
        <p className="text-sm text-slate-500 mt-0.5">Check customer delivery history before shipping your parcel.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-5">
          {/* Search card */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                <Shield size={18} className="text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Customer Risk Check</h2>
                <p className="text-xs text-slate-500">Enter a phone number to check delivery history</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm font-medium text-slate-700 flex-shrink-0">
                🇧🇩 +880
              </div>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Enter mobile number (e.g. 01711-234567)"
                className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 placeholder:text-slate-400"
                onKeyDown={e => e.key === "Enter" && handleCheck()}
              />
              <Button onClick={handleCheck} disabled={loading || !phone}>
                {loading ? (
                  <span className="flex items-center gap-2"><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Checking...</span>
                ) : (
                  <><Search size={14} /> Check Risk</>
                )}
              </Button>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <Button variant="secondary" size="sm">
                <FileText size={13} /> Scan from CSV
              </Button>
              <span className="text-xs text-slate-400">or drag and drop a CSV file</span>
            </div>
          </Card>

          {/* Result */}
          {checked && (
            <Card className={`border-2 ${scoreBg}`}>
              <div className="p-5 border-b border-red-100">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-semibold text-slate-900">Customer Reputation Report</h2>
                    <p className="text-sm text-slate-500 mt-0.5 font-mono">+880 {phone || "1812-345678"}</p>
                  </div>
                  <Badge variant="danger">🔴 HIGH RISK</Badge>
                </div>
              </div>

              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Score */}
                <div className="flex items-center gap-5">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#fee2e2" strokeWidth="10" />
                      <circle
                        cx="50" cy="50" r="40" fill="none"
                        stroke="#ef4444" strokeWidth="10"
                        strokeDasharray={`${score * 2.51} 251`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-2xl font-bold ${scoreColor}`}>{score}</span>
                      <span className="text-xs text-slate-400">/100</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Overall Risk Score</p>
                    <p className={`text-2xl font-bold ${scoreColor} mt-1`}>{score}/100</p>
                    <p className="text-xs text-red-600 mt-1">This customer has a high return and parcel refusal history.</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Total Orders", value: "24", color: "text-slate-900" },
                    { label: "Successfully Received", value: "9", color: "text-emerald-600" },
                    { label: "Returned / Refused", value: "12", color: "text-red-600" },
                    { label: "Success Rate", value: "37.5%", color: "text-red-600" },
                  ].map(s => (
                    <div key={s.label} className="bg-white rounded-lg p-3 border border-slate-200">
                      <p className="text-xs text-slate-500">{s.label}</p>
                      <p className={`text-xl font-bold ${s.color} mt-0.5`}>{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk factors */}
              <div className="px-5 pb-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Risk Factors</h3>
                <div className="space-y-2">
                  {["Frequent parcel refusal", "Multiple orders from different merchants", "High return ratio (50%+)"].map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                      <AlertTriangle size={13} /> {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendation */}
              <div className="mx-5 mb-5 bg-red-600 rounded-xl p-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-wide opacity-80 mb-1">Recommended Action</p>
                <p className="font-semibold">Request advance payment before shipping.</p>
                <p className="text-sm opacity-80 mt-1">Do not ship without payment confirmation.</p>
                <div className="flex gap-2 mt-3">
                  <Button variant="secondary" size="sm">Book Anyway</Button>
                  <button className="px-3 py-1.5 text-xs font-medium bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors border border-white/30">
                    <Plus size={12} className="inline mr-1" />Add to Watchlist
                  </button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Recent checks */}
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Clock size={14} className="text-slate-400" /> Recent Checks
            </h3>
            <div className="space-y-2">
              {recentChecks.map((c, i) => (
                <button
                  key={i}
                  onClick={() => { setPhone(c.phone); setChecked(true); }}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors text-left"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{c.name}</p>
                    <p className="text-xs font-mono text-slate-500">{c.phone}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{c.date}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${c.score >= 70 ? "text-red-600" : c.score >= 40 ? "text-amber-600" : "text-emerald-600"}`}>
                      {c.score}
                    </span>
                    <p className="text-xs text-slate-400">score</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Stats summary */}
          <Card className="p-4">
            <h3 className="font-semibold text-slate-900 mb-3">Today's Stats</h3>
            <div className="space-y-3">
              {[
                { label: "Checks Performed", value: "28", icon: <Search size={14} />, color: "text-indigo-600 bg-indigo-50" },
                { label: "High Risk Found", value: "5", icon: <AlertTriangle size={14} />, color: "text-red-600 bg-red-50" },
                { label: "Safe Customers", value: "21", icon: <CheckCircle size={14} />, color: "text-emerald-600 bg-emerald-50" },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}>{s.icon}</div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">{s.label}</p>
                    <p className="text-sm font-bold text-slate-900">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400">
              340 / 500 checks used this month
              <div className="h-1.5 bg-slate-100 rounded-full mt-1.5">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: "68%" }} />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
