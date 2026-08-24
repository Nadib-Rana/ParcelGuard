import { useState } from "react";
import { Shield, Search, AlertTriangle, CheckCircle, Clock, FileText, Plus, Check, ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useData, type FraudCheckResult } from "../context/DataContext";
import { Card, Button, Badge } from "../components/ui";

export default function FraudChecker() {
  const { checkPhoneRisk, fraudChecks, toggleWatchlist, customers } = useData();
  const [phone, setPhone] = useState("");
  const [currentResult, setCurrentResult] = useState<FraudCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [batchResults, setBatchResults] = useState<FraudCheckResult[]>([]);
  const navigate = useNavigate();

  const handleCheck = () => {
    if (!phone) return;
    setLoading(true);
    setTimeout(() => {
      const res = checkPhoneRisk(phone);
      setCurrentResult(res);
      setLoading(false);
    }, 700);
  };

  const handleSelectRecent = (check: FraudCheckResult) => {
    setPhone(check.phone);
    setCurrentResult(check);
  };

  const handleBatchScan = () => {
    if (!csvText.trim()) return;
    const lines = csvText.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    const results = lines.slice(0, 10).map(p => checkPhoneRisk(p));
    setBatchResults(results);
  };

  const isCustomerWatchlisted = currentResult
    ? customers.some(c => c.phone.replace(/\D/g, "") === currentResult.phone.replace(/\D/g, "") && c.isWatchlist)
    : false;

  const score = currentResult?.score ?? 0;
  const scoreColor = score >= 70 ? "text-red-600" : score >= 40 ? "text-amber-600" : "text-emerald-600";
  const scoreBg = score >= 70 ? "bg-red-50/50 border-red-200" : score >= 40 ? "bg-amber-50/50 border-amber-200" : "bg-emerald-50/50 border-emerald-200";

  return (
    <div className="p-6 space-y-6 max-w-screen-xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Fraud Checker & Risk Engine</h1>
        <p className="text-sm text-slate-500 mt-0.5">Check customer delivery history and risk score before dispatching parcels.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-5">
          {/* Search Card */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                <Shield size={18} className="text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Customer Risk Intelligence</h2>
                <p className="text-xs text-slate-500">Enter a Bangladeshi mobile number (013-019) to inspect delivery reputation.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm font-medium text-slate-700 flex-shrink-0">
                🇧🇩 +880
              </div>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Enter mobile number (e.g. 01711234567)"
                className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 placeholder:text-slate-400 font-mono"
                onKeyDown={e => e.key === "Enter" && handleCheck()}
              />
              <Button onClick={handleCheck} disabled={loading || !phone}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Checking...
                  </span>
                ) : (
                  <>
                    <Search size={14} /> Check Risk
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <Button variant="secondary" size="sm" onClick={() => setShowCsvModal(true)}>
                <FileText size={13} /> Batch Scan from CSV / Text
              </Button>
              <span className="text-xs text-slate-400">Scan multiple numbers at once</span>
            </div>
          </Card>

          {/* Dynamic Result Card */}
          {currentResult && (
            <Card className={`border-2 ${scoreBg} transition-all`}>
              <div className="p-5 border-b border-slate-200/80 bg-white/70 flex items-start justify-between">
                <div>
                  <h2 className="font-bold text-slate-900 text-base">Customer Reputation Report</h2>
                  <p className="text-sm text-slate-600 font-mono mt-0.5 font-semibold">+880 {currentResult.phone}</p>
                </div>
                <div>
                  {currentResult.risk === "High Risk" ? (
                    <Badge variant="danger">🔴 HIGH RISK</Badge>
                  ) : currentResult.risk === "Moderate" ? (
                    <Badge variant="warning">🟡 MODERATE RISK</Badge>
                  ) : (
                    <Badge variant="success">🟢 SAFE CUSTOMER</Badge>
                  )}
                </div>
              </div>

              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visual Score Meter */}
                <div className="flex items-center gap-5 bg-white p-4 rounded-xl border border-slate-200">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={score >= 70 ? "#ef4444" : score >= 40 ? "#f59e0b" : "#10b981"}
                        strokeWidth="10"
                        strokeDasharray={`${score * 2.51} 251`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-2xl font-black ${scoreColor}`}>{score}</span>
                      <span className="text-[10px] text-slate-400 font-bold">/100</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Risk Assessment</p>
                    <p className={`text-xl font-bold ${scoreColor} mt-0.5`}>{currentResult.risk}</p>
                    <p className="text-xs text-slate-600 mt-1">{currentResult.recommendation}</p>
                  </div>
                </div>

                {/* Stats Breakdown */}
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label: "Total Orders", value: currentResult.totalOrders, color: "text-slate-900" },
                    { label: "Delivered", value: currentResult.delivered, color: "text-emerald-600" },
                    { label: "Returned / Refused", value: currentResult.returned, color: "text-red-600" },
                    { label: "Success Rate", value: currentResult.successRate, color: currentResult.risk === "Safe" ? "text-emerald-600" : "text-amber-600" },
                  ].map(s => (
                    <div key={s.label} className="bg-white rounded-lg p-3 border border-slate-200 text-center">
                      <p className="text-xs text-slate-500">{s.label}</p>
                      <p className={`text-lg font-bold ${s.color} mt-0.5`}>{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Factors */}
              <div className="px-5 pb-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Detected Risk Factors & Signals</h3>
                <div className="space-y-1.5">
                  {currentResult.factors.map((factor, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2">
                      <AlertTriangle size={13} className={score >= 70 ? "text-red-500" : "text-amber-500"} />
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Banner */}
              <div className={`mx-5 mb-5 rounded-xl p-4 text-white ${score >= 70 ? "bg-red-600" : score >= 40 ? "bg-amber-600" : "bg-emerald-600"}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase font-bold tracking-wider opacity-85">Recommended Strategy</p>
                    <p className="font-semibold text-sm mt-0.5">{currentResult.recommendation}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/book-parcel?phone=${currentResult.phone}`)}
                    >
                      Book Parcel <ArrowRight size={12} />
                    </Button>
                    <button
                      onClick={() => toggleWatchlist(currentResult.phone)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1 ${
                        isCustomerWatchlisted
                          ? "bg-white text-red-600 border-white"
                          : "bg-white/20 hover:bg-white/30 text-white border-white/30"
                      }`}
                    >
                      {isCustomerWatchlisted ? <Check size={12} /> : <Plus size={12} />}
                      {isCustomerWatchlisted ? "In Watchlist" : "Add to Watchlist"}
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Sidebar: Recent Checks & Fraud Stats */}
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Clock size={14} className="text-slate-400" /> Recent Checks
            </h3>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {fraudChecks.map((c, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectRecent(c)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors text-left border border-slate-100"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900">{c.name || "Customer"}</p>
                    <p className="text-xs font-mono text-slate-500">{c.phone}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{c.date}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-base font-black ${c.score >= 70 ? "text-red-600" : c.score >= 40 ? "text-amber-600" : "text-emerald-600"}`}>
                      {c.score}
                    </span>
                    <p className="text-[10px] text-slate-400">score</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Quick Metrics */}
          <Card className="p-4">
            <h3 className="font-semibold text-slate-900 mb-3">Fraud Intelligence Stats</h3>
            <div className="space-y-3">
              {[
                { label: "Checks Completed This Month", value: "340 / 500", icon: <Search size={14} />, color: "text-indigo-600 bg-indigo-50" },
                { label: "High Risk Flags Detected", value: "18 (5.3%)", icon: <AlertTriangle size={14} />, color: "text-red-600 bg-red-50" },
                { label: "Estimated Loss Prevented", value: "৳42,800", icon: <CheckCircle size={14} />, color: "text-emerald-600 bg-emerald-50" },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${s.color}`}>{s.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-slate-500 truncate">{s.label}</p>
                    <p className="text-sm font-bold text-slate-900">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Batch Scan Modal */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setShowCsvModal(false)} />
          <Card className="relative z-10 w-full max-w-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900">Batch Phone Risk Scanner</h2>
              <button onClick={() => setShowCsvModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-3">Paste a list of Bangladeshi phone numbers (separated by commas or newlines):</p>
            <textarea
              rows={4}
              value={csvText}
              onChange={e => setCsvText(e.target.value)}
              placeholder="01711234567&#10;01812345678&#10;01913456789"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <div className="flex justify-end gap-2 mt-3">
              <Button variant="secondary" size="sm" onClick={() => setShowCsvModal(false)}>Close</Button>
              <Button size="sm" onClick={handleBatchScan}>Scan Numbers</Button>
            </div>

            {batchResults.length > 0 && (
              <div className="mt-4 border-t border-slate-100 pt-3">
                <h3 className="text-xs font-bold text-slate-700 mb-2">Scan Results:</h3>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {batchResults.map((b, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs">
                      <span className="font-mono">{b.phone}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{b.score}/100</span>
                        <Badge variant={b.risk === "High Risk" ? "danger" : b.risk === "Moderate" ? "warning" : "success"}>
                          {b.risk}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
