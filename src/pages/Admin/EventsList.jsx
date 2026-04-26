import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import BaseUrl from "../../reusables/BaseUrl";

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

const fmt = (iso) => iso
  ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  : "—";

const fmtPrice = (p) => (p === 0 ? "Free" : `₹${p?.toLocaleString("en-IN")}`);

const EventsList = ({ events, setEvents }) => {
  const navigate = useNavigate();
  const token    = localStorage.getItem("token");

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event? This cannot be undone.")) return;
    try {
      const res = await axios.delete(`${BaseUrl}/admin/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.statusCode === 200) {
        toast.success("Event deleted.");
        setEvents((prev) => prev.filter((e) => e.id !== id));
      } else {
        toast.error(res.data.message || "Failed to delete.");
      }
    } catch {
      toast.error("Something went wrong.");
    }
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400">
        <div className="text-5xl mb-3">🎪</div>
        <p className="font-semibold text-slate-600">No events found</p>
        <p className="text-sm mt-1">Events will appear here once created.</p>
      </div>
    );
  }

  return (
    <>
      {/* ── MOBILE — card list ── */}
      <div className="flex flex-col gap-3 md:hidden">
        {events.map((e) => (
          <div key={e.id} className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-sm">

            {/* thumbnail */}
            <div className="relative h-36 bg-gradient-to-br from-[#6366f1] to-[#7c3aed]">
              {e.thumbnail && (
                <img src={e.thumbnail} alt={e.title}
                  className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${STATUS_STYLE[e.status] ?? "bg-slate-100 text-slate-600"}`}>
                  {e.status}
                </span>
                {e.badge && (
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${BADGE_STYLE[e.badge] ?? "bg-white text-slate-700"}`}>
                    {e.badge}
                  </span>
                )}
              </div>
              <div className="absolute bottom-2.5 left-3 right-3">
                <p className="text-white font-bold text-sm leading-tight line-clamp-1">{e.title}</p>
                <p className="text-white/70 text-xs">{e.type}</p>
              </div>
            </div>

            {/* details */}
            <div className="p-3 space-y-2">
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-[#475569]">
                <span>📅 {fmt(e.date)}</span>
                <span>💰 {fmtPrice(e.price)}</span>
                <span>📍 {e.location}</span>
                <span>👥 {e.capacity?.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6366f1] to-[#7c3aed]
                                flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                  {e.host?.firstName?.[0] ?? "?"}
                </div>
                <p className="text-xs text-[#64748b] truncate">
                  {e.host?.firstName} {e.host?.lastName}
                </p>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => navigate(`/admin-dashboard/events/${e.id}`, { state: { event: e } })}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-indigo-50 text-[#6366f1]
                             border border-indigo-100 hover:bg-indigo-100 transition-colors">
                  View
                </button>
                <button onClick={() => handleDelete(e.id)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-600
                             border border-red-100 hover:bg-red-100 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── DESKTOP — table ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e2e8f0]">
          <thead>
            <tr className="bg-gradient-to-r from-[#6366f1] to-[#7c3aed] text-white text-xs font-semibold uppercase tracking-wider">
              <th className="py-3.5 px-5 text-left w-16">ID</th>
              <th className="py-3.5 px-5 text-left">Event</th>
              <th className="py-3.5 px-5 text-left hidden lg:table-cell">Host</th>
              <th className="py-3.5 px-5 text-left">Date</th>
              <th className="py-3.5 px-5 text-left hidden xl:table-cell">Location</th>
              <th className="py-3.5 px-5 text-left">Price</th>
              <th className="py-3.5 px-5 text-left hidden lg:table-cell">Capacity</th>
              <th className="py-3.5 px-5 text-left">Status</th>
              <th className="py-3.5 px-5 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f5f9]">
            {events.map((e, i) => (
              <tr key={e.id}
                className={`hover:bg-indigo-50/30 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}`}>

                {/* ID */}
                <td className="py-3.5 px-5 text-[#94a3b8] font-mono text-xs">#{e.id}</td>

                {/* Event — thumbnail + title + type + badge */}
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-10 rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-[#6366f1] to-[#7c3aed]">
                      {e.thumbnail && (
                        <img src={e.thumbnail} alt={e.title}
                          className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#0f172a] truncate max-w-[160px]">{e.title}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-[#64748b]">{e.type}</span>
                        {e.badge && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${BADGE_STYLE[e.badge] ?? "bg-white text-slate-700"}`}>
                            {e.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Host */}
                <td className="py-3.5 px-5 hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6366f1] to-[#7c3aed]
                                    flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                      {e.host?.firstName?.[0] ?? "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#0f172a] truncate">
                        {e.host?.firstName} {e.host?.lastName}
                      </p>
                      <p className="text-[10px] text-[#94a3b8] truncate max-w-[120px]">{e.host?.email}</p>
                    </div>
                  </div>
                </td>

                {/* Date */}
                <td className="py-3.5 px-5 text-xs text-[#475569] whitespace-nowrap">{fmt(e.date)}</td>

                {/* Location */}
                <td className="py-3.5 px-5 hidden xl:table-cell text-xs text-[#475569] max-w-[160px]">
                  <p className="truncate">{e.location}</p>
                </td>

                {/* Price */}
                <td className="py-3.5 px-5">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full
                    ${e.price === 0
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-indigo-50 text-[#6366f1] border border-indigo-100"}`}>
                    {fmtPrice(e.price)}
                  </span>
                </td>

                {/* Capacity */}
                <td className="py-3.5 px-5 hidden lg:table-cell text-xs text-[#475569]">
                  {e.capacity?.toLocaleString("en-IN")}
                </td>

                {/* Status */}
                <td className="py-3.5 px-5">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap
                    ${STATUS_STYLE[e.status] ?? "bg-slate-100 text-slate-600"}`}>
                    {e.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/admin-dashboard/events/${e.id}`, { state: { event: e } })}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                                 bg-indigo-50 text-[#6366f1] border border-indigo-100
                                 hover:bg-indigo-100 transition-colors whitespace-nowrap">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                    {/* <button onClick={() => handleDelete(e.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                                 bg-red-50 text-red-600 border border-red-100
                                 hover:bg-red-100 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default EventsList;