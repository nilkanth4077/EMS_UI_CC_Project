import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BaseUrl from "../../reusables/BaseUrl";
import { Footer } from "../../components/Footer";
import Navbar from "../../components/Navbar";

const formatDate = (date) =>
  new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const EventCard = ({ event, type }) => {
  const isPast = type === "past";

  return (
    <div className={`rounded-xl border p-4 shadow-sm transition 
        ${isPast ? "bg-slate-100 opacity-80" : "bg-white hover:shadow-md"}`}>

      <img
        src={event?.thumbnail}
        alt={event?.title}
        className="w-full h-40 object-cover rounded-lg mb-3"
      />

      <h3 className="font-bold text-slate-900">{event?.title}</h3>

      <p className="text-sm text-slate-500 mt-1">
        📍 {event?.location}
      </p>

      <p className="text-sm text-slate-500">
        📅 {formatDate(event?.date)}
      </p>

      <div className="mt-3 flex justify-between items-center">
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-indigo-50 text-indigo-600">
          {event?.type}
        </span>

        <span className="text-xs text-slate-500">
          {event?.price === 0 ? "Free" : `₹${event?.price}`}
        </span>
      </div>

      {isPast && (
        <p className="text-xs text-red-500 mt-2 font-semibold">
          Event Completed
        </p>
      )}
    </div>
  );
};

export default function MyEvents() {

  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyEvents = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${BaseUrl}/user/my-events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.statusCode === 200) {
        setUpcoming(res.data.data.upcoming || []);
        setPast(res.data.data.past || []);
      } else {
        toast.error(res.data.message);
      }

    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch your events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading your events...
      </div>
    );
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-slate-50 px-4 sm:px-8 py-10">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">My Events</h1>
        <p className="text-sm text-slate-500 mt-1">
          Your registrations and activity
        </p>
      </div>

      {/* UPCOMING */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          🎟️ Registered & Upcoming
        </h2>

        {upcoming.length === 0 ? (
          <p className="text-slate-400 text-sm">No upcoming events</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} type="upcoming" />
            ))}
          </div>
        )}
      </section>

      {/* HISTORY */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          📜 Event History
        </h2>

        {past.length === 0 ? (
          <p className="text-slate-400 text-sm">No past events</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {past.map((event) => (
              <EventCard key={event.id} event={event} type="past" />
            ))}
          </div>
        )}
      </section>

    </div>
    <Footer />
    </>
  );
}