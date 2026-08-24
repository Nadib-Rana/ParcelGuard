import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData, type Parcel } from "../context/DataContext";
import BulkDropzone from "../components/bulk-upload/BulkDropzone";
import BulkValidationTable, { type BulkRow } from "../components/bulk-upload/BulkValidationTable";
import BulkEditModal from "../components/bulk-upload/BulkEditModal";

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
      return { ...rawRow, status: validation.status, errorMsg: validation.errorMsg } as BulkRow;
    });

    setRows(parsed);
    setUploaded(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => parseCSV(event.target?.result as string);
    reader.readAsText(file);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRow) return;
    const validation = validateRow(editingRow);
    const updated: BulkRow = { ...editingRow, status: validation.status, errorMsg: validation.errorMsg };
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
      createdAt: new Date().toISOString(),
    }));

    bulkAddParcels(toBook);
    setBookingSuccess(true);
    setTimeout(() => navigate("/parcels"), 1500);
  };

  return (
    <div className="p-6 space-y-6 max-w-screen-xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Bulk Parcel Upload & Dispatch</h1>
        <p className="text-sm text-slate-500 mt-0.5">Upload bulk customer orders via CSV or Excel and book them in one click.</p>
      </div>

      {!uploaded ? (
        <BulkDropzone
          dragging={dragging}
          setDragging={setDragging}
          onDropFile={file => {
            const reader = new FileReader();
            reader.onload = ev => parseCSV(ev.target?.result as string);
            reader.readAsText(file);
          }}
          onFileInput={handleFileUpload}
          onSampleDownload={generateSampleCSV}
          onLoadDemo={() => setUploaded(true)}
        />
      ) : (
        <BulkValidationTable
          rows={rows}
          bookingSuccess={bookingSuccess}
          onReupload={() => setUploaded(false)}
          onContinueBooking={handleContinueBooking}
          onEditRow={setEditingRow}
        />
      )}

      {editingRow && (
        <BulkEditModal
          editingRow={editingRow}
          setEditingRow={setEditingRow}
          onSaveEdit={handleSaveEdit}
        />
      )}
    </div>
  );
}
