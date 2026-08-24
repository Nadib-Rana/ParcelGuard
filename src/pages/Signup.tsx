import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, ArrowRight, AlertCircle, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const steps = ["Account Info", "Business Details", "Done"];

export default function Signup() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [bizName, setBizName] = useState("");
  const [bizType, setBizType] = useState("F-Commerce (Facebook)");
  const [district, setDistrict] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ["", "Weak", "Fair", "Strong"];
  const strengthColor = ["", "bg-red-400", "bg-amber-400", "bg-emerald-500"];

  const handleStep1 = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError("");
    setStep(1);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!bizName || !district) { setError("Please fill in all fields."); return; }
    if (!agreed) { setError("Please accept the Terms of Service."); return; }
    setError("");
    setLoading(true);
    try {
      await signup(name, email, password, phone);
      navigate("/");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-[44%] bg-indigo-700 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-600 rounded-full opacity-60" />
        <div className="absolute bottom-0 -left-24 w-80 h-80 bg-indigo-800 rounded-full opacity-50" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-lg leading-tight">ParcelGuard</div>
            <div className="text-indigo-200 text-xs font-medium">Smart Courier Intelligence</div>
          </div>
        </div>

        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white leading-tight mb-4">
            Start protecting your business today.
          </h1>
          <p className="text-indigo-200 text-sm leading-relaxed max-w-sm">
            Join 50,000+ Bangladesh merchants who use ParcelGuard to detect fraud, book couriers, and track COD payments — all in one place.
          </p>

          <div className="mt-10 space-y-4">
            {[
              { icon: "🛡️", title: "Fraud Detection", desc: "Check any customer phone number before shipping." },
              { icon: "📦", title: "Multi-Courier Booking", desc: "Book with Steadfast, Pathao, RedX from one dashboard." },
              { icon: "💰", title: "COD Reconciliation", desc: "Track every payment and settlement automatically." },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-3">
                <span className="text-xl">{f.icon}</span>
                <div>
                  <div className="text-white font-semibold text-sm">{f.title}</div>
                  <div className="text-indigo-200 text-xs mt-0.5">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-indigo-300 text-xs">
          Free 14-day trial · No credit card required
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-900">ParcelGuard</span>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 ${i <= step ? "text-indigo-600" : "text-slate-400"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    i < step ? "bg-indigo-600 text-white" : i === step ? "bg-indigo-100 text-indigo-700 ring-2 ring-indigo-600" : "bg-slate-100 text-slate-400"
                  }`}>
                    {i < step ? <Check size={11} /> : i + 1}
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{s}</span>
                </div>
                {i < steps.length - 1 && <div className={`flex-1 h-px w-6 ${i < step ? "bg-indigo-400" : "bg-slate-200"}`} />}
              </div>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
              <AlertCircle size={15} className="flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Step 0: Account Info */}
          {step === 0 && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
                <p className="text-slate-500 mt-1 text-sm">Start your 14-day free trial. No credit card needed.</p>
              </div>
              <form onSubmit={handleStep1} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Rahim Uddin"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@yourstore.com"
                    autoComplete="email"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label>
                  <div className="flex gap-2">
                    <span className="flex items-center px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-700 flex-shrink-0">🇧🇩 +880</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="01711-234567"
                      className="flex-1 px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      autoComplete="new-password"
                      className="w-full px-3.5 py-2.5 pr-10 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 placeholder:text-slate-400"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {password && (
                    <div className="mt-2">
                      <div className="flex gap-1">
                        {[1, 2, 3].map(i => (
                          <div key={i} className={`flex-1 h-1 rounded-full ${i <= passwordStrength ? strengthColor[passwordStrength] : "bg-slate-200"}`} />
                        ))}
                      </div>
                      <p className={`text-xs mt-1 ${passwordStrength === 1 ? "text-red-500" : passwordStrength === 2 ? "text-amber-500" : "text-emerald-600"}`}>
                        {strengthLabel[passwordStrength]} password
                      </p>
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-colors"
                >
                  Continue <ArrowRight size={15} />
                </button>
              </form>
            </>
          )}

          {/* Step 1: Business Details */}
          {step === 1 && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Tell us about your business</h2>
                <p className="text-slate-500 mt-1 text-sm">This helps us set up your account correctly.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Business / Store Name</label>
                  <input
                    type="text"
                    value={bizName}
                    onChange={e => setBizName(e.target.value)}
                    placeholder="e.g. Rahman Fashion House"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Business Type</label>
                  <select
                    value={bizType}
                    onChange={e => setBizType(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400"
                  >
                    <option>F-Commerce (Facebook)</option>
                    <option>E-commerce Website</option>
                    <option>Physical Store + Online</option>
                    <option>Wholesale</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">District</label>
                  <select
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400"
                  >
                    <option value="">Select your district</option>
                    {["Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna", "Barishal", "Rangpur", "Mymensingh"].map(d => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Monthly Parcel Volume (approx.)</label>
                  <select className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400">
                    <option>1–50 parcels</option>
                    <option>50–200 parcels</option>
                    <option>200–500 parcels</option>
                    <option>500–2000 parcels</option>
                    <option>2000+ parcels</option>
                  </select>
                </div>
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreed}
                    onChange={e => setAgreed(e.target.checked)}
                    className="accent-indigo-600 mt-0.5 w-3.5 h-3.5 flex-shrink-0"
                  />
                  <label htmlFor="terms" className="text-sm text-slate-600 cursor-pointer leading-relaxed">
                    I agree to ParcelGuard's{" "}
                    <a href="#" className="text-indigo-600 hover:underline font-medium">Terms of Service</a>{" "}
                    and{" "}
                    <a href="#" className="text-indigo-600 hover:underline font-medium">Privacy Policy</a>.
                  </label>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setStep(0); setError(""); }}
                    className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium py-2.5 rounded-xl transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors"
                  >
                    {loading ? (
                      <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
                    ) : (
                      <>Create Account <ArrowRight size={15} /></>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
