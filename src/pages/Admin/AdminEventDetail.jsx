import { useLocation, useNavigate } from "react-router-dom";

const fmt = (iso) => iso
  ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
  : "—";

const fmtTime = (iso) => iso
  ? new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
  : "—";

const fmtPrice = (p) => (p === 0 ? "Free" : `₹${p?.toLocaleString("en-IN")}`);

const STATUS_STYLE = {
  PUBLISHED: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  DRAFT:     "bg-slate-100 text-slate-600 border border-slate-200",
  CANCELLED: "bg-red-100 text-red-700 border border-red-200",
};

const BADGE_STYLE = {
  Featured:       "bg-amber-100 text-amber-700 border border-amber-200",
  Hot:            "bg-red-100 text-red-600 border border-red-200",
  "Selling Fast": "bg-orange-100 text-orange-700 border border-orange-200",
  New:            "bg-emerald-100 text-emerald-700 border border-emerald-200",
};

// ── small helpers ─────────────────────────────────────────────────────────────

const Icon = ({ d }) => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const BackIcon   = () => <Icon d="M10 19l-7-7m0 0l7-7m-7 7h18" />;
const CalIcon    = () => <Icon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />;
const ClockIcon  = () => <Icon d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />;
const PinIcon    = () => <Icon d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />;
const UsersIcon  = () => <Icon d="M17 20h2a2 2 0 002-2v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1a2 2 0 002 2h2M12 12a4 4 0 100-8 4 4 0 000 8z" />;
const TagIcon    = () => <Icon d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />;
const RupeeIcon  = () => <Icon d="M9 8h6M9 12h6m-6 4h3m6-8v12M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />;
const MailIcon   = () => <Icon d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />;
const ShieldIcon = () => <Icon d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />;

// ── stat card ─────────────────────────────────────────────────────────────────

