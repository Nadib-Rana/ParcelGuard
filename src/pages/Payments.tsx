import { Wallet, TrendingUp, Clock, AlertTriangle, Filter, Download } from "lucide-react";
import { Card, StatCard, StatusBadge, Button, Badge } from "../components/ui";

const settlements = [
  { id: "STL-2408-001", courier: "Steadfast", period: "Aug 1–15", expected: "৳78,500", received: "৳78,500", diff: "—", status: "Paid" },
  { id: "STL-2408-002", courier: "Pathao", period: "Aug 1–15", expected: "৳45,200", received: "৳42,700", diff: "−৳2,500", status: "Disputed" },
  { id: "STL-2408-003", courier: "RedX", period: "Aug 1–15", expected: "৳32,000", received: "৳28,400", diff: "−৳3,600", status: "Partial" },
  { id: "STL-2408-004", courier: "Steadfast", period: "Aug 16–24", expected: "৳64,000", received: "—", diff: "—", status: "Pending" },
  { id: "STL-2408-005", courier: "Pathao", period: "Aug 16–24", expected: "৳38,500", received: "—", diff: "—", status: "Pending" },
];

export default function Payments() {
  return (
    <div className="p-6 space-y-6 max-w-screen-xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Payments & Reconciliation</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track COD collections and courier settlements.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm"><Filter size={13} /> Filter</Button>
          <Button variant="secondary" size="sm"><Download size={13} /> Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={<Wallet size={18} />} label="Total COD Collected" value="৳12,50,000" />
        <StatCard icon={<Clock size={18} />} label="Pending Settlement" value="৳2,45,600" sub="From 3 couriers" />
        <StatCard icon={<TrendingUp size={18} />} label="Received This Month" value="৳7,80,000" trend="↑ 8.2% vs last month" />
        <StatCard icon={<AlertTriangle size={18} />} label="Payment Issues" value="৳18,500" sub="2 disputes open" subColor="text-red-500" />
      </div>

      {/* Discrepancy alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-800">⚠ Payment discrepancy detected — Pathao Courier (STL-2408-002)</p>
          <div className="flex gap-4 mt-1 text-xs text-amber-700">
            <span>Expected: <strong>৳45,200</strong></span>
            <span>Received: <strong>৳42,700</strong></span>
            <span>Difference: <strong>−৳2,500</strong></span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">View Details</Button>
          <Button variant="danger" size="sm">Raise Dispute</Button>
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Settlement Records</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {["Settlement ID", "Courier", "Period", "Expected", "Received", "Difference", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {settlements.map((s, i) => (
                <tr key={s.id} className={`border-b border-slate-50 hover:bg-slate-50 ${i === settlements.length - 1 ? "border-none" : ""}`}>
                  <td className="px-4 py-3 text-xs font-mono font-semibold text-indigo-600">{s.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{s.courier}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{s.period}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900">{s.expected}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900">{s.received}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-red-600">{s.diff}</td>
                  <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">View</Button>
                      {s.status === "Disputed" && <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">Dispute</Button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
