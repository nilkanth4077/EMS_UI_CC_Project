import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import BaseUrl from "../../reusables/BaseUrl";

const INITIAL = {
  title:     "",
  details:   "",
  thumbnail: "",
  eventDate: "",
  eventTime: "",
  location:  "",
  type:      "",
  capacity:  "",
  price:     "",
  badge:     "",
  status:    "DRAFT",
};

const inputCls =
  "w-full px-3.5 py-2.5 rounded-lg border border-border bg-surfaceSoft text-mtext text-sm font-poppins " +
  "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-textMuted/50";

const Field = ({ label, icon, required, children }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-xs font-medium text-textMuted uppercase tracking-wider font-poppins">
      <span className="text-primary">{icon}</span>
      {label}
      {required && <span className="text-error ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const CalIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const TitleIcon  = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4h10M7 8h7M5 12h14M5 16h9" /></svg>;
const DescIcon   = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10" /></svg>;
const TimeIcon   = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const PinIcon    = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const TagIcon    = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" /></svg>;
const StarIcon   = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;
const UsersIcon  = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h2a2 2 0 002-2v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1a2 2 0 002 2h2M12 12a4 4 0 100-8 4 4 0 000 8z" /></svg>;
const RupeeIcon  = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6M9 12h6m-6 0l3 4m0 0l3-4M6 8h.01M6 12h.01" /></svg>;
const StatusIcon = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ImgIcon    = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;

const AddEventModal = ({ onClose, onCreated }) => {
  const [form, setForm]       = useState(INITIAL);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const isValid = form.title.trim() && form.eventDate && form.location.trim();

  const handleSubmit = async () => {
    if (!isValid) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
     const dateTime = form.eventTime
      ? `${form.eventDate}T${form.eventTime}:00`
      : `${form.eventDate}T00:00:00`;

      const payload = {
        title:     form.title,
        details:   form.details,
        thumbnail: form.thumbnail,
        date:      form.eventTime
                     ? `${form.eventDate}T${form.eventTime}:00`
                     : `${form.eventDate}T00:00:00`,
        type:      form.type,
        location:  form.location,
        capacity:  form.capacity ? Number(form.capacity) : 0,
        price:     form.price    ? Number(form.price)    : 0,
        badge:     form.badge,
        status:    form.status,
      };

      console.log("Submitting payload:", payload);

      const res = await axios.post(
        `${BaseUrl}/organizer/events/create`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.statusCode === 200 || res.data.statusCode === 201) {
        toast.success("Event created successfully!");
        onCreated(res.data.data);
      }
    } catch {
      toast.error("Failed to create event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-surface w-full max-w-xl rounded-2xl shadow-2xl border border-border
                      font-poppins flex flex-col max-h-[92vh] overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border
                        bg-surfaceSoft rounded-t-2xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20
                            flex items-center justify-center text-primary">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h2 className="text-mtext font-semibold text-sm leading-tight">Create New Event</h2>
              <p className="text-textMuted text-xs">Fill in the event details below</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-textMuted
                       hover:bg-border hover:text-mtext transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="overflow-y-auto no-scrollbar px-6 py-5 space-y-4">
         {/* Title */}
         <Field label="Event Title" required icon={<TitleIcon />}>
           <input name="title" value={form.title} onChange={handleChange}
             className={inputCls} placeholder="e.g. Annual Tech Summit 2025" />
         </Field>

         {/* Thumbnail URL */}
         <Field label="Thumbnail URL" icon={<ImgIcon />}>
           <input name="thumbnail" value={form.thumbnail} onChange={handleChange}
             className={inputCls} placeholder="https://images.unsplash.com/..." />
           {form.thumbnail && (
             <img src={form.thumbnail} alt="preview"
               className="mt-2 w-full h-28 object-cover rounded-lg border border-border" />
           )}
         </Field>

         {/* Details */}
         <Field label="Description" icon={<DescIcon />}>
           <textarea name="details" value={form.details} onChange={handleChange}
             rows={3} className={`${inputCls} resize-none`}
             placeholder="What is this event about?" />
         </Field>

         {/* Date & Time */}
         <div className="grid grid-cols-2 gap-3">
           <Field label="Event Date" required icon={<CalIcon />}>
             <input name="eventDate" type="date" value={form.eventDate} onChange={handleChange}
               className={inputCls} />
           </Field>
           <Field label="Event Time" icon={<TimeIcon />}>
             <input name="eventTime" type="time" value={form.eventTime} onChange={handleChange}
               className={inputCls} />
           </Field>
         </div>

         {/* Venue */}
         <Field label="Venue / Location" required icon={<PinIcon />}>
           <input name="location" value={form.location} onChange={handleChange}
             className={inputCls} placeholder="e.g. SVIT Auditorium, Vasad" />
         </Field>

         {/* Type & Badge */}
         <div className="grid grid-cols-2 gap-3">
           <Field label="Type / Category" icon={<TagIcon />}>
             <select name="type" value={form.type} onChange={handleChange}
               className={`${inputCls} cursor-pointer`}>
               <option value="">Select type</option>
               <option value="Tech">Tech</option>
               <option value="Cultural">Cultural</option>
               <option value="Conference">Conference</option>
               <option value="Networking">Networking</option>
               <option value="Workshop">Workshop</option>
               <option value="Sports">Sports</option>
             </select>
           </Field>
           <Field label="Badge" icon={<StarIcon />}>
             <select name="badge" value={form.badge} onChange={handleChange}
               className={`${inputCls} cursor-pointer`}>
               <option value="">None</option>
               <option value="Featured">Featured</option>
               <option value="Hot">Hot</option>
               <option value="Selling Fast">Selling Fast</option>
               <option value="New">New</option>
             </select>
           </Field>
         </div>

         {/* Capacity & Price */}
         <div className="grid grid-cols-2 gap-3">
           <Field label="Capacity" icon={<UsersIcon />}>
             <input name="capacity" type="number" min={1} value={form.capacity} onChange={handleChange}
               className={inputCls} placeholder="e.g. 500" />
           </Field>
           <Field label="Price (₹)" icon={<RupeeIcon />}>
             <input name="price" type="number" min={0} value={form.price} onChange={handleChange}
               className={inputCls} placeholder="0 for Free" />
           </Field>
         </div>

         {/* Status */}
         <Field label="Status" icon={<StatusIcon />}>
           <select name="status" value={form.status} onChange={handleChange}
             className={`${inputCls} cursor-pointer`}>
             <option value="DRAFT">DRAFT</option>
             <option value="PUBLISHED">PUBLISHED</option>
           </select>
         </Field>

         <p className="text-textMuted text-xs">
           <span className="text-error">*</span> Required fields
         </p>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-border bg-surfaceSoft rounded-b-2xl
                        flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => setForm(INITIAL)}
            className="text-xs text-textMuted hover:text-mtext transition-colors"
          >
            Clear form
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-textLight border border-border
                         hover:bg-border transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isValid || loading}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-primary
                         hover:bg-primaryDark transition-colors disabled:opacity-40 disabled:cursor-not-allowed
                         flex items-center gap-2 min-w-[120px] justify-center"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Event
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEventModal;