import { useState } from "react";
import { Wallet, TrendingUp, Clock, AlertTriangle, Filter, Download, X, Check, ShieldAlert, FileText } from "lucide-react";
import { useData, type Settlement } from "../context/DataContext";
import { Card, StatCard, StatusBadge, Button, Badge } from "../components/ui";

export default function Payments() {
  const { settlements, raiseDispute } = useData();

  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);
  const [disputeSettlement, setDisputeSettlement] = useState<Settlement | null>(null);
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeAmount, setDisputeAmount] = useState("");
  const [disputeSent, setDisputeSent] = useState(false);

  const totalCollected = settlements.reduce((acc, s) => acc + (s.status === "Paid" ? s.received : 0), 1250000);
  const pendingSettlement = settlements.filter(s => s.status === "Pending").reduce((acc, s) => acc + s.expected, 0);
  const disputedSettlements = settlements.filter(s => s.status === "Disputed" || s.diff < 0);

  const handleRaiseDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeSettlement) return;

    raiseDispute(disputeSettlement.id, disputeReason, disputeAmount ? Number(disputeAmount) : undefined);
    setDisputeSent(true);
    setTimeout(() => {
      setDisputeSent(false);
      setDisputeSettlement(null);
      setDisputeReason("");
      setDisputeAmount("");
    }, 1500);
  };

  const exportSettlementsCSV = () => {
    const headers = ["Settlement ID", "Courier", "Period", "Expected (BDT)", "Received (BDT)", "Difference (BDT)", "Status", "Parcels Count"];
    const rows = settlements.map(s => [
      s.id,
      s.courier,
      `"${s.period}"`,
      s.expected,
      s.received,
      s.diff,
      s.status,
      s.parcelsCount,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `parcelguard_settlements_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6 max-w-screen-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Payments & COD Reconciliation</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track cash-on-delivery collections, courier payout batches, and discrepancy disputes.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={exportSettlementsCSV}>
            <Download size={13} /> Export Settlements CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={<Wallet size={18} />} label="Total COD Collected" value={`৳${totalCollected.toLocaleString()}`} />
        <StatCard icon={<Clock size={18} />} label="Pending Settlement" value={`৳${pendingSettlement.toLocaleString()}`} sub="From active couriers" />
        <StatCard icon={<TrendingUp size={18} />} label="Received This Month" value="৳7,80,000" trend="↑ 8.2% vs last month" />
        <StatCard
          icon={<AlertTriangle size={18} />}
          label="Payment Discrepancies"
          value={`৳${Math.abs(settlements.reduce((acc, s) => acc + (s.diff < 0 ? s.diff : 0), 0)).toLocaleString()}`}
          sub={`${disputedSettlements.length} issues flagged`}
          subColor="text-red-500"
        />
      </div>

      {/* Discrepancy Alert Banner */}
      {disputedSettlements.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-900">
                Payment discrepancy detected on {disputedSettlements[0].courier} ({disputedSettlements[0].id})
              </p>
              <div className="flex flex-wrap gap-4 mt-1 text-xs text-amber-800">
                <span>Expected: <strong>৳{disputedSettlements[0].expected.toLocaleString()}</strong></span>
                <span>Received: <strong>৳{disputedSettlements[0].received.toLocaleString()}</strong></span>
                <span>Shortage: <strong className="text-red-600">৳{Math.abs(disputedSettlements[0].diff).toLocaleString()}</strong></span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button variant="secondary" size="sm" onClick={() => setSelectedSettlement(disputedSettlements[0])}>
              View Breakdown
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setDisputeSettlement(disputedSettlements[0]);
                setDisputeAmount(String(Math.abs(disputedSettlements[0].diff)));
              }}
            >
              Raise Dispute
            </Button>
          </div>
        </div>
      )}

      {/* Settlements Table */}
      <Card>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-900 text-sm">Settlement Records & Batches</h2>
          <span className="text-xs text-slate-500">{settlements.length} settlement batches</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {["Settlement ID", "Courier Partner", "Period", "Parcels", "Expected Amount", "Received Amount", "Variance", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {settlements.map((s, i) => (
                <tr key={s.id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${i === settlements.length - 1 ? "border-none" : ""}`}>
                  <td className="px-4 py-3 text-xs font-mono font-bold text-indigo-600">{s.id}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900">{s.courier}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{s.period}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 font-mono">{s.parcelsCount} parcels</td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-900">৳{s.expected.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-900">{s.received > 0 ? `৳${s.received.toLocaleString()}` : "—"}</td>
                  <td className="px-4 py-3 text-sm font-bold">
                    {s.diff < 0 ? (
                      <span className="text-red-600 font-mono">−৳{Math.abs(s.diff).toLocaleString()}</span>
                    ) : (
                      <span className="text-slate-400 font-mono">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedSettlement(s)}>
                        Breakdown
                      </Button>
                      {s.diff < 0 && s.status !== "Disputed" && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            setDisputeSettlement(s);
                            setDisputeAmount(String(Math.abs(s.diff)));
                          }}
                        >
                          Dispute
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Settlement Breakdown Modal */}
      {selectedSettlement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setSelectedSettlement(null)} />
          <Card className="relative z-10 w-full max-w-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-bold text-indigo-600">{selectedSettlement.id}</span>
                <h2 className="font-bold text-slate-900 text-base">{selectedSettlement.courier} Settlement Breakdown</h2>
              </div>
              <button onClick={() => setSelectedSettlement(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Expected COD</p>
                  <p className="text-base font-black text-slate-900">৳{selectedSettlement.expected.toLocaleString()}</p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-xl">
                  <p className="text-[10px] text-emerald-700 font-bold uppercase">Paid Payout</p>
                  <p className="text-base font-black text-emerald-700">৳{selectedSettlement.received.toLocaleString()}</p>
                </div>
                <div className="bg-red-50 p-3 rounded-xl">
                  <p className="text-[10px] text-red-700 font-bold uppercase">Shortage</p>
                  <p className="text-base font-black text-red-700">৳{Math.abs(selectedSettlement.diff).toLocaleString()}</p>
                </div>
              </div>

              {selectedSettlement.disputeReason && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs">
                  <p className="font-bold text-red-800">Active Dispute Note:</p>
                  <p className="text-red-700 mt-0.5">{selectedSettlement.disputeReason}</p>
                </div>
              )}

              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Included Orders ({selectedSettlement.parcelsCount} Parcels)</h3>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {[
                  { id: "PG-102845", cust: "Rahim Uddin", amount: "৳1,250", status: "Delivered & Reconciled" },
                  { id: "PG-102846", cust: "Karim Hasan", amount: "৳2,500", status: "Deduction Disputed" },
                  { id: "PG-102848", cust: "Farhan Hossain", amount: "৳3,200", status: "Delivered & Reconciled" },
                  { id: "PG-102851", cust: "Tania Begum", amount: "৳960", status: "Delivered & Reconciled" },
                ].map(r => (
                  <div key={r.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 text-xs border border-slate-100">
                    <div>
                      <span className="font-mono font-bold text-indigo-600 mr-2">{r.id}</span>
                      <span className="text-slate-800 font-medium">{r.cust}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{r.amount}</span>
                      <Badge variant={r.status.includes("Disputed") ? "danger" : "success"}>{r.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5 pt-3 border-t border-slate-100">
              <Button variant="secondary" size="sm" onClick={() => setSelectedSettlement(null)}>Close</Button>
            </div>
          </Card>
        </div>
      )}

      {/* Raise Dispute Modal */}
      {disputeSettlement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setDisputeSettlement(null)} />
          <Card className="relative z-10 w-full max-w-md p-6 shadow-2xl">
            {disputeSent ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check size={24} className="text-emerald-500" />
                </div>
                <h3 className="font-bold text-slate-900">Dispute Ticket Submitted!</h3>
                <p className="text-xs text-slate-500 mt-1">Dispute ticket #DSP-{Math.floor(Math.random() * 9000 + 1000)} sent to {disputeSettlement.courier} finance desk.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-bold text-slate-900">Raise Courier Payment Dispute</h2>
                    <p className="text-xs text-slate-500 mt-0.5">{disputeSettlement.courier} · {disputeSettlement.id}</p>
                  </div>
                  <button onClick={() => setDisputeSettlement(null)} className="text-slate-400 hover:text-slate-600">
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleRaiseDispute} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Disputed Shortage Amount (৳)</label>
                    <input
                      type="number"
                      value={disputeAmount}
                      onChange={e => setDisputeAmount(e.target.value)}
                      placeholder="2500"
                      required
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-bold text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Dispute</label>
                    <textarea
                      rows={3}
                      value={disputeReason}
                      onChange={e => setDisputeReason(e.target.value)}
                      placeholder="e.g. COD deduction for parcels PG-102846 was uncredited despite verified delivery..."
                      required
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none resize-none"
                    />
                  </div>

                  <div className="p-3 bg-amber-50 rounded-lg text-xs text-amber-800">
                    ParcelGuard will automatically email this dispute statement to {disputeSettlement.courier} merchant support with order IDs.
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <Button variant="secondary" size="sm" onClick={() => setDisputeSettlement(null)}>Cancel</Button>
                    <Button type="submit" variant="danger" size="sm">
                      Submit Dispute
                    </Button>
                  </div>
                </form>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
