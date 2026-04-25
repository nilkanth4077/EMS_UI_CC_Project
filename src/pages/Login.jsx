import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";
import { toast } from "react-toastify";
import BaseUrl from "../reusables/BaseUrl";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Login = () => {

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        // const existingToken = localStorage.getItem("token");
        // const existingUser = JSON.parse(localStorage.getItem("user"));

        // if (existingToken && existingUser) {
        //     if (existingUser.role === "ADMIN") {
        //         toast.info("You're already logged in as Admin");
        //         navigate("/admin-dashboard");
        //     } else if (existingUser.role === "ORGANIZER") {
        //         toast.info("You're already logged in as Organizer");
        //         navigate("/organizer-dashboard");
        //     } else {
        //         toast.info("You're already logged in");
        //         navigate("/");
        //     }
        //     return;
        // }

        setLoading(true);

        try {
            // http://localhost:8080
            // https://healthcare-ot3a.onrender.com
            const response = await axios.post(`${BaseUrl}/auth/login`, { email, password });
            const result = response.data;

            console.log("Full result:", result); // check this once

            if (result.statusCode !== 200) {
            const msg = result.error || result.message || "Invalid credentials";
            toast.error(msg);
            setError(msg);
            return;
            }

            // token, role etc are at top level — NOT inside result.data
            const { token, refreshToken, role, firstName } = result;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify({ role, firstName, email }));

            if (role === "ADMIN") navigate("/admin-dashboard");
            else if (role === "ORGANIZER") navigate("/organizer-dashboard");
            else navigate("/");
        } catch (err) {
            console.log("Login error:", err.response);
            const msg =
                err.response?.data?.message ||
                err.response?.data?.error ||
                err.response?.data ||
                "Something went wrong. Please try again.";
            toast.error(msg);
            setError(typeof msg === "string" ? msg : "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
                <div className="min-h-screen bg-[#f8fafc] flex">
 
      {/* LEFT PANEL — branding + graphic */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#6366f1] to-[#7c3aed] flex-col justify-between p-12">
 
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full" />
        <div className="absolute top-1/3 -right-16 w-64 h-64 bg-white/10 rounded-full" />
        <div className="absolute -bottom-16 left-1/4 w-56 h-56 bg-white/10 rounded-full" />
 
        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-[#6366f1] font-black text-base">CC</span>
          </div>
          <span className="text-white font-black text-xl tracking-tight">CrowdCraft</span>
        </div>
 
        {/* Central illustration */}
        <div className="relative flex flex-col items-center text-center">
          {/* SVG illustration */}
          <svg viewBox="0 0 320 280" className="w-72 h-auto mb-8" fill="none">
            {/* Stage / screen */}
            <rect x="40" y="30" width="240" height="140" rx="16" fill="white" fillOpacity="0.12" />
            <rect x="56" y="46" width="208" height="108" rx="10" fill="white" fillOpacity="0.08" />
            {/* Mic stand */}
            <rect x="153" y="164" width="14" height="40" rx="4" fill="white" fillOpacity="0.3" />
            <ellipse cx="160" cy="204" rx="22" ry="5" fill="white" fillOpacity="0.2" />
            {/* Mic head */}
            <ellipse cx="160" cy="148" rx="12" ry="18" fill="white" fillOpacity="0.5" />
            <ellipse cx="160" cy="148" rx="7" ry="12" fill="white" fillOpacity="0.4" />
            {/* Sound waves */}
            <path d="M138 140 Q128 148 138 156" stroke="white" strokeOpacity="0.4" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            <path d="M128 133 Q112 148 128 163" stroke="white" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <path d="M182 140 Q192 148 182 156" stroke="white" strokeOpacity="0.4" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            <path d="M192 133 Q208 148 192 163" stroke="white" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" fill="none"/>
            {/* Audience dots - row 1 */}
            {[60,90,120,150,180,210,240,270].map((x, i) => (
              <circle key={i} cx={x} cy="232" r="10" fill="white" fillOpacity={0.15 + (i % 3) * 0.08} />
            ))}
            {/* Audience dots - row 2 */}
            {[75,105,135,165,195,225,255].map((x, i) => (
              <circle key={i} cx={x} cy="255" r="9" fill="white" fillOpacity={0.1 + (i % 3) * 0.06} />
            ))}
            {/* Spotlight beams */}
            <polygon points="100,30 80,170 120,170" fill="white" fillOpacity="0.04" />
            <polygon points="220,30 200,170 240,170" fill="white" fillOpacity="0.04" />
          </svg>
 
          <h2 className="text-white font-black text-3xl leading-tight">
            Your next big event<br />starts here.
          </h2>
          <p className="text-white/60 text-sm mt-3 max-w-xs leading-relaxed">
            Join 50,000+ students discovering college fests, hackathons, and cultural events across Gujarat.
          </p>
        </div>
 
        {/* Bottom stats */}
        <div className="relative grid grid-cols-3 gap-4">
          {[
            { value: "200+", label: "Events/month" },
            { value: "120+", label: "Colleges" },
            { value: "50k+", label: "Students" },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 rounded-2xl p-3 text-center">
              <div className="text-white font-black text-xl">{s.value}</div>
              <div className="text-white/60 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
 
      {/* RIGHT PANEL — login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
 
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-[#6366f1] rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-sm">CC</span>
            </div>
            <span className="font-black text-[#0f172a] text-lg tracking-tight">CrowdCraft</span>
          </div>
 
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-[#0f172a] tracking-tight">Welcome back</h1>
            <p className="text-[#64748b] text-sm mt-1.5">Sign in to discover & register for events</p>
          </div>
 
          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
 
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#475569] mb-1.5">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@college.edu"
                className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-[#f1f5f9] text-[#0f172a] text-sm placeholder-[#94a3b8]
                  focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent focus:bg-white transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
 
            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-[#475569]">Password</label>
                <a href="/forgot-password" className="text-xs text-[#6366f1] hover:text-[#4f46e5] font-medium transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-[#e2e8f0] bg-[#f1f5f9] text-[#0f172a] text-sm placeholder-[#94a3b8]
                    focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent focus:bg-white transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-[#94a3b8] hover:text-[#475569] transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword
                    ? <AiOutlineEyeInvisible size={18} />
                    : <AiOutlineEye size={18} />
                  }
                </button>
              </div>
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
              disabled={loading}
              className="w-full py-3 px-4 bg-[#6366f1] hover:bg-[#4f46e5] disabled:opacity-70 text-white font-bold text-sm rounded-xl
                transition-all duration-200 shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
 
          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#e2e8f0]" />
            <span className="text-xs text-[#94a3b8] font-medium">or</span>
            <div className="flex-1 h-px bg-[#e2e8f0]" />
          </div>
 
          {/* Google OAuth placeholder */}
          {/* <button className="w-full py-3 px-4 flex items-center justify-center gap-3 border border-[#e2e8f0] rounded-xl bg-white hover:bg-[#f8fafc] text-[#0f172a] text-sm font-semibold transition-colors">
            <svg viewBox="0 0 48 48" className="w-5 h-5">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button> */}
 
          {/* Register link */}
          <p className="text-center text-sm text-[#64748b] mt-6">
            New to CrowdCraft?{" "}
            <a href="/register" className="text-[#6366f1] hover:text-[#4f46e5] font-semibold transition-colors">
              Create an account
            </a>
          </p>
 
        </div>
      </div>
    </div>
            <Footer />
        </>
    );
};

export default Login;