const StatCard = ({ icon, label, value, sub, grad }) => (
  <div className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 text-white shadow-sm ${grad}`}>
    <div className="absolute -top-5 -right-5 w-20 h-20 bg-white/10 rounded-full pointer-events-none" />
    <div className="relative">
      <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white/20 rounded-xl flex items-center justify-center mb-3">{icon}</div>
      <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">{label}</p>
      <p className="text-xl sm:text-2xl font-black mt-0.5 leading-none">{value}</p>
      {sub && <p className="text-white/60 text-xs mt-1">{sub}</p>}
    </div>
  </div>
);

// ── info row ──────────────────────────────────────────────────────────────────

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-[#f1f5f9] last:border-0">
    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100
                    flex items-center justify-center text-[#6366f1] shrink-0 mt-0.5">
      {icon}
    </div>
    <div>
      <p className="text-[10px] text-[#94a3b8] font-semibold uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-[#0f172a] mt-0.5 break-words">{value || "—"}</p>
    </div>
  </div>
);

// ═════════════════════════════════════════════════════════════════════════════
export default function AdminEventDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const event    = location.state?.event;

  if (!event) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-4">
        <div className="text-5xl">🎪</div>
        <p className="text-[#0f172a] font-bold text-lg">Event not found</p>
        <p className="text-[#64748b] text-sm">No event data was passed to this page.</p>
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold
                     bg-[#6366f1] text-white hover:bg-[#4f46e5] transition-colors">
          <BackIcon /> Go back
        </button>
      </div>
    );
  }

  const host = event.host ?? {};

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">

      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#e2e8f0]
                      px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-[#475569]
                     hover:text-[#6366f1] transition-colors">
          <BackIcon /> Back
        </button>

        {/* Read-only badge */}
        <span className="ml-auto flex items-center gap-1.5 text-xs font-semibold
                         bg-slate-100 text-slate-500 border border-slate-200 px-3 py-1.5 rounded-full">
          <ShieldIcon /> Read-only view
        </span>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pt-6 space-y-5">

        {/* ── Hero banner ── */}
        <div className="relative w-full h-52 sm:h-72 rounded-2xl overflow-hidden shadow-md">
          {event.thumbnail ? (
            <img src={event.thumbnail} alt={event.title}
              className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#6366f1] to-[#7c3aed]
                            flex items-center justify-center">
              <span className="text-white/20 text-7xl">🎪</span>
            </div>
          )}

          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

          {/* top pills */}
          <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
            <span className={`text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm
              ${STATUS_STYLE[event.status] ?? "bg-slate-100 text-slate-600"}`}>
              {event.status}
            </span>
            {event.badge && (
              <span className={`text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm
                ${BADGE_STYLE[event.badge] ?? "bg-white text-slate-700"}`}>
                {event.badge}
              </span>
            )}
          </div>

          {/* Event ID top-right */}
          <div className="absolute top-4 right-4">
            <span className="text-xs font-mono font-bold bg-black/40 text-white/90
                             backdrop-blur-sm px-2.5 py-1 rounded-lg">
              #{event.id}
            </span>
          </div>

          {/* title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1">
              {event.type}
            </p>
            <h1 className="text-white font-black text-xl sm:text-3xl leading-tight">
              {event.title}
            </h1>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={<CalIcon />}   label="Date"
            value={fmt(event.date)} sub={fmtTime(event.date)}
            grad="bg-gradient-to-br from-[#6366f1] to-[#7c3aed]" />
          <StatCard icon={<RupeeIcon />} label="Price"
            value={fmtPrice(event.price)}
            grad="bg-gradient-to-br from-emerald-500 to-teal-600" />
          <StatCard icon={<UsersIcon />} label="Capacity"
            value={event.capacity?.toLocaleString("en-IN")}
            grad="bg-gradient-to-br from-amber-400 to-orange-500" />
          <StatCard icon={<TagIcon />}   label="Category"
            value={event.type ?? "—"}
            grad="bg-gradient-to-br from-[#8b5cf6] to-[#6366f1]" />
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* LEFT col — description + location */}
          <div className="lg:col-span-2 space-y-4">

            {/* Description */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm">
              <h2 className="text-xs font-black text-[#0f172a] uppercase tracking-wider mb-3">
                About this event
              </h2>
              <p className="text-sm text-[#475569] leading-relaxed whitespace-pre-line">
                {event.details || "No description provided."}
              </p>
            </div>

            {/* Full location card */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm">
              <h2 className="text-xs font-black text-[#0f172a] uppercase tracking-wider mb-3">
                Venue
              </h2>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100
                                flex items-center justify-center text-[#6366f1] shrink-0">
                  <PinIcon />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0f172a]">{event.location}</p>
                  <p className="text-xs text-[#64748b] mt-0.5">{fmt(event.date)} at {fmtTime(event.date)}</p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT col — event details + host */}
          <div className="space-y-4">

            {/* Event details */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm">
              <h2 className="text-xs font-black text-[#0f172a] uppercase tracking-wider mb-1">
                Event details
              </h2>
              <InfoRow icon={<CalIcon />}   label="Date"     value={fmt(event.date)} />
              <InfoRow icon={<ClockIcon />} label="Time"     value={fmtTime(event.date)} />
              <InfoRow icon={<PinIcon />}   label="Venue"    value={event.location} />
              <InfoRow icon={<TagIcon />}   label="Category" value={event.type} />
              <InfoRow icon={<RupeeIcon />} label="Price"    value={fmtPrice(event.price)} />
              <InfoRow icon={<UsersIcon />} label="Capacity" value={event.capacity?.toLocaleString("en-IN")} />
            </div>

            {/* Host info */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm">
              <h2 className="text-xs font-black text-[#0f172a] uppercase tracking-wider mb-3">
                Host / Organizer
              </h2>

              {/* Avatar row */}
              <div className="flex items-center gap-3 mb-4 p-3 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366f1] to-[#7c3aed]
                                flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {host.firstName?.[0] ?? "?"}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-[#0f172a] truncate">
                    {host.firstName} {host.lastName}
                  </p>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full
                                   bg-indigo-100 text-indigo-700 border border-indigo-200">
                    {host.role}
                  </span>
                </div>
              </div>

              <InfoRow icon={<MailIcon />}   label="Email"  value={host.email} />
              <InfoRow icon={<ShieldIcon />} label="Status" value={host.enabled ? "Active account" : "Disabled"} />
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] px-5 py-4 shadow-sm space-y-3">
              <h2 className="text-xs font-black text-[#0f172a] uppercase tracking-wider">Metadata</h2>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#94a3b8] font-medium">Event ID</span>
                <span className="text-xs font-mono font-bold text-[#6366f1] bg-indigo-50
                                 px-2 py-1 rounded-lg border border-indigo-100">
                  #{event.id}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#94a3b8] font-medium">Host ID</span>
                <span className="text-xs font-mono font-bold text-[#475569] bg-slate-50
                                 px-2 py-1 rounded-lg border border-slate-100">
                  #{host.id}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#94a3b8] font-medium">Created</span>
                <span className="text-xs font-semibold text-[#475569]">
                  {event.createdAt ? fmt(event.createdAt) : "—"}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}