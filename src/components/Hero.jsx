import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllEvents } from "../services/doctorApi";
import { Footer } from "./Footer";

// const MOCK_EVENTS = [
//   {
//     id: 1,
//     title: "TEDx SVIT 2025",
//     category: "Conference",
//     date: "May 12, 2025",
//     time: "10:00 AM",
//     venue: "SVIT Auditorium, Vasad",
//     image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
//     price: "Free",
//     attendees: 320,
//     badge: "Featured",
//   },
//   {
//     id: 2,
//     title: "Startup Pitch Night",
//     category: "Networking",
//     date: "May 18, 2025",
//     time: "6:30 PM",
//     venue: "PDEU Innovation Hub, Gandhinagar",
//     image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80",
//     price: "₹199",
//     attendees: 180,
//     badge: "Hot",
//   },
//   {
//     id: 3,
//     title: "Cultural Fest — Aaveg",
//     category: "Cultural",
//     date: "May 24, 2025",
//     time: "5:00 PM",
//     venue: "LD Engineering College, Ahmedabad",
//     image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
//     price: "₹99",
//     attendees: 850,
//     badge: "Selling Fast",
//   },
//   {
//     id: 4,
//     title: "Hackathon 36hrs",
//     category: "Tech",
//     date: "Jun 1, 2025",
//     time: "9:00 AM",
//     venue: "Nirma University, Ahmedabad",
//     image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
//     price: "Free",
//     attendees: 240,
//     badge: "New",
//   },
// ];

const CATEGORIES = ["All", "Tech", "Cultural", "Conference", "Networking"];

const badgeColors = {
  Featured: "bg-amber-100 text-amber-800 border border-amber-200",
  Hot: "bg-red-100 text-red-700 border border-red-200",
  "Selling Fast": "bg-orange-100 text-orange-700 border border-orange-200",
  New: "bg-emerald-100 text-emerald-700 border border-emerald-200",
};

const categoryColors = {
  Tech: "bg-blue-50 text-blue-700",
  Cultural: "bg-purple-50 text-purple-700",
  Conference: "bg-cyan-50 text-cyan-700",
  Networking: "bg-teal-50 text-teal-700",
};

function CalendarIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2"/>
      <path d="M16 2v4M8 2v4M3 10h18" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" strokeWidth="2"/>
      <circle cx="12" cy="9" r="2.5" strokeWidth="2"/>
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="2"/>
      <circle cx="9" cy="7" r="4" strokeWidth="2"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" strokeWidth="2"/>
      <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function EventCard({ event, featured = false }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const handleRegister = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate(`/events/${event.id}`);
    } else {
      navigate("/login", { state: { from: `/events/${event.id}` } });
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative bg-white rounded-2xl overflow-hidden border border-slate-100 cursor-pointer
        transition-all duration-300 ease-out
        ${hovered ? "shadow-2xl shadow-slate-200 -translate-y-1" : "shadow-md shadow-slate-100"}
        ${featured ? "md:col-span-2 md:flex" : "flex flex-col"}
      `}
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${featured ? "md:w-1/2 h-52 md:h-auto" : "h-44"}`}>
        <img
          src={event.thumbnail}
          alt={event.title}
          className={`w-full h-full object-cover transition-transform duration-500
            ${hovered ? "scale-105" : "scale-100"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Badge */}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm ${badgeColors[event.badge]}`}>
          {event.badge}
        </span>

        {/* Price */}
        <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full bg-white/90 text-slate-800 backdrop-blur-sm">
          {event.price === 0 ? "Free" : `₹${event.price}`}
        </span>
      </div>

      {/* Content */}
      <div className={`flex flex-col justify-between p-4 ${featured ? "md:w-1/2 md:p-6" : "flex-1"}`}>
        <div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[event.type] || "bg-slate-100 text-slate-600"}`}>
            {event.type}
          </span>

          <h3 className={`font-bold text-slate-900 mt-3 mb-3 leading-snug group-hover:text-indigo-700 transition-colors
            ${featured ? "text-xl md:text-2xl" : "text-base"}`}>
            {event.title}
          </h3>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CalendarIcon />
              <span>
                {new Date(event?.date).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <MapPinIcon />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <UsersIcon />
              <span>{event.capacity.toLocaleString()} registered</span>
            </div>
          </div>
        </div>

        <button
          className={`mt-4 w-full flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200
            ${featured
              ? "py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
              : "py-2.5 bg-slate-50 hover:bg-indigo-600 hover:text-white text-slate-700 text-sm border border-slate-200 hover:border-indigo-600"
            }`}
          onClick={() => {
            const token = localStorage.getItem("token");

            if (token) {
              navigate(`/events/${event.id}`, {
                state: { event }
              });
            } else {
              navigate("/login", {
                state: { from: `/events/${event.id}` } // 👈 so you can redirect back after login
              });
            }
          }}
        >
          Register now
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
}

export default function Hero() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);
  const [events, setEvents] = useState([]);
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const role = user?.role || "GUEST";
  const isUser = role === "USER";
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
        const response = await getAllEvents();
        // console.log("Response:", response);

        if (response.statusCode === 200) {
            const publishedEvents = (response.data || []).filter(
                (e) => e?.status === "PUBLISHED"
            );

            setEvents(publishedEvents);
        } else {
            toast.error(response.message || "Failed to fetch events.");
        }
      } catch (error) {
          console.error(error);
          toast.error(error.response?.data?.message || "Failed to fetch events.");
      }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const filtered = events.filter((e) => {
    const matchCat = activeCategory === "All" || e.type === activeCategory;
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
    <div className="min-h-screen bg-slate-50 font-sans border-8 border-slate-100">

      {/* Hero */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-violet-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

        <div className={`relative w-full px-4 sm:px-8 pt-16 pb-14 transition-all duration-700 ease-out
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
            <div className="flex flex-col lg:flex-row items-center gap-12">

                {/* LEFT — text content */}
                <div className="flex-1 w-full">
                <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                    {events.length} events happening near you
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.08] tracking-tight">
                    Find events that{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                    move you.
                    </span>
                </h1>

                <p className="mt-4 text-slate-500 text-base sm:text-lg leading-relaxed max-w-lg">
                    Discover college fests, tech talks, hackathons & more — all in one place. Powered by students, for students.
                </p>

                {/* Search bar */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg">
                    <div className="relative flex-1">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <SearchIcon />
                    </span>
                    <input
                        type="text"
                        placeholder="Search events or venues..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                    />
                    </div>
                    <button className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-colors shrink-0">
                    <SearchIcon />
                    Search
                    </button>
                </div>

                {/* Stats */}
                <div className="mt-10 flex flex-wrap gap-8">
                    {[
                    { value: "200+", label: "Events monthly" },
                    { value: "50k+", label: "Students joined" },
                    { value: "120+", label: "Colleges" },
                    ].map((s) => (
                    <div key={s.label}>
                        <div className="text-2xl font-black text-slate-900">{s.value}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                    </div>
                    ))}
                </div>
                </div>

                {/* RIGHT — featured event showcase */}
                <div className="w-full lg:w-[480px] shrink-0">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-indigo-100 group">
                  {events.length > 0 && (
                    <img
                    src={events[0].thumbnail}
                    alt={events[0].title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColors[events[0]?.badge]}`}>
                        {events[0]?.badge}
                    </span>
                    <h3 className="text-white font-bold text-xl mt-2">{events[0]?.title}</h3>
                    <div className="flex items-center gap-3 mt-2 text-white/70 text-xs">
                        <span className="flex items-center gap-1"><CalendarIcon />
                          {new Date(events[0]?.date).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><MapPinIcon />{events[0]?.location}</span>
                    </div>
                    </div>
                    <div className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full bg-white/90 text-slate-800">
                    {events[0]?.price === 0 ? "Free" : `₹${events[0]?.price}`}
                    </div>
                </div>

                {/* Mini cards */}
                <div className="grid grid-cols-3 gap-3 mt-3">
                    {events.slice(1, 4).map((event) => (
                    <div key={event.id} className="relative rounded-xl overflow-hidden shadow-md group cursor-pointer">
                        <img src={event.thumbnail} alt={event.title} className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-2">
                        <p className="text-white text-xs font-semibold leading-tight line-clamp-2">{event.title}</p>
                        <p className="text-white/60 text-[10px] mt-0.5">
                          {new Date(event?.date).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                        </div>
                    </div>
                    ))}
                </div>

                {/* Social proof */}
                <div className="mt-3 flex items-center gap-3 bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm">
                    <div className="flex -space-x-2">
                    {["#6366f1","#8b5cf6","#ec4899","#f59e0b"].map((c, i) => (
                        <div key={i} className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold" style={{ background: c }}>
                        {String.fromCharCode(65 + i)}
                        </div>
                    ))}
                    </div>
                    <p className="text-xs text-slate-500 flex-1">
                    <span className="font-semibold text-slate-800">1,590+ students</span> registered this week
                    </p>
                    <span className="text-lg">🎉</span>
                </div>
                </div>

            </div>
        </div>
      </section>

      {/* ── Organizer CTA Banner ── */}
      {isUser && (
       <section className="w-full px-4 sm:px-8 py-6">
         <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#7c3aed] px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
           
           {/* Decorative circles */}
           <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full pointer-events-none" />
           <div className="absolute -bottom-8 left-1/3 w-32 h-32 bg-white/10 rounded-full pointer-events-none" />

           {/* Left — icon + text */}
           <div className="relative flex items-center gap-5">
             <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center shrink-0">
               <span className="text-2xl">🎙️</span>
             </div>
             <div>
               <h3 className="text-white font-black text-xl leading-tight">
                 Want to be an Organizer?
               </h3>
               <p className="text-white/70 text-sm mt-1 max-w-md">
                 Host your own events, manage registrations, and reach thousands of students across Gujarat — all from one dashboard.
               </p>
             </div>
           </div>

           {/* Right — perks + CTA */}
           <div className="relative flex flex-col sm:items-end gap-3 shrink-0">
             <div className="flex flex-wrap gap-2">
               {["Free to apply", "Easy setup", "Real-time analytics"].map((perk) => (
                 <span key={perk} className="text-xs font-semibold bg-white/15 text-white px-3 py-1 rounded-full">
                   ✓ {perk}
                 </span>
               ))}
             </div>
             <button
               onClick={() => navigate("/organizer-apply")}
               className="mt-1 flex items-center gap-2 bg-white text-[#6366f1] font-bold text-sm px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
             >
               Apply now
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
             </button>
           </div>

         </div>
       </section>
      )}

      {/* Events section */}
      <section className="w-full px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Latest events</h2>
            <p className="text-sm text-slate-500 mt-1">Happening in and around Gujarat</p>
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all duration-200
                  ${activeCategory === cat
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cards grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <div className="text-5xl mb-4">🎪</div>
            <p className="font-semibold">No events found</p>
            <p className="text-sm mt-1">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((event, i) => (
              <EventCard key={event.id} event={event} featured={i === 0} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 text-center">
          <button className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-400 px-6 py-3 rounded-xl transition-all bg-white hover:bg-indigo-50">
            View all events
            <ArrowRightIcon />
          </button>
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
}