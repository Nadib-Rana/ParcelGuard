import { useState } from "react";
import { Search, ChevronDown, ChevronUp, MessageSquare, Phone, Mail } from "lucide-react";
import { Card, Button } from "../components/ui";
import SupportTicketModal from "../components/help/SupportTicketModal";

const faqs = [
  { q: "How does ParcelGuard calculate Fraud Risk scores?", a: "ParcelGuard analyzes national delivery completion rates, order history, and reported returns across thousands of Bangladeshi merchants in real-time." },
  { q: "How do I connect my Steadfast or Pathao API keys?", a: "Go to Courier Accounts from the sidebar, click Connect on your desired courier, and paste your API Key & Secret Key generated from your courier merchant portal." },
  { q: "What is the standard format for Bulk CSV Uploads?", a: "You can download our sample template with Customer Name, Phone (11 digits), Address, District, COD Amount, and Product Name." },
  { q: "How does thermal 4x6 label printing work?", a: "Go to Bulk Labels, choose 4x6 Thermal format, select your parcels, and click Print Labels. The output is formatted with standard high-contrast barcodes." },
  { q: "When are COD payments settled?", a: "COD settlements depend on your courier cycle (usually 2-3 business days after delivery). You can track batch payouts in the Payments tab." },
];

export default function Help() {
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showTicketModal, setShowTicketModal] = useState(false);

  const filteredFaqs = faqs.filter(
    f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-screen-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Help Center & FAQ</h1>
          <p className="text-sm text-slate-500 mt-0.5">Find answers to common questions or reach out to our dedicated merchant support.</p>
        </div>
        <Button size="sm" onClick={() => setShowTicketModal(true)}>
          <MessageSquare size={14} /> Open Support Ticket
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search questions, courier guides, API help..."
          className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      {/* FAQ Accordion */}
      <Card className="p-5 space-y-3">
        <h2 className="font-bold text-slate-900 text-sm mb-2">Frequently Asked Questions</h2>
        {filteredFaqs.map((faq, idx) => (
          <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              className="w-full flex items-center justify-between p-3.5 text-left bg-slate-50/50 hover:bg-slate-50 transition-colors text-xs font-bold text-slate-800"
            >
              <span>{faq.q}</span>
              {openFaq === idx ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
            {openFaq === idx && (
              <div className="p-3.5 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </Card>

      {/* Contact Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Phone size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">Phone Support</p>
            <p className="text-xs text-slate-500 font-mono">+880 9612-000000 (10 AM - 8 PM)</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Mail size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">Email Support</p>
            <p className="text-xs text-slate-500 font-mono">support@parcelguard.com.bd</p>
          </div>
        </Card>
      </div>

      {showTicketModal && <SupportTicketModal onClose={() => setShowTicketModal(false)} />}
    </div>
  );
}
