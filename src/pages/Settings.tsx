import { useState } from "react";
import { User, Bell, Lock, Code2, Upload, Check, Copy } from "lucide-react";
import { useData } from "../context/DataContext";
import { Card, Button, Input } from "../components/ui";

const sections = ["Business Profile", "Notifications", "Security", "API Access"];

export default function Settings() {
  const { settings, updateSettings } = useData();
  const [activeSection, setActiveSection] = useState("Business Profile");

  // Form State
  const [merchantName, setMerchantName] = useState(settings.merchantName);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [businessType, setBusinessType] = useState(settings.businessType);
  const [businessAddress, setBusinessAddress] = useState(settings.businessAddress);
  const [webhookUrl, setWebhookUrl] = useState(settings.webhookUrl);
  const [notifications, setNotifications] = useState(settings.notifications);

  const [savedMessage, setSavedMessage] = useState("");
  const [copiedKey, setCopiedKey] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      merchantName,
      phone,
      email,
      businessType,
      businessAddress,
    });
    showSaveSuccess("Business profile updated successfully!");
  };

  const handleSaveNotifications = () => {
    updateSettings({ notifications });
    showSaveSuccess("Notification preferences saved!");
  };

  const handleSaveApi = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ webhookUrl });
    showSaveSuccess("API & Webhook settings updated!");
  };

  const showSaveSuccess = (msg: string) => {
    setSavedMessage(msg);
    setTimeout(() => setSavedMessage(""), 2500);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(settings.apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="p-6 max-w-screen-lg">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Merchant Settings</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your store details, automated webhooks, and security settings.</p>
        </div>
        {savedMessage && (
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold animate-fade-in">
            <Check size={14} /> {savedMessage}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Navigation Sidebar */}
        <Card className="p-2 h-fit">
          {[
            { label: "Business Profile", icon: User },
            { label: "Notifications", icon: Bell },
            { label: "Security", icon: Lock },
            { label: "API Access", icon: Code2 },
          ].map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => setActiveSection(label)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                activeSection === label ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon size={14} className={activeSection === label ? "text-white" : "text-slate-400"} />
              {label}
            </button>
          ))}
        </Card>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeSection === "Business Profile" && (
            <Card className="p-6">
              <h2 className="font-bold text-slate-900 text-base mb-5">Business Profile & Store Details</h2>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                  {merchantName.slice(0, 2).toUpperCase()}
                </div>
                <Button variant="secondary" size="sm">
                  <Upload size={13} /> Change Logo
                </Button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Merchant Store Name</label>
                    <input
                      type="text"
                      value={merchantName}
                      onChange={e => setMerchantName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Merchant Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Business Type</label>
                    <select
                      value={businessType}
                      onChange={e => setBusinessType(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                    >
                      <option>F-Commerce (Facebook Page)</option>
                      <option>E-commerce Website (WooCommerce/Shopify)</option>
                      <option>Physical Showroom + Online</option>
                      <option>Wholesale & Distribution</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Pickup / Warehouse Address</label>
                    <textarea
                      rows={2}
                      value={businessAddress}
                      onChange={e => setBusinessAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-100">
                  <Button type="submit" size="sm">Save Business Profile</Button>
                </div>
              </form>
            </Card>
          )}

          {activeSection === "Notifications" && (
            <Card className="p-6">
              <h2 className="font-bold text-slate-900 text-base mb-5">Notification & Alert Preferences</h2>
              <div className="space-y-3">
                {[
                  { key: "parcelUpdates", label: "Parcel Status Updates", desc: "Get real-time alerts when parcels change status (Delivered, Returned, In Transit)." },
                  { key: "paymentUpdates", label: "COD Settlements & Payments", desc: "Receive notifications whenever couriers deposit COD settlements." },
                  { key: "highRiskAlerts", label: "High Risk Customer Alerts", desc: "Instant warning triggers whenever a high-risk phone number places an order." },
                  { key: "smsNotifications", label: "SMS Urgent Alerts", desc: "Receive critical delivery refusal alerts directly via SMS." },
                  { key: "emailNotifications", label: "Daily Digest via Email", desc: "Summary report of daily parcel shipments and financial reconciliation." },
                ].map(({ key, label, desc }) => {
                  const val = notifications[key as keyof typeof notifications];
                  return (
                    <div key={key} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="text-xs font-bold text-slate-900">{label}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifications(prev => ({ ...prev, [key]: !val }))}
                        className={`w-10 h-6 rounded-full relative transition-colors ${val ? "bg-indigo-600" : "bg-slate-200"}`}
                      >
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${val ? "right-1" : "left-1"}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end mt-5 pt-3 border-t border-slate-100">
                <Button size="sm" onClick={handleSaveNotifications}>Save Preferences</Button>
              </div>
            </Card>
          )}

          {activeSection === "Security" && (
            <div className="space-y-4">
              <Card className="p-5">
                <h3 className="font-bold text-slate-900 text-sm mb-3">Update Merchant Password</h3>
                <div className="space-y-3">
                  <Input label="Current Password" type="password" placeholder="••••••••" />
                  <Input label="New Password" type="password" placeholder="Min. 8 characters" />
                  <Input label="Confirm New Password" type="password" placeholder="••••••••" />
                </div>
                <Button className="mt-4" size="sm">Update Password</Button>
              </Card>

              <Card className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Two-Factor Authentication (2FA)</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Protect your payout account with SMS OTP verification.</p>
                  </div>
                  <Button variant="secondary" size="sm">Enable 2FA</Button>
                </div>
              </Card>
            </div>
          )}

          {activeSection === "API Access" && (
            <Card className="p-6">
              <h2 className="font-bold text-slate-900 text-base mb-4">Developer API & Webhooks</h2>
              <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-200">
                <p className="text-[11px] font-bold text-slate-500 uppercase mb-1.5">Live Production API Key</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs font-mono text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 truncate">
                    {settings.apiKey}
                  </code>
                  <Button variant="secondary" size="sm" onClick={handleCopyKey}>
                    {copiedKey ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                    {copiedKey ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>

              <form onSubmit={handleSaveApi} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Webhook Endpoint URL</label>
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={e => setWebhookUrl(e.target.value)}
                    placeholder="https://yourstore.com/api/parcelguard-webhook"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">ParcelGuard pushes delivery events (`PARCEL_DELIVERED`, `PARCEL_RETURNED`) to this endpoint.</p>
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-100">
                  <Button type="submit" size="sm">Save Webhook URL</Button>
                </div>
              </form>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
