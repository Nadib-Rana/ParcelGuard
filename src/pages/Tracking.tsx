import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Package, MapPin, CheckCircle2, Truck, Clock, AlertTriangle, XCircle } from "lucide-react";
import { useData, type Parcel } from "../context/DataContext";
import { Card, Button, RiskBadge, StatusBadge, Badge } from "../components/ui";

export default function Tracking() {
  const [searchParams] = useSearchParams();
  const { parcels } = useData();

  const [trackId, setTrackId] = useState(searchParams.get("id") ?? "PG-102845");
  const [currentParcel, setCurrentParcel] = useState<Parcel | null>(null);

  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl) {
      setTrackId(idFromUrl);
      findParcel(idFromUrl);
    } else if (trackId) {
      findParcel(trackId);
    }
  }, [searchParams]);

  const findParcel = (idToFind: string) => {
    const clean = idToFind.trim().toUpperCase();
    const found = parcels.find(p => p.id.toUpperCase() === clean);
    if (found) {
      setCurrentParcel(found);
    } else if (clean) {
      // Synthetic fallback for random IDs
      setCurrentParcel({
        id: clean,
        customer: "Customer",
        phone: "01711-XXXXXX",
        address: "Dhaka Central Area",
        district: "Dhaka",
        product: "E-Commerce Package",
        courier: "Steadfast",
        cod: 1500,
        charge: 110,
        advance: 0,
        risk: "Safe",
        status: "In Transit",
        date: "24 Aug 2026",
        createdAt: new Date().toISOString(),
      });
    }
  };

  const handleTrack = () => {
    findParcel(trackId);
  };

  const getTimeline = (status: Parcel["status"]) => {
    const base = [
      { event: "Order Created & Registered", time: "Aug 24, 10:30 AM", loc: "Merchant Warehouse (Uttara)", done: true, icon: Package },
      { event: "Picked Up by Courier Rider", time: "Aug 24, 04:20 PM", loc: "Local Hub Dispatch", done: status !== "Pending Pickup", icon: Truck },
      { event: "Arrived at Central Sorting Hub", time: "Aug 25, 09:15 AM", loc: "Tejgaon Logistics Center", done: ["In Transit", "Out for Delivery", "Delivered", "Returned"].includes(status), icon: MapPin },
      { event: "Out for Final Delivery", time: "Aug 26, 08:10 AM", loc: currentParcel?.agentName ? `Rider: ${currentParcel.agentName} (${currentParcel.agentPhone})` : "Delivery Agent Assigned", done: ["Out for Delivery", "Delivered", "Returned"].includes(status), icon: Truck },
    ];

    if (status === "Returned") {
      base.push({ event: "Parcel Refused & Returned to Merchant", time: "Aug 26, 04:00 PM", loc: "Return Hub (Dhaka)", done: true, icon: AlertTriangle });
    } else if (status === "Cancelled") {
      base.push({ event: "Order Cancelled by Merchant", time: "Aug 25, 02:00 PM", loc: "Order Voided", done: true, icon: XCircle });
    } else {
      base.push({ event: "Successfully Delivered to Recipient", time: "Aug 26, 03:45 PM", loc: "Recipient Received & Paid COD", done: status === "Delivered", icon: CheckCircle2 });
    }

    return base;
  };

  const timeline = currentParcel ? getTimeline(currentParcel.status) : [];

  return (
    <div className="p-6 space-y-6 max-w-screen-xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Live Parcel Tracking</h1>
        <p className="text-sm text-slate-500 mt-0.5">Real-time status updates across all connected courier networks.</p>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={trackId}
            onChange={e => setTrackId(e.target.value)}
            placeholder="Enter Tracking ID (e.g. PG-102845)"
            className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono font-bold"
            onKeyDown={e => e.key === "Enter" && handleTrack()}
          />
          <Button onClick={handleTrack}>
            <Search size={14} /> Track Parcel
          </Button>
        </div>
      </Card>

      {currentParcel ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-mono font-bold text-slate-900">{currentParcel.id}</h2>
                  <Badge variant="indigo">{currentParcel.courier}</Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Booked on {currentParcel.date} · Item: {currentParcel.product}</p>
              </div>
              <StatusBadge status={currentParcel.status} />
            </div>

            <div className="relative pl-2">
              {timeline.map((t, i) => {
                const Icon = t.icon;
                const isLast = i === timeline.length - 1;
                return (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                          t.done
                            ? t.event.includes("Returned")
                              ? "bg-red-500 text-white"
                              : "bg-emerald-500 text-white shadow-md shadow-emerald-200"
                            : "bg-slate-200 text-slate-400"
                        }`}
                      >
                        <Icon size={15} />
                      </div>
                      {!isLast && (
                        <div
                          className={`w-0.5 flex-1 my-1 ${t.done ? "bg-emerald-300" : "bg-slate-200"}`}
                          style={{ minHeight: "36px" }}
                        />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className={`text-sm font-bold ${t.done ? "text-slate-900" : "text-slate-400"}`}>{t.event}</p>
                      <p className="text-xs text-indigo-600 font-semibold mt-0.5">{t.time}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{t.loc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Shipment Details Sidebar */}
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Customer Information</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-500">Name:</span><span className="font-semibold text-slate-900">{currentParcel.customer}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Phone:</span><span className="font-mono font-semibold text-slate-900">{currentParcel.phone}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Address:</span><span className="font-medium text-slate-800 text-right max-w-[180px]">{currentParcel.address}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">District:</span><span className="font-bold text-slate-900">{currentParcel.district}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Risk Assessment:</span><RiskBadge level={currentParcel.risk} /></div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Shipment & COD</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-500">Courier Partner:</span><span className="font-bold text-indigo-600">{currentParcel.courier}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">COD Total:</span><span className="font-bold text-emerald-600 text-sm">৳{currentParcel.cod.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Delivery Charge:</span><span className="font-medium text-slate-700">৳{currentParcel.charge}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Current Status:</span><StatusBadge status={currentParcel.status} /></div>
              </div>
            </Card>

            {currentParcel.agentName && (
              <Card className="p-4 bg-indigo-50/50 border-indigo-100">
                <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <Truck size={13} /> Delivery Rider
                </h3>
                <p className="text-xs font-bold text-slate-900">{currentParcel.agentName}</p>
                <p className="text-xs font-mono text-slate-600 mt-0.5">📞 {currentParcel.agentPhone}</p>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MapPin size={28} className="text-slate-400" />
          </div>
          <h3 className="font-semibold text-slate-900">Enter a Tracking ID</h3>
          <p className="text-xs text-slate-500 mt-1">Enter any PG tracking ID above to see live milestones and courier rider info.</p>
        </Card>
      )}
    </div>
  );
}
