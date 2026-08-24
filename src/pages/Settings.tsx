import { useState } from "react";
import { User, Bell, Lock, Code2, Upload } from "lucide-react";
import { Card, Button, Input } from "../components/ui";

const sections = ["Business Profile", "Notifications", "Security", "API Access"];

export default function Settings() {
  const [activeSection, setActiveSection] = useState("Business Profile");
  const [notifications, setNotifications] = useState({
    parcelUpdates: true, paymentUpdates: true, highRiskAlerts: true, smsNotifications: false, emailNotifications: true
  });

  return (
    <div className="p-6 max-w-screen-lg">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your account and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Sidebar */}
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
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                activeSection === label ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon size={14} className={activeSection === label ? "text-indigo-600" : "text-slate-400"} />
              {label}
            </button>
          ))}
        </Card>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeSection === "Business Profile" && (
            <Card className="p-6">
              <h2 className="font-semibold text-slate-900 mb-5">Business Profile</h2>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl">RS</div>
                <Button variant="secondary" size="sm"><Upload size={13} /> Upload Logo</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Merchant Name" placeholder="Rahman Store" />
                <Input label="Phone" placeholder="+880 1711-234567" />
                <Input label="Email" placeholder="rahman@store.bd" type="email" />
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Business Type</label>
                  <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                    <option>F-Commerce (Facebook)</option>
                    <option>E-commerce Website</option>
                    <option>Physical Store</option>
                    <option>Wholesale</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Business Address</label>
                  <textarea rows={2} placeholder="Full business address..." className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none" />
                </div>
              </div>
              <div className="flex justify-end mt-5">
                <Button>Save Changes</Button>
              </div>
            </Card>
          )}

          {activeSection === "Notifications" && (
            <Card className="p-6">
              <h2 className="font-semibold text-slate-900 mb-5">Notification Preferences</h2>
              <div className="space-y-3">
                {Object.entries(notifications).map(([key, val]) => {
                  const labels: Record<string, [string, string]> = {
                    parcelUpdates: ["Parcel Updates", "Get notified when parcel status changes"],
                    paymentUpdates: ["Payment Updates", "Alerts for COD collections and settlements"],
                    highRiskAlerts: ["High Risk Alerts", "Immediate alerts for risky customers"],
                    smsNotifications: ["SMS Notifications", "Receive updates via SMS"],
                    emailNotifications: ["Email Notifications", "Daily summary and important alerts"],
                  };
                  const [label, desc] = labels[key];
                  return (
                    <div key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifications(n => ({ ...n, [key]: !n[key as keyof typeof n] }))}
                        className={`w-11 h-6 rounded-full relative transition-colors ${val ? "bg-indigo-600" : "bg-slate-200"}`}
                      >
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${val ? "right-1" : "left-1"}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end mt-5">
                <Button>Save Preferences</Button>
              </div>
            </Card>
          )}

          {activeSection === "Security" && (
            <div className="space-y-4">
              <Card className="p-5">
                <h3 className="font-semibold text-slate-900 mb-4">Change Password</h3>
                <div className="space-y-3">
                  <Input label="Current Password" type="password" placeholder="••••••••" />
                  <Input label="New Password" type="password" placeholder="••••••••" />
                  <Input label="Confirm New Password" type="password" placeholder="••••••••" />
                </div>
                <Button className="mt-4" size="sm">Update Password</Button>
              </Card>
              <Card className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">Two-Factor Authentication</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Add an extra layer of security to your account.</p>
                  </div>
                  <Button variant="secondary" size="sm">Enable 2FA</Button>
                </div>
              </Card>
              <Card className="p-5">
                <h3 className="font-semibold text-slate-900 mb-3">Active Sessions</h3>
                {[
                  { device: "Chrome on Windows 11", location: "Dhaka, BD", current: true, time: "Now" },
                  { device: "Mobile App (Android)", location: "Dhaka, BD", current: false, time: "2 days ago" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b last:border-none border-slate-100">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{s.device}</p>
                      <p className="text-xs text-slate-500">{s.location} · {s.time}</p>
                    </div>
                    {s.current ? <span className="text-xs text-emerald-600 font-medium">Current</span> : <Button variant="ghost" size="sm" className="text-red-500">Revoke</Button>}
                  </div>
                ))}
              </Card>
            </div>
          )}

          {activeSection === "API Access" && (
            <Card className="p-6">
              <h2 className="font-semibold text-slate-900 mb-4">API Access</h2>
              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <p className="text-xs font-semibold text-slate-500 mb-1.5">Your API Key</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs font-mono text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2 truncate">
                    pg_live_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                  </code>
                  <Button variant="secondary" size="sm">Copy</Button>
                  <Button variant="danger" size="sm">Regenerate</Button>
                </div>
              </div>
              <p className="text-xs text-slate-500">Keep your API key secure. Never share it publicly. Regenerating will invalidate the old key.</p>
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Webhook URL</h3>
                <Input placeholder="https://yourstore.com/webhook/parcelguard" />
                <p className="text-xs text-slate-500 mt-1.5">We'll send delivery status updates to this URL.</p>
              </div>
              <div className="flex justify-end mt-5">
                <Button>Save API Settings</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
