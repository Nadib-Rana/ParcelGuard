import { useState } from "react";
import { useData } from "../context/DataContext";
import { RefreshCw, KeyRound } from "lucide-react";
import { Card, Button, Badge } from "../components/ui";
import CourierConnectModal from "../components/couriers/CourierConnectModal";
import type { CourierAccount } from "../types";

export default function CourierAccounts() {
  const { couriers, toggleCourier, updateCourierKeys } = useData();
  const [selectedCourier, setSelectedCourier] = useState<CourierAccount | null>(null);
  const [syncingName, setSyncingName] = useState<string | null>(null);

  const handleSync = (name: string) => {
    setSyncingName(name);
    setTimeout(() => setSyncingName(null), 1000);
  };

  return (
    <div className="p-6 space-y-6 max-w-screen-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Courier Integrations</h1>
          <p className="text-sm text-slate-500 mt-0.5">Connect your courier merchant accounts to auto-book parcels and sync live statuses.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {couriers.map(c => (
          <Card key={c.name} className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm">
                    {c.logo || c.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-base">{c.name}</h2>
                    <p className="text-xs text-slate-500 font-mono">Last synced: {c.sync}</p>
                  </div>
                </div>

                <Badge variant={c.connected ? "success" : "gray"}>
                  {c.connected ? "Connected" : "Disconnected"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 my-5 p-3 bg-slate-50 rounded-xl text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Available COD Balance:</span>
                  <p className="font-bold text-emerald-600 mt-0.5">৳{c.balance.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Webhook Status:</span>
                  <p className="font-bold text-slate-900 mt-0.5">{c.webhookEnabled ? "Active (Live)" : "Disabled"}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSync(c.name)}
                disabled={syncingName === c.name}
              >
                <RefreshCw size={13} className={syncingName === c.name ? "animate-spin text-indigo-600" : ""} />
                {syncingName === c.name ? "Syncing..." : "Sync Orders"}
              </Button>

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => setSelectedCourier(c)}>
                  <KeyRound size={13} /> {c.apiKey ? "Edit API" : "Connect API"}
                </Button>
                <Button
                  variant={c.connected ? "ghost" : "primary"}
                  size="sm"
                  onClick={() => toggleCourier(c.name)}
                >
                  {c.connected ? "Disconnect" : "Connect"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedCourier && (
        <CourierConnectModal
          selectedCourier={selectedCourier}
          onClose={() => setSelectedCourier(null)}
          onSave={updateCourierKeys}
        />
      )}
    </div>
  );
}
