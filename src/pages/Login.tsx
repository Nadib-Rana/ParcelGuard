import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[52%] bg-indigo-700 relative overflow-hidden flex-col justify-between p-12">
        {/* Decorative circles */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-600 rounded-full opacity-60" />
        <div className="absolute bottom-0 -left-24 w-80 h-80 bg-indigo-800 rounded-full opacity-50" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-indigo-500 rounded-full opacity-30" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-lg leading-tight">ParcelGuard</div>
            <div className="text-indigo-200 text-xs font-medium">Smart Courier Intelligence</div>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Protect every parcel.<br />Detect fraud before it ships.
          </h1>
          <p className="text-indigo-200 text-base leading-relaxed max-w-md">
            Bangladesh's most trusted courier fraud detection platform for F-Commerce and e-commerce sellers.
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-8 mt-10">
            {[
              { value: "50,000+", label: "Active Merchants" },
              { value: "2.4M+", label: "Parcels Tracked" },
              { value: "98.2%", label: "Fraud Detection Accuracy" },
            ].map(s => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-indigo-200 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20">
          <p className="text-white text-sm leading-relaxed">
            "ParcelGuard saved us from shipping ৳80,000+ worth of goods to fraudulent customers in just the first month."
          </p>
          <div className="flex items-center gap-3 mt-3">
            <div className="w-8 h-8 rounded-full bg-indigo-400 flex items-center justify-center text-white font-bold text-xs">RH</div>
            <div>
              <div className="text-white text-xs font-semibold">Rahim Hossain</div>
              <div className="text-indigo-200 text-xs">Owner, Dhaka Fashion House</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-900">ParcelGuard</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
            <p className="text-slate-500 mt-1 text-sm">Sign in to your merchant account.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
              <AlertCircle size={15} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@yourstore.com"
                autoComplete="email"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 placeholder:text-slate-400 transition-shadow"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full px-3.5 py-2.5 pr-10 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 placeholder:text-slate-400 transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="accent-indigo-600 w-3.5 h-3.5" />
              <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer">Remember me for 30 days</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors mt-2"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
              ) : (
                <>Sign In <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or continue with</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Demo login */}
          <button
            onClick={() => { setEmail("demo@parcelguard.com"); setPassword("demo1234"); }}
            className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium py-2.5 rounded-xl transition-colors"
          >
            <Shield size={14} className="text-indigo-500" />
            Use Demo Account
          </button>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
