import { useState } from "react";
import { Upload, FileText, Download, AlertTriangle, CheckCircle, X } from "lucide-react";
import { Card, Button, RiskBadge, Badge } from "../components/ui";

const previewData = [
  { customer: "Rahim Uddin", phone: "01711-234567", address: "Mirpur-10, Dhaka", cod: "৳1,250", risk: "Safe" as const, courier: "Steadfast", status: "valid" },
  { customer: "Karim Hasan", phone: "01812-345678", address: "Khilgaon, Dhaka", cod: "৳2,500", risk: "High Risk" as const, courier: "Pathao", status: "valid" },
  { customer: "Nasrin Akter", phone: "INVALID", address: "Sylhet Sadar", cod: "৳850", risk: "Safe" as const, courier: "—", status: "error" },
  { customer: "Farhan Hossain", phone: "01614-567890", address: "Bogura Sadar", cod: "৳3,200", risk: "Moderate" as const, courier: "Steadfast", status: "valid" },
  { customer: "Sadia Islam", phone: "01515-678901", address: "Chittagong", cod: "", risk: "Safe" as const, courier: "RedX", status: "error" },
];

export default function BulkUpload() {
  const [uploaded, setUploaded] = useState(false);
  const [dragging, setDragging] = useState(false);

  return (
    <div className="p-6 space-y-6 max-w-screen-xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Bulk Parcel Upload</h1>
        <p className="text-sm text-slate-500 mt-0.5">Upload hundreds of orders and book them in minutes.</p>
      </div>

      {!uploaded ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <div
              className={`p-12 text-center border-2 border-dashed rounded-xl bg-white transition-all ${dragging ? "border-indigo-400 bg-indigo-50" : "border-slate-300 hover:border-slate-400"}`}
              onDragOver={(e: React.DragEvent) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e: React.DragEvent) => { e.preventDefault(); setDragging(false); setUploaded(true); }}
            >
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload size={28} className="text-indigo-500" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Drag & Drop your file here</h3>
              <p className="text-sm text-slate-500 mb-5">Supports CSV and Excel (.xlsx) files</p>
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => setUploaded(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                  <Upload size={13} className="inline mr-1.5" />Upload File
                </button>
                <Button variant="secondary">
                  <Download size={13} /> Download Sample
                </Button>
              </div>
            </div>
          </div>

          <Card className="p-5 h-fit">
            <h3 className="font-semibold text-slate-900 mb-3">File Format Guide</h3>
            <div className="space-y-2 text-sm text-slate-600">
              <p className="font-medium text-slate-700">Required columns:</p>
              {["Customer Name", "Phone Number", "Full Address", "District", "COD Amount", "Product Name"].map(c => (
                <div key={c} className="flex items-center gap-2">
                  <CheckCircle size={12} className="text-emerald-500 flex-shrink-0" />
                  <span className="text-xs">{c}</span>
                </div>
              ))}
              <p className="font-medium text-slate-700 mt-4">Optional columns:</p>
              {["Courier Preference", "Weight", "Special Notes"].map(c => (
                <div key={c} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border border-slate-300 flex-shrink-0" />
                  <span className="text-xs">{c}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Orders", value: "500", icon: <FileText size={18} />, color: "text-indigo-600 bg-indigo-50" },
              { label: "Valid Orders", value: "472", icon: <CheckCircle size={18} />, color: "text-emerald-600 bg-emerald-50" },
              { label: "Need Attention", value: "28", icon: <AlertTriangle size={18} />, color: "text-amber-600 bg-amber-50" },
            ].map(s => (
              <Card key={s.label} className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>{s.icon}</div>
                <div>
                  <p className="text-xs text-slate-500">{s.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                </div>
              </Card>
            ))}
          </div>

          <Card>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">Order Preview</h2>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm"><X size={13} /> Fix Errors</Button>
                <Button size="sm"><CheckCircle size={13} /> Continue Booking</Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    {["Customer", "Phone", "Address", "COD", "Risk", "Courier", "Status"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((p, i) => (
                    <tr key={i} className={`border-b border-slate-50 hover:bg-slate-50 ${p.status === "error" ? "bg-red-50/50" : ""}`}>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">{p.customer}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-mono ${p.status === "error" && p.phone === "INVALID" ? "text-red-600 font-semibold" : "text-slate-500"}`}>
                          {p.phone}
                          {p.status === "error" && p.phone === "INVALID" && " ⚠ Invalid format"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">{p.address}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                        {p.cod || <span className="text-red-600 text-xs font-semibold">⚠ Missing</span>}
                      </td>
                      <td className="px-4 py-3"><RiskBadge level={p.risk} /></td>
                      <td className="px-4 py-3"><Badge variant={p.courier === "—" ? "gray" : "indigo"}>{p.courier}</Badge></td>
                      <td className="px-4 py-3">
                        {p.status === "valid"
                          ? <Badge variant="success">✓ Valid</Badge>
                          : <Badge variant="danger">⚠ Error</Badge>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
