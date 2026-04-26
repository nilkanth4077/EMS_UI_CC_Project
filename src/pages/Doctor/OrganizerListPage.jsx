import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OrganizerList from "./OrganizerList";
import BaseUrl from "../../reusables/BaseUrl";

const FILTER_TABS = ["ALL", "PENDING", "APPROVED", "REJECTED"];

const OrganizerListPage = () => {
  const navigate = useNavigate();
  const [organizers, setOrganizers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (!token || !userString) {
      toast.error("Please login first.");
      navigate("/login");
      return;
    }

    const fetchOrganizers = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/admin/all-organizers`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.statusCode === 200) {
          setOrganizers(response.data.data);
          setFiltered(response.data.data);
        } else {
          toast.error(response.data.message || "Failed to fetch organizers.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong while fetching organizers.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizers();
  }, [navigate]);

  // Filter by tab + search
  useEffect(() => {
    let result = organizers;
    if (activeTab !== "ALL") {
      result = result.filter((o) => o.status === activeTab);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.user?.firstName?.toLowerCase().includes(q) ||
          o.user?.lastName?.toLowerCase().includes(q) ||
          o.user?.email?.toLowerCase().includes(q) ||
          o.organizationName?.toLowerCase().includes(q) ||
          o.city?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [activeTab, search, organizers]);

  const counts = {
    ALL:      organizers.length,
    PENDING:  organizers.filter((o) => o.status === "PENDING").length,
    APPROVED: organizers.filter((o) => o.status === "APPROVED").length,
    REJECTED: organizers.filter((o) => o.status === "REJECTED").length,
  };

  const TAB_COLORS = {
    ALL:      "bg-[#6366f1] text-white border-[#6366f1]",
    PENDING:  "bg-amber-500 text-white border-amber-500",
    APPROVED: "bg-emerald-500 text-white border-emerald-500",
    REJECTED: "bg-red-500 text-white border-red-500",
  };

  const TAB_INACTIVE = {
    ALL:      "text-[#6366f1] border-indigo-200 hover:bg-indigo-50",
    PENDING:  "text-amber-600 border-amber-200 hover:bg-amber-50",
    APPROVED: "text-emerald-600 border-emerald-200 hover:bg-emerald-50",
    REJECTED: "text-red-600 border-red-200 hover:bg-red-50",
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 sm:px-8 py-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">Organizers</h2>
          <p className="text-sm text-[#64748b] mt-0.5">
            Manage organizer applications and accounts
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search organizers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-[#e2e8f0] bg-white text-[#0f172a] placeholder-[#94a3b8]
              focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total",    count: counts.ALL,      color: "from-[#6366f1] to-[#7c3aed]", icon: "🎙️" },
          { label: "Pending",  count: counts.PENDING,  color: "from-amber-400 to-amber-500",  icon: "⏳" },
          { label: "Approved", count: counts.APPROVED, color: "from-emerald-400 to-emerald-500", icon: "✅" },
          { label: "Rejected", count: counts.REJECTED, color: "from-red-400 to-red-500",      icon: "❌" },
        ].map((s) => (
          <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-4 text-white shadow-sm`}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-black">{s.count}</div>
            <div className="text-white/80 text-xs font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-xs font-semibold px-4 py-1.5 rounded-full border transition-all
              ${activeTab === tab ? TAB_COLORS[tab] : `bg-white ${TAB_INACTIVE[tab]}`}`}
          >
            {tab} ({counts[tab]})
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 rounded-full border-4 border-[#6366f1] border-t-transparent animate-spin" />
          <p className="mt-4 text-[#64748b] font-medium text-sm">Loading organizers...</p>
        </div>
      ) : (
        <OrganizerList organizers={filtered} setOrganizers={setOrganizers} />
      )}

    </div>
  );
};

export default OrganizerListPage;