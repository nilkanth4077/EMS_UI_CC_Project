import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OrganizerEvents from "./OrganizerEvents";

const NAV_ITEMS = [
  {
    id: "events",
    label: "My Events",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const OrganizerDashboard = () => {
  const [activeTab, setActiveTab]   = useState("events");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate  = useNavigate();
  const token     = localStorage.getItem("token");
  const userStr   = localStorage.getItem("user");

  if (!token || !userStr) {
    toast.error("Please login first.");
    navigate("/login");
    return null;
  }

  const user = JSON.parse(userStr);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-back flex font-poppins">

      {/* ── Sidebar overlay (mobile) ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed top-0 left-0 h-full w-60 bg-surface border-r border-border z-40
        flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:shrink-0
      `}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-mtext font-semibold text-sm tracking-tight">EventSpark</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
          <p className="text-textMuted text-[10px] uppercase tracking-widest px-3 mb-2 font-medium">
            Menu
          </p>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${activeTab === item.id
                  ? "bg-primary text-white shadow-sm"
                  : "text-textLight hover:bg-surfaceSoft hover:text-mtext"
                }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* User card */}
        <div className="px-3 py-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-surfaceSoft">
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20
                            flex items-center justify-center text-primary font-semibold text-xs shrink-0">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-mtext text-xs font-medium truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-textMuted text-[10px] truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="text-textMuted hover:text-error transition-colors shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-surface border-b border-border px-4 md:px-6 py-3.5
                           flex items-center justify-between gap-4">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center
                       text-textMuted hover:bg-surfaceSoft transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Page title */}
          <div>
            <h1 className="text-mtext font-semibold text-sm md:text-base leading-tight">
              {NAV_ITEMS.find((n) => n.id === activeTab)?.label ?? "Dashboard"}
            </h1>
            <p className="text-textMuted text-xs hidden sm:block">
              Organizer Portal · {user?.firstName} {user?.lastName}
            </p>
          </div>

          {/* Right side — status badge */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium
                             bg-success/10 text-success border border-success/20 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Active Organizer
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto no-scrollbar">
          {activeTab === "events" && <OrganizerEvents />}
        </main>
      </div>
    </div>
  );
};

export default OrganizerDashboard;