import { useState } from "react";
import { HelpCircle, Search, MessageSquare, BookOpen, Shield, Truck, Wallet, FileText, ChevronDown, ChevronUp, Send, CheckCircle2, Phone, Mail } from "lucide-react";
import { Card, Button, Input } from "../components/ui";

const categories = [
  { id: "all", label: "All Topics", icon: BookOpen },
  { id: "fraud", label: "Fraud Checker", icon: Shield },
  { id: "courier", label: "Couriers & Booking", icon: Truck },
  { id: "payments", label: "COD & Payments", icon: Wallet },
  { id: "bulk", label: "Bulk Upload", icon: FileText },
];

const faqs = [
  {
    cat: "fraud",
    q: "How does ParcelGuard calculate customer risk scores?",
    a: "ParcelGuard's Risk Intelligence Engine analyzes historical delivery records across thousands of participating Bangladeshi F-commerce merchants. It measures parcel return ratios, refusal patterns, cancellation frequency, and verified recipient addresses to generate a real-time risk score between 0 and 100.",
  },
  {
    cat: "fraud",
    q: "What should I do if a customer is flagged as 'High Risk'?",
    a: "We strongly recommend requesting advance payment for the courier delivery charge (usually ৳130–৳150) before shipping. If the customer is genuine, they will readily pay the delivery charge; fraudulent buyers will usually disappear, saving you product return losses.",
  },
  {
    cat: "courier",
    q: "Which courier services are supported for unified booking?",
    a: "ParcelGuard natively integrates with Steadfast Courier, Pathao Courier, RedX, and Paperfly. You can connect your merchant API keys under the Courier Accounts section to book parcels across all couriers from a single dashboard.",
  },
  {
    cat: "courier",
    q: "How do tracking updates sync with couriers?",
    a: "Tracking updates sync automatically via webhooks and background polling every 15 minutes. When a delivery agent marks an order as 'Out for Delivery' or 'Delivered' in their courier system, it immediately updates inside ParcelGuard.",
  },
  {
    cat: "payments",
    q: "How does COD reconciliation and discrepancy detection work?",
    a: "When couriers release settlement statements, ParcelGuard compares the expected COD amount against the actual payout deposited. If there is any variance (such as uncredited parcels or unauthorized delivery deductions), ParcelGuard highlights the discrepancy in amber/red and lets you raise an automated dispute ticket.",
  },
  {
    cat: "bulk",
    q: "What is the recommended file format for bulk parcel uploads?",
    a: "We support standard `.csv` and `.xlsx` files. The file must include columns for Customer Name, Phone Number, Full Address, District, and COD Amount. You can download the pre-formatted sample CSV from the Bulk Upload page.",
  },
];

export default function Help() {
  const [selectedCat, setSelectedCat] = useState("all");
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMsg, setTicketMsg] = useState("");
  const [ticketSent, setTicketSent] = useState(false);

  const filteredFaqs = faqs.filter(f => {
    const matchCat = selectedCat === "all" || f.cat === selectedCat;
    const matchSearch = f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMsg) return;
    setTicketSent(true);
    setTimeout(() => {
      setTicketSent(false);
      setShowSupportModal(false);
      setTicketSubject("");
      setTicketMsg("");
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-screen-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-indigo-200 mb-3">
            <HelpCircle size={13} /> ParcelGuard Support & Knowledge Base
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">How can we help you today?</h1>
          <p className="text-indigo-200 text-sm mt-1">Search our knowledge base or get in touch with our Dhaka merchant support team.</p>

          {/* Search Box */}
          <div className="relative mt-5">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search questions, courier APIs, COD disputes, fraud checks..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white text-slate-900 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Support Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 flex items-start gap-4 hover:border-indigo-300 transition-all cursor-pointer" onClick={() => setShowSupportModal(true)}>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
            <MessageSquare size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">Direct Merchant Support</h3>
            <p className="text-xs text-slate-500 mt-0.5">Live ticket submission & resolution within 2 business hours.</p>
            <span className="text-xs font-semibold text-indigo-600 mt-2 inline-block">Contact Support &rarr;</span>
          </div>
        </Card>

        <Card className="p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <Phone size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">Merchant Helpline</h3>
            <p className="text-xs text-slate-500 mt-0.5">+880 9612-PARCEL (09:00 AM – 10:00 PM BDT)</p>
            <span className="text-xs font-semibold text-emerald-600 mt-2 inline-block">Available 7 Days a week</span>
          </div>
        </Card>

        <Card className="p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
            <Mail size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">Email Inquiries</h3>
            <p className="text-xs text-slate-500 mt-0.5">support@parcelguard.bd</p>
            <span className="text-xs font-semibold text-amber-600 mt-2 inline-block">Response within 4 hours</span>
          </div>
        </Card>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSelectedCat(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCat === id
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-3">
        <h2 className="font-bold text-slate-900 text-base">Frequently Asked Questions</h2>
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openFaq === idx;
          return (
            <Card key={idx} className="overflow-hidden transition-all">
              <button
                onClick={() => setOpenFaq(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="text-sm font-semibold text-slate-900 pr-4">{faq.q}</span>
                {isOpen ? <ChevronUp size={16} className="text-indigo-600 flex-shrink-0" /> : <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />}
              </button>
              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </Card>
          );
        })}
        {filteredFaqs.length === 0 && (
          <Card className="p-8 text-center text-sm text-slate-400">
            No FAQ articles match your search. Click "Contact Support" above to ask our team directly.
          </Card>
        )}
      </div>

      {/* Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setShowSupportModal(false)} />
          <Card className="relative z-10 w-full max-w-lg p-6 shadow-2xl">
            {ticketSent ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 size={32} className="text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Support Ticket Created!</h3>
                <p className="text-xs text-slate-500 mt-1">Ticket #PG-SUP-{Math.floor(Math.random() * 9000 + 1000)} has been dispatched to our support team.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-bold text-slate-900">Create Support Ticket</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Our support engineers will review and respond promptly.</p>
                  </div>
                </div>

                <form onSubmit={handleSendTicket} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Category</label>
                    <select className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                      <option>Courier API Integration Issue</option>
                      <option>COD Settlement Discrepancy</option>
                      <option>Fraud Checker Report Inquiry</option>
                      <option>Bulk Upload Validation Error</option>
                      <option>Account & Billing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                    <input
                      type="text"
                      value={ticketSubject}
                      onChange={e => setTicketSubject(e.target.value)}
                      placeholder="e.g. Steadfast webhook not updating delivered status"
                      required
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Details</label>
                    <textarea
                      rows={4}
                      value={ticketMsg}
                      onChange={e => setTicketMsg(e.target.value)}
                      placeholder="Please include Tracking ID or Settlement ID if applicable..."
                      required
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                    />
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <Button variant="secondary" size="sm" onClick={() => setShowSupportModal(false)}>Cancel</Button>
                    <Button type="submit" size="sm">
                      <Send size={13} /> Submit Ticket
                    </Button>
                  </div>
                </form>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
