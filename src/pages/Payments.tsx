import { useState } from "react";
import { Wallet, TrendingUp, Clock, AlertTriangle, Download } from "lucide-react";
import { useData, type Settlement } from "../context/DataContext";
import { Card, StatCard, StatusBadge, Button } from "../components/ui";
import SettlementModal from "../components/payments/SettlementModal";
import DisputeModal from "../components/payments/DisputeModal";

export default function Payments() {
  const { settlements, raiseDispute, exportSettlementsCSV } = useData();

  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);
  const [disputeSettlement, setDisputeSettlement] = useState<Settlement | null>(null);

  const totalCollected = settlements.reduce((acc, s) => acc + (s.status === "Paid" ? s.received : 0), 1250000);
  const pendingSettlement = settlements.filter(s => s.status === "Pending").reduce((acc, s) => acc + s.expected, 0);
  const disputedSettlements = settlements.filter(s => s.status === "Disputed" || s.diff < 0);

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
              onClick={() => setDisputeSettlement(disputedSettlements[0])}
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
                          onClick={() => setDisputeSettlement(s)}
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

      {/* Breakdown Modal */}
      {selectedSettlement && (
        <SettlementModal
          settlement={selectedSettlement}
          onClose={() => setSelectedSettlement(null)}
        />
      )}

      {/* Dispute Modal */}
      {disputeSettlement && (
        <DisputeModal
          settlement={disputeSettlement}
          onClose={() => setDisputeSettlement(null)}
          onRaiseDispute={raiseDispute}
        />
      )}
    </div>
  );
}
