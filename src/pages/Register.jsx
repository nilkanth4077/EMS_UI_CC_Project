import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";
import { toast } from "react-toastify";
import BaseUrl from "../reusables/BaseUrl";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function Register() {

//   const [formData, setFormData] = useState({
//     firstName: "", lastName: "", email: "", mobile: "", password: "", confirmPassword: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e, opts = {}) => {
//     let val = e.target.value;
//     if (opts.maxLength) val = val.slice(0, opts.maxLength);
//     if (opts.numericOnly) val = val.replace(/\D/g, "");
//     if (opts.capitalizeFirst) val = val.replace(/[^a-zA-Z]/g, "");
//     setFormData((p) => ({ ...p, [e.target.name]: val }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setTimeout(() => setLoading(false), 2000);
//   };

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "USER",
        mobile: "",
    });

    const handleChange = (e, restrictions = {}) => {
        const { name, value, files, type } = e.target;

        let finalValue = value;

        // For file input
        if (type === "file") {
            finalValue = files?.[0] || null;
        }

        // Apply restrictions for others
        if (restrictions.maxLength && typeof finalValue === "string") {
            finalValue = finalValue.slice(0, restrictions.maxLength);
        }

        if (restrictions.numericOnly) {
            finalValue = finalValue.replace(/\D/g, ""); // only digits
        }

        if (restrictions.onlyAtoZ) {
            finalValue = finalValue.replace(/[^a-zA-Z]/g, ""); // Remove non-letters
        }

        if (restrictions.capitalizeFirst) {
            finalValue = finalValue.charAt(0).toUpperCase() + finalValue.slice(1);
        }

        setFormData(prev => ({
            ...prev,
            [name]: finalValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post(
                `${BaseUrl}/auth/register`,
                formData
            );
            console.log("Registration response: ", response.data);
            if (response.data.statusCode === 200) {
                toast.success(response.data.message || "User Registered successfully");
                navigate("/login")
            } else {
                toast.error(response.data.message || "Registration failed");
            }
        } catch (err) {
            toast.error("Error: ", err);
        } finally {
            setLoading(false);
        }
    };

  const STEPS = ["Personal info", "Contact", "Security"];

  const filledCount = [
    formData.firstName, formData.lastName,
    formData.email, formData.mobile,
    formData.password, formData.confirmPassword,
  ].filter(Boolean).length;

  const progress = Math.round((filledCount / 6) * 100);

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-[#f8fafc] flex">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-gradient-to-br from-[#6366f1] to-[#7c3aed] flex-col justify-between p-12">

        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full" />
        <div className="absolute top-1/2 -left-20 w-64 h-64 bg-white/10 rounded-full" />
        <div className="absolute -bottom-20 right-1/4 w-56 h-56 bg-white/10 rounded-full" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-[#6366f1] font-black text-base">CC</span>
          </div>
          <span className="text-white font-black text-xl tracking-tight">CrowdCraft</span>
        </div>

        {/* Illustration */}
        <div className="relative flex flex-col items-center text-center">
          <svg viewBox="0 0 320 300" className="w-72 h-auto mb-8" fill="none">
            {/* Ticket shapes */}
            <rect x="30" y="60" width="180" height="100" rx="14" fill="white" fillOpacity="0.15" />
            <circle cx="30" cy="110" r="12" fill="url(#bgfill)" />
            <circle cx="210" cy="110" r="12" fill="url(#bgfill)" />
            <line x1="60" y1="110" x2="180" y2="110" stroke="white" strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="6 4" />
            <rect x="44" y="76" width="60" height="60" rx="8" fill="white" fillOpacity="0.12" />
            <rect x="48" y="80" width="52" height="52" rx="6" fill="white" fillOpacity="0.1" />
            {/* QR pattern */}
            {[0,1,2].map(row => [0,1,2].map(col => (
              (row === 1 && col === 1) ? null :
              <rect key={`${row}-${col}`} x={52 + col * 14} y={84 + row * 14} width="10" height="10" rx="2" fill="white" fillOpacity="0.35" />
            )))}
            <text x="116" y="99" fill="white" fillOpacity="0.9" fontSize="11" fontWeight="700">TEDx SVIT</text>
            <text x="116" y="114" fill="white" fillOpacity="0.55" fontSize="9">May 12 · 10:00 AM</text>
            <text x="116" y="128" fill="white" fillOpacity="0.55" fontSize="9">SVIT Auditorium</text>

            {/* Second ticket (offset behind) */}
            <rect x="110" y="170" width="180" height="100" rx="14" fill="white" fillOpacity="0.1" />
            <circle cx="110" cy="220" r="12" fill="url(#bgfill)" />
            <circle cx="290" cy="220" r="12" fill="url(#bgfill)" />
            <line x1="140" y1="220" x2="260" y2="220" stroke="white" strokeOpacity="0.15" strokeWidth="1.5" strokeDasharray="6 4" />
            <text x="130" y="204" fill="white" fillOpacity="0.7" fontSize="11" fontWeight="700">Hackathon 36hrs</text>
            <text x="130" y="218" fill="white" fillOpacity="0.4" fontSize="9">Jun 1 · Nirma University</text>

            {/* Floating badge */}
            <rect x="200" y="40" width="90" height="34" rx="10" fill="white" fillOpacity="0.2" />
            <circle cx="218" cy="57" r="8" fill="#22c55e" fillOpacity="0.85" />
            <text x="232" y="61" fill="white" fillOpacity="0.9" fontSize="10" fontWeight="600">Registered!</text>

            <defs>
              <linearGradient id="bgfill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
          </svg>

          <h2 className="text-white font-black text-3xl leading-tight">
            Register once,<br />attend anywhere.
          </h2>
          <p className="text-white/60 text-sm mt-3 max-w-xs leading-relaxed">
            One account to discover, register, and get tickets for every college event across Gujarat.
          </p>
        </div>

        {/* Steps */}
        <div className="relative space-y-3">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {i + 1}
              </div>
              <span className="text-white/80 text-sm font-medium">{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-lg">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-[#6366f1] rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-sm">CC</span>
            </div>
            <span className="font-black text-[#0f172a] text-lg tracking-tight">CrowdCraft</span>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-3xl font-black text-[#0f172a] tracking-tight">Create account</h1>
            <p className="text-[#64748b] text-sm mt-1.5">Join 50,000+ students on CrowdCraft</p>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-[#475569]">Profile completion</span>
              <span className="text-xs font-bold text-[#6366f1]">{progress}%</span>
            </div>
            <div className="h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Row 1 — name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="First name" hint="Only alphabets allowed">
                <input
                  type="text" name="firstName" placeholder="Arjun"
                  value={formData.firstName}
                  onChange={(e) => handleChange(e, { maxLength: 20, capitalizeFirst: true })}
                  required
                  className={inputCls}
                />
              </Field>
              <Field label="Last name" hint="Only alphabets allowed">
                <input
                  type="text" name="lastName" placeholder="Mehta"
                  value={formData.lastName}
                  onChange={(e) => handleChange(e, { maxLength: 20, capitalizeFirst: true })}
                  required
                  className={inputCls}
                />
              </Field>
            </div>

            {/* Row 2 — email + mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Email address" hint="Each email can be used only once">
                <input
                  type="email" name="email" placeholder="you@college.edu"
                  value={formData.email}
                  onChange={(e) => handleChange(e, { maxLength: 30 })}
                  required
                  className={inputCls}
                />
              </Field>
              <Field label="Mobile number" hint="Exact 10 digits required">
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-[#e2e8f0] bg-[#f1f5f9] text-[#64748b] text-sm font-medium">
                    +91
                  </span>
                  <input
                    type="text" name="mobile" placeholder="9876543210"
                    value={formData.mobile}
                    onChange={(e) => handleChange(e, { maxLength: 10, numericOnly: true })}
                    required
                    className="flex-1 px-3 py-3 rounded-r-xl border border-[#e2e8f0] bg-[#f1f5f9] text-[#0f172a] text-sm placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent focus:bg-white transition"
                  />
                </div>
                {formData.mobile.length > 0 && formData.mobile.length < 10 && (
                  <p className="text-xs text-[#f59e0b] mt-1">{10 - formData.mobile.length} more digits needed</p>
                )}
              </Field>
            </div>

            {/* Row 3 — passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Password" hint="Use strong password (e.g. Abcd_1234@)">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"} name="password" placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleChange(e, { maxLength: 30 })}
                    required
                    className={inputCls + " pr-11"}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-[#94a3b8] hover:text-[#475569] transition-colors">
                    {showPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                  </button>
                </div>
              </Field>
              <Field label="Confirm password" hint="Must match your password">
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange(e, { maxLength: 30 })}
                    required
                    className={inputCls + " pr-11"}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-[#94a3b8] hover:text-[#475569] transition-colors">
                    {showConfirmPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-[#ef4444] mt-1">Passwords do not match</p>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <p className="text-xs text-[#22c55e] mt-1">✓ Passwords match</p>
                )}
              </Field>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-[#ef4444] text-sm px-3 py-2.5 rounded-xl">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-11.25a.75.75 0 011.5 0v4.5a.75.75 0 01-1.5 0v-4.5zm.75 7.5a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || formData.mobile.length !== 10}
              className="w-full py-3 px-4 bg-[#6366f1] hover:bg-[#4f46e5] disabled:opacity-50 disabled:cursor-not-allowed
                text-white font-bold text-sm rounded-xl transition-all duration-200
                shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5
                flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating account...
                </>
              ) : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-[#64748b] mt-5">
            Already have an account?{" "}
            <a href="/login" className="text-[#6366f1] hover:text-[#4f46e5] font-semibold transition-colors">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}

const inputCls = "w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-[#f1f5f9] text-[#0f172a] text-sm placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent focus:bg-white transition";

function Field({ label, hint, children }) {
  return (
    <div className="relative group">
      <label className="block text-sm font-semibold text-[#475569] mb-1.5">{label}</label>
      {children}
      {hint && (
        <span className="pointer-events-none absolute -top-8 left-0 w-max max-w-[200px] bg-[#0f172a] text-white text-xs rounded-lg px-2.5 py-1.5
          opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 shadow-lg">
          {hint}
        </span>
      )}
    </div>
  );
}