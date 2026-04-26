import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BaseUrl from "../../reusables/BaseUrl";
import AddEventModal from "./AddEventModal";
import { useNavigate } from "react-router-dom";

const STATUS_STYLES = {
  PUBLISHED: "bg-success/10 text-success border border-success/20",
  DRAFT:     "bg-warning/10 text-warning border border-warning/20",
  CANCELLED: "bg-error/10 text-error border border-error/20",
  COMPLETED: "bg-primary/10 text-primary border border-primary/20",
};

const STATUS_DOT = {
  PUBLISHED: "bg-success",
  DRAFT:     "bg-warning",
  CANCELLED: "bg-error",
  COMPLETED: "bg-primary",
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

const SkeletonRow = () => (
  <tr className="border-t border-border animate-pulse">
    {[...Array(6)].map((_, i) => (
      <td key={i} className="px-5 py-4">
        <div className="h-3 bg-border rounded w-3/4" />
      </td>
    ))}
  </tr>
);

const OrganizerEvents = () => {
  const [events, setEvents]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch]       = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BaseUrl}/organizer/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched events:", res.data);
      if (res.data.statusCode === 200) {
        setEvents(res.data.data ?? []);
      }
    } catch {
      toast.error("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const filtered = events.filter((e) =>
    e.title?.toLowerCase().includes(search.toLowerCase()) ||
    e.venue?.toLowerCase().includes(search.toLowerCase()) ||
    e.city?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: "Total",     value: events.length,                                         color: "text-mtext"  },
    { label: "Published", value: events.filter((e) => e.status === "PUBLISHED").length, color: "text-success" },
    { label: "Draft",     value: events.filter((e) => e.status === "DRAFT").length,     color: "text-warning" },
    { label: "Cancelled", value: events.filter((e) => e.status === "CANCELLED").length, color: "text-error"   },
  ];

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {stats.map((s) => (
          <div key={s.label}
            className="bg-surface border border-border rounded-xl px-4 py-3.5 flex flex-col gap-1">
            <span className="text-textMuted text-xs font-medium">{s.label}</span>
            <span className={`text-2xl font-bold ${s.color}`}>{loading ? "—" : s.value}</span>
          </div>
        ))}
      </div>

      {/* ── Toolbar ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events…"
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-border bg-surface
                       text-mtext placeholder:text-textMuted font-poppins
                       focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>

        {/* Add Event */}
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm
                     font-semibold hover:bg-primaryDark transition-colors shadow-sm shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add Event
        </button>
      </div>

      {/* ── Desktop Table ────────────────────────────────────────── */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-border shadow-sm">
        <table className="min-w-full bg-surface font-poppins text-sm">
          <thead>
            <tr className="bg-primary text-white">
              {["#", "Event", "Date", "Venue", "Capacity", "Status", "Actions"].map((h) => (
                <th key={h} className="px-5 py-3.5 text-left font-medium text-xs uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {loading
              ? [...Array(4)].map((_, i) => <SkeletonRow key={i} />)
              : filtered.length === 0
                ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-surfaceSoft border border-border
                                        flex items-center justify-center">
                          <svg className="w-5 h-5 text-textMuted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-textMuted text-sm">
                          {search ? "No events match your search" : "No events yet — create your first one!"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )
                : filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-surfaceSoft transition-colors duration-150">
                    <td className="px-5 py-3.5 text-textMuted font-medium">{item.id}</td>

                    <td className="px-5 py-3.5">
                      <p className="text-mtext font-medium leading-tight">{item.title}</p>
                      {item.category && (
                        <p className="text-textMuted text-xs mt-0.5">{item.category}</p>
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-textLight whitespace-nowrap">
                      {formatDate(item.date)}
                    </td>

                    <td className="px-5 py-3.5">
                      <p className="text-mtext">{item.location ?? "—"}</p>
                      {item.city && (
                        <p className="text-textMuted text-xs mt-0.5">{item.city}</p>
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-textLight">{item.capacity ?? "—"}</td>

                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                                        text-xs font-medium ${STATUS_STYLES[item.status] ?? "bg-border text-textMuted"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[item.status] ?? "bg-textMuted"}`} />
                        {item.status ?? "—"}
                      </span>
                    </td>

                    <td>
                     <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border">
                      <button
                        onClick={() => navigate(`/organizer-dashboard/events/${item.id}`, { state: { event: item } })}
                        className="flex-1 min-w-[80px] py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary
                                   border border-primary/20 hover:bg-primary hover:text-white transition-colors text-center"
                      >
                        Details
                      </button>
                    </div>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>

      {/* ── Mobile Cards ─────────────────────────────────────────── */}
      <div className="md:hidden flex flex-col gap-3">
        {loading
          ? [...Array(3)].map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-4 animate-pulse space-y-3">
              <div className="h-4 bg-border rounded w-2/3" />
              <div className="h-3 bg-border rounded w-1/2" />
              <div className="h-3 bg-border rounded w-1/3" />
            </div>
          ))
          : filtered.length === 0
            ? (
              <div className="flex flex-col items-center justify-center py-20 gap-2">
                <p className="text-textMuted text-sm">
                  {search ? "No events match your search" : "No events yet — tap Add Event!"}
                </p>
              </div>
            )
            : filtered.map((item) => (
              <div key={item.id}
                className="bg-surface border border-border rounded-xl p-4 shadow-sm space-y-3">

                {/* Title + Status */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-mtext font-semibold text-sm leading-tight">{item.title}</p>
                    {item.category && (
                      <p className="text-textMuted text-xs mt-0.5">{item.category}</p>
                    )}
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                                    text-xs font-medium shrink-0 ${STATUS_STYLES[item.status] ?? "bg-border text-textMuted"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[item.status] ?? "bg-textMuted"}`} />
                    {item.status ?? "—"}
                  </span>
                </div>

                {/* Meta row */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-textLight bg-surfaceSoft
                                  rounded-lg px-3 py-2">
                    <svg className="w-3.5 h-3.5 text-textMuted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="truncate">{formatDate(item.eventDate)}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-textLight bg-surfaceSoft
                                  rounded-lg px-3 py-2">
                    <svg className="w-3.5 h-3.5 text-textMuted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17 20h2a2 2 0 002-2v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1a2 2 0 002 2h2M12 12a4 4 0 100-8 4 4 0 000 8z" />
                    </svg>
                    <span>{item.capacity ?? "—"}</span>
                  </div>
                </div>

                {/* Venue */}
                {(item.venue || item.city) && (
                  <div className="flex items-center gap-1.5 text-xs text-textLight bg-surfaceSoft
                                  rounded-lg px-3 py-2">
                    <svg className="w-3.5 h-3.5 text-textMuted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">
                      {[item.venue, item.city].filter(Boolean).join(", ")}
                    </span>
                  </div>
                )}
              </div>
            ))
        }
      </div>

      {/* ── Add Event Modal ──────────────────────────────────────── */}
      {showModal && (
        <AddEventModal
          onClose={() => setShowModal(false)}
          onCreated={(newEvent) => {
            setEvents((prev) => [newEvent, ...prev]);
            setShowModal(false);
          }}
        />
      )}
    </>
  );
};

export default OrganizerEvents;