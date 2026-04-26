import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import BaseUrl from "../../reusables/BaseUrl";

const fmt = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
};

const fmtTime = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
};

const fmtPrice = (p) => (p === 0 ? "Free" : `₹${p?.toLocaleString("en-IN")}`);

const STATUS_STYLE = {
  DRAFT:     "bg-slate-100 text-slate-600 border border-slate-200",
  PUBLISHED: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  CANCELLED: "bg-red-100 text-red-600 border border-red-200",
};

const BADGE_STYLE = {
  Featured:      "bg-amber-100 text-amber-700 border border-amber-200",
  Hot:           "bg-red-100 text-red-600 border border-red-200",
  "Selling Fast":"bg-orange-100 text-orange-700 border border-orange-200",
  New:           "bg-emerald-100 text-emerald-700 border border-emerald-200",
};

// ── small icon components ─────────────────────────────────────────────────────

const Icon = ({ d, cls = "w-4 h-4" }) => (
  <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const CalIcon    = () => <Icon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />;
const ClockIcon  = () => <Icon d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />;
const PinIcon    = () => <Icon d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />;
const UsersIcon  = () => <Icon d="M17 20h2a2 2 0 002-2v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1a2 2 0 002 2h2M12 12a4 4 0 100-8 4 4 0 000 8z" />;
const TagIcon    = () => <Icon d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />;
const RupeeIcon  = () => <Icon d="M9 8h6M9 12h6m-6 4h3m3 0h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />;
const UserIcon   = () => <Icon d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />;
const MailIcon   = () => <Icon d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />;
const EditIcon   = () => <Icon d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" cls="w-4 h-4" />;
const TrashIcon  = () => <Icon d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" cls="w-4 h-4" />;
const BackIcon   = () => <Icon d="M10 19l-7-7m0 0l7-7m-7 7h18" cls="w-4 h-4" />;
const GlobeIcon  = () => <Icon d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" cls="w-4 h-4" />;

// ── Stat card ─────────────────────────────────────────────────────────────────

const StatCard = ({ icon, label, value, sub, grad }) => (
  <div className={`relative overflow-hidden rounded-2xl p-4 text-white ${grad} shadow-sm`}>
    <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />
    <div className="relative">
      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-3">{icon}</div>
      <p className="text-white/70 text-xs font-medium">{label}</p>
      <p className="text-xl font-black mt-0.5 leading-tight">{value}</p>
      {sub && <p className="text-white/60 text-xs mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ── Info row ──────────────────────────────────────────────────────────────────

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-[#f1f5f9] last:border-0">
    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#6366f1] shrink-0 mt-0.5">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-[#94a3b8] font-medium uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-[#0f172a] mt-0.5 break-words">{value || "—"}</p>
    </div>
  </div>
);

// ── Skeleton ──────────────────────────────────────────────────────────────────

const Skeleton = () => (
  <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-8 animate-pulse">
    <div className="h-8 bg-slate-200 rounded-xl w-32 mb-6" />
    <div className="h-64 bg-slate-200 rounded-2xl mb-6" />
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {[1,2,3,4].map(i => <div key={i} className="h-24 bg-slate-200 rounded-2xl" />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 h-64 bg-slate-200 rounded-2xl" />
      <div className="h-64 bg-slate-200 rounded-2xl" />
    </div>
  </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────

export default function OrganizerEventDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // If navigated with state (from list), use it immediately to avoid flash
  const [event, setEvent] = useState(location.state?.event || null);
  const [loading, setLoading] = useState(!location.state?.event);
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (event) {
     console.log("Using passed event data:", event);
     return;
    }
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${BaseUrl}/organizer/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.statusCode === 200) {
          setEvent(res.data.data);
        } else {
          toast.error(res.data.message || "Failed to load event.");
          navigate(-1);
        }
      } catch {
        toast.error("Something went wrong.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const res = await axios.patch(
        `${BaseUrl}/organizer/events/${id}/publish`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.statusCode === 200) {
        toast.success("Event published!");
        setEvent((prev) => ({ ...prev, status: "PUBLISHED" }));
      } else {
        toast.error(res.data.message || "Failed to publish.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this event? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const res = await axios.delete(`${BaseUrl}/organizer/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.statusCode === 200) {
        toast.success("Event deleted.");
        navigate(-1);
      } else {
        toast.error(res.data.message || "Failed to delete.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Skeleton />;
  if (!event)  return null;

  const fillPct = event.capacity > 0
    ? Math.min(100, Math.round((event.registeredCount ?? 0) / event.capacity * 100))
    : 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">

      {/* ── Top bar ── */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#e2e8f0] px-4 sm:px-6 lg:px-8 py-3
                      flex items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-[#475569] hover:text-[#6366f1] transition-colors"
        >
          <BackIcon /> Back
        </button>

        <div className="flex items-center gap-2">
          {/* Publish button — only for DRAFT */}
          {event.status === "DRAFT" && (
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600
                         text-white transition-colors disabled:opacity-50 shadow-sm"
            >
              <GlobeIcon />
              {publishing ? "Publishing…" : "Publish"}
            </button>
          )}

          <button
            onClick={() => navigate(`/organizer-dashboard/events/${id}/edit`, { state: { event } })}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#6366f1] hover:bg-[#4f46e5]
                       text-white transition-colors shadow-sm"
          >
            <EditIcon /> Edit
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-red-50 hover:bg-red-100
                       text-red-600 border border-red-200 transition-colors disabled:opacity-50"
          >
            <TrashIcon /> {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pt-6 space-y-5">

        {/* ── Hero banner ── */}
        <div className="relative w-full h-52 sm:h-72 rounded-2xl overflow-hidden shadow-md">
          {event.thumbnail ? (
            <img src={event.thumbnail} alt={event.title}
              className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#6366f1] to-[#7c3aed] flex items-center justify-center">
              <span className="text-white/30 text-6xl">🎙️</span>
            </div>
          )}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Badges */}
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

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1">{event.type}</p>
            <h1 className="text-white font-black text-xl sm:text-3xl leading-tight">{event.title}</h1>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            icon={<CalIcon />} label="Event Date"
            value={fmt(event.date)} sub={fmtTime(event.date)}
            grad="bg-gradient-to-br from-[#6366f1] to-[#7c3aed]"
          />
          <StatCard
            icon={<RupeeIcon />} label="Ticket Price"
            value={fmtPrice(event.price)}
            grad="bg-gradient-to-br from-emerald-500 to-teal-600"
          />
          <StatCard
            icon={<UsersIcon />} label="Capacity"
            value={event.capacity?.toLocaleString("en-IN")}
            sub={`${event.registeredCount ?? 0} registered`}
            grad="bg-gradient-to-br from-amber-400 to-orange-500"
          />
          <StatCard
            icon={<TagIcon />} label="Category"
            value={event.type ?? "—"}
            grad="bg-gradient-to-br from-[#8b5cf6] to-[#6366f1]"
          />
        </div>

        {/* ── Main content ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Left — details + capacity */}
          <div className="lg:col-span-2 space-y-4">

            {/* Description card */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm">
              <h2 className="text-sm font-black text-[#0f172a] uppercase tracking-wider mb-3">About this event</h2>
              <p className="text-sm text-[#475569] leading-relaxed whitespace-pre-line">
                {event.details || "No description provided."}
              </p>
            </div>

            {/* Capacity bar */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-black text-[#0f172a] uppercase tracking-wider">Registration fill</h2>
                <span className="text-xs font-bold text-[#6366f1]">{fillPct}%</span>
              </div>
              <div className="h-3 bg-[#f1f5f9] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700
                    ${fillPct >= 90 ? "bg-red-500" : fillPct >= 60 ? "bg-amber-500" : "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]"}`}
                  style={{ width: `${fillPct}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-[#94a3b8]">
                <span>{event.registeredCount ?? 0} registered</span>
                <span>{event.capacity?.toLocaleString("en-IN")} capacity</span>
              </div>
            </div>

          </div>

          {/* Right — event info + host */}
          <div className="space-y-4">

            {/* Event details */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm">
              <h2 className="text-sm font-black text-[#0f172a] uppercase tracking-wider mb-1">Event details</h2>
              <InfoRow icon={<CalIcon />}   label="Date"     value={fmt(event.date)} />
              <InfoRow icon={<ClockIcon />} label="Time"     value={fmtTime(event.date)} />
              <InfoRow icon={<PinIcon />}   label="Venue"    value={event.location} />
              <InfoRow icon={<TagIcon />}   label="Category" value={event.type} />
              <InfoRow icon={<RupeeIcon />} label="Price"    value={fmtPrice(event.price)} />
              <InfoRow icon={<UsersIcon />} label="Capacity" value={event.capacity?.toLocaleString("en-IN")} />
            </div>

            {/* Host info */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm">
              <h2 className="text-sm font-black text-[#0f172a] uppercase tracking-wider mb-3">Host</h2>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366f1] to-[#7c3aed]
                                flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {event.hostName?.[0] ?? "?"}
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#0f172a]">{event.hostName}</p>
                  <p className="text-xs text-[#64748b]">Organizer</p>
                </div>
              </div>
              <InfoRow icon={<UserIcon />}  label="Name"  value={event.hostName} />
              <InfoRow icon={<MailIcon />}  label="Email" value={event.hostEmail} />
            </div>

            {/* Event ID */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] px-5 py-3 shadow-sm
                            flex items-center justify-between">
              <span className="text-xs text-[#94a3b8] font-medium">Event ID</span>
              <span className="text-xs font-mono font-bold text-[#6366f1] bg-indigo-50 px-2 py-1 rounded-lg">
                #{event.id}
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}