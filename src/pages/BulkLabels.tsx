import { useState } from "react";
import { Printer, Download, CheckSquare, Square, Search } from "lucide-react";
import { useData } from "../context/DataContext";
import { Card, Button, Badge } from "../components/ui";
import ShippingLabel from "../components/labels/ShippingLabel";

type LabelFormat = "4x6" | "100x150" | "a4";

export default function BulkLabels() {
  const { parcels, settings } = useData();
  const [selectedIds, setSelectedIds] = useState<string[]>(() => parcels.slice(0, 3).map(p => p.id));
  const [format, setFormat] = useState<LabelFormat>("4x6");
  const [search, setSearch] = useState("");
  const [courierFilter, setCourierFilter] = useState("All");

  const filteredParcels = parcels.filter(p => {
    const matchSearch = p.customer.toLowerCase().includes(search.toLowerCase()) || p.id.includes(search) || p.phone.includes(search);
    const matchCourier = courierFilter === "All" || p.courier === courierFilter;
    return matchSearch && matchCourier;
  });

  const selectedParcels = parcels.filter(p => selectedIds.includes(p.id));

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredParcels.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredParcels.map(p => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6 max-w-screen-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Bulk Label & Barcode Printing</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Generate and print courier shipping labels, thermal stickers, and A4 packing slips.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handlePrint} disabled={selectedIds.length === 0}>
            <Download size={13} /> Export PDF
          </Button>
          <Button size="sm" onClick={handlePrint} disabled={selectedIds.length === 0}>
            <Printer size={14} /> Print Selected ({selectedIds.length})
          </Button>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Parcel Selection List */}
        <div className="xl:col-span-5 space-y-4 print:hidden">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  {selectedIds.length === filteredParcels.length && filteredParcels.length > 0 ? (
                    <CheckSquare size={16} className="text-indigo-600" />
                  ) : (
                    <Square size={16} className="text-slate-400" />
                  )}
                  {selectedIds.length === filteredParcels.length ? "Deselect All" : "Select All"}
                </button>
                <span className="text-xs text-slate-400">· {selectedIds.length} of {filteredParcels.length} selected</span>
              </div>
              <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                {selectedIds.length} Ready to print
              </span>
            </div>

            {/* Search and filter */}
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search ID, customer, phone..."
                  className="w-full pl-7 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <select
                value={courierFilter}
                onChange={e => setCourierFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none"
              >
                <option value="All">All Couriers</option>
                <option value="Steadfast">Steadfast</option>
                <option value="Pathao">Pathao</option>
                <option value="RedX">RedX</option>
              </select>
            </div>

            {/* Parcel List */}
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {filteredParcels.map(p => {
                const isSelected = selectedIds.includes(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => toggleSelectOne(p.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-indigo-50/50 border-indigo-300 ring-1 ring-indigo-400/30"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex-shrink-0 text-indigo-600">
                        {isSelected ? <CheckSquare size={17} /> : <Square size={17} className="text-slate-300" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-900">{p.id}</span>
                          <Badge variant="indigo">{p.courier}</Badge>
                        </div>
                        <p className="text-sm font-medium text-slate-900 truncate">{p.customer}</p>
                        <p className="text-xs text-slate-500 truncate">{p.address}, {p.district}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold text-slate-900">৳{p.cod.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{p.phone}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column: Print Controls & Live Preview */}
        <div className="xl:col-span-7 space-y-4">
          <Card className="p-4 print:hidden">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">Label Format:</span>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                  {[
                    { id: "4x6", label: "4 × 6 inch (Thermal)" },
                    { id: "100x150", label: "100 × 150 mm" },
                    { id: "a4", label: "A4 Invoice Sheet" },
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setFormat(f.id as LabelFormat)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                        format === f.id ? "bg-white text-slate-900 shadow-sm font-semibold" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button size="sm" onClick={handlePrint} disabled={selectedParcels.length === 0}>
                <Printer size={13} /> Print Now
              </Button>
            </div>
          </Card>

          {/* Printable Container */}
          <div className="space-y-6 print:space-y-8">
            {selectedParcels.length === 0 ? (
              <Card className="p-12 text-center print:hidden">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                  <Printer size={28} className="text-indigo-400" />
                </div>
                <h3 className="font-semibold text-slate-900">No Parcels Selected</h3>
                <p className="text-sm text-slate-500 mt-1">Select one or more parcels from the left list to preview and print labels.</p>
              </Card>
            ) : (
              selectedParcels.map(parcel => (
                <ShippingLabel key={parcel.id} parcel={parcel} format={format} settings={settings} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
