import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import BaseUrl from "../reusables/BaseUrl";
import { Footer } from "../components/Footer";
import Navbar from "../components/Navbar";

const ORGANIZER_TYPES = [
  { value: "COLLEGE_CLUB", label: "College Club / Fest Committee", icon: "🎓" },
  { value: "STARTUP",      label: "Startup / Company",             icon: "🚀" },
  { value: "NGO",          label: "NGO / Social Organisation",     icon: "🤝" },
  { value: "INDIVIDUAL",   label: "Individual Organizer",          icon: "👤" },
];

const EVENT_FREQUENCY = ["1–2 per month", "3–5 per month", "5+ per month"];

export default function OrganizerApply() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 2-step form
  const [form, setForm] = useState({
    organizationName: "",
    organizerType: "",
    collegeName: "",
    city: "",
    description: "",
    website: "",
    instagram: "",
    expectedEventsPerMonth: "",
  });

  const handle = (field, value) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BaseUrl}/organizer/apply`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const result = response.data;
      if (result.statusCode === 200) {
        toast.success("Application submitted! We'll review it shortly.");
        navigate("/");
      } else {
        toast.error(result.message || "Submission failed.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
   <>
   <Navbar />
    <div className="min-h-screen bg-[#f8fafc] flex">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-[42%] relative overflow-hidden bg-gradient-to-br from-[#6366f1] to-[#7c3aed] flex-col justify-between p-12">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full" />
        <div className="absolute -bottom-16 left-1/4 w-56 h-56 bg-white/10 rounded-full" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-[#6366f1] font-black text-base">CC</span>
          </div>
          <span className="text-white font-black text-xl tracking-tight">CrowdCraft</span>
        </div>

        {/* Illustration */}
        <div className="relative text-center">
          <div className="text-8xl mb-6">🎙️</div>
          <h2 className="text-white font-black text-3xl leading-tight">
            Start hosting.<br />Start inspiring.
          </h2>
          <p className="text-white/60 text-sm mt-3 max-w-xs mx-auto leading-relaxed">
            Join 120+ organizers already running events on CrowdCraft. From small workshops to 1000-seat fests.
          </p>

          {/* Perks */}
          <div className="mt-8 space-y-3 text-left">
            {[
              { icon: "📋", text: "Manage registrations & attendees" },
              { icon: "📊", text: "Real-time analytics per event" },
              { icon: "💬", text: "Email & SMS blast to attendees" },
              { icon: "🎟️", text: "Custom ticketing & pricing" },
            ].map((p) => (
              <div key={p.text} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2.5">
                <span className="text-lg">{p.icon}</span>
                <span className="text-white/90 text-sm font-medium">{p.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step indicator */}
        <div className="relative">
          <p className="text-white/50 text-xs mb-3 uppercase tracking-wider font-semibold">Application steps</p>
          <div className="flex items-center gap-3">
            {["Organisation info", "Event details"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all
                  ${step > i + 1 ? "bg-green-400 text-white" : step === i + 1 ? "bg-white text-[#6366f1]" : "bg-white/20 text-white/50"}`}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span className={`text-xs font-medium ${step === i + 1 ? "text-white" : "text-white/50"}`}>{s}</span>
                {i === 0 && <div className="w-8 h-px bg-white/20 ml-1" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-lg">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-[#6366f1] rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-sm">CC</span>
            </div>
            <span className="font-black text-[#0f172a] text-lg">CrowdCraft</span>
          </div>

          <div className="mb-7">
            <span className="text-xs font-semibold text-[#6366f1] bg-indigo-50 px-3 py-1 rounded-full">
              Step {step} of 2
            </span>
            <h1 className="text-2xl font-black text-[#0f172a] mt-3 tracking-tight">
              {step === 1 ? "Tell us about your organisation" : "Your event plans"}
            </h1>
            <p className="text-[#64748b] text-sm mt-1">
              {step === 1
                ? "This helps us verify and approve your organizer account."
                : "Almost done — just a few more details."}
            </p>
          </div>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div className="space-y-5">

              {/* Organizer type */}
              <div>
                <label className="block text-sm font-semibold text-[#475569] mb-2">
                  What best describes you? <span className="text-[#ef4444]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ORGANIZER_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => handle("organizerType", t.value)}
                      className={`flex items-center gap-2 px-3 py-3 rounded-xl border text-sm font-semibold text-left transition-all
                        ${form.organizerType === t.value
                          ? "border-[#6366f1] bg-indigo-50 text-[#6366f1]"
                          : "border-[#e2e8f0] bg-white text-[#475569] hover:border-[#6366f1]/40"
                        }`}
                    >
                      <span className="text-lg">{t.icon}</span>
                      <span className="leading-tight">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Organisation name */}
              <div>
                <label className="block text-sm font-semibold text-[#475569] mb-1.5">
                  Organisation / Club name <span className="text-[#ef4444]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. SVIT Developer Community"
                  value={form.organizationName}
                  onChange={(e) => handle("organizationName", e.target.value)}
                  className={inputCls}
                />
              </div>

              {/* College name — only for COLLEGE_CLUB */}
              {form.organizerType === "COLLEGE_CLUB" && (
                <div>
                  <label className="block text-sm font-semibold text-[#475569] mb-1.5">
                    College / University name <span className="text-[#ef4444]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SVIT, Vasad"
                    value={form.collegeName}
                    onChange={(e) => handle("collegeName", e.target.value)}
                    className={inputCls}
                  />
                </div>
              )}

              {/* City */}
              <div>
                <label className="block text-sm font-semibold text-[#475569] mb-1.5">
                  City <span className="text-[#ef4444]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ahmedabad"
                  value={form.city}
                  onChange={(e) => handle("city", e.target.value)}
                  className={inputCls}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-[#475569] mb-1.5">
                  About your organisation <span className="text-[#ef4444]">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe what your club or organisation does..."
                  value={form.description}
                  onChange={(e) => handle("description", e.target.value)}
                  className={inputCls + " resize-none"}
                />
              </div>

              <button
                type="button"
                disabled={!form.organizerType || !form.organizationName || !form.city || !form.description}
                onClick={() => setStep(2)}
                className="w-full py-3 bg-[#6366f1] hover:bg-[#4f46e5] disabled:opacity-50 disabled:cursor-not-allowed
                  text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-indigo-200 hover:-translate-y-0.5"
              >
                Continue →
              </button>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div className="space-y-5">

              {/* Expected events */}
              <div>
                <label className="block text-sm font-semibold text-[#475569] mb-2">
                  How many events do you plan to host per month? <span className="text-[#ef4444]">*</span>
                </label>
                <div className="flex gap-2 flex-wrap">
                  {EVENT_FREQUENCY.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => handle("expectedEventsPerMonth", f)}
                      className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all
                        ${form.expectedEventsPerMonth === f
                          ? "border-[#6366f1] bg-indigo-50 text-[#6366f1]"
                          : "border-[#e2e8f0] bg-white text-[#475569] hover:border-[#6366f1]/40"
                        }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-semibold text-[#475569] mb-1.5">
                  Website <span className="text-[#64748b] font-normal">(optional)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://yourclub.in"
                  value={form.website}
                  onChange={(e) => handle("website", e.target.value)}
                  className={inputCls}
                />
              </div>

              {/* Instagram */}
              <div>
                <label className="block text-sm font-semibold text-[#475569] mb-1.5">
                  Instagram handle <span className="text-[#64748b] font-normal">(optional)</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-[#e2e8f0] bg-[#f1f5f9] text-[#64748b] text-sm">
                    @
                  </span>
                  <input
                    type="text"
                    placeholder="yourclub"
                    value={form.instagram}
                    onChange={(e) => handle("instagram", e.target.value)}
                    className="flex-1 px-3 py-3 rounded-r-xl border border-[#e2e8f0] bg-[#f1f5f9] text-[#0f172a] text-sm placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Info note */}
              <div className="flex gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <span className="text-lg shrink-0">⏳</span>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Your application will be reviewed by our admin team within <strong>24–48 hours</strong>. You'll be notified once approved and your account will be upgraded to Organizer.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-[#e2e8f0] bg-white text-[#475569] font-bold text-sm rounded-xl hover:bg-[#f8fafc] transition-all"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  disabled={loading || !form.expectedEventsPerMonth}
                  onClick={handleSubmit}
                  className="flex-2 flex-1 py-3 bg-[#6366f1] hover:bg-[#4f46e5] disabled:opacity-50 disabled:cursor-not-allowed
                    text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-indigo-200 hover:-translate-y-0.5
                    flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Submitting...
                    </>
                  ) : "Submit application 🚀"}
                </button>
              </div>
            </div>
          )}

          <p className="text-center text-sm text-[#64748b] mt-6">
            Changed your mind?{" "}
            <button onClick={() => navigate("/")} className="text-[#6366f1] font-semibold hover:text-[#4f46e5]">
              Go back home
            </button>
          </p>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}

const inputCls = "w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-[#f1f5f9] text-[#0f172a] text-sm placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent focus:bg-white transition";