import { useState } from "react";
import { Upload, FileText, Download, AlertTriangle, CheckCircle, X, Check, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useData, type Parcel } from "../context/DataContext";
import { Card, Button, RiskBadge, Badge } from "../components/ui";

interface BulkRow {
  id: number;
  customer: string;
  phone: string;
  address: string;
  district: string;
  cod: string;
  product: string;
  courier: "Steadfast" | "Pathao" | "RedX";
  risk: "Safe" | "Moderate" | "High Risk";
  status: "valid" | "error";
  errorMsg?: string;
}

const defaultRows: BulkRow[] = [
  { id: 1, customer: "Rahim Uddin", phone: "01711234567", address: "Mirpur-10, Dhaka", district: "Dhaka", cod: "1250", product: "Cotton Shirt", risk: "Safe", courier: "Steadfast", status: "valid" },
  { id: 2, customer: "Karim Hasan", phone: "01812345678", address: "Khilgaon, Dhaka", district: "Dhaka", cod: "2500", product: "Earbuds", risk: "High Risk", courier: "Pathao", status: "valid" },
  { id: 3, customer: "Nasrin Akter", phone: "0191", address: "Sylhet Sadar", district: "Sylhet", cod: "850", product: "Silk Saree", risk: "Safe", courier: "RedX", status: "error", errorMsg: "Invalid phone number (must be 11 digits)" },
  { id: 4, customer: "Farhan Hossain", phone: "01614567890", address: "Bogura Sadar", district: "Bogura", cod: "3200", product: "Leather Belt", risk: "Moderate", courier: "Steadfast", status: "valid" },
  { id: 5, customer: "Sadia Islam", phone: "01515678901", address: "", district: "Chattogram", cod: "1800", product: "Skincare", risk: "Safe", courier: "RedX", status: "error", errorMsg: "Missing full address" },
  { id: 6, customer: "Jahangir Alam", phone: "01716789012", address: "Rajshahi University", district: "Rajshahi", cod: "0", product: "Smart Watch", risk: "High Risk", courier: "Pathao", status: "error", errorMsg: "COD Amount cannot be 0" },
];

