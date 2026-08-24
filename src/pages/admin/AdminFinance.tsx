import { useState } from "react";
import { CircleDollarSign, Download, Search, CheckCircle2, TrendingUp, CreditCard } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";

export default function AdminFinance() {
  const { transactions } = useAdmin();
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("All");

  const totalRevenue = transactions.reduce((acc, t) => acc + t.amount, 1480000);

  const filtered = transactions.filter(t => {
    const matchSearch =
      t.merchantName.toLowerCase().includes(search.toLowerCase()) ||
      t.trxId.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());
    const matchMethod = methodFilter === "All" || t.method === methodFilter;
    return matchSearch && matchMethod;
  });

  const handleExport = () => {
    const headers = ["Transaction ID", "Merchant Name", "Merchant ID", "Amount (BDT)", "Method", "Type", "Status", "Date", "Trx ID"];
    const rows = filtered.map(t => [
      t.id,
      `"${t.merchantName}"`,
      t.merchantId,
      t.amount,
      t.method,
      t.type,
      t.status,
      `"${t.date}"`,
      t.trxId,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `parcelguard_platform_revenue_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-screen-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Platform Revenue & Billing Ledger</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time payment collections from merchant subscriptions and credit top-ups.</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2 rounded-xl border border-slate-700 transition-colors"
        >
          <Download size={14} /> Export Revenue CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Collected Platform Revenue</span>
          <div className="text-3xl font-black text-emerald-400 mt-1 font-mono">৳{totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-emerald-400 font-semibold mt-1">↑ 18.2% Monthly Recurring Growth</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-bold text-slate-400 uppercase">bKash / Nagad Share</span>
          <div className="text-3xl font-black text-white mt-1 font-mono">84.5%</div>
          <p className="text-xs text-slate-400 mt-1">Primary MFS collection channel</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-bold text-slate-400 uppercase">Average Merchant ARPU</span>
          <div className="text-3xl font-black text-white mt-1 font-mono">৳2,730</div>
          <p className="text-xs text-slate-400 mt-1">Per active merchant / month</p>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/40">
          <div className="relative flex-1 min-w-56">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by merchant, Trx ID, or invoice ID..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <select
            value={methodFilter}
            onChange={e => setMethodFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none"
          >
            <option value="All">All Payment Methods</option>
            <option value="bKash">bKash</option>
            <option value="Nagad">Nagad</option>
            <option value="Card">Card</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3.5">Invoice ID</th>
                <th className="px-5 py-3.5">Merchant Name</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Method</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Transaction ID</th>
                <th className="px-5 py-3.5">Date & Time</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-amber-400">{t.id}</td>
                  <td className="px-5 py-4 font-bold text-white">{t.merchantName}</td>
                  <td className="px-5 py-4 text-slate-300 font-medium">{t.type}</td>
                  <td className="px-5 py-4">
                    <span className="font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {t.method}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono font-black text-emerald-400 text-sm">
                    ৳{t.amount.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 font-mono text-slate-400 text-[11px]">{t.trxId}</td>
                  <td className="px-5 py-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">{t.date}</td>
                  <td className="px-5 py-4">
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
