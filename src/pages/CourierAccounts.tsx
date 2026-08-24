import { useState } from "react";
import { Plus, RefreshCw, Settings, X, Check } from "lucide-react";
import { Card, Button, Badge } from "../components/ui";

const couriers = [
  { name: "Steadfast Courier", logo: "SC", color: "bg-emerald-600", connected: true, balance: "৳12,500", sync: "2 minutes ago" },
  { name: "Pathao Courier", logo: "PC", color: "bg-indigo-600", connected: true, balance: "৳8,320", sync: "5 minutes ago" },
  { name: "RedX", logo: "RX", color: "bg-red-600", connected: false, balance: "—", sync: "—" },
];

export default function CourierAccounts() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-6 space-y-6 max-w-screen-xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Courier Accounts</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your connected courier API integrations.</p>
        </div>
        <Button onClick={() => setShowModal(true)}><Plus size={14} /> Connect Courier</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {couriers.map(c => (
          <Card key={c.name} className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl ${c.color} flex items-center justify-center text-white font-bold text-sm`}>
                  {c.logo}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{c.name}</h3>
                  <Badge variant={c.connected ? "success" : "gray"}>
                    <span className={`w-1.5 h-1.5 rounded-full ${c.connected ? "bg-emerald-500" : "bg-slate-400"}`} />
                    {c.connected ? "Connected" : "Not Connected"}
                  </Badge>
                </div>
              </div>
            </div>

            {c.connected ? (
              <>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Available Balance</span>
                    <span className="font-semibold text-emerald-600">{c.balance}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Last Sync</span>
                    <span className="text-slate-700">{c.sync}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" className="flex-1 justify-center">
                    <Settings size={13} /> Manage
                  </Button>
                  <Button variant="secondary" size="sm" className="flex-1 justify-center">
                    <RefreshCw size={13} /> Sync Now
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-slate-500 mb-4">Connect your {c.name} account to start booking.</p>
                <Button onClick={() => setShowModal(true)} className="w-full justify-center">
                  <Plus size={13} /> Connect Account
                </Button>
              </div>
            )}
          </Card>
        ))}

        {/* Add new */}
        <button
          onClick={() => setShowModal(true)}
          className="border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-xl p-5 text-center transition-all hover:bg-indigo-50/50 group"
        >
          <div className="w-12 h-12 bg-slate-100 group-hover:bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors">
            <Plus size={20} className="text-slate-400 group-hover:text-indigo-600" />
          </div>
          <p className="font-medium text-slate-500 group-hover:text-indigo-600 text-sm">Add Courier Account</p>
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setShowModal(false)} />
          <Card className="relative z-10 w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-slate-900">Connect Courier Account</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Courier Provider</label>
                <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400">
                  <option>Select Courier</option>
                  <option>Steadfast</option>
                  <option>Pathao Courier</option>
                  <option>RedX</option>
                  <option>Paperfly</option>
                  <option>Sundarban Courier</option>
                </select>
              </div>
              {[
                { label: "Merchant API Key", placeholder: "e.g. sk_live_XXXXXXXXXXXXXXXX" },
                { label: "Secret Key", placeholder: "e.g. sk_XXXXXXXXXXXXXX" },
                { label: "Merchant ID", placeholder: "e.g. MRC-000000" },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">{f.label}</label>
                  <input type="text" placeholder={f.placeholder} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 font-mono" />
                </div>
              ))}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900">Enable Webhook</p>
                  <p className="text-xs text-slate-500">Get real-time delivery updates</p>
                </div>
                <button className="w-10 h-6 bg-indigo-600 rounded-full relative">
                  <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </button>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <Button variant="secondary" className="flex-1 justify-center" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button className="flex-1 justify-center" onClick={() => setShowModal(false)}>
                <Check size={14} /> Connect Account
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
