import { useState } from "react";
import { Plus, RefreshCw, Settings, X, Check, ShieldCheck, ExternalLink } from "lucide-react";
import { useData } from "../context/DataContext";
import { Card, Button, Badge } from "../components/ui";

export default function CourierAccounts() {
  const { courierAccounts, connectCourier, syncCourier } = useData();

  const [showModal, setShowModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("Steadfast");
  const [apiKey, setApiKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [merchantId, setMerchantId] = useState("");
  const [webhook, setWebhook] = useState(true);
  const [syncingName, setSyncingName] = useState<string | null>(null);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    connectCourier(selectedProvider, apiKey, secretKey, merchantId, webhook);
    setShowModal(false);
    setApiKey("");
    setSecretKey("");
    setMerchantId("");
  };

  const handleSync = async (name: string) => {
    setSyncingName(name);
    await syncCourier(name);
    setSyncingName(null);
  };

  return (
    <div className="p-6 space-y-6 max-w-screen-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Courier Accounts & Integrations</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your merchant API keys and automated delivery webhooks.</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={14} /> Connect Courier
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {courierAccounts.map(c => (
          <Card key={c.name} className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl ${c.color} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                    {c.logo}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{c.name}</h3>
                    <Badge variant={c.connected ? "success" : "gray"}>
                      <span className={`w-1.5 h-1.5 rounded-full ${c.connected ? "bg-emerald-500" : "bg-slate-400"}`} />
                      {c.connected ? "Active & Connected" : "Not Connected"}
                    </Badge>
                  </div>
                </div>
              </div>

              {c.connected ? (
                <div className="space-y-2.5 mb-5 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Available Balance:</span>
                    <span className="font-bold text-emerald-700">৳{c.balance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Last Synced:</span>
                    <span className="text-slate-700 font-medium">{c.sync}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Webhook Status:</span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <ShieldCheck size={12} /> Active (Auto-sync)
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-xs text-slate-500 mb-3">Connect your merchant API key to unlock automated parcel booking.</p>
                </div>
              )}
            </div>

            {c.connected ? (
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1 justify-center"
                  onClick={() => {
                    setSelectedProvider(c.name);
                    setShowModal(true);
                  }}
                >
                  <Settings size={13} /> Manage Key
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1 justify-center"
                  onClick={() => handleSync(c.name)}
                  disabled={syncingName === c.name}
                >
                  <RefreshCw size={13} className={syncingName === c.name ? "animate-spin" : ""} />
                  {syncingName === c.name ? "Syncing..." : "Sync Now"}
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => {
                  setSelectedProvider(c.name);
                  setShowModal(true);
                }}
                className="w-full justify-center"
                size="sm"
              >
                <Plus size={13} /> Connect Account
              </Button>
            )}
          </Card>
        ))}

        {/* Add New Card */}
        <button
          onClick={() => setShowModal(true)}
          className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 text-center transition-all hover:bg-indigo-50/40 group flex flex-col items-center justify-center min-h-[220px]"
        >
          <div className="w-12 h-12 bg-slate-100 group-hover:bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-colors">
            <Plus size={22} className="text-slate-400 group-hover:text-indigo-600" />
          </div>
          <p className="font-bold text-slate-700 group-hover:text-indigo-700 text-sm">Add Other Courier</p>
          <p className="text-xs text-slate-400 mt-1">Connect Paperfly, eCourier, or Sundarban</p>
        </button>
      </div>

      {/* Connect Courier Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setShowModal(false)} />
          <Card className="relative z-10 w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 text-base">Connect Courier Integration</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConnect} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Courier Provider</label>
                <select
                  value={selectedProvider}
                  onChange={e => setSelectedProvider(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                >
                  <option value="Steadfast">Steadfast Courier</option>
                  <option value="Pathao">Pathao Courier</option>
                  <option value="RedX">RedX</option>
                  <option value="Paperfly">Paperfly</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Merchant API Key / Token</label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="e.g. sf_live_XXXXXXXXXXXXXXXX"
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Secret Key / Client Secret</label>
                <input
                  type="password"
                  value={secretKey}
                  onChange={e => setSecretKey(e.target.value)}
                  placeholder="••••••••••••••••••••"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Merchant Store ID (Optional)</label>
                <input
                  type="text"
                  value={merchantId}
                  onChange={e => setMerchantId(e.target.value)}
                  placeholder="e.g. MRC-89104"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <p className="text-xs font-bold text-slate-900">Enable Real-Time Webhooks</p>
                  <p className="text-[11px] text-slate-500">Automatically sync delivery status updates</p>
                </div>
                <input
                  type="checkbox"
                  checked={webhook}
                  onChange={e => setWebhook(e.target.checked)}
                  className="accent-indigo-600 w-4 h-4"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" size="sm">
                  <Check size={13} /> Save & Connect
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
