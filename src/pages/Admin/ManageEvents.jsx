import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EventsList from "./EventsList";
import { getAllEvents } from "../../services/doctorApi";

const FILTER_TABS = ["ALL", "DRAFT", "PUBLISHED"];

const ManageEvents = () => {
  const navigate    = useNavigate();
  const [events,    setEvents]    = useState([]);
  const [filtered,  setFiltered]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [search,    setSearch]    = useState("");

  useEffect(() => {
    const token      = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    if (!token || !userString) {
      toast.error("Please login first.");
      navigate("/login");
      return;
    }
    const fetchEvents = async () => {
      try {
        const response = await getAllEvents();
        if (Array.isArray(response)) {
          setEvents(response);
        } else if (response?.statusCode === 200) {
          setEvents(response.data ?? []);
        } else {
          toast.error(response?.message || "Failed to fetch events.");
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch events.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [navigate]);

  useEffect(() => {
    let result = events;
    if (activeTab !== "ALL") {
      result = result.filter((e) => e.status === activeTab);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.type?.toLowerCase().includes(q) ||
          e.location?.toLowerCase().includes(q) ||
          e.host?.firstName?.toLowerCase().includes(q) ||
          e.host?.lastName?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [activeTab, search, events]);

  const counts = {
    ALL:       events.length,
    DRAFT:     events.filter((e) => e.status === "DRAFT").length,
    PUBLISHED: events.filter((e) => e.status === "PUBLISHED").length,
  };

  const TAB_ACTIVE = {
    ALL:       "bg-[#6366f1] text-white border-[#6366f1]",
    DRAFT:     "bg-slate-500 text-white border-slate-500",
    PUBLISHED: "bg-emerald-500 text-white border-emerald-500",
  };

  const TAB_INACTIVE = {
    ALL:       "text-[#6366f1] border-indigo-200 hover:bg-indigo-50",
    DRAFT:     "text-slate-600 border-slate-200 hover:bg-slate-50",
    PUBLISHED: "text-emerald-600 border-emerald-200 hover:bg-emerald-50",
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] px-3 sm:px-6 lg:px-8 py-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight">Events</h2>
          <p className="text-xs sm:text-sm text-[#64748b] mt-0.5">Manage all platform events</p>
        </div>
        <div className="relative w-full sm:w-64">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input type="text" placeholder="Search events..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-[#e2e8f0] bg-white
                       text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2
                       focus:ring-[#6366f1] focus:border-transparent transition" />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Total",     count: counts.ALL,       grad: "from-[#6366f1] to-[#7c3aed]",       icon: "🎪" },
          { label: "Draft",     count: counts.DRAFT,     grad: "from-slate-400 to-slate-500",         icon: "📝" },
          { label: "Published", count: counts.PUBLISHED, grad: "from-emerald-400 to-emerald-500",     icon: "🌐" },
        ].map((s) => (
          <div key={s.label} className={`bg-gradient-to-br ${s.grad} rounded-2xl p-3 sm:p-4 text-white shadow-sm`}>
            <div className="text-xl sm:text-2xl mb-1">{s.icon}</div>
            <div className="text-xl sm:text-2xl font-black leading-none">{s.count}</div>
            <div className="text-white/75 text-xs mt-0.5 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-4">
        {FILTER_TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`text-xs font-semibold px-4 py-1.5 rounded-full border transition-all
              ${activeTab === tab ? TAB_ACTIVE[tab] : `bg-white ${TAB_INACTIVE[tab]}`}`}>
            {tab} ({counts[tab]})
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 rounded-full border-4 border-[#6366f1] border-t-transparent animate-spin" />
          <p className="mt-4 text-[#64748b] font-medium text-sm">Loading events...</p>
        </div>
      ) : (
        <EventsList events={filtered} setEvents={setEvents} />
      )}
    </div>
  );
};

export default ManageEvents;