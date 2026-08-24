import { useState } from "react";
import { useData } from "../context/DataContext";
import { User, Bell, KeyRound } from "lucide-react";
import StoreProfileTab from "../components/settings/StoreProfileTab";
import ApiWebhooksTab from "../components/settings/ApiWebhooksTab";
import { Card, Button } from "../components/ui";

const tabs = [
  { id: "profile", label: "Business Profile", icon: User },
  { id: "notifications", label: "Notifications & Alerts", icon: Bell },
  { id: "api", label: "API & Webhooks", icon: KeyRound },
];

export default function Settings() {
  const { settings, updateSettings } = useData();
  const [activeTab, setActiveTab] = useState("profile");
  const [form, setForm] = useState(settings);
  const [savedMsg, setSavedMsg] = useState("");

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSettings(form);
    setSavedMsg("Settings saved successfully!");
    setTimeout(() => setSavedMsg(""), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-screen-xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Settings & Preferences</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your merchant store details, fraud alert thresholds, and API keys.</p>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === id ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Icon size={14} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <StoreProfileTab form={form} setForm={setForm} onSave={handleSave} savedMsg={savedMsg} />
      )}

      {activeTab === "notifications" && (
        <Card className="p-6">
          <h2 className="font-bold text-slate-900 text-base mb-1">Notification Preferences</h2>
          <p className="text-xs text-slate-500 mb-5">Select which alerts trigger email and in-app notifications.</p>
          <div className="space-y-3 text-xs">
            {[
              { id: "emailNotifs", label: "Email Notifications for Delivery Updates", desc: "Receive email summaries when parcels are delivered or returned" },
              { id: "fraudAlerts", label: "Real-time High Risk Fraud Alerts", desc: "Instantly notify when a customer with >70% risk score places an order" },
            ].map(item => (
              <label key={item.id} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(form as any)[item.id]}
                  onChange={e => setForm({ ...form, [item.id]: e.target.checked })}
                  className="accent-indigo-600 w-4 h-4 mt-0.5"
                />
                <div>
                  <div className="font-bold text-slate-800">{item.label}</div>
                  <div className="text-slate-500">{item.desc}</div>
                </div>
              </label>
            ))}
          </div>
          <div className="flex justify-end pt-4 border-t border-slate-100 mt-4">
            <Button size="sm" onClick={() => handleSave()}>Save Notification Preferences</Button>
          </div>
        </Card>
      )}

      {activeTab === "api" && (
        <ApiWebhooksTab form={form} setForm={setForm} onSave={handleSave} />
      )}
    </div>
  );
}