export default function BulkUpload() {
  const { bulkAddParcels, generateSampleCSV } = useData();
  const navigate = useNavigate();

  const [uploaded, setUploaded] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [rows, setRows] = useState<BulkRow[]>(defaultRows);
  const [editingRow, setEditingRow] = useState<BulkRow | null>(null);
  const [showFixModal, setShowFixModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const validateRow = (row: Partial<BulkRow>): { status: "valid" | "error"; errorMsg?: string } => {
    const cleanPhone = (row.phone || "").replace(/\D/g, "");
    if (cleanPhone.length !== 11 || !cleanPhone.startsWith("01")) {
      return { status: "error", errorMsg: "Invalid Bangladeshi phone number (11 digits required)" };
    }
    if (!row.address || row.address.trim().length < 4) {
      return { status: "error", errorMsg: "Delivery address is too short or missing" };
    }
    const codNum = Number(row.cod);
    if (isNaN(codNum) || codNum <= 0) {
      return { status: "error", errorMsg: "Invalid COD amount" };
    }
    return { status: "valid" };
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const text = event.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (csvText: string) => {
    const lines = csvText.split("\n").map(l => l.trim()).filter(Boolean);
    if (lines.length <= 1) {
      setUploaded(true);
      return;
    }

    const parsed: BulkRow[] = lines.slice(1).map((line, idx) => {
      const cols = line.split(",").map(c => c.replace(/^"|"$/g, "").trim());
      const rawRow: Partial<BulkRow> = {
        id: idx + 1,
        customer: cols[0] || `Customer ${idx + 1}`,
        phone: cols[1] || "",
        address: cols[2] || "",
        district: cols[3] || "Dhaka",
        cod: cols[4] || "0",
        product: cols[5] || "Item",
        courier: (cols[7] as any) || "Steadfast",
        risk: "Safe",
      };

      const validation = validateRow(rawRow);
      return {
        ...rawRow,
        status: validation.status,
        errorMsg: validation.errorMsg,
      } as BulkRow;
    });

    setRows(parsed);
    setUploaded(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRow) return;

    const validation = validateRow(editingRow);
    const updated: BulkRow = {
      ...editingRow,
      status: validation.status,
      errorMsg: validation.errorMsg,
    };

    setRows(prev => prev.map(r => (r.id === updated.id ? updated : r)));
    setEditingRow(null);
  };

  const handleContinueBooking = () => {
    const validOnes = rows.filter(r => r.status === "valid");
    if (validOnes.length === 0) return;

    const toBook = validOnes.map(r => ({
      customer: r.customer,
      phone: r.phone,
      address: r.address,
      district: r.district || "Dhaka",
      product: r.product || "General Item",
      courier: r.courier || "Steadfast",
      cod: Number(r.cod) || 1000,
      charge: r.district === "Dhaka" ? 110 : 150,
      advance: 0,
      risk: r.risk,
      status: "Pending Pickup" as Parcel["status"],
    }));

    bulkAddParcels(toBook);
    setBookingSuccess(true);
    setTimeout(() => {
      navigate("/parcels");
    }, 1500);
  };

  const validCount = rows.filter(r => r.status === "valid").length;
  const errorCount = rows.filter(r => r.status === "error").length;

  return (
    <div className="p-6 space-y-6 max-w-screen-xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Bulk Parcel Upload & Dispatch</h1>
        <p className="text-sm text-slate-500 mt-0.5">Upload bulk customer orders via CSV or Excel and book them in one click.</p>
      </div>

      {!uploaded ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <div
              className={`p-12 text-center border-2 border-dashed rounded-2xl bg-white transition-all ${
                dragging ? "border-indigo-500 bg-indigo-50" : "border-slate-300 hover:border-slate-400"
              }`}
              onDragOver={e => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => {
                e.preventDefault();
                setDragging(false);
                const file = e.dataTransfer.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = ev => parseCSV(ev.target?.result as string);
                  reader.readAsText(file);
                } else {
                  setUploaded(true);
                }
              }}
            >
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload size={28} className="text-indigo-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Drag & Drop your CSV/Excel file</h3>
              <p className="text-xs text-slate-500 mb-5">Supports .csv and standard exported order sheets</p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <label className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5">
                  <Upload size={13} /> Choose File
                  <input type="file" accept=".csv,.xlsx" onChange={handleFileUpload} className="hidden" />
                </label>
                <Button variant="secondary" size="sm" onClick={generateSampleCSV}>
                  <Download size={13} /> Download Sample Template
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setUploaded(true)}>
                  Load Demo Data
                </Button>
              </div>
            </div>
          </div>

          <Card className="p-5 h-fit">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Required Columns Guide</h3>
            <div className="space-y-2 text-xs text-slate-600">
              <p className="font-semibold text-slate-700">Mandatory fields:</p>
              {["Customer Name", "Phone Number (11 Digits)", "Full Address", "District", "COD Amount", "Product Name"].map(c => (
                <div key={c} className="flex items-center gap-2">
                  <CheckCircle size={12} className="text-emerald-500 flex-shrink-0" />
                  <span>{c}</span>
                </div>
              ))}
              <p className="font-semibold text-slate-700 mt-4">Optional fields:</p>
              {["Weight", "Courier Preference", "Special Notes"].map(c => (
                <div key={c} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full border border-slate-300 flex-shrink-0" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileText size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">Total Orders Parsed</p>
                <p className="text-2xl font-black text-slate-900">{rows.length}</p>
              </div>
            </Card>

            <Card className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">Valid for Booking</p>
                <p className="text-2xl font-black text-emerald-600">{validCount}</p>
              </div>
            </Card>

            <Card className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">Need Attention</p>
                <p className="text-2xl font-black text-amber-600">{errorCount}</p>
              </div>
            </Card>
          </div>

          {/* Table */}
          <Card>
            <div className="flex flex-wrap items-center justify-between px-5 py-4 border-b border-slate-100 gap-3">
              <div>
                <h2 className="font-bold text-slate-900 text-sm">Bulk Order Validation Preview</h2>
                <p className="text-xs text-slate-500 mt-0.5">Click edit icon on any row to correct validation warnings.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => setUploaded(false)}>
                  <X size={13} /> Re-Upload
                </Button>
                <Button size="sm" onClick={handleContinueBooking} disabled={validCount === 0}>
                  <Check size={13} /> {bookingSuccess ? "Booking..." : `Book ${validCount} Valid Orders`}
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    {["#", "Customer", "Phone", "Address", "COD", "Courier", "Status", "Action"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((p, idx) => (
                    <tr
                      key={p.id}
                      className={`border-b border-slate-50 hover:bg-slate-50/80 transition-colors ${
                        p.status === "error" ? "bg-red-50/40" : ""
                      }`}
                    >
                      <td className="px-4 py-3 text-xs font-mono text-slate-400">{idx + 1}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900 whitespace-nowrap">{p.customer}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-mono ${p.status === "error" && p.errorMsg?.includes("phone") ? "text-red-600 font-bold" : "text-slate-600"}`}>
                          {p.phone || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600 max-w-xs truncate">
                        {p.address || <span className="text-red-500 font-semibold italic">Missing Address</span>}
                      </td>
                      <td className="px-4 py-3 text-xs font-bold text-slate-900">
                        {p.cod && p.cod !== "0" ? `৳${Number(p.cod).toLocaleString()}` : <span className="text-red-500 font-semibold">৳0</span>}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="indigo">{p.courier}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        {p.status === "valid" ? (
                          <Badge variant="success">✓ Valid</Badge>
                        ) : (
                          <div className="flex items-center gap-1 text-[11px] text-red-600 font-medium">
                            <AlertTriangle size={12} className="flex-shrink-0" />
                            <span className="truncate max-w-[180px]">{p.errorMsg}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setEditingRow(p)}
                          className="p-1.5 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"
                          title="Edit Row"
                        >
                          <Edit3 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Inline Fix Modal */}
      {editingRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setEditingRow(null)} />
          <Card className="relative z-10 w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900 text-base">Edit & Fix Order Details</h2>
              <button onClick={() => setEditingRow(null)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={editingRow.customer}
                  onChange={e => setEditingRow({ ...editingRow, customer: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={editingRow.phone}
                  onChange={e => setEditingRow({ ...editingRow, phone: e.target.value })}
                  placeholder="01711234567"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Address</label>
                <input
                  type="text"
                  value={editingRow.address}
                  onChange={e => setEditingRow({ ...editingRow, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    value={editingRow.district}
                    onChange={e => setEditingRow({ ...editingRow, district: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">COD Amount (৳)</label>
                  <input
                    type="text"
                    value={editingRow.cod}
                    onChange={e => setEditingRow({ ...editingRow, cod: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Courier</label>
                <select
                  value={editingRow.courier}
                  onChange={e => setEditingRow({ ...editingRow, courier: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                >
                  <option value="Steadfast">Steadfast</option>
                  <option value="Pathao">Pathao</option>
                  <option value="RedX">RedX</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <Button variant="secondary" size="sm" onClick={() => setEditingRow(null)}>Cancel</Button>
                <Button type="submit" size="sm">Save & Validate</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
